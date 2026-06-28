from __future__ import annotations

from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QFrame, QLabel, QPushButton, QVBoxLayout, QWidget

from screens.base import BaseController
from services.api_client import ApiError
from services.config_loader import get_config_value
from services.qr_camera import QrCameraScanner


class QRScanController(BaseController):
    route = "/qr-scan"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.preview_label = self.child("cameraPreview", QLabel)
        self.status_label = self.child("statusLabel", QLabel)
        self.hint_label = self.child("hintLabel", QLabel)
        self.retry_button = self.child("btnRetry", QPushButton)
        self.child("btnBack", QPushButton).clicked.connect(self.go_back)
        self.retry_button.clicked.connect(self._restart_camera)

        self.scanner = getattr(app, "qr_scanner", None) or QrCameraScanner()
        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._poll_camera)
        self.scan_interval_ms = int(get_config_value(self.config, "camera.scan_interval_ms", 40))
        self.processing = False
        self.last_token = ""
        self.frame_count = 0
        self.preview_label.setScaledContents(False)

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(720, 1280)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 48)
        layout.setSpacing(0)

        header = QFrame(root)
        header.setObjectName("headerFrame")
        header.setFixedHeight(96)
        header.setStyleSheet("QFrame#headerFrame { background-color: #0A0A0A; border: none; border-bottom: 1px solid #222; }")
        h = QHBoxLayout3(header, 20, 0, 24, 0)
        h.setSpacing(12)

        btn_back = QPushButton("\u2190", header)
        btn_back.setObjectName("btnBack")
        btn_back.setFixedSize(64, 64)
        btn_back.setCursor(Qt.PointingHandCursor)
        btn_back.setStyleSheet("QPushButton { background: transparent; border: none; color: #E8E8E8; font-size: 34px; font-weight: 700; } QPushButton:pressed { color: #FF6600; }")

        title = QLabel("QUÉT MÃ QR", header)
        title.setStyleSheet("background: transparent; border: none; color: #F5F5F5; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 28px; font-weight: 900;")

        h.addWidget(btn_back)
        h.addWidget(title)
        h.addStretch()
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(32, 32, 32, 0)
        body.setSpacing(18)

        preview_frame = QFrame(root)
        preview_frame.setFixedSize(656, 656)
        preview_frame.setStyleSheet(
            "QFrame { background-color: #111111; border: 2px solid #343434; border-radius: 28px; }"
        )
        p_layout = QVBoxLayout(preview_frame)
        p_layout.setContentsMargins(16, 16, 16, 16)
        p_layout.setAlignment(Qt.AlignCenter)

        self.lbl_preview = QLabel(preview_frame)
        self.lbl_preview.setObjectName("cameraPreview")
        self.lbl_preview.setAlignment(Qt.AlignCenter)
        self.lbl_preview.setWordWrap(True)
        self.lbl_preview.setStyleSheet(
            "background: transparent; border: none; color: #777; "
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 24px; font-weight: 700;"
        )
        self.lbl_preview.setFixedSize(624, 624)
        p_layout.addWidget(self.lbl_preview)
        body.addWidget(preview_frame, alignment=Qt.AlignCenter)

        info_card = QFrame(root)
        info_card.setObjectName("infoCard")
        info_card.setFixedHeight(130)
        info_card.setStyleSheet(
            "QFrame#infoCard { background-color: #101010; border: 1px solid #242424; border-radius: 22px; }"
        )
        info_layout = QVBoxLayout(info_card)
        info_layout.setContentsMargins(20, 18, 20, 18)
        info_layout.setSpacing(8)

        self.lbl_status = QLabel("Sẵn sàng quét QR", info_card)
        self.lbl_status.setObjectName("statusLabel")
        self.lbl_status.setAlignment(Qt.AlignCenter)
        self.lbl_status.setWordWrap(True)
        self.lbl_status.setStyleSheet("background: transparent; border: none; color: #00FF41; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 24px; font-weight: 900;")
        info_layout.addWidget(self.lbl_status)

        self.lbl_hint = QLabel("Đưa mã QR vào giữa khung quét", info_card)
        self.lbl_hint.setObjectName("hintLabel")
        self.lbl_hint.setAlignment(Qt.AlignCenter)
        self.lbl_hint.setWordWrap(True)
        self.lbl_hint.setStyleSheet("background: transparent; border: none; color: #9A9A9A; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 500;")
        info_layout.addWidget(self.lbl_hint)
        body.addWidget(info_card)

        body.addStretch()

        self.btn_retry = QPushButton("THỬ LẠI")
        self.btn_retry.setObjectName("btnRetry")
        self.btn_retry.setFixedHeight(96)
        self.btn_retry.setCursor(Qt.PointingHandCursor)
        self.btn_retry.setStyleSheet(
            "QPushButton { background-color: #FF6600; color: white; border: none; border-radius: 22px; "
            "font-size: 24px; font-weight: 900; font-family: 'Be Vietnam Pro', Arial, sans-serif; } "
            "QPushButton:pressed { background-color: #E65C00; }"
        )
        self.btn_retry.hide()
        body.addWidget(self.btn_retry)

        layout.addLayout(body)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        self.state.mode = "pickup"
        self.processing = False
        self.last_token = ""
        self.frame_count = 0
        self.preview_label.clear()
        self.preview_label.setText("")
        self.retry_button.hide()
        self.status_label.setText("Đang khởi động camera...")
        self.hint_label.setText("Đưa mã QR vào giữa khung quét")
        self._start_camera()

    def on_exit(self) -> None:
        self.timer.stop()
        self.scanner.stop()

    def _start_camera(self) -> None:
        if not self.scanner.start():
            self._show_camera_error("Không thể khởi động camera")
            return

        print(f"[qr_scan] camera ready, scanning at {self.scan_interval_ms}ms")
        self.status_label.setText("Sẵn sàng quét QR")
        self.retry_button.hide()
        self.timer.start(self.scan_interval_ms)

    def _restart_camera(self) -> None:
        self.timer.stop()
        self.scanner.stop()
        self.processing = False
        self.last_token = ""
        self._start_camera()

    def _poll_camera(self) -> None:
        if self.processing:
            return

        frame = self.scanner.capture()
        if frame.error:
            self._show_camera_error(frame.error)
            return

        if frame.image is not None:
            self.frame_count += 1
            if self.frame_count % 30 == 0:
                print(f"[qr_scan] streaming frames={self.frame_count}")
            pixmap = QPixmap.fromImage(frame.image).scaled(
                self.preview_label.size(),
                Qt.KeepAspectRatio,
                Qt.SmoothTransformation,
            )
            self.preview_label.setPixmap(pixmap)
            self.preview_label.repaint()

            if frame.detected and not frame.token:
                print("[qr_scan] QR DETECTED but NOT DECODED (move closer / steady / lighting)")
                self.status_label.setText("Đã thấy mã QR — giữ yên")
                self.hint_label.setText("Giữ mã QR gần hơn và đảm bảo đủ sáng")
            elif not frame.detected and not self.processing:
                self.status_label.setText("Sẵn sàng quét mã QR")
                self.hint_label.setText("Đặt mã QR vào giữa khung quét")

        if frame.token:
            print(f"[qr_scan] QR DECODED token='{frame.token}'")
            self._handle_scan(frame.token)

    def _handle_scan(self, token: str) -> None:
        if self.processing or token == self.last_token:
            return

        self.processing = True
        self.last_token = token
        self.timer.stop()
        self.status_label.setText("Đang xác minh mã QR...")
        print(f"[qr_scan] verifying token len={len(token)}")

        try:
            rental, compartment = self.api_client.verify_qr(token)
        except ApiError as error:
            print(f"[qr_scan] verify failed: {error.message}")
            self._show_scan_error(error.message)
            return
        except Exception as error:
            print(f"[qr_scan] verify failed: {error}")
            self._show_scan_error(str(error) or "Không thể xác minh mã QR. Vui lòng thử lại.")
            return

        print("[qr_scan] verified OK -> /locker-open")
        self.scanner.stop()
        self.state.mode = "pickup"
        self.state.rental_data = rental
        self.state.compartment_data = compartment
        self.navigate("/locker-open")

    def _show_camera_error(self, message: str) -> None:
        self.timer.stop()
        self.preview_label.clear()
        self.preview_label.setText("CAMERA\nCHƯA SẴN SÀNG")
        self.status_label.setText(message)
        self.hint_label.setText("Kiểm tra kết nối camera rồi thử lại")
        self.retry_button.show()

    def _show_scan_error(self, message: str) -> None:
        self.processing = False
        self.status_label.setText(message or "Mã QR không hợp lệ. Vui lòng thử lại.")
        self.hint_label.setText("Vui lòng đưa mã QR hợp lệ vào khung quét")
        self.retry_button.show()


def QHBoxLayout3(parent, left, top, right, bottom):
    from PySide6.QtWidgets import QHBoxLayout
    l = QHBoxLayout(parent)
    l.setContentsMargins(left, top, right, bottom)
    return l