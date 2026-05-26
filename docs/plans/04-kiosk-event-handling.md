# SmartBox Kiosk App — Event Handling Plan

> Dựa trên `docs/plans/02-kiosk-app.md` + tất cả 11 file `.ui` thực tế.
> Mục tiêu: mô tả chi tiết mọi event, signal, navigation, API call, state management cho từng màn hình.

---

## 1. Tổng quan kiến trúc

```
main.py
├── KioskApp (QWidget)
│   ├── QStackedWidget (navigation stack)
│   ├── ScreenController registry
│   └── AppState (singleton — lưu data giữa các screen)
│
├── Services
│   ├── ApiClient — REST calls đến backend
│   ├── MqttClient — MQTT pub/sub
│   └── GpioController — MCP23017 I2C control
│
└── Screens (11)
    └── [ScreenName]Controller(BaseController)
        ├── on_enter(data)
        ├── on_exit()
        └── Widget events → action → navigate
```

### AppState (singleton, truyền data giữa các screen)

```python
class AppState:
    mode: str                    # "deposit" | "pickup" | "rent"
    selected_size: str            # "SMALL" | "LARGE"
    selected_plan: dict           # {id, name, price, ...}
    phone: str                   # "+84" + digits
    payment_method: str           # "MOMO" | "ZALOPAY" | "VIETQR"
    rental_data: dict             # {pin, compartmentId, expiresAt, ...}
    compartment_data: dict       # {name, size, lockerName, ...}
```

### Navigation Routes

```
/                   Home (Dashboard)
/otp                OTP (mode: deposit|pickup)
/loading            Loading overlay (mode: verify|rent|payment)
/rent-size          RentSize
/rent-plan          RentPlan
/rent-phone         RentPhone
/payment            Payment
/qr-payment         QRPayment
/rent-success       RentSuccess
/locker-open        LockerOpen
/support            Support
```

---

## 2. Screen: Home (`Dashboard.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `SendCard` | QFrame (clickable) | mousePressEvent | Navigate `/otp` với `mode=deposit` |
| `ReceiveCard` | QFrame (clickable) | mousePressEvent | Navigate `/otp` với `mode=pickup` |
| `RentCard` | QFrame (clickable) | mousePressEvent | Navigate `/rent-size` |
| `SupportCard` | QFrame (clickable) | mousePressEvent | Navigate `/support` |

### Logic

- **SendCard click** → `AppState.mode = "deposit"` → navigate `/otp`
- **ReceiveCard click** → `AppState.mode = "pickup"` → navigate `/otp`
- **RentCard click** → `AppState.mode = "rent"` → navigate `/rent-size`
- **SupportCard click** → navigate `/support`
- Cards dùng `eventFilter` hoặc override `mousePressEvent` trong Python

### Border colors
- SendCard: `#FF6600` (cam — Gửi đồ)
- ReceiveCard: `#1565C0` (xanh dương — Nhận đồ)
- RentCard: `#2E7D32` (xanh lá — Thuê tủ)
- SupportCard: `#333333` (xám — Hỗ trợ)

---

## 3. Screen: OTP (`OTPInput.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `btnBack` | QPushButton | clicked | Go back (pop navigation stack) |
| `btnKey1` – `btnKey9` | QPushButton | clicked | Type digit "1"–"9" vào active OTP slot |
| `btnKey0` | QPushButton | clicked | Type digit "0" |
| `btnBackspace` | QPushButton | clicked | Xóa 1 ký tự cuối của OTP string |
| `btnClear` | QPushButton | clicked | Clear tất cả 6 OTP slots |
| `btnConfirm` | QPushButton | clicked | Submit OTP |
| `lineOtp1` – `lineOtp6` | QLineEdit | textChanged | Auto-advance sang slot tiếp theo |
| `lineOtp6` | QLineEdit | editingFinished | Auto-submit nếu đủ 6 ký tự |

### OTP Input Logic

