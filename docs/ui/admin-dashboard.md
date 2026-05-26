# Admin Dashboard — UI Screen Specifications

> **Source:** Based on `docs/plans/implementation-plan.md` (Phase 4) and `docs/plans/01-foundation-design.md`

## Tech Stack

- React 18 + Vite + TypeScript
- React Router v6
- TanStack Query (React Query) — data fetching + caching
- Zustand — lightweight state
- Tailwind CSS
- Radix UI (headless primitives)
- Recharts — charts
- Socket.io-client — realtime
- Axios — HTTP client

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Admin login |
| `/dashboard` | Dashboard | Overview stats, occupancy rate, revenue |
| `/cabinets` | Cabinet List | All cabinets with status badges |
| `/cabinets/:id` | Cabinet Detail | Compartment grid (color-coded) |
| `/locations` | Location List | CRUD locations |
| `/rentals` | Rental History | Filters by date, status, location |
| `/notifications` | Notifications | System notification log |

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0A0A0A` | Page background |
| Surface | `#1C1B1B` | Cards, sidebar, panels |
| Surface Elevated | `#262626` | Hover states, table rows, inputs |
| Border | `#333333` | Dividers, card borders |
| Brand | `#FF6600` | Primary accent, active nav, CTA buttons |
| Brand Hover | `#FF8533` | Button hover state |
| Pickup | `#1565C0` | "Nhận đồ" / pickup actions |
| Rent | `#2E7D32` | "Thuê tủ" / rent actions |
| Timer | `#FFB596` | Warning accents |
| Status Online | `#00FF41` | Cabinet online indicator |
| Text Primary | `#FFFFFF` | Headings, primary text |
| Text Secondary | `#9CA3AF` | Labels, descriptions |
| Text Muted | `#6B7280` | Placeholder, disabled |
| Success | `#10B981` | Success states, AVAILABLE compartments |
| Warning | `#F59E0B` | Warning states, RESERVED compartments |
| Error | `#EF4444` | Error states, MAINTENANCE compartments, danger actions |
| Info | `#3B82F6` | Info states, OCCUPIED compartments |

### Typography

- Font: **Be Vietnam Pro** (same as kiosk app), fallback `Inter, sans-serif`
- Headings: Bold, tracking tight
- Body: Regular 14px
- Labels: Medium 12px, uppercase tracking wide
- Code: Monospace `JetBrains Mono, monospace` (for rental codes)

## Layout Shell

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (h: 64px) — Logo | Search | Notif Bell | Admin Menu │
├──────────────┬───────────────────────────────────────────────┤
│              │                                               │
│   SIDEBAR    │              MAIN CONTENT                     │
│   (w: 240px) │              (flex-1)                       │
│              │                                               │
│  - Dashboard │                                               │
│  - Tủ        │                                               │
│  - Dia diem  │                                               │
│  - Thuê      │                                               │
│  - Thong bao │                                               │
│              │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

- Sidebar: collapsible on mobile (hamburger), icon-only at md breakpoint
- Content: max-width 1400px, centered, p-6
- Responsive: mobile-first, sidebar becomes drawer on < 768px

---

## Screen 01 — Login (`/login`)

### Layout
Centered card on dark background with subtle gradient.

```
┌─────────────────────────────────────┐
│                                     │
│         [SmartBox Logo]             │
│         ADMIN DASHBOARD             │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Email                         │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  Password                  👁  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │         Đăng nhập             │  │
│  └───────────────────────────────┘  │
│                                     │
│     Quên mật khẩu?                  │
└─────────────────────────────────────┘
```

### Elements

| Element | Spec |
|---------|------|
| Logo | SmartBox icon + "SmartBox" text, Brand `#FF6600`, centered |
| Title | "ADMIN DASHBOARD", Text Primary, 24px bold |
| Email input | Full width, bg `#1C1B1B`, border `#333`, rounded-lg, placeholder "admin@smartbox.vn" |
| Password input | Same as email + show/hide toggle eye icon |
| Login button | bg Brand `#FF6600`, hover `#FF8533`, full width, h-12, rounded-lg, bold "Đăng nhập" |
| Error message | Text Error `#EF4444`, text-sm, appears below button on failed login |
| Forgot link | Text Secondary, underline on hover |

