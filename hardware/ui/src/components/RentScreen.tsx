import { useState } from "react";
import KioskLayout from "./KioskLayout";
import ProcessingScreen from "./ProcessingScreen";
import SuccessScreen from "./SuccessScreen";
import "./RentScreen.css";

const PLANS = [
  { id: "1m", label: "1 THÁNG", price: "150.000đ", popular: false, color: "#3B82F6" },
  { id: "3m", label: "3 THÁNG", price: "400.000đ", popular: true,  color: "#FF6600" },
  { id: "6m", label: "6 THÁNG", price: "720.000đ", popular: false, color: "#4CAF50" },
];

type Step = "plan" | "phone" | "otp" | "loading" | "success";

export default function RentScreen() {
  const [step, setStep] = useState<Step>("plan");
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [phone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [locker] = useState(() => `L0${Math.floor(Math.random() * 6 + 1)}`);
  const [txId] = useState(() => `RT${String(Math.floor(Math.random() * 90000 + 10000))}`);

  // ── STEP: plan select ──────────────────────────────
  if (step === "plan") {
    return (
      <KioskLayout>
        <div className="rent-root">
          <div className="rent-header">
            <div className="header-accent" />
            <span className="rent-title">THUÊ TỦ MỚI</span>
            <span className="rent-sub">Chọn gói thuê phù hợp</span>
          </div>

          <div className="rent-plans">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                className={`plan-card ${plan.popular ? "popular" : ""} ${selectedPlan?.id === plan.id ? "selected" : ""}`}
                style={selectedPlan?.id === plan.id ? {
                  borderColor: plan.color,
                  boxShadow: `0 0 20px ${plan.color}30`,
                } : undefined}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.popular && (
                  <span className="plan-badge" style={{ color: plan.color, borderColor: plan.color, background: `${plan.color}12` }}>
                    PHỔ BIẾN
                  </span>
                )}
                <div className="plan-label" style={{ color: selectedPlan?.id === plan.id ? plan.color : "#ccc" }}>
                  {plan.label}
                </div>
                <div className="plan-price" style={{ color: plan.color }}>{plan.price}</div>
                <div className="plan-per">/tháng</div>
                {selectedPlan?.id === plan.id && (
                  <div className="plan-check" style={{ background: plan.color }}>✓</div>
                )}
              </button>
            ))}
          </div>

          <div className="rent-note">
            <span>📦</span> Tủ sẽ được gán ngay sau khi thanh toán
          </div>

          <button
            className={`btn-continue ${selectedPlan ? "active" : ""}`}
            style={selectedPlan ? { background: selectedPlan.color } : undefined}
            onClick={() => {
              if (selectedPlan) setStep("phone");
            }}
          >
            TIẾP TỤC
          </button>
        </div>
      </KioskLayout>
    );
  }

  // ── STEP: phone input ──────────────────────────────
  if (step === "phone") {
    return (
      <KioskLayout>
        <div className="rent-phone-root">
          <div className="rent-phone-header">
            <div className="header-accent" />
            <span className="phone-title">THUÊ TỦ</span>
            <span className="phone-sub">Nhập số điện thoại của bạn</span>
          </div>

          <div className="phone-input-area">
            <div className="phone-hint">Số điện thoại nhận thông tin hợp đồng</div>
            <div className={`phone-display ${phone.length >= 9 ? "valid" : ""}`}>
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
              {phone.length >= 9
                ? <span className="hint-ok">✓ Đủ {phone.length} số</span>
                : <span>{phone.length}/10 số — dùng phím vật lý để nhập</span>}
            </div>
          </div>

          <div className="phone-confirm-area">
            <button
              className={`phone-confirm-btn ${phone.length >= 9 ? "ready" : ""}`}
              style={phone.length >= 9 ? { background: "#4CAF50" } : undefined}
              onClick={() => {
                if (phone.length >= 9) setStep("otp");
              }}
            >
              <span className="confirm-icon">✓</span>
              <span className="confirm-label">XÁC NHẬN</span>
              {phone.length < 9 && (
                <span className="confirm-hint">Nhập 10 số để tiếp tục</span>
              )}
            </button>
          </div>
        </div>
      </KioskLayout>
    );
  }

  // ── STEP: OTP ────────────────────────────────────
  if (step === "otp") {
    return (
      <KioskLayout>
        <div className="otp-root">
          <div className="otp-header">
            <div className="header-accent" style={{ background: "#4CAF50" }} />
            <span className="otp-title" style={{ color: "#4CAF50" }}>THUÊ TỦ</span>
            <span className="otp-sub">Nhập mã OTP gửi đến</span>
          </div>

          <div className="otp-phone-hint">
            Mã gửi đến: <span className="otp-phone">+84 {phone.slice(1)}</span>
          </div>

          <div className="otp-boxes">
            {otp.map((digit, i) => (
              <input
                key={i}
                className={`otp-box ${digit ? "otp-filled" : ""}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/, "");
                  const n = [...otp];
                  n[i] = v;
                  setOtp(n);
                  if (v && i < 5) {
                    const inputs = document.querySelectorAll<HTMLInputElement>(".otp-box");
                    inputs[i + 1]?.focus();
                  }
                }}
              />
            ))}
          </div>

          <div className="otp-actions">
            <button className="otp-resend-btn" onClick={() => setOtp(Array(6).fill(""))}>
              Không nhận được mã? Gửi lại
            </button>

            <button
              className={`otp-confirm-btn ${otp.every(d => d) ? "ready" : ""}`}
              style={otp.every(d => d) ? { background: "#4CAF50", boxShadow: "0 0 30px #4CAF5040" } : undefined}
              onClick={() => {
                if (otp.every(d => d)) setStep("loading");
              }}
            >
              <span className="confirm-icon">✓</span>
              <span className="confirm-label">XÁC NHẬN</span>
              {!otp.every(d => d) && (
                <span className="confirm-hint">Nhập đủ 6 số để tiếp tục</span>
              )}
            </button>
          </div>
        </div>
      </KioskLayout>
    );
  }

  // ── STEP: loading ─────────────────────────────────
  if (step === "loading") {
    return (
      <ProcessingScreen
        type="rent"
        message="ĐANG TẠO HỢP ĐỒNG..."
        sub={`Thuê ${selectedPlan?.label ?? ""}`}
        step={3}
        totalSteps={3}
      />
    );
  }

  // ── STEP: success ─────────────────────────────────
  return (
    <SuccessScreen
      title="THUÊ TỦ THÀNH CÔNG"
      subtitle={`Tủ ${locker} đã thuộc về bạn`}
      lockerCode={locker}
      transactionId={txId}
      type="rent"
      autoClose={30}
    />
  );
}
