# SmartBox Kiosk UI — Screen Flow Map

> Visual map of all screens, routes, and switching logic
> Target: Kiosk 720×1280px | Tech: PySide6 (.ui files) + Python modules
> Design finalized: 2026-04-14

---

## Luồng Tổng quan

```
Home (/)
├── GỬI ĐỒ         ──► /otp-deposit ──► Processing ──► LockerOpen ──► Home
├── NHẬN ĐỒ        ──► /otp-pickup  ──► Processing ──► LockerOpen ──► Home
├── THUÊ TỦ        ──► /rent-size ──► /rent-plan ──► /rent-phone
│                                       ──► /payment ──► /rent-success
│                                              ├── [MỞ NGAY] ──► LockerOpen ──► Home
│                                              └── [DÙNG SAU] ──► Home
└── HỖ TRỢ         ──► /support ──► Home
```

---

## Route Map

| Route | Screen | Type |
|-------|--------|------|
| `/` | HomeScreen | Main |
| `/otp-deposit` | OtpDepositScreen | Input Code |
| `/otp-pickup` | OtpPickupScreen | Input Code |
| `/rent-size` | RentSizeScreen | Select |
| `/rent-plan` | RentPlanScreen | Select |
| `/rent-phone` | RentPhoneScreen | Input |
| `/payment` | PaymentScreen | Select |
| `/rent-success` | RentSuccessScreen | Result |
| `/support` | SupportScreen | Info |
| — | ProcessingScreen | Overlay |
| — | LockerOpenScreen | Overlay |

---

## Screen Designs

---

### 1. HomeScreen `/`

```
┌────────────────────────────────────────────────────────┐
│ [SmartBox Logo]  SMARTBOX                    14:30    │
│────────────────────────────────────────────────────────│
│                                                        │
│    ┌──────────────────┐  ┌──────────────────┐        │
│    │   📦 GỬI ĐỒ     │  │   📥 NHẬN ĐỒ    │        │
│    │   (Orange)       │  │   (Blue)        │        │
│    │                  │  │                 │        │
│    │ Nhập mã, bỏ đồ │  │ Nhập mã, lấy đồ│        │
│    └──────────────────┘  └──────────────────┘        │
│                                                        │
│    ┌──────────────────┐  ┌──────────────────┐        │
│    │   🔑 THUÊ TỦ    │  │   ❓ HỖ TRỢ     │        │
│    │   (Green)        │  │   (Dark)         │        │
│    │                  │  │                  │        │
│    │ Thuê mới ngay    │  │ FAQ & Hotline    │        │
│    └──────────────────┘  └──────────────────┘        │
│                                                        │
│────────────────────────────────────────────────────────│
│     SmartBox v1.0  |  Không để đồ quý giá trong tủ   │
└────────────────────────────────────────────────────────┘
```

- Layout: 2×2 bento grid
- Colors: Orange `#FF6600`, Blue `#1565C0`, Green `#2E7D32`, Dark `#1C1B1B`
- Header: 70px | Footer: 40px | Main: 1170px
- Icon: 72×72px | Card height: 260px | Gap: 20px

---

### 2. OtpDepositScreen `/otp-deposit`

```
┌────────────────────────────────────────────────────────┐
│ [← Quay lại]  GỬI ĐỒ                          14:30   │
│────────────────────────────────────────────────────────│
│                                                        │
│              Nhập mã mở tủ của bạn                     │
│                                                        │
│    ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐             │
│    │   │ │   │ │   │ │   │ │   │ │   │             │
│    └───┘ └───┘ └───┘ └───┘ └───┘ └───┘             │
│                                                        │
│           [       XÁC NHẬN       ]                   │
│                  (Orange)                              │
│                                                        │
│────────────────────────────────────────────────────────│
│     SmartBox v1.0  |  Không để đồ quý giá trong tủ   │
└────────────────────────────────────────────────────────┘
```

- 6 ô nhập số, auto-focus từng ô
- Button active khi đủ 6 số
- Error state: ô đổi màu đỏ + thông báo "Mã không hợp lệ"
- Nút Quay lại → Home

