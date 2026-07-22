import {CabinetStatus, CompartmentStatus, Prisma, NotificationType} from '../generated/prisma'
import {NotFoundError, BadRequestError} from  '../lib/errors'
import {prisma} from '../lib/prisma'
import {publishMqtt} from '../lib/mqtt'
import {emitCabinetStatus} from "../lib/socket"
import * as notificationService from './notification.services'

const cabinetInclude = {
    location: true,
    mcpDevices: true,
    compartments: { where: { deletedAt: null } },
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
                        compartments: { where: { deletedAt: null } },
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
                select: { compartments: { where: { deletedAt: null } } },
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
                where: { deletedAt: null },
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
        include: { compartments: { where: { deletedAt: null } }, mcpDevices: true },
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

    const rentalCount = await prisma.rental.count({ where: { compartment: { cabinetId: id } } });
    if (rentalCount > 0) throw new BadRequestError('Cabinet đã có lịch sử thuê, chỉ có thể ngưng hoạt động');

    await prisma.$transaction([
        prisma.compartment.deleteMany({ where: { cabinetId: id } }),
        prisma.cabinet.delete({ where: { id } }),
    ]);
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

export async function markOnline(cabinetId: string) {
    const cabinet = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
    if (!cabinet || cabinet.status !== CabinetStatus.OFFLINE) return null;

    const updated = await prisma.cabinet.update({
        where: { id: cabinetId },
        data: { status: CabinetStatus.ACTIVE, lastHeartbeatAt: new Date() },
    });

    emitCabinetStatus(cabinetId, {
        status: updated.status,
        lastHeartbeatAt: updated.lastHeartbeatAt,
    });

    return updated;
}

export async function markOffline(cabinetId: string) {
    const cabinet = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
    if (!cabinet || cabinet.status !== CabinetStatus.ACTIVE) return null;

    const updated = await prisma.cabinet.update({
        where: { id: cabinetId },
        data: { status: CabinetStatus.OFFLINE },
    });

    emitCabinetStatus(cabinetId, {
        status: updated.status,
        lastHeartbeatAt: updated.lastHeartbeatAt,
    });

    notificationService.createNotification({
        type: NotificationType.CABINET_OFFLINE,
        title: 'Tủ mất kết nối',
        body: `Tủ ${cabinet.name || cabinetId} đã chuyển sang trạng thái OFFLINE`,
        data: { cabinetId },
    }).catch((err) => console.error('[markOffline] createNotification failed:', err));

    return updated;
}

export async function listAvailableCompartments(cabinetId: string)
{
    return prisma.compartment.findMany({
        where: { cabinetId, status: CompartmentStatus.AVAILABLE, deletedAt: null },
    });
}

export async function publishCabinetConfigReload(cabinetId:
                                                 string) {
    const cabinet = await prisma.cabinet.findUnique({
        where: { id: cabinetId },
        include: { compartments: { where: { deletedAt: null } }, mcpDevices: true },
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
