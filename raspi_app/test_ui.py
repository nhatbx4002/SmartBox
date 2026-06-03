"""
Test runner for SmartBox UI screens.
Usage: python test_ui.py [screen_name]
  python test_ui.py dashboard   - test Dashboard
  python test_ui.py header      - test Headers
  python test_ui.py footer      - test Footers
  python test_ui.py inlineerror - test InlineError
  python test_ui.py             - list available screens
"""

from __future__ import annotations

import os
import sys
from datetime import datetime
from pathlib import Path

from PySide6.QtCore import QTimer
from PySide6.QtUiTools import QUiLoader
from PySide6.QtWidgets import QApplication, QWidget

import resources_rc  # noqa: F401


def load_ui(ui_path: Path) -> QWidget:
    loader = QUiLoader()
    widget = loader.load(str(ui_path))
    if widget is None:
        raise RuntimeError(f"Could not load UI file: {ui_path}")
    return widget


def update_clock(label):
    if label:
        label.setText(datetime.now().strftime("%H:%M"))


def clock_timer(parent):
    if hasattr(parent, "lblClock"):
        update_clock(parent.lblClock)
        timer = QTimer(parent)
        timer.timeout.connect(lambda: update_clock(parent.lblClock))
        timer.start(1000)


def test_dashboard():
    ui_path = Path(__file__).parent / "ui" / "Dashboard.ui"
    if not ui_path.exists():
        print(f"File not found: {ui_path}")
        return None
    widget = load_ui(ui_path)
    widget.setFixedSize(720, 1280)
    clock_timer(widget)
    print("Dashboard.ui loaded")
    return widget


def test_header():
    ui_path = Path(__file__).parent / "ui" / "components" / "Headers.ui"
    if not ui_path.exists():
        print(f"File not found: {ui_path}")
        return None
    widget = load_ui(ui_path)
    widget.setFixedSize(720, 80)
    clock_timer(widget)
    print("Headers.ui loaded")
    return widget


def test_footer():
    ui_path = Path(__file__).parent / "ui" / "components" / "Footers.ui"
    if not ui_path.exists():
        print(f"File not found: {ui_path}")
        return None
    widget = load_ui(ui_path)
    widget.setFixedSize(720, 48)
    print("Footers.ui loaded")
    return widget


def test_inline_error():
    # Load OTP input screen as parent to show the inline banner in context
    parent_path = Path(__file__).parent / "ui" / "OTPInput.ui"
    if not parent_path.exists():
        print(f"File not found: {parent_path}")
        return None
    parent = load_ui(parent_path)
    parent.setFixedSize(720, 1152)

    # Import and instantiate InlineError banner inside the frameOtpCard
    from screens.inline_error import InlineError

    frame_otp = parent.findChild(QWidget, "frameOtpCard")
    if frame_otp:
        error_banner = InlineError(frame_otp)
        error_banner.setGeometry(28, 205, 600, 54)
        error_banner.show_error("Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng kiểm tra lại.")
        print("InlineError banner loaded inside OTPInput frame")
    else:
        print("frameOtpCard not found in OTPInput.ui")
    return parent



def test_error_dialog():
    # Load Dashboard as parent to demonstrate overlay behavior
    parent_path = Path(__file__).parent / "ui" / "Dashboard.ui"
    if not parent_path.exists():
        print(f"File not found: {parent_path}")
        return None
    parent = load_ui(parent_path)
    parent.setFixedSize(720, 1280)
    clock_timer(parent)

    # Import and instantiate ErrorDialog overlay
    from screens.error_dialog import ErrorDialog

    dialog = ErrorDialog(
        parent,
        retry_callback=lambda: print("[test_ui] Retry callback triggered!"),
        go_home_callback=lambda: print("[test_ui] Go Home callback triggered!"),
    )
    dialog.show_error(
        message="Không thể kết nối đến máy chủ thanh toán. Vui lòng kiểm tra lại kết nối mạng của thiết bị.",
        title="Lỗi Kết Nối",
        icon="❌",
    )
    print("ErrorDialog.ui loaded as overlay on Dashboard")
    return parent


def test_error_screen():
    ui_path = Path(__file__).parent / "ui" / "ErrorScreen.ui"
    if not ui_path.exists():
        print(f"File not found: {ui_path}")
        return None
    widget = load_ui(ui_path)
    widget.setFixedSize(720, 1280)
    print("ErrorScreen.ui loaded")
    return widget


def test_pickup_method():
    ui_path = Path(__file__).parent / "ui" / "PickupMethod.ui"
    if not ui_path.exists():
        print(f"File not found: {ui_path}")
        return None
    widget = load_ui(ui_path)
    widget.setFixedSize(720, 1280)
    print("PickupMethod.ui loaded")
    return widget


def test_qr_scan():
    ui_path = Path(__file__).parent / "ui" / "QRScan.ui"
    if not ui_path.exists():
        print(f"File not found: {ui_path}")
        return None
    widget = load_ui(ui_path)
    widget.setFixedSize(720, 1280)
    print("QRScan.ui loaded")
    return widget


def list_available_screens():
    ui_dir = Path(__file__).parent / "ui"
    screens = []
    for f in sorted(ui_dir.rglob("*.ui")):
        rel = f.relative_to(ui_dir.parent)
        screens.append(str(rel).replace(os.sep, "/"))
    return screens


def main():
    screen = sys.argv[1].lower() if len(sys.argv) > 1 else ""

    app = QApplication(sys.argv)
    app.setStyleSheet("""
        * {
            background-color: #0A0A0A;
            font-family: 'Be Vietnam Pro', 'Segoe UI', sans-serif;
        }
        QLabel, QPushButton, QFrame {
            background-color: transparent;
        }
    """)

    if screen == "dashboard":
        widget = test_dashboard()
    elif screen == "header":
        widget = test_header()
    elif screen == "footer":
        widget = test_footer()
    elif screen in {"inlineerror", "inline_error"}:
        widget = test_inline_error()
    elif screen in {"errordialog", "error_dialog", "dialog"}:
        widget = test_error_dialog()
    elif screen in {"errorscreen", "error_screen", "error"}:
        widget = test_error_screen()
    elif screen in {"pickupmethod", "pickup_method", "pickup"}:
        widget = test_pickup_method()
    elif screen in {"qrscan", "qr_scan", "qr"}:
        widget = test_qr_scan()
    else:
        screens = list_available_screens()
        print("Available screens:")
        for s in screens:
            print(f"  - {s}")
        print("\nUsage: python test_ui.py <screen_name>")
        print("  python test_ui.py dashboard")
        print("  python test_ui.py header")
        print("  python test_ui.py footer")
        print("  python test_ui.py inlineerror")
        print("  python test_ui.py errordialog")
        print("  python test_ui.py errorscreen")
        print("  python test_ui.py pickupmethod")
        print("  python test_ui.py qrscan")
        sys.exit(0)

    if widget:
        widget.show()
        sys.exit(app.exec())
    sys.exit(1)


if __name__ == "__main__":
    main()