---

### 3. OtpPickupScreen `/otp-pickup`

```
┌────────────────────────────────────────────────────────┐
│ [← Quay lại]  NHẬN ĐỒ                          14:30  │
│────────────────────────────────────────────────────────│
│                                                        │
│              Nhập mã mở tủ của bạn                     │
│                                                        │
│    ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐             │
│    │   │ │   │ │   │ │   │ │   │ │   │             │
│    └───┘ └───┘ └───┘ └───┘ └───┘ └───┘             │
│                                                        │
│           [       XÁC NHẬN       ]                   │
│                  (Blue)                               │
│                                                        │
│────────────────────────────────────────────────────────│
│     SmartBox v1.0  |  Không để đồ quý giá trong tủ   │
└────────────────────────────────────────────────────────┘
```

- Giống OtpDepositScreen, đổi màu button sang Blue `#1565C0`
- Text tiêu đề: "NHẬN ĐỒ"

---

### 4. RentSizeScreen `/rent-size`

```
┌────────────────────────────────────────────────────────┐
│ [← Quay lại]  THUÊ TỦ                         14:30   │
│────────────────────────────────────────────────────────│
│                                                        │
│              Chọn kích thước tủ bạn muốn thuê         │
│                                                        │
│    ┌────────────────────┐  ┌────────────────────┐     │
│    │                    │  │                    │     │
│    │    ┌────────┐      │  │   ┌──────────┐    │     │
│    │    │ 📦📦   │      │  │   │  📦📦📦  │    │     │
│    │    │        │      │  │   │  📦📦📦  │    │     │
│    │    └────────┘      │  │   └──────────┘    │     │
│    │                    │  │                    │     │
│    │     SIZE 1        │  │      SIZE 2        │     │
│    │    (Nhỏ)          │  │     (Lớn)          │     │
│    │                    │  │                    │     │
│    └────────────────────┘  └────────────────────┘     │
│                                                        │
│────────────────────────────────────────────────────────│
│     SmartBox v1.0  |  Không để đồ quý giá trong tủ   │
└────────────────────────────────────────────────────────┘
```

- 2 cards song song: Size 1 (nhỏ) và Size 2 (lớn)
- Color: Size 1 → Blue `#1565C0`, Size 2 → Orange `#FF6600`
- Card size: bằng nhau, icon tỷ lệ đúng với kích thước
- Chọn xong → `/rent-plan`

> **Ghi chú:** Size 1 = SMALL, Size 2 = LARGE (map lại khi có nhiều tủ)

---

### 5. RentPlanScreen `/rent-plan`

```
┌────────────────────────────────────────────────────────┐
│ [← Quay lại]  THUÊ TỦ                         14:30  │
│────────────────────────────────────────────────────────│
│                                                        │
│              Bạn đã chọn Size 1 (Nhỏ)                 │
│              Chọn gói thuê phù hợp với bạn            │
│                                                        │
│    ┌──────────────────────────────────────────────┐   │
│    │  📅 THUÊ THEO LƯỢT                          │   │
│    │  Một lần mở tủ, sử dụng trong ngày hoặc     │   │
│    │  7 ngày                                      │   │
│    └──────────────────────────────────────────────┘   │
│                                                        │
│    ┌──────────────────────────────────────────────┐   │
│    │  📅 THUÊ NHIỀU LƯỢT                         │   │
│    │  Nhiều lần mở tủ trong thời hạn             │   │
│    │  5 lượt / 30 ngày  |  10 lượt / 90 ngày    │   │
│    └──────────────────────────────────────────────┘   │
│                                                        │
│    ┌──────────────────────────────────────────────┐   │
│    │  📅 THUÊ GÓI THÁNG                          │   │
│    │  Không giới hạn lượt mở                     │   │
│    │  1 tháng  |  3 tháng  |  6 tháng            │   │
│    └──────────────────────────────────────────────┘   │
│                                                        │
│────────────────────────────────────────────────────────│
│     SmartBox v1.0  |  Không để đồ quý giá trong tủ   │
└────────────────────────────────────────────────────────┘
```