```
current_slot = 0  (0-5)
otp_string = ""

Keypad digit clicked:
  → lineOtp[current_slot].setText(digit)
  → otp_string += digit
  → current_slot++
  → if current_slot < 6: setFocus lineOtp[current_slot]

btnBackspace clicked:
  → if current_slot > 0: current_slot--
  → lineOtp[current_slot].clear()

btnClear clicked:
  → clear all 6 slots
  → current_slot = 0
  → setFocus lineOtp1

btnConfirm clicked (hoặc lineOtp6 filled):
  → if len(otp_string) == 6:
      → show Loading overlay
      → call api_client.verify_pin(otp_string, mode)

On lineOtp textChanged:
  → if len(text) == 1:
      → current_slot = this slot index
      → if current_slot < 5: advance focus
```

### API Call

```python
# mode = "deposit" hoặc "pickup"
POST /api/rentals/verify-pin
Body: { "code": "123456", "mode": "deposit" }
```

### Success Flow

```
verify_pin success:
  → AppState.rental_data = response
  → AppState.compartment_data = {name, size, lockerName}
  → navigate /locker-open

verify_pin error (wrong PIN):
  → shake animation on OTP card (CSS animation)
  → show error text "Mã không đúng, vui lòng thử lại"
  → clear OTP slots
  → focus lineOtp1

verify_pin error (expired):
  → show error "Mã đã hết hạn"
  → clear OTP

verify_pin error (no opens left):
  → show error "Đã hết lượt mở"
  → clear OTP
```

---

## 4. Screen: Loading (`Loading.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `progressVerify` | QProgressBar | — | Display progress animation |
| `lblProcessingText` | QLabel | — | Display status text |

### Behavior

- **Full-screen overlay** trên màn hình hiện tại (không navigate)
- Hiển thị spinner icon + progress bar animated
- `lblProcessingText` thay đổi theo context:
  - OTP verify: "Đang xác minh mã..."
  - Payment: "Đang xử lý thanh toán..."
- Progress bar: indeterminate mode (loop animation) hoặc determinate nếu có progress
- Auto-dismiss khi callback được gọi từ parent

### Animation

```python
# CSS indeterminate hoặc QPropertyAnimation
progressVerify.setProperty("value", -1)  # indeterminate
# Hoặc animate từ 0 → 100%
```

---

## 5. Screen: RentSize (`RentSizeSelection.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `btnBack` | QPushButton | clicked | Go back → `/` (Home) |
| `cardSize1` | QFrame (clickable) | mousePressEvent | Select SMALL size |
| `cardSize2` | QFrame (clickable) | mousePressEvent | Select LARGE size |
| `btnContinue` | QPushButton | clicked | Navigate `/rent-plan` |

### Size Selection Logic

```
cardSize1 clicked:
  → AppState.selected_size = "SMALL"
  → cardSize1.setProperty("selected", "true") → CSS orange border
  → cardSize2.setProperty("selected", "false")
  → btnContinue.setEnabled(True)

cardSize2 clicked:
  → AppState.selected_size = "LARGE"
  → cardSize2.setProperty("selected", "true") → CSS orange border
  → cardSize1.setProperty("selected", "false")
  → btnContinue.setEnabled(True)

btnContinue clicked:
  → navigate /rent-plan
```

### Availability Check (optional)

```python
GET /api/lockers/available?size=SMALL
Response: { "available": true/false, "count": 3 }

# Nếu size không còn trống:
→ cardSize1/2 hiển thị overlay "Đã hết tủ"
→ btnContinue vẫn disabled
```

---

## 6. Screen: RentPlan (`RentPlan.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `btnBackMain` | QPushButton | clicked | Go back → `/rent-size` |
| `btnSingle1Day` | QPushButton (checkable) | toggled | Select "1 Ngày" plan |
| `btnSingle7Days` | QPushButton (checkable) | toggled | Select "7 Ngày" plan |
| `btnMulti5_30` | QPushButton (checkable) | toggled | Select "5 lượt/30 ngày" plan |
| `btnMulti10_90` | QPushButton (checkable) | toggled | Select "10 lượt/90 ngày" plan |
| `btnMonth1` | QPushButton (checkable) | toggled | Select "1 tháng" plan |
| `btnMonth3` | QPushButton (checkable) | toggled | Select "3 tháng" plan |
| `btnMonth6` | QPushButton (checkable) | toggled | Select "6 tháng" plan |
| `btnContinue` | QPushButton | clicked | Navigate `/rent-phone` |

