import {
  CabinetStatus,
  CompartmentAvailability,
  CompartmentSize,
  Prisma,
  ProvisionMcpDevice,
  ProvisionProfile,
} from '../generated/prisma';
import crypto from 'crypto';
import { BadRequestError, NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';

const DEFAULT_PROVISION_TTL_MINUTES = 60 * 24;

type ProfileWithDevices = ProvisionProfile & {
  mcpDevices: ProvisionMcpDevice[];
  _count?: { cabinets: number };
};

const publicProfileInclude = {
  mcpDevices: true,
  _count: { select: { cabinets: true } },
} satisfies Prisma.ProvisionProfileInclude;

export type CreateProfileInput = {
  name: string;
  provisionKey: string;
  provisionSecret?: string | null;
  mode: 'CHECK_EXISTING' | 'ALLOW_NEW';
  templateRows: number;
  templateCols: number;
  templateSizes: CompartmentSize[][];
  mcpDevices: Array<{
    bus: number;
    address: number;
    role: 'SENSOR' | 'LOCK';
    name?: string;
  }>;
};

export type UpdateProfileInput = Partial<CreateProfileInput> & {
  provisionSecret?: string | null;
  isActive?: boolean;
};

export type AutoProvisionFromProfileInput = {
  profileId: string;
  locationId: string;
  hardwareSerial?: string | null;
  deviceName: string;
  notes?: string | null;
  discoveredMcpDevices: Array<{ bus: number; address: number; name?: string }>;
  status?: CabinetStatus;
};

export async function createProfile(input: CreateProfileInput) {
  validateTemplateDefinition(input.templateRows, input.templateCols, input.templateSizes);
  const profile = await prisma.provisionProfile.create({
    data: {
      name: input.name,
      provisionKey: input.provisionKey,
      provisionSecret: normalizeSecret(input.provisionSecret),
      mode: input.mode,
      templateRows: input.templateRows,
      templateCols: input.templateCols,
      templateSizes: JSON.stringify(input.templateSizes),
      mcpDevices: {
        create: input.mcpDevices.map((device) => ({
          bus: device.bus,
          address: device.address,
          role: device.role,
          name: device.name,
        })),
      },
    },
    include: publicProfileInclude,
  });

  return mapProfile(profile);
}

export async function getProfiles() {
  const profiles = await prisma.provisionProfile.findMany({
    include: publicProfileInclude,
    orderBy: { createdAt: 'asc' },
  });
  return profiles.map(mapProfile);
}

export async function getProfileById(id: string) {
  const profile = await prisma.provisionProfile.findUnique({
    where: { id },
    include: publicProfileInclude,
  });
  return profile ? mapProfile(profile) : null;
}

export async function getProfileRecordById(id: string): Promise<ProfileWithDevices | null> {
  return prisma.provisionProfile.findUnique({
    where: { id },
    include: { mcpDevices: true },
  });
}

export async function getProfileByKey(key: string): Promise<ProfileWithDevices | null> {
  const profile = await prisma.provisionProfile.findUnique({
    where: { provisionKey: key },
    include: publicProfileInclude,
  });
  if (!profile || !profile.isActive) return null;
  return profile;
}

export async function updateProfile(id: string, input: UpdateProfileInput) {
  const existing = await getProfileRecordById(id);
  if (!existing) throw NotFoundError('Profile not found');

  const nextRows = input.templateRows ?? existing.templateRows;
  const nextCols = input.templateCols ?? existing.templateCols;
  const nextSizes = input.templateSizes ?? parseTemplateSizes(existing.templateSizes);
  validateTemplateDefinition(nextRows, nextCols, nextSizes);

  const profile = await prisma.provisionProfile.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.provisionKey !== undefined ? { provisionKey: input.provisionKey } : {}),
      ...(input.provisionSecret !== undefined ? { provisionSecret: normalizeSecret(input.provisionSecret) } : {}),
      ...(input.mode !== undefined ? { mode: input.mode } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.templateRows !== undefined ? { templateRows: input.templateRows } : {}),
      ...(input.templateCols !== undefined ? { templateCols: input.templateCols } : {}),
      ...(input.templateSizes !== undefined ? { templateSizes: JSON.stringify(input.templateSizes) } : {}),
      ...(input.mcpDevices
        ? {
            mcpDevices: {
              deleteMany: {},
              create: input.mcpDevices.map((device) => ({
                bus: device.bus,
                address: device.address,
                role: device.role,
                name: device.name,
              })),
            },
          }
        : {}),
    },
    include: { mcpDevices: true },
  });

  return mapProfile(profile);
}

