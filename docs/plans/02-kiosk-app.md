# SmartBox Kiosk App — Full Implementation Plan

## Context

Hiện tại `raspi_app/` mới chỉ có scaffold cơ bản:
- `main.py`: load Dashboard.ui, chưa có navigation
- 3 UI screens: Dashboard, OTP, RentPlan
- 3 service stubs: rỗng hoàn toàn
- `config.yaml`: thiếu nhiều trường

Cần implement đầy đủ kiosk app theo design trong `SCREEN_FLOW_MAP.md` và `01-foundation-design.md`.

---

## Phase 1: Cập nhật `config.yaml`

Bổ sung đầy đủ cấu hình theo design doc section 4.2:

```yaml
api:
  base_url: "http://10.0.0.1:3000"
  timeout: 10

mqtt:
  broker: "10.0.0.1"
  port: 1883
  client_id: "smartbox-kiosk-001"
  topics:
    status: "smartbox/+/lock/+/status"
    heartbeat: "smartbox/+/heartbeat"

hardware:
  driver: "mcu2317"

mcu2317:
  bus: 1
  default_address: 0x20

locker:
  unlock_duration: 3
  close_timeout: 120

app:
  countdown_open: 120
  screen_width: 720
  screen_height: 1280
  header_height: 80
  footer_height: 48
  fullscreen: true

support:
  hotline: "1900 1234"
  email: "support@smartbox.io"

cabinet:
  id: ""
  name: "SmartBox Kiosk #1"
```

---

## Phase 2: Implement Services (3 files)

### 2.1 `services/config_loader.py` (mới)

Load `config.yaml` → singleton object. Dùng chung cho tất cả services.

### 2.2 `services/api_client.py`

Dựa trên backend API endpoints từ design doc:

```python
# API endpoints theo backend schema
class ApiClient:
    def __init__(self, config)
    def get_lockers_available(self, size: str) -> dict
    def get_plans(self, size: str) -> list[Plan]
    def create_rental(self, phone: str, size: str, plan_id: str) -> Rental
    def verify_pin(self, code: str) -> VerifyResult  # cho deposit + pickup
    def get_rental(self, code: str) -> Rental          # lookup rental by code
```

Error handling: timeout → show error screen, network error → retry with backoff.

### 2.3 `services/mqtt_client.py`

```python
class MqttClient:
    def __init__(self, config, on_status_callback)
    def connect() -> bool
    def subscribe_status()           # smartbox/+/lock/+/status
    def publish_unlock(cabinet_id, compartment_id)  # smartbox/{id}/lock/{comp}/unlock
    def publish_heartbeat(cabinet_id)
    def on_status(topic, payload)    # callback khi nhận MQTT message
```

### 2.4 `services/gpio_controller.py`

```python
class GpioController:
    def __init__(self, config)
    def unlock(compartment_id: str, pin_lock: int, duration: int = 3)
    def get_door_status(pin_sensor: int) -> bool  # True=open, False=closed
    def cleanup()
```

Dùng `smbus2` cho I2C MCP23017. Fallback mock mode khi không có hardware.

---

## Phase 3: Screen Controllers (9 files trong `screens/`)

### 3.1 `screens/__init__.py`

Expose `ScreenController` base class và registry dict.

### 3.2 `screens/base.py`

```python
class ScreenController:
    def __init__(self, app: 'KioskApp', ui_widget: QWidget)
    def on_enter(data: dict)      # called when screen becomes active
    def on_exit()                  # called when leaving screen
    def show_error(msg: str)       # shared error display
```

### 3.3 `screens/home.py` → `HomeController`
- 4 cards: Gửi đồ, Nhận đồ, Thuê tủ, Hỗ trợ
- Navigate → `/otp-deposit`, `/otp-pickup`, `/rent-size`, `/support`

### 3.4 `screens/otp.py` → `OtpController`
- Single controller cho cả deposit và pickup (param `mode: deposit|pickup`)
- 6 ô OTP input với auto-focus navigation
- Gọi `api_client.verify_pin(code)`
- Success → Processing → LockerOpen
- Error → shake animation + error message

### 3.5 `screens/rent_size.py` → `RentSizeController`
- 2 cards: SMALL, LARGE
- Gọi `api_client.get_lockers_available(size)` để check còn tủ không
- Navigate → `/rent-plan`

### 3.6 `screens/rent_plan.py` → `RentPlanController`
- 3 plan cards: Single, Multi, Monthly
- Sub-options: click mở rộng chọn duration
- Gọi `api_client.get_plans(size)` để lấy danh sách plan
- Navigate → `/rent-phone`

### 3.7 `screens/rent_phone.py` → `RentPhoneController`
- Input SĐT với prefix `+84 |`
- Validation: 9 số sau prefix
- Navigate → `/payment`

### 3.8 `screens/payment.py` → `PaymentController`
- Hiển thị amount + plan name
- 4 payment methods (MoMo, ZaloPay, VietQR, Cash) — radio selection
- Gọi `api_client.create_rental()` (mock payment)
- Navigate → `/rent-success`

### 3.9 `screens/rent_success.py` → `RentSuccessController`
- Hiển thị: mã 6 số, tủ name, expiresAt
- [Mở ngay] → LockerOpen → Home
- [Dùng sau] → Home

### 3.10 `screens/support.py` → `SupportController`
- Hotline từ config
- FAQ accordion (3 câu hỏi expand/collapse)
- Gọi hotline button

### 3.11 `screens/locker_open.py` → `LockerOpenController` (overlay)
- Countdown timer 120s
- Theo dõi door status via MQTT
- [Hoàn tất] button → close door → Home
- Auto-close khi hết countdown