### States

- **Default**: All fields empty, button "Đăng nhập"
- **Loading**: Button shows spinner + "Đang đăng nhập...", inputs disabled
- **Error**: Red border on invalid fields + error message below button
- **Success**: Redirect to `/dashboard`

## Role-Based Access Control (RBAC)

The UI adapts based on the `role` found in the JWT/Admin object:

| Role | Permissions | UI Restrictions |
|------|-------------|-----------------|
| `SUPER_ADMIN` | Full Access | No restrictions. |
| `CABINET_ADMIN` | Manage assigned cabinets | - `/locations` route hidden/disabled.<br>- `/cabinets` only shows assigned cabinets.<br>- Cannot delete cabinets or locations. |

---

## Screen 02 — Dashboard Overview (`/`)

### Layout
...
### Cabinet Status Grid (Interactive)

- **Real-time Updates:** Uses `CABINET_HEARTBEAT` socket events to toggle status dots.
- **Interactions:**
  - **Single Click:** Navigate to detailed cabinet view.
  - **Right Click (Desktop):** Context menu with "Restart Kiosk App", "Open All Doors (Emergency)", "View Logs".
  - **Visual Bar:** A progress-style bar below the name shows occupancy (e.g., 8/12 full).

---

## Screen 09 — Audit Logs (`/audit-logs`) — Super Admin Only

Detailed log of all administrative actions for security compliance.

### Layout
Table-heavy view with advanced filtering.

| Column | Content |
|--------|---------|
| Timestamp | `YYYY-MM-DD HH:mm:ss` |
| Admin | Name + ID |
| Action | e.g., "UNLOCK_COMPARTMENT", "UPDATE_PRICE_PLAN" |
| Target | Resource ID (e.g., Cabinet A1) |
| IP Address | Client IP |
| Status | Success / Failed |

---

## Shared Components
...


### Layout

```
┌────────────────────────────────────────────────────────────┐
│  Quản lý Thuê                          [+ Tạo thuê mới]   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │ Tìm kiếm... │ │ Status: Tất  │ │ Ngày: Tất cả    ▼ │  │
│  └──────────────┘ └──────────────┘ └────────────────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Mã  │ SĐT    │ Ngăn  │ Gói    │ Status  │ Hết hạn   │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ 847│ 0901...│ A1    │ 1 ngày │ ● ACTIVE│ 22/05/2026 │  │
│  │ 382│ 0909...│ B3    │ 1 tháng│ ● EXPRD│ 10/05/2026  │  │
│  │ 192│ 0903...│ A2    │ 7 ngày │ ● CMPLT │ 12/05/2026 │  │
│  │ ...│ ...    │ ...   │ ...    │ ...     │ ...         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  < Trước | Trang 1 / 12 | Sau >                           │
└────────────────────────────────────────────────────────────┘
```

### Filters Bar

- Search input: placeholder "Tìm theo mã thuê, SĐT...", full width
- Status dropdown: Tất cả, ACTIVE, COMPLETED, CANCELLED, EXPIRED
- Date range picker: "Từ ngày - Đến ngày"
- All filters apply on change (debounced 300ms for search)

### Table

Columns:

| Column | Width | Content |
|--------|-------|---------|
| Mã | 100px | Mono font, copy icon on hover |
| SĐT | 120px | Masked: `0901***234` |
| Ngăn | 80px | Compart. name e.g. "A1" |
| Tủ | 100px | Cabinet name |
| Gói | 140px | Plan name |
| Status | 100px | Colored badge |
| Hết hạn | 120px | Formatted date, red if < 24h |
| Thao tác | 120px | Eye icon (view), X icon (cancel) |