### Plan Selection Logic

```
Mỗi plan group (single/multi/monthly) dùng QButtonGroup:
→ Chỉ 1 trong group được check
→ Khi 1 button check:
  → setStyleSheet checked state (green bg)
  → uncheck others in same group
  → AppState.selected_plan = {id, name, price, ...}
  → btnContinue.setEnabled(True)

btnContinue clicked:
  → navigate /rent-phone
```

### Fetch Plans from API (on enter)

```python
GET /api/plans?size=SMALL
Response: [
  {id, name, rentalType, price, maxOpens, durationDays},
  ...
]

# Bind data vào UI:
# Single plans → btnSingle1Day, btnSingle7Days (hiển thị price)
# Multi plans → btnMulti5_30, btnMulti10_90
# Monthly plans → btnMonth1, btnMonth3, btnMonth6
```

---

## 7. Screen: RentPhone (`PhoneNumberInput.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `btnBackMain` | QPushButton | clicked | Go back → `/rent-plan` |
| `btnNum1` – `btnNum9` | QPushButton | clicked | Type digit vào lineEdit |
| `btnKey0` | QPushButton | clicked | Type "0" |
| `btnBackspace` | QPushButton | clicked | Xóa 1 ký tự cuối |
| `btnClear` | QPushButton | clicked | Clear input |
| `btnConfirm` | QPushButton | clicked | Validate & navigate `/payment` |
| `lineEdit` | QLineEdit | textChanged | Validate phone number |

### Phone Input Logic

```
Keypad digit clicked:
  → current_text = lineEdit.text()
  → if len(current_text) < 9:
      → lineEdit.setText(current_text + digit)

btnBackspace clicked:
  → current_text = lineEdit.text()
  → if len > 0: lineEdit.setText(current_text[:-1])

btnClear clicked:
  → lineEdit.clear()

btnConfirm clicked:
  → phone = lineEdit.text()
  → if len(phone) == 9 AND phone.isdigit():
      → AppState.phone = "+84" + phone
      → navigate /payment
  → else:
      → show error "Số điện thoại không hợp lệ"
```

### Validation Rules
- 9 chữ số sau prefix "+84 |"
- Không có leading zero không hợp lệ
- Format hiển thị: "+84 | 098 765 432" (mỗi 3 số ngăn cách)

---

## 8. Screen: Payment (`Payment.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `btnBack` | QPushButton | clicked | Go back → `/rent-phone` |
| `btnPaymentMomo` | QFrame (clickable) | mousePressEvent | Select MoMo |
| `btnPaymentZalo` | QFrame (clickable) | mousePressEvent | Select ZaloPay |
| `btnPaymentVietQR` | QFrame (clickable) | mousePressEvent | Select VietQR |
| `btnPayNow` | QPushButton | clicked | Submit payment → `/qr-payment` |

### Payment Selection Logic

```
btnPaymentMomo clicked:
  → AppState.payment_method = "MOMO"
  → btnPaymentMomo.setProperty("selected", "true") → orange border
  → btnPaymentZalo.setProperty("selected", "false")
  → btnPaymentVietQR.setProperty("selected", "false")
  → btnPayNow.setEnabled(True)

btnPaymentZalo clicked:
  → AppState.payment_method = "ZALOPAY"
  → tương tự

btnPaymentVietQR clicked:
  → AppState.payment_method = "VIETQR"
  → tương tự

btnPayNow clicked:
  → show Loading overlay
  → call api_client.create_rental(...)
  → on success → navigate /qr-payment
```

### Display Data

```
lblAmount.text = "15.000đ"  # từ AppState.selected_plan.price
lblPlanInfo.text = "Size 1 - Thuê 1 lượt (7 ngày)"  # từ AppState
```

### API Call

