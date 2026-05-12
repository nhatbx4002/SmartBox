def format_currency(value: int) -> str:
    return f"{value:,}".replace(",", ".") + "đ"


def format_pin(pin: str) -> str:
    if len(pin) == 6 and pin.isdigit():
        return f"{pin[:3]} {pin[3:]}"
    return pin


def is_valid_local_phone(text: str) -> bool:
    return len(text) == 9 and text.isdigit()


def normalize_vn_phone(text: str) -> str:
    return "+84" + text
