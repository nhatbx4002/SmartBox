import crypto  from 'crypto'
import {prisma} from "../lib/prisma";
import { CabinetStatus} from '../generated/prisma'
import {BadRequestError , NotFoundError } from "../lib/errors";
import { emitPairingSession } from '../lib/socket';
import {getCabinetConfigSnapshot , publishCabinetConfigReload} from "./cabinet.service";
import {publishMqtt} from "../lib/mqtt";
import {serialize} from "node:v8";
import {signToken} from "../lib/jwt";


const PAIRING_SESSION_TTL =  10*60*1000;;
const PAIRING_CODE_LENGTH = 6;
const DEFAULT_MQTT_BROKER_URL = 'mqtt://localhost:1883';

type PairingSessionStatus = 'PENDING'|'APPROVED'|'CANCELLED'|'EXPIRED';

export type StartPairingInput = {
  hardwareSerial: string;
  discoveredMcpDevices : Array<{bus: number , address: number}>;
};

export type ApprovePairingInput = {
  locationId: string;
  cabinetName: string;
};

export async function startPairingSession(input : StartPairingInput){
  //validation input
  if (!input.hardwareSerial || input.hardwareSerial.length > 64) {
    throw BadRequestError("Serial không hợp lệ");
  }

  if(!Array.isArray(input.discoveredMcpDevices) || input.discoveredMcpDevices.length < 1){
    throw BadRequestError("Không tìm thấy thiết bị MCP nào . Hãy kiểm tra lại dây kết nối .")
  }

  for(const device of input.discoveredMcpDevices){
    if(!Number.isInteger(device.bus) || device.bus < 0){
      throw BadRequestError("Địa chỉ MCP không hợp lệ!");
    }

    if(!Number.isInteger(device.address)|| device.address < 0x20 || device.address > 0x27){
      throw BadRequestError("Địa chỉ MCP không hợp lệ!")
    }
  }

  let pairingCode = '';
  for(let i = 0 ; i < 10 ; i++){
    const raw= Math.random()
        .toString(36)
        .replace('.','')
        .slice(0,PAIRING_CODE_LENGTH)

    const existing = await prisma.pairingSession.findFirst({
      where: {
        pairingCode: raw ,
        status: 'PENDING',
        expiresAt: {gt: new Date()}
      }
    })

    if(!existing){
      pairingCode = raw ;
      break;
    }
  }
  if (!pairingCode){
    throw BadRequestError("Không thể tạo mã ghép. Hãy xác nhận các tin trước đó trước!")
  }

  const session = await prisma.pairingSession.create({
      data: {
        hardwareSerial: input.hardwareSerial,
        discoveredMcpDevices: input.discoveredMcpDevices,
        pairingCode: pairingCode,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + PAIRING_SESSION_TTL),
      }
  });

  return {
    sessionId: session.id,
    pairingCode: session.pairingCode,
    expiresInSeconds: Math.floor(PAIRING_SESSION_TTL/1000),
  }
}

export async function getPairingSession(sessionId: string){
  const session = await prisma.pairingSession.findFirst({
    where: {id : sessionId},
  })
  if(!session) throw NotFoundError("Không tìm thấy phiên kết nối");

  if(session.status === 'PENDING' && session.expiresAt <= new Date()){
    await prisma.pairingSession.update({
      where: {id : sessionId},
      data: {status: 'EXPIRED'},
    })

    const refreshed = await prisma.pairingSession.findUnique({
      where: {id : sessionId},
    })
    emitPairingSession(sessionId, serializeSession(refreshed!));

    return serializeSession(refreshed!);
  }

  if(session.status === 'APPROVED' && session.cabinetId){
    const config = await getCabinetConfigSnapshot(session.cabinetId);

    const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
    const jwt = (() => {
      const secret = process.env.JWT_SECRET;

      return signToken({sub: session.cabinetId, type: 'CABINET'}, secret!, '365d');
    })

    emitPairingSession(sessionId, {
      status: 'APPROVED',
      cabinetId: session.cabinetId,
    });

    return {
      id: session.id,
      status: 'APPROVED',
      cabinetId: session.cabinetId,
      jwt,
      mqttConfig:{
        brokerUrl: mqttBrokerUrl,
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
      },
      configVersion: config.configVersion,
      compartments: config.compartments,
      mcpDevices: config.mcpDevices,
    };
  }

  return serializeSession(session);
}

export async function getPairingSessionByCode(pairingCode: string){
  const session = await prisma.pairingSession.findUnique({
    where:{pairingCode},
  });
  if(!session) throw NotFoundError("Không tìm thấy phiên kết nối nào!");

  if(session.status === 'PENDING' && session.expiresAt <= new Date()){
    await prisma.pairingSession.update({
      where: {id : session.id},
      data: {status: 'EXPIRED'},
    })
    const refreshed = await prisma.pairingSession.findUnique({
      where: {id : session.id},
    });

    emitPairingSession(session.id , serializeSession(refreshed!));

    return serializeSession(refreshed!);
  }
}