```python
POST /api/rentals
Body: {
  "phone": "+84987654321",
  "size": "SMALL",
  "planId": "plan_xxx",
  "paymentMethod": "MOMO"
}
Response: {
  "id": "rental_xxx",
  "pin": "847291",
  "compartmentId": "comp_xxx",
  "compartmentName": "A1",
  "expiresAt": "2026-05-19T00:00:00Z",
  "qrData": "base64_or_url"
}

# Lưu:
AppState.rental_data = response
```

---

## 9. Screen: QRPayment (`QRPayment.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `btnBack` | QPushButton | clicked | Cancel → `/payment` |
| `lblQrImage` | QLabel (pixmap) | — | Display QR code |
| `lblPaymentCountdown` | QLabel | timer | Countdown 4:59 → 0:00 |
| `lblWaitingText` | QLabel | — | "Đang chờ thanh toán..." |

### QR Display Logic (on enter)

```
Load QR:
  → qr_data = AppState.rental_data.qrData
  → generate QR pixmap from qr_data
  → lblQrImage.setPixmap(qr_pixmap)

Load payment info:
  → lblPaymentQrTitle.text = "Thanh toán qua Ví MoMo"  # từ AppState.payment_method
  → lblAmountValue.text = AppState.selected_plan.price formatted

Start countdown:
  → remaining = 299  # 5 phút = 299 giây
  → QTimer 1s interval:
      → remaining -= 1
      → lblPaymentCountdown.text = format_mm_ss(remaining)
      → if remaining <= 0:
          → show "Hết thời gian thanh toán"
          → navigate /payment
```

### Poll Payment Status

```python
# Poll every 3 seconds
QTimer 3s interval:
  → GET /api/rentals/{rental_id}/payment-status
  → Response: { "status": "PENDING" | "PAID" | "FAILED" }

  → if status == "PAID":
      → stop timer
      → navigate /rent-success

  → if status == "FAILED":
      → stop timer
      → show error "Thanh toán thất bại"
      → navigate /payment
```

### Countdown Display Format
- `299` → `"04:59"`
- `180` → `"03:00"`
- `0` → `"00:00"` → timeout → quay lại `/payment`

---

## 10. Screen: RentSuccess (`RentSuccess.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `btnOpenNow` | QFrame (clickable) | mousePressEvent | Navigate `/locker-open` |
| `btnUseLater` | QFrame (clickable) | mousePressEvent | Navigate `/` (Home) |

### Display Data (on enter)

```
lblPinCode.text = AppState.rental_data.pin  # "847 291" (formatted)
lblLockerInfo.text = "Tủ A - Ngăn A1 (Size Nhỏ)"
lblPinWarning.text = "Mã này chỉ có hiệu lực đến {expiresAt}"

Format PIN:
  → raw = "847291"
  → display = f"{raw[:3]} {raw[3:]}"  → "847 291"
```

### Actions

```
btnOpenNow clicked:
  → navigate /locker-open

btnUseLater clicked:
  → show confirmation dialog "Bạn có chắc không mở tủ ngay?"
  → nếu OK: navigate /locker-open
  → nếu Cancel: stay

# Hoặc đơn giản:
btnUseLater clicked:
  → navigate /  (Home)
```

---

## 11. Screen: LockerOpen (`OpenSuccess.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `btnFinish` | QPushButton | clicked | Close door → navigate `/` |

### Display Data (on enter)

```
lblLockerName.text = AppState.compartment_data.name  # "Tủ A - Ngăn A1"
lblLockerSize.text = "Size 1 (Nhỏ)"
lblTimerNumber.text = config.countdown_open  # e.g., "120"
```

### Timer & Door Monitoring Logic

```
Start countdown:
  → remaining = config.countdown_open  # từ config.yaml
  → QTimer 1s interval:
      → remaining -= 1
      → lblTimerNumber.text = str(remaining)
      → if remaining <= 30:
          → lblTimerNumber.setStyleSheet("color: #FF0000")  # đỏ
      → if remaining == 0:
          → gpio_controller.unlock(AppState.compartment_data)
          → publish MQTT unlock

Unlock flow:
  → gpio_controller.unlock(compartment_id, pin_lock, duration=3)
  → MQTT publish: smartbox/{cabinet_id}/lock/{comp_id}/unlock
  → Pi receives MQTT → gpio_controller does actual unlock
```

