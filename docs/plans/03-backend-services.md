# SmartBox Backend Services — Full Implementation Plan

## Context

Backend `backend/` hiện tại: **trống hoàn toàn** — chỉ có `.env` và Prisma generated client (`src/generated/prisma/`). Chưa có `package.json`, chưa có server, chưa có routes.

Cần implement đầy đủ backend theo design trong `docs/plans/01-foundation-design.md`:
- Express server + TypeScript
- REST API (Auth, Rentals, Cabinets, Plans, Locations, Admin, Notifications)
- MQTT Broker integration (Mosquitto via mqtt.js)
- Socket.io (WebSocket cho realtime dashboard)
- Cron jobs (expiry checker, heartbeat monitor)
- JWT + bcrypt auth

---

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **MQTT**: `mqtt.js` (publish/subscribe với Mosquitto broker)
- **WebSocket**: `socket.io`
- **Auth**: JWT (`jsonwebtoken`) + bcrypt
- **Jobs**: `node-cron`
- **Validation**: `zod`
- **Env**: `dotenv`

---

## Phase 1: Setup Project

### 1.1 `backend/package.json`

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
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.x",
    "bcrypt": "^5.x",
    "cors": "^2.8.5",
    "dotenv": "^16.x",
    "express": "^4.x",
    "jsonwebtoken": "^9.x",
    "mqtt": "^5.x",
    "node-cron": "^3.x",
    "socket.io": "^4.x",
    "zod": "^3.x"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.x",
    "@types/cors": "^2.x",
    "@types/express": "^4.x",
    "@types/jsonwebtoken": "^9.x",
    "@types/node": "^20.x",
    "@types/node-cron": "^3.x",
    "prisma": "^5.x",
    "ts-node-dev": "^2.x",
    "typescript": "^5.x"
  }
}
```

### 1.2 `backend/tsconfig.json`

Standard tsconfig cho Node.js + Express.

### 1.3 `backend/prisma/schema.prisma`

Tạo schema đầy đủ từ design doc section 2.2. (Prisma generated client đã có sẵn trong `src/generated/prisma/`, nhưng schema.prisma gốc chưa tồn tại — cần tạo lại từ design doc).

### 1.4 `backend/.env`

Update với đầy đủ vars từ design doc section 4.1:
```
DATABASE_URL="postgresql://postgres:211004@localhost:5432/smartbox?schema=public"
JWT_SECRET=dev_jwt_secret
JWT_REFRESH_SECRET=dev_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=
MQTT_PASSWORD=
QR_SECRET=dev_qr_secret
HEARTBEAT_INTERVAL=30
HEARTBEAT_TIMEOUT=90
CORS_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@smartbox.io
ADMIN_PASSWORD=SmartBox@2024
ADMIN_NAME=SmartBox Admin
PAYMENT_MOCK_ENABLED=true
LOG_LEVEL=info
```

### 1.5 `backend/prisma/seed.ts`

Tạo seed data từ design doc section 2.3:
- 14 PricePlans (7 SMALL + 7 LARGE)
- 2 Locations
- 2 Cabinets với compartments
- 1 Admin user

---

## Phase 2: Core Infrastructure

### 2.1 `src/index.ts` — Entry Point

```typescript
async function bootstrap() {
  // 1. Load env
  // 2. Connect Prisma
  // 3. Init MQTT client (connect to Mosquitto)
  // 4. Init Socket.io
  // 5. Register routes
  // 6. Start cron jobs
  // 7. Start HTTP server
}
```

### 2.2 `src/lib/prisma.ts`

Prisma client singleton (reuse connection).

### 2.3 `src/lib/mqtt.ts`

MQTT client wrapper:
```typescript
// Connect to Mosquitto broker
// Publish: cabinet lock/unlock commands
// Subscribe: cabinet status updates
// Reconnect logic with exponential backoff
```

### 2.4 `src/lib/socket.ts`

Socket.io setup:
```typescript
// CORS: allow frontend origin
// Auth: verify JWT token
// Rooms: one room per cabinetId for targeted broadcasts
// Events: cabinet:status, compartment:status, notification
```

### 2.5 `src/lib/jwt.ts`

JWT helpers:
```typescript
function signToken(payload, secret, expiresIn): string
function verifyToken(token, secret): JwtPayload
function signRefreshToken(payload): string
```

### 2.6 `src/lib/qr.ts`

QR token helpers (HMAC-SHA256):
```typescript
function signQrToken(rentalId: string, expiresAt: Date): string
function verifyQrToken(token: string): { rentalId, expiresAt } | null
```

### 2.7 `src/lib/errors.ts`

Custom error classes:
```typescript
class AppError extends Error { status, code }
class NotFoundError extends AppError { 404 }
class UnauthorizedError extends AppError { 401 }
class BadRequestError extends AppError { 400 }
```

---

## Phase 3: Middleware

### 3.1 `src/middleware/auth.ts`

```typescript
// verifyAdmin(req) — checks JWT + admin role
// verifyUser(req)  — checks JWT (for authenticated endpoints)
// optionalAuth(req) — sets user if token present, else continues
```

### 3.2 `src/middleware/validate.ts`

Zod middleware factory:
```typescript
function validate<T>(schema: ZodSchema<T>)
```

### 3.3 `src/middleware/errorHandler.ts`

Express error handler — catches all errors, returns JSON `{ error, code, message }`.

### 3.4 `src/middleware/requestLogger.ts`

Log incoming requests (method, path, duration).

---

## Phase 4: Services (Business Logic)

### 4.1 `src/services/auth.service.ts`

```typescript
class AuthService {
  async verifyPin(code: string) {
    // 1. Find ACTIVE rental by code
    // 2. Check bcrypt hash matches
    // 3. Check not expired
    // 4. Check openCount < maxOpens (or unlimited)
    // 5. Return { authorized: true, compartmentId, openCount, maxOpens }
  }

