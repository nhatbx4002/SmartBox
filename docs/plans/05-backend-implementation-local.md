# SmartBox Backend — Localhost Implementation Plan

> Hướng dẫn từng bước để build và chạy backend trên máy local (localhost).
> Không cần deploy — chỉ cần `npm run dev` là xong.
> Design reference: [01-foundation-design.md](01-foundation-design.md), [03-backend-services.md](03-backend-services.md).

---

## Trạng thái hiện tại

```
backend/          → chỉ có .env + src/generated/prisma/ (generated client)
                   → CHƯA có package.json, chưa có server, chưa có routes
postgres/mosquitto → CHƯA có docker-compose
```

**Mục tiêu cuối cùng:** Backend chạy `localhost:3000`, kết nối PostgreSQL `localhost:5432` + Mosquitto `localhost:1883`.

---

## Phase 0 — Prerequisites Check

### 0.1 Cài đặt tool cần thiết

```bash
# Kiểm tra đã cài chưa
node --version    # cần v20+
npm --version
docker --version
docker compose version  # hoặc `docker-compose`
psql --version   # optional, để test DB trực tiếp
```

**Nếu chưa cài:**

| Tool | Link | Ghi chú |
|------|------|---------|
| Node.js 20 | https://nodejs.org ( LTS ) | Dùng nvm nếu cần |
| Docker Desktop | https://docker.com | Bật Docker Desktop trước khi chạy |
| PostgreSQL client (psql) | `brew install postgresql` / `choco install postgresql` | Optional — chỉ cần để query DB thủ công |

### 0.2 Kiểm tra port

```bash
# Đảm bảo các port chưa bị chiếm
netstat -an | grep 5432   # PostgreSQL
netstat -an | grep 1883   # Mosquitto
netstat -an | grep 3000   # Backend
```

---

## Phase 1 — Infrastructure (Docker Compose)

**Thời gian ước tính:** 10 phút

### 1.1 Tạo cấu trúc thư mục infrastructure

```
smartbox/
├── docker-compose.yml
├── mosquitto/
│   └── config/
│       └── mosquitto.conf
├── postgres_data/           # volume mount (auto tạo)
└── backend/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.ts
    │   └── init.sql
    ├── src/
    └── ...
```

### 1.2 Tạo `docker-compose.yml`

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    container_name: smartbox_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 211004
      POSTGRES_DB: smartbox
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/prisma/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  mosquitto:
    image: eclipse-mosquitto:2
    container_name: smartbox_mosquitto
    restart: unless-stopped
    ports:
      - "1883:1883"     # MQTT
      - "9001:9001"     # WebSocket (dự phòng)
    volumes:
      - ./mosquitto/config:/mosquitto/config:ro
      - mosquitto_data:/mosquitto/data
      - mosquitto_log:/mosquitto/log
    healthcheck:
      test: ["CMD", "mosquitto_sub", "-t", "$$SYS/#", "-C", "1", "-i", "healthcheck", "-W", "3"]
      interval: 30s
      timeout: 5s
      retries: 3

volumes:
  postgres_data:
  mosquitto_data:
  mosquitto_log:
```

### 1.3 Tạo `mosquitto/config/mosquitto.conf`

```conf
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
log_dest stdout

listener 1883
allow_anonymous true

listener 9001
protocol websockets
allow_anonymous true
```

### 1.4 Tạo `backend/prisma/init.sql`

```sql
ALTER DATABASE smartbox SET timezone TO 'Asia/Ho_Chi_Minh';
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 1.5 Khởi động infrastructure

```bash
# Tạo thư mục mosquitto/log trước khi chạy
mkdir -p mosquitto/log

# Start containers
docker compose up -d

# Verify
docker compose ps
# Output mong đợi:
# NAME                IMAGE               COMMAND                  SERVICE
# smartbox_postgres   postgres:16-alpine  "docker-entrypoint.s…"   postgres
# smartbox_mosquitto  eclipse-mosquitto   "/docker-entrypoint.…"   mosquitto

# Kiểm tra health
docker compose ps --format "table {{.Name}}\t{{.Status}}"
```

**Dừng infrastructure:**
```bash
docker compose down        # stop + remove containers
docker compose down -v     # + xóa volumes (MẤT HẾT DATA)
```

---

## Phase 2 — Backend Project Setup

**Thời gian ước tính:** 15 phút

### 2.1 Tạo `backend/package.json`

