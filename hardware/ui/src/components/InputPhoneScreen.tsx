import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import ProcessingScreen from "./ProcessingScreen";
import "./InputPhoneScreen.css";

interface Props {
  type?: "deposit" | "pickup";
}

export default function InputPhoneScreen({ type = "deposit" }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  // Phone number comes from physical keypad via router state
  const state = (location.state as { phone?: string }) ?? {};
  const phone = state.phone ?? "";

  const [loading, setLoading] = useState(false);

  const config = {
    deposit: {
      title: "GỬI ĐỒ",
      sub: "Nhập số điện thoại của bạn",
      color: "#FF6600",
      hint: "Số điện thoại nhận mã OTP",
    },
    pickup: {
      title: "NHẬN ĐỒ",
      sub: "Nhập số điện thoại đã dùng khi gửi",
      color: "#2196F3",
      hint: "Số điện thoại đã đăng ký",
    },
  };

  const cfg = config[type];
  const isValid = phone.length >= 9;

  const handleConfirm = async () => {
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    if (type === "deposit") {
      navigate("/size", { state: { phone } });
    } else {
      navigate(`/otp/${type}`, { state: { phone } });
    }
  };

  if (loading) {
    return (
      <ProcessingScreen
        type={type}
        message="ĐANG KIỂM TRA..."
        sub="Xác minh số điện thoại"
        step={1}
        totalSteps={type === "deposit" ? 4 : 3}
      />
    );
  }

  return (
    <KioskLayout>
      <div className="phone-root">
        <div className="phone-header">
          <div className="header-accent" style={{ background: cfg.color }} />
          <span className="phone-title" style={{ color: cfg.color }}>{cfg.title}</span>
          <span className="phone-sub">{cfg.sub}</span>
        </div>

        <div className="phone-input-area">
          <div className="phone-hint">{cfg.hint}</div>
          <div className={`phone-display ${isValid ? "valid" : ""}`}>
            <span className="phone-prefix">+84</span>
            <span className="phone-digits">
              {phone.padEnd(10, "_").split("").map((c, i) => (
                <span key={i} className={`digit ${c === "_" ? "placeholder" : ""}`}>
                  {c === "_" ? "_" : c}
                </span>
              ))}
            </span>
          </div>
          <div className="phone-length-hint">
            {isValid
              ? <span className="hint-ok">✓ Đủ {phone.length} số</span>
              : <span>{phone.length}/10 số — dùng phím vật lý để nhập</span>}
          </div>
        </div>

        <div className="phone-confirm-area">
          <button
            className={`phone-confirm-btn ${isValid ? "ready" : ""}`}
            style={isValid ? { background: cfg.color } : undefined}
            onClick={handleConfirm}
          >
            <span className="confirm-icon">✓</span>
            <span className="confirm-label">XÁC NHẬN</span>
            {!isValid && (
              <span className="confirm-hint">Nhập 10 số để tiếp tục</span>
            )}
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}