  async adminLogin(email, password) {
    // 1. Find admin
    // 2. bcrypt.compare password
    // 3. Sign JWT
    // 4. Return { accessToken, refreshToken }
  }

  async refreshToken(refreshToken) {
    // 1. Verify refresh token
    // 2. Sign new access token
    // 3. Return { accessToken }
  }
}
```

### 4.2 `src/services/rental.service.ts`

```typescript
class RentalService {
  async createRental({ phone, size, planId }) {
    // 1. Validate phone (E.164 format)
    // 2. Find or create User by phone
    // 3. Find AVAILABLE compartment of given size
    // 4. Generate 6-digit code (random, unique)
    // 5. bcrypt hash code
    // 6. Create rental record
    // 7. Update compartment status to OCCUPIED
    // 8. Generate QR token (HMAC)
    // 9. Publish MQTT unlock command
    // 10. Log LockerLog(OPENED)
    // 11. Return { rentalId, code, compartmentId, expiresAt, qrToken }
  }

  async getRentalByCode(code: string) {
    // Return rental with compartment + pricePlan details
  }

  async completeRental(rentalId: string) {
    // Set status = COMPLETED, compartment = AVAILABLE
  }

  async cancelRental(rentalId: string, adminId: string) {
    // Set status = CANCELLED, compartment = AVAILABLE
  }

  async handleUnlock(rentalId: string) {
    // Increment openCount
    // Check if exceeded maxOpens → mark COMPLETED
    // Log LockerLog(OPENED)
  }
}
```

### 4.3 `src/services/cabinet.service.ts`

```typescript
class CabinetService {
  async getCabinet(id: string) {
    // Return cabinet with compartments + status
  }

  async getCabinetsByLocation(locationId: string) {
    // Return all cabinets at location
  }

  async updateCompartmentStatus(id, lockStatus, doorStatus) {
    // Upsert CompartmentStatus record
    // Broadcast Socket.io event
  }

  async updateHeartbeat(cabinetId: string) {
    // Update Cabinet.lastHeartbeatAt
  }

  async getAvailableCompartments(size: CompartmentSize) {
    // Return all AVAILABLE compartments
  }
}
```

### 4.4 `src/services/locker.service.ts`

```typescript
class LockerService {
  async unlockCompartment(cabinetId: string, compartmentId: string) {
    // 1. Find rental for this compartment (ACTIVE)
    // 2. Publish MQTT: smartbox/{cabinetId}/lock/{compartmentId}/unlock
    // 3. Log attempt
  }