```json
{
  "name": "smartbox-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma db push --force-reset && prisma db seed"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "jsonwebtoken": "^9.0.2",
    "mqtt": "^5.10.0",
    "node-cron": "^3.0.3",
    "socket.io": "^4.8.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.7.0",
    "@types/node-cron": "^3.0.11",
    "prisma": "^5.22.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.6.2"
  }
}
```

### 2.2 Tạo `backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2.3 Tạo `backend/prisma/schema.prisma`

Copy toàn bộ schema từ [01-foundation-design.md §2.2](01-foundation-design.md#22-full-prisma-schema), dòng 261-612.

### 2.4 Update `backend/.env`

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://postgres:211004@localhost:5432/smartbox?schema=public"

JWT_SECRET=dev_jwt_secret_please_change_in_production
JWT_REFRESH_SECRET=dev_refresh_secret_please_change_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=
MQTT_PASSWORD=

QR_SECRET=dev_qr_secret_for_signing_tokens
QR_TOKEN_EXPIRES_IN=30d

HEARTBEAT_INTERVAL=30
HEARTBEAT_TIMEOUT=90

CORS_ORIGIN=*

ADMIN_EMAIL=admin@smartbox.io
ADMIN_PASSWORD=SmartBox@2024
ADMIN_NAME=SmartBox Admin

PAYMENT_MOCK_ENABLED=true

LOG_LEVEL=info
```

### 2.5 Install dependencies

```bash
cd backend
npm install
```

### 2.6 Generate Prisma client + push schema

```bash
npm run db:generate   # tạo src/generated/prisma/
npm run db:push       # apply schema vào PostgreSQL

# Kiểm tra kết quả:
# - Bảng trong DB: Admin, User, Location, Cabinet, Compartment,
#   CompartmentStatus, PricePlan, Rental, LockerLog, Notification, UserSession
```

### 2.7 Tạo seed data (`backend/prisma/seed.ts`)

Seed data từ [01-foundation-design.md §2.3](01-foundation-design.md#23-seed-data-example):

**14 PricePlans** (7 SMALL + 7 LARGE), **2 Locations**, **2 Cabinets** (với compartments), **1 Admin**.

```typescript
// backend/prisma/seed.ts
import { PrismaClient } from './src/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Price Plans (SMALL + LARGE)
  const smallPlans = [
    { name: "1 ngày", size: "SMALL", rentalType: "ONCE", price: 10000, maxOpens: 2, durationDays: 1 },
    { name: "7 ngày", size: "SMALL", rentalType: "ONCE", price: 15000, maxOpens: 2, durationDays: 7 },
    { name: "5 lượt / 30 ngày", size: "SMALL", rentalType: "DAILY", price: 50000, maxOpens: 5, durationDays: 30 },
    { name: "10 lượt / 90 ngày", size: "SMALL", rentalType: "DAILY", price: 90000, maxOpens: 10, durationDays: 90 },
    { name: "1 tháng", size: "SMALL", rentalType: "MONTHLY", price: 150000, maxOpens: 999, durationDays: 30 },
    { name: "3 tháng", size: "SMALL", rentalType: "MONTHLY", price: 400000, maxOpens: 999, durationDays: 90 },
    { name: "6 tháng", size: "SMALL", rentalType: "MONTHLY", price: 700000, maxOpens: 999, durationDays: 180 },
  ];
  const largePlans = [
    { name: "1 ngày", size: "LARGE", rentalType: "ONCE", price: 15000, maxOpens: 2, durationDays: 1 },
    { name: "7 ngày", size: "LARGE", rentalType: "ONCE", price: 20000, maxOpens: 2, durationDays: 7 },
    { name: "5 lượt / 30 ngày", size: "LARGE", rentalType: "DAILY", price: 80000, maxOpens: 5, durationDays: 30 },
    { name: "10 lượt / 90 ngày", size: "LARGE", rentalType: "DAILY", price: 140000, maxOpens: 10, durationDays: 90 },
    { name: "1 tháng", size: "LARGE", rentalType: "MONTHLY", price: 250000, maxOpens: 999, durationDays: 30 },
    { name: "3 tháng", size: "LARGE", rentalType: "MONTHLY", price: 650000, maxOpens: 999, durationDays: 90 },
    { name: "6 tháng", size: "LARGE", rentalType: "MONTHLY", price: 1100000, maxOpens: 999, durationDays: 180 },
  ];

  for (const plan of [...smallPlans, ...largePlans]) {
    await prisma.pricePlan.upsert({
      where: { id: `${plan.size.toLowerCase()}-${plan.name.toLowerCase().replace(/ /g, '-')}` },
      update: plan,
      create: { id: `${plan.size.toLowerCase()}-${plan.name.toLowerCase().replace(/ /g, '-')}`, ...plan },
    });
  }

  // 2. Locations
  const location1 = await prisma.location.upsert({
    where: { id: "loc-bach-khoa" },
    update: {},
    create: {
      id: "loc-bach-khoa",
      name: "SmartBox Trường ĐH Bách Khoa",
      address: "268 Lý Thường Kiệt, P.14, Q.10, TP.HCM",
      latitude: 10.7795,
      longitude: 106.6989,
    },
  });

  // 3. Cabinets + Compartments
  const cabinetA = await prisma.cabinet.upsert({
    where: { id: "cabinet-a" },
    update: {},
    create: {
      id: "cabinet-a",
      locationId: location1.id,
      name: "Tủ A",
      mcp23017Bus: 1,
      mcp23017Address: 32,
    },
  });

  // Tủ A: 8 SMALL (A1-A8), 4 LARGE (B1-B4)
  for (let i = 1; i <= 8; i++) {
    const name = `A${i}`;
    await prisma.compartment.upsert({
      where: { cabinetId_name: { cabinetId: cabinetA.id, name } },
      update: {},
      create: { name, cabinetId: cabinetA.id, size: "SMALL", mcp23017PinLock: i - 1, mcp23017PinSensor: i + 11 },
    });
  }
  for (let i = 1; i <= 4; i++) {
    const name = `B${i}`;
    await prisma.compartment.upsert({
      where: { cabinetId_name: { cabinetId: cabinetA.id, name } },
      update: {},
      create: { name, cabinetId: cabinetA.id, size: "LARGE", mcp23017PinLock: i + 7, mcp23017PinSensor: i + 19 },
    });
  }

  // 4. Admin
  const adminHash = await bcrypt.hash("SmartBox@2024", 10);
  await prisma.admin.upsert({
    where: { email: "admin@smartbox.io" },
    update: {},
    create: { email: "admin@smartbox.io", passwordHash: adminHash, name: "SmartBox Admin", role: "SUPER_ADMIN" },
  });

  console.log("✓ Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 2.8 Chạy seed

```bash
npm run db:seed

# Output mong đợi:
# ✓ Seed completed

# Verify:
# psql postgres://postgres:211004@localhost:5432/smartbox \
#   -c "SELECT COUNT(*) FROM \"PricePlan\";"
# → 14
```

---

## Phase 3 — Core Infrastructure (Lib)

**Thời gian ước tính:** 20 phút

### 3.1 `src/lib/prisma.ts` — Prisma singleton

```typescript
import { PrismaClient } from '../generated/prisma';

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
```

### 3.2 `src/lib/jwt.ts` — JWT helpers

```typescript
import jwt from 'jsonwebtoken';

export function signToken(payload: object, secret: string, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string, secret: string): jwt.JwtPayload {
  return jwt.verify(token, secret) as jwt.JwtPayload;
}
```

### 3.3 `src/lib/qr.ts` — QR HMAC helpers

```typescript
import crypto from 'crypto';

export function signQrToken(rentalId: string, expiresAt: Date): string {
  const data = `${rentalId}:${expiresAt.toISOString()}`;
  const sig = crypto.createHmac('sha256', process.env.QR_SECRET!).update(data).digest('hex');
  return Buffer.from(`${data}:${sig}`).toString('base64url');
}

export function verifyQrToken(token: string): { rentalId: string; expiresAt: Date } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const [rentalId, expiresAtStr, sig] = decoded.split(':');
    const data = `${rentalId}:${expiresAtStr}`;
    const expected = crypto.createHmac('sha256', process.env.QR_SECRET!).update(data).digest('hex');
    if (sig !== expected) return null;
    const expiresAt = new Date(expiresAtStr);
    if (expiresAt < new Date()) return null;
    return { rentalId, expiresAt };
  } catch {
    return null;
  }
}
```

### 3.4 `src/lib/errors.ts` — Custom errors

```typescript
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

export const NotFoundError = (msg = 'Không tìm thấy') =>
  new AppError(404, 'NOT_FOUND', msg);

export const UnauthorizedError = (msg = 'Chưa xác thực') =>
  new AppError(401, 'UNAUTHORIZED', msg);

export const BadRequestError = (msg = 'Yêu cầu không hợp lệ') =>
  new AppError(400, 'BAD_REQUEST', msg);

export const ForbiddenError = (msg = 'Không có quyền') =>
  new AppError(403, 'FORBIDDEN', msg);
```

### 3.5 `src/lib/mqtt.ts` — MQTT client wrapper

```typescript
import mqtt, { MqttClient } from 'mqtt';

let client: MqttClient | null = null;

export function connectMqtt(): Promise<MqttClient> {
  return new Promise((resolve, reject) => {
    client = mqtt.connect(process.env.MQTT_BROKER_URL!, {
      username: process.env.MQTT_USERNAME || undefined,
      password: process.env.MQTT_PASSWORD || undefined,
      reconnectPeriod: 5000,
    });

    client.on('connect', () => {
      console.log('✓ MQTT connected');
      resolve(client!);
    });

    client.on('error', (err) => {
      console.error('MQTT error:', err.message);
    });

    client.on('offline', () => {
      console.warn('MQTT offline, reconnecting...');
    });
  });
}

export function getMqttClient(): MqttClient {
  if (!client) throw new Error('MQTT not initialized');
  return client;
}

export function publishMqtt(topic: string, payload: object): void {
  if (!client?.connected) {
    console.warn(`MQTT not connected, skipping publish: ${topic}`);
    return;
  }
  client.publish(topic, JSON.stringify(payload), { qos: 1 });
}

export function subscribeMqtt(topic: string, handler: (topic: string, payload: object) => void): void {
  client?.subscribe(topic, (err) => {
    if (err) {
      console.error(`MQTT subscribe error (${topic}):`, err.message);
      return;
    }
    console.log(`✓ MQTT subscribed: ${topic}`);
  });
  client?.on('message', (t, buf) => {
    if (mqtt.topicMatchesTopic(topic, t)) {
      try {
        handler(t, JSON.parse(buf.toString()));
      } catch {
        handler(t, {});
      }
    }
  });
}
```

### 3.6 `src/lib/socket.ts` — Socket.io setup

```typescript
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`));
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

