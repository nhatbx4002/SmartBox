from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLabel, QVBoxLayout, QWidget

from screens.base import BaseController


class HomeController(BaseController):
    route = "/"

    def __init__(self, app):
        super().__init__(app, self.route, "Dashboard.ui")
        self.set_clickable(self.child("SendCard"), self._deposit)
        self.set_clickable(self.child("ReceiveCard"), self._pickup)
        self.set_clickable(self.child("RentCard"), self._rent)
        self.set_clickable(self.child("SupportCard"), lambda: self.navigate("/support"))
        self._overlay: QWidget | None = None

    def on_enter(self, data: dict | None = None) -> None:
        self._check_not_configured()

    def on_exit(self) -> None:
        self._hide_overlay()

    def on_config_updated(self) -> None:
        self._check_not_configured()

    def _is_ready(self) -> bool:
        has_compartments = len(self.gpio_controller.pin_target_map) > 0
        cabinet_status = self.config.get("cabinet_status")
        # ponytail: OFFLINE is transient at boot (self-heals to ACTIVE on first heartbeat)
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
        overlay.setFixedSize(720, 1280)
        overlay.setStyleSheet(
            "background-color: rgba(10, 10, 10, 0.97);"
        )
        overlay.setAttribute(Qt.WA_TransparentForMouseEvents, False)

        card = QFrame(overlay)
        card.setFixedSize(600, 420)
        card.move(
            (720 - 600) // 2,
            (1280 - 420) // 2,
        )
        card.setStyleSheet(
            "background-color: #1C1C1B;"
            "border: 2px solid #FF6600;"
            "border-radius: 20px;"
        )

        layout = QVBoxLayout(card)
        layout.setContentsMargins(32, 32, 32, 32)
        layout.setSpacing(16)
        layout.setAlignment(Qt.AlignCenter)

        icon_label = QLabel("⚙️", card)
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setStyleSheet(
            "background-color: transparent; border: none;"
            "font-size: 64px;"
        )
        layout.addWidget(icon_label)

        title = QLabel(overlay_title, card)
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet(
            "background-color: transparent; border: none;"
            "color: #FF6600;"
            "font-family: 'Be Vietnam Pro', 'Arial', sans-serif;"
            "font-size: 28px; font-weight: 900;"
        )
        layout.addWidget(title)

        msg = QLabel(overlay_msg, card)
        msg.setAlignment(Qt.AlignCenter)
        msg.setWordWrap(True)
        msg.setStyleSheet(
            "background-color: transparent; border: none;"
            "color: #B0B0B0;"
            "font-family: 'Be Vietnam Pro', 'Arial', sans-serif;"
            "font-size: 16px; font-weight: 500;"
        )
        layout.addWidget(msg)

        hotline_label = QLabel(
            f"Hotline: {self.config.get('support', {}).get('hotline', '1900 1234')}", card
        )
        hotline_label.setAlignment(Qt.AlignCenter)
        hotline_label.setStyleSheet(
            "background-color: transparent; border: none;"
            "color: #FFFFFF;"
            "font-family: 'Be Vietnam Pro', 'Arial', sans-serif;"
            "font-size: 15px; font-weight: 700;"
        )
        layout.addWidget(hotline_label)

        status_label = QLabel(overlay_status, card)
        status_label.setAlignment(Qt.AlignCenter)
        status_label.setStyleSheet(
            "background-color: transparent; border: none;"
            "color: #00FF41;"
            "font-family: 'Be Vietnam Pro', 'Arial', sans-serif;"
            "font-size: 13px; font-weight: 600;"
        )
        layout.addWidget(status_label)

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
