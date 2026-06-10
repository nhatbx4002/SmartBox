import assert from 'node:assert/strict';
import test from 'node:test';
import { CabinetStatus } from '../src/generated/prisma';
import { prisma } from '../src/lib/prisma';
import { approvePairingSession, getPairingSession, startPairingSession } from '../src/services/pairing.service';

test('startPairingSession creates a session and pairing code', async (t) => {
  const calls: Record<string, unknown> = {};
  const originals = {
    pairingSessionCount: (prisma as any).pairingSession.count,
    pairingSessionCreate: (prisma as any).pairingSession.create,
  };

  t.after(() => {
    (prisma as any).pairingSession.count = originals.pairingSessionCount;
    (prisma as any).pairingSession.create = originals.pairingSessionCreate;
  });

  (prisma as any).pairingSession.count = async () => 0;
  (prisma as any).pairingSession.create = async (args: unknown) => {
    calls.pairingSessionCreate = args;
    return {
      id: 'session-1',
      pairingCode: 'A1B2C3',
    };
  };

  const result = await startPairingSession({
    hardwareSerial: 'RPI-PAIR-001',
    discoveredMcpDevices: [{ bus: 1, address: 32 }],
  });

  assert.equal(result.sessionId, 'session-1');
  assert.equal(result.pairingCode, 'A1B2C3');
  assert.equal(result.expiresInSeconds, 600);
  assert.equal((calls.pairingSessionCreate as { data: { hardwareSerial: string; status: string } }).data.hardwareSerial, 'RPI-PAIR-001');
  assert.equal((calls.pairingSessionCreate as { data: { status: string } }).data.status, 'PENDING');
});

test('startPairingSession enforces the hourly rate limit', async (t) => {
  const originals = {
    pairingSessionCount: (prisma as any).pairingSession.count,
  };

  t.after(() => {
    (prisma as any).pairingSession.count = originals.pairingSessionCount;
  });

  (prisma as any).pairingSession.count = async () => 5;

  await assert.rejects(
    () =>
      startPairingSession({
        hardwareSerial: 'RPI-PAIR-002',
        discoveredMcpDevices: [{ bus: 1, address: 32 }],
      }),
    /Quá nhiều yêu cầu ghép, thử lại sau/,
  );
});

