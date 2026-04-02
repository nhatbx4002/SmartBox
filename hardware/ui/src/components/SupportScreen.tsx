import KioskLayout from "./KioskLayout";
import "./SupportScreen.css";

const FAQS = [
  {
    q: "Làm sao để gửi đồ?",
    a: "Chạm GỬI ĐỒ → nhập số điện thoại → nhận mã OTP → mở tủ → bỏ đồ vào → đóng tủ",
  },
  {
    q: "Quên mã OTP phải làm sao?",
    a: "Chạm Gửi lại mã OTP hoặc liên hệ hotline 1900.xxxx để được hỗ trợ.",
  },
  {
    q: "Đồ bị mất trong tủ ai chịu trách nhiệm?",
    a: "SmartBox không chịu trách nhiệm về đồ quá giá. Không để tiền mặt, trang sức, giấy tờ quan trọng trong tủ.",
  },
  {
    q: "Tủ có bảo mật không?",
    a: "Mỗi tủ có cảm biến đóng mở và camera giám sát 24/7. Chỉ chủ nhận có mã OTP mới mở được tủ.",
  },
];

export default function SupportScreen() {
  return (
    <KioskLayout>
      <div className="sup-root">
        <div className="sup-header">
          <div className="sup-header-left">
            <div className="header-accent" />
            <span className="sup-title">HỖ TRỢ</span>
          </div>
          <div className="sup-hotline">
            <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.5" stroke="currentColor" width="10" height="10">
              <path d="M6 3a1 1 0 011-1h2a1 1 0 011 1v2.5a.5.5 0 00.5.5H11a1 1 0 110 2H9.5a.5.5 0 00-.5.5V11a1 1 0 11-2 0V9a.5.5 0 00-.5-.5H5a1 1 0 110-2h1.5A.5.5 0 006 5.5V3z"/>
            </svg>
            <span>Hotline: 1900 1234</span>
          </div>
        </div>

        <div className="sup-body">
          {FAQS.map((faq, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-q">
                <span className="faq-num">Q{i + 1}</span>
                <span className="faq-text">{faq.q}</span>
                <svg className="faq-arrow" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </summary>
              <div className="faq-a">{faq.a}</div>
            </details>
          ))}
        </div>

        <div className="sup-footer">
          <button className="sup-call-btn">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
              <path d="M6 3a1 1 0 011-1h2a1 1 0 011 1v2.5a.5.5 0 00.5.5H11a1 1 0 110 2H9.5a.5.5 0 00-.5.5V11a1 1 0 11-2 0V9a.5.5 0 00-.5-.5H5a1 1 0 110-2h1.5A.5.5 0 006 5.5V3z"/>
            </svg>
            <span>Liên hệ Hotline</span>
          </button>
          <button className="sup-chat-btn">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
              <path d="M14 10c0 .6-.4 1.2-1 1.4l-1.3.3A8 8 0 013 9.7a8 8 0 011.3-1.4l.3-1.3A1 1 0 015.7 6h4.6a1 1 0 011 .9l-.3 1.4z"/>
            </svg>
            <span>Chat nhân viên</span>
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}
