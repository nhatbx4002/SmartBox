# Plan: Hỗ trợ Multiple MCP23017 trên mỗi Cabinet

## Context

Schema hiện tại chỉ lưu 1 MCP23017 cho mỗi Cabinet (`Cabinet.mcp23017Bus` + `mcp23017Address`). Mỗi MCP23017 chỉ có 16 chân (0–15), nên tủ lớn hoặc cần tách lock/sensor ra MCP riêng sẽ không đủ. User muốn mỗi Compartment có thể reference đến MCP device riêng của nó.

## Database Schema Changes

### 1. Thêm model `McpDevice`

```prisma
model McpDevice {
  id        String        @id @default(cuid())
  cabinetId String
  bus       Int           @default(1)
  address   Int           @default(32)  // 32 = 0x20
  name      String?       // ví dụ: "MCP Lock", "MCP Sensor"
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  cabinet   Cabinet       @relation(fields: [cabinetId], references: [id], onDelete: Cascade)
  compartments Compartment[]

  @@unique([cabinetId, bus, address])
  @@index([cabinetId])
}
```

### 2. Thay đổi `Cabinet`

Xoá:

- `mcp23017Bus     Int @default(1)`
- `mcp23017Address Int @default(32)`

Vì thông tin này giờ nằm trong `McpDevice`.

### 3. Thay đổi `Compartment`

Thêm 2 trường reference thay vì chỉ lưu pin:

```prisma
mcp23017PinLock   Int
mcp23017PinSensor Int
lockMcpDeviceId   String?
sensorMcpDeviceId String?
lockMcpDevice     McpDevice? @relation("LockMcp", fields: [lockMcpDeviceId], references: [id])
sensorMcpDevice   McpDevice? @relation("SensorMcp", fields: [sensorMcpDeviceId], references: [id])
```

**Design decision:** `lockMcpDeviceId` và `sensorMcpDeviceId` có thể NULL để backward-compatible với dữ liệu cũ (nếu chỉ có 1 MCP, cả 2 cùng trỏ đến nó). Hoặc bắt buộc NOT NULL nếu muốn schema chặt hơn.

### 4. Migration

```bash
cd backend/
# Tạo migration mới
npx prisma migrate dev --name add_mcp_device
```

Cần viết migration script để:

- Tạo bảng `McpDevice` với 1 record cho mỗi Cabinet (copy bus/address từ Cabinet)
- Update mỗi Compartment: set `lockMcpDeviceId` và `sensorMcpDeviceId` trỏ đến MCP của cabinet cha

## Backend Service Changes

### `backend/src/services/rental.service.ts`

Logic `unlock_compartment` và `lock_compartment` hiện tại cần biết bus+address. Cần update để:

1. Query `Compartment` kèm `lockMcpDevice` relation
2. Extract bus/address từ `McpDevice` thay vì từ `Cabinet`

### `backend/src/services/gpio_controller.ts` (nếu có)

Tương tự, cần nhận `McpDevice` info thay vì hardcode.

## Raspi App Changes

### `raspi_app/services/gpio_controller.py`

`load_from_backend` hiện tại:

```python
# Đang: chỉ lấy 1 bus+address từ Cabinet
# Cần: lấy danh sách McpDevice, map mỗi compartment → MCP device
```

Cập nhật để:

1. Gửi request lấy `McpDevice` list cùng compartment provisioning
2. Xây `pin_map` với cấu trúc: `compartment_id → (bus, address, pin)`
3. `unlock()` / `lock()` đọc bus+address từ map

### API endpoint provisioning

Backend cần trả `mcpDevices` array trong response của endpoint provisioning (VD: `GET /api/cabinets/:id/provisioning`).

## Files cần sửa

| File                                     | Thay đổi                                                       |
| ---------------------------------------- | -------------------------------------------------------------- |
| `backend/prisma/schema.prisma`           | Thêm `McpDevice`, sửa `Cabinet`, `Compartment`                 |
| `backend/src/services/rental.service.ts` | Update unlock/lock logic dùng MCP relation                     |
| `raspi_app/services/gpio_controller.py`  | Map compartment → MCP device, unlock/lock với đúng bus+address |
| Migration files                          | Tạo migration + seed data                                      |

## Verification

1. `npx prisma migrate dev --name add_mcp_device` — migration chạy thành công
2. `npx prisma generate` — client generate không lỗi
3. Backend unlock một compartment → đúng bus+address được query từ DB
4. Raspi app `load_from_backend` → đúng MCP device map
5. Test case: 1 Cabinet có 2 MCP (0x20 + 0x21), verify compartment pin 12 trên MCP 0x21 được unlock đúng chip
