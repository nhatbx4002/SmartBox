from __future__ import annotations

# ============================================================
# Kiosk screen
# ============================================================

SCREEN_WIDTH = 720
SCREEN_HEIGHT = 1280

# ============================================================
# Colors
# ============================================================

COLOR_BG = "#0A0A0A"
COLOR_SURFACE = "#111111"
COLOR_CARD = "#1C1B1B"
COLOR_CARD_DARK = "#101010"
COLOR_BORDER = "#2A2A2A"
COLOR_BORDER_SOFT = "#222222"

COLOR_PRIMARY = "#FF6600"
COLOR_PRIMARY_PRESSED = "#E65C00"

COLOR_SUCCESS = "#2E7D32"
COLOR_SUCCESS_PRESSED = "#256428"

COLOR_BLUE = "#1565C0"

COLOR_TEXT = "#E8E8E8"
COLOR_TEXT_BRIGHT = "#F5F5F5"
COLOR_TEXT_WHITE = "#FFFFFF"
COLOR_MUTED = "#888888"
COLOR_MUTED_LIGHT = "#A0A0A0"
COLOR_DISABLED_BG = "#333333"
COLOR_DISABLED_TEXT = "#777777"

COLOR_ONLINE = "#00FF41"
COLOR_ERROR = "#FF3B30"

# ============================================================
# Fonts
# ============================================================

FONT_FAMILY = "'Be Vietnam Pro', Arial, sans-serif"

FONT_HEADER_TITLE = 28
FONT_PAGE_TITLE = 32
FONT_CARD_TITLE = 32
FONT_CARD_SUBTITLE = 20
FONT_BUTTON = 26
FONT_AMOUNT = 80
FONT_QR_AMOUNT = 44
FONT_HINT = 18
FONT_FOOTER = 12

# ============================================================
# Layout sizes
# ============================================================

HEADER_HEIGHT = 96
HEADER_HEIGHT_COMPACT = 80

BACK_BUTTON_SIZE = 64
BACK_BUTTON_SIZE_COMPACT = 60

BUTTON_HEIGHT = 96
BUTTON_RADIUS = 24

CARD_RADIUS = 24
CARD_RADIUS_LARGE = 28
CARD_BORDER_WIDTH = 2
SELECTED_BORDER_WIDTH = 3

PAGE_MARGIN_X = 32
PAGE_MARGIN_X_COMPACT = 24

FOOTER_HEIGHT = 48
BOTTOM_SAFE_SPACING = 68

BOTTOM_ACTION_HEIGHT = 180
BOTTOM_ACTION_PADDING_TOP = 12
BOTTOM_ACTION_PADDING_BOTTOM = 56

# ============================================================
# Common styles
# ============================================================

def font_css(size: int, weight: int | str = 700) -> str:
    return (
        f"font-family: {FONT_FAMILY};"
        f"font-size: {size}px;"
        f"font-weight: {weight};"
    )


def root_style() -> str:
    return f"background-color: {COLOR_BG};"


def transparent_label_style(
    *,
    color: str = COLOR_TEXT,
    size: int = 20,
    weight: int | str = 700,
) -> str:
    return (
        "background: transparent;"
        "border: none;"
        f"color: {color};"
        f"{font_css(size, weight)}"
    )


def header_frame_style() -> str:
    return (
        "QFrame#headerFrame {"
        f"background-color: {COLOR_BG};"
        "border: none;"
        f"border-bottom: 1px solid {COLOR_BORDER_SOFT};"
        "}"
    )


def back_button_style() -> str:
    return (
        "QPushButton {"
        "background: transparent;"
        "border: none;"
        f"color: {COLOR_TEXT};"
        "font-size: 34px;"
        "font-weight: 700;"
        "}"
        "QPushButton:pressed {"
        f"color: {COLOR_PRIMARY};"
        "}"
    )


def primary_button_style(
    *,
    bg: str = COLOR_PRIMARY,
    pressed_bg: str = COLOR_PRIMARY_PRESSED,
    radius: int = BUTTON_RADIUS,
    font_size: int = FONT_BUTTON,
) -> str:
    return (
        "QPushButton {"
        f"background-color: {bg};"
        f"color: {COLOR_TEXT_WHITE};"
        "border: none;"
        f"border-radius: {radius}px;"
        f"{font_css(font_size, 900)}"
        "}"
        "QPushButton:pressed:enabled {"
        f"background-color: {pressed_bg};"
        "}"
        "QPushButton:disabled {"
        f"background-color: {COLOR_DISABLED_BG};"
        f"color: {COLOR_DISABLED_TEXT};"
        "}"
    )


def card_style(
    *,
    bg: str = COLOR_SURFACE,
    border: str = COLOR_BORDER,
    radius: int = CARD_RADIUS,
    border_width: int = SELECTED_BORDER_WIDTH,
) -> str:
    return (
        "QFrame {"
        f"background-color: {bg};"
        f"border: {border_width}px solid {border};"
        f"border-radius: {radius}px;"
        "}"
        "QLabel {"
        "background-color: transparent;"
        "border: none;"
        "}"
    )


def named_card_style(
    object_name: str,
    *,
    bg: str = COLOR_SURFACE,
    border: str = COLOR_BORDER,
    radius: int = CARD_RADIUS,
    border_width: int = SELECTED_BORDER_WIDTH,
) -> str:
    return (
        f"QFrame#{object_name} {{"
        f"background-color: {bg};"
        f"border: {border_width}px solid {border};"
        f"border-radius: {radius}px;"
        "}"
        "QLabel {"
        "background-color: transparent;"
        "border: none;"
        "}"
    )