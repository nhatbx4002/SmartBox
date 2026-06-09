import crypto from 'crypto';
import { CabinetStatus } from '../generated/prisma';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../lib/errors';
import { signToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';
import { autoProvisionFromProfile, getProfileByKey, validateMcpDevices } from './profile.service';

export type RegisterCabinetInput = {
  provisionKey: string;
  provisionSecret?: string;
  provisionCode?: string;
  hardwareSerial: string;
  deviceName?: string;
  discoveredMcpDevices: Array<{ bus: number; address: number; name?: string }>;
  firmwareVersion?: string;
  piModel?: string;
};

export function generateProvisionCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

export async function registerCabinet(input: RegisterCabinetInput) {
  const profile = await getProfileByKey(input.provisionKey);
  if (!profile) throw UnauthorizedError('Invalid provisioning key');

  if (profile.provisionSecret && input.provisionSecret !== profile.provisionSecret) {
    throw UnauthorizedError('Invalid provisioning secret');
  }

  const { valid, missing } = await validateMcpDevices(profile, input.discoveredMcpDevices);
  if (!valid) {
    throw BadRequestError(`Hardware mismatch: ${missing.join('; ')}`);
  }

  if (profile.mode === 'CHECK_EXISTING') {
    if (!input.provisionCode) {
      throw BadRequestError('Provision code is required');
    }

    const pending = await prisma.cabinet.findFirst({
      where: {
        profileId: profile.id,
        status: CabinetStatus.PENDING_PROVISION,
        hardwareSerial: input.hardwareSerial,
        provisionCode: input.provisionCode,
        provisionCodeExpires: { gt: new Date() },
      },
      orderBy: { createdAt: 'asc' },
    });
    if (!pending) throw NotFoundError('No pending cabinet found for this device');

    await syncCabinetMcpDevices(pending.id, input.discoveredMcpDevices);
    await prisma.cabinet.update({
      where: { id: pending.id },
      data: {
        hardwareSerial: input.hardwareSerial,
        status: CabinetStatus.ACTIVE,
        provisionCode: null,
        provisionCodeExpires: null,
        lastHeartbeatAt: new Date(),
      },
    });

    return issueCredentials(pending.id);
  }

  const existing = await prisma.cabinet.findFirst({
    where: { hardwareSerial: input.hardwareSerial },
    orderBy: { createdAt: 'asc' },
  });
  if (existing) {
    await syncCabinetMcpDevices(existing.id, input.discoveredMcpDevices);
    return issueCredentials(existing.id);
  }

  const locationId = await resolveProvisionLocationId();
  const cabinet = await autoProvisionFromProfile({
    profileId: profile.id,
    locationId,
    hardwareSerial: input.hardwareSerial,
    deviceName: input.deviceName || `Cabinet ${input.hardwareSerial}`,
    notes: buildProvisioningNotes(input),
    discoveredMcpDevices: input.discoveredMcpDevices,
    status: CabinetStatus.ACTIVE,
  });

  return issueCredentials(cabinet.id);
}

export async function getCabinetConfig(cabinetId: string, version?: number) {
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
    configVersion: cabinet.configVersion,
    needsReload: version === undefined ? true : version < cabinet.configVersion,
    mcpDevices: cabinet.mcpDevices,
    compartments: cabinet.compartments,
  };
}

export async function confirmCabinetConfig(cabinetId: string, version: number) {
  const cabinet = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
  if (!cabinet) throw NotFoundError('Cabinet not found');
  if (version > cabinet.configVersion) {
    throw BadRequestError('Confirmed version is newer than server config');
  }
  return { cabinetId, configVersion: cabinet.configVersion, appliedVersion: version, ok: true };
}

