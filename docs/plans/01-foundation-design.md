# SmartBox — Nền tảng Hệ thống (Foundation Design)

> Phần này thiết lập nền tảng cho toàn bộ hệ thống: kiến trúc tổng quan, database, container, và cấu hình.

---

## 1. System Architecture Overview

### 1.1. Tổng quan kiến trúc

SmartBox là hệ thống IoT smart locker gồm **5 thành phần chính** hoạt động phối hợp:

```
┌─────────────────────────────────────────────────────────────────┐
│                         NGƯỜI DÙNG                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│   │  Android App │    │  Web Dashboard│    │  Kiosk (Pi)  │      │
│   │  (Khách hàng) │    │  (Admin)       │    │  (Khách hàng)│      │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│          │                   │                   │                │
│          │ REST / QR         │ REST             │ REST + MQTT    │
└──────────┼───────────────────┼──────────────────┼───────────────┘
           │                   │                  │
           ▼                   ▼                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                     INTERNET / LOCAL NETWORK                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     BACKEND SERVER                        │   │
│  │                     (Node.js + Express)                   │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐  │   │
│  │  │ REST API │  │ WebSocket│  │  MQTT    │  │ Cron  │  │   │
│  │  │ (HTTP)   │  │(Socket.io│  │ Broker   │  │ Jobs  │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └───────┘  │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │              BUSINESS LOGIC                       │   │   │
│  │  │  Auth │ Rental │ Cabinet │ Notification │ Log    │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                    ┌─────────┴─────────┐                        │
│                    ▼                   ▼                        │
│            ┌──────────────┐   ┌──────────────┐                │
│            │  PostgreSQL   │   │   Mosquitto  │                │
│            │  (Database)   │   │  (MQTT Broker│                │
│            └──────────────┘   └──────────────┘                │
└──────────────────────────────────────────────────────────────────┘
                                       │
                                       │ MQTT
                                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                        RASPBERRY PI 3                             │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              SmartBox Kiosk App (PySide6)                  │    │
│  │                                                          │    │
│  │  Screens: Home → OTP → Rent → Payment → Success         │    │
│  │                                                          │    │
│  │  Services:                                              │    │
│  │   api_client.py  ──── REST ────────────► Backend :3000   │    │
│  │   mqtt_client.py ─── MQTT ────────────► Broker :1883    │    │
│  │   gpio_controller.py ─ I2C ─────────► MCP23017          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│   │  MCP23017   │   │  Relay 5V   │   │ Solenoid 5V │        │
│   │  (I2C GPIO) │──►│  (Switch)  │──►│   (Lock)    │        │
│   └─────────────┘   └─────────────┘   └─────────────┘        │
│        ▲                                                       │
│        │ I2C (SDA/SCL)                                        │
│   ┌────┴────┐                                                │
│   │ Magnetic │ ◄── Door Sensor                                │
│   │ Sensor   │                                                │
│   └─────────┘                                                 │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2. Data Flow theo từng luồng

#### Luồng Gửi đồ (Kiosk)
```
Người dùng → [Nhập mã 6 số] → Kiosk → POST /api/rentals/verify-pin
                                         │
                                    Backend tìm rental
                                         │ code đúng + chưa hết hạn + còn lượt mở
                                         ▼
                                    Tăng openCount
                                         │
                                    POST /api/rentals/unlock
                                         │
                                    Backend publish MQTT:
                                    smartbox/{cabinetId}/lock/{compartmentId}/unlock
                                         │
                                    Pi nhận MQTT → gpio_controller.unlock()
                                         │
                                    MCP23017 set pin HIGH → Relay đóng → Solenoid mở
                                         │
                                    Cửa mở → Người bỏ đồ → Đóng cửa
                                         │
                                    Magnetic sensor báo CLOSED
                                         │
                                    Pi publish MQTT status:
                                    smartbox/{cabinetId}/lock/{compartmentId}/status
                                         │
                                    Backend update CompartmentStatus
                                    Backend update Rental (openCount++)
                                    Backend log LockerLog(OPENED)
                                    Backend broadcast Socket.io → Dashboard
```

#### Luồng Thuê tủ (Kiosk)
```
Người dùng → [Chọn Size] → [Chọn Plan] → [Nhập SĐT] → [Mock Payment]
                    │            │              │              │
                    ▼            ▼              ▼              ▼
              GET /api/    GET /api/      POST /api/    POST /api/
              lockers/     plans?         rentals       rentals/verify-pin
              available    size=LARGE     {phone,...}   → unlock
              (SMALL)                                      │
                                                    Pi mở tủ như trên
