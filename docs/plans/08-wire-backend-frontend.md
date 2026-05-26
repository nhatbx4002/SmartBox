# Plan: Wire Web Dashboard với Backend API

## Context

Web dashboard (React + Vite) có UI hoàn chỉnh 9 pages nhưng toàn bộ dùng mock data. Backend (Express + Prisma) đã có REST API nhưng **frontend gọi sai path/method** ở 12 chỗ và **backend thiếu 6 endpoints**. Phase 1: fix backend trước để frontend có endpoint đúng để gọi.

### Mismatch Analysis (trước khi sửa)

| Frontend gọi                    | Backend thật sự                                                 | Cần sửa             |
| ------------------------------- | --------------------------------------------------------------- | ------------------- |
| `POST /auth/login`              | `POST /auth/admin/login`                                        | Fix frontend api.ts |
| `GET /cabinets`                 | `GET /admin/cabinets`                                           | Fix frontend api.ts |
| `POST /cabinets`                | `POST /admin/cabinets`                                          | Fix frontend api.ts |
| `PATCH /cabinets/:id`           | `PUT /admin/cabinets/:id`                                       | Fix frontend api.ts |
| `DELETE /cabinets/:id`          | `DELETE /admin/cabinets/:id`                                    | Fix frontend api.ts |
| `POST /cabinets/:id/open`       | `POST /admin/cabinets/:id/unlock/:compId`                       | Fix frontend api.ts |
| `GET /rentals`                  | `GET /admin/rentals`                                            | Fix frontend api.ts |
| `GET /rentals/:id`              | `GET /admin/rentals/:id`                                        | Fix frontend api.ts |
| `POST /rentals/:id/cancel`      | `PUT /admin/rentals/:id/cancel`                                 | Fix frontend api.ts |
| `POST /rentals/:id/unlock`      | `POST /rentals/:id/unlock` (under `/api/rentals`, not `/admin`) | Fix frontend api.ts |
| `PATCH /notifications/:id/read` | `PUT /notifications/:id/read`                                   | Fix frontend api.ts |
| `GET /locations`                | `GET /public/locations`                                         | Fix frontend api.ts |

---

## Phase 1: Backend — Thêm endpoints thiếu

### 1a. Prisma Schema — Thêm AuditLog model

**File**: [prisma/schema.prisma](backend/prisma/schema.prisma)

Thêm enum và model:

```prisma
enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  LOGOUT
  UNLOCK
  CANCEL
}

model AuditLog {
  id          String     @id @default(cuid())
  adminId    String
  action      AuditAction
  resource   String     // e.g. "Cabinet", "Rental", "Location"
  resourceId String?
  details    Json?
  ipAddress  String?
  createdAt  DateTime   @default(now())
  admin      Admin      @relation(fields: [adminId], references: [id])

  @@index([adminId])
  @@index([action])
  @@index([resource])
  @@index([createdAt])
}
```

Sau đó: `npm run db:push` để apply schema.

### 1b. Audit Service

**File**: [src/services/audit.service.ts](backend/src/services/audit.service.ts) — tạo mới

```typescript
// Functions:
// - createAuditLog(adminId, action, resource, resourceId?, details?, ipAddress?)
// - listAuditLogs(filters: { adminId?, action?, resource?, startDate?, endDate?, page?, limit? })
```

### 1c. Audit Routes

**File**: [src/routes/audit.routes.ts](backend/src/routes/audit.routes.ts) — tạo mới

| Method | Path | Auth  | Description                                                                          |
| ------ | ---- | ----- | ------------------------------------------------------------------------------------ |
| `GET`  | `/`  | Admin | List audit logs (filter: adminId, action, resource, startDate, endDate, page, limit) |

### 1d. Admin Locations CRUD Routes

**File**: [src/routes/admin.locations.routes.ts](backend/src/routes/admin.locations.routes.ts) — tạo mới

| Method   | Path   | Auth       | Description                             |
| -------- | ------ | ---------- | --------------------------------------- |
| `GET`    | `/`    | Admin      | List all locations (with status filter) |
| `POST`   | `/`    | SuperAdmin | Create location                         |
| `PUT`    | `/:id` | SuperAdmin | Update location                         |
| `DELETE` | `/:id` | SuperAdmin | Soft-delete (set status=INACTIVE)       |

### 1e. Dashboard Stats Endpoint

**File**: [src/routes/system.routes.ts](backend/src/routes/system.routes.ts) — thêm

Thêm route `GET /api/dashboard/stats`:

```typescript
// Response shape:
{
  cabinets: number,
  activeRentals: number,
  availableCompartments: number,
  totalRevenue: number,           // SUM of paid rentals
  revenueThisWeek: number,         // last 7 days
  rentalsByStatus: { ACTIVE, COMPLETED, CANCELLED, EXPIRED },
  rentalsByDay: [{ date, count }], // last 7 days
}
```

Hoặc thêm vào `src/routes/dashboard.routes.ts` (tách riêng). Mount tại `GET /api/dashboard/stats`.

### 1f. Notifications — Mark All Read

