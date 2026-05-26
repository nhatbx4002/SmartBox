# SmartBox IoT System — Implementation Plan

## Context

Xây dựng hệ thống IoT smart locker hoàn chỉnh gồm 5 thành phần:
- **Hardware**: Raspberry Pi 3 + MCP23017 + Solenoid locks + Magnetic sensors
- **Kiosk App**: PySide6 (Python), chạy trên Pi 3 touchscreen 720×1280
- **Backend**: Node.js + Express.js + Prisma + PostgreSQL + WebSocket
- **Web Dashboard**: Admin quản lý tủ/ngăn, xem trạng thái realtime
- **Android App**: User thuê tủ, quét QR, nhận thông báo

**Thứ tự ưu tiên**: Kiosk (mock backend) → Backend thật → Web Dashboard → Android App
**Framework**: Express.js

---

## PHASE 1: Database & Backend Foundation

### 1.1. Thiết kế Prisma Schema

**File**: `backend/prisma/schema.prisma`

```
Enums:
- AdminRole: SUPER_ADMIN, CABINET_ADMIN
- UserStatus: ACTIVE, SUSPENDED
- CabinetStatus: ACTIVE, INACTIVE, OFFLINE
- CompartmentSize: SMALL, LARGE
- CompartmentStatus: AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED
- LockStatus: LOCKED, UNLOCKED, FAULTY
- DoorStatus: CLOSED, OPEN, UNKNOWN
- RentalType: ONCE, DAILY, MONTHLY
- RentalStatus: ACTIVE, COMPLETED, CANCELLED, EXPIRED
- PaymentStatus: PENDING, PAID, REFUNDED, FAILED
- PaymentMethod: MOMO, ZALOPAY, VIETQR, CASH, NONE
- LockerAction: OPENED, CLOSED, EXPIRED, DENIED, NO_SHOW, HEARTBEAT, FAULTY
- NotificationType: RENTAL_EXPIRED, CABINET_OFFLINE, RENTAL_STARTED, PAYMENT_SUCCESS, SYSTEM

Models:
1. Admin { id, email(unique), passwordHash, name, role, createdAt, updatedAt }
2. User { id, email(unique,nullable), phone(unique), passwordHash(nullable), name(nullable), status, createdAt, updatedAt }
3. Location { id, name, address, latitude, longitude, googlePlaceId(nullable), status, createdAt, updatedAt }
4. Cabinet { id, locationId, name, mcp23017_bus, mcp23017_address, status, lastHeartbeatAt, createdAt, updatedAt }
   relations: location→Location, compartments→Compartment, logs→LockerLog
5. Compartment { id, cabinetId, name, size, mcp23017_pin_lock, mcp23017_pin_sensor, status, createdAt, updatedAt }
   relations: cabinet→Cabinet, rentals→Rental, compartmentStatus→CompartmentStatus
6. CompartmentStatus { id, compartmentId(unique), lockStatus, doorStatus, lastUpdatedAt }
   relations: compartment→Compartment
7. PricePlan { id, name, size, rentalType, price, maxOpens(nullable=unlimited), durationDays, description, isActive, createdAt, updatedAt }
8. Rental { id, userId(nullable), compartmentId, pricePlanId, code(6digits,unique), codeHash, qrToken, openCount(default=0), maxOpens, expiresAt, paymentStatus, paymentMethod, paidAt(nullable), status, createdAt, updatedAt }
   relations: user→User(nullable), compartment→Compartment, pricePlan→PricePlan, logs→LockerLog
9. LockerLog { id, cabinetId(nullable), compartmentId(nullable), rentalId(nullable), action, attemptCount, success, ipAddress(nullable), deviceInfo(nullable), note(nullable), createdAt }
   relations: cabinet→Cabinet(nullable), compartment→Compartment(nullable), rental→Rental(nullable)
10. Notification { id, userId, title, body, type, data(JSON,nullable), isRead(default=false), sentAt, createdAt }
    relations: user→User
11. UserSession { id, userId, socketId, deviceType(ANDROID/WEB/KIOSK), deviceInfo(nullable), connectedAt, disconnectedAt(nullable), isActive }
    relations: user→User

Indexes:
- Cabinet: locationId
- Compartment: cabinetId, status
- CompartmentStatus: compartmentId
- Rental: code, qrToken, userId, compartmentId, status, expiresAt
- LockerLog: compartmentId, cabinetId, rentalId, createdAt
- Notification: userId, isRead
```