```

#### Luồng App thuê tủ
```
Người dùng → [Đăng nhập] → [Chọn Location] → [Chọn Cabinet] → [Plan] → [Payment]
                  │              │                   │              │          │
                  ▼              ▼                   ▼              ▼          ▼
            POST /api/    GET /api/           GET /api/     POST /api/  POST /api/
            auth/user/    public/            cabinets/     rentals     rentals/
            login         locations          {id}/         {phone,...} verify-pin
                            │                 details     → QR code    (QR token)
                            │                               │                  │
                            ▼                               ▼                  ▼
                      Map hiển        Compartment grid    QR: {rentalId,  Pi mở tủ
                      thị tủ          (realtime)         token, expiresAt}  như trên
```

#### Luồng Web Dashboard
```
Admin → [Login] → Dashboard
              │
              ├── GET /api/admin/cabinets → Danh sách tủ (status)
              │      └── Socket.io: cabinet:status (realtime online/offline)
              │
              ├── GET /api/admin/cabinets/:id → Chi tiết tủ + compartments
              │      └── CompartmentStatus grid (color-coded)
              │      └── Socket.io: compartment:status (lock/door thay đổi)
              │
              ├── POST /api/admin/cabinets → Tạo tủ mới + auto-provision
              │      └── Auto-generate compartments với pin mapping
              │
              ├── GET /api/admin/rentals → Lịch sử thuê
              └── PUT /api/admin/rentals/:id/cancel → Hủy rental
```

### 1.3. Network Ports

| Service | Port | Protocol | Mô tả |
|---------|------|---------|--------|
| Backend (Express) | 3000 | HTTP/REST | Main API server |
| Backend (WebSocket) | 3000 | WebSocket | Socket.io (cùng port 3000) |
| PostgreSQL | 5432 | TCP | Database |
| Mosquitto (MQTT) | 1883 | MQTT | Broker |
| Mosquitto (WebSocket) | 9001 | WebSocket | MQTT over WebSocket (cho web) |

### 1.4. Security Boundaries

```
Internet ─────────────────────────────────────────────────────
                                                          │
┌──────────────────────────────────────────────────────────┐ │
│                     DMZ / VPS                           │ │
│                                                          │ │
│   ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │ │
│   │ Web         │  │  Android    │  │  Backend     │  │ │
│   │ Dashboard   │  │  App         │  │  :3000       │  │ │
│   │ :80/443     │  │  (HTTPS)    │  │  (REST+WS)   │  │ │
│   └─────────────┘  └─────────────┘  └──────────────┘  │ │
│                                                    │    │ │
└────────────────────────────────────────────────────┼────┘ │
                                                     │      │
                                              LAN / Private  │
                                              Subnet ─────────
                                              ┌─────────────┐
                                              │  Pi Kiosk   │
                                              │  :3000      │
                                              │  MQTT :1883 │
                                              └─────────────┘
```

> **Lưu ý**: Kiosk (Pi) kết nối qua LAN private. Android app và Web Dashboard kết nối qua Internet.

---

## 2. Database Schema Design

### 2.1. Sơ đồ Entity-Relationship

```
┌──────────────┐       ┌──────────────┐       ┌──────────────────┐
│   Location   │──1:N─►│   Cabinet    │──1:N─►│   Compartment    │
│              │       │              │       │                  │
│ • name       │       │ • name       │       │ • name           │
│ • address    │       │ • mcp23017_* │       │ • size           │
│ • lat/lng    │       │ • status     │       │ • mcp23017_pin_* │
│ • status     │       │ • heartbeat  │       │ • status         │
└──────────────┘       └──────────────┘       └────────┬─────────┘
                                                        │ 1:1
                                                        ▼
                                              ┌──────────────────┐
                                              │ CompartmentStatus │
                                              │                  │
                                              │ • lockStatus     │
                                              │ • doorStatus     │
                                              │ • lastUpdatedAt  │
                                              └──────────────────┘
                                                        ▲
                                                        │ N:1
┌──────────────┐       ┌──────────────┐       ┌────────┴─────────┐
│    Admin     │       │    User      │──1:N─►│    Rental        │
│              │       │              │       │                  │
│ • email      │       │ • phone      │       │ • code (PIN)     │
│ • password   │       │ • email      │       │ • codeHash       │
│ • name       │       │ • password   │       │ • qrToken        │
│ • role       │       │ • status     │       │ • openCount      │
└──────────────┘       └──────────────┘       │ • maxOpens       │
                                               │ • expiresAt      │
                                               │ • paymentStatus  │
