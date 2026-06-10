import crypto from 'crypto';
import { CabinetStatus } from '../generated/prisma';
import { BadRequestError, NotFoundError, TooManyRequestsError } from '../lib/errors';
import { signToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';
import { getCabinetConfigSnapshot, publishCabinetConfigReload } from './cabinet.service';

const PAIRING_SESSION_TTL_MS = 10 * 60 * 1000;
const PAIRING_RATE_LIMIT_PER_HOUR = 5;
const PAIRING_CODE_LENGTH = 6;

export type StartPairingInput = {
  hardwareSerial: string;
  discoveredMcpDevices: Array<{ bus: number; address: number }>;
};

export type ApprovePairingInput = {
  locationId: string;
  cabinetName: string;
};

type PairingSessionStatus = 'PENDING' | 'APPROVED' | 'EXPIRED' | 'CANCELLED';

export async function startPairingSession(input: StartPairingInput) {
  validatePairingStartInput(input);
  await enforcePairingRateLimit(input.hardwareSerial);

  const pairingCode = await generateUniquePairingCode();
  const session = await prisma.pairingSession.create({
    data: {
      hardwareSerial: input.hardwareSerial,
      discoveredMcpDevices: input.discoveredMcpDevices,
      pairingCode,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + PAIRING_SESSION_TTL_MS),
    },
  });

  return {
    sessionId: session.id,
    pairingCode: session.pairingCode,
    expiresInSeconds: Math.floor(PAIRING_SESSION_TTL_MS / 1000),
  };
}

export async function getPairingSession(sessionId: string) {
  const session = await loadSession(sessionId);
  if (!session) throw NotFoundError('Pairing session not found');
  return buildPairingSessionResponse(session);
}

export async function getPairingSessionByCode(pairingCode: string) {
  const session = await prisma.pairingSession.findUnique({ where: { pairingCode } });
  if (!session) throw NotFoundError('Pairing session not found');
  await expirePairingSessionIfNeeded(session.id, session.status as PairingSessionStatus, session.expiresAt);
  const refreshed = await prisma.pairingSession.findUnique({ where: { id: session.id } });
  if (!refreshed) throw NotFoundError('Pairing session not found');
  return {
    id: refreshed.id,
    pairingCode: refreshed.pairingCode,
    hardwareSerial: refreshed.hardwareSerial,
    discoveredMcpDevices: normalizeDiscoveredDevices(refreshed.discoveredMcpDevices),
    status: refreshed.status as PairingSessionStatus,
    createdAt: refreshed.createdAt.toISOString(),
    expiresAt: refreshed.expiresAt.toISOString(),
    cabinetId: refreshed.cabinetId ?? undefined,
  };
}

export async function listPairingSessions() {
  const sessions = await prisma.pairingSession.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const now = new Date();
  const result = await Promise.all(
    sessions.map(async (s) => {
      if (s.status === 'PENDING' && s.expiresAt < now) {
        await prisma.pairingSession.update({
          where: { id: s.id },
          data: { status: 'EXPIRED' },
        });
        return {
          id: s.id,
          hardwareSerial: s.hardwareSerial,
          discoveredMcpDevices: normalizeDiscoveredDevices(s.discoveredMcpDevices),
          pairingCode: s.pairingCode,
          status: 'EXPIRED' as PairingSessionStatus,
          cabinetId: s.cabinetId ?? undefined,
          createdAt: s.createdAt.toISOString(),
          expiresAt: s.expiresAt.toISOString(),
        };
      }
      return {
        id: s.id,
        hardwareSerial: s.hardwareSerial,
        discoveredMcpDevices: normalizeDiscoveredDevices(s.discoveredMcpDevices),
        pairingCode: s.pairingCode,
        status: s.status as PairingSessionStatus,
        cabinetId: s.cabinetId ?? undefined,
        createdAt: s.createdAt.toISOString(),
        expiresAt: s.expiresAt.toISOString(),
      };
    }),
  );

  return result;
}

export async function approvePairingSession(sessionId: string, input: ApprovePairingInput) {
  const session = await loadSession(sessionId);
  if (!session) throw NotFoundError('Pairing session not found');
  if (session.status !== 'PENDING') {
    throw BadRequestError('Phiên ghép không còn hợp lệ');
  }
  if (session.expiresAt <= new Date()) {
    await expirePairingSessionIfNeeded(session.id, session.status as PairingSessionStatus, session.expiresAt);
    throw BadRequestError('Mã ghép đã hết hạn');
  }

  const location = await prisma.location.findUnique({ where: { id: input.locationId } });
  if (!location) throw NotFoundError('Location not found');

  const approval = await prisma.$transaction(async (tx) => {
    const cabinet = await tx.cabinet.create({
      data: {
        locationId: input.locationId,
        name: input.cabinetName,
        hardwareSerial: session.hardwareSerial,
        status: CabinetStatus.CONFIGURING,
        configVersion: 1,
      },
    });

    const devices = normalizeDiscoveredDevices(session.discoveredMcpDevices);
    if (devices.length > 0) {
      await tx.mcpDevice.createMany({
        data: devices.map((device) => ({
          cabinetId: cabinet.id,
          bus: device.bus,
          address: device.address,
          name: device.name,
        })),
      });
    }

    const credential = await tx.cabinetCredential.create({
      data: {
        cabinetId: cabinet.id,
        mqttUsername: cabinet.id,
        mqttPassword: crypto.randomBytes(16).toString('hex'),
      },
    });

    await tx.pairingSession.update({
      where: { id: session.id },
      data: {
        status: 'APPROVED',
        cabinetId: cabinet.id,
      },
    });

    return { cabinet, credential };
  });

  const config = await getCabinetConfigSnapshot(approval.cabinet.id);
  await publishCabinetConfigReload(approval.cabinet.id);
  const { cabinetId: _ignoredCabinetId, ...configWithoutCabinetId } = config;

  return {
    cabinetId: approval.cabinet.id,
    jwt: signCabinetToken(approval.cabinet.id),
    mqttConfig: {
      brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
      username: approval.credential.mqttUsername,
      password: approval.credential.mqttPassword,
    },
    ...configWithoutCabinetId,
  };
}