- Row hover: bg Surface Elevated `#262626`
- Row click: navigate to detail
- Pagination: 20 rows/page, prev/next + page numbers

### Status Badges

| Status | Badge Style |
|--------|-------------|
| ACTIVE | bg Success `#10B981`/20%, text Success `#10B981`, border Success |
| COMPLETED | bg Text Muted `#6B7280`/20%, text Text Muted |
| EXPIRED | bg Error `#EF4444`/20%, text Error `#EF4444` |
| CANCELLED | bg Warning `#F59E0B`/20%, text Warning `#F59E0B` |

---

## Screen 04 — Rental Detail (`/rentals/:id`)

### Layout

```
┌────────────────────────────────────────────────────────────┐
│  ← Quay lại    Chi tiết thuê #847291                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─── Thông tin ────────────────────┐ ┌─── Timeline ─────┐│
│  │                                    │ │ ● Tạo thuê       ││
│  │  Mã:        #847291               │ │   15/05 14:32   ││
│  │  Trạng thái: ● ACTIVE             │ │                  ││
│  │  Khách hàng: 0901***234           │ │ ● Mở khóa lần 1  ││
│  │  Ngăn:       A1 - Tủ A            │ │   15/05 14:45   ││
│  │  Gói:       1 ngày / 1 lượt      │ │                  ││
│  │  Giá:        15,000 VND           │ │ ● ...            ││
│  │  Hết hạn:    22/05/2026 14:32    │ │                  ││
│  │  Thanh toán: Đã thanh toán (MoMo) │ │                  ││
│  │                                    │ └──────────────────┘│
│  │  [ Mở khóa ]  [ Hủy thuê ]        │                     │
│  └────────────────────────────────────┘                     │
│                                                            │
│  ┌─── Logs ────────────────────────────────────────────────┐
│  │  #001 | Mở khóa | 15/05 14:32 | IP 1.2.3.4 | ✓        │
│  │  #002 | Đóng khóa | 15/05 14:45 | IP 1.2.3.4 | ✓       │
│  │  #003 | ...                                              │
│  └─────────────────────────────────────────────────────────┘
└────────────────────────────────────────────────────────────┘
```

### Two-Column Layout

**Left column (60%):**
- Info card: bg Surface, rounded-xl, p-6
- Info rows: label (Text Secondary 12px) + value (Text Primary 14px bold)
- Status badge (large)
- Expiry countdown: if < 24h, show "Còn X giờ" in Error color
- Action buttons:
  - "Mở khóa": bg Brand `#FF6600`, opens compartment
  - "Hủy thuê": outline red, confirmation dialog before action

**Right column (40%):**
- Timeline: vertical line + dots, newest first
- Each event: dot (filled = success, outlined = pending) + description + timestamp

### Confirm Dialog (for Cancel)

```
┌────────────────────────────────┐
│  Xác nhận hủy thuê            │
│                                │
│  Bạn có chắc muốn hủy thuê    │
│  #847291 không?                │
│                                │
│  Ngăn A1 sẽ được giải phóng.   │
│                                │
│  [ Hủy bỏ ]    [ Xác nhận ]   │
└────────────────────────────────┘
```

---

## Screen 05 — Cabinet List (`/cabinets`)

### Layout

