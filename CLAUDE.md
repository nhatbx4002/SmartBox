# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartBox is a self-service smart locker kiosk system with three primary components:

| Component | Stack | Description |
|-----------|-------|-------------|
| **Backend** (`backend/`) | Node.js/TypeScript + Express + Prisma | REST API server, MQTT broker, background jobs |
| **Kiosk App** (`raspi_app/`) | Python 3.13+ / PySide6 | Raspberry Pi 3 kiosk UI (720×1280px touchscreen) |
| **Web Dashboard** (`web_dashboard/`) | React 18 + Vite + Tailwind | Admin dashboard for system management |

Infrastructure: PostgreSQL 16 + Eclipse Mosquitto (Docker Compose)

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                Raspberry Pi 3 (Kiosk)                          │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         SmartBox Kiosk App (PySide6 / Qt Designer)       │  │
│  │  Screens: Home → OTP → Rent → Payment → Success          │  │
│  │  services/api_client.py  ──HTTP──►  :3001              │  │
│  │  services/mqtt_client.py ──MQTT──►  Broker (1883)      │  │
│  │  services/gpio_controller.py ──► MCP23017 (I2C)         │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
                        HTTP REST + MQTT
                              ▼
┌───────────────────────────────────────────────────────────────┐
│  Backend (Node.js + Express + Prisma + PostgreSQL) :3001      │
│  ├── REST API (auth, rentals, admin, provisioning)            │
│  ├── Socket.io (real-time cabinet/compartment status)         │
│  ├── MQTT broker client (lock commands, events)              │
│  └── Background jobs (expiry checker, heartbeat monitor)       │
└───────────────────────────────────────────────────────────────┘
                              ▼
            PostgreSQL (5432) + Mosquitto (1883 / 9001)
```

## Tech Stack Summary

### Backend
- **Runtime:** Node.js + TypeScript (ES2022, CommonJS)
- **Framework:** Express.js
- **ORM:** Prisma 5.22 + PostgreSQL 16
- **Auth:** JWT (access: 15min, refresh: 7d, cabinet: 365d)
- **Real-time:** Socket.io 4.8
- **MQTT:** Eclipse Mosquitto via `mqtt` npm v5
- **Validation:** Zod
- **Password hashing:** bcrypt
- **Scheduling:** node-cron

### Kiosk App
- **Python 3.13+** + **PySide6 6.11+**
- **MQTT:** `paho-mqtt` 2.1
- **Hardware:** `smbus2` (MCP23017 I2C GPIO)
- **Config:** `PyYAML`
- **UI:** Qt Designer `.ui` files via `QUiLoader`

### Web Dashboard
- **React 18** + **TypeScript** + **Vite 5**
- **Styling:** Tailwind CSS 3.4 (dark theme)
- **State:** Zustand (auth + UI stores)
- **Server state:** TanStack React Query v5
- **Routing:** React Router v6
- **HTTP:** Axios + JWT interceptors
- **Real-time:** Socket.io-client
- **Charts:** Recharts
- **UI:** Radix UI + Lucide icons + Sonner toasts

## Database Schema (Prisma)

### Core Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `Admin` | Admin users | email (unique), passwordHash, role (SUPER_ADMIN / CABINET_ADMIN) |
| `User` | End users (renters) | phone (unique), email (unique), status |
| `Location` | Physical locations | name, address, lat/lng, googlePlaceId, status |
| `Cabinet` | Locker bank at a location | locationId, profileId, status, lastHeartbeatAt, hardwareSerial, configVersion, provisionCode |
| `McpDevice` | MCP23017 I2C expanders per cabinet | cabinetId, bus, address, role (LOCK / SENSOR) |
| `Compartment` | Individual locker cell | cabinetId, name, size (SMALL / LARGE), mcp23017PinLock, mcp23017PinSensor, status |
| `CompartmentStatus` | Real-time door/lock state | compartmentId, lockStatus, doorStatus, lastUpdatedAt |
| `ProvisioningConfig` | Global provisioning settings | strategy, provisionKey, provisionSecret, webhookUrl |
| `ProvisionProfile` | Cabinet template | name, provisionKey, mode, templateRows, templateCols, templateSizes (JSON matrix) |
| `CabinetCredential` | MQTT credentials per cabinet | cabinetId, mqttUsername, mqttPassword |
| `PricePlan` | Rental pricing | name, size, rentalType (ONCE / DAILY / MONTHLY), price, maxOpens, durationDays |
| `Rental` | Active rental record | userId, compartmentId, code (PIN, bcrypt hashed), qrToken (HMAC-signed), openCount, maxOpens, expiresAt, paymentStatus, paymentMethod |
| `LockerLog` | Lock activity log | action (OPENED / CLOSED / EXPIRED / DENIED / HEARTBEAT / FAULTY) |
| `AuditLog` | Admin action audit | adminId, action, resource, resourceId, details (JSON), ipAddress |
| `Notification` | User notifications | userId, type, title, body, data (JSON), isRead |
| `UserSession` | Active user sessions | userId, socketId, deviceType (KIOSK / WEB / ANDROID) |

### Seed Data
- **14 PricePlans:** SMALL (6 plans) and LARGE (6 plans) with ONCE / DAILY / MONTHLY rental types
- **2 Locations:** Bach Khoa, Dormitory
- **1 Cabinet (Tu A)** with 1 MCP device (bus=1, addr=0x20) and 1 compartment (A1, SMALL)
- **1 Admin:** `admin@smartbox.io` / `SmartBox@2026` (SUPER_ADMIN)

## All API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/plans` | List active price plans |
| GET | `/api/public/locations` | List ACTIVE locations |
| GET | `/api/public/locations/:id` | Get location by ID |
| GET | `/api/public/locations/:id/cabinets` | List cabinets at location |
| GET | `/api/lockers/available` | List available compartments |
| GET | `/api/lockers/plans` | List plans by size |
| GET | `/api/system/status` | Global system status |

### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/admin/login` | Admin login |
| POST | `/auth/refresh` | Refresh JWT |
| POST | `/auth/verify-pin` | Verify 6-digit PIN |

### Rentals (`/api/rentals`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/rentals` | Create new rental |
| GET | `/rentals/:code` | Get rental by 6-digit code |
| POST | `/rentals/:id/unlock` | Manual unlock |
| POST | `/rentals/:id/complete` | Mark rental completed (pickup done) |

### System (`/api/system`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/system/heartbeat` | Cabinet heartbeat |
| POST | `/system/locker-event` | Report lock/door events |

### Provisioning (`/api/provisioning`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/provisioning/register` | None | Cabinet self-registration |
| GET | `/provisioning/config` | Super Admin | Get global config |
| PUT | `/provisioning/config` | Super Admin | Update global config |
| GET | `/provisioning/cabinets` | Auth | List provisioning cabinets |
| GET | `/provisioning/config/:cabinetId` | Cabinet JWT | Get cabinet config |
| POST | `/provisioning/config/:cabinetId/confirm` | Cabinet JWT | Confirm config applied |

### Admin: Cabinets (`/api/admin/cabinets`)
Full CRUD + admin unlock

### Admin: Compartments (`/api/admin/compartments`)
Update + delete compartments

### Admin: Locations (`/api/admin/locations`)
CRUD locations (create/update/delete = Super Admin only)

### Admin: Profiles (`/api/admin/profiles`)
CRUD provision profiles (create/update/delete = Super Admin only)

### Admin: Rentals (`/api/admin/rentals`)
List + detail + cancel rentals

### Dashboard (`/api/dashboard`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard/stats` | Dashboard statistics |

### Notifications (`/api/notifications`)
List + mark read notifications

### Audit Logs (`/api/audit-logs`)
Paginated audit log with filters

## Middleware Stack (Backend)

| Middleware | Purpose |
|------------|---------|
| `requestLogger` | Logs every request |
| `errorHandler` | Catches AppError → JSON error response |
| `validate(schema)` | Zod body validation |
| `asyncHandler` | Async route wrapper |
| `requireAdmin` | JWT auth + role check (SUPER_ADMIN / CABINET_ADMIN) |
| `requireCabinet` | Cabinet JWT validation |

## Background Jobs

| Job | Schedule | Purpose |
|-----|---------|---------|
| `ExpiryChecker` | Every minute | Marks expired rentals EXPIRED, releases compartments, sends notifications |
| `HeartbeatMonitor` | Every 30s | Marks cabinets OFFLINE after 90s no heartbeat, sends notifications |

## MQTT Topics

| Direction | Topic | Payload |
|-----------|-------|---------|
| Subscribe | `smartbox/+/lock/+/status` | Lock/sensor status updates |
| Subscribe | `smartbox/+/event/+` | Cabinet events |
| Subscribe | `smartbox/+/heartbeat` | Cabinet heartbeats |
| Publish | `smartbox/{cabinetId}/lock/{compName}/unlock` | Unlock command |
| Publish | `smartbox/{cabinetId}/lock/{compName}/lock` | Lock command |
| Publish | `smartbox/{cabinetId}/config/reload` | Config update broadcast |

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `cabinet:status` | Server → Client | Cabinet online/offline |
| `compartment:status` | Server → Client | Real-time lock/door state |
| `cabinet:join` | Client → Server | Admin joins cabinet room |

Admins join `admins` room for all events, plus `cabinet:{cabinetId}` per cabinet.

## Running the Backend

```bash
cd backend/

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Open Prisma Studio
npm run db:studio

# Run tests
npm test

# Build TypeScript
npm run build
```

### Environment Variables (`backend/.env`)
```
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
MQTT_BROKER_URL=mqtt://localhost:1883
QR_SECRET=123456
HEARTBEAT_INTERVAL=30
HEARTBEAT_TIMEOUT=90
PAYMENT_MOCK_ENABLED=true
ADMIN_EMAIL=admin@smartbox.io
ADMIN_PASSWORD=SmartBox@2026
```

