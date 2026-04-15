from __future__ import annotations


class Keypad4x4:
    KEY_LAYOUT = (
        ("1", "2", "3", "A"),
        ("4", "5", "6", "B"),
        ("7", "8", "9", "C"),
        ("*", "0", "#", "D"),
    )

    KEY_MAP = {
        "KEY_1": "1",
        "KEY_2": "2",
        "KEY_3": "3",
        "KEY_4": "4",
        "KEY_5": "5",
        "KEY_6": "6",
        "KEY_7": "7",
        "KEY_8": "8",
        "KEY_9": "9",
        "KEY_0": "0",
        "KEY_A": "A",
        "KEY_B": "B",
        "KEY_C": "C",
        "KEY_D": "D",
        "KEY_STAR": "*",
        "KEY_HASH": "#",
        "*": "*",
        "#": "#",
        "A": "A",
        "B": "B",
        "C": "C",
        "D": "D",
        "0": "0",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
    }

    @classmethod
    def normalize(cls, raw_key: str) -> str:
        return cls.KEY_MAP.get(raw_key, raw_key)