### 1.2. Docker Setup

**File**: `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: smartbox
    ports: ["5432:5432"]
    volumes:
      - postgres_data:/var/lib/postgresql/data
  backend:
    build: ./backend
    ports: ["3000:3000"]
    env_file: ./backend/.env
    depends_on: [postgres]
  mosquitto:
    image: eclipse-mosquitto:2
    ports: ["1883:1883", "9001:9001"]
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
```

### 1.3. Express.js Backend Setup

**Files**:
- `backend/package.json` — dependencies: express, prisma, @prisma/client, jsonwebtoken, bcryptjs, cors, helmet, dotenv, socket.io, mqtt, zod (validation), express-async-errors
- `backend/src/index.ts` — entry point
- `backend/src/app.ts` — Express app setup (middleware, routes)
- `backend/src/config/` — env config
- `backend/src/routes/` — route files
- `backend/src/controllers/` — controller files
- `backend/src/services/` — business logic
- `backend/src/middleware/` — auth, error handler, validation
- `backend/src/websocket/` — Socket.io setup
- `backend/src/mqtt/` — MQTT broker/client setup

---

## PHASE 2: Backend API — Auth & Core

### 2.1. Authentication

- **POST /api/auth/admin/login** — admin login, returns JWT
- **POST /api/auth/user/register** — user register (phone/email)
- **POST /api/auth/user/login** — user login
- **POST /api/auth/user/refresh** — refresh JWT
- Middleware: `authenticateAdmin`, `authenticateUser`

### 2.2. Cabinet & Compartment Management (Admin)

- **GET /api/admin/cabinets** — list cabinets (filter by location)
- **POST /api/admin/cabinets** — create cabinet + auto-generate compartments
- **GET /api/admin/cabinets/:id** — cabinet detail with compartments
- **PUT /api/admin/cabinets/:id** — update cabinet
- **DELETE /api/admin/cabinets/:id** — soft delete
- **POST /api/admin/cabinets/:id/provision** — auto-provision compartments based on config (size groups)
- **GET /api/admin/compartments/:id** — compartment detail + status
- **PUT /api/admin/compartments/:id** — update compartment (size, pin, status)
- **POST /api/admin/compartments/:id/reset** — reset compartment to available

### 2.3. Location Management (Admin)

- **GET /api/admin/locations** — list locations
- **POST /api/admin/locations** — create location
- **PUT /api/admin/locations/:id** — update
- **GET /api/public/locations** — public list for app

### 2.4. Price Plans (Admin)

- **GET /api/admin/plans** — list all
- **POST /api/admin/plans** — create plan
- **PUT /api/admin/plans/:id** — update
- **GET /api/public/plans?size=SMALL** — public list filtered by size

### 2.5. Rental Management

**Kiosk/App**:
- **POST /api/rentals** — create rental (select compartment → pay → get PIN)
  - Request: `{ phone?, size, planId, cabinetId? }`
  - Response: `{ rentalId, code, qrToken, compartmentId, expiresAt }`
  - Logic: auto-assign available compartment → mock payment → generate PIN → send to user

- **POST /api/rentals/verify-pin** — verify PIN from kiosk (gửi/nhận đồ)
  - Request: `{ code }` (6 digits)
  - Response: `{ authorized, rentalId, compartmentId, openCount, maxOpens, remaining }`
  - Logic: find active rental by code → check not expired → increment openCount → log action

- **POST /api/rentals/unlock** — trigger unlock after PIN verified
  - Request: `{ rentalId, compartmentId }`
  - Response: `{ success, mcp23017_bus, mcp23017_address, mcp23017_pin_lock }`
  - Logic: find compartment → publish MQTT unlock command → return pin info for Pi

- **GET /api/rentals/user/me** — user's rental history (app)

**Admin**:
- **GET /api/admin/rentals** — list all rentals (filter by date, status, location)
- **GET /api/admin/rentals/:id** — rental detail
- **PUT /api/admin/rentals/:id/cancel** — cancel rental
- **PUT /api/admin/rentals/:id/extend** — extend expiry

