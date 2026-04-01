import KioskLayout from "./KioskLayout";
import "./SupportScreen.css";

const FAQS = [
  {
    q: "Làm sao để gửi đồ?",
    a: "Chạm GỬI ĐỒ → nhập số điện thoại → chọn kích thước tủ → nhận mã OTP → mở tủ → bỏ đồ vào → đóng tủ",
  },
  {
    q: "Quên mã OTP phải làm sao?",
    a: "Chạm Gửi lại mã OTP hoặc liên hệ hotline 1900.xxxx để được hỗ trợ.",
  },
  {
    q: "Đồ bị mất trong tủ ai chịu trách nhiệm?",
    a: "SmartBox không chịu trách nhiệm về đồ quý giá. Không để tiền mặt, trang sức, giấy tờ quan trọng trong tủ.",
  },
  {
    q: "Tủ có bảo mật không?",
    a: "Mỗi tủ có cảm biến đóng mở và camera giám sát 24/7. Chỉ chủ nhân có mã OTP mới mở được tủ.",
  },
];

export default function SupportScreen() {
  return (
    <KioskLayout>
      <div className="sup-root">
        <div className="sup-header">
          <span className="sup-title">HỖ TRỢ</span>
          <span className="sup-hotline">📞 Hotline: 1900 1234</span>
        </div>

        <div className="sup-body">
          {FAQS.map((faq, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-q">
                <span className="faq-num">Q{i + 1}</span>
                <span className="faq-text">{faq.q}</span>
                <span className="faq-arrow">▼</span>
              </summary>
              <div className="faq-a">{faq.a}</div>
            </details>
          ))}
        </div>

        <div className="sup-footer">
          <button className="sup-call-btn" onClick={() => {}}>
            📞 Gọi hotline
          </button>
          <button className="sup-chat-btn" onClick={() => {}}>
            💬 Chat với nhân viên
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}
