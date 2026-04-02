import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import "./RentSuccessScreen.css";

const LOCKER_TIMEOUT = 120; // 2 phut

function generateId(prefix: string, max: number) {
  return `${prefix}${String(Math.floor(Math.random() * max + 1)).padStart(2, "0")}`;
}

export default function RentSuccessScreen() {
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [countdown, setCountdown] = useState(LOCKER_TIMEOUT);
  const [locker] = useState(() => generateId("L0", 6));
  const [otp] = useState(() => String(Math.floor(Math.random() * 900000 + 100000)));
  const [txId] = useState(() => `RT${String(Math.floor(Math.random() * 90000 + 10000))}`);

  // Countdown: tu dong chuyen sang hien thi OTP khi het gio
  useEffect(() => {
    if (showOtp) return;
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(tick);
          setShowOtp(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [showOtp]);

  if (showOtp) {
    return (
      <KioskLayout>
        <div className="otp-result-root">
          <div className="otp-result-icon">
            <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
              <path d="M10 30l10 10L38 14" stroke="#FF6600" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="otp-result-title">THUÊ TỦ THÀNH CÔNG</div>
          <div className="otp-result-locker">Tủ {locker}</div>

          <div className="otp-code-card">
            <div className="otp-code-label">MÃ OTP LẤY ĐỒ</div>
            <div className="otp-code-value">{otp}</div>
            <div className="otp-code-desc">Lưu lại mã này để lấy đồ lần sau</div>
          </div>

          <div className="otp-reminder">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM10 6v4M10 14v.01" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Lưu lại mã OTP này để lấy đồ lần sau</span>
          </div>

          <div className="otp-tx">
            <span>Mã giao dịch: {txId}</span>
          </div>

          <button className="otp-done-btn" onClick={() => navigate("/")}>
            QUAY VỀ MÀN HÌNH CHÍNH
          </button>
        </div>
      </KioskLayout>
    );
  }

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <KioskLayout>
      <div className="locker-open-root">
        <div className="locker-open-icon">
          <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
            <rect x="8" y="12" width="48" height="44" rx="6" stroke="#4CAF50" strokeWidth="3"/>
            <path d="M8 28h48" stroke="#4CAF50" strokeWidth="2"/>
            <path d="M32 28V12" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
            <path d="M20 12h24" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
            <rect x="26" y="32" width="12" height="10" rx="2" stroke="#4CAF50" strokeWidth="2"/>
            <circle cx="35" cy="37" r="1.5" fill="#4CAF50"/>
            <path d="M26 37h-3M38 37h-3" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="locker-open-title">MỞ TỦ THÀNH CÔNG</div>
        <div className="locker-open-locker">Tủ {locker}</div>
        <div className="locker-open-hint">Vui lòng bỏ đồ vào tủ</div>

        <button className="locker-done-btn" onClick={() => setShowOtp(true)}>
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
            <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          HOÀN TẤT - ĐÃ BỎ ĐỒ VÀO TỦ
        </button>

        <div className="locker-open-timer">
          Tủ sẽ tự đóng sau {mins}:{String(secs).padStart(2, "0")}
        </div>
      </div>
    </KioskLayout>
  );
}
