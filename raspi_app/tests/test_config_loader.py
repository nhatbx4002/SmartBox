import tempfile
import unittest
from pathlib import Path

from services.config_loader import get_config_value, load_config


class ConfigLoaderTests(unittest.TestCase):
    def test_load_config_reads_yaml_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "config.yaml"
            path.write_text(
                "app:\n  countdown_open: 60\nsupport:\n  hotline: '1900 1234'\n",
                encoding="utf-8",
            )

            config = load_config(path)

        self.assertEqual(config["app"]["countdown_open"], 60)
        self.assertEqual(config["support"]["hotline"], "1900 1234")

    def test_get_config_value_reads_dot_path(self):
        config = {"app": {"countdown_open": 60}}

        self.assertEqual(get_config_value(config, "app.countdown_open", 10), 60)

    def test_get_config_value_returns_default_when_missing(self):
        config = {"app": {}}

        self.assertEqual(get_config_value(config, "app.countdown_open", 10), 10)


if __name__ == "__main__":
    unittest.main()
