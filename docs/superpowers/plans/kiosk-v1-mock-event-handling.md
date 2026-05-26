# SmartBox Kiosk v1 Mock Event Handling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Hoàn thiện kiosk PySide6 v1 chạy được end-to-end bằng mock services: Home → OTP/open locker, Home → rent flow → payment demo → success/open locker, Support.

**Architecture:** Rewrite `raspi_app/main.py` thành `KioskApp` dùng `QStackedWidget`, mỗi màn hình có controller riêng kế thừa `BaseController`. State dùng singleton/dataclass `AppState`; API/MQTT/GPIO dùng mock-safe services để chạy được khi chưa có backend/hardware.

**Tech Stack:** Python, PySide6 `QUiLoader`, `QStackedWidget`, `QTimer`, `requests`, `PyYAML`, existing `.ui` files.

---

## Summary

- Scope đã chốt: **Kiosk v1 mock**, chưa làm backend route thật, chưa bắt buộc hardware thật.
- Payment flow đã chốt: chọn method rồi bấm `btnPayNow` tạo rental mock và đi thẳng `/rent-success`.
- OTP route đã chốt: dùng **một route `/otp` + `AppState.mode`** cho deposit/pickup.
- QRPayment giữ lại như màn hình dự phòng, chưa nằm trong happy path v1.

## Implementation Changes

### Task 1: Foundation state/config/helpers

- [ ] Create `raspi_app/services/app_state.py` with dataclasses:
  - `Plan(id, name, rental_type, price, duration_days, max_opens)`
  - `RentalData(id, pin, compartment_id, compartment_name, expires_at, qr_data="")`
  - `CompartmentData(id, name, size, locker_name)`
  - `AppState` fields: `mode`, `selected_size`, `selected_plan`, `phone`, `payment_method`, `rental_data`, `compartment_data`
  - methods: `reset_rent_flow()`, `reset_all()`
- [ ] Create `raspi_app/services/config_loader.py`:
  - `load_config(path=None) -> dict`
  - default path is `raspi_app/config.yaml`
  - expose `get_config_value(config, "app.countdown_open", default)`
- [ ] Add pure formatting helpers in `raspi_app/services/formatters.py`:
  - `format_currency(15000) -> "15.000đ"`
  - `format_pin("847291") -> "847 291"`
  - `normalize_vn_phone("987654321") -> "+84987654321"`
  - `is_valid_local_phone(text)`: accept exactly 9 digits after `+84`; do **not** reject leading zero in v1 because current UI/docs example includes `098...`.

### Task 2: Mock-safe services

- [ ] Replace stub `raspi_app/services/api_client.py` with `ApiClient(mock=True)`:
  - `verify_pin(code, mode)` accepts only 6 digits; mock success for any code except:
    - `"000000"` raises `ApiError("Mã không đúng", status_code=401)`
    - `"999999"` raises `ApiError("Mã đã hết hạn", status_code=410)`
  - `get_plans(size)` returns the 7 plans already visible in `RentPlan.ui`, with prices.
  - `check_availability(size)` returns `{"available": True, "count": 3}`.
  - `create_rental(phone, size, plan_id, payment_method)` returns deterministic rental data with pin `"847291"` and compartment `"A1"`.
- [ ] Replace stub `raspi_app/services/mqtt_client.py` with no-op mock:
  - `connect()`, `disconnect()`, `publish_unlock(compartment_id, duration)`, `publish_lock(compartment_id)`.
  - store last published event for future debugging.
- [ ] Replace stub `raspi_app/services/gpio_controller.py` with no-op mock:
  - `unlock(compartment_id, duration=3) -> True`
  - `lock(compartment_id) -> True`
  - `get_door_status(compartment_id) -> "CLOSED"`

### Task 3: Controller base and router

- [ ] Create `raspi_app/screens/base.py`:
  - `BaseController(route, ui_file, app)`
  - loads UI via `QUiLoader`
  - exposes `widget`, `state`, `config`, `api_client`, `mqtt_client`, `gpio_controller`
  - methods: `on_enter(data=None)`, `on_exit()`, `navigate(route, data=None)`, `go_home()`, `set_clickable(frame, callback)`, `refresh_style(widget)`.
