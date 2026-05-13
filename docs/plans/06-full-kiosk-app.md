# Plan: Kết nối Backend + Kiosk App — Demo Flow cơ bản

## Context

**Mục tiêu:** Demo 3 luồng cơ bản trên phần cứng thật (MCP23017 điều khiển LED thay khóa):

1. **Gửi đồ** — nhập code → LED A1 sáng → đóng lại
2. **Nhận đồ** — nhập code → LED A1 sáng → đóng lại
3. **Thuê tủ** — chọn size/plan → nhập SĐT → mock payment → LED A1 sáng → nhận code

**Phạm vi:** 1 Pi = 1 cabinet (cabinet-a). 1 ngăn (A1, SMALL, pin 0, chip 0x20, bus 1).
Chưa có thanh toán thật. Chưa có cảm biến cửa.

**Wiring constraint:** LED A1 phải đi vào chân GPA0 (pin 0) của MCP23017 0x20 để match với DB seed.

---

## Tổng quan luồng dữ liệu

```
Pi (cabinet-a)
  ├─ load_from_backend() → GET /api/provisioning/cabinets?cabinetId=cabinet-a
  │   → nhận {A1: {pinLock: 0}}
  │   → build pin_map = {"A1": 0}
  │
  ├─ subscribe "smartbox/cabinet-a/lock/+/unlock"
  │
  └─ Khi nhận MQTT "unlock A1"
       → SMBus(1).write(0x20, pin=0, HIGH)
       → sleep(3)
       → SMBus(1).write(0x20, pin=0, LOW)

Backend (khi tạo rental)
  → Nhận cabinetId="cabinet-a"
  → findAvailableCompartment(cabinetId=cabinet-a, size=SMALL)
  → assign A1 (OCCUPIED)
  → MQTT publish "smartbox/cabinet-a/lock/A1/unlock"
```

---

## 1. Backend — thêm/sửa 4 file

### 1.1 `backend/prisma/seed.ts` — sửa seed chỉ có 1 ngăn

Thay hàm `seedCompartments()` hiện tại bằng:

```typescript
// Chỉ tạo 1 ngăn A1 thay vì 12
const compartment = await prisma.compartment.upsert({
  where: { cabinetId_name: { cabinetId, name: "A1" } },
  update: {},
  create: {
    name: "A1",
    cabinetId,
    size: CompartmentSize.SMALL,
    mcp23017PinLock: 0,
    mcp23017PinSensor: 12,
  },
});
await prisma.compartmentStatus.upsert({
  where: { compartmentId: compartment.id },
  update: {},
  create: { compartmentId: compartment.id },
});
```

Xóa 3 dòng `seedCompartments()` còn lại (B, C, D rows).

### 1.2 `backend/src/routes/rentals.routes.ts` — thêm cabinetId vào schema

```typescript
const createRentalSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{10,11}$/),
  size: z.nativeEnum(CompartmentSize),
  planId: z.string().min(1),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  cabinetId: z.string().min(1).optional(), // ← thêm
});
```

### 1.3 `backend/src/services/rental.service.ts` — filter compartment theo cabinetId

Tìm đoạn `prisma.compartment.findFirst(...)` trong `createRental()`, thêm filter:

```typescript
const compartment = await prisma.compartment.findFirst({
  where: {
    size: input.size,
    status: CompartmentAvailability.AVAILABLE,
    cabinet: {
      status: CabinetStatus.ACTIVE,
      id: input.cabinetId ?? undefined, // ← thêm dòng này
    },
  },
  include: { cabinet: true },
  orderBy: [{ cabinetId: "asc" }, { name: "asc" }],
});
```

### 1.4 `backend/src/routes/provisioning.routes.ts` — tạo mới

```typescript
import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get(
  "/cabinets",
  asyncHandler(async (req, res) => {
    const cabinetId = req.query.cabinetId as string | undefined;
    const where = cabinetId ? { id: cabinetId } : {};
    const cabinets = await prisma.cabinet.findMany({
      where,
      include: {
        compartments: {
          include: { realtimeStatus: true },
        },
      },
    });
    res.json({ data: cabinets });
  }),
);

export default router;
```

### 1.5 `backend/src/index.ts` — mount provisioning router

Tìm chỗ mount router, thêm:

```typescript
import provisioningRouter from "./routes/provisioning.routes";
// ...
app.use("/api/provisioning", provisioningRouter);
```