### 2.6. Hardware Integration (MQTT)

**Topics**:
```
smartbox/{cabinetId}/lock/{compartmentId}/unlock    — Pi subscribes, backend publishes
smartbox/{cabinetId}/lock/{compartmentId}/lock      — Pi subscribes, backend publishes
smartbox/{cabinetId}/lock/{compartmentId}/status    — Pi publishes (door+lock sensor state)
smartbox/{cabinetId}/heartbeat                      — Pi publishes every 30s
smartbox/{cabinetId}/event/{compartmentId}          — Pi publishes (opened/closed/error)
```

**Message format** (JSON):
```json
// status update from Pi
{ "lockStatus": "LOCKED", "doorStatus": "CLOSED", "timestamp": 1234567890 }

// heartbeat
{ "uptime": 3600, "freeMemory": 102400, "temperature": 45.5 }

// event
{ "action": "OPENED", "compartmentId": "abc", "timestamp": 1234567890 }
```

### 2.7. WebSocket (Socket.io)

**Events**:
- `cabinet:status` — broadcast when cabinet goes online/offline
- `compartment:status` — broadcast when lock/door state changes
- `rental:created` — notify admin of new rental
- `notification:new` — push notification to specific user
- `rental:expiring` — remind user 1 hour before expiry

### 2.8. Locker Log (Audit)

- Auto-log: every lock/unlock action from MQTT
- Manual log: PIN verification attempt (success/failure)
- Admin log: all admin actions

### 2.9. Offline Detection

- Pi sends MQTT heartbeat every 30s
- Backend marks Cabinet `status = OFFLINE` if no heartbeat > 90s
- Backend marks Cabinet `status = ACTIVE` when heartbeat resumes
- Broadcast to all WebSocket clients on status change

---

## PHASE 3: Kiosk App — Implement Full Screens + Mock Services

### 3.1. Service Layer

**`services/api_client.py`** — calls backend REST API
- `verify_pin(pin)` → authorized
- `create_rental(phone, size, plan_id)` → rental data
- `check_availability(size)` → available compartments
- `get_plans(size)` → price plans

**`services/mqtt_client.py`** — MQTT pub/sub
- Subscribe: `smartbox/+/lock/+/status`, `smartbox/+/event/+/`
- Publish: `smartbox/{cabinetId}/lock/{id}/unlock`
- Connect to broker at startup

**`services/gpio_controller.py`** — MCP23017 I2C control
- `unlock(pin)` — set pin HIGH to energize relay → unlock solenoid
- `lock(pin)` — set pin LOW → de-energize → spring lock
- `read_sensor(pin)` — read magnetic sensor state (door open/closed)
- `get_compartment_status(pin_lock, pin_sensor)` → {lock, door}

### 3.2. Screen Controllers (in `screens/`)

Each screen = 1 Python file with:
- Load `.ui` file via QUiLoader
- Wire signals to handlers
- Call appropriate service
- Navigate to next screen

**Screens**:
- `screens/home_screen.py` — dashboard (btnSend, btnReceive, btnRent, btnSupport)
- `screens/otp_deposit_screen.py` — 6-digit PIN input, orange theme
- `screens/otp_pickup_screen.py` — 6-digit PIN input, blue theme
- `screens/rent_size_screen.py` — select SMALL/LARGE
- `screens/rent_plan_screen.py` — select pricing plan
- `screens/rent_phone_screen.py` — enter phone number
- `screens/payment_screen.py` — mock payment (radio: MoMo/ZaloPay/VietQR/Cash)
- `screens/rent_success_screen.py` — show PIN, btnOpenNow/btnUseLater
- `screens/support_screen.py` — hotline + FAQ
- `screens/processing_screen.py` — loading overlay
- `screens/locker_open_screen.py` — countdown + locker open overlay
- `screens/components/header.py` — reusable header with back button + clock
- `screens/components/footer.py` — reusable footer with version + status

### 3.3. Navigation & State

- `main.py` manages `QStackedWidget` navigation
- Global state dict: `{ rental_data, selected_size, selected_plan, phone, pin_code }`
- Navigation stack for back button support

---

## PHASE 4: Web Dashboard

### 4.1. Tech Stack

