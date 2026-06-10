import {
  CabinetStatus,
  CompartmentAvailability,
  CompartmentSize,
  Prisma,
} from '../generated/prisma';
import { BadRequestError, ForbiddenError, NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { emitCompartmentStatus } from '../lib/socket';
import { publishCabinetConfigReload } from './cabinet.service';

export type CompartmentInput = {
  name: string;
  size: CompartmentSize;
  rowIndex?: number;
  colIndex?: number;
  lockMcpDeviceId?: string | null;
  sensorMcpDeviceId?: string | null;
  mcp23017PinLock: number;
  mcp23017PinSensor?: number | null;
  status?: CompartmentAvailability;
};

export async function createCompartment(cabinetId: string, input: CompartmentInput) {
  const cabinet = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
  if (!cabinet) throw NotFoundError('Cabinet not found');
  const allowedStatuses: CabinetStatus[] = [CabinetStatus.CONFIGURING, CabinetStatus.ACTIVE];
  if (!allowedStatuses.includes(cabinet.status)) {
    throw BadRequestError('Cabinet status must be CONFIGURING or ACTIVE');
  }

  await validateCompartmentConflicts(cabinetId, input);

  const compartment = await prisma.compartment.create({
    data: {
      cabinetId,
      name: input.name,
      size: input.size,
      rowIndex: input.rowIndex ?? 0,
      colIndex: input.colIndex ?? 0,
      lockMcpDeviceId: input.lockMcpDeviceId,
      sensorMcpDeviceId: input.sensorMcpDeviceId,
      mcp23017PinLock: input.mcp23017PinLock,
      mcp23017PinSensor: input.sensorMcpDeviceId ? Number(input.mcp23017PinSensor) : 0,
      status: input.status ?? CompartmentAvailability.AVAILABLE,
    },
    include: { realtimeStatus: true, lockMcpDevice: true, sensorMcpDevice: true },
  });

  const configVersion = await bumpConfigAndPublish(cabinetId);
  emitCompartmentStatus(cabinetId, compartment.id, compartment);
  return { compartment, configVersion };
}

export async function updateCompartment(id: string, input: Partial<CompartmentInput>) {
  const current = await prisma.compartment.findUnique({ where: { id } });
  if (!current) throw NotFoundError('Compartment not found');
  const cabinet = await prisma.cabinet.findUnique({ where: { id: current.cabinetId } });
  if (!cabinet) throw NotFoundError('Cabinet not found');
  const allowedStatuses: CabinetStatus[] = [CabinetStatus.CONFIGURING, CabinetStatus.ACTIVE];
  if (!allowedStatuses.includes(cabinet.status)) {
    throw BadRequestError('Cabinet status must be CONFIGURING or ACTIVE');
  }

  const merged = { ...current, ...input };
  await validateCompartmentConflicts(current.cabinetId, {
    name: merged.name,
    size: merged.size,
    rowIndex: merged.rowIndex,
    colIndex: merged.colIndex,
    lockMcpDeviceId: merged.lockMcpDeviceId,
    sensorMcpDeviceId: merged.sensorMcpDeviceId,
    mcp23017PinLock: merged.mcp23017PinLock,
    mcp23017PinSensor: merged.mcp23017PinSensor,
    status: merged.status,
  }, id);

  const data: Prisma.CompartmentUncheckedUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.size !== undefined) data.size = input.size;
  if (input.rowIndex !== undefined) data.rowIndex = input.rowIndex;
  if (input.colIndex !== undefined) data.colIndex = input.colIndex;
  if (input.lockMcpDeviceId !== undefined) data.lockMcpDeviceId = input.lockMcpDeviceId;
  if (input.sensorMcpDeviceId !== undefined) data.sensorMcpDeviceId = input.sensorMcpDeviceId;
  if (input.mcp23017PinLock !== undefined) data.mcp23017PinLock = input.mcp23017PinLock;
  if (input.mcp23017PinSensor !== undefined && input.mcp23017PinSensor !== null) {
    data.mcp23017PinSensor = input.mcp23017PinSensor;
  }
  if (input.sensorMcpDeviceId === null) data.mcp23017PinSensor = 0;
  if (input.status !== undefined) data.status = input.status;

  const compartment = await prisma.compartment.update({
    where: { id },
    data,
    include: { realtimeStatus: true, lockMcpDevice: true, sensorMcpDevice: true },
  });

  const configVersion = await bumpConfigAndPublish(current.cabinetId);
  emitCompartmentStatus(current.cabinetId, compartment.id, compartment);
  return { compartment, configVersion };
}

