import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from './jwt';

let io: Server | null = null;

const ADMIN_ROOM = 'admin';
const ADMIN_ROLES = ['SUPER_ADMIN', 'CABINET_ADMIN'] as const;

type AdminRole = (typeof ADMIN_ROLES)[number];

export type SocketAdmin = {
    id: string;
    email: string;
    role: AdminRole;
};

/**
 * Khởi tạo Socket.io server.
 *
 * Socket.io được dùng để gửi realtime update cho admin dashboard:
 * - trạng thái cabinet
 * - trạng thái compartment
 * - pairing session
 * - lỗi phần cứng
 *
 * Hàm này nên được gọi một lần khi app start,
 * sau khi đã tạo HTTP server.
 */
export function initSocket(httpServer: HttpServer): Server {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    });

    /**
     * Middleware xác thực Socket.io.
     *
     * Client dashboard cần gửi access token qua:
     * socket.handshake.auth.token
     *
     * Hoặc Authorization header:
     * Bearer <token>
     *
     * Chỉ admin có role SUPER_ADMIN hoặc CABINET_ADMIN mới được kết nối.
     */
    io.use((socket: Socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                extractBearerToken(socket.handshake.headers?.authorization);

            if (!token) {
                throw new Error('Unauthorized');
            }

            const payload = verifyAccessToken(token);

            if (!payload.sub || !payload.email || !payload.role) {
                throw new Error('Unauthorized');
            }

            if (!isAdminRole(payload.role)) {
                throw new Error('Unauthorized');
            }

            socket.data.admin = {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
            } satisfies SocketAdmin;

            next();
        } catch {
            next(new Error('Unauthorized'));
        }
    });

    /**
     * Khi admin dashboard kết nối thành công:
     * - join room admin chung để nhận toàn bộ update
     * - có thể join thêm room cabinet cụ thể để lọc theo cabinet
     */
    io.on('connection', (socket: Socket) => {
        socket.join(ADMIN_ROOM);

        socket.on('cabinet:join', (cabinetId: string) => {
            if (!cabinetId) {
                return;
            }

            socket.join(getCabinetRoom(cabinetId));
        });

        socket.on('cabinet:leave', (cabinetId: string) => {
            if (!cabinetId) {
                return;
            }

            socket.leave(getCabinetRoom(cabinetId));
        });
    });

    return io;
}

/**
 * Lấy token từ Authorization header dạng:
 * Bearer <token>
 */
function extractBearerToken(authHeader: string | string[] | undefined): string | null {
    const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    if (header?.startsWith('Bearer ')) {
        return header.slice(7);
    }

    return null;
}

/**
 * Kiểm tra role trong JWT có phải admin role được phép dùng dashboard realtime không.
 */
function isAdminRole(role: string): role is AdminRole {
    return ADMIN_ROLES.includes(role as AdminRole);
}

/**
 * Tạo room name cho từng cabinet.
 *
 * Admin có thể join room này để nhận update riêng của một cabinet.
 */
function getCabinetRoom(cabinetId: string): string {
    return `cabinet:${cabinetId}`;
}

/**
 * Lấy Socket.io server hiện tại.
 *
 * Dùng khi cần thao tác trực tiếp với io.
 * Nếu Socket.io chưa được init thì throw lỗi để phát hiện sai thứ tự khởi động app.
 */
export function getSocket(): Server {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }

    return io;
}

/**
 * Emit trạng thái cabinet cho admin dashboard.
 *
 * Gửi tới:
 * - ADMIN_ROOM: tất cả admin đang online
 * - cabinet room: admin đang xem cabinet cụ thể
 */
export function emitCabinetStatus(cabinetId: string, status: object): void {
    io?.to(ADMIN_ROOM).to(getCabinetRoom(cabinetId)).emit('cabinet:status', {
        cabinetId,
        ...status,
    });
}

/**
 * Emit trạng thái compartment cho admin dashboard.
 *
 * Ví dụ:
 * - availability thay đổi
 * - lock status thay đổi
 * - realtime status từ kiosk gửi lên
 */
export function emitCompartmentStatus(
    cabinetId: string,
    compartmentId: string,
    status: object,
): void {
    io?.to(ADMIN_ROOM).to(getCabinetRoom(cabinetId)).emit('compartment:status', {
        cabinetId,
        compartmentId,
        ...status,
    });
}

/**
 * Emit cập nhật pairing session.
 *
 * Dùng cho flow ghép nối tủ:
 * - kiosk tạo session
 * - admin approve/reject
 * - session hết hạn
 */
export function emitPairingSession(sessionId: string, session: object): void {
    io?.to(ADMIN_ROOM).emit('pairing:update', {
        sessionId,
        ...session,
    });
}

/**
 * Emit lỗi phần cứng từ kiosk/backend lên dashboard.
 *
 * Ví dụ:
 * - relay lỗi
 * - MCP device lỗi
 * - không mở được khóa
 * - compartment không phản hồi
 */
export function emitHardwareError(
    cabinetId: string,
    compartmentId: string,
    errorType: string,
    message: string,
): void {
    io?.to(ADMIN_ROOM).to(getCabinetRoom(cabinetId)).emit('hardware:error', {
        cabinetId,
        compartmentId,
        errorType,
        message,
    });
}