export async function deleteProfile(id: string) {
  const existing = await getProfileRecordById(id);
  if (!existing) throw NotFoundError('Profile not found');
  return prisma.provisionProfile.update({
    where: { id },
    data: { isActive: false },
    include: { mcpDevices: true },
  });
}

export async function validateMcpDevices(
  profile: ProfileWithDevices,
  discovered: Array<{ bus: number; address: number }>,
): Promise<{ valid: boolean; missing: string[] }> {
  const expected = new Set(profile.mcpDevices.map((device) => `${device.bus}:${device.address}`));
  const found = new Set(discovered.map((device) => `${device.bus}:${device.address}`));

  const missing: string[] = [];
  for (const key of expected) {
    if (!found.has(key)) {
      const device = profile.mcpDevices.find((item) => `${item.bus}:${item.address}` === key);
      missing.push(`Missing ${device?.role} MCP at ${key}`);
    }
  }

  return { valid: missing.length === 0, missing };
}

export async function autoProvisionFromProfile(input: AutoProvisionFromProfileInput) {
  const profile = await getProfileByKeyOrId(input.profileId);
  if (!profile) throw NotFoundError('Profile not found');

  const cabinet = await prisma.cabinet.create({
    data: {
      locationId: input.locationId,
      name: input.deviceName,
      hardwareSerial: input.hardwareSerial ?? null,
      notes: input.notes ?? null,
      profileId: profile.id,
      status: input.status ?? CabinetStatus.ACTIVE,
      configVersion: 1,
    },
  });

  const provisionedDevices = input.discoveredMcpDevices.length > 0 ? input.discoveredMcpDevices : profile.mcpDevices;
  if (provisionedDevices.length > 0) {
    await prisma.mcpDevice.createMany({
      data: provisionedDevices.map((device) => ({
        cabinetId: cabinet.id,
        bus: device.bus,
        address: device.address,
        name: device.name,
      })),
    });
  }

  const cabinetDevices = await prisma.mcpDevice.findMany({
    where: { cabinetId: cabinet.id },
    orderBy: [{ bus: 'asc' }, { address: 'asc' }],
  });
  const compartments = buildCompartmentsFromTemplate(
    cabinet.id,
    profile.templateRows,
    profile.templateCols,
    parseTemplateSizes(profile.templateSizes),
    profile.mcpDevices,
    cabinetDevices,
  );
  if (compartments.length > 0) {
    await prisma.compartment.createMany({ data: compartments });
  }

  const hydrated = await prisma.cabinet.findUnique({
    where: { id: cabinet.id },
    include: {
      profile: true,
      mcpDevices: { orderBy: [{ bus: 'asc' }, { address: 'asc' }] },
      compartments: {
        include: { lockMcpDevice: true, sensorMcpDevice: true, realtimeStatus: true },
        orderBy: [{ rowIndex: 'asc' }, { colIndex: 'asc' }, { name: 'asc' }],
      },
    },
  });
  if (!hydrated) throw NotFoundError('Cabinet not found after provisioning');
  return hydrated;
}

export async function createPendingCabinetFromProfile(input: {
  profileId: string;
  locationId: string;
  hardwareSerial?: string | null;
  deviceName: string;
  notes?: string | null;
}) {
  const profile = await getProfileRecordById(input.profileId);
  if (!profile) throw NotFoundError('Profile not found');

  return prisma.cabinet.create({
    data: {
      locationId: input.locationId,
      name: input.deviceName,
      hardwareSerial: input.hardwareSerial ?? null,
      notes: input.notes ?? null,
      profileId: profile.id,
      status: CabinetStatus.PENDING_PROVISION,
      provisionCode: generatePendingProvisionCode(),
      provisionCodeExpires: new Date(Date.now() + DEFAULT_PROVISION_TTL_MINUTES * 60_000),
      configVersion: 1,
    },
    include: {
      profile: true,
      mcpDevices: { orderBy: [{ bus: 'asc' }, { address: 'asc' }] },
      compartments: {
        include: { lockMcpDevice: true, sensorMcpDevice: true, realtimeStatus: true },
        orderBy: [{ rowIndex: 'asc' }, { colIndex: 'asc' }, { name: 'asc' }],
      },
    },
  });
}