---

## 2. Raspi App — sửa 6 file

### 2.1 `raspi_app/requirements.txt` — thêm smbus2

```
smbus2
```

### 2.2 `raspi_app/config.yaml` — chỉ lưu connection + identity

```yaml
api:
  base_url: "http://localhost:3000"
  timeout: 10

mqtt:
  broker: "localhost"
  port: 1883
  username: ""
  password: ""

hardware:
  driver: "mcu2317"
  cabinet_id: "cabinet-a" # Pi biết mình quản lý tủ nào
```

### 2.3 `raspi_app/services/api_client.py` — thêm 2 method

Thêm method `get_cabinets_provisioning()`:

```python
def get_cabinets_provisioning(self, cabinet_id=None):
    params = {"cabinetId": cabinet_id} if cabinet_id else {}
    response = requests.get(
        f"{self.base_url}/api/provisioning/cabinets",
        params=params,
        timeout=self.timeout,
    )
    response.raise_for_status()
    return response.json()["data"]
```

Sửa `create_rental()` — thêm `cabinet_id` vào payload:

```python
def create_rental(self, phone, size, plan_id, payment_method, cabinet_id=None):
    response = requests.post(
        f"{self.base_url}/api/rentals",
        json={
            "phone": phone,
            "size": size,
            "planId": self._backend_plan_id(size, plan_id),
            "paymentMethod": payment_method,
            "cabinetId": cabinet_id,
        },
        timeout=self.timeout,
    )
```

### 2.4 `raspi_app/services/gpio_controller.py` — I2C thật thay mock

```python
from __future__ import annotations
from smbus2 import SMBus


class GpioController:
    def __init__(self, mock: bool = True):
        self.mock = mock
        self.pin_map: dict[str, int] = {}
        self._bus = None

    def load_from_backend(self, api_client, cabinet_id: str):
        """Fetch compartment→pin mapping từ backend khi Pi start."""
        cabinets = api_client.get_cabinets_provisioning(cabinet_id)
        for comp in cabinets[0]["compartments"]:
            self.pin_map[comp["name"]] = comp["mcp23017PinLock"]

    def unlock(self, compartment_name: str, duration: int = 3) -> bool:
        if self.mock:
            print(f"[GPIO MOCK] unlock {compartment_name}")
            return True
        try:
            pin = self.pin_map.get(compartment_name, 0)
            self._bus = SMBus(1)
            # Configure pin as output
            self._bus.write_byte_data(0x20, 0x00, 0xFF)  # IODIRA
            # Set pin HIGH (LED on)
            self._bus.write_byte_data(0x20, 0x12, 0xFF & ~(1 << pin))
            import time
            time.sleep(duration)
            # Set pin LOW (LED off)
            self._bus.write_byte_data(0x20, 0x12, 0xFF)
            self._bus.close()
            return True
        except Exception as e:
            print(f"[GPIO ERROR] unlock failed: {e}")
            return False

    def lock(self, compartment_name: str) -> bool:
        if self.mock:
            print(f"[GPIO MOCK] lock {compartment_name}")
            return True
        try:
            pin = self.pin_map.get(compartment_name, 0)
            self._bus = SMBus(1)
            self._bus.write_byte_data(0x20, 0x12, 0xFF)
            self._bus.close()
            return True
        except Exception as e:
            print(f"[GPIO ERROR] lock failed: {e}")
            return False

    def get_door_status(self, compartment_name: str) -> str:
        return "CLOSED"
```

### 2.5 `raspi_app/services/mqtt_client.py` — thêm subscribe

Thêm method `subscribe_unlock(callback)` và `subscribe_lock(callback)`:

```python
def subscribe_unlock(self, cabinet_id: str, callback):
    topic = f"smartbox/{cabinet_id}/lock/+/unlock"
    def on_message(client, userdata, msg):
        # Extract compartment name from topic: smartbox/cabinet-a/lock/A1/unlock
        parts = msg.topic.split("/")
        if len(parts) >= 4:
            compartment = parts[3]
            callback(compartment)
    self._client.message_callback_add(topic, on_message)
    self._client.subscribe(topic)

def subscribe_lock(self, cabinet_id: str, callback):
    topic = f"smartbox/{cabinet_id}/lock/+/lock"
    def on_message(client, userdata, msg):
        parts = msg.topic.split("/")
        if len(parts) >= 4:
            compartment = parts[3]
            callback(compartment)
    self._client.message_callback_add(topic, on_message)
    self._client.subscribe(topic)
```