```
┌────────────────────────────────────────────────────────────┐
│  Quản lý Tủ                        [+ Thêm tủ mới]         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────────┐ ┌───────────────────────────┐ │
│  │ Địa điểm: Tất cả    ▼ │ │ Trạng thái: Tất cả     ▼  │ │
│  └────────────────────────┘ └───────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Tên      │ Địa điểm    │ Trạng thái │ Ngăn  │ Hành │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ SmartBox A│ UVerse SGU │ ● Online   │ 8/12  │  ⋮   │  │
│  │ SmartBox B│ UVerse SGU │ ● Online   │ 6/10  │  ⋮   │  │
│  │ SmartBox C│ 23 Lê Duẩn │ ● Offline  │ -     │  ⋮   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Cabinet Status Visual Grid                     │  │
│  │  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐          │  │
│  │  │A1│ │A2│ │A3│ │A4│ │B1│ │B2│ │B3│ │B4│          │  │
│  │  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘          │  │
│  │  🟢  🟢  🟠  🔴  🟢  🟢  🟡  🟢                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Table Columns

| Column | Width | Notes |
|--------|-------|-------|
| Tên | 160px | Cabinet name + status dot |
| Địa điểm | 200px | Location name |
| Trạng thái | 100px | Online (green dot), Offline (red), Inactive (gray) |
| Ngăn | 100px | "{available}/{total}" e.g. "8/12" |
| Last seen | 140px | "2 phút trước" or "Offline 1h" |
| Hành động | 80px | `⋮` menu: View, Edit, Delete |

### Cabinet Visual Grid

Below the table, a condensed grid of all compartments across all cabinets:
- Each compartment = small square (48×48px)
- Color-coded by availability
- Tooltip on hover: compartment name + rental status
- Click: navigate to cabinet detail

### Status Dot Colors

- Online: `#00FF41`
- Offline: `#EF4444`
- Inactive: `#6B7280`

---

## Screen 06 — Cabinet Detail (`/cabinets/:id`)

### Layout

```
┌────────────────────────────────────────────────────────────┐
│  ← Quay lại    Tủ A — UVerse SGU              [Sửa] [X]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─── Thông tin ─────────────────────────────────────────┐│
│  │  Tên: SmartBox A      │  Địa điểm: UVerse SGU        ││
│  │  Status: ● Online      │  Last seen: 2 phút trước     ││
│  │  MCP Devices: 1        │  Compartments: 12             ││
│  └───────────────────────────────────────────────────────┘│
│                                                            │
│  ┌─── Grid Ngăn ─────────────────────────────────────────┐│
│  │                                                        ││
│  │    A1      A2      A3      A4      B1      B2         ││
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐           ││
│  │  │ 🟢 │ │ 🟢 │ │ 🟠 │ │ 🔴 │ │ 🟢 │ │ 🟡 │           ││
│  │  │SMALL│ │SMALL│ │SMALL│ │SMALL│ │LRG │ │LRG │       ││
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘           ││
│  │                                                        ││
│  │    B3      B4      C1      C2      C3      C4         ││
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐           ││
│  │  │ 🔴 │ │ 🟢 │ │ 🟢 │ │ 🟢 │ │ 🟢 │ │ 🟢 │           ││
│  │  │LRG │ │LRG │ │SMALL│ │SMALL│ │SMALL│ │SMALL│       ││
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘           ││
│  │                                                        ││
│  └───────────────────────────────────────────────────────┘│
│                                                            │
│  ┌─── Mã màu ────────────────────────────────────────────┐│
│  │ 🟢 Trống │ 🟠 Đang sử dụng │ 🔴 Bảo trì │ 🟡 Đặt trước││
│  └───────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

### Compartment Grid

- Grid layout: `grid-cols-6` (responsive: 3 → 4 → 6)
- Each compartment card:
  - Size: 80×96px
  - Background: color by status (see below)
  - Text: compartment name (bold) + size label (SMALL/LARGE, small)
  - Border-radius: rounded-lg
  - Hover: scale 1.05 + shadow
  - Click: opens compartment detail modal

### Compartment Card Colors

| Status | Background | Border | Text |
|--------|------------|--------|------|
| AVAILABLE | `#10B981`/15% | `#10B981` | `#10B981` |
| OCCUPIED | `#3B82F6`/15% | `#3B82F6` | `#3B82F6` |
| MAINTENANCE | `#EF4444`/15% | `#EF4444` | `#EF4444` |
| RESERVED | `#F59E0B`/15% | `#F59E0B` | `#F59E0B` |

### Compartment Detail Modal (on click)

