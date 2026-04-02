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
  autoClose?: number;
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

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(tick); return 0; }
        return c - 1;
      });
    }, 1000);
    const closeTimer = setTimeout(() => navigate("/"), autoClose * 1000);
    return () => { clearInterval(tick); clearTimeout(closeTimer); };
  }, [autoClose, navigate]);

  const colorMap: Record<string, string> = {
    deposit: "#FF6600",
    pickup: "#2196F3",
    rent: "#4CAF50",
  };
  const color = colorMap[type] ?? colorMap.deposit;

  return (
    <KioskLayout>
      <div className="success-root">
        <div className="success-card" data-color={color}>
          <div className="success-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="success-title">{title}</div>
          {subtitle && <div className="success-sub">{subtitle}</div>}

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

          <div className="success-countdown">
            <div className="countdown-ring">
              <svg viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#1e1e1e" strokeWidth="2" />
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - countdown / autoClose)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <span className="countdown-num">{countdown}</span>
            </div>
            <span className="countdown-label">Tự động đóng sau</span>
          </div>

          <button className="success-btn" onClick={() => navigate("/")}>
            Quay về màn hình chính
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}