Trong `connect()`: gọi `self._client.loop_start()`.
Trong `disconnect()`: gọi `self._client.loop_stop()`.

### 2.6 `raspi_app/main.py` — bật thật + load provisioning

```python
# Sau khi load config
cabinet_id = config.get("hardware", {}).get("cabinet_id", "cabinet-a")

self.api_client = ApiClient(config, mock=False)
self.gpio = GpioController(mock=False)
self.gpio.load_from_backend(self.api_client, cabinet_id)  # ← gọi ở đây

self.mqtt_client = MqttClient(config, mock=False)
self.mqtt_client.subscribe_unlock(cabinet_id, self.gpio.unlock)
self.mqtt_client.subscribe_lock(cabinet_id, self.gpio.lock)

# Khi app close
self.mqtt_client.disconnect()
```

### 2.7 `raspi_app/screens/locker_open.py` — gọi GPIO thật

```python
def on_enter(self):
    self.gpio.unlock(self.compartment_id, duration=3)

def _finish(self):
    self.gpio.lock(self.compartment_id)
```

---

## 3. Wiring MCP23017 (phần cứng)

```
MCP23017 0x20 (bus I2C-1, địa chỉ 0x20)
  GPA0 (pin 21) → LED A1  ← chân duy nhất cần đi dây
  GND           → GND LED
  3.3V/5V      → VCC LED (qua resistor)
```

---

## 4. Test và verification

### Step 1: Backend

```bash
# Reset DB + seed
cd backend/
npm run db:push
npm run db:seed
npm run dev
```

### Step 2: Test backend API

```bash
# Health
curl http://localhost:3000/api/health

# Provisioning — check pin mapping
curl "http://localhost:3000/api/provisioning/cabinets?cabinetId=cabinet-a"
# → phải trả về 1 compartment: A1, pinLock=0

# Plans
curl "http://localhost:3000/api/lockers/plans?size=SMALL"

# Tạo rental với cabinetId
curl -X POST http://localhost:3000/api/rentals \
  -H "Content-Type: application/json" \
  -d '{"phone":"0909123456","size":"SMALL","planId":"small-1-day","paymentMethod":"CASH","cabinetId":"cabinet-a"}'
# → trả về code 6 số, compartmentName=A1

# Verify PIN
curl -X POST http://localhost:3000/api/rentals/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"code":"<CODE>","mode":"pickup"}'

# Check MQTT log ở backend terminal
# → phải thấy "smartbox/cabinet-a/lock/A1/unlock" publish
```

### Step 3: Test LED trên Pi (tùy chọn — không cần kiosk)

```python
from smbus2 import SMBus
bus = SMBus(1)
bus.write_byte_data(0x20, 0x00, 0xFF)  # GPA as output
bus.write_byte_data(0x20, 0x01, 0xFF)  # GPB as output
bus.write_byte_data(0x20, 0x12, 0xFE)  # LED A1 on (pin 0)
import time; time.sleep(3)
bus.write_byte_data(0x20, 0x12, 0xFF)  # LED off
bus.close()
```

### Step 4: Full kiosk flow

```bash
cd raspi_app/
pip install -r requirements.txt
python main.py
```

---

## 5. Checklist cuối cùng

- [ ] `npm run db:seed` chạy → DB chỉ có 1 compartment A1
- [ ] `GET /api/provisioning/cabinets?cabinetId=cabinet-a` → A1, pinLock=0
- [ ] Tạo rental với `cabinetId=cabinet-a` → assign A1 (OCCUPIED)
- [ ] Tạo rental khi A1 đang OCCUPIED → lỗi "No available compartment"
- [ ] Verify PIN đúng → MQTT publish unlock → LED sáng 3s
- [ ] Verify PIN sai → trả 401
- [ ] Kiosk mock=False → 3 flow A/B/C đều hoạt động

## 6. Mở rộng sau (không trong scope demo)

- Thêm cảm biến cửa (đọc sensor pin thay vì timer)
- Thêm cabinet thứ 2 → DB seed + config Pi mới
- Thanh toán thật (Momo/ZaloPay)
- Admin web dashboard
