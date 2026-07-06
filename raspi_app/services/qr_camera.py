from __future__ import annotations

from dataclasses import dataclass

import cv2
from PySide6.QtGui import QImage


@dataclass
class QrScanFrame:
    image: QImage | None = None
    token: str | None = None
    error: str | None = None
    detected: bool = False
    frame_ok: bool = False


class QrCameraScanner:
    def __init__(
        self,
        size: tuple[int, int] = (1640, 1232),
        fps: int = 30,
        qr_every_n_frames: int = 3,
        stream_url: str | None = None,
        **kwargs,
    ):
        self.size = size
        self.fps = fps
        self.qr_every_n_frames = max(1, qr_every_n_frames)
        self.stream_url = stream_url
        self._camera = None
        self._detector = cv2.QRCodeDetector()
        self._error: str | None = None
        self._frame_count = 0

    def start(self) -> bool:
        if self._camera is not None:
            return True
        try:
            from picamera2 import Picamera2

            self._camera = Picamera2()
            config = self._camera.create_preview_configuration(
                main={"size": self.size, "format": "RGB888"},
                controls={"FrameRate": self.fps},
                buffer_count=4,
            )
            self._camera.configure(config)
            self._camera.start()
            self._error = None
            self._frame_count = 0
            return True
        except Exception as error:
            self._error = f"Không thể khởi động Pi Camera: {error}"
            self.stop()
            return False

    def capture(self) -> QrScanFrame:
        if self._error:
            return QrScanFrame(error=self._error)
        if self._camera is None:
            return QrScanFrame(error="Camera chưa sẵn sàng")

        try:
            frame = self._camera.capture_array()
            if frame is None:
                self._error = "Mất kết nối camera"
                return QrScanFrame(error=self._error)

            frame = self._normalize_frame(frame)
            image = self._to_qimage(frame)
            self._frame_count += 1

            if self._frame_count % self.qr_every_n_frames != 0:
                return QrScanFrame(image=image, frame_ok=True)

            token, detected = self._scan_qr(frame)
            return QrScanFrame(image=image, token=token, detected=detected, frame_ok=True)
        except Exception as error:
            self._error = f"Không thể đọc camera: {error}"
            return QrScanFrame(error=self._error)

    def stop(self) -> None:
        if self._camera is None:
            return
        try:
            self._camera.stop()
            self._camera.close()
        except Exception:
            pass
        self._camera = None

    def _scan_qr(self, frame) -> tuple[str | None, bool]:
        small = cv2.resize(frame, None, fx=0.5, fy=0.5)
        gray = cv2.cvtColor(small, cv2.COLOR_RGB2GRAY)
        token, points, _ = self._detector.detectAndDecode(gray)
        clean_token = token.strip() if token and token.strip() else None
        detected = points is not None
        return clean_token, detected

    def _normalize_frame(self, frame):
        if len(frame.shape) == 2:
            frame = cv2.cvtColor(frame, cv2.COLOR_GRAY2RGB)
        elif frame.shape[2] == 4:
            frame = cv2.cvtColor(frame, cv2.COLOR_RGBA2RGB)
        if not frame.flags["C_CONTIGUOUS"]:
            frame = frame.copy()
        return frame

    def _to_qimage(self, frame) -> QImage:
        height, width, channels = frame.shape
        bytes_per_line = channels * width
        return QImage(frame.data, width, height, bytes_per_line, QImage.Format_RGB888).copy()
