from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable

from PySide6.QtGui import QImage


@dataclass
class QrScanFrame:
    image: QImage | None = None
    token: str | None = None
    error: str | None = None


class QrCameraScanner:
    """QR scanner for a Raspberry Pi camera, local camera device, or IP stream."""

    def __init__(
        self,
        stream_url: str | int = "",
        size: tuple[int, int] = (640, 480),
        backend: str = "opencv",
        camera_factory: Callable[[], Any] | None = None,
        capture_factory: Callable[[str], Any] | None = None,
        detector_factory: Callable[[], Any] | None = None,
        cv2_module: Any | None = None,
    ):
        self.stream_url = stream_url.strip() if isinstance(stream_url, str) else stream_url
        self.size = size
        self.backend = backend
        self._camera_factory = camera_factory
        self._capture_factory = capture_factory
        self._detector_factory = detector_factory
        self._cv2_module = cv2_module
        self._capture: Any | None = None
        self._detector: Any | None = None
        self._cv2: Any | None = None
        self._error: str | None = None
        self._frames_are_rgb = False

    def start(self) -> bool:
        if self._capture is not None and self._detector is not None:
            return True

        if (
            self.stream_url == ""
            and self.backend != "picamera2"
            and self._camera_factory is None
            and self._capture_factory is None
        ):
            self._error = "Chua cau hinh camera.stream_url hoac camera.device_index"
            return False

        try:
            cv2 = self._cv2_module
            if cv2 is None:
                import cv2 as cv2_module

                cv2 = cv2_module

            self._cv2 = cv2
            self._detector = self._detector_factory() if self._detector_factory else cv2.QRCodeDetector()
            if self._camera_factory is not None:
                self._capture = self._camera_factory()
                start = getattr(self._capture, "start", None)
                if callable(start):
                    start()
            elif self.backend == "picamera2":
                self._capture = self._create_picamera2()
                self._frames_are_rgb = True
            elif self._capture_factory is not None:
                self._capture = self._capture_factory(self.stream_url)
            else:
                self._capture = cv2.VideoCapture(self.stream_url)
            if hasattr(self._capture, "isOpened") and not self._capture.isOpened():
                raise RuntimeError(f"Khong the mo stream camera: {self.stream_url}")
            self._error = None
            return True
        except Exception as error:
            self._error = f"Khong the khoi dong stream camera: {error}"
            self.stop()
            return False

    def capture(self) -> QrScanFrame:
        if self._error:
            return QrScanFrame(error=self._error)
        if self._capture is None or self._detector is None or self._cv2 is None:
            return QrScanFrame(error="Camera stream chua san sang")

        try:
            if hasattr(self._capture, "read"):
                ok, frame = self._capture.read()
            elif hasattr(self._capture, "capture_array"):
                frame = self._capture.capture_array()
                ok = frame is not None
            else:
                raise RuntimeError("Capture backend does not support read or capture_array")
            if not ok or frame is None:
                self._error = "Mat ket noi stream camera"
                return QrScanFrame(error=self._error)

            token, _points, _straight = self._detector.detectAndDecode(frame)
            image = self._to_qimage(frame)
            return QrScanFrame(image=image, token=token.strip() or None)
        except Exception as error:
            self._error = f"Khong the doc stream camera: {error}"
            return QrScanFrame(error=self._error)

    def stop(self) -> None:
        if self._capture is not None:
            try:
                release = getattr(self._capture, "release", None)
                if callable(release):
                    release()
                else:
                    close = getattr(self._capture, "close", None)
                    if callable(close):
                        close()
            except Exception:
                pass

        self._capture = None
        self._detector = None
        self._cv2 = None
        self._frames_are_rgb = False

    def _to_qimage(self, frame: Any) -> QImage:
        if self._frames_are_rgb:
            rgb_frame = frame
            flags = getattr(rgb_frame, "flags", None)
            if flags is not None and not getattr(flags, "c_contiguous", True):
                rgb_frame = rgb_frame.copy()
            height, width, channels = rgb_frame.shape
            bytes_per_line = channels * width
            return QImage(rgb_frame.data, width, height, bytes_per_line, QImage.Format_RGB888).copy()

        rgb_frame = self._cv2.cvtColor(frame, self._cv2.COLOR_BGR2RGB)
        flags = getattr(rgb_frame, "flags", None)
        if flags is not None and not getattr(flags, "c_contiguous", True):
            rgb_frame = rgb_frame.copy()

        height, width, channels = rgb_frame.shape
        bytes_per_line = channels * width
        return QImage(rgb_frame.data, width, height, bytes_per_line, QImage.Format_RGB888).copy()

    def _create_picamera2(self) -> Any:
        try:
            from picamera2 import Picamera2
        except Exception as error:
            raise RuntimeError("Picamera2 chua duoc cai dat. Cai bang: sudo apt install python3-picamera2") from error

        camera = Picamera2()
        config = camera.create_preview_configuration(
            main={
                "size": self.size,
                "format": "RGB888",
            }
        )
        camera.configure(config)
        camera.start()
        return camera
