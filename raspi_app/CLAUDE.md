# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartBox is a self-service smart locker kiosk application running on **Raspberry Pi 3** with a 7" touchscreen (720×1280px). It is built with **PySide6** (.ui files via Qt Designer) and communicates with a backend via **MQTT** and **REST API**.

## Running the App

```bash
# Development
source venv/bin/activate
python main.py

# On Pi with fullscreen
python main.py  # add self.showFullScreen() in main.py for kiosk mode
```

## Key Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Compile SVG icons into resources_rc.py (after editing .qrc or SVG files)
pyside6-rcc assets/icons/resources.qrc -o assets/icons/resources_rc.py

# Run
python main.py
```

## Architecture

### Navigation Pattern
`main.py` owns `KioskApp`, a fixed-size `QWidget` containing a `QStackedWidget`. Each route is handled by a controller in `screens/`, and each controller loads one `.ui` file via `QUiLoader`. Shared flow data lives in `services/app_state.py`; mock-safe service facades live in `services/api_client.py`, `services/mqtt_client.py`, and `services/gpio_controller.py`.

### UI File Convention
- All screens are `.ui` files in `ui/` or `ui/components/`
- Actual filesystem: `ui/DashBoard.ui`, `ui/components/Header.ui`, `ui/components/Footer.ui` (capitalized)
- ObjectName attributes on Qt widgets are the Python access point (e.g., `self.dashboard.btnSend`)
- Icon placeholders use text/emoji — replace with SVG icons later

### Screen Routes
```
Home (/) → Gửi đồ → /otp (mode=deposit) → /locker-open → Home
        → Nhận đồ → /otp (mode=pickup) → /locker-open → Home
        → Thuê tủ → /rent-size → /rent-plan → /rent-phone → /payment → /rent-success → /locker-open or Home
        → Hỗ trợ → Home
```

For kiosk v1 mock mode, `/payment` creates a mock rental and navigates directly to `/rent-success`. `/qr-payment` and `/loading` exist as reserved screens for future real payment/overlay integration.

### Config
All runtime configuration lives in `config.yaml`:
- `mqtt.*` — broker, port, credentials
- `api.base_url` — backend URL
- `gpio.*` — pin mappings for solenoid locks and magnetic sensors
- `support.hotline` — displayed on Support screen
- `app.countdown_open` / `app.countdown_default` — timer durations in seconds
- `app.screen_width` / `app.screen_height` — screen dimensions (720×1280)
- `app.header_height` / `app.footer_height` — header (80px) and footer (48px)

### Backend Integration Points
Current kiosk v1 uses mock-safe services by default so it can run without backend or hardware.

| Screen | API | Method |
|--------|-----|--------|
| OTP (deposit/pickup) | `ApiClient.verify_pin(code, mode)` | Mock success for any 6-digit code except `000000` and `999999` |
| Rent Plan | `ApiClient.get_plans(size)` | Mock plan list for SMALL/LARGE |
| Payment | `ApiClient.create_rental(...)` | Mock rental with PIN `847291` |
| Locker Open | `MqttClient.publish_unlock` + `GpioController.unlock` | Mock no-op, records state |
| Locker Close | `MqttClient.publish_lock` + `GpioController.lock` | Mock no-op, records state |

### Color System
| Token | Hex | Usage |
|-------|-----|-------|
| Brand | `#FF6600` | Primary accent, deposit buttons |
| Pickup | `#1565C0` | Nhận đồ |
| Rent | `#2E7D32` | Thuê tủ, success |
| Background | `#0A0A0A` | App background |
| Surface | `#1C1B1B` | Cards |
| Timer | `#FFB596` | Countdown numbers |
| Online | `#00FF41` | Status indicator |

### Important Conventions

- **Font:** Be Vietnam Pro — load via Qt's QFontDatabase or bundle
- **Screen size:** Fixed 720×1280px (Pi 3 touchscreen)
- **Header height:** 80px, **Footer height:** 48px — hardcoded in layout math
- **SVG icons:** Stored in `assets/icons/`, compiled into `resources_rc.py` via `pyside6-rcc`. Currently using text/emoji placeholders.
- **No keypad:** Touchscreen only — no physical keypad
- Unit tests can live in `tests/` and run from `raspi_app` with `rtk python -m unittest discover -s tests -v`
- **Python screen controllers** (`screens/` directory) own screen event handling
- **Services** are mock-safe for local development and can later be switched to real API/MQTT/GPIO behavior

## File Locations

| File | Purpose |
|------|---------|
| `main.py` | Entry point + navigation scaffold |
| `config.yaml` | All runtime configuration |
| `requirements.txt` | Python dependencies |
| `ui/*.ui` | Qt Designer screens |
| `ui/components/*.ui` | Reusable header/footer components |
| `assets/icons/*.svg` | SVG icons (add when available) |
| `screens/*.py` | Screen controller modules (TBD) |
| `services/*.py` | API, MQTT, GPIO services (TBD) |
| `docs/DESIGN_PROMPTS.md` | Qt Designer prompts with exact object names + CSS |
| `docs/superpowers/UI_DOCUMENTATION.md` | Screen-by-screen UX documentation |
