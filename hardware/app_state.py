from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass
class AppState:
    selected_size: Optional[str] = None
    selected_plan: Optional[str] = None
    phone_number: str = ""

    rental_pin: Optional[str] = None
    rental_id: Optional[str] = None
    rental_compartment: Optional[str] = None
    rental_expires_at: Optional[str] = None

    otp_compartment: Optional[str] = None
    active_compartment: Optional[str] = None
    current_flow: Optional[str] = None

    remaining: int = 60
    countdown_default: int = 60
    countdown_open: int = 60

    def configure(self, *, countdown_default: int, countdown_open: int) -> None:
        self.countdown_default = countdown_default
        self.countdown_open = countdown_open
        self.remaining = countdown_default

    def reset_navigation_context(self) -> None:
        self.current_flow = None
        self.active_compartment = None
        self.remaining = self.countdown_default

    def reset_otp_flow(self) -> None:
        self.current_flow = None
        self.otp_compartment = None
        self.active_compartment = None
        self.remaining = self.countdown_default

    def reset_rental_flow(self) -> None:
        self.selected_size = None
        self.selected_plan = None
        self.phone_number = ""
        self.rental_pin = None
        self.rental_id = None
        self.rental_compartment = None
        self.rental_expires_at = None

    def prepare_open_box(self, compartment_id: str) -> None:
        self.active_compartment = compartment_id
        self.remaining = self.countdown_open
