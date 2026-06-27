import { prisma } from "../lib/prisma";
import { CabinetStatus } from '../generated/prisma'
import { BadRequestError, NotFoundError } from "../lib/errors";
import { emitPairingSession } from '../lib/socket';
import { createCabinetFromPairing, getCabinetConfigSnapshot, publishCabinetConfigReload } from "./cabinet.service";
import { publishMqtt } from "../lib/mqtt";
import { signToken } from "../lib/jwt";

const PAIRING_SESSION_TTL = 10*60*1000;
const PAIRING_CODE_LENGTH = 6;

//helpers

function signCabinetToken(cabinetId: string): string {
  const secret = process.env.JWT_SECRET;
  if(!secret) throw new Error("Missing JWT_SECRET!");
  return signToken({sub: cabinetId , type: 'CABINET'}, secret , '365d');
}

function buildMqttConfig(){
  return {
    brokerUrl: process.env.MQTT_DEVICE_BROKER_URL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  }
}

function parseDiscoveredDevices(raw: unknown): Array<{ bus: number; address: number; name?: string }> {
  if(!Array.isArray(raw)) {
    return [];
  }

  const devices: Array<{ bus: number; address: number; name?: string }> = [];

  for(const device of raw) {
    if(typeof device !== 'object' || device === null){
      continue;
    }

    const item = device as {
      bus?: unknown;
      address?: unknown;
      name?: unknown;
    }

    const bus = Number(item.bus);
    const address = Number(item.address);

    if(!Number.isFinite(bus)||!Number.isFinite(address)) {
      continue;
    }

    const name = typeof item.name === 'string' ? item.name :undefined;

    devices.push({
      bus,
      address,
      name,
    });
  }

  return devices;
}


async function expireIfNeeded(session: {
  id: string;
  status: string;
  expiresAt: Date;
}){
  if(session.status === 'PENDING' && session.expiresAt <= new Date()) {
    const refreshed = await prisma.pairingSession.update({
      where: {id : session.id},
      data: {status: 'EXPIRED'},
    });
    emitPairingSession(session.id, serializeSession(refreshed));
    return refreshed ;
  }
  return null;
}

async function buildApprovedPayload(cabinetId:string){
  const config = await getCabinetConfigSnapshot(cabinetId);
  return {
    jwt: signCabinetToken(cabinetId),
    mqttConfig: buildMqttConfig(),
    configVersion: config.configVersion,
    compartments: config.compartments,
    mcpDevices: config.mcpDevices,
  };
}

// TYPES
export type StartPairingInput = {
  hardwareSerial: string;
  discoveredMcpDevices: Array<{bus: number; address:number}>;
}

export type ApprovedPairingInput  = {
  locationId: string ;
  cabinetName: string ;
}

//FUNCTIONS

export async function startPairingSession(input: StartPairingInput){
  let pairingCode ='';
  for (let i = 0 ; i < 10 ; i++){
    const raw = Math.random().toString(36).replace('.','').slice(0,PAIRING_CODE_LENGTH);

    const existing = await prisma.pairingSession.findFirst({
      where: {
        pairingCode: raw,
        status: 'PENDING',
        expiresAt: {gt : new Date()},
      }
    });

    if(!existing){
      pairingCode = raw;
      break;
    }
  }

  if(!pairingCode){
    throw BadRequestError("Unable to create a pairing code. Please confirm the previous pending requests first!");
  }

  const session = await prisma.pairingSession.create({
    data: {
      hardwareSerial: input.hardwareSerial,
      discoveredMcpDevices: input.discoveredMcpDevices,
      pairingCode,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + PAIRING_SESSION_TTL),
    }
  });

  return{
    sessionId: session.id,
    pairingCode:session.pairingCode,
    expiresInSeconds: Math.floor(PAIRING_SESSION_TTL/1000),
  }
}

export async function getPairingSession(sessionId: string){
  const session = await prisma.pairingSession.findFirst({
    where: {id:sessionId},
  })

  if (!session) throw NotFoundError("Pairing session not found");

  const expired = await expireIfNeeded(session);
  if(expired){ return serializeSession(expired); }

  if(session.status === 'APPROVED' && session.cabinetId){
    emitPairingSession(session.id,{
      status:'APPROVED',
      cabinetId:session.cabinetId,
    });

    return {
      id:session.id,
      status: 'APPROVED',
      cabinetId:session.cabinetId,
      ...(await buildApprovedPayload(session.cabinetId)),
    }
  }

  return serializeSession(session);
}