test('approvePairingSession creates a CONFIGURING cabinet and returns credentials', async (t) => {
  process.env.JWT_SECRET = 'pairing-secret';

  const state: any = {
    session: {
      id: 'session-approve',
      hardwareSerial: 'RPI-PAIR-003',
      discoveredMcpDevices: [{ bus: 1, address: 32, name: 'Lock MCP' }],
      pairingCode: 'ZXCVBN',
      status: 'PENDING',
      cabinetId: null,
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    cabinet: {
      id: 'cabinet-approve',
      status: CabinetStatus.CONFIGURING,
      configVersion: 1,
      mcpDevices: [{ id: 'mcp-1', bus: 1, address: 32, name: 'Lock MCP' }],
      compartments: [{ id: 'comp-1', name: 'A1', rowIndex: 0, colIndex: 0 }],
    },
    credential: {
      id: 'cred-1',
      cabinetId: 'cabinet-approve',
      mqttUsername: 'cabinet-approve',
      mqttPassword: 'secret-value',
    },
  };

  const originals = {
    pairingSessionFindUnique: (prisma as any).pairingSession.findUnique,
    pairingSessionUpdate: (prisma as any).pairingSession.update,
    locationFindUnique: (prisma.location as any).findUnique,
    cabinetFindUnique: (prisma.cabinet as any).findUnique,
    cabinetCredentialFindUnique: (prisma as any).cabinetCredential.findUnique,
    $transaction: (prisma as any).$transaction,
  };

  t.after(() => {
    (prisma as any).pairingSession.findUnique = originals.pairingSessionFindUnique;
    (prisma as any).pairingSession.update = originals.pairingSessionUpdate;
    (prisma.location as any).findUnique = originals.locationFindUnique;
    (prisma.cabinet as any).findUnique = originals.cabinetFindUnique;
    (prisma as any).cabinetCredential.findUnique = originals.cabinetCredentialFindUnique;
    (prisma as any).$transaction = originals.$transaction;
  });

  (prisma as any).pairingSession.findUnique = async (args: { where: { id: string } }) =>
    args.where.id === state.session.id ? state.session : null;
  (prisma as any).pairingSession.update = async (args: { data: { status: string; cabinetId: string } }) => {
    state.session.status = args.data.status;
    state.session.cabinetId = args.data.cabinetId;
    return state.session;
  };
  (prisma.location as any).findUnique = async () => ({ id: 'location-1', cabinets: [] });
  (prisma as any).$transaction = async (callback: any) =>
    callback({
      cabinet: {
        create: async () => state.cabinet,
      },
      mcpDevice: {
        createMany: async () => ({ count: 1 }),
      },
      cabinetCredential: {
        create: async () => state.credential,
      },
      pairingSession: {
        update: async (args: { data: { status: string; cabinetId: string } }) => {
          state.session.status = args.data.status;
          state.session.cabinetId = args.data.cabinetId;
          return state.session;
        },
      },
    });
  (prisma.cabinet as any).findUnique = async (args: { where: { id: string } }) =>
    args.where.id === state.cabinet.id ? (state.cabinet as any) : null;
  (prisma as any).cabinetCredential.findUnique = async () => state.credential;

  const result: any = await approvePairingSession('session-approve', {
    locationId: 'location-1',
    cabinetName: 'Tu A',
  });

  assert.equal(result.cabinetId, 'cabinet-approve');
  assert.equal(result.mqttConfig.username, 'cabinet-approve');
  assert.equal(result.status, CabinetStatus.CONFIGURING);
  assert.equal(result.configVersion, 1);
  assert.equal(result.compartments.length, 1);
});

test('getPairingSession returns approved session payload', async (t) => {
  process.env.JWT_SECRET = 'pairing-secret';

  const originals = {
    pairingSessionFindUnique: (prisma as any).pairingSession.findUnique,
    cabinetFindUnique: prisma.cabinet.findUnique,
    cabinetCredentialFindUnique: (prisma as any).cabinetCredential.findUnique,
  };

  t.after(() => {
    (prisma as any).pairingSession.findUnique = originals.pairingSessionFindUnique;
    prisma.cabinet.findUnique = originals.cabinetFindUnique;
    (prisma as any).cabinetCredential.findUnique = originals.cabinetCredentialFindUnique;
  });

  (prisma as any).pairingSession.findUnique = async (args: { where: { id: string } }) => {
    if (args.where.id !== 'session-approved') return null;
    return {
      id: 'session-approved',
      hardwareSerial: 'RPI-PAIR-004',
      discoveredMcpDevices: [{ bus: 1, address: 32 }],
      pairingCode: 'ABC123',
      status: 'APPROVED',
      cabinetId: 'cabinet-approved',
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };
  (prisma.cabinet as any).findUnique = async () => ({
    id: 'cabinet-approved',
    status: CabinetStatus.CONFIGURING,
    configVersion: 7,
    mcpDevices: [{ id: 'mcp-1', bus: 1, address: 32 }],
    compartments: [{ id: 'comp-1', name: 'A1', rowIndex: 0, colIndex: 0 }],
  } as any);
  (prisma as any).cabinetCredential.findUnique = async () => ({
    id: 'cred-2',
    cabinetId: 'cabinet-approved',
    mqttUsername: 'cabinet-approved',
    mqttPassword: 'secret-value',
  });

  const result: any = await getPairingSession('session-approved');

  assert.equal(result.status, 'APPROVED');
  assert.equal(result.cabinetId, 'cabinet-approved');
  assert.equal(result.mqttConfig.username, 'cabinet-approved');
  assert.equal(result.configVersion, 7);
});
