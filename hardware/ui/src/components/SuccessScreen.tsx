import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import "./SuccessScreen.css";

interface Props {
  title: string;
  subtitle?: string;
  lockerCode?: string;
  transactionId?: string;
  type?: "deposit" | "pickup" | "rent";
  autoClose?: number; // seconds
}

export default function SuccessScreen({
  title,
  subtitle,
  lockerCode,
  transactionId,
  type = "deposit",
  autoClose = 30,
}: Props) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(autoClose);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => setIsOpen(true), 100);
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(tick); return 0; }
        return c - 1;
      });
    }, 1000);
    const closeTimer = setTimeout(() => navigate("/"), autoClose * 1000);
    return () => { clearTimeout(openTimer); clearInterval(tick); clearTimeout(closeTimer); };
  }, [autoClose, navigate]);

  const icons: Record<string, string> = {
    deposit: "📥",
    pickup: "📤",
    rent: "🔒",
  };

  return (
    <KioskLayout>
      <div className="success-root">
        <div className={`success-card ${isOpen ? "open" : ""}`}>
          {/* Check icon */}
          <div className="success-icon-wrap">
            <div className="success-check-ring" />
            <div className="success-check">✓</div>
          </div>

          <div className="success-icon-emoji">{icons[type]}</div>
          <div className="success-title">{title}</div>
          {subtitle && <div className="success-sub">{subtitle}</div>}

          {/* Info grid */}
          {(lockerCode || transactionId) && (
            <div className="success-info-grid">
              {lockerCode && (
                <div className="success-info-item">
                  <div className="info-label">MỞ TỦ</div>
                  <div className="info-value locker">{lockerCode}</div>
                </div>
              )}
              {transactionId && (
                <div className="success-info-item">
                  <div className="info-label">MÃ GD</div>
                  <div className="info-value">{transactionId}</div>
                </div>
              )}
            </div>
          )}

          {/* Countdown */}
          <div className="success-countdown">
            <div className="countdown-ring">
              <svg viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#1e1e1e" strokeWidth="2" />
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  stroke="#FF6600"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - countdown / autoClose)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <span className="countdown-num">{countdown}</span>
            </div>
            <span className="countdown-label">Tự động đóng sau</span>
          </div>

          <button className="success-btn" onClick={() => navigate("/")}>
            ← Quay về màn hình chính
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}