```
┌────────────────────────────────┐
│  Ngăn A1 — Chi tiết            │
│                                │
│  Kích thước: SMALL             │
│  Trạng thái: ● Đang sử dụng    │
│  Rental: #847291               │
│  Khách hàng: 0901***234        │
│  Hết hạn: 22/05/2026          │
│                                │
│  Khóa: 🔒 LOCKED              │
│  Cửa: 🚪 CLOSED               │
│                                │
│  [ Mở khóa ]  [ Đóng ]        │
└────────────────────────────────┘
```

- Lock/Door status updated via Socket.io in real-time
- "Mở khóa" button: bg Brand, calls API + MQTT

---

## Screen 07 — Location List (`/locations`) — Super Admin Only

### Layout

```
┌────────────────────────────────────────────────────────────┐
│  Quản lý Địa điểm                  [+ Thêm địa điểm]       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Tên          │ Địa chỉ              │ Tủ │ Trạng thái│  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ UVerse SGU   │ 273 An Dương Vương   │ 2  │ ● Active  │  │
│  │ UVerse Lê Duẩn│ 23 Lê Duẩn          │ 1  │ ● Active  │  │
│  │ Shopee Ngã tư│ 123 Nguyễn Trãi      │ 0  │ ○ Inactive│  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Bản đồ tĕnh thu nhỏ                      │  │
│  │                    [Map Preview]                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Location Form Modal

```
┌────────────────────────────────────────────────────────────┐
│  Thêm / Sửa địa điểm                                        │
│  ─────────────────────────────────────────────────────────  │
│                                                            │
│  Tên địa điểm *                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ UVerse SGU                                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Địa chỉ *                                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 273 An Dương Vương, P.3, Q.5, TP.HCM               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Tọa độ (tùy chọn)                                         │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  Lat: 10.76 │  │  Lng: 106.69 │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                            │
│  Google Place ID (tùy chọn)                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ChIJ...                                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Trạng thái: [● Active] [○ Inactive]                       │
│                                                            │
│  [ Hủy ]                              [ Lưu địa điểm ]    │
└────────────────────────────────────────────────────────────┘
```

### Map Preview

Static map image using Google Maps Static API or OpenStreetMap tile image, showing pin at location coordinates.

---

## Screen 08 — Notification List (`/notifications`)

### Layout

```
┌────────────────────────────────────────────────────────────┐
│  Thông báo                                    [Đánh dấu  │
│                                                       đã đọc]│
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌ Tất cả ─┐ ┌ Chưa đọc ─┐ ┌ Đã đọc ─┐                    │
│  └─────────┘ └───────────┘ └──────────┘                    │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🔴 │ Thông báo thuê hết hạn              10 phút trước│  │
│  │    │ Rental #847291 đã hết hạn. Click để xem chi tiết.│  │
│  ├────┼──────────────────────────────────────────────────┤  │
│  │ 🟢 │ Thanh toán thành công                   1 giờ trước│  │
│  │    │ Rental #382910 đã được thanh toán.               │  │
│  ├────┼──────────────────────────────────────────────────┤  │
│  │ 🟡 │ Tủ offline                              2 giờ trước│  │
│  │    │ SmartBox C đã offline. Kiểm tra nguồn điện.      │  │
│  └────┴──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Notification Item

- Left border: color by type (red=RENTAL_EXPIRED, green=PAYMENT_SUCCESS, yellow=CABINET_OFFLINE, blue=SYSTEM)
- Icon + Type label
- Title: bold
- Body: description
- Time: "relative" (2 phút trước, 1 giờ trước, 3 ngày trước)
- Unread: bg slightly lighter, bold title
- Read: bg normal Surface
- Hover: bg Surface Elevated
- Click: mark as read + navigate to related resource

### Tabs

Three tabs: Tất cả | Chưa đọc | Đã đọc. Active tab has Brand underline.

---

## Shared Components

### Sidebar