### Door Status Monitoring

```python
# Listen MQTT: smartbox/+/lock/+/status
on_mqtt_status(topic, payload):
  → payload = {doorStatus: "OPEN" | "CLOSED", lockStatus: "LOCKED" | "UNLOCKED"}

  → if doorStatus == "OPEN":
      → lblOpenStatus.text = "CỬA ĐANG MỞ"
      → lblInstruction.text = "Vui lòng cất đồ và đóng cửa"
      → stop countdown timer (đã unlock rồi)

  → if doorStatus == "CLOSED":
      → lblOpenStatus.text = "ĐÃ ĐÓNG CỬA"
      → lblInstruction.text = "Cảm ơn bạn đã sử dụng SmartBox"
      → gpio_controller.lock()  # re-lock
      → navigate /  (Home)
```

### btnFinish clicked

```
btnFinish clicked:
  → gpio_controller.unlock()  # mở khóa
  → lblInstruction.text = "Mời bạn đóng cửa"
  → Bắt đầu chờ door closed event
```

### Auto-close behavior

```
If countdown reaches 0:
  → auto-unlock
  → show message "Cửa sẽ tự động đóng sau khi bạn đóng"

If user closes door (sensor triggers):
  → lock
  → navigate /
```

---

## 12. Screen: Support (`Support.ui`)

### Widgets

| Object | Type | Event | Action |
|--------|------|-------|--------|
| `btnBack` | QPushButton | clicked | Go back → `/` |
| `faqItem1` – `faqItem4` | QFrame | clicked | Toggle expand/collapse answer |

### FAQ Toggle Logic

```
faqItem clicked:
  → if collapsed:
      → animate expand answer (height 0 → full)
      → show answer text
      → collapsed = False
  → if expanded:
      → animate collapse (height → 0)
      → collapsed = True

# Initial state: all collapsed
# Only one FAQ expanded at a time (accordion behavior)
faqItem2 clicked:
  → collapse faqItem1, faqItem3, faqItem4
  → expand faqItem2
```

### Hotline Display

```
lblHotline.text = config.support.hotline  # "1900 1234"
```

---

## 13. Services Integration Map

### ApiClient methods per screen

| Screen | Method | Endpoint | On Success | On Error |
|--------|--------|----------|------------|----------|
| OTP | `verify_pin(code, mode)` | POST `/api/rentals/verify-pin` | → LockerOpen | Shake + error text |
| RentPlan | `get_plans(size)` | GET `/api/plans?size=` | Populate plan buttons | Show "Không tải được gói" |
| RentSize | `check_availability(size)` | GET `/api/lockers/available?size=` | Enable/disable size cards | Disable cards |
| Payment | `create_rental(data)` | POST `/api/rentals` | → QRPayment | Show error, stay |
| QRPayment | `get_payment_status(id)` | GET `/api/rentals/{id}/payment-status` | → RentSuccess / retry | → Payment |

### MqttClient topics

| Topic | Direction | Payload | Action |
|-------|-----------|---------|--------|
| `smartbox/+/lock/+/unlock` | Subscribe | `{ compartmentId }` | Trigger GPIO unlock |
| `smartbox/+/lock/+/status` | Subscribe | `{ doorStatus, lockStatus }` | Update LockerOpen UI |
| `smartbox/+/heartbeat` | Subscribe | `{ cabinetId, ts }` | Update online status |
| `smartbox/{id}/unlock` | Publish | `{ compartmentId, duration }` | — |
| `smartbox/{id}/lock` | Publish | `{ compartmentId }` | — |
| `smartbox/{id}/heartbeat` | Publish (periodic) | `{ cabinetId, ts }` | — |

### GpioController methods

| Method | Called From | Action |
|--------|-------------|--------|
| `unlock(compartment_id, duration)` | LockerOpen | Set relay pin HIGH → Solenoid opens |
| `lock(compartment_id)` | LockerOpen (door closed) | Set relay pin LOW → Solenoid locks |
| `get_door_status(pin)` | LockerOpen | Read magnetic sensor → bool |

