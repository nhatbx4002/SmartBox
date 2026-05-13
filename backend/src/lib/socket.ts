import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  });

  io.on('connection', (socket: Socket) => {
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
  io?.to(`cabinet:${cabinetId}`).emit('cabinet:status', status);
}

export function emitCompartmentStatus(cabinetId: string, compartmentId: string, status: object): void {
  io?.to(`cabinet:${cabinetId}`).emit('compartment:status', { cabinetId, compartmentId, ...status });
}
