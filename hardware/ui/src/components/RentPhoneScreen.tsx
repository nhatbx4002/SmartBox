import { useNavigate } from "react-router-dom";
import KioskLayout from "./KioskLayout";
import "./RentPhoneScreen.css";

export default function RentPhoneScreen() {
  const navigate = useNavigate();
  const phone = "0901234567";

  return (
    <KioskLayout>
      <div className="phone-root">
        <div className="phone-header">
          <div className="header-accent" />
          <span className="phone-title">THUÊ TỦ</span>
          <span className="phone-sub">Nhập số điện thoại</span>
        </div>

        <div className="phone-input-area">
          <div className="phone-hint">Số điện thoại nhận hợp đồng</div>
          <div className="phone-display">
            <span className="phone-prefix">+84</span>
            <span className="phone-digits">
              {phone.split("").map((c, i) => (
                <span key={i} className="digit">{c}</span>
              ))}
            </span>
          </div>
          <div className="phone-length-hint">
            <span className="hint-ok">Đã nhập 10 số</span>
          </div>
        </div>

        <button
          className="phone-confirm-btn ready"
          onClick={() => navigate("/payment")}
        >
          TIẾP TỤC THANH TOÁN
        </button>
      </div>
    </KioskLayout>
  );
}
