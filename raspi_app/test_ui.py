"""
Test runner for SmartBox UI screens.
Usage: python test_ui.py [screen_name]
  python test_ui.py dashboard   - test Dashboard
  python test_ui.py header     - test Headers
  python test_ui.py footer     - test Footers
  python test_ui.py            - test all UI files
"""
import sys
import os
from pathlib import Path
from PySide6.QtWidgets import QApplication, QMainWindow, QWidget, QStackedWidget
from PySide6.QtUiTools import QUiLoader
from PySide6.QtCore import QTimer
from datetime import datetime


def load_ui(ui_path: Path) -> QWidget:
    loader = QUiLoader()
    return loader.load(ui_path)


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
        print(f"❌ File not found: {ui_path}")
        return None
    widget = load_ui(ui_path)
    widget.setFixedSize(720, 1280)
    clock_timer(widget)
    print(f"✅ Dashboard.ui loaded")
    return widget


def test_header():
    ui_path = Path(__file__).parent / "ui" / "components" / "Headers.ui"
    if not ui_path.exists():
        print(f"❌ File not found: {ui_path}")
        return None
    widget = load_ui(ui_path)
    widget.setFixedSize(720, 80)
    clock_timer(widget)
    print(f"✅ Headers.ui loaded")
    return widget


def test_footer():
    ui_path = Path(__file__).parent / "ui" / "components" / "Footers.ui"
    if not ui_path.exists():
        print(f"❌ File not found: {ui_path}")
        return None
    widget = load_ui(ui_path)
    widget.setFixedSize(720, 48)
    print(f"✅ Footers.ui loaded")
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
    else:
        # Test all — show stacked
        screens = list_available_screens()
        print("Available screens:")
        for s in screens:
            print(f"  - {s}")
        print("\nUsage: python test_ui.py <screen_name>")
        print("  python test_ui.py dashboard")
        print("  python test_ui.py header")
        print("  python test_ui.py footer")
        sys.exit(0)

    if widget:
        widget.show()
        sys.exit(app.exec())
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
