import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import "./HomeScreen.css";

export default function HomeScreen() {
  const navigate = useNavigate();
  const [showDepositMenu, setShowDepositMenu] = useState(false);

  return (
    <KioskLayout>
      <div className="home-root">
        {/* Header label */}
        <div className="home-welcome">
          <div className="welcome-accent" />
          <span className="welcome-title">CHỌN DỊCH VỤ</span>
          <span className="welcome-sub">Chạm vào dịch vụ bạn cần</span>
        </div>

        {/* ── MAIN: GỬI/NHẬN card ── */}
        <button
          className="home-main-card"
          onClick={() => setShowDepositMenu(!showDepositMenu)}
        >
          {/* Down arrow background */}
          <div className="main-card-bg-arrow">↓</div>

          {/* Fast track badge */}
          <div className="main-card-badge">FAST TRACK</div>

          {/* Icon */}
          <div className="main-card-icon">
            <svg viewBox="0 0 80 80" fill="none">
              <rect x="10" y="24" width="60" height="48" rx="6" stroke="currentColor" strokeWidth="3"/>
              <path d="M10 36h60" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M40 24V8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M28 8h24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="58" cy="48" r="8" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M40 48l7 7 14-14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="main-card-title">GỬI / NHẬN ĐỒ</div>
          <div className="main-card-sub">Chạm để bắt đầu gửi hoặc nhận đồ</div>

          {/* Dropdown sub-menu */}
          {showDepositMenu && (
            <div className="deposit-menu" onClick={(e) => e.stopPropagation()}>
              <button
                className="deposit-menu-item item-deposit"
                onClick={() => navigate("/deposit")}
              >
                <span className="menu-item-icon">📥</span>
                <div>
                  <div className="menu-item-title">GỬI ĐỒ</div>
                  <div className="menu-item-sub">Trao đồ, nhận mã OTP</div>
                </div>
              </button>
              <div className="deposit-menu-divider" />
              <button
                className="deposit-menu-item item-pickup"
                onClick={() => navigate("/pickup")}
              >
                <span className="menu-item-icon">📤</span>
                <div>
                  <div className="menu-item-title">NHẬN ĐỒ</div>
                  <div className="menu-item-sub">Nhập mã OTP, mở tủ</div>
                </div>
              </button>
            </div>
          )}
        </button>

        {/* ── BOTTOM ROW: 2 cards ── */}
        <div className="home-bottom-row">
          {/* THUÊ TỦ */}
          <button className="home-small-card card-rent" onClick={() => navigate("/rent")}>
            <div className="small-card-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M8 20h32" stroke="currentColor" strokeWidth="2"/>
                <rect x="18" y="23" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="27" cy="27" r="1.5" fill="currentColor"/>
                <path d="M18 27h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M33 27h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="small-card-title">THUÊ TỦ MỚI</div>
            <div className="small-card-sub">Gói từ 1 tháng</div>
          </button>

          {/* HỖ TRỢ */}
          <button className="home-small-card card-support" onClick={() => navigate("/support")}>
            <div className="small-card-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5"/>
                <circle cx="24" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M24 21c-4 0-7 2-7 5v2c0 2 3 4 7 4s7-2 7-4v-2c0-3-3-5-7-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="small-card-title">HỖ TRỢ</div>
            <div className="small-card-sub">FAQ &amp; Hotline 24/7</div>
          </button>
        </div>

        {/* Status bar */}
        <div className="home-status">
          <div className="status-item">
            <span className="status-dot available" />
            <span className="status-label">Tủ trống</span>
            <span className="status-value">08</span>
          </div>
          <div className="status-divider" />
          <div className="status-item">
            <span className="status-dot occupied" />
            <span className="status-label">Đang dùng</span>
            <span className="status-value">04</span>
          </div>
          <div className="status-divider" />
          <div className="status-item">
            <span className="status-dot reserved" />
            <span className="status-label">Đặt trước</span>
            <span className="status-value">02</span>
          </div>
        </div>
      </div>
    </KioskLayout>
  );
}
