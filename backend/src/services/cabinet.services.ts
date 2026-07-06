import {CabinetStatus, CompartmentStatus, Prisma} from '../generated/prisma'
import {NotFoundError} from  '../lib/errors'
import {prisma} from '../lib/prisma'
import {publishMqtt} from '../lib/mqtt'
import {emitCabinetStatus} from "../lib/socket"

const cabinetInclude = {
    location: true,
    mcpDevices: true,
    compartments: true,
} as const;

export async function listCabinets(adminId?: string, role?: string){
    if(role === 'CABINET_ADMIN' && adminId){
        const assignments = await prisma.adminCabinet.findMany({
            where: {adminId},
            select: {cabinetId: true},
        })

        const cabinetIds = assignments.map((a) => a.cabinetId);
        return prisma.cabinet.findMany({
            where: {
                id : {in: cabinetIds},
            },
            include: {
                ...cabinetInclude,
                _count: {
                    select: {
                        compartments: true,
                    }
                }
            },
            orderBy: {createdAt: 'desc'},
        })
    }

    return prisma.cabinet.findMany({
        include: {
            ...cabinetInclude,
            _count: {
                select: { compartments: true },
            }
        },
        orderBy: {createdAt: 'desc'},
    });
}

export async function getCabinet(id: string){
    const cabinet = await prisma.cabinet.findUnique({
        where: {id},
        include: {
            location: true,
            mcpDevices: true,
            compartments: {
                include: {
                    lockMcpDevice: true,
                    sensorMcpDevice: true,
                }
            }
        },
    });

    if(!cabinet) throw new NotFoundError('Cabinet not found');
    return cabinet;
}

export async function getCabinetConfig(cabinetId: string) {
    const cabinet = await prisma.cabinet.findUnique({
        where: { id: cabinetId },
        include: { compartments: true, mcpDevices: true },
    });
    if (!cabinet) return null;

    return {
        cabinetId: cabinet.id,
        status: cabinet.status,
        configVersion: cabinet.configVersion,
        mcpDevices: cabinet.mcpDevices,
        compartments: cabinet.compartments,
        needsReload: false,
    };
}

export async function updateCabinet(
    id: string,
    data: {
        name?: string,
        status?: CabinetStatus,
        hardwareSerial?: string,
        notes?: string,
    }
){
    const cabinet = await prisma.cabinet.findUnique({where: {id}});
    if(!cabinet) throw new NotFoundError('Cabinet not found!');
    return prisma.cabinet.update({
        where: {id},
        data,
        include: cabinetInclude
    });
}

export async function deleteCabinet(id: string){
    const cabinet = await prisma.cabinet.findUnique({where: {id}});
    if(!cabinet) throw new NotFoundError('Cabinet not found!');

    await prisma.cabinet.delete({where: {id}});
    return {ok: true};
}

export async function activateCabinet(id: string){
    const cabinet = await prisma.cabinet.findUnique({where: {id}});
    if(!cabinet) throw new NotFoundError('Cabinet not found!');

    const updated = await prisma.cabinet.update({
        where: {id},
        data: {
            status: CabinetStatus.ACTIVE,
            configVersion: {increment: 1},
        },
        include: cabinetInclude,
    });

    await publishCabinetConfigReload(id);
    emitCabinetStatus(
        id,
        {
            status: updated.status,
            configVersion: updated.configVersion
        },
    )

    return updated;
}

export async function deactivateCabinet(id: string){
    const cabinet = await prisma.cabinet.findUnique({where: {id}});
    if(!cabinet) throw new NotFoundError('Cabinet not found!');

    const updated = await prisma.cabinet.update({
        where:{id},
        data: {
          status: CabinetStatus.INACTIVE,
          configVersion: {increment: 1},
        },
        include: cabinetInclude,
    });

    await publishCabinetConfigReload(id);
    emitCabinetStatus(
        id,
        {status: updated.status, configVersion: updated.configVersion},
    );
    return updated;
}

export async function updateHeartbeat(cabinetId: string) {
    const cabinet = await prisma.cabinet.findUnique({
        where: { id: cabinetId },
    });

    if (!cabinet) return null;

    const updated = await prisma.cabinet.update({
        where: { id: cabinetId },
        data: {
            lastHeartbeatAt: new Date(),
            ...(cabinet.status === CabinetStatus.OFFLINE
                ? { status: CabinetStatus.ACTIVE }
                : {}),
        },
    });

    emitCabinetStatus(cabinetId, {
        status: updated.status,
        lastHeartbeatAt: updated.lastHeartbeatAt,
    });

    return updated;
}

export async function listAvailableCompartments(cabinetId: string)
{
    return prisma.compartment.findMany({
        where: { cabinetId, status: CompartmentStatus.AVAILABLE },
    });
}

export async function publishCabinetConfigReload(cabinetId:
                                                 string) {
    const cabinet = await prisma.cabinet.findUnique({
        where: { id: cabinetId },
        include: { compartments: true, mcpDevices: true },
    });
    if (!cabinet) return;

    const topic = `omnibox/${cabinetId}/cmd/config-reload`;
    await publishMqtt(topic, {
        configVersion: cabinet.configVersion,
        compartments: cabinet.compartments,
        mcpDevices: cabinet.mcpDevices,
        status: cabinet.status,
    });
}
