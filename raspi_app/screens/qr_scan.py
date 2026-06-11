from __future__ import annotations

from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController
from services.api_client import ApiError
from services.config_loader import get_config_value
from services.qr_camera import QrCameraScanner


class QRScanController(BaseController):
    route = "/qr-scan"

    def __init__(self, app):
        super().__init__(app, self.route, "QRScan.ui")
        self.preview_label = self.child("cameraPreview", QLabel)
        self.status_label = self.child("statusLabel", QLabel)
        self.hint_label = self.child("hintLabel", QLabel)
        self.retry_button = self.child("btnRetry", QPushButton)
        self.child("btnBack", QPushButton).clicked.connect(self.go_back)
        self.retry_button.clicked.connect(self._restart_camera)
        camera_stream_url = str(get_config_value(self.config, "camera.stream_url", "") or "").strip()
        camera_source = (
            camera_stream_url
            if camera_stream_url
            else int(get_config_value(self.config, "camera.device_index", 0))
        )
        self.scanner = getattr(app, "qr_scanner", None) or QrCameraScanner(
            stream_url=camera_source,
            backend=str(get_config_value(self.config, "camera.backend", "opencv")),
        )
        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._poll_camera)
        self.scan_interval_ms = int(get_config_value(self.config, "camera.scan_interval_ms", 120))
        self.processing = False
        self.last_token = ""
        self.frame_count = 0
        self.preview_label.setScaledContents(False)

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
            pixmap = QPixmap.fromImage(frame.image).scaled(
                self.preview_label.size(),
                Qt.KeepAspectRatio,
                Qt.SmoothTransformation,
            )
            self.preview_label.setPixmap(pixmap)
            self.preview_label.repaint()
            if self.frame_count == 1 or self.frame_count % 30 == 0:
                print(
                    f"[qr_scan] frame={self.frame_count} "
                    f"image={frame.image.width()}x{frame.image.height()} "
                    f"preview={self.preview_label.width()}x{self.preview_label.height()} "
                    f"pixmap={pixmap.width()}x{pixmap.height()} "
                    f"token={'yes' if frame.token else 'no'}"
                )

        if frame.token:
            self._handle_scan(frame.token)

    def _handle_scan(self, token: str) -> None:
        if self.processing or token == self.last_token:
            return

        self.processing = True
        self.last_token = token
        self.timer.stop()
        self.status_label.setText("Đang xác minh mã QR...")

        try:
            rental, compartment = self.api_client.verify_qr(token)
        except ApiError as error:
            self._show_scan_error(error.message)
            return
        except Exception as error:
            self._show_scan_error(str(error) or "Không thể xác minh mã QR")
            return

        self.scanner.stop()
        self.state.mode = "pickup"
        self.state.rental_data = rental
        self.state.compartment_data = compartment
        self.navigate("/locker-open")

    def _show_camera_error(self, message: str) -> None:
        self.timer.stop()
        self.status_label.setText(message)
        self.hint_label.setText("Kiểm tra Raspberry Pi Camera Rev 1.3 rồi thử lại")
        self.retry_button.show()

    def _show_scan_error(self, message: str) -> None:
        self.processing = False
        self.status_label.setText(message or "Mã QR không hợp lệ")
        self.hint_label.setText("Vui lòng đưa mã QR hợp lệ vào camera")
        self.retry_button.show()
