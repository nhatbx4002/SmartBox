"""
Shared state for cross-screen data (OTP result, locker assignment, etc.)
Used by screens that navigate to shared overlay screens.
"""

# Global dict written by parent screen before navigating to a shared overlay.
# Keys:
#   success_type   — "deposit" | "pickup" | "rent"
#   locker         — "L01"
#   txid           — "TX12345"
#   otp            — "123456"
#   amount         — "150.000đ"
STATE: dict = {}