- 3 plan cards: Lượt / Nhiều lượt / Gói tháng
- Mỗi card có mô tả ngắn + các sub-option khi bấm vào
- Color: Green `#2E7D32` accent

> **Sub-options khi chọn plan:**
> - Lượt → "1 lượt (ngày)" | "1 lượt (7 ngày)"
> - Nhiều lượt → "5 lượt / 30 ngày" | "10 lượt / 90 ngày"
> - Gói tháng → "1 tháng" | "3 tháng" | "6 tháng"
>
> Có thể hiển thị dialog nhỏ chọn sub-option, hoặc gộp vào card

---

### 6. RentPhoneScreen `/rent-phone`

```
┌────────────────────────────────────────────────────────┐
│ [← Quay lại]  THUÊ TỦ                         14:30  │
│────────────────────────────────────────────────────────│
│                                                        │
│              Nhập số điện thoại của bạn                │
│              Để lưu vào phiếu thuê                    │
│                                                        │
│         ┌─────────────────────────────┐               │
│         │  +84 │                       │               │
│         └─────────────────────────────┘               │
│              Đã nhập 10 số ✓                          │
│                                                        │
│         [       TIẾP TỤC       ]                      │
│                (Green)                                │
│                                                        │
│────────────────────────────────────────────────────────│
│     SmartBox v1.0  |  Không để đồ quý giá trong tủ   │
└────────────────────────────────────────────────────────┘
```

- Input SĐT: prefix `+84 |` cố định, nhập 9 số sau
- Validation: đủ 10 số → button active
- Mục đích: lưu SĐT vào rental record để theo dõi
- Không gửi SMS (demo phase) → nhảy thẳng sang Payment

---

### 7. PaymentScreen `/payment`

```
┌────────────────────────────────────────────────────────┐
│ [← Quay lại]  THANH TOÁN                       14:30  │
│────────────────────────────────────────────────────────│
│                                                        │
│           Số tiền thanh toán                           │
│              15.000đ                                   │
│           Size 1 - Thuê 1 lượt (7 ngày)               │
│                                                        │
│    ┌──────────────────────────────────────────────┐   │
│    │  💳 MoMo          Thanh toán nhanh      [●]  │   │
│    └──────────────────────────────────────────────┘   │
│                                                        │
│    ┌──────────────────────────────────────────────┐   │
│    │  💳 ZaloPay       An toàn, tiện lợi      [○] │   │
│    └──────────────────────────────────────────────┘   │
│                                                        │
│    ┌──────────────────────────────────────────────┐   │
│    │  📱 VietQR        Quét mã QR             [○] │   │
│    └──────────────────────────────────────────────┘   │
│                                                        │
│    ┌──────────────────────────────────────────────┐   │
│    │  💵 Tiền mặt     Tại quầy thanh toán    [○] │   │
│    └──────────────────────────────────────────────┘   │
│                                                        │
│    [          THANH TOÁN NGAY          ]              │
│                  (Green)                              │
│                                                        │
│────────────────────────────────────────────────────────│
│     SmartBox v1.0  |  Không để đồ quý giá trong tủ   │
└────────────────────────────────────────────────────────┘
```

- Hiển thị: số tiền + mô tả gói đã chọn
- 4 payment methods: MoMo, ZaloPay, VietQR, Tiền mặt
- Radio button: chỉ chọn 1
- Demo: bỏ qua thanh toán thật, confirm → tạo rental + nhảy `/rent-success`
- Amount card top: nổi bật số tiền

---

### 8. RentSuccessScreen `/rent-success`

