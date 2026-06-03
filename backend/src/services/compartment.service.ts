import {
  CompartmentAvailability,
  CompartmentSize,
  Prisma,
} from '../generated/prisma';
import { BadRequestError, ForbiddenError, NotFoundError } from '../lib/errors';
import { publishMqtt } from '../lib/mqtt';
import { prisma } from '../lib/prisma';
import { emitCompartmentStatus } from '../lib/socket';

export type CompartmentInput = {
  name: string;
  size: CompartmentSize;
  rowIndex?: number;
  colIndex?: number;
  lockMcpDeviceId?: string | null;
  sensorMcpDeviceId?: string | null;
  mcp23017PinLock: number;
  mcp23017PinSensor: number;
  status?: CompartmentAvailability;
};

export async function createCompartment(cabinetId: string, input: CompartmentInput) {
  const cabinet = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
  if (!cabinet) throw NotFoundError('Cabinet not found');

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
      mcp23017PinSensor: input.mcp23017PinSensor,
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

  const compartment = await prisma.compartment.update({
    where: { id },
    data: input,
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

  const compartment = await prisma.compartment.delete({ where: { id } });
  const configVersion = await bumpConfigAndPublish(current.cabinetId);
  return { compartment, configVersion };
}

async function validateCompartmentConflicts(cabinetId: string, input: CompartmentInput, excludeId?: string) {
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

  const sensorConflict = await prisma.compartment.findFirst({
    where: pinWhere(cabinetId, 'sensor', input.sensorMcpDeviceId ?? null, input.mcp23017PinSensor, excludeId),
  });
  if (sensorConflict) throw BadRequestError('Sensor pin already used');
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

  publishMqtt(`smartbox/${cabinetId}/config/reload`, {
    configVersion: cabinet.configVersion,
    compartments: cabinet.compartments,
  });

  return cabinet.configVersion;
}
