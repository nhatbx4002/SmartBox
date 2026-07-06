import {LocationStatus, Prisma, CabinetStatus} from '../generated/prisma'
import {BadRequestError, NotFoundError} from '../lib/errors'
import {prisma} from '../lib/prisma'


export async function listLocation(){
    return prisma.location.findMany({
        include: {_count: {select: { cabinets: true }}},
        orderBy: {name:'asc'},
    });
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

export async function deleteLocation(id: string) {
    const location = await prisma.location.findUnique({ where: { id } });
    if (!location) throw new NotFoundError('Location not found!');

    return prisma.location.update({
        where: { id },
        data: { status: LocationStatus.INACTIVE },
    });
}