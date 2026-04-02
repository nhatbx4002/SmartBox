import { useNavigate } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import "./SizeSelectScreen.css";

const SIZES = [
  { id: "small", label: "NHO", dims: "20x30x40 cm", desc: "Giay to, tui xach nho, balo", price: "5.000d", color: "#3B82F6" },
  { id: "medium", label: "VUA", dims: "30x40x50 cm", desc: "Balo lon, tui do, hop qua", price: "10.000d", color: "#8B5CF6" },
  { id: "large", label: "LON", dims: "40x50x60 cm", desc: "Vali nho, hop carton, tui do lon", price: "15.000d", color: "#F59E0B" },
  { id: "xlarge", label: "RAT LON", dims: "50x60x80 cm", desc: "Vali, hop may, do cong kenh", price: "20.000d", color: "#EF4444" },
];

export default function SizeSelectScreen() {
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    // Store selected size for the OTP success screen
    sessionStorage.setItem("selectedSize", id);
    navigate(`/otp/deposit`);
  };

  return (
    <KioskLayout>
      <div className="size-root">
        <div className="size-header">
          <div className="header-accent" />
          <span className="size-title">CHON KICH THUOC TU</span>
          <span className="size-sub">Cham vao kich thuoc phu hop</span>
        </div>

        <div className="size-grid">
          {SIZES.map((s) => (
            <button
              key={s.id}
              className="Size-card"
              data-color={s.color}
              onClick={() => handleSelect(s.id)}
            >
              <div className="size-card-header">
                <div className="size-label">{s.label}</div>
                <div className="size-dims">{s.dims}</div>
              </div>

              <div className="locker-visual-wrap">
                <div className="locker-visual">
                  <div className="locker-door">
                    <div className="locker-handle" />
                  </div>
                </div>
              </div>

              <div className="size-desc">{s.desc}</div>
              <div className="size-price">{s.price}</div>
            </button>
          ))}
        </div>
      </div>
    </KioskLayout>
  );
}
