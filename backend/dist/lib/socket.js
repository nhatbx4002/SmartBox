"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSocketToken = extractSocketToken;
exports.authenticateSocketHandshake = authenticateSocketHandshake;
exports.initSocket = initSocket;
exports.getSocket = getSocket;
exports.emitCabinetStatus = emitCabinetStatus;
exports.emitCompartmentStatus = emitCompartmentStatus;
const socket_io_1 = require("socket.io");
const auth_1 = require("../middleware/auth");
const jwt_1 = require("./jwt");
let io = null;
const ADMIN_ROOM = 'admins';
function extractSocketToken(handshake) {
    const authToken = handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0)
        return authToken;
    const authorization = handshake.headers?.authorization;
    const authHeader = Array.isArray(authorization) ? authorization[0] : authorization;
    if (authHeader?.startsWith('Bearer '))
        return authHeader.slice(7);
    return null;
}
function authenticateSocketHandshake(handshake, secret = process.env.JWT_SECRET || '') {
    const token = extractSocketToken(handshake);
    if (!token)
        throw new Error('Unauthorized');
    const payload = (0, jwt_1.verifyToken)(token, secret);
    if (!payload.sub || !payload.email || !payload.role)
        throw new Error('Unauthorized');
    const role = String(payload.role);
    if (!auth_1.ADMIN_ROLES.includes(role))
        throw new Error('Unauthorized');
    return { id: payload.sub, email: String(payload.email), role };
}
function initSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
    });
    io.use((socket, next) => {
        try {
            socket.data.admin = authenticateSocketHandshake(socket.handshake);
            next();
        }
        catch {
            socket.emit('auth:error', { message: 'Unauthorized' });
            next(new Error('Unauthorized'));
        }
    });
    io.on('connection', (socket) => {
        socket.join(ADMIN_ROOM);
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
    io?.to(ADMIN_ROOM).to(`cabinet:${cabinetId}`).emit('cabinet:status', { cabinetId, ...status });
}
function emitCompartmentStatus(cabinetId, compartmentId, status) {
    io?.to(ADMIN_ROOM).to(`cabinet:${cabinetId}`).emit('compartment:status', { cabinetId, compartmentId, ...status });
}
//# sourceMappingURL=socket.js.map