export async function listPairingSessions(){
  const expired = await prisma.pairingSession.updateMany({
    where: {status:'PENDING' , expiresAt: {lt: new Date() } },
    data: {status: 'EXPIRED'},
  })
  if(expired.count > 0){
    const sessions = await prisma.pairingSession.findMany({
      where: {status: 'EXPIRED'},
      orderBy: {updatedAt: 'desc'},
      take: expired.count,
    });
    for (const s of sessions){
      emitPairingSession(s.id , serializeSession(s));
    }
  }

  const sessions = await prisma.pairingSession.findMany({
    orderBy: {createdAt: 'desc'},
  })

  return sessions.map(serializeSession);
}

export async function approvePairingSession(sessionId: string, input : ApprovePairingInput){
  let session = await prisma.pairingSession.findUnique({
    where: {id : sessionId},
  })

  if(!session) throw NotFoundError("Không tìm thấy phiên!");
  if(session.status !== 'PENDING'){
    throw BadRequestError('Phiên ghép không còn hợp lệ!');
  }
  if(session.expiresAt <= new Date()){
    await prisma.pairingSession.update({
      where: {id : sessionId},
      data: {status: 'EXPIRED'},
    });
    throw BadRequestError("Mã ghép đã hết hạn!");
  }

  const location =  await prisma.location.findUnique({
    where: {id: input.locationId }
  })

  if (!location) throw NotFoundError("Địa điểm không tồn tại!");

  const discoveredDevices: Array<{ bus: number; address: number; name?: string }> = [];
  if (Array.isArray(session.discoveredMcpDevices)) {
    for (const device of session.discoveredMcpDevices) {
      discoveredDevices.push({
        bus: Number((device as { bus: number }).bus),
        address: Number((device as { address: number }).address),
        name: typeof (device as { name?: unknown }).name === 'string'
            ? (device as { name: string }).name
            : undefined,
      });
    }
  }

  const cabinet = await prisma.$transaction(async (tx) => {
    const cabinet = await tx.cabinet.create({
      data:{
        locationId: input.locationId,
        name: input.cabinetName,
        hardwareSerial: session!.hardwareSerial,
        status: CabinetStatus.CONFIGURING ,
        configVersion: 1,
      }
    })

    if (discoveredDevices.length > 0) {
      await tx.mcpDevice.createMany({
        data: discoveredDevices.map((device) => ({
          cabinetId: cabinet.id,
          bus: device.bus,
          address: device.address,
          name: device.name,
        })),
      })
    }

    await tx.pairingSession.update({
      where: {id : session.id},
      data: {
        status: 'APPROVED',
        cabinetId: cabinet.id,
      }
    })

    return cabinet;
  })

  const config = await getCabinetConfigSnapshot(cabinet.id);
  await publishCabinetConfigReload(cabinet.id);

  emitPairingSession(sessionId , {
    status: 'APPROVED',
    cabinetId: cabinet.id,
  });

  const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
  const jwt = (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is required');
    return signToken({ sub: cabinet.id, type: 'CABINET' }, secret, '365d');
  })();

  const responsePayload = {
    cabinetId : cabinet.id,
    jwt,
    mqttConfig: {
      brokerUrl: mqttBrokerUrl,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    },
    configVersion: config.configVersion,
    compartments: config.compartments,
    mcpDevices: config.mcpDevices,
  }

  publishMqtt(`smartbox/pairing/${sessionId}` , {
    status: 'APPROVED',
    ...responsePayload,
  } , {retain: true});

  return responsePayload;
}


export async function cancelPairingSession(sessionId: string) {
  const session = await prisma.pairingSession.findUnique({
    where: {id : sessionId},
  })

  if(!session) throw NotFoundError("Không thấy phiên ghép!");
  if(session.status !== 'PENDING'){
    throw BadRequestError('Phiên ghép không còn hợp lệ');
  }

  await prisma.pairingSession.update({
    where: {id : sessionId},
    data: {status: 'CANCELLED'},
  });

  emitPairingSession(sessionId , {
    status: 'CANCELLED',
  })

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
}){
  const devices : Array<{bus: number ; address: number ; name?: string}> = [];

  if (Array.isArray(session.discoveredMcpDevices)) {
    for (const device of session.discoveredMcpDevices) {
      devices.push({
        bus: Number((device as { bus: number }).bus),
        address: Number((device as { address: number }).address),
        name: typeof (device as { name?: unknown }).name === 'string'
            ? (device as { bus:number ; address: number;  name?:string}).name
            : undefined,
      });
    }
  }
  return {
    id: session.id,
    pairingCode: session.pairingCode,
    hardwareSerial: session.hardwareSerial,
    discoveredMcpDevices: session.discoveredMcpDevices,
    status: session.status,
    cabinetId: session.cabinetId,
    createdAt: session.createdAt.toISOString(),
    expiredAt:session.expiresAt.toISOString(),
  }
}
