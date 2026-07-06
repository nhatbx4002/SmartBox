import crypto from 'crypto';
import { PairingStatus , CabinetStatus, PairingSession } from '../generated/prisma';
import { NotFoundError, BadRequestError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { signCabinetToken } from '../lib/jwt';
import { emitPairingSession } from '../lib/socket';

const PAIRING_TTL_SECONDS = 600;
const CODE_LENGTH = 6;

function generatePairingCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: CODE_LENGTH }, () =>
        chars[crypto.randomInt(chars.length)],
    ).join('');
}

async function generateUniquePairingCode(): Promise<string> {
    for (let i = 0; i < 10; i++) {
        const code = generatePairingCode();

        const existing = await prisma.pairingSession.findUnique({
            where: { pairingCode: code },
        });

        if (!existing) return code;
    }

    throw new BadRequestError('Could not generate unique pairing code');
}

export async function listPairingSessions() {
    return prisma.pairingSession.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function startPairing(data: {
    hardwareSerial: string;
    discoveredMcpDevices: unknown;
}) {
    const pairingCode = await generateUniquePairingCode();
    const expiresAt = new Date(Date.now() + PAIRING_TTL_SECONDS * 1000);

    const session = await prisma.pairingSession.create({
        data: {
            hardwareSerial: data.hardwareSerial,
            discoveredMcpDevices: data.discoveredMcpDevices as object,
            pairingCode,
            expiresAt,
        },
    });

    emitPairingSession(session.id, { status: session.status, pairingCode });

    return {
        sessionId: session.id,
        pairingCode: session.pairingCode,
        expiresInSeconds: PAIRING_TTL_SECONDS,
    };
}

async function expireIfNeeded(session: PairingSession) {
    if (session.status === PairingStatus.PENDING && session.expiresAt < new Date()) {
        return prisma.pairingSession.update({
            where: { id: session.id },
            data: { status: PairingStatus.EXPIRED },
        });
    }
    return session;
}

export async function getPairingSession(sessionId: string) {
    const session = await prisma.pairingSession.findUnique({where: { id: sessionId } });
    if (!session) throw new NotFoundError('Pairing session not found!');
    const current = await expireIfNeeded(session);

    if (current.status === PairingStatus.APPROVED && current.cabinetId) {
        const cabinet = await prisma.cabinet.findUnique({ where: { id: current.cabinetId } });
        if (cabinet) {
            return {
                ...current,
                cabinetId: cabinet.id,
                jwt: signCabinetToken({ cabinetId: cabinet.id }),
                mqttConfig: getMqttConfig(),
                configVersion: cabinet.configVersion,
            };
        }
    }

    return current;
}

export async function getPairingSessionByCode(code: string) {
    const session = await prisma.pairingSession.findUnique({where: { pairingCode: code } });
    if (!session) throw new NotFoundError('Pairing session not found');
    return expireIfNeeded(session);
}

function getMqttConfig() {
    return {
        brokerUrl: process.env.MQTT_DEVICE_BROKER_URL || 'mqtt://localhost:1883',
        username: process.env.MQTT_USERNAME || '',
        password: process.env.MQTT_PASSWORD || '',
    };
}

export async function approvePairing(
    sessionId: string,
    data: { locationId: string; cabinetName: string },
) {
    const session = await prisma.pairingSession.findUnique({
        where: { id: sessionId } });
    if (!session) throw new NotFoundError('Pairing session not found!');
    if (session.status !== PairingStatus.PENDING) throw new BadRequestError(`Cannot approve session with      status ${session.status}`);

    if (session.expiresAt < new Date()) {
        await prisma.pairingSession.update({
            where: { id: sessionId },
            data: { status: PairingStatus.EXPIRED },
        });
        throw new BadRequestError('Pairing session expired');
    }

    const mcpDevices = (session.discoveredMcpDevices as {
        bus: number;
        address: number
    }[]) || [];

    const result = await prisma.$transaction(async (tx) => {
        const cabinet = await tx.cabinet.create({
            data: {
                locationId: data.locationId,
                name: data.cabinetName,
                hardwareSerial: session.hardwareSerial,
                status: CabinetStatus.CONFIGURING,
            },
        });

        const createdMcpDevices = await Promise.all(mcpDevices.map((mcp) =>
                tx.mcpDevice.create({
                    data: { cabinetId: cabinet.id, bus: mcp.bus,
                        address: mcp.address },
                }),
            ),
        );

        await tx.pairingSession.update({
            where: { id: sessionId },
            data: {
                status: PairingStatus.APPROVED,
                cabinetId: cabinet.id
            },
        });

        return { cabinet, mcpDevices: createdMcpDevices };
    });
    const jwt = signCabinetToken({ cabinetId: result.cabinet.id });

    emitPairingSession(sessionId, { status: PairingStatus.APPROVED, cabinetId: result.cabinet.id });

    return {
        cabinetId: result.cabinet.id,
        jwt,
        mqttConfig: getMqttConfig(),
        configVersion: result.cabinet.configVersion,
        compartments: [],
        mcpDevices: result.mcpDevices,
    };
}

export async function cancelPairing(sessionId: string) {
    const session = await prisma.pairingSession.findUnique({where: { id: sessionId } });
    if (!session) throw new NotFoundError('Pairing session not found!');
    if (session.status !== PairingStatus.PENDING) {
        throw new BadRequestError(`Cannot cancel session with status ${session.status}`);
    }

    await prisma.pairingSession.update({
        where: { id: sessionId },
        data: { status: PairingStatus.REJECTED },
    });

    emitPairingSession(sessionId, { status: PairingStatus.REJECTED });

    return { ok: true };
}