export async function cancelPairingSession(sessionId: string) {
  const session = await loadSession(sessionId);
  if (!session) throw NotFoundError('Pairing session not found');
  if (session.status === 'APPROVED') {
    throw BadRequestError('Phiên ghép không còn hợp lệ');
  }

  await prisma.pairingSession.update({
    where: { id: sessionId },
    data: { status: 'CANCELLED' },
  });

  return { ok: true };
}

async function loadSession(sessionId: string) {
  const session = await prisma.pairingSession.findUnique({ where: { id: sessionId } });
  if (!session) return null;
  await expirePairingSessionIfNeeded(session.id, session.status as PairingSessionStatus, session.expiresAt);
  return prisma.pairingSession.findUnique({ where: { id: session.id } });
}

async function expirePairingSessionIfNeeded(sessionId: string, status: PairingSessionStatus, expiresAt: Date) {
  if (status !== 'PENDING' || expiresAt > new Date()) return;
  await prisma.pairingSession.update({
    where: { id: sessionId },
    data: { status: 'EXPIRED' },
  });
}

async function buildPairingSessionResponse(session: NonNullable<Awaited<ReturnType<typeof loadSession>>>) {
  if (session.status === 'APPROVED' && session.cabinetId) {
    return {
      id: session.id,
      status: session.status as PairingSessionStatus,
      cabinetId: session.cabinetId,
      ...(await buildApprovedSessionPayload(session.cabinetId)),
    };
  }

  return {
    id: session.id,
    status: session.status as PairingSessionStatus,
    pairingCode: session.pairingCode,
    hardwareSerial: session.hardwareSerial,
    discoveredMcpDevices: normalizeDiscoveredDevices(session.discoveredMcpDevices),
    createdAt: session.createdAt.toISOString(),
    expiresAt: session.expiresAt.toISOString(),
  };
}

async function buildApprovedSessionPayload(cabinetId: string) {
  const config = await getCabinetConfigSnapshot(cabinetId);
  const credential = await prisma.cabinetCredential.findUnique({
    where: { cabinetId },
  });

  if (!credential) {
    throw NotFoundError('Cabinet credential not found');
  }

  return {
    jwt: signCabinetToken(cabinetId),
    mqttConfig: {
      brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
      username: credential.mqttUsername,
      password: credential.mqttPassword,
    },
    configVersion: config.configVersion,
    compartments: config.compartments,
    mcpDevices: config.mcpDevices,
  };
}

async function enforcePairingRateLimit(hardwareSerial: string) {
  const windowStart = new Date(Date.now() - 60 * 60 * 1000);
  const count = await prisma.pairingSession.count({
    where: {
      hardwareSerial,
      createdAt: { gte: windowStart },
    },
  });

  if (count >= PAIRING_RATE_LIMIT_PER_HOUR) {
    throw TooManyRequestsError('Quá nhiều yêu cầu ghép, thử lại sau');
  }
}

async function generateUniquePairingCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = crypto
      .randomBytes(8)
      .toString('base64url')
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase()
      .slice(0, PAIRING_CODE_LENGTH);

    if (code.length < PAIRING_CODE_LENGTH) continue;

    const existing = await prisma.pairingSession.findUnique({ where: { pairingCode: code } });
    if (!existing) return code;
  }

  throw BadRequestError('Không thể tạo mã ghép');
}

function validatePairingStartInput(input: StartPairingInput) {
  if (!input.hardwareSerial || input.hardwareSerial.length > 64) {
    throw BadRequestError('Serial không hợp lệ');
  }
  if (!Array.isArray(input.discoveredMcpDevices) || input.discoveredMcpDevices.length < 1) {
    throw BadRequestError('Không tìm thấy thiết bị MCP nào');
  }
  for (const device of input.discoveredMcpDevices) {
    if (!Number.isInteger(device.bus) || device.bus < 0) {
      throw BadRequestError('Địa chỉ MCP không hợp lệ');
    }
    if (!Number.isInteger(device.address) || device.address < 0 || device.address > 0x7f) {
      throw BadRequestError('Địa chỉ MCP không hợp lệ');
    }
  }
}

function normalizeDiscoveredDevices(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((device) => ({
    bus: Number((device as { bus: number }).bus),
    address: Number((device as { address: number }).address),
    name: typeof (device as { name?: unknown }).name === 'string' ? (device as { name: string }).name : undefined,
  }));
}

function signCabinetToken(cabinetId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required');
  return signToken({ sub: cabinetId, type: 'CABINET' }, secret, '365d');
}