┌──────────────┐       ┌──────────────┐       │ • status         │
│  PricePlan   │──1:N─►│    Rental    │◄─────│ • compartmentId  │
│              │       │              │       └──────────────────┘
│ • name       │       └──────────────┘                │
│ • size       │                                        │
│ • type       │       ┌──────────────┐                │
│ • price      │       │  LockerLog   │◄───────────────┘
│ • maxOpens   │       │              │
│ • duration   │       │ • action      │
└──────────────┘       │ • success     │
                       │ • attemptCount│
┌──────────────┐       │ • createdAt   │
│Notification │──N:1─►└──────────────┘
│              │       ▲
│ • type       │       │ N:1
│ • isRead     │       │
│ • sentAt     │       │
└──────────────┘       │
              ┌────────┴────────┐
              │  UserSession    │
              │                 │
              │ • socketId      │
              │ • deviceType    │
              │ • connectedAt   │
              │ • isActive      │
              └─────────────────┘
```

### 2.2. Full Prisma Schema

**File**: `backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ══════════════════════════════════════════════════════
// ENUMS
// ══════════════════════════════════════════════════════

enum AdminRole {
  SUPER_ADMIN     // Toàn quyền
  CABINET_ADMIN   // Chỉ quản lý tủ được assign
}

enum UserStatus {
  ACTIVE
  SUSPENDED
}

enum CabinetStatus {
  ACTIVE    // Hoạt động bình thường
  INACTIVE  // Tạm ngưng (admin disable)
  OFFLINE   // Mất kết nối (không có heartbeat)
}

enum CompartmentSize {
  SMALL   // Ngăn nhỏ
  LARGE   // Ngăn lớn
}

enum CompartmentStatus {
  AVAILABLE   // Trống, có thể thuê
  OCCUPIED    // Đang có người thuê
  MAINTENANCE // Đang bảo trì
  RESERVED    // Đặt trước (chưa payment)
}

enum LockStatus {
  LOCKED    // Khóa đang đóng
  UNLOCKED  // Khóa đang mở
  FAULTY    // Lỗi (cảm biến hoặc khóa hỏng)
}

enum DoorStatus {
  CLOSED   // Cửa đóng
  OPEN     // Cửa mở
  UNKNOWN  // Chưa có trạng thái (lần đầu khởi tạo)
}

enum RentalType {
  ONCE    // Thuê 1 lần mở (gửi/nhận đồ)
  DAILY   // Thuê theo ngày, nhiều lần mở
  MONTHLY // Thuê gói tháng, không giới hạn
}

enum RentalStatus {
  ACTIVE     // Đang hoạt động
  COMPLETED  // Đã hoàn thành (user lấy đồ xong)
  CANCELLED  // Bị hủy bởi admin
  EXPIRED    // Hết hạn tự động
}

enum PaymentStatus {
  PENDING  // Chưa thanh toán
  PAID     // Đã thanh toán
  REFUNDED // Đã hoàn tiền
  FAILED   // Thanh toán thất bại
}

enum PaymentMethod {
  MOMO     // MoMo
  ZALOPAY  // ZaloPay
  VIETQR   // VietQR
  CASH     // Tiền mặt
  NONE     // Mock / không cần thanh toán
}

enum LockerAction {
  OPENED     // Mở tủ thành công
  CLOSED     // Đóng tủ
  EXPIRED    // Hết hạn tự động
  DENIED     // Từ chối mở (sai mã, hết lượt)
  NO_SHOW    // Không nhấn mở sau khi xác thực
  HEARTBEAT  // Heartbeat từ Pi
  FAULTY     // Lỗi thiết bị
}

enum NotificationType {
  RENTAL_EXPIRED      // Rental hết hạn
  CABINET_OFFLINE     // Tủ mất kết nối
  RENTAL_STARTED      // Rental mới được tạo
  PAYMENT_SUCCESS     // Thanh toán thành công
  RENTAL_EXPIRING_SOON // Sắp hết hạn (1h trước)
  SYSTEM              // Thông báo hệ thống
}

enum DeviceType {
  ANDROID
  WEB
  KIOSK
}

// ══════════════════════════════════════════════════════
// MODELS
// ══════════════════════════════════════════════════════

// ─── Admin User ───────────────────────────────────────

