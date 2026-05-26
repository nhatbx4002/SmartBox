import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
export type SocketAdmin = {
    id: string;
    email: string;
    role: string;
};
type SocketHandshakeLike = {
    auth?: {
        token?: unknown;
    };
    headers?: {
        authorization?: string | string[];
    };
};
export declare function extractSocketToken(handshake: SocketHandshakeLike): string | null;
export declare function authenticateSocketHandshake(handshake: SocketHandshakeLike, secret?: string): SocketAdmin;
export declare function initSocket(httpServer: HttpServer): Server;
export declare function getSocket(): Server;
export declare function emitCabinetStatus(cabinetId: string, status: object): void;
export declare function emitCompartmentStatus(cabinetId: string, compartmentId: string, status: object): void;
export {};
//# sourceMappingURL=socket.d.ts.map