```
┌────────────────────────────────────────────────────────┐
│                                                  14:30 │
│────────────────────────────────────────────────────────│
│                                                        │
│                 ╭──────────────╮                       │
│                 │     📦      │  (green ring)         │
│                 ╰──────────────╯                       │
│                                                        │
│              THUÊ TỦ THÀNH CÔNG                        │
│                   Tủ A - Size 1                        │
│                                                        │
│        Mã mở tủ của bạn: 847291                       │
│                                                        │
│    ┌────────────────────────────────────────────┐     │
│    │  ⚠️ Hãy nhớ mã này để lấy đồ lần sau     │     │
│    └────────────────────────────────────────────┘     │
│                                                        │
│    ┌──────────────────┐  ┌──────────────────┐          │
│    │   MỞ NGAY       │  │   DÙNG SAU      │          │
│    │   (Green)        │  │   (Orange)       │          │
│    │                  │  │                  │          │
│    │ Mở tủ ngay để   │  │ Lưu mã, đến tủ  │          │
│    │ bỏ đồ vào       │  │ lần sau mở      │          │
│    └──────────────────┘  └──────────────────┘          │
│                                                        │
│────────────────────────────────────────────────────────│
│     SmartBox v1.0  |  Không để đồ quý giá trong tủ   │
└────────────────────────────────────────────────────────┘
```

**Khi bấm [MỞ NGAY]:**
- → LockerOpenScreen (Step 1: tủ mở, countdown 2 phút)
- Sau countdown → Home

**Khi bấm [DÙNG SAU]:**
- Hiển thị mã mở tủ + thời hạn sử dụng
- → Home

---

### 9. LockerOpenScreen (Overlay)

```
┌────────────────────────────────────────────────────────┐
│                                                  14:30 │
│────────────────────────────────────────────────────────│
│                                                        │
│                 ╭──────────────╮                       │
│                 │     📦      │  (orange ring)         │
│                 ╰──────────────╯                       │
│                                                        │
│              MỞ TỦ THÀNH CÔNG                          │
│                   Tủ A - Size 1                        │
│                                                        │
│    Vui lòng bỏ đồ vào tủ rồi đóng cửa thật kỹ       │
│                                                        │
│    ┌─────────────────────────┐  ┌──────────────────┐   │
│    │   Thời gian còn lại    │  │  Vị trí tủ: A1  │   │
│    │         1:45            │  │                  │   │
│    │          s              │  │ Cửa tự động mở  │   │
│    └─────────────────────────┘  │ nếu không mở     │   │
│                                 │ vui lòng liên hệ │   │
│                                 │ chăm sóc KH      │   │
│                                 └──────────────────┘   │
│                                                        │
│    [           HOÀN TẤT          ]                    │
│                  (Orange)                              │
│                                                        │
│────────────────────────────────────────────────────────│
│     SmartBox v1.0  |  Không để đồ quý giá trong tủ   │
└────────────────────────────────────────────────────────┘
```

- Countdown: 120 giây (2 phút)
- Hết countdown → tủ tự đóng → Home
- Nút Hoàn tất → đóng tủ ngay → Home
- Color: Orange `#FF6600`

---

### 10. ProcessingScreen (Overlay)

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                 ╭──────────────╮                       │
│                 │     📦      │                       │
│                 ╰──────────────╯                       │
│                                                        │
│               Đang xác minh...                         │
│                                                        │
│           [████████████████░░░░░░░░░]  72%            │
│                                                        │
│              ● ● ● ○ ○                                │
│            (step dots)                                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

- Spinner overlay khi xác minh mã mở tủ
- Progress bar ngẫu nhiên tăng
- Auto-close khi xong → LockerOpenScreen

---

### 11. SupportScreen `/support`

```
┌────────────────────────────────────────────────────────┐
│ [← Quay lại]  HỖ TRỢ                          14:30  │
│────────────────────────────────────────────────────────│
│                                                        │
│         📞 Hotline: {HOTLINE_FROM_CONFIG}              │
│                                                        │
│    ▼ Làm sao để gửi đồ?                               │
│      GỬI ĐỒ → Nhập mã mở tủ → Mở tủ → Bỏ đồ → Đóng │
│                                                        │
│    ▶ Quên mã mở tủ phải làm sao?                      │
│                                                        │
│    ▶ Đồ bị mất ai chịu trách nhiệm?                   │
│                                                        │
│    ▶ Tủ có bảo mật không?                              │
│                                                        │
│    ┌──────────────────┐  ┌──────────────────┐          │
│    │  📞 Gọi Hotline  │  │ 💬 Chat nhân viên│          │
│    │   (Orange)        │  │   (Dark)         │          │
│    └──────────────────┘  └──────────────────┘          │
│                                                        │
│────────────────────────────────────────────────────────│
│     SmartBox v1.0  |  Không để đồ quý giá trong tủ   │
└────────────────────────────────────────────────────────┘
```

