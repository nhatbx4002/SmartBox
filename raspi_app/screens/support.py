from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLabel, QPushButton, QVBoxLayout, QWidget
from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style
from screens.components.header_bar import HeaderBar
from screens.base import BaseController
from services.config_loader import get_config_value


class SupportController(BaseController):
    route = "/support"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.child("btnBack", QPushButton).clicked.connect(self.go_home)
        self.hotline_label = self.child("lblHotline", QLabel)
        self.answers = {
            1: self.child("lblFaq1Answer", QLabel),
            2: self.child("lblFaq2Answer", QLabel),
            3: self.child("lblFaq3Answer", QLabel),
            4: self.child("lblFaq4Answer", QLabel),
        }
        for index in self.answers:
            self.set_clickable(self.child(f"faqItem{index}"), lambda value=index: self._expand(value))

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        header = HeaderBar("Hỗ trợ", on_back=self.go_home, parent=root, back_object_name="btnBack")
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(24, 28, 24, 32)
        body.setSpacing(20)

        hotline_card = QFrame(root)
        hotline_card.setFixedHeight(148)
        hotline_card.setStyleSheet("QFrame { background-color: #1C1B1B; border: 2px solid #FF6600; border-radius: 24px; } QLabel { background: transparent; }")
        hot_layout = QVBoxLayout(hotline_card)
        hot_layout.setAlignment(Qt.AlignCenter)
        hot_layout.setSpacing(8)

        hot_title = QLabel("Hotline hỗ trợ", hotline_card)
        hot_title.setAlignment(Qt.AlignCenter)
        hot_title.setStyleSheet("border: none; color: #888; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 500;")

        self.hotline = QLabel("1900 1234", hotline_card)
        self.hotline.setObjectName("lblHotline")
        self.hotline.setAlignment(Qt.AlignCenter)
        self.hotline.setStyleSheet("border: none; color: #FF6600; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 44px; font-weight: 900;")

        hot_layout.addWidget(hot_title)
        hot_layout.addWidget(self.hotline)
        body.addWidget(hotline_card)

        faq_title = QLabel("CÂU HỎI THƯỜNG GẶP", root)
        faq_title.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 26px; font-weight: 700;")
        body.addWidget(faq_title)

        faqs = [
            ("faqItem1", "Làm thế nào để gửi đồ?", "Chọn \"GỬI ĐỒ\" trên màn hình chính, nhập mã PIN được cung cấp bởi người gửi. Mở ngăn tủ và đặt đồ vào, sau đó đóng cửa lại."),
            ("faqItem2", "Làm thế nào để nhận đồ?", "Chọn \"NHẬN ĐỒ\" trên màn hình chính. Bạn có thể nhập mã PIN hoặc quét mã QR để mở ngăn tủ và lấy đồ."),
            ("faqItem3", "Tôi có thể thuê tủ trong bao lâu?", "Chúng tôi có các gói thuê theo ngày, tuần hoặc tháng. Bạn có thể chọn gói phù hợp với nhu cầu khi thuê tủ."),
            ("faqItem4", "Làm thế nào để thanh toán?", "Chúng tôi hỗ trợ thanh toán qua PayOS. Sau khi chọn gói thuê, bạn sẽ được chuyển đến màn hình thanh toán."),
        ]

        for obj_name, question, answer in faqs:
            faq_item = QFrame(root)
            faq_item.setObjectName(obj_name)
            faq_item.setMinimumHeight(96)
            faq_item.setCursor(Qt.PointingHandCursor)
            faq_item.setStyleSheet(
                f"QFrame#{obj_name} {{ background-color: #111111; border: 2px solid #2A2A2A; border-radius: 20px; }}"
                f"QFrame#{obj_name}:hover {{ border: 2px solid #FF6600; }}"
                f"QLabel {{ background: transparent; }}"
            )
            faq_layout = QVBoxLayout(faq_item)
            faq_layout.setContentsMargins(24, 20, 24, 20)
            faq_layout.setSpacing(10)

            q_label = QLabel(question, faq_item)
            q_label.setWordWrap(True)
            q_label.setStyleSheet("border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 24px; font-weight: 700;")

            a_label = QLabel(answer, faq_item)
            a_label.setObjectName(f"{obj_name.replace('faqItem', 'lblFaq')}Answer")
            a_label.setWordWrap(True)
            a_label.setVisible(False)
            a_label.setStyleSheet("border: none; color: #B0B0B0; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 500;")

            faq_layout.addWidget(q_label)
            faq_layout.addWidget(a_label)
            body.addWidget(faq_item)

        body.addStretch()
        layout.addLayout(body, 1)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        self.hotline_label.setText(get_config_value(self.config, "support.hotline", "1900 1234"))
        self._expand(1)

    def _expand(self, active_index: int) -> None:
        for index, label in self.answers.items():
            label.setVisible(index == active_index)
