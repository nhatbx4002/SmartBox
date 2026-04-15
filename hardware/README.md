# SmartBox Hardware — Pi Agent

> Phần điều khiển tủ thông minh SmartBox trên Raspberry Pi 3
> Tech: PySide6 + Python 3 + MQTT + RPi.GPIO

---

## Mục lục

- [Tổng quan](#tổng-quan)
- [Cài đặt](#cài-đặt)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Screen Flow](#screen-flow)
- [API Integration](#api-integration)
- [GPIO Pin Mapping](#gpio-pin-mapping)
- [Chạy ứng dụng](#chạy-ứng-dụng)

---

## Tổng quan

Pi Agent chạy trên Raspberry Pi 3 kết nối màn hình cảm ứng 7" (800×480px), điều khiển solenoid lock qua GPIO, giao tiếp với Backend qua MQTT + REST API.

### Chức năng chính

- **Giao diện kiosk** — 7 màn hình chính + 2 overlay
- **Điều khiển khóa** — GPIO → Relay → Solenoid
- **MQTT** — Real-time status với Backend
- **REST API** — Xác minh mã mở tủ

---

## Cài đặt

### 1. Cài Python 3 + pip

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

### 2. Tạo virtual environment

```bash
python3 -m venv venv
source venv/bin/activate  # Linux/ macOS
venv\Scripts\activate     # Windows
```

### 3. Cài dependencies

```bash
pip install -r requirements.txt
```

### 4. Cấu hình

Chỉnh sửa `config.yaml`:

```yaml
mqtt:
  broker: "YOUR_VPS_IP"
  port: 1883
  username: "pi01"
  password: "YOUR_PASSWORD"

api:
  base_url: "https://YOUR_VPS_URL"

gpio:
  locker_1: 17
  locker_2: 27
  sensor_1: 22
  sensor_2: 23

support:
  hotline: "1900 1234"

app:
  countdown_open: 120
  countdown_default: 60
```

### 5. Cài PySide6 (standalone, không cần Qt Designer)

```bash
pip install PySide6
```

### 6. Chạy

```bash
python main.py
```

> **Trên Pi:** Để chạy fullscreen kiosk, xem section **Kiosk Mode** bên dưới.

---

## Cấu trúc thư mục

```
hardware/
├── main.py                    # Entry point, stacked widget navigation
├── config.yaml                # Cấu hình (MQTT, API, GPIO, hotline)
├── requirements.txt           # Python dependencies
│
├── ui/                        # Qt Designer .ui files
│   ├── DashBoard.ui           # Home
│   ├── OTPInputScreen.ui      # Gửi đồ / Nhận đồ
│   ├── RentSizeScreen.ui      # Chọn Size 1 / Size 2
│   ├── RentPlanScreen.ui      # Chọn gói thuê
│   ├── RentPhoneScreen.ui     # Nhập SĐT
│   ├── PaymentScreen.ui        # Thanh toán
│   ├── RentSuccessScreen.ui   # Thành công + Mở ngay / Dùng sau
│   ├── SupportScreen.ui        # Hỗ trợ
│   ├── BoxOpen.ui             # Overlay: tủ đã mở
│   ├── ProcessingScreen.ui     # Overlay: spinner
│   └── components/
│       ├── headers.ui         # Header: logo + clock + back
│       └── footer.ui          # Footer: version + warning
│
├── assets/icons/              # SVG icons (Logo, Send, Receive...)
│   ├── Logo.svg
│   ├── Send.svg
│   ├── Receive.svg
│   ├── Rent.svg
│   ├── Support.svg
│   ├── Box.svg
│   ├── Open.svg
│   ├── resources.qrc
│   └── resources_rc.py        # Compiled resource (pyside6-rcc)
│
├── screens/                   # Python screen controllers
│   ├── __init__.py
│   ├── home_screen.py
│   ├── otp_screen.py
│   ├── rent_size_screen.py
│   ├── rent_plan_screen.py
│   ├── rent_phone_screen.py
│   ├── payment_screen.py
│   ├── rent_success_screen.py
│   ├── support_screen.py
│   └── overlays.py
│
├── services/                  # Backend integration
│   ├── __init__.py
│   ├── api_client.py          # REST API calls
│   ├── mqtt_client.py         # MQTT pub/sub
│   └── gpio_controller.py     # GPIO lock control
│
└── docs/
    ├── SCREEN_FLOW_MAP.md     # Screen designs + navigation
    └── superpowers/
        └── UI_DOCUMENTATION.md
```

---

## Screen Flow

```
Home (/)
├── GỬI ĐỒ  ──► /otp-deposit ──► Processing ──► LockerOpen ──► Home
├── NHẬN ĐỒ ──► /otp-pickup  ──► Processing ──► LockerOpen ──► Home
├── THUÊ TỦ  ──► /rent-size ──► /rent-plan ──► /rent-phone
│                                ──► /payment ──► /rent-success
│                                       ├── [MỞ NGAY] ──► LockerOpen ──► Home
│                                       └── [DÙNG SAU] ──► Home
└── HỖ TRỢ  ──► /support ──► Home
```

| Screen | Route | File |
|--------|-------|------|
| Home | `/` | `DashBoard.ui` |
| Gửi đồ | `/otp-deposit` | `OTPInputScreen.ui` |
| Nhận đồ | `/otp-pickup` | `OTPInputScreen.ui` |
| Chọn Size | `/rent-size` | `RentSizeScreen.ui` |
| Chọn gói | `/rent-plan` | `RentPlanScreen.ui` |
| Nhập SĐT | `/rent-phone` | `RentPhoneScreen.ui` |
| Thanh toán | `/payment` | `PaymentScreen.ui` |
| Thuê thành công | `/rent-success` | `RentSuccessScreen.ui` |
| Hỗ trợ | `/support` | `SupportScreen.ui` |
| LockerOpen | overlay | `BoxOpen.ui` |
| Processing | overlay | `ProcessingScreen.ui` |

---

## API Integration

### REST Endpoints (Backend)

| Endpoint | Method | Mô tả |
|----------|--------|--------|
| `/auth/verify-pin` | POST | Xác minh mã mở tủ |
| `/lockers/available` | GET | Kiểm tra tủ trống theo size |
| `/rentals` | POST | Tạo phiên thuê mới |

### MQTT Topics

| Topic | Direction | Payload |
|-------|-----------|---------|
| `locker/{id}/unlock` | Backend → Pi | `{ authorized: true }` |
| `locker/{id}/status` | Pi → Backend | `{ status: "OPENED" / "CLOSED" }` |
| `locker/heartbeat` | Pi → Backend | `{ online: true }` |

---

## GPIO Pin Mapping

### Prototype (2 ngăn)

| GPIO | Chức năng |
|------|-----------|
| GPIO 17 | Relay Locker 1 (Size 1 - nhỏ) |
| GPIO 27 | Relay Locker 2 (Size 2 - lớn) |
| GPIO 22 | Magnetic Sensor 1 |
| GPIO 23 | Magnetic Sensor 2 |

### Mở rộng (8 ngăn — future)

Dùng GPIO Expander (PCF8574 / 74HC595) qua I2C/SPI.

---

## Chạy ứng dụng

### Development (trên máy tính)

```bash
source venv/bin/activate
python main.py
```

### Production (trên Raspberry Pi)

#### Kiosk Mode — Auto-start Chromium

```bash
# Tạo autostart
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/smartbox.desktop << EOF
[Desktop Entry]
Type=Application
Name=SmartBox
Exec=chromium-browser --kiosk http://localhost:5000
EOF
```

> **Lưu ý:** Nếu dùng PySide6 trực tiếp trên Pi thay vì web, chạy:
> ```bash
> python3 main.py
> ```
> Để fullscreen, thêm: `self.showFullScreen()` trong `__init__`

#### Fullscreen kiosk (PySide6)

```python
# Trong main.py, thay đổi:
window = SmartBoxApp()
window.showFullScreen()  # Thay vì window.show()
```

---

## Troubleshooting

### Lỗi "Cannot connect to display"

```bash
export DISPLAY=:0
python main.py
```

### Lỗi GPIO

```bash
# Kiểm tra quyền truy cập GPIO
sudo usermod -a -G gpio $USER
# Log out and log back in
```

### Lỗi MQTT không kết nối

Kiểm tra:
1. VPS firewall mở port 1883
2. `config.yaml` đúng IP/port
3. Pi cùng mạng với VPS

---

## Liên hệ

- **Hotline:** Cấu hình trong `config.yaml` → `support.hotline`
- **Version:** SmartBox v1.0
