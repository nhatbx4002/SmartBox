import {
  CabinetStatus,
  CompartmentAvailability,
  CompartmentSize,
  DoorStatus,
  LockStatus,
  LockerAction,
  RentalStatus,
} from '../generated/prisma';
import { BadRequestError, NotFoundError } from '../lib/errors';
import { publishMqtt } from '../lib/mqtt';
import { emitCabinetStatus, emitCompartmentStatus } from '../lib/socket';
import { prisma } from '../lib/prisma';
import { unlockCompartment } from './locker.service';

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
  status?: CabinetStatus;
  hardwareSerial?: string | null;
  notes?: string | null;
}) {
  return prisma.cabinet.create({
    data: {
      id: input.id,
      locationId: input.locationId,
      name: input.name,
      status: input.status ?? CabinetStatus.DRAFT,
      hardwareSerial: input.hardwareSerial ?? null,
      notes: input.notes ?? null,
    },
  });
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

export async function getCabinetConfigSnapshot(cabinetId: string) {
  const cabinet = await prisma.cabinet.findUnique({
    where: { id: cabinetId },
    include: {
      mcpDevices: { orderBy: [{ bus: 'asc' }, { address: 'asc' }] },
      compartments: {
        include: { lockMcpDevice: true, sensorMcpDevice: true, realtimeStatus: true },
        orderBy: [{ rowIndex: 'asc' }, { colIndex: 'asc' }, { name: 'asc' }],
      },
    },
  });
  if (!cabinet) throw NotFoundError('Cabinet not found');

  return {
    cabinetId: cabinet.id,
    status: cabinet.status,
    configVersion: cabinet.configVersion,
    mcpDevices: cabinet.mcpDevices ?? [],
    compartments: (cabinet.compartments ?? []).map((compartment) => ({
      ...compartment,
      mcp23017PinSensor: compartment.sensorMcpDeviceId ? compartment.mcp23017PinSensor : null,
    })),
  };
}

export async function publishCabinetConfigReload(cabinetId: string) {
  const config = await getCabinetConfigSnapshot(cabinetId);
  publishMqtt(`smartbox/${cabinetId}/config/reload`, config);
  return config;
}

export async function activateCabinet(cabinetId: string) {
  const current = await prisma.cabinet.findUnique({
    where: { id: cabinetId },
    include: { compartments: true },
  });
  if (!current) throw NotFoundError('Cabinet not found');
  if (current.status !== CabinetStatus.CONFIGURING) {
    throw BadRequestError('Cabinet status is not CONFIGURING');
  }
  if (current.compartments.length < 1) {
    throw BadRequestError('Tủ phải có ít nhất một ngăn');
  }

  const cabinet = await prisma.cabinet.update({
    where: { id: cabinetId },
    data: { status: CabinetStatus.ACTIVE },
  });

  await publishCabinetConfigReload(cabinetId);
  emitCabinetStatus(cabinetId, { status: cabinet.status });
  return cabinet;
}

export async function deactivateCabinet(cabinetId: string) {
  const current = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
  if (!current) throw NotFoundError('Cabinet not found');
  if (current.status !== CabinetStatus.ACTIVE) {
    throw BadRequestError('Cabinet status is not ACTIVE');
  }

  const activeRentals = await prisma.rental.count({
    where: {
      status: RentalStatus.ACTIVE,
      compartment: { cabinetId },
    },
  });
  if (activeRentals > 0) {
    throw BadRequestError('Cabinet has active rentals');
  }

  const cabinet = await prisma.cabinet.update({
    where: { id: cabinetId },
    data: { status: CabinetStatus.INACTIVE },
  });

  await publishCabinetConfigReload(cabinetId);
  emitCabinetStatus(cabinetId, { status: cabinet.status });
  return cabinet;
}

export async function testOpenCompartment(cabinetId: string, compartmentId: string) {
  const cabinet = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
  if (!cabinet) throw NotFoundError('Cabinet not found');
  const allowedStatuses: CabinetStatus[] = [CabinetStatus.CONFIGURING, CabinetStatus.ACTIVE];
  if (!allowedStatuses.includes(cabinet.status)) {
    throw BadRequestError('Cabinet status must be CONFIGURING or ACTIVE');
  }

  const compartment = await prisma.compartment.findFirst({
    where: { id: compartmentId, cabinetId },
  });
  if (!compartment) throw NotFoundError('Compartment not found');

  await unlockCompartment(cabinetId, compartmentId);
  return { ok: true, cabinetId, compartmentId, compartmentName: compartment.name };
}

const validCabinetStatusTransitions: Record<CabinetStatus, CabinetStatus[]> = {
  [CabinetStatus.DRAFT]: [CabinetStatus.PENDING_PROVISION, CabinetStatus.CONFIGURING, CabinetStatus.INACTIVE],
  [CabinetStatus.PENDING_PROVISION]: [
    CabinetStatus.ACTIVE,
    CabinetStatus.PENDING_REGISTRATION,
    CabinetStatus.PROVISION_FAILED,
    CabinetStatus.INACTIVE,
    CabinetStatus.CONFIGURING,
  ],
  [CabinetStatus.PENDING_REGISTRATION]: [
    CabinetStatus.ACTIVE,
    CabinetStatus.PROVISION_FAILED,
    CabinetStatus.INACTIVE,
    CabinetStatus.CONFIGURING,
  ],
  [CabinetStatus.PROVISION_FAILED]: [
    CabinetStatus.PENDING_PROVISION,
    CabinetStatus.PENDING_REGISTRATION,
    CabinetStatus.CONFIGURING,
  ],
  [CabinetStatus.ACTIVE]: [CabinetStatus.INACTIVE, CabinetStatus.OFFLINE],
  [CabinetStatus.INACTIVE]: [
    CabinetStatus.ACTIVE,
    CabinetStatus.DRAFT,
    CabinetStatus.PENDING_PROVISION,
    CabinetStatus.CONFIGURING,
  ],
  [CabinetStatus.OFFLINE]: [CabinetStatus.ACTIVE],
  [CabinetStatus.CONFIGURING]: [CabinetStatus.ACTIVE, CabinetStatus.INACTIVE],
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
