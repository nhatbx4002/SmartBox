import { CompartmentSize, LockerAction, RentalStatus } from '../generated/prisma';
import { NotFoundError, BadRequestError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { publishMqtt } from '../lib/mqtt';
import { emitCompartmentStatus } from '../lib/socket';
import { publishCabinetConfigReload } from './cabinet.services';

async function publishUnlockCommand(
    cabinetId: string,
    compartmentName: string
) {
    const topic = `omnibox/${cabinetId}/cmd/unlock/${compartmentName}`;
    await publishMqtt(topic, { duration: 10 });
}

export async function createCompartment(cabinetId: string, data: {
    name: string;
    size: CompartmentSize;
    mcp23017PinLock: number;
    mcp23017PinSensor: number;
    lockMcpDeviceId: string;
    sensorMcpDeviceId: string;
}) {
    const compartment = await prisma.$transaction(async (tx) => {
        const comp = await tx.compartment.create({
            data: {
                cabinetId,
                ...data
            }
        });
        const cabinet = await tx.cabinet.update({
            where: { id: cabinetId },
            data: { configVersion: { increment: 1 } },
        });
        return { comp, configVersion: cabinet.configVersion };
    });

    await publishCabinetConfigReload(cabinetId);
    emitCompartmentStatus(cabinetId, compartment.comp.id, {status: compartment.comp.status });

    return {
        compartment: compartment.comp,
        configVersion: compartment.configVersion
    };
}

export async function updateCompartment(
    cabinetId: string,
    compId: string,
    data: {
        name?: string;
        size?: CompartmentSize;
        mcp23017PinLock?: number;
        mcp23017PinSensor?: number;
        lockMcpDeviceId?: string;
        sensorMcpDeviceId?: string;
    }
) {
    const existing = await prisma.compartment.findUnique({ where: { id: compId } });
    if (!existing) throw new NotFoundError('Compartment not found!');
    if (existing.deletedAt) throw new BadRequestError('Ngăn tủ đã bị xóa');

    const result = await prisma.$transaction(async (tx) => {
        const comp = await tx.compartment.update({
            where: { id: compId },
            data
        });
        const cabinet = await tx.cabinet.update({
            where: { id: cabinetId },
            data: { configVersion: { increment: 1 } },
        });
        return { comp, configVersion: cabinet.configVersion };
    });

    await publishCabinetConfigReload(cabinetId);
    emitCompartmentStatus(cabinetId, compId, { status: result.comp.status });

    return { compartment: result.comp, configVersion: result.configVersion };
}

export async function deleteCompartment(
    cabinetId: string,
    compId: string
) {
    const existing = await prisma.compartment.findUnique({ where: { id: compId } });
    if (!existing) throw new NotFoundError('Compartment not found!');
    if (existing.deletedAt) throw new BadRequestError('Ngăn tủ đã bị xóa');

    const activeCount = await prisma.rental.count({
        where: { compartmentId: compId, status: { in: [RentalStatus.PENDING, RentalStatus.ACTIVE] } },
    });
    if (activeCount > 0) throw new BadRequestError('Còn đơn thuê đang hoạt động, không thể xóa ngăn tủ này.');

    const totalCount = await prisma.rental.count({ where: { compartmentId: compId } });

    const configVersion = await prisma.$transaction(async (tx) =>
    {
        if (totalCount > 0) {
            await tx.compartment.update({ where: { id: compId }, data: { deletedAt: new Date() } });
        } else {
            await tx.compartment.delete({ where: { id: compId } });
        }
        const cabinet = await tx.cabinet.update({
            where: { id: cabinetId },
            data: { configVersion: { increment: 1 } },
        });
        return cabinet.configVersion;
    });

    await publishCabinetConfigReload(cabinetId);

    return { configVersion };
}

export async function unlockCompartment(
    cabinetId: string,
    compId: string
) {
    const compartment = await prisma.compartment.findUnique({
        where: { id: compId },
        include: { cabinet: true },
    });
    if (!compartment) throw new NotFoundError('Compartment not found!');
    if (compartment.deletedAt) throw new BadRequestError('Ngăn tủ đã bị xóa');

    await publishUnlockCommand(cabinetId, compartment.name);

    await prisma.lockerLog.create({
        data: { cabinetId, compartmentId: compId, action: LockerAction.OPENED, success: true },
    });

    return { ok: true };
}

export async function testOpenCompartment(
    cabinetId: string,
    compId: string
) {
    const compartment = await prisma.compartment.findUnique({
        where: { id: compId },
        include: { cabinet: true },
    });
    if (!compartment) throw new NotFoundError('Compartment not found!');
    if (compartment.deletedAt) throw new BadRequestError('Ngăn tủ đã bị xóa');

    await publishUnlockCommand(cabinetId, compartment.name);

    await prisma.lockerLog.create({
        data: {
            cabinetId,
            compartmentId: compId,
            action: LockerAction.OPENED,
            success: true,
            note: 'test-open' },
    });

    return { cabinetId, compartmentId: compId, compartmentName: compartment.name };
}