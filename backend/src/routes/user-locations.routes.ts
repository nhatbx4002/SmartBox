import { Router } from 'express';
import { CompartmentAvailability, LocationStatus } from '../generated/prisma';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const locations = await prisma.location.findMany({
      where: { status: LocationStatus.ACTIVE },
      include: {
        cabinets: {
          include: {
            compartments: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const result = locations.map((location) => ({
      id: location.id,
      name: location.name,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      googlePlaceId: location.googlePlaceId,
      mapImageUrl: location.mapImageUrl,
      availableCount: location.cabinets.reduce(
        (sum, cabinet) =>
          sum + cabinet.compartments.filter((compartment) => compartment.status === CompartmentAvailability.AVAILABLE).length,
        0,
      ),
      totalCount: location.cabinets.reduce((sum, cabinet) => sum + cabinet.compartments.length, 0),
    }));

    res.json({ data: result });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const location = await prisma.location.findUnique({
      where: { id: req.params.id },
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

    const result = {
      ...location,
      cabinets: location.cabinets.map((cabinet) => ({
        id: cabinet.id,
        name: cabinet.name,
        status: cabinet.status,
        lastHeartbeatAt: cabinet.lastHeartbeatAt,
        compartments: cabinet.compartments.map((compartment) => ({
          id: compartment.id,
          name: compartment.name,
          size: compartment.size,
          status: compartment.status,
          lockStatus: compartment.realtimeStatus?.lockStatus ?? 'UNKNOWN',
          doorStatus: compartment.realtimeStatus?.doorStatus ?? 'UNKNOWN',
        })),
      })),
    };

    res.json({ data: result });
  }),
);

export default router;