export async function createCabinetFromProfile(input: {
  profileId: string;
  locationId: string;
  hardwareSerial?: string | null;
  deviceName: string;
  notes?: string | null;
}) {
  const profile = await getProfileRecordById(input.profileId);
  if (!profile) throw NotFoundError('Profile not found');

  if (profile.mode === 'CHECK_EXISTING') {
    return createPendingCabinetFromProfile(input);
  }

  return autoProvisionFromProfile({
    profileId: profile.id,
    locationId: input.locationId,
    hardwareSerial: input.hardwareSerial ?? null,
    deviceName: input.deviceName,
    notes: input.notes ?? null,
    discoveredMcpDevices: profile.mcpDevices.map((device) => ({
      bus: device.bus,
      address: device.address,
      name: device.name ?? undefined,
    })),
    status: CabinetStatus.ACTIVE,
  });
}

function validateTemplateDefinition(rows: number, cols: number, sizes: CompartmentSize[][]) {
  if (rows < 1 || cols < 1) throw BadRequestError('Template rows and cols must be positive');
  if (sizes.length !== rows) throw BadRequestError('Template row count does not match template sizes');
  for (const row of sizes) {
    if (row.length !== cols) throw BadRequestError('Template column count does not match template sizes');
  }
}

function parseTemplateSizes(value: string): CompartmentSize[][] {
  try {
    const parsed = JSON.parse(value) as CompartmentSize[][];
    if (!Array.isArray(parsed)) throw new Error('Template must be a matrix');
    return parsed;
  } catch {
    throw BadRequestError('Profile templateSizes is invalid JSON');
  }
}

function buildCompartmentsFromTemplate(
  cabinetId: string,
  rows: number,
  cols: number,
  sizes: CompartmentSize[][],
  profileDevices: ProvisionMcpDevice[],
  cabinetDevices: Array<{ id: string; bus: number; address: number }>,
): Prisma.CompartmentCreateManyInput[] {
  const lockDeviceId = resolveCabinetMcpDeviceId(profileDevices, cabinetDevices, 'LOCK');
  const sensorDeviceId = resolveCabinetMcpDeviceId(profileDevices, cabinetDevices, 'SENSOR');

  const compartments: Prisma.CompartmentCreateManyInput[] = [];
  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    for (let colIndex = 0; colIndex < cols; colIndex += 1) {
      const index = rowIndex * cols + colIndex;
      compartments.push({
        cabinetId,
        name: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
        size: sizes[rowIndex][colIndex],
        rowIndex,
        colIndex,
        mcp23017PinLock: index,
        mcp23017PinSensor: index,
        lockMcpDeviceId: lockDeviceId,
        sensorMcpDeviceId: sensorDeviceId,
        status: CompartmentAvailability.AVAILABLE,
      });
    }
  }

  return compartments;
}

function resolveCabinetMcpDeviceId(
  profileDevices: ProvisionMcpDevice[],
  cabinetDevices: Array<{ id: string; bus: number; address: number }>,
  role: 'LOCK' | 'SENSOR',
) {
  const expected = profileDevices.find((device) => device.role === role);
  if (!expected) return null;
  const cabinetDevice = cabinetDevices.find(
    (device) => device.bus === expected.bus && device.address === expected.address,
  );
  return cabinetDevice?.id ?? null;
}

function normalizeSecret(secret?: string | null) {
  if (secret === undefined) return undefined;
  const trimmed = secret?.trim();
  return trimmed ? trimmed : null;
}

function mapProfile(profile: ProfileWithDevices) {
  return {
    ...profile,
    templateSizes: parseTemplateSizes(profile.templateSizes),
  };
}

async function getProfileByKeyOrId(keyOrId: string) {
  const byId = await getProfileRecordById(keyOrId);
  if (byId) return byId;
  return getProfileByKey(keyOrId);
}

function generatePendingProvisionCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}
