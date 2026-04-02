# SmartBox PySide6 UI

PySide6 port of `hardware/ui` React kiosk UI.

## Cài đặt

```bash
pip install -r requirements.txt
```

## Chạy

```bash
cd src
python main.py
```

## Cấu trúc

```
src/
├── main.py                  # QMainWindow + Navigator (react-router equivalent)
├── theme.py                 # Colors, sizes, fonts (mirrored from theme.ts)
└── components/
    ├── __init__.py          # Exports all screens
    ├── state.py              # Shared cross-screen state (locker, txid, etc.)
    ├── kiosk_layout.py      # Base layout: header + footer + live clock
    ├── home_screen.py        # Bento 2×2 grid (4 main actions)
    ├── input_otp_screen.py   # 6-digit OTP entry + countdown
    ├── rent_screen.py        # Plan selection (1/3/6 tháng)
    ├── rent_phone_screen.py  # Phone number input (mock)
    ├── payment_screen.py     # Payment method (MoMo, ZaloPay, VietQR, cash)
    ├── rent_success_screen.py # Two-phase: locker open → OTP result
    ├── locker_open_screen.py  # Locker open display for deposit/pickup
    ├── success_screen.py      # Checkmark + countdown ring
    ├── processing_screen.py   # Spinner + progress bar
    ├── support_screen.py      # FAQ accordion + hotline/chat
    └── size_select_screen.py  # Locker size picker (small→xlarge)
```

## Navigation

| Route | Screen |
|---|---|
| `/` | HomeScreen |
| `/otp/deposit` | InputOTPScreen (deposit) |
| `/otp/pickup` | InputOTPScreen (pickup) |
| `/otp/rent` | InputOTPScreen (rent) |
| `/rent` | RentScreen (plan selection) |
| `/rent-phone` | RentPhoneScreen |
| `/payment` | PaymentScreen |
| `/rent-locker` | RentSuccessScreen |
| `/support` | SupportScreen |

## Kiosk display

- **Resolution**: 800×480 px (portrait)
- **F11**: toggle fullscreen
- **ESC**: back