---

## 14. Error Handling Patterns

### Network Errors

| Error | Screen | Behavior |
|-------|--------|----------|
| Timeout (>10s) | OTP, Payment, QRPayment | "Mất kết nối. Vui lòng thử lại." + Retry button |
| 400 Bad Request | OTP, Phone | "Thông tin không hợp lệ." + clear input |
| 401 Unauthorized | OTP | "Mã không đúng." + shake animation |
| 404 Not Found | OTP, QRPayment | "Không tìm thấy thông tin." + clear |
| 409 Conflict | Payment | "Tủ đã được thuê. Vui lòng chọn tủ khác." → `/rent-size` |
| 500 Server Error | Any | "Lỗi hệ thống. Vui lòng liên hệ hotline." + Retry |

### Hardware Errors

| Error | Behavior |
|-------|----------|
| GPIO/I2C failure | "Lỗi kết nối phần cứng. Đang thử lại..." + retry 3x |
| Door sensor stuck OPEN | Show warning "Cửa chưa đóng. Vui lòng đóng cửa." |
| Door sensor stuck CLOSED | Skip door monitoring, proceed normally |

---

## 15. State Machine tổng hợp

```
States:
  IDLE                    → Home screen
  OTP_ENTERING            → OTP screen
  OTP_VERIFYING           → Loading overlay on OTP
  RENT_SIZE_SELECTING     → RentSize screen
  RENT_PLAN_SELECTING     → RentPlan screen
  RENT_PHONE_ENTERING     → RentPhone screen
  RENT_PAYMENT_SELECTING  → Payment screen
  RENT_QR_GENERATING      → Loading overlay on Payment
  RENT_QR_WAITING         → QRPayment screen
  RENT_SUCCESS            → RentSuccess screen
  LOCKER_OPENING          → LockerOpen screen
  SUPPORT_VIEWING         → Support screen

Transitions:
  Home SendCard → OTP_ENTERING (mode=deposit)
  Home RentCard → RENT_SIZE_SELECTING
  OTP confirm → OTP_VERIFYING → LOCKER_OPENING (success) | OTP_ENTERING (fail)
  RentSize continue → RENT_PLAN_SELECTING
  RentPlan continue → RENT_PHONE_ENTERING
  RentPhone confirm → RENT_PAYMENT_SELECTING
  Payment pay → RENT_QR_GENERATING → RENT_QR_WAITING
  QRPayment paid → RENT_SUCCESS | RENT_PAYMENT_SELECTING (fail)
  RentSuccess opennow → LOCKER_OPENING
  RentSuccess uselater → IDLE
  LockerOpen finish/timeout → IDLE
```

---

## 16. File cần tạo / sửa

### Tạo mới

| File | Nội dung |
|------|----------|
| `screens/__init__.py` | Expose ScreenController, registry dict |
| `screens/base.py` | BaseController class với on_enter, on_exit, navigate |
| `screens/home.py` | HomeController — 4 card event handlers |
| `screens/otp.py` | OtpController — keypad logic, verify_pin call |
| `screens/rent_size.py` | RentSizeController — size selection, availability check |
| `screens/rent_plan.py` | RentPlanController — plan fetch + selection |
| `screens/rent_phone.py` | RentPhoneController — phone keypad + validation |
| `screens/payment.py` | PaymentController — method selection + create_rental |
| `screens/qr_payment.py` | QRPaymentController — QR display + poll status |
| `screens/rent_success.py` | RentSuccessController — PIN display + action buttons |
| `screens/locker_open.py` | LockerOpenController — countdown + door monitoring |
| `screens/support.py` | SupportController — hotline + FAQ accordion |
| `screens/loading.py` | LoadingController — overlay logic |
| `services/config_loader.py` | Load config.yaml singleton |
| `services/app_state.py` | AppState singleton |

### Sửa

