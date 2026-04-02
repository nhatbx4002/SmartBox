import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import "./PaymentScreen.css";

const METHOD_ICONS: Record<string, React.ReactNode> = {
  momo: (
    <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
      <circle cx="16" cy="16" r="14" fill="#A50064"/>
      <path d="M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8c2.2 0 4.2-.9 5.7-2.3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="12" r="2" fill="#fff"/>
    </svg>
  ),
  Zalopay: (
    <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
      <rect width="32" height="32" rx="6" fill="#2D9A38"/>
      <path d="M8 20l4-8 4 5 4-9 4 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  vietqr: (
    <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
      <rect width="32" height="32" rx="6" fill="#0068FF"/>
      <rect x="6" y="6" width="8" height="8" rx="1" stroke="#fff" strokeWidth="1.5"/>
      <rect x="18" y="6" width="8" height="8" rx="1" stroke="#fff" strokeWidth="1.5"/>
      <rect x="6" y="18" width="8" height="8" rx="1" stroke="#fff" strokeWidth="1.5"/>
      <rect x="18" y="18" width="4" height="4" fill="#fff"/>
    </svg>
  ),
  cash: (
    <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
      <circle cx="16" cy="16" r="13" stroke="#4CAF50" strokeWidth="2"/>
      <path d="M16 9v14M13 12h6c1 0 2 .9 2 2s-1 2-2 2h-6c-1 0-2 .9-2 2s1 2 2 2h6" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const METHODS = [
  { id: "momo", label: "MoMo", color: "#A50064", sub: "Thanh toán nhanh" },
  { id: "Zalopay", label: "ZaloPay", color: "#2D9A38", sub: "An toàn, tiện lợi" },
  { id: "vietqr", label: "VietQR", color: "#0068FF", sub: "Quét mã QR" },
  { id: "cash", label: "Tiền mặt", color: "#4CAF50", sub: "Tại quầy thanh toán" },
];

export default function PaymentScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handlePay = () => {
    if (!selected) return;
    navigate("/rent-locker");
  };

  return (
    <KioskLayout>
      <div className="pay-root">
        <div className="pay-header">
          <div className="header-accent" />
          <span className="pay-title">THANH TOÁN</span>
          <span className="pay-sub">Chọn phương thức thanh toán</span>
        </div>

        <div className="pay-amount-card">
          <span className="pay-amount-label">Số tiền thanh toán</span>
          <span className="pay-amount-value">150.000d</span>
          <span className="pay-amount-note">Thuê tủ 1 tháng</span>
        </div>

        <div className="pay-methods">
          {METHODS.map((m) => (
            <button
              key={m.id}
              className={`pay-method-btn${selected === m.id ? " selected" : ""}`}
              data-color={m.color}
              onClick={() => setSelected(m.id)}
            >
              <div className="pay-method-icon">{METHOD_ICONS[m.id]}</div>
              <div className="pay-method-info">
                <span className="pay-method-label">{m.label}</span>
                <span className="pay-method-sub">{m.sub}</span>
              </div>
              {selected === m.id && (
                <div className="pay-method-check">
                  <svg viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          className={`pay-btn${selected ? " ready" : ""}`}
          onClick={handlePay}
        >
          THANH TOÁN NGAY
        </button>
      </div>
    </KioskLayout>
  );
}
