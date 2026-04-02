import { useNavigate } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import "./HomeScreen.css";

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <KioskLayout>
      <div className="home-root">
        {/* Row 1 */}
        <div className="home-row">
          {/* GỬI HÀNG */}
          <button className="home-card card-deposit" onClick={() => navigate("/otp/deposit")}>
            <div className="card-icon">
              <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.5">
                <rect x="6" y="14" width="36" height="28" rx="4" stroke="currentColor"/>
                <path d="M6 24h36" stroke="currentColor"/>
                <path d="M24 14V4" stroke="currentColor" strokeLinecap="round"/>
                <path d="M16 4h16" stroke="currentColor" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="card-title">GỬI HÀNG</span>
            <span className="card-desc">Nhập mã OTP, bỏ đồ vào tủ</span>
          </button>

          {/* NHẬN HÀNG */}
          <button className="home-card card-pickup" onClick={() => navigate("/otp/pickup")}>
            <div className="card-icon">
              <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.5">
                <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor"/>
                <path d="M6 20h36" stroke="currentColor"/>
                <path d="M24 20V34" stroke="currentColor" strokeLinecap="round"/>
                <path d="M16 28l8 8 8-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="card-title">NHẬN HÀNG</span>
            <span className="card-desc">Nhập mã OTP, lấy đồ ra</span>
          </button>
        </div>

        {/* Row 2 */}
        <div className="home-row">
          {/* THUÊ TỦ */}
          <button className="home-card card-rent" onClick={() => navigate("/rent")}>
            <div className="card-icon">
              <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.5">
                <rect x="6" y="10" width="36" height="32" rx="4" stroke="currentColor"/>
                <path d="M6 20h36" stroke="currentColor"/>
                <rect x="17" y="23" width="14" height="10" rx="2" stroke="currentColor"/>
                <circle cx="26" cy="28" r="1.5" fill="currentColor"/>
                <path d="M17 28h-4M31 28h-4" stroke="currentColor" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="card-title">THUÊ TỦ</span>
            <span className="card-desc">Gói từ 1 tháng trở lên</span>
          </button>

          {/* HỖ TRỢ */}
          <button className="home-card card-support" onClick={() => navigate("/support")}>
            <div className="card-icon">
              <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.5">
                <circle cx="24" cy="24" r="16" stroke="currentColor"/>
                <circle cx="24" cy="18" r="3" stroke="currentColor"/>
                <path d="M24 21c-5 0-9 2.5-9 6v2.5c0 1.5 4 3 9 3s9-1.5 9-3V24c0-3.5-4-6-9-6z" stroke="currentColor" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="card-title">HỖ TRỢ</span>
            <span className="card-desc">FAQ & Hotline 24/7</span>
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}
