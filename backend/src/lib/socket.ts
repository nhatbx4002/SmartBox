import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import type { JwtPayload } from 'jsonwebtoken';
import { ADMIN_ROLES } from '../middleware/auth';
import { verifyToken } from './jwt';

let io: Server | null = null;
const ADMIN_ROOM = 'admins';

export type SocketAdmin = { id: string; email: string; role: string };

type SocketHandshakeLike = {
  auth?: { token?: unknown };
  headers?: { authorization?: string | string[] };
};

export function extractSocketToken(handshake: SocketHandshakeLike): string | null {
  const authToken = handshake.auth?.token;
  if (typeof authToken === 'string' && authToken.length > 0) return authToken;

  const authorization = handshake.headers?.authorization;
  const authHeader = Array.isArray(authorization) ? authorization[0] : authorization;
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);

  return null;
}

export function authenticateSocketHandshake(
  handshake: SocketHandshakeLike,
  secret = process.env.JWT_SECRET || '',
): SocketAdmin {
  const token = extractSocketToken(handshake);
  if (!token) throw new Error('Unauthorized');

  const payload = verifyToken(token, secret) as JwtPayload;
  if (!payload.sub || !payload.email || !payload.role) throw new Error('Unauthorized');

  const role = String(payload.role);
  if (!ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) throw new Error('Unauthorized');

  return { id: payload.sub, email: String(payload.email), role };
}

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  });

  io.use((socket: Socket, next) => {
    try {
      socket.data.admin = authenticateSocketHandshake(socket.handshake);
      next();
    } catch {
      socket.emit('auth:error', { message: 'Unauthorized' });
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: Socket) => {
    socket.join(ADMIN_ROOM);

    socket.on('cabinet:join', (cabinetId: string) => {
      socket.join(`cabinet:${cabinetId}`);
    });
  });

  return io;
}

export function getSocket(): Server {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export function emitCabinetStatus(cabinetId: string, status: object): void {
  io?.to(ADMIN_ROOM).to(`cabinet:${cabinetId}`).emit('cabinet:status', { cabinetId, ...status });
}

export function emitCompartmentStatus(cabinetId: string, compartmentId: string, status: object): void {
  io?.to(ADMIN_ROOM).to(`cabinet:${cabinetId}`).emit('compartment:status', { cabinetId, compartmentId, ...status });
}