model Admin {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String
  role         AdminRole @default(CABINET_ADMIN)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

// ─── App User ─────────────────────────────────────────

model User {
  id           String     @id @default(cuid())
  email        String?    @unique  // nullable: phone-only login
  phone        String     @unique
  passwordHash String?    // nullable: đăng nhập phone-only
  name         String?
  status       UserStatus @default(ACTIVE)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  rentals      Rental[]
  notifications Notification[]
  sessions     UserSession[]

  @@index([phone])
  @@index([email])
}

// ─── Location ─────────────────────────────────────────

model Location {
  id             String      @id @default(cuid())
  name           String
  address        String
  latitude       Float?
  longitude      Float?
  googlePlaceId  String?     @unique
  mapImageUrl    String?
  status         LocationStatus @default(ACTIVE)
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  cabinets      Cabinet[]

  @@index([status])
}

enum LocationStatus {
  ACTIVE
  INACTIVE
}

// ─── Cabinet (Tủ) ─────────────────────────────────────
// 1 Cabinet = 1 physical locker unit có nhiều Compartments
// Có 1 MCP23017 module gắn liền với cabinet

model Cabinet {
  id               String        @id @default(cuid())
  locationId       String
  name             String        // vd: "Tủ A", "Locker Zone 1"
  mcp23017Bus      Int           @default(1)        // I2C bus (Pi = 1)
  mcp23017Address  Int           @default(0x20)     // I2C address decimal (32 = 0x20)
  status           CabinetStatus @default(ACTIVE)
  lastHeartbeatAt  DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  location     Location      @relation(fields: [locationId], references: [id])
  compartments Compartment[]
  logs        LockerLog[]

  @@index([locationId])
  @@index([status])
}

// ─── Compartment (Ngăn tủ) ────────────────────────────
// 1 Compartment = 1 locker cell, có 1 lock (relay) + 1 door sensor

model Compartment {
  id                   String            @id @default(cuid())
  cabinetId            String
  name                 String            // vd: "A1", "B3" (auto-generated)
  size                 CompartmentSize
  mcp23017PinLock      Int               // GPIO pin number on MCP23017 for relay
  mcp23017PinSensor    Int               // GPIO pin number on MCP23017 for magnetic sensor
  status               CompartmentStatus @default(AVAILABLE)
  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt

  cabinet           Cabinet            @relation(fields: [cabinetId], references: [id])
  rentals           Rental[]
  logs              LockerLog[]
  compartmentStatus CompartmentStatus?

  @@unique([cabinetId, name])        // Trong 1 cabinet, tên ngăn không trùng
  @@index([cabinetId])
  @@index([status])
}

// ─── CompartmentStatus (Trạng thái realtime) ─────────
// Tách riêng để update realtime mà không cần lock rental
// Updated liên tục qua MQTT từ Pi

model CompartmentStatus {
  id             String     @id @default(cuid())
  compartmentId  String     @unique
  lockStatus     LockStatus @default(UNKNOWN)
  doorStatus     DoorStatus @default(UNKNOWN)
  lastUpdatedAt  DateTime   @default(now())

  compartment    Compartment @relation(fields: [compartmentId], references: [id], onDelete: Cascade)

  @@index([lockStatus])
  @@index([doorStatus])
}

// ─── Price Plan (Bảng giá) ───────────────────────────

model PricePlan {
  id           String          @id @default(cuid())
  name         String          // vd: "Thuê 1 lượt (7 ngày)"
  size         CompartmentSize
  rentalType   RentalType
  price        Int             // VND, không có decimal
  maxOpens     Int?            // null = unlimited
  durationDays Int             // Số ngày có hiệu lực
  description  String?
  isActive     Boolean         @default(true)
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  rentals      Rental[]

  @@index([size, isActive])
  @@index([rentalType])
}

// ─── Rental (Phiên thuê) ──────────────────────────────
// Đại diện cho 1 lượt thuê: có thể là gửi đồ 1 lần
// hoặc thuê tủ theo gói (nhiều lần mở trong X ngày)

model Rental {
  id             String         @id @default(cuid())
  userId         String?
  compartmentId  String
  pricePlanId    String
  code           String         @unique // 6-digit PIN, vd: "847291"
  codeHash       String          // bcrypt hash của code
  qrToken        String         @unique // HMAC token cho QR code
  openCount      Int            @default(0) // Số lần đã mở
  maxOpens       Int            // Số lần được phép mở (từ PricePlan)
  expiresAt      DateTime
  paymentStatus  PaymentStatus  @default(PENDING)
  paymentMethod  PaymentMethod  @default(NONE)
  paidAt         DateTime?
  status         RentalStatus   @default(ACTIVE)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  user        User?       @relation(fields: [userId], references: [id])
  compartment Compartment @relation(fields: [compartmentId], references: [id])
  pricePlan   PricePlan   @relation(fields: [pricePlanId], references: [id])
  logs        LockerLog[]

  @@index([code])
  @@index([qrToken])
  @@index([userId])
  @@index([compartmentId])
  @@index([status])
  @@index([expiresAt])
}

// ─── Locker Log (Nhật ký khóa) ───────────────────────
// Audit trail cho mọi action liên quan đến locker
// Auto-logged từ MQTT events và API calls

model LockerLog {
  id            String       @id @default(cuid())
  cabinetId     String?
  compartmentId String?
  rentalId      String?
  action        LockerAction
  attemptCount  Int          @default(0)
  success       Boolean
  ipAddress     String?
  deviceInfo    String?      // "Kiosk Pi #1", "Android v12", "Web Dashboard"
  note          String?
  createdAt     DateTime     @default(now())

  cabinet     Cabinet?    @relation(fields: [cabinetId], references: [id])
  compartment Compartment? @relation(fields: [compartmentId], references: [id])
  rental      Rental?     @relation(fields: [rentalId], references: [id])

  @@index([compartmentId])
  @@index([cabinetId])
  @@index([rentalId])
  @@index([action])
  @@index([createdAt])
}

// ─── Notification ──────────────────────────────────────

model Notification {
  id        String           @id @default(cuid())
  userId    String
  title     String
  body      String
  type      NotificationType
  data      Json?            // Extra payload, vd: { rentalId, cabinetName }
  isRead    Boolean          @default(false)
  sentAt    DateTime         @default(now())
  createdAt DateTime         @default(now())

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@index([type])
}

// ─── User Session (WebSocket tracking) ────────────────
// Track active WebSocket connections để push notification

model UserSession {
  id             String     @id @default(cuid())
  userId         String
  socketId       String     @unique // Socket.io socket ID
  deviceType     DeviceType
  deviceInfo     String?
  connectedAt    DateTime   @default(now())
  disconnectedAt DateTime?
  isActive       Boolean    @default(true)

  user           User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isActive])
  @@index([socketId])
}
```

### 2.3. Seed Data (Example)

```prisma
// File: backend/prisma/seed.ts
// Chạy: npx prisma db seed

