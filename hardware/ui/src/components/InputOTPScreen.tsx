import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import ProcessingScreen from "./ProcessingScreen";
import SuccessScreen from "./SuccessScreen";
import LockerOpenScreen from "./LockerOpenScreen";
import "./InputOTPScreen.css";

const OTP_TIMEOUT = 120;

export default function InputOTPScreen() {
  const { type = "pickup" } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [, setCountdown] = useState(OTP_TIMEOUT);
  const [txId] = useState(() => `TX${String(Math.floor(Math.random() * 90000 + 10000))}`);
  const [locker] = useState(() => `L0${Math.floor(Math.random() * 8 + 1)}`);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (loading || success) return;
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
  }, [loading, success, navigate]);

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
    // Rent keeps the existing SuccessScreen with auto-close
    if (type === "rent") {
      const cfg: Record<string, { title: string; subtitle: string }> = {
        rent: { title: "THUÊ TỦ THÀNH CÔNG", subtitle: "Tủ của bạn đã sẵn sàng" },
      };
      const c = cfg[type] ?? cfg.rent;
      return (
        <SuccessScreen
          title={c.title}
          subtitle={c.subtitle}
          lockerCode={locker}
          transactionId={txId}
          type="rent"
          autoClose={30}
        />
      );
    }

    // Deposit & Pickup: show LockerOpenScreen with "Hoàn tất" → Home
    return (
      <LockerOpenScreen
        locker={locker}
        txId={txId}
        type={type as "deposit" | "pickup"}
      />
    );
  }

  const colorMap: Record<string, string> = {
    deposit: "#FF6600",
    pickup: "#2196F3",
    rent: "#4CAF50",
  };
  const titleMap: Record<string, string> = {
    deposit: "GỬI ĐỒ",
    pickup: "NHẬN ĐỒ",
    rent: "THUÊ TỦ",
  };

  const color = colorMap[type] ?? colorMap.deposit;
  const title = titleMap[type] ?? titleMap.deposit;

  return (
    <KioskLayout>
      <div className="otp-root">
        <div className="otp-header" data-color={color}>
          <div className="header-accent" />
          <span className="otp-title">{title}</span>
        </div>

        <div className="otp-boxes" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              className={`otp-box${digit ? " filled" : ""}${error ? " error" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={() => inputRefs.current[i]?.select()}
            />
          ))}
        </div>

        {error && <div className="otp-error-msg">{error}</div>}

        <button
          className={`otp-confirm-btn${isComplete ? " ready" : ""}`}
          data-color={color}
          onClick={handleVerify}
        >
          XÁC NHẬN
        </button>
      </div>
    </KioskLayout>
  );
}
