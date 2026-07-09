import {LocationStatus, Prisma, CabinetStatus, RentalStatus} from '../generated/prisma'
import {BadRequestError, NotFoundError} from '../lib/errors'
import {prisma} from '../lib/prisma'

const ONLINE_THRESHOLD_SECONDS = 60;

function isCabinetOnline(cabinet: { status: CabinetStatus; lastHeartbeatAt: Date | null }) {
    const threshold = new Date(Date.now() - ONLINE_THRESHOLD_SECONDS * 1000);
    return cabinet.status === CabinetStatus.ACTIVE
        && !!cabinet.lastHeartbeatAt
        && cabinet.lastHeartbeatAt >= threshold;
}

function haversineDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


export async function listLocation(status?: LocationStatus){
    return prisma.location.findMany({
        where: status ? { status } : {},
        include: {_count: {select: { cabinets: true }}},
        orderBy: {name:'asc'},
    });
}

export async function hasActiveRentalInLocation(locationId: string): Promise<boolean> {
    const count = await prisma.rental.count({
        where: {
            status: { in: [RentalStatus.PENDING, RentalStatus.ACTIVE] },
            compartment: { cabinet: { locationId } },
        },
    });
    return count > 0;
}

export async function getLocation(id: string){
    const location = await prisma.location.findUnique({where: {id}});
    if(!location) throw new NotFoundError('Location not found!');
    return location;
}

export async function getPublicLocations(lat?: number, lng?: number) {
    const locations = await prisma.location.findMany({
        where: { status: LocationStatus.ACTIVE },
        include: {
            cabinets: {
                where: { status: { in: [CabinetStatus.ACTIVE, CabinetStatus.OFFLINE] } },
                include: { compartments: { where: { deletedAt: null }, select: { size: true, status: true } } },
            },
        },
        orderBy: { name: 'asc' },
    });

    return locations.map((loc) => {
        const onlineCabs = loc.cabinets.filter(isCabinetOnline);
        const onlineCabinets = onlineCabs.length;

        const allComps = loc.cabinets.flatMap((c) => c.compartments);
        const onlineComps = onlineCabs.flatMap((c) => c.compartments);

        const totalSmall = allComps.filter((c) => c.size === 'SMALL').length;
        const totalLarge = allComps.filter((c) => c.size === 'LARGE').length;
        const availableSmall = onlineComps.filter((c) => c.size === 'SMALL' && c.status === 'AVAILABLE').length;
        const availableLarge = onlineComps.filter((c) => c.size === 'LARGE' && c.status === 'AVAILABLE').length;

        const distance = (lat !== undefined && lng !== undefined && loc.latitude !== null && loc.longitude !== null)
            ? Math.round(haversineDistanceKm(lat, lng, loc.latitude, loc.longitude) * 10) / 10
            : null;

        return {
            id: loc.id,
            name: loc.name,
            address: loc.address,
            latitude: loc.latitude,
            longitude: loc.longitude,
            mapImageUrl: loc.mapImageUrl,
            distance,
            availableSmall,
            availableLarge,
            availableCount: availableSmall + availableLarge,
            totalSmall,
            totalLarge,
            totalCount: totalSmall + totalLarge,
            onlineCabinets,
            status: onlineCabinets > 0 ? 'online' : 'offline',
        };
    });
}

export async function getPublicLocationDetail(id: string){
    const location = await prisma.location.findFirst({
        where: {id, status: LocationStatus.ACTIVE},
        include: {
            cabinets: {
                where: { status: { in: [CabinetStatus.ACTIVE, CabinetStatus.OFFLINE] } },
                include: {
                    compartments: { where: { deletedAt: null }, select: {id: true, name: true, size: true, status: true} },
                    _count: {select: {compartments: { where: { deletedAt: null } }}},
                },
            },
        },
    });
    if(!location) throw new NotFoundError('Location not found!');

    return {
        ...location,
        cabinets: location.cabinets.map((c) => ({ ...c, isOnline: isCabinetOnline(c) })),
    };
}

export async function createLocation(data: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    mapImageUrl?: string;
    status?: LocationStatus;
}) {
    return prisma.location.create({ data });
}

export async function updateLocation(id: string, data: {name?:string , address?: string , latitude?: number, longitude?: number, mapImageUrl?: string}) {
    const location = await prisma.location.findUnique({where: {id}});
    if(!location) throw new NotFoundError('Location not found!');

    return prisma.location.update({where: {id} , data});
}

export async function deactivateLocation(id: string) {
    const location = await prisma.location.findUnique({ where: { id } });
    if (!location) throw new NotFoundError('Location not found!');

    if (await hasActiveRentalInLocation(id)) {
        throw new BadRequestError('Cannot deactivate location: there are active rentals in this location');
    }

    const cabinetIds = (await prisma.cabinet.findMany({
        where: { locationId: id, status: { in: [CabinetStatus.ACTIVE, CabinetStatus.OFFLINE] } },
        select: { id: true },
    })).map(c => c.id);

    await prisma.$transaction(async (tx) => {
        await tx.location.update({ where: { id }, data: { status: LocationStatus.INACTIVE } });
        if (cabinetIds.length > 0) {
            await tx.cabinet.updateMany({
                where: { id: { in: cabinetIds } },
                data: { status: CabinetStatus.INACTIVE, configVersion: { increment: 1 } },
            });
        }
    });

    return { cabinetIds, ok: true };
}

export async function hardDeleteLocation(id: string) {
    const location = await prisma.location.findUnique({ where: { id } });
    if (!location) throw new NotFoundError('Location not found!');

    const cabinetIds = (await prisma.cabinet.findMany({
        where: { locationId: id },
        select: { id: true },
    })).map(c => c.id);

    const rentalCount = cabinetIds.length > 0
        ? await prisma.rental.count({ where: { compartment: { cabinetId: { in: cabinetIds } } } })
        : 0;
    if (rentalCount > 0) throw new BadRequestError('Location đã có lịch sử thuê, chỉ có thể ngưng hoạt động');

    await prisma.$transaction(async (tx) => {
        if (cabinetIds.length > 0) {
            await tx.compartment.deleteMany({ where: { cabinetId: { in: cabinetIds } } });
            await tx.adminCabinet.deleteMany({ where: { cabinetId: { in: cabinetIds } } });
            await tx.mcpDevice.deleteMany({ where: { cabinetId: { in: cabinetIds } } });
            await tx.cabinet.deleteMany({ where: { id: { in: cabinetIds } } });
        }

        await tx.location.delete({ where: { id } });
    });

    return { ok: true };
}