export async function getPairingSessionByCode(pairingCode: string){
  const session = await prisma.pairingSession.findUnique({
    where: {pairingCode},
  })
  if(!session) throw NotFoundError("Pairing session not found");

  const expired = await expireIfNeeded(session);
  if(expired) return serializeSession(expired);

  return serializeSession(session);
}

export async function listPairingSessions(){
  const expired = await prisma.pairingSession.updateMany({
    where: {status: 'PENDING', expiresAt: {lt: new Date() } },
    data:{status: 'EXPIRED'},
  });
  if(expired.count > 0){
    const sessions = await prisma.pairingSession.findMany({
      where: {status:'EXPIRED'},
      orderBy: {updatedAt: 'desc'},
      take: expired.count,
    });
    for(const s of sessions){
      emitPairingSession(s.id, serializeSession(s));
    }
  }

  const sessions = await prisma.pairingSession.findMany({
    orderBy: {updatedAt: 'desc'},
  });

  return sessions.map(serializeSession);
}

export async function approvePairingSession(sessionId: string , input: ApprovedPairingInput){
  const session = await prisma.pairingSession.findUnique({
    where: {id:sessionId},
  })

  if(!session) throw NotFoundError("Pairing session not found");
  if(session.status !== 'PENDING'){ throw BadRequestError("Pairing session is no longer valid")};;
  if(session.expiresAt <= new Date()){
    await prisma.pairingSession.update({
      where: {id:sessionId},
      data: {status: 'EXPIRED'},
    })
    throw BadRequestError("Pairing session expired");
  }

  const location = await prisma.location.findUnique({
    where: {id: input.locationId},
  })
  if(!location){throw NotFoundError("Location not found")}

  const discoveredDevices = parseDiscoveredDevices(session.discoveredMcpDevices);

  const cabinet = await prisma.$transaction(async (tx) => {
    const cabinet = await createCabinetFromPairing(tx, {
      locationId: location.id,
      name: input.cabinetName,
      hardwareSerial: session.hardwareSerial,
      discoveredDevices,
    });

    await tx.pairingSession.update({
      where: {id:session.id},
      data: {
        status: 'APPROVED',
        cabinetId: cabinet.id,
      },
    });

    return cabinet;
  })
  await publishCabinetConfigReload(cabinet.id);
  emitPairingSession(sessionId, {
    status: 'APPROVED',
    cabinetId: cabinet.id,
  });

  const responsePayload = {
    cabinetId: cabinet.id,
    ...(await buildApprovedPayload(cabinet.id)),
  };

  publishMqtt(`smartbox/pairing/${sessionId}` , {
    status: 'APPROVED',
    ...responsePayload,
  }, {retain : true});

  return responsePayload;
}

export async function cancelPairingSession(sessionId: string) {
  const session = await prisma.pairingSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) throw NotFoundError("Pairing session not found!");
  if (session.status !== 'PENDING') throw BadRequestError('Pairing session is no longer valid!');

  await prisma.pairingSession.update({
    where: { id: sessionId },
    data: { status: 'CANCELLED' },
  });

  emitPairingSession(sessionId, { status: 'CANCELLED' });

  return { ok: true };
}


export function serializeSession(session: {
  id: string;
  pairingCode: string;
  hardwareSerial: string;
  discoveredMcpDevices: unknown;
  status: string;
  cabinetId: string | null;
  createdAt: Date;
  expiresAt: Date;
}) {
  const devices = parseDiscoveredDevices(session.discoveredMcpDevices);
  return {
    id: session.id,
    pairingCode: session.pairingCode,
    hardwareSerial: session.hardwareSerial,
    discoveredMcpDevices: session.discoveredMcpDevices,
    status: session.status,
    cabinetId: session.cabinetId,
    createdAt: session.createdAt.toISOString(),
    expiredAt: session.expiresAt.toISOString(),
  };
}


