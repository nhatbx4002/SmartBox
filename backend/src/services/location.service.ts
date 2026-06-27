import { CompartmentAvailability, CompartmentSize, LocationStatus } from '../generated/prisma';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getNearbyLocations(userLat?: number, userLng?: number) {
  const locations = await prisma.location.findMany({
    where: { status: LocationStatus.ACTIVE },
    include: {
      cabinets: {
        include: { compartments: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  const result = locations
    .map((location) => {
      const distance =
        userLat !== undefined && userLng !== undefined &&
        !isNaN(userLat) && !isNaN(userLng) &&
        location.latitude && location.longitude
          ? haversineDistance(userLat, userLng, location.latitude, location.longitude)
          : null;

      let availableSmall = 0;
      let availableLarge = 0;
      let totalSmall = 0;
      let totalLarge = 0;
      let onlineCabinets = 0;

      for (const cabinet of location.cabinets) {
        if (cabinet.status === 'ACTIVE') onlineCabinets++;
        for (const compartment of cabinet.compartments) {
          if (compartment.size === CompartmentSize.SMALL) {
            totalSmall++;
            if (compartment.status === CompartmentAvailability.AVAILABLE) availableSmall++;
          } else if (compartment.size === CompartmentSize.LARGE) {
            totalLarge++;
            if (compartment.status === CompartmentAvailability.AVAILABLE) availableLarge++;
          }
        }
      }

      return {
        id: location.id,
        name: location.name,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        mapImageUrl: location.mapImageUrl,
        distance: distance !== null ? Math.round(distance * 10) / 10 : null,
        availableSmall,
        availableLarge,
        availableCount: availableSmall + availableLarge,
        totalSmall,
        totalLarge,
        totalCount: totalSmall + totalLarge,
        onlineCabinets,
        status: onlineCabinets > 0 ? 'online' : 'offline',
      };
    })
    .sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

  return result;
}

export async function getLocationDetail(id: string) {
  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      cabinets: {
        include: {
          compartments: { include: { realtimeStatus: true } },
        },
        orderBy: { name: 'asc' },
      },
    },
  });
  if (!location) throw NotFoundError('Location not found');

  const HEARTBEAT_TIMEOUT = parseInt(process.env.HEARTBEAT_TIMEOUT || '90', 10);
  const now = new Date();
  const timeoutMs = HEARTBEAT_TIMEOUT * 1000;

  return {
    id: location.id,
    name: location.name,
    address: location.address,
    latitude: location.latitude,
    longitude: location.longitude,
    mapImageUrl: location.mapImageUrl,
    status: location.status,
    cabinets: location.cabinets.map((cabinet) => {
      const isOnline =
        cabinet.status === 'ACTIVE' &&
        cabinet.lastHeartbeatAt !== null &&
        now.getTime() - cabinet.lastHeartbeatAt.getTime() < timeoutMs;

      return {
        id: cabinet.id,
        name: cabinet.name,
        status: cabinet.status,
        isOnline,
        lastHeartbeatAt: cabinet.lastHeartbeatAt,
        compartments: cabinet.compartments.map((compartment) => ({
          id: compartment.id,
          name: compartment.name,
          size: compartment.size,
          status: compartment.status,
        })),
      };
    }),
  };
}
