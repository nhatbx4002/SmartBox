from __future__ import annotations

from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QFrame, QLabel, QPushButton, QVBoxLayout, QWidget
from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style

from screens.base import BaseController
from screens.components.header_bar import HeaderBar
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
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 48)
        layout.setSpacing(0)

        header = HeaderBar(
            "THANH TOÁN",
            on_back=lambda: self.go_back,
            parent=root,
            back_object_name="btnBack",
        )
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(24, 24, 24, 0)
        body.setSpacing(12)

        preview_frame = QFrame(root)
        preview_frame.setFixedSize(672, 480)
        preview_frame.setStyleSheet("QFrame { background-color: #111; border: 2px solid #333; border-radius: 20px; }")
        p_layout = QVBoxLayout(preview_frame)
        p_layout.setAlignment(Qt.AlignCenter)

        self.lbl_preview = QLabel(preview_frame)
        self.lbl_preview.setObjectName("cameraPreview")
        self.lbl_preview.setAlignment(Qt.AlignCenter)
        self.lbl_preview.setStyleSheet("background: transparent; border: none;")
        self.lbl_preview.setFixedSize(640, 440)
        p_layout.addWidget(self.lbl_preview)
        body.addWidget(preview_frame, alignment=Qt.AlignCenter)

        self.lbl_status = QLabel("S\u1eb5n s\u00e0ng qu\u00e9t QR", root)
        self.lbl_status.setObjectName("statusLabel")
        self.lbl_status.setAlignment(Qt.AlignCenter)
        self.lbl_status.setStyleSheet("background: transparent; border: none; color: #00FF41; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 22px; font-weight: 700;")
        body.addWidget(self.lbl_status)

        self.lbl_hint = QLabel("Đưa mã QR vào giữa khung quét", root)
        self.lbl_hint.setObjectName("hintLabel")
        self.lbl_hint.setAlignment(Qt.AlignCenter)
        self.lbl_hint.setStyleSheet("background: transparent; border: none; color: #888; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 500;")
        body.addWidget(self.lbl_hint)

        self.btn_retry = QPushButton("THỬ LẠI")
        self.btn_retry.setObjectName("btnRetry")
        self.btn_retry.setFixedHeight(96)
        self.btn_retry.setCursor(Qt.PointingHandCursor)
        self.btn_retry.setStyleSheet(
            "QPushButton { background-color: #FF6600; color: white; border: none; border-radius: 18px; font-size: 22px; font-weight: 800; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
        )
        self.btn_retry.hide()
        body.addWidget(self.btn_retry)

        body.addStretch()
        layout.addLayout(body)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        self.state.mode = "pickup"
        self.processing = False
        self.last_token = ""
        self.frame_count = 0
        self.preview_label.clear()
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
