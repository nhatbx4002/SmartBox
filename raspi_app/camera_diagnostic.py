from __future__ import annotations

import argparse
import sys
import time
import traceback
from pathlib import Path

from services.config_loader import get_config_value, load_config


def _resolve_stream_url(override: str | None) -> str:
    if override:
        return override.strip()

    config = load_config()
    return str(get_config_value(config, "camera.stream_url", "")).strip()


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


def main() -> int:
    parser = argparse.ArgumentParser(description="Diagnose SmartBox camera stream and QR decoding.")
    parser.add_argument("--url", help="Override camera stream URL. Defaults to config.yaml camera.stream_url.")
    parser.add_argument("--frames", type=int, default=30, help="Number of frames to test before exiting.")
    parser.add_argument("--delay-ms", type=int, default=100, help="Delay between frames.")
    parser.add_argument("--save-frame", default="", help="Optional path to save the last captured frame.")
    args = parser.parse_args()

    print("[camera] loading stream url...")
    stream_url = _resolve_stream_url(args.url)
    if not stream_url:
        print("[camera] ERROR: camera.stream_url is empty. Pass --url or set config.yaml.")
        return 2

    print(f"[camera] stream_url={stream_url}")

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
        print("[camera] opening VideoCapture...")
        capture = cv2.VideoCapture(stream_url)
        if capture is None:
            print("[camera] ERROR: VideoCapture returned None")
            return 5

        _describe_capture(capture)
        if not capture.isOpened():
            print("[camera] ERROR: stream did not open")
            return 6

        for index in range(1, args.frames + 1):
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
            if cv2.imwrite(str(output_path), last_frame):
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
                capture.release()
            except Exception:
                pass
        if cv2 is not None:
            try:
                cv2.destroyAllWindows()
            except Exception:
                pass


if __name__ == "__main__":
    raise SystemExit(main())
