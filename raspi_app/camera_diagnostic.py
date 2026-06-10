from __future__ import annotations

import argparse
import sys
import time
import traceback
from pathlib import Path

from services.config_loader import get_config_value, load_config


def _resolve_camera_settings(
    backend_override: str | None,
    url_override: str | None,
    device_override: int | None,
) -> tuple[str, str | int, tuple[int, int]]:
    config = load_config()
    backend = str(backend_override or get_config_value(config, "camera.backend", "opencv")).strip()
    width = int(get_config_value(config, "camera.preview_width", 640))
    height = int(get_config_value(config, "camera.preview_height", 480))

    if url_override:
        return "opencv", url_override.strip(), (width, height)
    if device_override is not None:
        return "opencv", device_override, (width, height)

    stream_url = str(get_config_value(config, "camera.stream_url", "") or "").strip()
    if stream_url:
        return "opencv", stream_url, (width, height)
    if backend == "picamera2":
        return backend, "", (width, height)
    return backend, int(get_config_value(config, "camera.device_index", 0)), (width, height)


def _describe_capture(capture) -> None:
    backend_name = None
    try:
        backend_name = capture.getBackendName()
    except Exception:
        backend_name = None

    print(f"[camera] opened={capture.isOpened()}")
    if backend_name:
        print(f"[camera] backend={backend_name}")

    try:
        print(f"[camera] width={int(capture.get(3))} height={int(capture.get(4))} fps={capture.get(5)}")
    except Exception:
        pass


def _open_picamera2(size: tuple[int, int]):
    try:
        from picamera2 import Picamera2
    except Exception:
        print("[camera] ERROR: failed to import Picamera2")
        print("[camera] Install/check with: sudo apt install python3-picamera2 && libcamera-hello")
        traceback.print_exc()
        return None

    camera = Picamera2()
    config = camera.create_preview_configuration(
        main={
            "size": size,
            "format": "RGB888",
        }
    )
    camera.configure(config)
    camera.start()
    print(f"[camera] picamera2 started size={size[0]}x{size[1]}")
    return camera


def main() -> int:
    parser = argparse.ArgumentParser(description="Diagnose SmartBox camera stream and QR decoding.")
    parser.add_argument("--backend", choices=["picamera2", "opencv"], help="Camera backend. Defaults to config.yaml camera.backend.")
    parser.add_argument("--url", help="Override camera stream URL. Defaults to config.yaml camera.stream_url.")
    parser.add_argument("--device", type=int, help="Use a local camera device index, e.g. 0 for /dev/video0.")
    parser.add_argument("--frames", type=int, default=30, help="Number of frames to test before exiting.")
    parser.add_argument("--delay-ms", type=int, default=100, help="Delay between frames.")
    parser.add_argument("--save-frame", default="", help="Optional path to save the last captured frame.")
    args = parser.parse_args()

    print("[camera] loading camera config...")
    backend, camera_source, size = _resolve_camera_settings(args.backend, args.url, args.device)
    if camera_source == "" and backend != "picamera2":
        print("[camera] ERROR: camera.stream_url is empty and camera.device_index is not set.")
        return 2

    print(f"[camera] backend={backend} source={camera_source!r}")

    cv2 = None
    try:
        import cv2
    except Exception:
        print("[camera] ERROR: failed to import cv2")
        traceback.print_exc()
        return 3

    try:
        detector = cv2.QRCodeDetector()
    except Exception:
        print("[camera] ERROR: failed to create QRCodeDetector")
        traceback.print_exc()
        return 4

    capture = None
    last_frame = None
    try:
        if backend == "picamera2":
            print("[camera] opening Picamera2...")
            capture = _open_picamera2(size)
        else:
            print("[camera] opening VideoCapture...")
            capture = cv2.VideoCapture(camera_source)
        if capture is None:
            print("[camera] ERROR: camera open returned None")
            return 5

        if backend != "picamera2":
            _describe_capture(capture)
            if not capture.isOpened():
                print("[camera] ERROR: stream did not open")
                return 6

        for index in range(1, args.frames + 1):
            if backend == "picamera2":
                frame = capture.capture_array()
                ok = frame is not None
            else:
                ok, frame = capture.read()
            if not ok or frame is None:
                print(f"[camera] frame={index}: ERROR: read() failed")
                time.sleep(args.delay_ms / 1000)
                continue

            last_frame = frame
            try:
                token, points, _straight = detector.detectAndDecode(frame)
            except Exception:
                print(f"[camera] frame={index}: ERROR: detectAndDecode failed")
                traceback.print_exc()
                continue

            status = "QR_FOUND" if token else "NO_QR"
            print(f"[camera] frame={index}: OK status={status} token={token!r} points={'yes' if points is not None and len(points) else 'no'}")
            time.sleep(args.delay_ms / 1000)

        if args.save_frame and last_frame is not None:
            output_path = Path(args.save_frame).expanduser().resolve()
            output_path.parent.mkdir(parents=True, exist_ok=True)
            frame_to_save = last_frame
            if backend == "picamera2":
                frame_to_save = cv2.cvtColor(last_frame, cv2.COLOR_RGB2BGR)
            if cv2.imwrite(str(output_path), frame_to_save):
                print(f"[camera] saved_last_frame={output_path}")
            else:
                print(f"[camera] WARNING: failed to save frame to {output_path}")

        return 0
    except Exception:
        print("[camera] ERROR: unexpected failure")
        traceback.print_exc()
        return 10
    finally:
        if capture is not None:
            try:
                if hasattr(capture, "release"):
                    capture.release()
                elif hasattr(capture, "close"):
                    capture.close()
            except Exception:
                pass
        if cv2 is not None:
            try:
                cv2.destroyAllWindows()
            except Exception:
                pass


if __name__ == "__main__":
    raise SystemExit(main())