### 3.12 `screens/processing.py` → `ProcessingController` (overlay)
- Animated spinner + progress bar
- Auto-dismiss khi done

---

## Phase 4: Navigation Core — Rewrite `main.py`

Thay thế hoàn toàn `main.py`:

```python
class KioskApp(QWidget):
    def __init__(self):
        self.stacked = QStackedWidget()
        self.screens = {}          # name -> (controller, widget)
        self.screen_data = {}     # name -> data dict

    def navigate(screen_name, data={})
    def go_back()                  # dùng stack để back
```

**Screen stack** (back navigation):
```
[/] → [/otp-deposit] → [Processing] → [LockerOpen]
[/] → [/otp-pickup] → [Processing] → [LockerOpen]
[/] → [/rent-size] → [/rent-plan] → [/rent-phone] → [/payment] → [/rent-success] → [LockerOpen]
[/] → [/support] → [/]
```

**Header tích hợp**: Mỗi screen widget tự chứa header (80px) + nội dung + footer (48px). Header có nút back (`← Quay lại`) và title. Footer: version + online status.

**Clock**: QTimer update mỗi giây ở header.

---

## Phase 5: Tạo UI files còn thiếu

Tạo 5 file `.ui` mới trong `ui/`:

1. **`ui/RentSize.ui`** — 2 cards (SMALL/LARGE), back button, header
2. **`ui/RentPhone.ui`** — SĐT input với prefix +84, numpad
3. **`ui/Payment.ui`** — Amount hiển thị + 4 payment methods radio
4. **`ui/RentSuccess.ui`** — Code hiển thị + 2 buttons (Mở ngay / Dùng sau)
5. **`ui/Support.ui`** — Hotline + FAQ accordion

Layout convention:
- Width: 720px, background: `#0A0A0A`
- Header: 80px, Footer: 48px (embedded trong mỗi screen widget)
- Corner radius: 18px cho cards
- Font: Be Vietnam Pro (fallback Segoe UI)

---

## Phase 6: Update UI files hiện có

### `ui/OTPInput.ui`
- Thêm object name prefix: `btnDepositMode` / `btnPickupMode` để phân biệt
- Hoặc dùng chung và truyền `mode` param

### `ui/RentPlan.ui`
- Thêm checkable cho `btnMonth6`
- Object names đã đúng theo `ui_handle.md`

---

## Phase 7: Cập nhật `requirements.txt`

Thêm:
```
smbus2>=1.0.0
```

---

## Files cần tạo mới

| File | Action |
|------|--------|
| `services/config_loader.py` | Tạo mới |
| `screens/__init__.py` | Tạo mới |
| `screens/base.py` | Tạo mới |
| `screens/home.py` | Tạo mới |
| `screens/otp.py` | Tạo mới |
| `screens/rent_size.py` | Tạo mới |
| `screens/rent_plan.py` | Tạo mới |
| `screens/rent_phone.py` | Tạo mới |
| `screens/payment.py` | Tạo mới |
| `screens/rent_success.py` | Tạo mới |
| `screens/support.py` | Tạo mới |
| `screens/locker_open.py` | Tạo mới |
| `screens/processing.py` | Tạo mới |
| `ui/RentSize.ui` | Tạo mới |
| `ui/RentPhone.ui` | Tạo mới |
| `ui/Payment.ui` | Tạo mới |
| `ui/RentSuccess.ui` | Tạo mới |
| `ui/Support.ui` | Tạo mới |

## Files cần sửa

| File | Action |
|------|--------|
| `config.yaml` | Bổ sung đầy đủ cấu hình |
| `services/api_client.py` | Implement đầy đủ |
| `services/mqtt_client.py` | Implement đầy đủ |
| `services/gpio_controller.py` | Implement đầy đủ |
| `main.py` | Rewrite hoàn toàn với QStackedWidget navigation |
| `requirements.txt` | Thêm smbus2 |
| `ui/RentPlan.ui` | Fix btnMonth6 checkable |

---

## Mock Mode (chế độ dev)

**`config.yaml` thêm:**
```yaml
mode:
  api_mock: true          # True = dùng mock data, False = real API
  mqtt_mock: true         # True = mock MQTT, False = real broker
  gpio_mock: true         # True = mock GPIO, False = real MCP23017
```

**Mock behavior:**
- `ApiClient`: Mock trả data cứng (availablity luôn True, tạo rental với code random)
- `MqttClient`: Log "MQTT mock mode" thay vì connect thật
- `GpioController`: Log "GPIO mock mode" thay vì I2C thật

Khi deploy lên Raspberry Pi → set `mode.mqtt_mock: false`, `mode.gpio_mock: false`.

## Thứ tự implement

1. `config.yaml` + `requirements.txt` (thêm smbus2, mock mode flag)
2. `services/config_loader.py` — load config singleton
3. `services/api_client.py` — mock + real API
4. `services/mqtt_client.py` — mock + real MQTT
5. `services/gpio_controller.py` — mock + real MCP23017
6. `screens/base.py` — base controller
7. Từng screen controller + UI file: Home → OTP → RentSize → RentPlan → RentPhone → Payment → RentSuccess → Support + LockerOpen + Processing
8. Rewrite `main.py` — QStackedWidget navigation
9. Verify: `python main.py` trên dev machine

## Verification

1. `python main.py` — app khởi động, hiển thị Dashboard
2. Click GỬI ĐỒ → OTP screen với bàn phím số
3. Nhập 6 số → Processing → LockerOpen
4. Click THUÊ TỦ → Size → Plan → Phone → Payment → Success
5. Footer hiển thị version + ONLINE status
6. Back navigation hoạt động