- Width: 240px (icon-only: 64px at md breakpoint)
- Background: Surface `#1C1B1B`
- Logo at top: SmartBox icon + "SmartBox" in Brand color
- Nav items: icon + label, gap-2, px-3, py-2.5, rounded-lg
- Active item: bg Brand/10%, text Brand, left border Brand 3px
- Hover: bg Surface Elevated
- Nav items:
  - 📊 Dashboard → `/dashboard`
  - 🗄️ Tủ → `/cabinets`
  - 📍 Địa điểm → `/locations` (Super Admin)
  - 📋 Thuê → `/rentals`
  - 🔔 Thông báo → `/notifications`
- Bottom: Admin avatar + name + role + logout button

### Header

- Height: 64px
- Background: Surface `#1C1B1B`, border-bottom `#333`
- Left: Hamburger menu (mobile) + page title
- Right: Notification bell with count badge (red dot if unread) + admin dropdown

### Status Badge Component

Reusable badge with variant prop:
```tsx
<Badge variant="success" text="ACTIVE" />
<Badge variant="error" text="EXPIRED" />
<Badge variant="warning" text="CANCELLED" />
<Badge variant="muted" text="COMPLETED" />
<Badge variant="info" text="OCCUPIED" />
```

### Table Component

Reusable data table with:
- Column definitions (header, accessor, width, render)
- Sorting (click header to sort)
- Loading skeleton (3-5 rows)
- Empty state: illustration + "Không có dữ liệu"
- Row hover + click handler

### Modal Component

- Overlay: bg black/60%, backdrop-blur-sm
- Card: bg Surface, rounded-xl, max-w-md or max-w-lg
- Header: title + close X button
- Footer: action buttons (right-aligned)
- Close on Escape + overlay click

### Confirm Dialog Component

Small modal variant:
- Warning icon for destructive actions
- Title + description
- Cancel (ghost) + Confirm (destructive red or primary Brand) buttons

### Toast / Notification

- Bottom-right corner, stacked
- Auto-dismiss after 4s
- Variants: success, error, warning, info
- Icon + message + close button
- Slide-in animation

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 768px (mobile) | Sidebar becomes off-canvas drawer, hamburger toggle |
| 768px - 1024px (tablet) | Sidebar icon-only (64px), labels hidden |
| > 1024px (desktop) | Full sidebar (240px) |

---

## Animation & Transitions

- Page transitions: fade 200ms
- Sidebar open/close: slide 300ms ease
- Modal: scale from 0.95 + fade 200ms
- Table row hover: bg transition 150ms
- Card hover: scale(1.02) + shadow transition 200ms
- Toast: slide-in from right 300ms
- Skeleton loading: pulse animation

---

## Error & Empty States

### Empty State (generic)
```
┌─────────────────────────────────────────┐
│                                         │
│            📦 [illustration]             │
│                                         │
│         Không có dữ liệu               │
│         Dữ liệu sẽ xuất hiện ở đây     │
│                                         │
└─────────────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────────────┐
│                                         │
│          ⚠️ [error icon]                │
│                                         │
│       Đã xảy ra lỗi                    │
│       {error.message}                   │
│                                         │
│       [ Thử lại ]                       │
│                                         │
└─────────────────────────────────────────┘
```

### Loading State
- Full page: centered spinner + "Đang tải..."
- Table: 5 skeleton rows with animated pulse
- Cards: skeleton rectangles with pulse
- Spinner: Brand color, 24px, rotate animation

---

## Page Title Conventions

- Page header: "Quản lý {resource}" + action button right-aligned
- Breadcrumb for detail pages: "Quản lý {resource} > {item name}"
- Page title updates on route change

---

## Form Validation Rules

| Field | Rules |
|-------|-------|
| Email (login) | Required, valid email format |
| Password (login) | Required, min 1 char |
| Rental code search | Optional, 6 digits |
| Date range | Start ≤ End |
| Location name | Required, min 2 chars |
| Location address | Required, min 5 chars |

Error messages appear below the field in Error color, 12px.
