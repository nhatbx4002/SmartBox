import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import "./LockerOpenScreen.css";

interface Props {
  locker: string;
  txId: string;
  type: "deposit" | "pickup";
}

const TIMEOUT = 60; // 1 phut

export default function LockerOpenScreen({ locker, txId, type }: Props) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(TIMEOUT);

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(tick);
          navigate("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [navigate]);

  const isDeposit = type === "deposit";
  const color = isDeposit ? "#FF6600" : "#2196F3";
  const title = isDeposit ? "MỞ TỦ THÀNH CÔNG" : "MỞ TỦ THÀNH CÔNG";
  const hint = isDeposit
    ? "Vui lòng bỏ đồ vào tủ rồi đóng cửa"
    : "Vui lòng lấy đồ ra rồi đóng cửa";

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <KioskLayout>
      <div className="locker-open-root">
        {/* Icon */}
        <div className="locker-open-icon-ring" style={{ borderColor: color, background: `${color}18` }}>
          <svg viewBox="0 0 64 64" fill="none" width="56" height="56">
            <rect x="8" y="12" width="48" height="44" rx="6" stroke={color} strokeWidth="3"/>
            <path d="M8 28h48" stroke={color} strokeWidth="2"/>
            <path d="M32 28V12" stroke={color} strokeWidth="3" strokeLinecap="round"/>
            <path d="M20 12h24" stroke={color} strokeWidth="3" strokeLinecap="round"/>
            <rect x="26" y="32" width="12" height="10" rx="2" stroke={color} strokeWidth="2"/>
            <circle cx="35" cy="37" r="1.5" fill={color}/>
            <path d="M26 37h-3M38 37h-3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Title */}
        <div className="locker-open-title" style={{ color }}>{title}</div>

        {/* Locker number */}
        <div className="locker-open-locker" style={{ color }}>Tủ {locker}</div>

        {/* Instruction */}
        <div className="locker-open-hint">{hint}</div>

        {/* Timer */}
        <div className="locker-open-timer">
          Tủ sẽ tự đóng sau {mins > 0 ? `${mins} phút ` : ""}{secs} giây
        </div>

        {/* Done button */}
        <button className="locker-open-done-btn" style={{ background: color }} onClick={() => navigate("/")}>
          HOAN TAT
        </button>

        {/* Transaction ID */}
        <div className="locker-open-tx">Mã giao dịch: {txId}</div>
      </div>
    </KioskLayout>
  );
}
