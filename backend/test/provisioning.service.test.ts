import assert from 'node:assert/strict';
import test from 'node:test';
import { CabinetStatus, CompartmentSize } from '../src/generated/prisma';
import { prisma } from '../src/lib/prisma';
import { getCabinetConfig, listProvisioningCabinets, registerCabinet, confirmCabinetConfig } from '../src/services/provisioning.service';
import { createCabinetFromProfile } from '../src/services/profile.service';

test('registerCabinet auto provisions an ALLOW_NEW cabinet from profile and issues cabinet credentials', async (t) => {
  process.env.JWT_SECRET = 'test-secret';

  const calls: Record<string, unknown> = {};
  const originals = {
    provisionProfileFindUnique: (prisma as any).provisionProfile?.findUnique,
    cabinetFindFirst: prisma.cabinet.findFirst,
    cabinetCreate: prisma.cabinet.create,
    locationFindMany: prisma.location.findMany,
    mcpDeviceCreateMany: prisma.mcpDevice.createMany,
    mcpDeviceFindMany: prisma.mcpDevice.findMany,
    compartmentCreateMany: prisma.compartment.createMany,
    cabinetCredentialFindUnique: (prisma as any).cabinetCredential?.findUnique,
    cabinetCredentialCreate: (prisma as any).cabinetCredential?.create,
    cabinetFindUnique: prisma.cabinet.findUnique,
  };
  t.after(() => {
    if (originals.provisionProfileFindUnique) {
      (prisma as any).provisionProfile = { findUnique: originals.provisionProfileFindUnique };
    }
    (prisma.cabinet as any).findFirst = originals.cabinetFindFirst;
    (prisma.cabinet as any).create = originals.cabinetCreate;
    (prisma.location as any).findMany = originals.locationFindMany;
    (prisma.mcpDevice as any).createMany = originals.mcpDeviceCreateMany;
    (prisma.mcpDevice as any).findMany = originals.mcpDeviceFindMany;
    (prisma.compartment as any).createMany = originals.compartmentCreateMany;
    if (originals.cabinetCredentialFindUnique) {
      (prisma as any).cabinetCredential = { findUnique: originals.cabinetCredentialFindUnique, create: originals.cabinetCredentialCreate };
    }
    (prisma.cabinet as any).findUnique = originals.cabinetFindUnique;
  });

  (prisma as any).provisionProfile = {};
  (prisma as any).provisionProfile.findUnique = async () => ({
    id: 'profile-1',
    provisionKey: 'smartbox-24-prod',
    provisionSecret: 'secret-1',
    mode: 'ALLOW_NEW',
    isActive: true,
    templateRows: 1,
    templateCols: 2,
    templateSizes: JSON.stringify([[CompartmentSize.SMALL, CompartmentSize.LARGE]]),
    mcpDevices: [
      { id: 'profile-sensor', bus: 1, address: 32, role: 'SENSOR', name: 'Sensor MCP' },
      { id: 'profile-lock', bus: 1, address: 33, role: 'LOCK', name: 'Lock MCP' },
    ],
  });
  (prisma.cabinet as any).findFirst = async () => null;
  (prisma.cabinet as any).create = async (args: unknown) => {
    calls.cabinetCreate = args;
    return {
      id: 'cabinet-1',
      name: 'Tu A - Tang 1',
      status: CabinetStatus.ACTIVE,
      configVersion: 1,
    };
  };
  (prisma.location as any).findMany = async () => [{ id: 'location-1' }];
  (prisma.mcpDevice as any).createMany = async (args: unknown) => {
    calls.mcpDeviceCreateMany = args;
    return { count: 2 };
  };
  (prisma.mcpDevice as any).findMany = async () => [
    { id: 'mcp-sensor', cabinetId: 'cabinet-1', bus: 1, address: 32, name: 'Sensor MCP' },
    { id: 'mcp-lock', cabinetId: 'cabinet-1', bus: 1, address: 33, name: 'Lock MCP' },
  ];
  (prisma.compartment as any).createMany = async (args: unknown) => {
    calls.compartmentCreateMany = args;
    return { count: 2 };
  };
  (prisma as any).cabinetCredential = (prisma as any).cabinetCredential || {};
  (prisma as any).cabinetCredential.findUnique = async () => null;
  (prisma as any).cabinetCredential.create = async (args: unknown) => {
    calls.cabinetCredentialCreate = args;
    return {
      id: 'credential-1',
      cabinetId: 'cabinet-1',
      mqttUsername: 'cabinet-1',
      mqttPassword: 'generated-secret',
    };
  };
  (prisma.cabinet as any).findUnique = async () => ({
    id: 'cabinet-1',
    configVersion: 1,
    mcpDevices: [
      { id: 'mcp-sensor', bus: 1, address: 32, name: 'Sensor MCP' },
      { id: 'mcp-lock', bus: 1, address: 33, name: 'Lock MCP' },
    ],
    compartments: [
      { id: 'comp-1', name: 'A1', rowIndex: 0, colIndex: 0, size: CompartmentSize.SMALL },
      { id: 'comp-2', name: 'A2', rowIndex: 0, colIndex: 1, size: CompartmentSize.LARGE },
    ],
  });

  const result = await registerCabinet({
    provisionKey: 'smartbox-24-prod',
    provisionSecret: 'secret-1',
    hardwareSerial: 'RPI-001',
    deviceName: 'Tu A - Tang 1',
    discoveredMcpDevices: [
      { bus: 1, address: 32, name: 'Sensor MCP' },
      { bus: 1, address: 33, name: 'Lock MCP' },
    ],
  });

  assert.equal(result.cabinetId, 'cabinet-1');
  assert.equal(result.mqttConfig.username, 'cabinet-1');
  assert.equal(result.confirmedCompartments.length, 2);
  assert.match(result.jwtToken, /^[\w-]+\.[\w-]+\.[\w-]+$/);

  const cabinetCreateArgs = calls.cabinetCreate as { data: { profileId: string; hardwareSerial: string; status: CabinetStatus } };
  assert.equal(cabinetCreateArgs.data.profileId, 'profile-1');
  assert.equal(cabinetCreateArgs.data.hardwareSerial, 'RPI-001');
  assert.equal(cabinetCreateArgs.data.status, CabinetStatus.ACTIVE);

  const compartmentCreateArgs = calls.compartmentCreateMany as {
    data: Array<{ name: string; mcp23017PinLock: number; mcp23017PinSensor: number }>;
  };
  assert.deepEqual(
    compartmentCreateArgs.data.map((compartment) => ({
      name: compartment.name,
      lockPin: compartment.mcp23017PinLock,
      sensorPin: compartment.mcp23017PinSensor,
    })),
    [
      { name: 'A1', lockPin: 0, sensorPin: 0 },
      { name: 'A2', lockPin: 1, sensorPin: 1 },
    ],
  );
});