| File | Thay đổi |
|------|----------|
| `main.py` | Rewrite hoàn toàn với QStackedWidget + KioskApp class |
| `services/api_client.py` | Implement đầy đủ (hiện stub) |
| `services/mqtt_client.py` | Implement đầy đủ (hiện stub) |
| `services/gpio_controller.py` | Implement đầy đủ (hiện stub) |
| `raspi_app/CLAUDE.md` | Cập nhật Screen Routes thành luồng đầy đủ |

---

## 17. Checklist event handlers cho từng screen

### Dashboard
- [ ] `SendCard` mousePress → navigate `/otp` + mode=deposit
- [ ] `ReceiveCard` mousePress → navigate `/otp` + mode=pickup
- [ ] `RentCard` mousePress → navigate `/rent-size`
- [ ] `SupportCard` mousePress → navigate `/support`

### OTP
- [ ] 12 keypad buttons (0-9, backspace, clear) → update otp_string + focus
- [ ] 6 lineEdit textChanged → auto-advance focus
- [ ] btnConfirm → validate 6 digits → call verify_pin
- [ ] btnBack → go home
- [ ] Error: shake animation + error text
- [ ] Success: navigate /locker-open

### Loading
- [ ] Display on top of current screen (overlay)
- [ ] Progress bar animation
- [ ] Callback mechanism to dismiss

### RentSize
- [ ] cardSize1 click → select SMALL + orange border
- [ ] cardSize2 click → select LARGE + orange border
- [ ] btnContinue → navigate /rent-plan (enabled only when size selected)
- [ ] btnBack → go home
- [ ] (Optional) Availability check from API

### RentPlan
- [ ] on_enter → fetch plans from API → populate button texts/prices
- [ ] 8 checkable buttons → QButtonGroup per plan type
- [ ] btnContinue → navigate /rent-phone (enabled only when plan selected)
- [ ] btnBackMain → go /rent-size

### RentPhone
- [ ] 13 keypad buttons → update lineEdit text
- [ ] lineEdit textChanged → validate 9 digits
- [ ] btnConfirm → validate + navigate /payment
- [ ] btnBackMain → go /rent-plan

### Payment
- [ ] 3 payment method frames → select method + set selected CSS
- [ ] btnPayNow → call create_rental API → navigate /qr-payment
- [ ] btnBack → go /rent-phone
- [ ] Display amount + plan info from AppState

### QRPayment
- [ ] on_enter → display QR from AppState.rental_data.qrData
- [ ] Start 5-min countdown timer (update every 1s)
- [ ] Poll payment status every 3s
- [ ] On PAID → navigate /rent-success
- [ ] On FAILED/timeout → navigate /payment
- [ ] btnBack → cancel → go /payment

### RentSuccess
- [ ] on_enter → display PIN, locker info, expiresAt
- [ ] btnOpenNow → navigate /locker-open
- [ ] btnUseLater → navigate /home

### LockerOpen
- [ ] on_enter → display locker info + start countdown
- [ ] MQTT subscription → door status events
- [ ] On door OPEN → show "đang mở" message
- [ ] On door CLOSED → lock + navigate /home
- [ ] btnFinish → unlock immediately + wait door close
- [ ] Countdown reaches 0 → auto-unlock
- [ ] btnBack → confirm + go home

### Support
- [ ] btnBack → go home
- [ ] 4 FAQ items → accordion toggle (expand/collapse)
- [ ] Hotline display from config
- [ ] (Optional) Call hotline button

---

## 18. Thứ tự implement đề xuất

1. `services/config_loader.py` + `services/app_state.py`
2. `screens/base.py` (base controller)
3. `screens/__init__.py`
4. `main.py` — KioskApp scaffold + QStackedWidget
5. `screens/home.py` — Dashboard navigation
6. `screens/otp.py` — OTP keypad logic
7. `screens/rent_size.py`
8. `screens/rent_plan.py`
9. `screens/rent_phone.py`
10. `screens/payment.py`
11. `screens/qr_payment.py`
12. `screens/rent_success.py`
13. `screens/locker_open.py`
14. `screens/support.py`
15. `screens/loading.py` (overlay)
16. `services/api_client.py` — implement mock + real
17. `services/mqtt_client.py`
18. `services/gpio_controller.py`
19. Update `raspi_app/CLAUDE.md` screen routes