- [ ] Update `raspi_app/screens/__init__.py` with route registry names only; avoid importing Qt-heavy modules unless needed.
- [ ] Rewrite `raspi_app/main.py`:
  - create `QApplication`
  - instantiate `KioskApp(QWidget)`
  - set fixed size from config: `720x1280`
  - create `QStackedWidget`
  - register routes:
    - `/`: `Dashboard.ui`
    - `/otp`: `OTPInput.ui`
    - `/rent-size`: `RentSizeSelection.ui`
    - `/rent-plan`: `RentPlan.ui`
    - `/rent-phone`: `PhoneNumberInput.ui`
    - `/payment`: `Payment.ui`
    - `/rent-success`: `RentSuccess.ui`
    - `/locker-open`: `OpenSuccess.ui`
    - `/support`: `Support.ui`
  - maintain `history: list[str]`
  - `navigate(route, data=None, replace=False)` calls old `on_exit`, switches stack, calls new `on_enter`.

### Task 4: Home and Support controllers

- [ ] Create `raspi_app/screens/home.py`:
  - `SendCard`: set `state.mode = "deposit"` then `/otp`
  - `ReceiveCard`: set `state.mode = "pickup"` then `/otp`
  - `RentCard`: `state.mode = "rent"`, `state.reset_rent_flow()`, then `/rent-size`
  - `SupportCard`: `/support`
- [ ] Create `raspi_app/screens/support.py`:
  - `btnBack.clicked -> /`
  - `lblHotline` from `config["support"]["hotline"]`
  - `faqItem1..faqItem4` clickable accordion
  - initial state: show answer 1, hide answers 2-4; clicking one hides the rest.

### Task 5: OTP and locker opening

- [ ] Create `raspi_app/screens/otp.py`:
  - collect `lineOtp1..lineOtp6`; all max length 1.
  - keypad `btnKey0..btnKey9` fills next empty slot.
  - `btnBackspace` clears previous slot.
  - `btnClear` clears all.
  - `btnConfirm` enabled only when 6 digits exist.
  - `btnConfirm` calls `api_client.verify_pin(code, state.mode)`.
  - on success: set `state.rental_data`, `state.compartment_data`, navigate `/locker-open`.
  - on error: show error on `labelOtpTitle`, clear OTP, focus `lineOtp1`.
- [ ] Create `raspi_app/screens/locker_open.py`:
  - `on_enter`: display `lblLockerName`, `lblLockerSize`, `lblOpenStatus`, start countdown from `app.countdown_open` config.
  - immediately call `gpio_controller.unlock()` and `mqtt_client.publish_unlock()`.
  - every second update `lblTimerNumber`; <=10 seconds use red text.
  - `btnFinish.clicked`: lock mock, stop timer, navigate `/`.
  - countdown reaching 0: lock mock, stop timer, navigate `/`.

### Task 6: Rent selection and phone input

- [ ] Create `raspi_app/screens/rent_size.py`:
  - `btnBack -> /`
  - `cardSize1 -> state.selected_size = "SMALL"`
  - `cardSize2 -> state.selected_size = "LARGE"`
  - selected card gets orange border via dynamic style; unselected returns original style.
  - `btnContinue` disabled until selection; then `/rent-plan`.
- [ ] Create `raspi_app/screens/rent_plan.py`:
  - `on_enter`: call `api_client.get_plans(state.selected_size)`.
  - map plans to buttons:
    - `btnSingle1Day`, `btnSingle7Days`
    - `btnMulti5_30`, `btnMulti10_90`
    - `btnMonth1`, `btnMonth3`, `btnMonth6`
  - use one exclusive `QButtonGroup` for all plan buttons in v1.
  - checked button sets `state.selected_plan`; `btnContinue` enabled.
  - `lblSelectedSize` shows “Bạn đã chọn Size 1 (Nhỏ)” or Size 2.
  - `btnBackMain -> /rent-size`; `btnContinue -> /rent-phone`.
