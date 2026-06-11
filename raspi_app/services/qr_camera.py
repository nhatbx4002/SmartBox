from __future__ import annotations

import cv2
from dataclasses import dataclass
from PySide6.QtGui import QImage


@dataclass
class QrScanFrame:
    image: QImage | None = None
    token: str | None = None
    error: str | None = None


class QrCameraScanner:
    """QR scanner specifically for Raspberry Pi Camera Module using picamera2."""

    def __init__(self, size: tuple[int, int] = (640, 480), **kwargs):
        self.size = size
        self._camera = None
        self._detector = None
        self._error: str | None = None

    def start(self) -> bool:
        if self._camera is not None:
            return True

        try:
            from picamera2 import Picamera2
        except ImportError as error:
            self._error = f"Không thể import picamera2: {error}"
            return False

        try:
            self._detector = cv2.QRCodeDetector()
            self._camera = Picamera2()
            config = self._camera.create_preview_configuration(
                main={
                    "size": self.size,
                    "format": "RGB888",
                }
            )
            self._camera.configure(config)
            self._camera.start()
            self._error = None
            return True
        except Exception as error:
            self._error = f"Không thể khởi động Pi Camera: {error}"
            self.stop()
            return False

    def capture(self) -> QrScanFrame:
        if self._error:
            return QrScanFrame(error=self._error)
        if self._camera is None or self._detector is None:
            return QrScanFrame(error="Camera chưa sẵn sàng")

        try:
            frame = self._camera.capture_array()
            if frame is None:
                self._error = "Mất kết nối camera"
                return QrScanFrame(error=self._error)

            gray_frame = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
            token, _points, _straight = self._detector.detectAndDecode(gray_frame)

            if getattr(frame, "flags", None) is not None and not getattr(frame.flags, "C_CONTIGUOUS", True):
                frame = frame.copy()

            height, width, channels = frame.shape
            bytes_per_line = channels * width
            image = QImage(frame.data, width, height, bytes_per_line, QImage.Format_RGB888).copy()

            return QrScanFrame(image=image, token=token.strip() if isinstance(token, str) else None)
        except Exception as error:
            self._error = f"Không thể đọc camera: {error}"
            return QrScanFrame(error=self._error)

    def stop(self) -> None:
        if self._camera is not None:
            try:
                self._camera.stop()
                self._camera.close()
            except Exception:
                pass
        self._camera = None
        self._detector = None
