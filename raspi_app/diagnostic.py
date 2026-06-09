import sys
import os

print("=== SmartBox Kiosk Camera Diagnostics ===")
print("Python version:", sys.version)

try:
    import picamera2
    print("[OK] picamera2 imported successfully")
except ImportError as e:
    print("[FAIL] picamera2 import failed:", e)

try:
    import cv2
    print("[OK] cv2 (OpenCV) imported successfully")
    try:
        detector = cv2.QRCodeDetector()
        print("[OK] cv2.QRCodeDetector created successfully")
    except Exception as e:
        print("[FAIL] cv2.QRCodeDetector creation failed:", e)
except ImportError as e:
    print("[FAIL] cv2 import failed:", e)

print("\n--- Testing Camera Initialization ---")
try:
    from picamera2 import Picamera2
    cam = Picamera2()
    print("[OK] Picamera2 instance created")
    
    # Test with exact configuration used in raspi_app
    try:
        cfg = cam.create_preview_configuration(
            main={
                "size": (640, 480),
                "format": "RGB888"
            }
        )
        cam.configure(cfg)
        print("[OK] Camera configured with format='RGB888'")
    except Exception as e:
        print("[FAIL] Camera configuration with format='RGB888' failed:", e)
        print("Retrying with default format (like your test script)...")
        try:
            cfg2 = cam.create_preview_configuration(
                main={"size": (640, 480)}
            )
            cam.configure(cfg2)
            print("[OK] Camera configured with default format successfully!")
        except Exception as e2:
            print("[FAIL] Camera configuration with default format also failed:", e2)

    try:
        cam.start()
        print("[OK] Camera started successfully")
        frame = cam.capture_array()
        print("[OK] Successfully captured a frame. Shape:", frame.shape)
        cam.stop()
        print("[OK] Camera stopped")
    except Exception as e:
        print("[FAIL] Camera start/capture failed:", e)
        
except Exception as e:
    print("[FAIL] Failed to instantiate/open camera:", e)
