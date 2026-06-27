from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLabel, QVBoxLayout, QWidget

from screens.base import BaseController


class HomeController(BaseController):
    route = "/"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)
        self.set_clickable(self.child("SendCard"), self._deposit)
        self.set_clickable(self.child("ReceiveCard"), self._pickup)
        self.set_clickable(self.child("RentCard"), self._rent)
        self.set_clickable(self.child("SupportCard"), lambda: self.navigate("/support"))
        self._overlay: QWidget | None = None

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(720, 1280)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 48)
        layout.setSpacing(0)

        header = QFrame(root)
        header.setFixedHeight(160)
        header.setStyleSheet("background: transparent; border: none;")
        h_layout = QVBoxLayout(header)
        h_layout.setContentsMargins(24, 40, 24, 0)

        logo = QLabel("SmartBox", header)
        logo.setStyleSheet(
            "background: transparent; border: none; color: #E8E8E8;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 42px; font-weight: 900;"
        )
        tagline = QLabel("T\u1ee7 th\u00f4ng minh \u2013 G\u1eedi \u0111\u1ed3 ti\u1ec7n l\u1ee3i", header)
        tagline.setStyleSheet(
            "background: transparent; border: none; color: #888;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 16px; font-weight: 500;"
        )

        h_layout.addWidget(logo)
        h_layout.addWidget(tagline)
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(24, 16, 24, 0)
        body.setSpacing(16)

        cards = [
				("SendCard", "GỬI ĐỒ", "#FF6600", "Gửi đồ vào tủ an toàn"),
				("ReceiveCard", "NHẬN ĐỒ", "#1565C0", "Nhận đồ bằng mã PIN hoặc QR"),
				("RentCard", "THUÊ TỦ", "#2E7D32", "Thuê ngăn tủ theo nhu cầu"),
				("SupportCard", "HỖ TRỢ", "#1C1B1B", "Cần hỗ trợ? Gọi ngay", "#444"),
        ]

        for obj_name, label, bg, subtitle, *border_info in cards:
            card = QFrame(root)
            card.setObjectName(obj_name)
            card.setFixedHeight(200)
            card.setCursor(Qt.PointingHandCursor)
            border_color = border_info[0] if border_info else None
            border = f"border: 3px solid {border_color};" if border_color else ""
            card.setStyleSheet(
                f"QFrame#{obj_name} {{"
                f"  background-color: {bg};"
                f"  border-radius: 24px;"
                f"  {border}"
                f"}}"
                f"QLabel {{ background: transparent; }}"
            )

            c_layout = QVBoxLayout(card)
            c_layout.setContentsMargins(28, 24, 28, 24)

            title = QLabel(label, card)
            title.setStyleSheet(
                "background: transparent; border: none; color: white;"
                "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
                "font-size: 32px; font-weight: 900;"
            )

            sub = QLabel(subtitle, card)
            sub.setStyleSheet(
                "background: transparent; border: none; color: rgba(255,255,255,0.7);"
                "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
                "font-size: 16px; font-weight: 500;"
            )

            c_layout.addWidget(title)
            c_layout.addWidget(sub)
            c_layout.addStretch()
            body.addWidget(card)

        layout.addLayout(body)
        layout.addStretch()
        return root

    def on_enter(self, data: dict | None = None) -> None:
        self._check_not_configured()

    def on_exit(self) -> None:
        self._hide_overlay()

    def on_config_updated(self) -> None:
        self._check_not_configured()

    def _is_ready(self) -> bool:
        has_compartments = len(self.gpio_controller.pin_target_map) > 0
        cabinet_status = self.config.get("cabinet_status")
        return has_compartments and cabinet_status in ("ACTIVE", "OFFLINE")

    def _check_not_configured(self) -> None:
        if self._is_ready():
            self._hide_overlay()
        else:
            self._show_not_configured_overlay()

    def _show_not_configured_overlay(self) -> None:
        if self._overlay is not None:
            return

        cabinet_status = self.config.get("cabinet_status")
        if cabinet_status == "INACTIVE":
            overlay_title = "TỦ TẠM NGƯNG"
			overlay_msg = (
            "Tủ đang tạm ngưng hoạt động.\n"
            "Vui lòng liên hệ quản trị viên."
            )
             overlay_status = "Đang chờ kích hoạt lại..."
        else:
			overlay_title = "CHƯA CẤU HÌNH NGĂN"
			overlay_msg = (
                "Tủ đang trong giai đoạn cấu hình.\n"
                "Vui lòng liên hệ quản trị viên để thiết lập ngăn tủ."
            )
            overlay_status = "Đang đợi cấu hình từ quản trị viên..."

        overlay = QWidget(self.widget)
        overlay.setFixedSize(720, 1280)
        overlay.setStyleSheet("background-color: rgba(10, 10, 10, 0.97);")
        overlay.setAttribute(Qt.WA_TransparentForMouseEvents, False)

        card = QFrame(overlay)
        card.setFixedSize(600, 420)
        card.move((720 - 600) // 2, (1280 - 420) // 2)
        card.setStyleSheet(
            "background-color: #1C1C1B;"
            "border: 2px solid #FF6600;"
            "border-radius: 20px;"
        )

        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(32, 32, 32, 32)
        card_layout.setSpacing(16)
        card_layout.setAlignment(Qt.AlignCenter)

        icon_label = QLabel("\u2699\ufe0f", card)
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setStyleSheet("background: transparent; border: none; font-size: 64px;")
        card_layout.addWidget(icon_label)

        title = QLabel(overlay_title, card)
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet(
            "background: transparent; border: none; color: #FF6600;"
            "font-family: 'Be Vietnam Pro', 'Arial', sans-serif;"
            "font-size: 28px; font-weight: 900;"
        )
        card_layout.addWidget(title)

        msg = QLabel(overlay_msg, card)
        msg.setAlignment(Qt.AlignCenter)
        msg.setWordWrap(True)
        msg.setStyleSheet(
            "background: transparent; border: none; color: #B0B0B0;"
            "font-family: 'Be Vietnam Pro', 'Arial', sans-serif;"
            "font-size: 16px; font-weight: 500;"
        )
        card_layout.addWidget(msg)

        hotline_label = QLabel(
            f"Hotline: {self.config.get('support', {}).get('hotline', '1900 1234')}", card
        )
        hotline_label.setAlignment(Qt.AlignCenter)
        hotline_label.setStyleSheet(
            "background: transparent; border: none; color: #FFFFFF;"
            "font-family: 'Be Vietnam Pro', 'Arial', sans-serif;"
            "font-size: 15px; font-weight: 700;"
        )
        card_layout.addWidget(hotline_label)

        status_label = QLabel(overlay_status, card)
        status_label.setAlignment(Qt.AlignCenter)
        status_label.setStyleSheet(
            "background: transparent; border: none; color: #00FF41;"
            "font-family: 'Be Vietnam Pro', 'Arial', sans-serif;"
            "font-size: 13px; font-weight: 600;"
        )
        card_layout.addWidget(status_label)

        overlay.show()
        self._overlay = overlay

    def _hide_overlay(self) -> None:
        if self._overlay is not None:
            self._overlay.hide()
            self._overlay.deleteLater()
            self._overlay = None

    def _deposit(self) -> None:
        if not self._is_ready():
            return
        self.state.mode = "deposit"
        self.navigate("/pickup-method")

    def _pickup(self) -> None:
        if not self._is_ready():
            return
        self.state.mode = "pickup"
        self.navigate("/pickup-method")

    def _rent(self) -> None:
        if not self._is_ready():
            return
        self.state.mode = "rent"
        self.state.reset_rent_flow()
        self.navigate("/rent-size")
