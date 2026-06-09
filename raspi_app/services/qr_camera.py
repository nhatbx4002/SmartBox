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
    """QR scanner for Raspberry Pi Camera Module v1.3 via Picamera2."""

    def __init__(
        self,
        backend: str = "picamera2",
        size: tuple[int, int] = (640, 480),
        fps: int = 30,
        rotation_degrees: int = 0,
        camera_factory: Callable[[], Any] | None = None,
        detector_factory: Callable[[], Any] | None = None,
        cv2_module: Any | None = None,
    ):
        self.backend = backend.strip().lower()
        self.size = size
        self.fps = fps
        self.rotation_degrees = rotation_degrees
        self._camera_factory = camera_factory
        self._detector_factory = detector_factory
        self._cv2_module = cv2_module
        self._camera: Any | None = None
        self._detector: Any | None = None
        self._cv2: Any | None = None
        self._error: str | None = None

    def start(self) -> bool:
        if self._camera is not None and self._detector is not None:
            return True

        if self.backend != "picamera2":
            self._error = f"Unsupported camera backend: {self.backend}"
            return False

        try:
            cv2 = self._cv2_module
            if cv2 is None:
                import cv2 as cv2_module

                cv2 = cv2_module

            self._cv2 = cv2
            self._detector = self._detector_factory() if self._detector_factory else cv2.QRCodeDetector()
            if self._camera_factory is not None:
                self._camera = self._camera_factory()
                self._start_camera(self._camera)
            else:
                self._camera = self._create_picamera2()
            self._error = None
            return True
        except Exception as error:
            self._error = f"Khong the khoi dong camera Pi: {error}"
            self.stop()
            return False

    def capture(self) -> QrScanFrame:
        if self._error:
            return QrScanFrame(error=self._error)
        if self._camera is None or self._detector is None or self._cv2 is None:
            return QrScanFrame(error="Camera chua san sang")

        try:
            frame = self._camera.capture_array()
            token, _points, _straight = self._detector.detectAndDecode(frame)
            image = self._to_qimage(frame)
            return QrScanFrame(image=image, token=token.strip() or None)
        except Exception as error:
            self._error = f"Khong the doc camera Pi: {error}"
            return QrScanFrame(error=self._error)

    def stop(self) -> None:
        if self._camera is not None:
            for method_name in ("stop", "close"):
                try:
                    method = getattr(self._camera, method_name, None)
                    if callable(method):
                        method()
                        break
                except Exception:
                    pass

        self._camera = None
        self._detector = None
        self._cv2 = None

    def _create_picamera2(self) -> Any:
        from picamera2 import Picamera2

        camera = Picamera2()
        preview_config = camera.create_preview_configuration(
            main={
                "size": self.size,
                "format": "RGB888",
            }
        )
        camera.configure(preview_config)

        controls: dict[str, Any] = {}
        if self.fps > 0:
            controls["FrameRate"] = self.fps
        if self.rotation_degrees:
            controls["Rotation"] = self.rotation_degrees
        if controls:
            try:
                camera.set_controls(controls)
            except Exception:
                pass

        camera.start()
        return camera

    def _start_camera(self, camera: Any) -> None:
        starter = getattr(camera, "start", None)
        if callable(starter):
            starter()

    def _to_qimage(self, frame: Any) -> QImage:
        if not hasattr(frame, "shape"):
            raise TypeError("Camera frame does not expose shape metadata")

        height, width, channels = frame.shape
        if channels != 3:
            raise ValueError(f"Unsupported frame format: {channels} channels")

        bytes_per_line = self._bytes_per_line(frame, width, channels)
        buffer = self._frame_buffer(frame)
        return QImage(buffer, width, height, bytes_per_line, QImage.Format_RGB888).copy()

    def _frame_buffer(self, frame: Any) -> bytes:
        if hasattr(frame, "tobytes"):
            return frame.tobytes()
        if hasattr(frame, "data"):
            try:
                return bytes(frame.data)
            except Exception:
                pass
        return bytes(memoryview(frame))

    def _bytes_per_line(self, frame: Any, width: int, channels: int) -> int:
        strides = getattr(frame, "strides", None)
        if strides and len(strides) > 0 and strides[0]:
            return int(strides[0])
        return width * channels
