from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLabel, QSizePolicy, QVBoxLayout, QWidget

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
        root.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        header = QFrame(root)
        header.setFixedHeight(118)
        header.setStyleSheet("background: transparent; border: none;")

        h_layout = QVBoxLayout(header)
        h_layout.setContentsMargins(18, 24, 18, 0)
        h_layout.setSpacing(4)

        logo = QLabel("OmniBox", header)
        logo.setStyleSheet(
            "background: transparent; border: none; color: #E8E8E8;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 36px; font-weight: 900;"
        )

        tagline = QLabel("Tủ thông minh – Gửi đồ tiện lợi", header)
        tagline.setStyleSheet(
            "background: transparent; border: none; color: #888;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 14px; font-weight: 500;"
        )

        h_layout.addWidget(logo)
        h_layout.addWidget(tagline)
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(18, 10, 18, 56)
        body.setSpacing(10)

        cards = [
            ("SendCard", "GỬI ĐỒ", "#FF6600", "Gửi đồ vào tủ an toàn"),
            ("ReceiveCard", "NHẬN ĐỒ", "#1565C0", "Nhận đồ bằng mã PIN hoặc QR"),
            ("RentCard", "THUÊ TỦ", "#2E7D32", "Thuê ngăn tủ theo nhu cầu"),
            ("SupportCard", "HỖ TRỢ", "#1C1B1B", "Cần hỗ trợ? Gọi ngay", "#444"),
        ]

        for obj_name, label, bg, subtitle, *border_info in cards:
            card = QFrame(root)
            card.setObjectName(obj_name)
            card.setMinimumHeight(105)
            card.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
            card.setCursor(Qt.PointingHandCursor)

            border_color = border_info[0] if border_info else None
            border = f"border: 2px solid {border_color};" if border_color else ""

            card.setStyleSheet(
                f"QFrame#{obj_name} {{"
                f"  background-color: {bg};"
                f"  border-radius: 18px;"
                f"  {border}"
                f"}}"
                f"QLabel {{ background: transparent; }}"
            )

            c_layout = QVBoxLayout(card)
            c_layout.setContentsMargins(18, 12, 18, 12)
            c_layout.setSpacing(6)

            title = QLabel(label, card)
            title.setAlignment(Qt.AlignCenter)
            title.setStyleSheet(
                "background: transparent; border: none; color: white;"
                "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
                "font-size: 44px; font-weight: 900;"
            )

            sub = QLabel(subtitle, card)
            sub.setAlignment(Qt.AlignCenter)
            sub.setStyleSheet(
                "background: transparent; border: none; color: rgba(255,255,255,0.72);"
                "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
                "font-size: 17px; font-weight: 500;"
            )

            c_layout.addStretch(1)
            c_layout.addWidget(title)
            c_layout.addWidget(sub)
            c_layout.addStretch(1)

            body.addWidget(card, 1)

        layout.addLayout(body, 1)

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
            overlay_msg = "Tủ đang tạm ngưng hoạt động.\nVui lòng liên hệ quản trị viên."
            overlay_status = "Đang chờ kích hoạt lại..."
        else:
            overlay_title = "CHƯA CẤU HÌNH NGĂN"
            overlay_msg = "Tủ đang trong giai đoạn cấu hình.\nVui lòng liên hệ quản trị viên để thiết lập ngăn tủ."
            overlay_status = "Đang đợi cấu hình từ quản trị viên..."

        overlay = QWidget(self.widget)
        overlay.setGeometry(self.widget.rect())
        overlay.setStyleSheet("background-color: rgba(10, 10, 10, 0.97);")
        overlay.setAttribute(Qt.WA_TransparentForMouseEvents, False)

        overlay_width = self.widget.width()
        overlay_height = self.widget.height()

        card_width = min(600, int(overlay_width * 0.86))
        card_height = min(420, int(overlay_height * 0.55))

        card = QFrame(overlay)
        card.setFixedSize(card_width, card_height)
        card.move(
            (overlay_width - card_width) // 2,
            (overlay_height - card_height) // 2,
        )
        card.setStyleSheet(
            "background-color: #1C1C1B;"
            "border: 2px solid #FF6600;"
            "border-radius: 20px;"
        )

        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(32, 32, 32, 32)
        card_layout.setSpacing(16)
        card_layout.setAlignment(Qt.AlignCenter)

        icon_label = QLabel("⚙️", card)
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
        self.navigate("/rent-size", data={"reset": True})