const pricePlans = [
  // SMALL
  { name: "Thuê 1 lượt (ngày)", size: "SMALL", rentalType: "ONCE", price: 10000, maxOpens: 2, durationDays: 1 },
  { name: "Thuê 1 lượt (7 ngày)", size: "SMALL", rentalType: "ONCE", price: 15000, maxOpens: 2, durationDays: 7 },
  { name: "Thuê nhiều lượt (5 lượt / 30 ngày)", size: "SMALL", rentalType: "DAILY", price: 50000, maxOpens: 5, durationDays: 30 },
  { name: "Thuê nhiều lượt (10 lượt / 90 ngày)", size: "SMALL", rentalType: "DAILY", price: 90000, maxOpens: 10, durationDays: 90 },
  { name: "Thuê gói tháng (1 tháng)", size: "SMALL", rentalType: "MONTHLY", price: 150000, maxOpens: null, durationDays: 30 },
  { name: "Thuê gói tháng (3 tháng)", size: "SMALL", rentalType: "MONTHLY", price: 400000, maxOpens: null, durationDays: 90 },
  { name: "Thuê gói tháng (6 tháng)", size: "SMALL", rentalType: "MONTHLY", price: 700000, maxOpens: null, durationDays: 180 },
  // LARGE
  { name: "Thuê 1 lượt (ngày)", size: "LARGE", rentalType: "ONCE", price: 15000, maxOpens: 2, durationDays: 1 },
  { name: "Thuê 1 lượt (7 ngày)", size: "LARGE", rentalType: "ONCE", price: 20000, maxOpens: 2, durationDays: 7 },
  { name: "Thuê nhiều lượt (5 lượt / 30 ngày)", size: "LARGE", rentalType: "DAILY", price: 80000, maxOpens: 5, durationDays: 30 },
  { name: "Thuê nhiều lượt (10 lượt / 90 ngày)", size: "LARGE", rentalType: "DAILY", price: 140000, maxOpens: 10, durationDays: 90 },
  { name: "Thuê gói tháng (1 tháng)", size: "LARGE", rentalType: "MONTHLY", price: 250000, maxOpens: null, durationDays: 30 },
  { name: "Thuê gói tháng (3 tháng)", size: "LARGE", rentalType: "MONTHLY", price: 650000, maxOpens: null, durationDays: 90 },
  { name: "Thuê gói tháng (6 tháng)", size: "LARGE", rentalType: "MONTHLY", price: 1100000, maxOpens: null, durationDays: 180 },
];

