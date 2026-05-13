import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
export declare function initSocket(httpServer: HttpServer): Server;
export declare function getSocket(): Server;
export declare function emitCabinetStatus(cabinetId: string, status: object): void;
export declare function emitCompartmentStatus(cabinetId: string, compartmentId: string, status: object): void;
//# sourceMappingURL=socket.d.ts.map