"""
Theme constants mirrored from React theme.ts
Screen size: 800x480 ( kiosk portrait )
Colors and spacing also mirrored.
"""
from typing import Final

# Screen dimensions
SCREEN_W: Final[int] = 800
SCREEN_H: Final[int] = 480

# Colors (dark kiosk theme)
BG_ROOT: Final[str] = "#0A0A0A"
BG_CARD: Final[str] = "#111111"
BG_CARD_BORDER: Final[str] = "#2a2a2a"
BG_HEADER: Final[str] = "#111111"
BG_HEADER_BORDER: Final[str] = "#1e1e1e"
FG_PRIMARY: Final[str] = "#E8E8E8"
FG_MUTED: Final[str] = "#888888"
FG_DIM: Final[str] = "#555555"
FG_DISABLED: Final[str] = "#444444"

# Brand accent
ACCENT_ORANGE: Final[str] = "#FF6600"
ACCENT_BLUE: Final[str] = "#2196F3"
ACCENT_GREEN: Final[str] = "#4CAF50"

# Locker size colors
SIZE_COLORS: Final[dict] = {
    "small": "#3B82F6",
    "medium": "#8B5CF6",
    "large": "#F59E0B",
    "xlarge": "#EF4444",
}

# Locker size labels
SIZE_LABELS: Final[dict] = {
    "small": "Nhỏ (20x30x40cm)",
    "medium": "Vừa (30x40x50cm)",
    "large": "Lớn (40x50x60cm)",
    "xlarge": "Rất lớn (50x60x80cm)",
}

# Locker size prices (per rental month)
SIZE_PRICES: Final[dict] = {
    "small": "5.000đ",
    "medium": "10.000đ",
    "large": "15.000đ",
    "xlarge": "20.000đ",
}

# Header height, footer height
HEADER_H: Final[int] = 52
FOOTER_H: Final[int] = 38

# Border radius
RADIUS_SM: Final[int] = 8
RADIUS_MD: Final[int] = 12
RADIUS_LG: Final[int] = 14
RADIUS_XL: Final[int] = 20

# Font families available on Windows
FONT_FAMILY: Final[str] = "Be Vietnam Pro, Segoe UI, Arial, sans-serif"
