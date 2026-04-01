import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import "./SizeSelectScreen.css";

const SIZES = [
  {
    id: "small",
    label: "NHỎ",
    dims: "20×30×40 cm",
    icon: "📦",
    desc: "Giấy tờ, túi xách nhỏ, balo",
    price: "5.000đ",
    color: "#3B82F6",
    width: 24,
    height: 32,
  },
  {
    id: "medium",
    label: "VỪA",
    dims: "30×40×50 cm",
    icon: "📦",
    desc: "Balo lớn, túi đồ, hộp quà",
    price: "10.000đ",
    color: "#8B5CF6",
    width: 32,
    height: 40,
  },
  {
    id: "large",
    label: "LỚN",
    dims: "40×50×60 cm",
    icon: "📦",
    desc: "Vali nhỏ, hộp carton, túi đồ lớn",
    price: "15.000đ",
    color: "#F59E0B",
    width: 40,
    height: 50,
  },
  {
    id: "xlarge",
    label: "RẤT LỚN",
    dims: "50×60×80 cm",
    icon: "📦",
    desc: "Vali, hộp máy, đồ cồng kềnh",
    price: "20.000đ",
    color: "#EF4444",
    width: 50,
    height: 60,
  },
];

export default function SizeSelectScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = (location.state as { phone?: string })?.phone ?? "";
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    navigate(`/otp/deposit`, { state: { phone, size: selected } });
  };

  return (
    <KioskLayout>
      <div className="size-root">
        <div className="size-header">
          <div className="header-accent" />
          <span className="size-title">CHỌN KÍCH THƯỚC TỦ</span>
          <span className="size-sub">Chạm vào kích thước phù hợp với đồ của bạn</span>
        </div>

        <div className="size-grid">
          {SIZES.map((s) => (
            <button
              key={s.id}
              className={`size-card ${selected === s.id ? "selected" : ""}`}
              style={{
                borderColor: selected === s.id ? s.color : undefined,
                boxShadow: selected === s.id ? `0 0 20px ${s.color}30` : undefined,
              }}
              onClick={() => setSelected(s.id)}
            >
              <div className="size-card-header">
                <div className="size-label" style={{ color: s.color }}>{s.label}</div>
                <div className="size-dims">{s.dims}</div>
              </div>

              {/* Locker visual */}
              <div className="locker-visual-wrap">
                <div
                  className="locker-visual"
                  style={{
                    width: s.width,
                    height: s.height,
                    borderColor: s.color,
                    background: `${s.color}12`,
                  }}
                >
                  <div className="locker-door" style={{ borderColor: `${s.color}60` }}>
                    <div className="locker-handle" style={{ background: s.color }} />
                  </div>
                </div>
              </div>

              <div className="size-desc">{s.desc}</div>
              <div className="size-price" style={{ color: s.color }}>{s.price}</div>

              {/* Selection indicator */}
              <div className={`size-check ${selected === s.id ? "visible" : ""}`} style={{ background: s.color }}>
                ✓
              </div>
            </button>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="size-actions">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Quay lại
          </button>
          <button
            className={`btn-continue ${selected ? "active" : ""}`}
            onClick={handleContinue}
          >
            TIẾP TỤC
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}