- Hotline: `{HOTLINE_FROM_CONFIG}` — đọc từ `config.yaml`
- FAQ accordion (click expand/collapse)
- Hotline: gọi điện trực tiếp
- Chat nhân viên: placeholder (phase 2)

---

## Navigation Tree (Full)

```
Home (/)
│
├── [GỬI ĐỒ]
│       └── /otp-deposit
│               └── Processing (overlay)
│                       └── LockerOpenScreen (overlay, countdown)
│                               └── Home
│
├── [NHẬN ĐỒ]
│       └── /otp-pickup
│               └── Processing (overlay)
│                       └── LockerOpenScreen (overlay, countdown)
│                               └── Home
│
├── [THUÊ TỦ]
│       └── /rent-size
│               └── /rent-plan
│                       └── /rent-phone
│                               └── /payment
│                                       └── /rent-success
│                                               ├── [MỞ NGAY]
│                                               │       └── LockerOpenScreen
│                                               │               └── Home
│                                               │
│                                               └── [DÙNG SAU]
│                                                       └── Home
│
└── [HỖ TRỢ]
        └── /support
                └── Home
```

---

## Design Tokens

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `brand` | `#FF6600` | Primary accent |
| `bg` | `#0A0A0A` | App background |
| `surface` | `#111111` | Cards, inputs |
| `surface-2` | `#1C1C1C` | Elevated cards |
| `border` | `#2A2A2A` | Card borders |
| `text-primary` | `#E8E8E8` | Main text |
| `text-muted` | `#888888` | Secondary text |
| `deposit` | `#FF6600` | Gửi đồ action |
| `pickup` | `#1565C0` | Nhận đồ action |
| `rent` | `#2E7D32` | Thuê tủ action |
| `support` | `#1C1C1B` | Hỗ trợ card |
| `error` | `#EF4444` | Error state |

### Layout
| Token | Value |
|-------|-------|
| Screen size | 720×1280px |
| Header height | 70px |
| Footer height | 40px |
| Main area | 1170px |
| Card gap | 20px |
| Card radius | 18px |
| Touch min height | 64px |

### Typography
| Role | Size | Weight |
|------|------|--------|
| Display | 36–52px | 800 |
| Title | 18–22px | 700 |
| Body | 14–16px | 600 |
| Meta/Hint | 11–13px | 400 |
| Font | Be Vietnam Pro | — |

---

## API Integration Points

| Screen | API Endpoint | Method | Payload | Response |
|--------|-------------|--------|---------|----------|
| `/otp-deposit` | `/auth/verify-pin` | POST | `{ pin, compartmentId }` | `{ authorized, openCount }` |
| `/otp-pickup` | `/auth/verify-pin` | POST | `{ pin, compartmentId }` | `{ authorized, openCount }` |
| `/rent-plan` | `/lockers/available` | GET | `?size=SMALL` | `{ available: true }` |
| `/payment` | `/rentals` | POST | `{ userId, size, plan, phone }` | `{ rentalId, pin, compartmentId }` |
| `/rent-success` [MỞ NGAY] | MQTT `locker/{id}/unlock` | — | — | GPIO opens |
| Processing | `/auth/verify-pin` | POST | `{ pin }` | `{ authorized, compartmentId }` |
| LockerOpen | MQTT `locker/{id}/status` | — | `{ status: "CLOSED" }` | Backend updates |

> **Note:** `/rent-phone` chỉ lưu SĐT, không gọi API (demo phase chưa SMS)
