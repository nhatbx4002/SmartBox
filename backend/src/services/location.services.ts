import {LocationStatus, Prisma, CabinetStatus, RentalStatus} from '../generated/prisma'
import {BadRequestError, NotFoundError} from '../lib/errors'
import {prisma} from '../lib/prisma'


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

export async function getPublicLocations(){
    return prisma.location.findMany({
        where: {status: LocationStatus.ACTIVE},
        orderBy: { name: 'asc'},
    });
}

export async function getPublicLocationDetail(id: string){
    const location = await prisma.location.findFirst({
        where: {id, status: LocationStatus.ACTIVE},
        include: {
            cabinets: {
                where: {status: CabinetStatus.ACTIVE},
                include: {
                    compartments: { select: {id: true, name: true, size: true, status: true} },
                    _count: {select: {compartments: true}},
                },
            },
        },
    });
    if(!location) throw new NotFoundError('Location not found!');
    return location;
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

    if (await hasActiveRentalInLocation(id)) {
        throw new BadRequestError('Cannot delete location: there are active rentals in this location');
    }

    const cabinetIds = (await prisma.cabinet.findMany({
        where: { locationId: id },
        select: { id: true },
    })).map(c => c.id);

    await prisma.$transaction(async (tx) => {
        if (cabinetIds.length > 0) {
            const compartmentIds = (await tx.compartment.findMany({
                where: { cabinetId: { in: cabinetIds } },
                select: { id: true },
            })).map(c => c.id);

            if (compartmentIds.length > 0) {
                const rentalIds = (await tx.rental.findMany({
                    where: { compartmentId: { in: compartmentIds } },
                    select: { id: true },
                })).map(r => r.id);

                if (rentalIds.length > 0) {
                    await tx.payment.deleteMany({ where: { rentalId: { in: rentalIds } } });
                    await tx.lockerLog.deleteMany({ where: { rentalId: { in: rentalIds } } });
                    await tx.rental.deleteMany({ where: { id: { in: rentalIds } } });
                }

                await tx.compartment.deleteMany({ where: { id: { in: compartmentIds } } });
            }

            await tx.adminCabinet.deleteMany({ where: { cabinetId: { in: cabinetIds } } });
            await tx.mcpDevice.deleteMany({ where: { cabinetId: { in: cabinetIds } } });
            await tx.cabinet.deleteMany({ where: { id: { in: cabinetIds } } });
        }

        await tx.location.delete({ where: { id } });
    });

    return { ok: true };
}