export async function deleteCompartment(id: string) {
  const current = await prisma.compartment.findUnique({ where: { id } });
  if (!current) throw NotFoundError('Compartment not found');
  if (current.status === CompartmentAvailability.OCCUPIED) {
    throw ForbiddenError('Cannot delete occupied compartment');
  }

  const cabinet = await prisma.cabinet.findUnique({ where: { id: current.cabinetId } });
  if (!cabinet) throw NotFoundError('Cabinet not found');
  const allowedStatuses: CabinetStatus[] = [CabinetStatus.CONFIGURING, CabinetStatus.ACTIVE];
  if (!allowedStatuses.includes(cabinet.status)) {
    throw BadRequestError('Cabinet status must be CONFIGURING or ACTIVE');
  }

  const compartment = await prisma.compartment.delete({ where: { id } });
  const configVersion = await bumpConfigAndPublish(current.cabinetId);
  return { compartment, configVersion };
}

async function validateCompartmentConflicts(cabinetId: string, input: CompartmentInput, excludeId?: string) {
  validatePin(input.mcp23017PinLock, 'Lock pin');
  if (!input.lockMcpDeviceId) {
    throw BadRequestError('Lock MCP device is required');
  }
  await assertMcpDeviceBelongsToCabinet(cabinetId, input.lockMcpDeviceId, 'Lock MCP device');

  const hasSensor = Boolean(input.sensorMcpDeviceId);
  if (hasSensor) {
    if (input.mcp23017PinSensor === null || input.mcp23017PinSensor === undefined) {
      throw BadRequestError('Sensor pin is required when sensor MCP device is set');
    }
    validatePin(input.mcp23017PinSensor, 'Sensor pin');
    await assertMcpDeviceBelongsToCabinet(cabinetId, input.sensorMcpDeviceId!, 'Sensor MCP device');
  }

  const notSelf = excludeId ? { not: excludeId } : undefined;
  const nameConflict = await prisma.compartment.findFirst({
    where: {
      cabinetId,
      name: input.name,
      ...(notSelf ? { id: notSelf } : {}),
    },
  });
  if (nameConflict) throw BadRequestError('Compartment name already exists');

  const lockConflict = await prisma.compartment.findFirst({
    where: pinWhere(cabinetId, 'lock', input.lockMcpDeviceId ?? null, input.mcp23017PinLock, excludeId),
  });
  if (lockConflict) throw BadRequestError('Lock pin already used');

  if (hasSensor) {
    const sensorConflict = await prisma.compartment.findFirst({
      where: pinWhere(cabinetId, 'sensor', input.sensorMcpDeviceId!, input.mcp23017PinSensor!, excludeId),
    });
    if (sensorConflict) throw BadRequestError('Sensor pin already used');
  }
}

function validatePin(pin: number, label: string) {
  if (!Number.isInteger(pin) || pin < 0 || pin > 15) {
    throw BadRequestError(`${label} must be between 0 and 15`);
  }
}

async function assertMcpDeviceBelongsToCabinet(cabinetId: string, mcpDeviceId: string, label: string) {
  const device = await prisma.mcpDevice.findFirst({
    where: { id: mcpDeviceId, cabinetId },
  });
  if (!device) {
    throw BadRequestError(`${label} does not belong to cabinet`);
  }
}

function pinWhere(
  cabinetId: string,
  pinType: 'lock' | 'sensor',
  mcpDeviceId: string | null,
  pin: number,
  excludeId?: string,
): Prisma.CompartmentWhereInput {
  return {
    cabinetId,
    ...(pinType === 'lock'
      ? { lockMcpDeviceId: mcpDeviceId, mcp23017PinLock: pin }
      : { sensorMcpDeviceId: mcpDeviceId, mcp23017PinSensor: pin }),
    ...(excludeId ? { id: { not: excludeId } } : {}),
  };
}

async function bumpConfigAndPublish(cabinetId: string): Promise<number> {
  const cabinet = await prisma.cabinet.update({
    where: { id: cabinetId },
    data: { configVersion: { increment: 1 } },
    include: {
      compartments: {
        include: { lockMcpDevice: true, sensorMcpDevice: true, realtimeStatus: true },
        orderBy: [{ rowIndex: 'asc' }, { colIndex: 'asc' }, { name: 'asc' }],
      },
    },
  });

  await publishCabinetConfigReload(cabinetId);

  return cabinet.configVersion;
}