export async function listProvisioningCabinets(filters: { cabinetId?: string } = {}) {
  return prisma.cabinet.findMany({
    where: filters.cabinetId ? { id: filters.cabinetId } : undefined,
    include: {
      location: true,
      profile: true,
      mcpDevices: { orderBy: [{ bus: 'asc' }, { address: 'asc' }] },
      compartments: {
        include: { lockMcpDevice: true, sensorMcpDevice: true, realtimeStatus: true },
        orderBy: [{ rowIndex: 'asc' }, { colIndex: 'asc' }, { name: 'asc' }],
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getProvisioningConfig() {
  const config = await prisma.provisioningConfig.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' },
  });
  return (
    config ?? {
      strategy: 'ENV',
      provisionKey: process.env.PROVISION_KEY || 'smartbox-provision',
      provisionSecret: process.env.PROVISION_SECRET || null,
      webhookUrl: null,
      isActive: true,
    }
  );
}

export async function upsertProvisioningConfig(input: {
  strategy?: string;
  provisionKey?: string;
  provisionSecret?: string | null;
  webhookUrl?: string | null;
  isActive?: boolean;
}) {
  const existing = await prisma.provisioningConfig.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' },
  });

  if (existing) {
    return prisma.provisioningConfig.update({
      where: { id: existing.id },
      data: input,
    });
  }

  return prisma.provisioningConfig.create({
    data: {
      strategy: input.strategy ?? 'ENV',
      provisionKey: input.provisionKey ?? process.env.PROVISION_KEY ?? 'smartbox-provision',
      provisionSecret: input.provisionSecret,
      webhookUrl: input.webhookUrl,
      isActive: input.isActive ?? true,
    },
  });
}

function signCabinetToken(cabinetId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required');
  return signToken({ sub: cabinetId, type: 'CABINET' }, secret, '365d');
}

async function issueCredentials(cabinetId: string) {
  let credential = await prisma.cabinetCredential.findUnique({
    where: { cabinetId },
  });

  if (!credential) {
    credential = await prisma.cabinetCredential.create({
      data: {
        cabinetId,
        mqttUsername: cabinetId,
        mqttPassword: crypto.randomBytes(16).toString('hex'),
      },
    });
  }

  const cabinet = await prisma.cabinet.findUnique({
    where: { id: cabinetId },
    include: {
      mcpDevices: { orderBy: [{ bus: 'asc' }, { address: 'asc' }] },
      compartments: {
        include: {
          lockMcpDevice: true,
          sensorMcpDevice: true,
          realtimeStatus: true,
        },
        orderBy: [{ rowIndex: 'asc' }, { colIndex: 'asc' }, { name: 'asc' }],
      },
    },
  });
  if (!cabinet) throw NotFoundError('Cabinet not found');

  return {
    cabinetId: cabinet.id,
    jwtToken: signCabinetToken(cabinet.id),
    mqttConfig: {
      brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
      username: credential.mqttUsername,
      password: credential.mqttPassword,
    },
    confirmedCompartments: cabinet.compartments,
    mcpDevices: cabinet.mcpDevices,
    configVersion: cabinet.configVersion,
  };
}

async function resolveProvisionLocationId() {
  if (process.env.DEFAULT_PROVISION_LOCATION_ID) {
    return process.env.DEFAULT_PROVISION_LOCATION_ID;
  }

  const activeLocations = await prisma.location.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true },
    orderBy: { createdAt: 'asc' },
    take: 2,
  });

  if (activeLocations.length === 1) {
    return activeLocations[0].id;
  }

  if (activeLocations.length === 0) {
    throw BadRequestError('No active location available for auto provisioning');
  }

  throw BadRequestError('Multiple active locations found; set DEFAULT_PROVISION_LOCATION_ID for auto provisioning');
}

async function syncCabinetMcpDevices(
  cabinetId: string,
  discoveredMcpDevices: Array<{ bus: number; address: number; name?: string }>,
) {
  for (const device of discoveredMcpDevices) {
    await prisma.mcpDevice.upsert({
      where: {
        cabinetId_bus_address: {
          cabinetId,
          bus: device.bus,
          address: device.address,
        },
      },
      update: { name: device.name },
      create: {
        cabinetId,
        bus: device.bus,
        address: device.address,
        name: device.name,
      },
    });
  }
}

function buildProvisioningNotes(input: Pick<RegisterCabinetInput, 'firmwareVersion' | 'piModel'>) {
  const parts = [
    input.piModel ? `piModel=${input.piModel}` : null,
    input.firmwareVersion ? `firmwareVersion=${input.firmwareVersion}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}