test('registerCabinet activates a CHECK_EXISTING cabinet by hardware serial and reuses stored MQTT credentials', async (t) => {
  process.env.JWT_SECRET = 'test-secret';

  const calls: Record<string, unknown> = {};
  const originals = {
    provisionProfileFindUnique: (prisma as any).provisionProfile?.findUnique,
    cabinetFindFirst: prisma.cabinet.findFirst,
    cabinetUpdate: prisma.cabinet.update,
    mcpDeviceUpsert: prisma.mcpDevice.upsert,
    cabinetCredentialFindUnique: (prisma as any).cabinetCredential?.findUnique,
    cabinetFindUnique: prisma.cabinet.findUnique,
  };
  t.after(() => {
    (prisma as any).provisionProfile = originals.provisionProfileFindUnique
      ? { findUnique: originals.provisionProfileFindUnique }
      : undefined;
    (prisma.cabinet as any).findFirst = originals.cabinetFindFirst;
    (prisma.cabinet as any).update = originals.cabinetUpdate;
    (prisma.mcpDevice as any).upsert = originals.mcpDeviceUpsert;
    (prisma as any).cabinetCredential = originals.cabinetCredentialFindUnique
      ? { findUnique: originals.cabinetCredentialFindUnique }
      : undefined;
    (prisma.cabinet as any).findUnique = originals.cabinetFindUnique;
  });

  (prisma as any).provisionProfile = {};
  (prisma as any).provisionProfile.findUnique = async () => ({
    id: 'profile-2',
    provisionKey: 'smartbox-check',
    provisionSecret: null,
    mode: 'CHECK_EXISTING',
    isActive: true,
    templateRows: 1,
    templateCols: 1,
    templateSizes: JSON.stringify([[CompartmentSize.SMALL]]),
    mcpDevices: [{ id: 'profile-lock', bus: 1, address: 33, role: 'LOCK', name: 'Lock MCP' }],
  });
  (prisma.cabinet as any).findFirst = async () => ({
    id: 'cabinet-2',
    name: 'Tu B',
    status: CabinetStatus.PENDING_PROVISION,
    hardwareSerial: 'RPI-002',
    provisionCode: 'AB12CD34',
    provisionCodeExpires: new Date(Date.now() + 60_000),
  });
  (prisma.cabinet as any).update = async (args: unknown) => {
    calls.cabinetUpdate = args;
    return {
      id: 'cabinet-2',
      name: 'Tu B',
      status: CabinetStatus.ACTIVE,
      hardwareSerial: 'RPI-002',
    };
  };
  (prisma.mcpDevice as any).upsert = async () => ({ id: 'mcp-lock', bus: 1, address: 33 });
  (prisma as any).cabinetCredential = {};
  (prisma as any).cabinetCredential.findUnique = async () => ({
    id: 'credential-2',
    cabinetId: 'cabinet-2',
    mqttUsername: 'cabinet-2',
    mqttPassword: 'existing-secret',
  });
  (prisma.cabinet as any).findUnique = async () => ({
    id: 'cabinet-2',
    configVersion: 7,
    mcpDevices: [{ id: 'mcp-lock', bus: 1, address: 33, name: 'Lock MCP' }],
    compartments: [{ id: 'comp-3', name: 'A1', rowIndex: 0, colIndex: 0, size: CompartmentSize.SMALL }],
  });

  const result = await registerCabinet({
    provisionKey: 'smartbox-check',
    provisionCode: 'AB12CD34',
    hardwareSerial: 'RPI-002',
    discoveredMcpDevices: [{ bus: 1, address: 33, name: 'Lock MCP' }],
  });

  assert.equal(result.cabinetId, 'cabinet-2');
  assert.equal(result.mqttConfig.password, 'existing-secret');
  assert.equal(result.configVersion, 7);
  assert.deepEqual((calls.cabinetUpdate as { data: { status: CabinetStatus; provisionCode: null } }).data, {
    hardwareSerial: 'RPI-002',
    lastHeartbeatAt: (calls.cabinetUpdate as any).data.lastHeartbeatAt,
    provisionCode: null,
    provisionCodeExpires: null,
    status: CabinetStatus.ACTIVE,
  });
});

