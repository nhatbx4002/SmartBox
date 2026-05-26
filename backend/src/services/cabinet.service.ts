import {
  CabinetStatus,
  CompartmentAvailability,
  CompartmentSize,
  DoorStatus,
  LockStatus,
  LockerAction,
} from '../generated/prisma';
import { NotFoundError } from '../lib/errors';
import { emitCabinetStatus, emitCompartmentStatus } from '../lib/socket';
import { prisma } from '../lib/prisma';

export async function listCabinets() {
  return prisma.cabinet.findMany({
    include: { location: true, mcpDevices: true, compartments: { include: { realtimeStatus: true } } },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getCabinet(id: string) {
  const cabinet = await prisma.cabinet.findUnique({
    where: { id },
    include: { location: true, mcpDevices: true, compartments: { include: { realtimeStatus: true } } },
  });
  if (!cabinet) throw NotFoundError('Cabinet not found');
  return cabinet;
}

export async function createCabinet(input: {
  id?: string;
  locationId: string;
  name: string;
}) {
  return prisma.cabinet.create({ data: input });
}

export async function updateCabinet(
  id: string,
  input: Partial<{ locationId: string; name: string; status: CabinetStatus }>,
) {
  await getCabinet(id);
  return prisma.cabinet.update({ where: { id }, data: input });
}

export async function deleteCabinet(id: string) {
  await getCabinet(id);
  return prisma.cabinet.delete({ where: { id } });
}

export async function updateCompartmentStatus(
  compartmentId: string,
  lockStatus: LockStatus,
  doorStatus: DoorStatus,
) {
  const compartment = await prisma.compartment.findUnique({
    where: { id: compartmentId },
    include: { cabinet: true },
  });
  if (!compartment) throw NotFoundError('Compartment not found');

  const status = await prisma.compartmentStatus.upsert({
    where: { compartmentId },
    update: { lockStatus, doorStatus, lastUpdatedAt: new Date() },
    create: { compartmentId, lockStatus, doorStatus },
  });

  emitCompartmentStatus(compartment.cabinetId, compartment.id, status);
  return status;
}

export async function updateHeartbeat(cabinetId: string) {
  const cabinet = await prisma.cabinet.update({
    where: { id: cabinetId },
    data: { lastHeartbeatAt: new Date(), status: CabinetStatus.ACTIVE },
  });

  await prisma.lockerLog.create({
    data: { cabinetId, action: LockerAction.HEARTBEAT, success: true },
  });

  emitCabinetStatus(cabinetId, { status: cabinet.status, lastHeartbeatAt: cabinet.lastHeartbeatAt });
  return cabinet;
}

export async function getAvailableCompartments(size?: CompartmentSize) {
  return prisma.compartment.findMany({
    where: {
      status: CompartmentAvailability.AVAILABLE,
      ...(size ? { size } : {}),
      cabinet: { status: CabinetStatus.ACTIVE },
    },
    include: { cabinet: { include: { location: true } }, realtimeStatus: true },
    orderBy: [{ cabinetId: 'asc' }, { name: 'asc' }],
  });
}