export function joinCabinetRoom(socketId: string, cabinetId: string): void {
  io?.sockets.sockets.get(socketId)?.join(`cabinet:${cabinetId}`);
}
```

---

## Phase 4 — Middleware

**Thời gian ước tính:** 15 phút

### 4.1 `src/middleware/errorHandler.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }

  console.error('[Unhandled Error]', err);
  return res.status(500).json({ error: { code: 'INTERNAL', message: 'Lỗi server' } });
}
```

### 4.2 `src/middleware/validate.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const msgs = result.error.errors.map(e => e.message).join(', ');
      return res.status(400).json({ error: { code: 'VALIDATION', message: msgs } });
    }
    req.body = result.data;
    next();
  };
}
```

### 4.3 `src/middleware/auth.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import { UnauthorizedError, ForbiddenError } from '../lib/errors';

// Gắn vào Request
declare module 'express' {
  interface Request {
    admin?: { id: string; email: string; role: string };
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return next(UnauthorizedError('Thiếu token'));
  try {
    const payload = verifyToken(auth.slice(7), process.env.JWT_SECRET!);
    req.admin = { id: payload.sub!, email: payload.email!, role: payload.role! };
    next();
  } catch {
    next(UnauthorizedError('Token không hợp lệ'));
  }
}

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
  requireAdmin(req, _res, () => {
    if (req.admin?.role !== 'SUPER_ADMIN') return next(ForbiddenError('Cần quyền Super Admin'));
    next();
  });
}
```

### 4.4 `src/middleware/requestLogger.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
  });
  next();
}
```

---

## Phase 5 — Services (Business Logic)

**Thời gian ước tính:** 30 phút

### 5.1 `src/services/auth.service.ts`

| Method | Input | Logic | Output |
|--------|-------|-------|--------|
| `adminLogin` | email, password | Find admin → bcrypt.compare → sign JWT | `{ accessToken, refreshToken }` |
| `refreshToken` | refreshToken | Verify → sign new access | `{ accessToken }` |
| `verifyPin` | code, mode | Find ACTIVE rental by codeHash → check expiry, openCount | `{ authorized, rental, compartment }` |

### 5.2 `src/services/rental.service.ts`

| Method | Input | Logic | Output |
|--------|-------|-------|--------|
| `createRental` | phone, size, planId | Find/create User → find AVAILABLE compartment → generate code + bcrypt hash → create Rental → update Compartment → publish MQTT unlock → log | `{ rental, code, compartment }` |
| `getByCode` | code | Find rental by code | `Rental + Compartment` |
| `completeRental` | rentalId | Set COMPLETED, compartment → AVAILABLE | void |
| `cancelRental` | rentalId, adminId | Set CANCELLED, compartment → AVAILABLE | void |
| `handleUnlock` | rentalId | Increment openCount → check maxOpens → log | void |

### 5.3 `src/services/cabinet.service.ts`

| Method | Input | Logic | Output |
|--------|-------|-------|--------|
| `getCabinet` | id | Return cabinet + compartments + status | `Cabinet` |
| `updateCompartmentStatus` | compartmentId, lockStatus, doorStatus | Upsert CompartmentStatus → emit Socket.io | void |
| `updateHeartbeat` | cabinetId | Update Cabinet.lastHeartbeatAt | void |
| `getAvailableCompartments` | size | Return AVAILABLE compartments | `Compartment[]` |

### 5.4 `src/services/locker.service.ts`

| Method | Input | Logic | Output |
|--------|-------|-------|--------|
| `unlockCompartment` | cabinetId, compartmentId | Publish MQTT `smartbox/{cabinetId}/lock/{compartmentId}/unlock` → log attempt | void |
| `lockCompartment` | cabinetId, compartmentId | Publish MQTT `smartbox/{cabinetId}/lock/{compartmentId}/lock` | void |

### 5.5 `src/services/notification.service.ts`

| Method | Input | Logic | Output |
|--------|-------|-------|--------|
| `create` | userId, type, title, body, data | Create Notification record | `Notification` |
| `sendRentalExpired` | rentalId | Create RENTAL_EXPIRED notification | void |
| `sendCabinetOffline` | cabinetId, adminId | Create CABINET_OFFLINE notification | void |

---

## Phase 6 — Routes

**Thời gian ước tính:** 40 phút

### 6.1 Routes map (8 route files)

| File | Prefix | Endpoints | Auth |
|------|--------|-----------|------|
| `auth.routes.ts` | `/api/auth` | `POST /admin/login`, `POST /refresh`, `POST /verify-pin` | none / admin |
| `rentals.routes.ts` | `/api/rentals` | `POST /` (create), `GET /:code`, `POST /:id/unlock`, `POST /:id/complete` | none / admin |
| `lockers.routes.ts` | `/api/lockers` | `GET /available`, `GET /plans` | none |
| `cabinets.routes.ts` | `/api/admin/cabinets` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, `POST /:id/unlock/:compId` | admin |
| `locations.routes.ts` | `/api/public/locations` | `GET /`, `GET /:id`, `GET /:id/cabinets` | none |
| `rentals.admin.routes.ts` | `/api/admin/rentals` | `GET /`, `GET /:id`, `PUT /:id/cancel` | admin |
| `notifications.routes.ts` | `/api/notifications` | `GET /`, `PUT /:id/read` | user |
| `system.routes.ts` | `/api/system` | `POST /heartbeat`, `POST /locker-event`, `GET /status` | none (internal) |

### 6.2 Zod schemas cho mỗi route

```typescript
// Ví dụ: auth.routes.ts
import { z } from 'zod';

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const verifyPinSchema = z.object({
  code: z.string().length(6).regex(/^\d+$/),
  mode: z.enum(['deposit', 'pickup']).optional(),
});

const createRentalSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{10,11}$/),
  size: z.enum(['SMALL', 'LARGE']),
  planId: z.string(),
  paymentMethod: z.enum(['MOMO', 'ZALOPAY', 'VIETQR', 'CASH', 'NONE']).optional(),
});
```

---

## Phase 7 — Entry Point + Cron + MQTT Handlers

**Thời gian ước tính:** 20 phút

### 7.1 `src/index.ts`

```typescript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { connectMqtt, subscribeMqtt } from './lib/mqtt';
import { initSocket } from './lib/socket';
import { prisma } from './lib/prisma';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { setupMqttHandlers } from './mqtt/handlers';
import { startExpiryChecker } from './jobs/expiryChecker';
import { startHeartbeatMonitor } from './jobs/heartbeatMonitor';

import authRoutes from './routes/auth.routes';
import rentalsRoutes from './routes/rentals.routes';
import lockersRoutes from './routes/lockers.routes';
import cabinetsRoutes from './routes/cabinets.routes';
import locationsRoutes from './routes/locations.routes';
import rentalsAdminRoutes from './routes/rentals.admin.routes';
import notificationsRoutes from './routes/notifications.routes';
import systemRoutes from './routes/system.routes';

async function bootstrap() {
  const app = express();
  const httpServer = createServer(app);

  // 1. Middleware
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json());
  app.use(requestLogger);

  // 2. Init Socket.io
  initSocket(httpServer);

  // 3. Connect MQTT
  await connectMqtt();

  // 4. Register routes
  app.use('/api/auth', authRoutes);
  app.use('/api/rentals', rentalsRoutes);
  app.use('/api/lockers', lockersRoutes);
  app.use('/api/admin/cabinets', cabinetsRoutes);
  app.use('/api/public/locations', locationsRoutes);
  app.use('/api/admin/rentals', rentalsAdminRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/system', systemRoutes);

  // 5. Health check
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  // 6. Error handler
  app.use(errorHandler);

  // 7. Start cron jobs
  startExpiryChecker();
  startHeartbeatMonitor();

  // 8. MQTT handlers
  setupMqttHandlers();

  // 9. Start server
  const port = Number(process.env.PORT) || 3000;
  httpServer.listen(port, () => {
    console.log(`✓ SmartBox Backend running on http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
```

### 7.2 `src/jobs/expiryChecker.ts`

```
Schedule: every 1 minute
Logic:
  1. prisma.rental.findMany({ where: { status: 'ACTIVE', expiresAt: { lt: new Date() } } })
  2. For each: update status=EXPIRED, compartment.status=AVAILABLE
  3. Create Notification (RENTAL_EXPIRED)
  4. Create LockerLog(EXPIRED)
```

### 7.3 `src/jobs/heartbeatMonitor.ts`

```
Schedule: every 30 seconds
Logic:
  1. Find cabinets where lastHeartbeatAt < now - HEARTBEAT_TIMEOUT (90s)
  2. For each: update status=OFFLINE
  3. Create Notification (CABINET_OFFLINE)
```

### 7.4 `src/mqtt/handlers.ts`

Subscribe topics từ Pi:

| Topic | Payload | Handler |
|-------|---------|---------|
| `smartbox/+/lock/+/status` | `{ lockStatus, doorStatus }` | Update CompartmentStatus → emit Socket.io |
| `smartbox/+/event/+/` | `{ event, timestamp }` | Handle door open/close events |
| `smartbox/+/heartbeat` | `{ timestamp }` | Update Cabinet.lastHeartbeatAt → ONLINE |

---

## Phase 8 — Verification

**Thời gian ước tính:** 15 phút

### 8.1 Health check

```bash
# Backend health
curl http://localhost:3000/api/health
# → { "status": "ok", "timestamp": "..." }

# PostgreSQL
docker exec smartbox_postgres psql -U postgres -d smartbox -c "SELECT COUNT(*) FROM \"PricePlan\";"
# → 14

# Mosquitto (subscribe test)
docker exec smartbox_mosquitto mosquitto_sub -t "test/topic" -C 1 &
sleep 1
docker exec smartbox_mosquitto mosquitto_pub -t "test/topic" -m "hello"
# → hello
```

### 8.2 API smoke tests

```bash
# 1. Admin login
curl -s -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartbox.io","password":"SmartBox@2024"}' | jq .

# 2. Get plans
curl -s http://localhost:3000/api/lockers/plans | jq '.data | length'
# → 14

# 3. Get locations
curl -s http://localhost:3000/api/public/locations | jq '.data | length'
# → 2

# 4. Verify PIN (fake code → 404)
curl -s -X POST http://localhost:3000/api/auth/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"code":"000000"}' | jq .

# 5. Check availability
curl -s "http://localhost:3000/api/lockers/available?size=SMALL" | jq .

# 6. Create rental (with admin token)
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartbox.io","password":"SmartBox@2024"}' | jq -r '.data.accessToken')

# Pick a planId from step 2
curl -s -X POST http://localhost:3000/api/rentals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"phone":"0912345678","size":"SMALL","planId":"small-7-ngayy"}' | jq .
```

### 8.3 Kiosk integration test

```bash
# Update raspi_app/config.yaml
# api.base_url: "http://localhost:3000"  (thay vì localhost:5000)

# Update raspi_app/main.py line 32:
# mock=False,  (thay vì mock=True)

# Run kiosk
cd raspi_app && python main.py
```

---

## Phase 9 — MQTT Integration Test (Pi ↔ Backend)

### 9.1 Publish unlock từ backend

```bash
# Khi rental được tạo → backend publish:
# Topic: smartbox/cabinet-a/lock/A1/unlock
# Payload: { "rentalId": "...", "action": "unlock" }

# Subscribe từ máy dev:
docker exec smartbox_mosquitto mosquitto_sub -t "smartbox/+/lock/+/unlock" -v
```

### 9.2 Simulate Pi heartbeat

```bash
# Simulate Pi gửi heartbeat:
curl -s -X POST http://localhost:3000/api/system/heartbeat \
  -H "Content-Type: application/json" \
  -d '{"cabinetId":"cabinet-a"}'

# Verify cabinet status updated:
docker exec smartbox_postgres psql -U postgres -d smartbox \
  -c "SELECT name, status, lastHeartbeatAt FROM \"Cabinet\";"
```

---

## File Checklist

Sau khi hoàn thành tất cả phases, kiểm tra:

```
backend/
├── prisma/
│   ├── schema.prisma          ✅
│   ├── seed.ts                ✅
│   └── init.sql               ✅
├── src/
│   ├── index.ts               ✅
│   ├── lib/
│   │   ├── prisma.ts         ✅
│   │   ├── mqtt.ts           ✅
│   │   ├── socket.ts         ✅
│   │   ├── jwt.ts            ✅
│   │   ├── qr.ts             ✅
│   │   └── errors.ts         ✅
│   ├── middleware/
│   │   ├── auth.ts           ✅
│   │   ├── validate.ts       ✅
│   │   ├── errorHandler.ts   ✅
│   │   └── requestLogger.ts  ✅
│   ├── services/
│   │   ├── auth.service.ts   ✅
│   │   ├── rental.service.ts ✅
│   │   ├── cabinet.service.ts ✅
│   │   ├── locker.service.ts ✅
│   │   └── notification.service.ts ✅
│   ├── routes/
│   │   ├── auth.routes.ts    ✅
│   │   ├── rentals.routes.ts ✅
│   │   ├── lockers.routes.ts ✅
│   │   ├── cabinets.routes.ts ✅
│   │   ├── locations.routes.ts ✅
│   │   ├── rentals.admin.routes.ts ✅
│   │   ├── notifications.routes.ts ✅
│   │   └── system.routes.ts  ✅
│   ├── jobs/
│   │   ├── expiryChecker.ts  ✅
│   │   └── heartbeatMonitor.ts ✅
│   └── mqtt/
│       └── handlers.ts       ✅
├── .env                       ✅
├── package.json               ✅
└── tsconfig.json              ✅
docker-compose.yml             ✅
mosquitto/config/mosquitto.conf ✅
```

---

## Thứ tự triển khai đề xuất

```
Week 1
├── Day 1: Phase 0 + Phase 1 (Infrastructure)       [30 phút]
├── Day 2: Phase 2 (Project setup + DB schema)       [45 phút]
├── Day 3: Phase 3 (Core lib)                         [45 phút]
├── Day 4: Phase 4 (Middleware)                      [30 phút]
└── Day 5: Phase 5 (Services)                        [60 phút]

Week 2
├── Day 1: Phase 6 (Routes)                          [90 phút]
├── Day 2: Phase 7 (Entry point + Cron + MQTT)       [60 phút]
├── Day 3: Phase 8 (Verification + Fix issues)      [60 phút]
└── Day 4-5: Integration test với raspi_app          [120 phút]
```

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED 127.0.0.1:5432` | Postgres chưa start | `docker compose up -d postgres` |
| `ECONNREFUSED 127.0.0.1:1883` | Mosquitto chưa start | `docker compose up -d mosquitto` |
| `prisma: command not found` | Chưa `npm install` | `cd backend && npm install` |
| `JWT_SECRET is required` | .env chưa có giá trị | Kiểm tra `backend/.env` |
| `table does not exist` | Chưa `db:push` | `npm run db:push` |
| `npm run db:seed` fail | Seed script lỗi | Kiểm tra console log → fix schema/seed |
| Mosquitto port 1883 already in use | Port bị chiếm | `netstat -ano | findstr 1883` → kill process |
