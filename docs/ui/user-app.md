# SmartBox User App — UI Screen Specifications

> **Target:** Android / iOS (Mobile)
> **Theme:** Dark Mode (Consistent with Kiosk & Admin)

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0A0A0A` | Main background |
| Surface | `#1C1B1B` | Cards, navigation bars |
| Brand | `#FF6600` | Primary buttons, active icons |
| Success | `#10B981` | Available lockers, active rentals |
| Error | `#EF4444` | Expired rentals, alerts |
| Text Primary | `#FFFFFF` | Headlines, primary text |
| Text Secondary | `#9CA3AF` | Subtext, labels |

---

## Screen List

1.  **Login / OTP (`/auth`)**: Quick access via phone number.
2.  **Explore (`/explore`)**: Map view and list of locker locations.
3.  **Location Detail (`/location/:id`)**: Available cabinets and sizes at a specific site.
4.  **Rent Configuration (`/rent/config`)**: Selecting size and price plan.
5.  **Payment (`/payment`)**: Checkout with MoMo, ZaloPay, or VietQR.
6.  **My Box (`/my-box`)**: Dashboard for active rentals with remote "Unlock" button.
7.  **Rental Detail (`/rental/:id`)**: History, logs, and extend rental options.
8.  **Notifications (`/notifications`)**: Alerts for expiry and payment.
9.  **Profile (`/profile`)**: Personal info and support.

---

## Screen 01 — Login / OTP

### Layout
Clean, centered content on a dark background.

- **Logo**: SmartBox icon at top center.
- **Input**: Phone number field with country code (+84).
- **Button**: "Gửi mã OTP" (Brand Orange).
- **Footer**: "Bằng cách tiếp tục, bạn đồng ý với Điều khoản sử dụng."

---

## Screen 02 — Explore (Map & List)

### Layout
Top search bar + Full-screen Map + Draggable bottom sheet for list.

- **Search Bar**: "Tìm kiếm địa điểm..."
- **Map**: Shows pins for SmartBox locations.
  - **Green Pin**: Available lockers.
  - **Gray Pin**: Full or Offline.
- **Bottom Sheet**:
  - List of locations sorted by proximity.
  - Card: Location Name, Distance, Available Lockers (e.g., "5 ngăn trống").

---

## Screen 03 — Location Detail

### Layout
Header Image + Info Section + Available Sizes.

- **Header**: Image of the building/location.
- **Info**: Address, Opening Hours, Directions button.
- **Sizes Grid**:
  - **Small Card**: Size S, Price/hour, "Chọn".
  - **Large Card**: Size L, Price/hour, "Chọn".
- **Real-time**: Indicates "Chỉ còn 2 ngăn" for high-demand spots.

---

## Screen 04 — Rent Configuration

### Layout
Step-by-step selection.

- **Step 1: Size**: (Selected from previous screen).
- **Step 2: Plan**:
  - Gói Lượt (15k/lượt).
  - Gói Ngày (50k/ngày).
  - Gói Tháng (300k/tháng).
- **Summary**: Total price + Expiry estimate.

---

## Screen 05 — Payment

### Layout
Checkout summary + Payment methods.

- **Methods**: MoMo, ZaloPay, VietQR (Direct app switch).
- **CTA**: "Thanh toán ngay".

---

## Screen 06 — My Box (Active Dashboard)

### Layout
The "Action" screen for active users.

- **Card (Active Rental)**:
  - **Locker ID**: "Tủ A - Ngăn B3".
  - **Status**: "Đang thuê" (Success Green).
  - **Timer**: Countdown to expiry.
  - **Unlock Button**: Large, central Orange button with ripple effect.
- **QR Access**: "Hiện mã QR" button for physical scanning at Kiosk.
- **Quick Support**: Floating action button for help.

---

## Screen 07 — Rental Detail

### Layout
Full history and management.

- **Logs**: "Mở tủ: 14:02", "Đóng tủ: 14:05".
- **Actions**:
  - "Gia hạn thêm": Extend time.
  - "Kết thúc thuê": Finalize and release locker.

---

## Screen 08 — Notifications

- **List view**: Categorized by "Rental", "System", "Payment".
- **Red Dot**: Unread indicator.

---

## Screen 09 — Profile

- **Header**: User Phone + Avatar.
- **Menu**:
  - Lịch sử giao dịch.
  - Phương thức thanh toán.
  - Trung tâm hỗ trợ.
  - Đăng xuất.

---

## User Flow

1.  **Discover**: User opens Map -> Finds location -> Selects Size.
2.  **Book**: Selects Plan -> Pays -> Receives PIN/QR.
3.  **Access**: Approaches Kiosk -> Remote Unlocks via App OR Scans QR.
4.  **Manage**: Gets notification 15m before expiry -> Extends via App.