test('registerCabinet rejects CHECK_EXISTING registration without provision code', async (t) => {
  const originals = {
    provisionProfileFindUnique: (prisma as any).provisionProfile?.findUnique,
    cabinetFindFirst: prisma.cabinet.findFirst,
  };
  t.after(() => {
    (prisma as any).provisionProfile = originals.provisionProfileFindUnique
      ? { findUnique: originals.provisionProfileFindUnique }
      : undefined;
    (prisma.cabinet as any).findFirst = originals.cabinetFindFirst;
  });

  (prisma as any).provisionProfile = {};
  (prisma as any).provisionProfile.findUnique = async () => ({
    id: 'profile-2',
    provisionKey: 'smartbox-check',
    provisionSecret: null,
    mode: 'CHECK_EXISTING',
    isActive: true,
    templateRows: 1,
    templateCols: 1,
    templateSizes: JSON.stringify([[CompartmentSize.SMALL]]),
    mcpDevices: [{ id: 'profile-lock', bus: 1, address: 33, role: 'LOCK', name: 'Lock MCP' }],
  });
  (prisma.cabinet as any).findFirst = async () => {
    throw new Error('cabinet lookup should not run without provision code');
  };

  await assert.rejects(
    () => registerCabinet({
      provisionKey: 'smartbox-check',
      hardwareSerial: 'RPI-002',
      discoveredMcpDevices: [{ bus: 1, address: 33, name: 'Lock MCP' }],
    }),
    /Provision code is required/,
  );
});

