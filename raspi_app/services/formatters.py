from datetime import datetime


def format_expiry(iso_str: str) -> str:
    try:
        dt = datetime.fromisoformat(iso_str).astimezone()
        return dt.strftime("%H:%M - %d/%m/%Y")
    except (ValueError, TypeError):
        return iso_str


PLAN_GROUPS = {
    "ONCE": {"title": "Gói ngắn hạn", "subtitle": "Phù hợp gửi/lấy trong thời gian ngắn"},
    "DAILY": {"title": "Gói nhiều lượt mở", "subtitle": "Mở tủ nhiều lần trong nhiều ngày"},
    "MONTHLY": {"title": "Gói không giới hạn lượt mở", "subtitle": "Dùng dài hạn, không giới hạn lượt mở"},
}


def format_currency(value: int) -> str:
    return f"{value:,}".replace(",", ".") + "đ"


def format_pin(pin: str) -> str:
    if len(pin) == 6 and pin.isdigit():
        return f"{pin[:3]} {pin[3:]}"
    return pin


def is_valid_local_phone(text: str) -> bool:
    return len(text) == 10 and text.isdigit() and text.startswith("0")


def normalize_vn_phone(text: str) -> str:
    text = text.strip()
    if text.startswith("+84"):
        text = "0" + text[3:]
    return text


def format_plan_subtitle(rental_type: str, duration_days: int, max_opens: int | None = None) -> str:
    rt = (rental_type or "").upper()
    if rt == "MONTHLY":
        return "Không giới hạn lượt mở"
    if rt == "DAILY":
        opens = max_opens or 0
        return f"{opens} lượt / {duration_days} ngày"
    return f"Sử dụng trong {duration_days} ngày"