  async publishLockEvent(cabinetId: string, compartmentId: string, action: string) {
    // Publish to MQTT topic for Pi to receive
  }
}
```

### 4.5 `src/services/notification.service.ts`

```typescript
class NotificationService {
  async create(userId: string, type: NotificationType, title: string, body: string, data?: object)
  async sendRentalExpired(rentalId: string)
  async sendCabinetOffline(cabinetId: string)
}
```

---

## Phase 5: Routes

### 5.1 `src/routes/auth.routes.ts`

```
POST /api/auth/admin/login         — admin login
POST /api/auth/refresh             — refresh token
POST /api/auth/verify-pin          — kiosk verify 6-digit code
```

### 5.2 `src/routes/rentals.routes.ts`

```
POST   /api/rentals                — create rental (kiosk: phone + size + plan)
GET    /api/rentals/:code          — get rental by code
GET    /api/rentals/:id/qr         — get QR code data
POST   /api/rentals/:id/unlock     — trigger unlock (kiosk)
POST   /api/rentals/:id/complete   — mark rental completed
PUT    /api/rentals/:id/cancel     — admin cancel
```

### 5.3 `src/routes/lockers.routes.ts`

```
GET    /api/lockers/available      — check availability by size
GET    /api/lockers/plans          — get all active plans
GET    /api/lockers/plans?size=    — get plans by size
```

### 5.4 `src/routes/cabinets.routes.ts` (Admin)

```
GET    /api/admin/cabinets         — list all cabinets
GET    /api/admin/cabinets/:id    — cabinet detail with compartments
POST   /api/admin/cabinets         — create cabinet
PUT    /api/admin/cabinets/:id    — update cabinet
DELETE /api/admin/cabinets/:id    — soft delete (set INACTIVE)
POST   /api/admin/cabinets/:id/unlock/:compartmentId  — manual unlock
```

### 5.5 `src/routes/locations.routes.ts`

```
GET    /api/public/locations       — public location list (no auth)
GET    /api/public/locations/:id   — location detail
GET    /api/public/locations/:id/cabinets  — cabinets at location
```

### 5.6 `src/routes/rentals.admin.routes.ts` (Admin)

```
GET    /api/admin/rentals          — list rentals (with filters: status, date)
GET    /api/admin/rentals/:id      — rental detail
PUT    /api/admin/rentals/:id/cancel  — cancel
```

### 5.7 `src/routes/notifications.routes.ts`

```
GET    /api/notifications          — user notifications
PUT    /api/notifications/:id/read — mark read
```

### 5.8 `src/routes/system.routes.ts`

```
POST   /api/system/heartbeat        — Pi heartbeat
POST   /api/system/locker-event    — Pi reports lock/unlock/door event
GET    /api/system/status          — health check
```

---

## Phase 6: Cron Jobs

### 6.1 `src/jobs/expiryChecker.ts`

```
Schedule: every 1 minute
Action:
  - Find ACTIVE rentals where expiresAt < now()
  - Set status = EXPIRED
  - Set compartment status = AVAILABLE
  - Create Notification (RENTAL_EXPIRED)
  - Log LockerLog(EXPIRED)
```

### 6.2 `src/jobs/heartbeatMonitor.ts`

```
Schedule: every 30 seconds
Action:
  - Find cabinets where lastHeartbeatAt < (now - HEARTBEAT_TIMEOUT)
  - Set status = OFFLINE
  - Create Notification (CABINET_OFFLINE)
```

---

## Phase 7: MQTT Event Handlers

### 7.1 `src/mqtt/handlers.ts`

Subscribe topics from Pi:
```
smartbox/{cabinetId}/lock/{compartmentId}/status
  → Update CompartmentStatus (lockStatus, doorStatus)
  → Broadcast Socket.io: compartment:status

smartbox/{cabinetId}/event/{compartmentId}/
  → Door opened/closed
  → Handle unlock acknowledgment

smartbox/{cabinetId}/heartbeat
  → Update Cabinet.lastHeartbeatAt → ONLINE
```

Publish topics to Pi:
```
smartbox/{cabinetId}/lock/{compartmentId}/unlock
  → Pi receives → opens solenoid

smartbox/{cabinetId}/lock/{compartmentId}/lock
  → Pi receives → closes solenoid
```

---

## Phase 8: API Response Format

```typescript
// Success
{ data: T }

// Error
{ error: { code: string, message: string } }

// Paginated
{ data: T[], pagination: { total, page, limit } }
```

---

## File Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Full Prisma schema
│   ├── seed.ts                # Seed data
│   └── init.sql               # DB init (extensions, timezone)
├── src/
│   ├── index.ts               # Entry point
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── mqtt.ts            # MQTT client wrapper
│   │   ├── socket.ts          # Socket.io setup
│   │   ├── jwt.ts             # JWT helpers
│   │   ├── qr.ts              # QR token HMAC helpers
│   │   └── errors.ts          # Custom error classes
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification
│   │   ├── validate.ts        # Zod validation
│   │   ├── errorHandler.ts    # Global error handler
│   │   └── requestLogger.ts   # Request logging
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── rental.service.ts
│   │   ├── cabinet.service.ts
│   │   ├── locker.service.ts
│   │   └── notification.service.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── rentals.routes.ts
│   │   ├── lockers.routes.ts
│   │   ├── cabinets.routes.ts
│   │   ├── locations.routes.ts
│   │   ├── rentals.admin.routes.ts
│   │   ├── notifications.routes.ts
│   │   └── system.routes.ts
│   ├── jobs/
│   │   ├── expiryChecker.ts
│   │   └── heartbeatMonitor.ts
│   └── mqtt/
│       └── handlers.ts
├── .env
├── package.json
├── tsconfig.json
└── Dockerfile                  # (từ design doc section 3.5)
```

---

## Verification

1. `npm install` → all deps installed
2. `npm run db:push` → schema applied to PostgreSQL
3. `npm run db:seed` → seed data inserted
4. `npm run dev` → server starts on port 3000
5. `POST /api/auth/admin/login` → returns JWT
6. `GET /api/lockers/plans` → returns 14 plans
7. `POST /api/auth/verify-pin` with fake code → 404 not found
8. `POST /api/system/heartbeat` → OK
9. Mosquitto broker receives MQTT messages from backend