- **React + Vite** (frontend)
- **React Router** (navigation)
- **Socket.io-client** (realtime)
- **Tailwind CSS** (styling)
- **Axios** (API calls)
- **React Query** (data fetching + caching)

### 4.2. Pages

- `/login` — admin login
- `/dashboard` — overview stats (total cabinets, occupancy rate, revenue today)
- `/locations` — CRUD locations
- `/cabinets` — list cabinets, status badges (online/offline), heartbeat timestamp
- `/cabinets/:id` — cabinet detail → compartments grid (color-coded by status)
- `/rentals` — rental history, filters (date, status, location)
- `/notifications` — system notifications log

### 4.3. Realtime Features

- Cabinet status update in real-time via Socket.io
- Compartment status grid refreshes automatically
- Notification toast when cabinet goes offline

---

## PHASE 5: Android App

### 5.1. Tech Stack

- **Kotlin + Jetpack Compose**
- **Retrofit + OkHttp** (REST API)
- **Socket.io-client-kotlin** (WebSocket)
- **CameraX + ML Kit** (QR scanning)
- **Hilt** (DI)
- **DataStore** (local preferences)

### 5.2. Screens

- **Splash / Login / Register**
- **Home** — list of locations with map
- **Location Detail** — cabinets at location + availability
- **Rent Flow** — select size → select plan → payment → PIN/QR display
- **My Rentals** — active + history rentals
- **QR Scanner** — scan QR to verify + unlock
- **Notifications** — in-app notifications from WebSocket

### 5.3. QR Code Format

QR contains JSON string:
```json
{
  "rentalId": "clxxx",
  "token": "hmac_sha256",
  "expiresAt": "ISO8601"
}
```
App decodes QR → sends to `/api/rentals/verify-pin` with `qrToken` instead of `code`

## Final Decisions

- **Backend framework**: Express.js
- **Web Dashboard**: React + Vite
- **Admin creation**: Seed từ CLI (`npx prisma db seed` hoặc `node scripts/create-admin.js`)
- **Provisioning ngăn**: Auto-generate — khi tạo cabinet, admin chỉ định số ngăn nhỏ/lớn, hệ thống tự tạo tên (A1, A2...), gán chân MCP23017 tự động từ config
- **Thứ tự ưu tiên**: Kiosk mock → Backend → Web → App Android

---

## Implementation Order

```
Step 1:  Database — Prisma schema + Docker Compose
Step 2:  Backend Auth — Express setup + JWT auth
Step 3:  Backend Core — Cabinets, Compartments, Locations, PricePlans CRUD
Step 4:  Backend Rental — PIN generation, verify, unlock, MQTT
Step 5:  Backend Realtime — Socket.io + offline detection
Step 6:  Kiosk Services — api_client, mqtt_client, gpio_controller
Step 7:  Kiosk Screens — all screens + navigation
Step 8:  Kiosk Hardware — wire to real MCP23017
Step 9:  Web Dashboard — admin pages + realtime
Step 10: Android App — user flow + QR scanning
```

---

## Critical Files

| File | Purpose |
|------|---------|
| `backend/prisma/schema.prisma` | Database schema (foundation) |
| `backend/src/app.ts` | Express app setup |
| `backend/src/routes/` | All API routes |
| `backend/src/services/rental.service.ts` | Rental business logic |
| `backend/src/services/mqtt.service.ts` | MQTT broker integration |
| `backend/src/websocket/index.ts` | Socket.io server |
| `docker-compose.yml` | Container orchestration |
| `raspi_app/services/api_client.py` | Kiosk → Backend HTTP |
| `raspi_app/services/gpio_controller.py` | MCP23017 hardware control |
| `raspi_app/main.py` | Kiosk navigation + state |
| `raspi_app/screens/*.py` | Individual screen controllers |
| `web-dashboard/src/` | React app source |
| `android-app/` | Kotlin Android source |

---

## Verification

- Backend: `npm run dev` → test all endpoints with curl/Postman
- Kiosk mock: `python main.py` → navigate all screens on dev machine
- Kiosk real: deploy to Pi, test with real locker hardware
- Web Dashboard: `npm run dev` → login as admin → test all pages
- Android: build APK → install on device → test rental flow end-to-end