test('registerCabinet filters CHECK_EXISTING lookup by provision code and expiry', async (t) => {
  const calls: Record<string, unknown> = {};
  const originals = {
    provisionProfileFindUnique: (prisma as any).provisionProfile?.findUnique,
    cabinetFindFirst: prisma.cabinet.findFirst,
  };
  t.after(() => {
    (prisma as any).provisionProfile = originals.provisionProfileFindUnique
      ? { findUnique: originals.provisionProfileFindUnique }
      : undefined;
    (prisma.cabinet as any).findFirst = originals.cabinetFindFirst;
  });

  (prisma as any).provisionProfile = {};
  (prisma as any).provisionProfile.findUnique = async () => ({
    id: 'profile-2',
    provisionKey: 'smartbox-check',
    provisionSecret: null,
    mode: 'CHECK_EXISTING',
    isActive: true,
    templateRows: 1,
    templateCols: 1,
    templateSizes: JSON.stringify([[CompartmentSize.SMALL]]),
    mcpDevices: [{ id: 'profile-lock', bus: 1, address: 33, role: 'LOCK', name: 'Lock MCP' }],
  });
  (prisma.cabinet as any).findFirst = async (args: unknown) => {
    calls.cabinetFindFirst = args;
    return null;
  };

  await assert.rejects(
    () => registerCabinet({
      provisionKey: 'smartbox-check',
      provisionCode: 'WRONG999',
      hardwareSerial: 'RPI-002',
      discoveredMcpDevices: [{ bus: 1, address: 33, name: 'Lock MCP' }],
    }),
    /No pending cabinet found/,
  );

  const where = (calls.cabinetFindFirst as {
    where: {
      provisionCode: string;
      provisionCodeExpires: { gt: Date };
    };
  }).where;
  assert.equal(where.provisionCode, 'WRONG999');
  assert.ok(where.provisionCodeExpires.gt instanceof Date);
});

test('listProvisioningCabinets returns provisioned cabinet data for a cabinet filter', async (t) => {
  const calls: Record<string, unknown> = {};
  const originals = {
    cabinetFindMany: prisma.cabinet.findMany,
  };
  t.after(() => {
    (prisma.cabinet as any).findMany = originals.cabinetFindMany;
  });

  (prisma.cabinet as any).findMany = async (args: unknown) => {
    calls.cabinetFindMany = args;
    return [
      {
        id: 'cabinet-1',
        name: 'Tu A',
        status: CabinetStatus.ACTIVE,
        provisionCode: null,
        provisionCodeExpires: null,
        mcpDevices: [{ id: 'mcp-lock', bus: 1, address: 33 }],
        compartments: [{ id: 'comp-1', name: 'A1', realtimeStatus: null }],
      },
    ];
  };

  const cabinets = await listProvisioningCabinets({ cabinetId: 'cabinet-1' });

  assert.equal(cabinets[0].id, 'cabinet-1');
  assert.deepEqual((calls.cabinetFindMany as { where: { id: string } }).where, { id: 'cabinet-1' });
});

test('getCabinetConfig reports no reload when requested version is current', async (t) => {
  const originals = {
    cabinetFindUnique: prisma.cabinet.findUnique,
  };
  t.after(() => {
    (prisma.cabinet as any).findUnique = originals.cabinetFindUnique;
  });

  (prisma.cabinet as any).findUnique = async () => ({
    id: 'cabinet-1',
    configVersion: 3,
    compartments: [{ id: 'comp-1', name: 'A1', rowIndex: 0, colIndex: 0 }],
    mcpDevices: [{ id: 'mcp-1', bus: 1, address: 32 }],
  });

  const config = await getCabinetConfig('cabinet-1', 3);

  assert.equal(config.configVersion, 3);
  assert.equal(config.needsReload, false);
});

