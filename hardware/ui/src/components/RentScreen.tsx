import { useNavigate } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import "./RentScreen.css";

const PLANS = [
  { id: "1m", label: "1 THÁNG", price: "150.000đ", popular: false, color: "#3B82F6" },
  { id: "3m", label: "3 THÁNG", price: "400.000đ", popular: true,  color: "#FF6600" },
  { id: "6m", label: "6 THÁNG", price: "720.000đ", popular: false, color: "#4CAF50" },
];

export default function RentScreen() {
  const navigate = useNavigate();

  return (
    <KioskLayout>
      <div className="rent-root">
        <div className="rent-header">
          <div className="header-accent" />
          <span className="rent-title">THUÊ TỦ MỚI</span>
          <span className="rent-sub">Chọn gói thuê</span>
        </div>

        <div className="rent-plans">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              className="plan-card"
              data-color={plan.color}
              onClick={() => navigate("/rent-phone")}
            >
              {plan.popular && <span className="plan-badge">PHỔ BIẾN</span>}
              <span className="plan-label">{plan.label}</span>
              <span className="plan-price">{plan.price}</span>
              <span className="plan-per">/tháng</span>
            </button>
          ))}
        </div>
      </div>
    </KioskLayout>
  );
}
