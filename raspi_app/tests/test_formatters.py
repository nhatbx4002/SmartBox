import unittest

from services.formatters import (
    format_currency,
    format_pin,
    is_valid_local_phone,
    normalize_vn_phone,
)

class FormatterTests(unittest.TestCase):
    def test_format_currency_uses_vietnamese_dot_grouping(self):
        self.assertEqual(format_currency(15000), "15.000đ")
        self.assertEqual(format_currency(1200000), "1.200.000đ")

    def test_format_pin_groups_six_digits(self):
        self.assertEqual(format_pin("847291"), "847 291")

    def test_format_pin_returns_original_for_non_six_digit_input(self):
        self.assertEqual(format_pin("12345"), "12345")
        self.assertEqual(format_pin("abcdef"), "abcdef")

    def test_valid_local_phone_requires_exactly_nine_digits(self):
        self.assertTrue(is_valid_local_phone("987654321"))
        self.assertTrue(is_valid_local_phone("098765432"))
        self.assertFalse(is_valid_local_phone("98765432"))
        self.assertFalse(is_valid_local_phone("9876543210"))
        self.assertFalse(is_valid_local_phone("98765abcd"))

    def test_normalize_vn_phone_prefixes_plus_84(self):
        self.assertEqual(normalize_vn_phone("987654321"), "+84987654321")


if __name__ == "__main__":
    unittest.main()