- [ ] Create `raspi_app/screens/rent_phone.py`:
  - keypad buttons append digits to `lineEdit`, max 9 digits.
  - `btnBackspace`, `btnClear`.
  - `btnConfirm` enabled only when `is_valid_local_phone(lineEdit.text())`.
  - on confirm: `state.phone = normalize_vn_phone(...)`, navigate `/payment`.
  - `btnBackMain -> /rent-plan`.

### Task 7: Payment and rent success

- [ ] Create `raspi_app/screens/payment.py`:
  - `on_enter`: populate `lblAmount`, `lblPlanInfo`.
  - payment buttons are existing `QPushButton`: `btnPaymentMomo`, `btnPaymentZalo`, `btnPaymentVietQR`.
  - selected method sets `state.payment_method` to `MOMO`, `ZALOPAY`, or `VIETQR`; `btnPayNow` enabled.
  - `btnBack -> /rent-phone`.
  - `btnPayNow`: call `api_client.create_rental(...)`, store `state.rental_data` and `state.compartment_data`, navigate `/rent-success`.
- [ ] Create `raspi_app/screens/rent_success.py`:
  - `on_enter`: `lblPinCode = format_pin(pin)`, `lblLockerInfo`, `lblPinWarning`.
  - `btnOpenNow` frame click: navigate `/locker-open`.
  - `btnUseLater` frame click: navigate `/`.
- [ ] Create `raspi_app/screens/qr_payment.py` but do not add to v1 happy path:
  - Back to `/payment`.
  - Display static `assets/qrcode.png`.
  - Countdown label can be inert or simple 5-minute timer for later use.

### Task 8: Loading overlay, polish, and docs

- [ ] Create `raspi_app/screens/loading.py` as reusable overlay controller, but keep v1 optional:
  - `show(message)`, `hide()`, animated `progressVerify`.
  - Do not block completion if not wired into every call.
- [ ] Update `raspi_app/CLAUDE.md` routes to match chosen v1:
  - `/otp` with `mode=deposit|pickup`
  - payment demo goes `/payment -> /rent-success`
  - QRPayment reserved for future real payment.
- [ ] Keep all `.ui` files unchanged unless a controller proves an objectName is missing.

## Test Plan

- [ ] Pure helper tests with `unittest`:
  - `format_currency`, `format_pin`, `normalize_vn_phone`, `is_valid_local_phone`.
  - `AppState.reset_rent_flow()` clears rent-only fields and keeps unrelated defaults clean.
  - `ApiClient(mock=True)` success/error branches for OTP and rental creation.
- [ ] Static verification:
  - Run `rtk python -m compileall raspi_app`
  - Expected: no syntax errors.
- [ ] UI load verification:
  - Run existing `rtk python raspi_app/test_ui.py dashboard`
  - Manually close the window after it loads.
- [ ] Manual end-to-end verification:
  - Run `rtk python raspi_app/main.py`
  - Flow 1: Home → Gửi đồ → enter `123456` → LockerOpen → Hoàn tất → Home.
  - Flow 2: Home → Nhận đồ → enter `000000` → error text appears and OTP clears.
  - Flow 3: Home → Thuê tủ → Size 1 → any plan → phone `987654321` → MoMo → RentSuccess → Mở ngay → LockerOpen → Home.
  - Flow 4: Home → Hỗ trợ → expand FAQ items → Back → Home.

## Assumptions

- Do not implement real backend endpoints in this pass; current `backend` has generated Prisma files but no visible application routes.
- Do not require real GPIO/MQTT hardware; service methods are mock-safe but named to match future real integration.
- Phone input accepts exactly 9 digits after `+84`; leading zero is allowed in v1 to avoid contradicting current UI/docs examples.
- QRPayment is not part of v1 happy path because payment demo success was selected.
- Use `rtk` prefix for all shell commands during implementation.
