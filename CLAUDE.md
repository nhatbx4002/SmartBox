# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartBox is a self-service smart locker kiosk system with two primary components:
- **Backend** (`backend/`) — Node.js/TypeScript API server with Prisma + PostgreSQL
- **Kiosk App** (`raspi_app/`) — Python/PySide6 kiosk UI running on Raspberry Pi 3 (720×1280px touchscreen)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Raspberry Pi 3 (Kiosk)                   │
│  ┌─────────────────────────────────────────────────┐    │
│  │         SmartBox Kiosk App (PySide6)             │    │
│  │  Screens: Home → OTP → Rent → Payment → Success │    │
│  │  services/api_client.py  ──HTTP──►  :3000       │    │
│  │  services/mqtt_client.py ──MQTT──►  Broker      │    │
│  │  services/gpio_controller.py ──► MCU2317 (I2C)   │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                    HTTP REST + MQTT
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Node.js + Prisma + PostgreSQL)     │
└─────────────────────────────────────────────────────────┘
```

## Running the Backend

```bash
cd backend/

# Install dependencies
npm install

# Generate Prisma client from schema
npm run db:generate

# Push schema to database
npm run db:push

# Open Prisma Studio (GUI for DB)
npm run db:studio
```

> **Note:** The backend currently only contains the Prisma schema and generated client. The Express/Fastify server, routes, and business logic need to be implemented. See [raspi_app/CLAUDE.md](raspi_app/CLAUDE.md) for the full API integration points.

## Running the Kiosk App

```bash
cd raspi_app/

# Install dependencies
pip install -r requirements.txt

# Run in development
python main.py

# Compile Qt resources (after editing .qrc or SVG files)
pyside6-rcc resources.qrc -o resources_rc.py
```

> See [raspi_app/CLAUDE.md](raspi_app/CLAUDE.md) for detailed raspi_app guidance including screen routes, object naming conventions, color tokens, and config.yaml fields.

## Key Config Files

| File | Purpose |
|------|---------|
| `backend/.env` | `DATABASE_URL`, `JWT_SECRET`, `PORT=3000` |
| `raspi_app/config.yaml` | API base URL, MCU I2C bus/address, GPIO pins, screen dimensions, hotline |

## Key Conventions

- **Screen size:** 720×1280px (fixed, Pi 3 touchscreen)
- **Font:** Be Vietnam Pro
- **UI files:** `.ui` files in `ui/` and `ui/components/` loaded via `QUiLoader` — object names on widgets are Python access points
- **Dark theme:** Background `#0A0A0A`, brand `#FF6600`, pickup `#1565C0`, rent `#2E7D32`
- **Header:** 80px, **Footer:** 48px — hardcoded in layout math
- **No tests exist** in this codebase yet
- **raspi_app services** (`api_client.py`, `mqtt_client.py`, `gpio_controller.py`) are stubs — full implementation needed