const locations = [
  { name: "SmartBox Trường ĐH Bách Khoa", address: "268 Lý Thường Kiệt, P.14, Q.10, TP.HCM", latitude: 10.7795, longitude: 106.6989 },
  { name: "SmartBox Trung tâm thương mại Vincom", address: "72 Lê Thánh Tôn, Bến Nghé, Q.1, TP.HCM", latitude: 10.7828, longitude: 106.7031 },
];

const cabinets = [
  { name: "Tủ A", mcp23017Bus: 1, mcp23017Address: 32, compartments: [{ size: "SMALL", count: 8 }, { size: "LARGE", count: 4 }] },
  { name: "Tủ B", mcp23017Bus: 1, mcp23017Address: 33, compartments: [{ size: "SMALL", count: 6 }, { size: "LARGE", count: 6 }] },
];
// Pin mapping: Tủ A: SMALL pins 0-7, LARGE pins 8-11 (lock pins)
//             Sensor pins: 12-19 (mỗi ngăn 1 lock pin + 1 sensor pin)

// Admin seed: admin@smartbox.io / SmartBox@2024
const adminHash = bcrypt.hashSync("SmartBox@2024", 10);
```

### 2.4. Design Decisions

| Decision | Reason |
|----------|--------|
| `codeHash` (bcrypt) thay vì plain code | Bảo mật — không lưu PIN dạng đọc được |
| `qrToken` (HMAC-SHA256) | QR không chứa secret, chỉ là signed payload chống giả mạo |
| `CompartmentStatus` tách riêng | Update realtime (MQTT) không cần lock rental record |
| `maxOpens = null` = unlimited | Dùng nullable int thay vì sentinel value (-1) |
| `mcp23017PinLock` + `mcp23017PinSensor` | Mỗi ngăn cần 2 chân: 1 điều khiển relay, 1 đọc cảm biến từ |
| `Cabinet.mcp23017Address` | 1 Cabinet có thể có nhiều MCP23017 (mỗi address khác nhau) |
| Soft delete qua `status` | Không xóa cabinet/compartment — chỉ set INACTIVE để giữ history |
| `UserSession` track socketId | Để push notification đến đúng device |

---

## 3. Docker Architecture

### 3.1. Container Overview

```
┌─────────────────────────────────────────────────────────┐
│              docker-compose.yml                          │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │  postgres   │  │  mosquitto   │  │    backend     │ │
│  │  :5432      │  │  :1883 :9001 │  │    :3000       │ │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘ │
│         │                 │                   │          │
│         └─────────────────┴───────────────────┘          │
│                          │                                │
│              Internal Docker Network                      │
│              "smartbox-network"                         │
└─────────────────────────────────────────────────────────┘
                    │                    │
                    │ :5432             │ :1883, :3000
                    ▼                    ▼
            ┌──────────────┐     ┌──────────────────┐
            │  Pi / Dev     │     │  Web / Android   │
            │  Machine      │     │  (Internet)      │
            └──────────────┘     └──────────────────┘
```

### 3.2. Docker Compose File

**File**: `docker-compose.yml`

```yaml
version: "3.9"

