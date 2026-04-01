import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./KioskLayout.css";

interface KioskLayoutProps {
  children: ReactNode;
}

export default function KioskLayout({ children }: KioskLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const now = new Date();
  const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="kiosk-root">
      {/* HEADER */}
      <header className="kiosk-header">
        <div className="header-left">
          {!isHome && (
            <button className="header-back-btn" onClick={() => navigate(-1)}>
              ← Quay lại
            </button>
          )}
          <span className="header-brand-icon">📦</span>
          <span className="header-system-name">LOCKER_SYSTEM_01</span>
          <span className="header-env-badge">PRODUCTION</span>
        </div>
        <div className="header-right">
          <div className="header-temp">
            <span className="temp-icon">🌡️</span>
            <span className="temp-value">26°C</span>
          </div>
          <div className="header-clock">
            <span className="clock-time">{timeStr}</span>
            <span className="clock-date">{dateStr}</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="kiosk-main">{children}</main>

      {/* FOOTER */}
      <footer className="kiosk-footer">
        <div className="footer-left">
          <span className="footer-terminal">TERMINAL: LOCKER_SB_001</span>
          <span className="footer-sep">|</span>
          <span className="footer-id">ID: AA:BB:CC:DD:EE:FF</span>
        </div>
        <div className="footer-right">
          <span className="footer-warning">⚠️ Không để đồ quý giá trong tủ</span>
        </div>
      </footer>
    </div>
  );
}
