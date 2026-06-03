import assert from 'node:assert/strict';
import test from 'node:test';
import { CabinetStatus, CompartmentSize } from '../src/generated/prisma';
import { prisma } from '../src/lib/prisma';
import { getCabinetConfig, listProvisioningCabinets, registerCabinet } from '../src/services/provisioning.service';

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
    (prisma as any).provisionProfile.findUnique = originals.provisionProfileFindUnique;
    (prisma.cabinet as any).findFirst = originals.cabinetFindFirst;
    (prisma.cabinet as any).create = originals.cabinetCreate;
    (prisma.location as any).findMany = originals.locationFindMany;
    (prisma.mcpDevice as any).createMany = originals.mcpDeviceCreateMany;
    (prisma.mcpDevice as any).findMany = originals.mcpDeviceFindMany;
    (prisma.compartment as any).createMany = originals.compartmentCreateMany;
    (prisma as any).cabinetCredential.findUnique = originals.cabinetCredentialFindUnique;
    (prisma as any).cabinetCredential.create = originals.cabinetCredentialCreate;
    (prisma.cabinet as any).findUnique = originals.cabinetFindUnique;
  });

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
    (prisma as any).provisionProfile.findUnique = originals.provisionProfileFindUnique;
    (prisma.cabinet as any).findFirst = originals.cabinetFindFirst;
    (prisma.cabinet as any).update = originals.cabinetUpdate;
    (prisma.mcpDevice as any).upsert = originals.mcpDeviceUpsert;
    (prisma as any).cabinetCredential.findUnique = originals.cabinetCredentialFindUnique;
    (prisma.cabinet as any).findUnique = originals.cabinetFindUnique;
  });

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
    (prisma as any).provisionProfile.findUnique = originals.provisionProfileFindUnique;
    (prisma.cabinet as any).findFirst = originals.cabinetFindFirst;
  });

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
    (prisma as any).provisionProfile.findUnique = originals.provisionProfileFindUnique;
    (prisma.cabinet as any).findFirst = originals.cabinetFindFirst;
  });

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