services:
  # ── Database ────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    container_name: smartbox_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-smartbox123}
      POSTGRES_DB: ${POSTGRES_DB:-smartbox}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/prisma/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - smartbox-network

  # ── MQTT Broker ─────────────────────────────────────
  mosquitto:
    image: eclipse-mosquitto:2
    container_name: smartbox_mosquitto
    restart: unless-stopped
    ports:
      - "${MQTT_PORT:-1883}:1883"     # MQTT
      - "${MQTT_WS_PORT:-9001}:9001"  # MQTT over WebSocket (for web)
    volumes:
      - ./mosquitto/config:/mosquitto/config:ro
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    healthcheck:
      test: ["CMD", "mosquitto_sub", "-t", "$$SYS/#", "-C", "1", "-i", "healthcheck", "-W", "3"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - smartbox-network

  # ── Backend ─────────────────────────────────────────
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: smartbox_backend
    restart: unless-stopped
    env_file:
      - ./backend/.env
    ports:
      - "${BACKEND_PORT:-3000}:3000"
    depends_on:
      postgres:
        condition: service_healthy
      mosquitto:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - smartbox-network

volumes:
  postgres_data:
    driver: local

networks:
  smartbox-network:
    driver: bridge
```

### 3.3. Mosquitto Config

**File**: `mosquitto/config/mosquitto.conf`

```conf
# Persistence
persistence true
persistence_location /mosquitto/data/

# Logging
log_dest file /mosquitto/log/mosquitto.log
log_dest stdout

# Listeners
listener 1883
allow_anonymous true

# WebSocket listener (for web dashboard)
listener 9001
protocol websockets
allow_anonymous true

# Security (enable when going to production)
# listener 1883
# allow_anonymous false
# password_file /mosquitto/config/passwd
```

### 3.4. Database Init Script

**File**: `backend/prisma/init.sql`

```sql
-- Chạy sau khi Postgres khởi tạo lần đầu
-- Thiết lập timezone + extensions

ALTER DATABASE smartbox SET timezone TO 'Asia/Ho_Chi_Minh';

-- Enable pg_trgm for fuzzy text search (nếu cần tìm kiếm location name)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enable UUID generation (Prisma dùng CUID nhưng postgres uuid cũng tiện)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 3.5. Backend Dockerfile

**File**: `backend/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Cài build tools cho native modules (nếu cần)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# Dev mode: dùng ts-node-dev để hot-reload
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]
```

### 3.6. Deployment Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT                              │
│                                                                 │
│  Docker Desktop / Colima                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ postgres │  │ mosquitto│  │ backend  │  http://localhost     │
│  │ :5432    │  │ :1883    │  │ :3000    │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│  localhost:3000 → Pi (LAN) + Browser (localhost)               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION (VPS)                         │
│                                                                 │
│  VPS (Ubuntu 22.04)                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ postgres │  │ mosquitto│  │ backend  │  │ nginx (reverse  │  │
│  │ :5432    │  │ :1883    │  │ :3000    │  │ proxy) :80/:443│  │
│  │          │  │ :9001 WS │  │          │  └────────────────┘  │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                           │                                      │
│                    WAN / Internet                               │
│                    │        │        │                          │
│              Android      Web      Pi (LAN)                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Environment Configuration

### 4.1. Backend — `.env`

**File**: `backend/.env`

```env
# ── Server ──────────────────────────────────────────────
NODE_ENV=development
PORT=3000

# ── Database ─────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:smartbox123@localhost:5432/smartbox?schema=public"

# ── JWT Authentication ────────────────────────────────────
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── MQTT Broker ──────────────────────────────────────────
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=
MQTT_PASSWORD=

# ── QR Code ──────────────────────────────────────────────
# HMAC secret để sign/verify QR token
QR_SECRET=your-qr-signing-secret-key
QR_TOKEN_EXPIRES_IN=30d

# ── Heartbeat / Offline Detection ─────────────────────────
HEARTBEAT_INTERVAL=30      # Pi gửi heartbeat mỗi 30 giây
HEARTBEAT_TIMEOUT=90       # Backend đánh dấu OFFLINE sau 90s không có heartbeat

# ── Socket.io ────────────────────────────────────────────
CORS_ORIGIN=http://localhost:5173   # Frontend URL (thay đổi theo môi trường)

# ── Admin Seed ───────────────────────────────────────────
ADMIN_EMAIL=admin@smartbox.io
ADMIN_PASSWORD=SmartBox@2024
ADMIN_NAME=SmartBox Admin

# ── Payment (Mock) ───────────────────────────────────────
PAYMENT_MOCK_ENABLED=true

# ── Logging ──────────────────────────────────────────────
LOG_LEVEL=info
```

### 4.2. Kiosk App — `config.yaml`

**File**: `raspi_app/config.yaml`

```yaml
# ── API ──────────────────────────────────────────────────
api:
  base_url: "http://10.0.0.1:3000"   # IP của backend server (LAN)
  timeout: 10                          # Request timeout (giây)

# ── MQTT ─────────────────────────────────────────────────
mqtt:
  broker: "10.0.0.1"                 # IP của MQTT broker (LAN)
  port: 1883
  username: ""
  password: ""
  client_id: "smartbox-kiosk-001"
  keepalive: 60
  topics:
    status: "smartbox/+/lock/+/status"
    event: "smartbox/+/event/+/"
    heartbeat: "smartbox/+/heartbeat"

# ── Hardware ─────────────────────────────────────────────
hardware:
  driver: "mcu2317"                  # Hiện tại chỉ support MCU2317

mcu2317:
  bus: 1                             # I2C bus (Pi 3 = 1)
  # address được override theo cabinet từ backend
  default_address: 0x20              # Default I2C address

gpio:
  # Sensor pins (BCM numbering)
  # Những chân này đọc trạng thái cửa (qua MCP23017)
  sensor_pins: [22, 23, 24, 25]

relay:
  # Relay trigger pin (BCM) — dùng cho test nếu không có MCP23017
  test_pin: 17

# ── Locker Behavior ──────────────────────────────────────
locker:
  unlock_duration: 3                 # Thời gian mở khóa (giây) — relay tự động tắt
  close_timeout: 120                # Đếm ngược đóng cửa (giây)
  sensor_debounce: 500              # Debounce cảm biến (ms)

# ── UI ───────────────────────────────────────────────────
app:
  countdown_open: 120                # Countdown hiển thị khi mở tủ (giây)
  countdown_default: 60
  screen_width: 720
  screen_height: 1280
  header_height: 80
  footer_height: 48
  fullscreen: true                   # Kiosk mode: fullscreen
  kiosk_mode: true

# ── Support ──────────────────────────────────────────────
support:
  hotline: "1900 1234"
  email: "support@smartbox.io"

# ── Cabinet Info ─────────────────────────────────────────
cabinet:
  id: "cabinet_001"                 # Override bằng config từ backend
  name: "SmartBox Kiosk #1"
  location_id: "location_001"
```

### 4.3. Web Dashboard — `.env`

**File**: `web-dashboard/.env`

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
VITE_APP_NAME=SmartBox Dashboard
```

### 4.4. Android App — `local.properties`

**File**: `android-app/local.properties`

```properties
# Backend API
API_BASE_URL=https://your-domain.com/api
WS_BASE_URL=https://your-domain.com

# MQTT (optional, nếu app cần nhận realtime từ MQTT)
MQTT_BROKER_URL=wss://your-domain.com:9001

# Map (Google Maps API Key)
MAPS_API_KEY=your-google-maps-api-key

# Firebase (nếu dùng FCM sau này)
FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
```

### 4.5. Docker — `.env`

**File**: `.env` (root, cho docker-compose)

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=smartbox123
POSTGRES_DB=smartbox
POSTGRES_PORT=5432

# Backend
BACKEND_PORT=3000

# MQTT
MQTT_PORT=1883
MQTT_WS_PORT=9001

# Production
# DOMAIN=smartbox.your-domain.com
# HTTPS_CERT_PATH=/path/to/fullchain.pem
# HTTPS_KEY_PATH=/path/to/privkey.pem
```

### 4.6. Environment Matrix

| Variable | Dev | Staging | Production | Notes |
|----------|-----|---------|-----------|-------|
| `NODE_ENV` | development | staging | production | |
| `DATABASE_URL` | localhost:5432 | staging-db:5432 | prod-db:5432 | |
| `JWT_SECRET` | dev-secret | staging-secret | `openssl rand -hex 64` | |
| `CORS_ORIGIN` | localhost:5173 | staging-domain | prod-domain | |
| `MQTT_BROKER_URL` | localhost:1883 | staging:1883 | prod:1883 | |
| `API_BASE_URL` (kiosk) | 10.0.0.1:3000 | staging-ip:3000 | prod-domain:3000 | |
| `HEARTBEAT_INTERVAL` | 30s | 30s | 30s | |
| `HEARTBEAT_TIMEOUT` | 90s | 60s | 60s | |

### 4.7. Secrets Management

```
⚠️  Không bao giờ commit file .env vào git!
```

```
# .gitignore (thêm vào)
.env
.env.*
!.env.example
```

```
.env.example  ← commit file này, làm template
```

```env
# .env.example (template — không chứa secrets thật)
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:CHANGEME@localhost:5432/smartbox"
JWT_SECRET=CHANGE_THIS_SECRET
JWT_REFRESH_SECRET=CHANGE_THIS_SECRET
MQTT_BROKER_URL=mqtt://localhost:1883
QR_SECRET=CHANGE_THIS_SECRET
CORS_ORIGIN=http://localhost:5173
```

---

## Tổng kết Phần 1

| Artifact | File | Status |
|----------|------|--------|
| System Architecture | `docs/plans/01-foundation-design.md` | ✅ Hoàn thành |
| ER Diagram | (trong section 2.1) | ✅ Hoàn thành |
| Prisma Schema | `backend/prisma/schema.prisma` | 📋 Thiết kế xong, chưa tạo |
| Docker Compose | `docker-compose.yml` | 📋 Thiết kế xong, chưa tạo |
| Mosquitto Config | `mosquitto/config/mosquitto.conf` | 📋 Thiết kế xong, chưa tạo |
| Backend Dockerfile | `backend/Dockerfile` | 📋 Thiết kế xong, chưa tạo |
| All .env files | (section 4) | 📋 Thiết kế xong, chưa tạo |
