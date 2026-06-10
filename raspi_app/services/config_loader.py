from pathlib import Path
from typing import Any

import yaml


def _config_path(path: str | Path | None = None) -> Path:
    return Path(path) if path is not None else Path(__file__).resolve().parents[1] / "config.yaml"


def load_config(path: str | Path | None = None) -> dict[str, Any]:
    config_path = _config_path(path)

    with config_path.open("r", encoding="utf-8") as file:
        data = yaml.safe_load(file)

    return data or {}


def save_config(config: dict[str, Any], path: str | Path | None = None) -> None:
    config_path = _config_path(path)
    with config_path.open("w", encoding="utf-8") as file:
        yaml.safe_dump(config, file, default_flow_style=False, allow_unicode=True, sort_keys=False)


def get_config_value(config: dict[str, Any], key_path: str, default: Any = None) -> Any:
    current: Any = config

    for key in key_path.split("."):
        if not isinstance(current, dict) or key not in current:
            return default
        current = current[key]

    return current


def get_pairing_session_id(config: dict[str, Any]) -> str | None:
    value = get_config_value(config, "pairing_session_id")
    return str(value) if value else None


def set_pairing_session_id(config: dict[str, Any], pairing_session_id: str | None, path: str | Path | None = None) -> None:
    if pairing_session_id:
        config["pairing_session_id"] = pairing_session_id
    else:
        config.pop("pairing_session_id", None)
    save_config(config, path)


def is_paired(config: dict[str, Any]) -> bool:
    return bool(get_config_value(config, "cabinet_id")) and bool(get_config_value(config, "jwt_token"))


def is_pairing_in_progress(config: dict[str, Any]) -> bool:
    return bool(get_pairing_session_id(config)) and not is_paired(config)
