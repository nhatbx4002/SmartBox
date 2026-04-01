import { useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import ProcessingScreen from "./ProcessingScreen";
import SuccessScreen from "./SuccessScreen";
import "./InputOTPScreen.css";

export default function InputOTPScreen() {
  const { type = "deposit" } = useParams<{ type: string }>();
  const location = useLocation();
  const state = (location.state as { phone?: string; size?: string }) ?? {};
  const phone = state.phone ?? "0901234567";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txId] = useState(() => `TX${String(Math.floor(Math.random() * 90000 + 10000))}`);
  const [locker] = useState(() => `L0${Math.floor(Math.random() * 8 + 1)}`);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = otp.join("");
  const isComplete = digits.length === 6;

  const handleDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = Array(6).fill("").map((_, i) => pasted[i] ?? "");
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    if (!isComplete) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  };

  const handleResend = () => {
    setOtp(Array(6).fill(""));
    setError("");
    inputRefs.current[0]?.focus();
  };

  if (loading) {
    const messages: Record<string, { msg: string; sub: string }> = {
      deposit: { msg: "ĐANG XÁC MINH...", sub: "Kiểm tra mã OTP gửi đến" },
      pickup: { msg: "ĐANG TÌM TỦ...", sub: "Xác minh thông tin giao dịch" },
      rent: { msg: "ĐANG XỬ LÝ...", sub: "Tạo hợp đồng thuê" },
    };
    const m = messages[type] ?? messages.deposit;
    return (
      <ProcessingScreen
        type={type as "deposit" | "pickup" | "rent"}
        message={m.msg}
        sub={m.sub}
        step={2}
        totalSteps={type === "deposit" ? 4 : 3}
      />
    );
  }

  if (success) {
    const cfg: Record<string, { title: string; subtitle: string }> = {
      deposit: { title: "GỬI ĐỒ THÀNH CÔNG", subtitle: "Mời bạn bỏ đồ vào tủ" },
      pickup: { title: "NHẬN ĐỒ THÀNH CÔNG", subtitle: "Cửa tủ đã mở" },
      rent: { title: "THUÊ TỦ THÀNH CÔNG", subtitle: "Tủ của bạn đã sẵn sàng" },
    };
    const c = cfg[type] ?? cfg.deposit;
    return (
      <SuccessScreen
        title={c.title}
        subtitle={c.subtitle}
        lockerCode={locker}
        transactionId={txId}
        type={type as "deposit" | "pickup" | "rent"}
        autoClose={30}
      />
    );
  }

  const titles: Record<string, string> = {
    deposit: "GỬI ĐỒ",
    pickup: "NHẬN ĐỒ",
    rent: "THUÊ TỦ",
  };
  const colors: Record<string, string> = {
    deposit: "#FF6600",
    pickup: "#2196F3",
    rent: "#4CAF50",
  };
  const color = colors[type] ?? colors.deposit;

  return (
    <KioskLayout>
      <div className="otp-root">
        <div className="otp-header">
          <div className="header-accent" style={{ background: color }} />
          <span className="otp-title" style={{ color }}>{titles[type] ?? titles.deposit}</span>
          <span className="otp-sub">Nhập mã OTP gửi đến</span>
        </div>

        <div className="otp-phone-hint">
          Mã gửi đến: <span className="otp-phone">+84 {phone.slice(1)}</span>
        </div>

        {/* 6 OTP boxes */}
        <div className="otp-boxes" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              className={`otp-box ${error ? "otp-error" : ""} ${digit ? "otp-filled" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={() => inputRefs.current[i]?.select()}
              style={digit ? { borderColor: color, color: "#E8E8E8" } : undefined}
            />
          ))}
        </div>

        {error && <div className="otp-error-msg">{error}</div>}

        <div className="otp-actions">
          <button className="otp-resend-btn" onClick={handleResend}>
            Không nhận được mã? Gửi lại
          </button>

          {/* Big confirm button */}
          <button
            className={`otp-confirm-btn ${isComplete ? "ready" : ""}`}
            style={isComplete ? { background: color, boxShadow: `0 0 30px ${color}40` } : undefined}
            onClick={handleVerify}
          >
            <span className="confirm-icon">✓</span>
            <span className="confirm-label">XÁC NHẬN</span>
            {!isComplete && (
              <span className="confirm-hint">Nhập đủ 6 số để tiếp tục</span>
            )}
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}
