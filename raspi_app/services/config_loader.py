from pathlib import Path
from typing import Any

import yaml


def load_config(path: str | Path | None = None) -> dict[str, Any]:
    config_path = Path(path) if path is not None else Path(__file__).resolve().parents[1] / "config.yaml"

    with config_path.open("r", encoding="utf-8") as file:
        data = yaml.safe_load(file)

    return data or {}


def get_config_value(config: dict[str, Any], key_path: str, default: Any = None) -> Any:
    current: Any = config

    for key in key_path.split("."):
        if not isinstance(current, dict) or key not in current:
            return default
        current = current[key]

    return current