## Running the Kiosk App

```bash
cd raspi_app/

pip install -r requirements.txt

# Development
python main.py

# After editing .qrc or SVG files
pyside6-rcc resources.qrc -o resources_rc.py
```

### Key Config Fields (`raspi_app/config.yaml`)
```yaml
api.base_url: "http://192.168.1.29:3001"
mqtt.broker: "192.168.1.29"
mqtt.port: 1883
support.hotline: "1900 1234"
app.countdown_open: 60
app.screen_width: 720
app.screen_height: 1280
```

## Running the Web Dashboard

```bash
cd web_dashboard/

npm install

# Development
npm run dev

# Build
npm run build
```

## Key Conventions

### Screen Size (Kiosk)
- **Fixed:** 720×1280px (Pi 3 7" touchscreen)
- **Header:** 80px, **Footer:** 48px

### Color System
| Token | Hex | Usage |
|-------|-----|-------|
| brand | `#FF6600` | Primary accent, deposit action |
| pickup | `#1565C0` | Nhận đồ action |
| rent | `#2E7D32` | Thuê tủ, success |
| bg | `#0A0A0A` | App background |
| surface | `#1C1C1B` | Cards |
| timer | `#FFB596` | Countdown numbers |
| online | `#00FF41` | Status indicator |
| error | `#EF4444` | Error state |

### Font
Be Vietnam Pro (loaded via Google Fonts)

### UI Files
- `.ui` files in `raspi_app/ui/` and `raspi_app/ui/components/` loaded via `QUiLoader`
- Object names on widgets are Python access points
- Components: reusable Footers, Headers loaded per screen

### Kiosk Screen Flow
```
Home (/)
├── GỬI ĐỒ → /otp → Processing → LockerOpen → Home
├── NHẬN ĐỒ → /otp → Processing → LockerOpen → Home
├── THUÊ TỦ → /rent-size → /rent-plan → /rent-phone → /payment → /rent-success
│                                              ├── [MỞ NGAY] → LockerOpen → Home
│                                              └── [DÙNG SAU] → Home
└── HỖ TRỢ → /support → Home
```

### Controller Pattern (Kiosk)
- `BaseController` handles: UI loading via QUiLoader, pixmap restoration, click filtering, navigation
- Each screen has a controller class with `on_enter(data)`, `on_exit()`, `route` attribute
- `KioskApp` owns `QStackedWidget` for screen management and `history` stack for back navigation

### Mock Modes
All three kiosk services support mock mode for development without backend or hardware:
- `ApiClient`: fake PINs, mock plans, mock rental creation
- `MqttClient`: records events, no broker needed
- `GpioController`: records lock_state dict

### Dashboard Routes
| Route | Page |
|-------|------|
| `/login` | LoginPage |
| `/dashboard` | DashboardPage (stats + charts + cabinet grid) |
| `/cabinets` | CabinetListPage |
| `/cabinets/:id` | CabinetDetailPage |
| `/rentals` | RentalsPage |
| `/rentals/:id` | RentalDetailPage |
| `/locations` | LocationsPage |
| `/profiles` | ProfilesPage |
| `/notifications` | NotificationsPage |
| `/audit-logs` | AuditLogsPage |

### Tests
Backend has 11 test files using Node.js built-in test runner (`node --test`):
- `rental.service.test.ts`, `mqtt.test.ts`, `qr.test.ts`, `socket.auth.test.ts`
- `profile.service.test.ts`, `provisioning.service.test.ts`, `cabinet.service.provisioning.test.ts`
- `compartment.service.test.ts`, `dashboard.service.test.ts`, `audit.service.test.ts`, `notification.service.test.ts`

## Infrastructure

```bash
# Start PostgreSQL + Mosquitto
docker compose up -d

# Ports
PostgreSQL: 5432
Mosquitto:  1883 (MQTT), 9001 (WebSocket)
Backend:    3001
Dashboard:  5173 (dev)
```

## Key Design Decisions

1. **HMAC QR tokens:** QR codes are HMAC-SHA256 signed payloads (not JWTs) to avoid JWT size in QR codes
2. **bcrypt PIN hashing:** PINs stored as bcrypt hashes
3. **Config versioning:** Cabinet config uses incrementing `configVersion` integer; kiosks poll and confirm
4. **Template-based cabinet creation:** Profiles define compartment grids as size matrices, auto-generating names (A1, A2...B1, B2...)
5. **Dual-mode provisioning:** `ALLOW_NEW` (Pi auto-provisions) vs `CHECK_EXISTING` (Admin pre-creates with code)
6. **Socket.io admin rooms:** Admins auto-join `admins` room for all cabinet events, plus per-cabinet rooms
7. **Dark-only UI:** Both kiosk and dashboard use dark theme exclusively