**File**: [src/routes/notifications.routes.ts](backend/src/routes/notifications.routes.ts) — thêm

```typescript
router.put(
  "/read-all",
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    res.json({ data: { ok: true } });
  }),
);
```

### 1g. Mount new routes

**File**: [src/index.ts](backend/src/index.ts)

```typescript
import adminLocationsRoutes from "./routes/admin.locations.routes";
import auditRoutes from "./routes/audit.routes";

app.use("/api/admin/locations", adminLocationsRoutes);
app.use("/api/audit-logs", auditRoutes);
```

---

## Phase 2: Frontend — Fix api.ts + Wire pages

### 2a. Fix api.ts — Correct paths and methods

**File**: [src/lib/api.ts](web_dashboard/src/lib/api.ts)

```typescript
// Auth
login: (email, password) => api.post('/auth/admin/login', { email, password })

// Cabinets
list: () => api.get('/admin/cabinets'),
get: (id) => api.get(`/admin/cabinets/${id}`),
create: (data) => api.post('/admin/cabinets', data),
update: (id, data) => api.patch(`/admin/cabinets/${id}`, data),   // PATCH ok for frontend
delete: (id) => api.delete(`/admin/cabinets/${id}`),
openCompartment: (cabinetId, compId) => api.post(`/admin/cabinets/${cabinetId}/unlock/${compId}`),

// Rentals (admin)
list: (params) => api.get('/admin/rentals', { params }),
get: (id) => api.get(`/admin/rentals/${id}`),
cancel: (id) => api.put(`/admin/rentals/${id}/cancel`),
unlock: (id) => api.post(`/rentals/${id}/unlock`),   // under /rentals, not /admin

// Locations (public)
locationsApi.list: () => api.get('/public/locations'),
locationsApi.get: (id) => api.get(`/public/locations/${id}`),
// create/update/delete → sẽ dùng /admin/locations sau khi backend có

// Notifications
markRead: (id) => api.put(`/notifications/${id}/read`),   // PUT not PATCH

// Dashboard
dashboardApi.stats: () => api.get('/dashboard/stats'),

// Audit
auditApi.list: () => api.get('/audit-logs', { params }),
```

### 2b. Fix Auth Store

**File**: [src/store/index.ts](web_dashboard/src/store/index.ts)

- Xóa mock admin pre-seed
- `login()` chỉ gọi khi form submit, lưu real data

### 2c. Wire Pages

| Page              | What to wire                                                       |
| ----------------- | ------------------------------------------------------------------ |
| LoginPage         | `authApi.login`                                                    |
| DashboardPage     | `dashboardApi.stats`                                               |
| CabinetListPage   | `cabinetsApi.list/create/delete`                                   |
| CabinetDetailPage | `cabinetsApi.get` + `openCompartment` + Socket.io                  |
| RentalsPage       | `rentalsApi.list` with filters                                     |
| RentalDetailPage  | `rentalsApi.get/cancel`                                            |
| LocationsPage     | `locationsApi.list` (public read-only) + `/admin/locations` CRUD   |
| NotificationsPage | `notificationsApi.list/markRead/markAllRead`                       |
| AuditLogsPage     | `auditApi.list`                                                    |
| Header            | Notification count from `notificationsApi.list({ isRead: false })` |

---

## Files to create/modify

### Backend (new files)

- `src/services/audit.service.ts` — tạo mới
- `src/routes/audit.routes.ts` — tạo mới
- `src/routes/admin.locations.routes.ts` — tạo mới

### Backend (modify)

- `prisma/schema.prisma` — thêm AuditLog model + enum
- `src/index.ts` — mount 3 routes mới

### Frontend (modify)

- `src/lib/api.ts` — fix 12 API calls sai
- `src/store/index.ts` — bỏ mock pre-seed
- `src/pages/LoginPage.tsx` — wire real auth
- `src/pages/DashboardPage.tsx` — wire stats
- `src/pages/CabinetListPage.tsx` — wire CRUD
- `src/pages/CabinetDetailPage.tsx` — wire + Socket.io
- `src/pages/RentalsPage.tsx` — wire list + filters
- `src/pages/RentalDetailPage.tsx` — wire detail + actions
- `src/pages/LocationsPage.tsx` — wire (admin CRUD khi endpoint có)
- `src/pages/NotificationsPage.tsx` — wire
- `src/pages/AuditLogsPage.tsx` — wire
- `src/components/layout/Header.tsx` — real notification count

---

## Verification

1. Backend: `cd backend && npm run dev`
2. Frontend: `cd web_dashboard && npm run dev`
3. Login với admin seed (từ `prisma/seed.ts`)
4. Dashboard → stats + charts thật
5. Cabinets → CRUD operations → thật
6. Rentals → filter + pagination → thật
7. Cabinet Detail → unlock compartment → thật (hoặc mock nếu MQTT chưa chạy)
8. Notifications → mark read → thật
9. Audit Logs → list entries → thật
10. Locations → list thật, create/edit/delete khi admin locations CRUD có

## After Backend

Sau khi backend hoàn thành, chạy `npm run db:push` để apply AuditLog schema, rồi mới wire frontend.
