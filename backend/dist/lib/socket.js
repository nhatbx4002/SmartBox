"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getSocket = getSocket;
exports.emitCabinetStatus = emitCabinetStatus;
exports.emitCompartmentStatus = emitCompartmentStatus;
const socket_io_1 = require("socket.io");
let io = null;
function initSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
    });
    io.on('connection', (socket) => {
        socket.on('cabinet:join', (cabinetId) => {
            socket.join(`cabinet:${cabinetId}`);
        });
    });
    return io;
}
function getSocket() {
    if (!io)
        throw new Error('Socket.io not initialized');
    return io;
}
function emitCabinetStatus(cabinetId, status) {
    io?.to(`cabinet:${cabinetId}`).emit('cabinet:status', status);
}
function emitCompartmentStatus(cabinetId, compartmentId, status) {
    io?.to(`cabinet:${cabinetId}`).emit('compartment:status', { cabinetId, compartmentId, ...status });
}
//# sourceMappingURL=socket.js.map