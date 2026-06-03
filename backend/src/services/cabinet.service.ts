import {
  CabinetStatus,
  CompartmentAvailability,
  CompartmentSize,
  DoorStatus,
  LockStatus,
  LockerAction,
} from '../generated/prisma';
import { BadRequestError, NotFoundError } from '../lib/errors';
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
  input: Partial<{ locationId: string; name: string; status: CabinetStatus; hardwareSerial: string; notes: string }>,
) {
  const current = await getCabinet(id);
  if (input.status && input.status !== current.status) {
    validateCabinetStatusTransition(current.status, input.status);
  }
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
  const current = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
  if (!current) throw NotFoundError('Cabinet not found');

  const heartbeatActiveTransitions: CabinetStatus[] = [
    CabinetStatus.PENDING_PROVISION,
    CabinetStatus.PENDING_REGISTRATION,
    CabinetStatus.OFFLINE,
    CabinetStatus.INACTIVE,
  ];
  const shouldPromoteToActive = heartbeatActiveTransitions.includes(current.status);

  const cabinet = await prisma.cabinet.update({
    where: { id: cabinetId },
    data: {
      lastHeartbeatAt: new Date(),
      ...(shouldPromoteToActive ? { status: CabinetStatus.ACTIVE } : {}),
    },
  });

  await prisma.lockerLog.create({
    data: { cabinetId, action: LockerAction.HEARTBEAT, success: true },
  });

  emitCabinetStatus(cabinetId, { status: cabinet.status, lastHeartbeatAt: cabinet.lastHeartbeatAt });
  return cabinet;
}

const validCabinetStatusTransitions: Record<CabinetStatus, CabinetStatus[]> = {
  [CabinetStatus.DRAFT]: [CabinetStatus.PENDING_PROVISION],
  [CabinetStatus.PENDING_PROVISION]: [
    CabinetStatus.ACTIVE,
    CabinetStatus.PENDING_REGISTRATION,
    CabinetStatus.PROVISION_FAILED,
    CabinetStatus.INACTIVE,
  ],
  [CabinetStatus.PENDING_REGISTRATION]: [
    CabinetStatus.ACTIVE,
    CabinetStatus.PROVISION_FAILED,
    CabinetStatus.INACTIVE,
  ],
  [CabinetStatus.PROVISION_FAILED]: [CabinetStatus.PENDING_PROVISION, CabinetStatus.PENDING_REGISTRATION],
  [CabinetStatus.ACTIVE]: [CabinetStatus.INACTIVE, CabinetStatus.OFFLINE],
  [CabinetStatus.INACTIVE]: [CabinetStatus.ACTIVE, CabinetStatus.DRAFT, CabinetStatus.PENDING_PROVISION],
  [CabinetStatus.OFFLINE]: [CabinetStatus.ACTIVE],
};

function validateCabinetStatusTransition(from: CabinetStatus, to: CabinetStatus) {
  if (!validCabinetStatusTransitions[from]?.includes(to)) {
    throw BadRequestError(`Invalid cabinet status transition: ${from} -> ${to}`);
  }
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