test('provisioning flow creates cabinet from profile, reuses it on register, then serves and confirms config', async (t) => {
  process.env.JWT_SECRET = 'test-secret';

  const state = {
    profile: {
      id: 'profile-e2e',
      name: 'SmartBox E2E',
      provisionKey: 'smartbox-e2e',
      provisionSecret: null,
      mode: 'ALLOW_NEW',
      isActive: true,
      createdAt: new Date('2026-06-01T00:00:00.000Z'),
      updatedAt: new Date('2026-06-01T00:00:00.000Z'),
      templateRows: 1,
      templateCols: 2,
      templateSizes: JSON.stringify([[CompartmentSize.SMALL, CompartmentSize.LARGE]]),
      mcpDevices: [
        { id: 'profile-sensor', profileId: 'profile-e2e', bus: 1, address: 32, role: 'SENSOR', name: 'Sensor MCP' },
        { id: 'profile-lock', profileId: 'profile-e2e', bus: 1, address: 33, role: 'LOCK', name: 'Lock MCP' },
      ],
    },
    cabinet: null as null | {
      id: string;
      locationId: string;
      profileId: string;
      name: string;
      status: CabinetStatus;
      hardwareSerial: string | null;
      notes: string | null;
      configVersion: number;
      mcpDevices: Array<{ id: string; cabinetId: string; bus: number; address: number; name?: string | null }>;
      compartments: Array<{
        id: string;
        cabinetId: string;
        name: string;
        size: CompartmentSize;
        rowIndex: number;
        colIndex: number;
        mcp23017PinLock: number;
        mcp23017PinSensor: number;
        lockMcpDeviceId: string | null;
        sensorMcpDeviceId: string | null;
        status: string;
      }>;
      lastHeartbeatAt?: Date | null;
    },
    credential: null as null | { id: string; cabinetId: string; mqttUsername: string; mqttPassword: string },
  };

  const originals = {
    provisionProfileFindUnique: (prisma as any).provisionProfile?.findUnique,
    cabinetCreate: prisma.cabinet.create,
    cabinetFindFirst: prisma.cabinet.findFirst,
    cabinetFindUnique: prisma.cabinet.findUnique,
    cabinetUpdate: prisma.cabinet.update,
    cabinetCredentialFindUnique: (prisma as any).cabinetCredential?.findUnique,
    cabinetCredentialCreate: (prisma as any).cabinetCredential?.create,
    mcpDeviceCreateMany: prisma.mcpDevice.createMany,
    mcpDeviceFindMany: prisma.mcpDevice.findMany,
    mcpDeviceUpsert: prisma.mcpDevice.upsert,
    compartmentCreateMany: prisma.compartment.createMany,
  };

  t.after(() => {
    if (originals.provisionProfileFindUnique) {
      (prisma as any).provisionProfile = { findUnique: originals.provisionProfileFindUnique };
    }
    (prisma.cabinet as any).create = originals.cabinetCreate;
    (prisma.cabinet as any).findFirst = originals.cabinetFindFirst;
    (prisma.cabinet as any).findUnique = originals.cabinetFindUnique;
    (prisma.cabinet as any).update = originals.cabinetUpdate;
    (prisma.mcpDevice as any).createMany = originals.mcpDeviceCreateMany;
    (prisma.mcpDevice as any).findMany = originals.mcpDeviceFindMany;
    (prisma.mcpDevice as any).upsert = originals.mcpDeviceUpsert;
    (prisma.compartment as any).createMany = originals.compartmentCreateMany;
    (prisma as any).cabinetCredential = originals.cabinetCredentialFindUnique
      ? { findUnique: originals.cabinetCredentialFindUnique, create: originals.cabinetCredentialCreate }
      : undefined;
  });

  (prisma as any).provisionProfile = {
    findUnique: async (args: { where: { id?: string; provisionKey?: string } }) => {
      const key = args.where.id ?? args.where.provisionKey;
      return key === state.profile.id || key === state.profile.provisionKey ? state.profile : null;
    },
  };

  (prisma.cabinet as any).create = async (args: { data: Record<string, unknown> }) => {
    const id = 'cabinet-e2e';
    state.cabinet = {
      id,
      locationId: String(args.data.locationId),
      profileId: String(args.data.profileId),
      name: String(args.data.name),
      status: args.data.status as CabinetStatus,
      hardwareSerial: (args.data.hardwareSerial as string | null | undefined) ?? null,
      notes: (args.data.notes as string | null | undefined) ?? null,
      configVersion: 1,
      mcpDevices: [],
      compartments: [],
      lastHeartbeatAt: null,
    };
    return state.cabinet;
  };

  (prisma.cabinet as any).findFirst = async (args: { where?: { hardwareSerial?: string } }) => {
    if (!state.cabinet) return null;
    if (args.where?.hardwareSerial && args.where.hardwareSerial !== state.cabinet.hardwareSerial) return null;
    return state.cabinet;
  };

  (prisma.mcpDevice as any).createMany = async (args: { data: Array<{ cabinetId: string; bus: number; address: number; name?: string }> }) => {
    if (!state.cabinet) return { count: 0 };
    state.cabinet.mcpDevices = args.data.map((device, index) => ({
      id: `mcp-${index + 1}`,
      cabinetId: device.cabinetId,
      bus: device.bus,
      address: device.address,
      name: device.name ?? null,
    }));
    return { count: state.cabinet.mcpDevices.length };
  };

  (prisma.mcpDevice as any).findMany = async () => state.cabinet?.mcpDevices ?? [];
  (prisma.mcpDevice as any).upsert = async ({ where, create, update }: any) => {
    if (!state.cabinet) throw new Error('cabinet not created');
    const existing = state.cabinet.mcpDevices.find(
      (device) =>
        device.cabinetId === where.cabinetId_bus_address.cabinetId &&
        device.bus === where.cabinetId_bus_address.bus &&
        device.address === where.cabinetId_bus_address.address,
    );
    if (existing) {
      existing.name = update.name ?? existing.name ?? null;
      return existing;
    }
    const created = {
      id: `mcp-${state.cabinet.mcpDevices.length + 1}`,
      cabinetId: create.cabinetId,
      bus: create.bus,
      address: create.address,
      name: create.name ?? null,
    };
    state.cabinet.mcpDevices.push(created);
    return created;
  };

  (prisma.compartment as any).createMany = async (args: { data: Array<any> }) => {
    if (!state.cabinet) return { count: 0 };
    state.cabinet.compartments = args.data.map((item, index) => ({
      id: `comp-${index + 1}`,
      cabinetId: item.cabinetId,
      name: item.name,
      size: item.size,
      rowIndex: item.rowIndex,
      colIndex: item.colIndex,
      mcp23017PinLock: item.mcp23017PinLock,
      mcp23017PinSensor: item.mcp23017PinSensor,
      lockMcpDeviceId: item.lockMcpDeviceId ?? null,
      sensorMcpDeviceId: item.sensorMcpDeviceId ?? null,
      status: item.status,
    }));
    return { count: state.cabinet.compartments.length };
  };

  (prisma.cabinet as any).findUnique = async () => {
    if (!state.cabinet) return null;
    return {
      ...state.cabinet,
      profile: state.profile,
      mcpDevices: state.cabinet.mcpDevices,
      compartments: state.cabinet.compartments,
    };
  };

  (prisma.cabinet as any).update = async (args: { where: { id: string }; data: Partial<{ status: CabinetStatus; lastHeartbeatAt: Date }> }) => {
    if (!state.cabinet || state.cabinet.id !== args.where.id) throw new Error('cabinet not found');
    state.cabinet = {
      ...state.cabinet,
      ...(args.data.status ? { status: args.data.status } : {}),
      ...(args.data.lastHeartbeatAt ? { lastHeartbeatAt: args.data.lastHeartbeatAt } : {}),
    };
    return state.cabinet;
  };

  (prisma as any).cabinetCredential = {
    findUnique: async () => state.credential,
    create: async (args: { data: { cabinetId: string; mqttUsername: string; mqttPassword: string } }) => {
      state.credential = { id: 'credential-e2e', ...args.data };
      return state.credential;
    },
  };

  const created = await createCabinetFromProfile({
    profileId: 'profile-e2e',
    locationId: 'location-e2e',
    hardwareSerial: 'RPI-E2E',
    deviceName: 'Tu E2E',
    notes: 'flow test',
  });

  assert.equal(created.status, CabinetStatus.ACTIVE);
  assert.equal(created.compartments.length, 2);
  assert.equal(created.mcpDevices.length, 2);

  const registered = await registerCabinet({
    provisionKey: 'smartbox-e2e',
    hardwareSerial: 'RPI-E2E',
    discoveredMcpDevices: [
      { bus: 1, address: 32, name: 'Sensor MCP' },
      { bus: 1, address: 33, name: 'Lock MCP' },
    ],
  });

  assert.equal(registered.cabinetId, 'cabinet-e2e');
  assert.equal(registered.confirmedCompartments.length, 2);
  assert.equal(registered.mqttConfig.username, 'cabinet-e2e');

  const config = await getCabinetConfig('cabinet-e2e', 1);
  assert.equal(config.configVersion, 1);
  assert.equal(config.needsReload, false);
  assert.equal(config.compartments.length, 2);

  const confirm = await confirmCabinetConfig('cabinet-e2e', 1);
  assert.equal(confirm.ok, true);
  assert.equal(confirm.appliedVersion, 1);
});
