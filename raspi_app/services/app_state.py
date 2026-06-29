from dataclasses import dataclass
from dataclasses import field
from datetime import datetime
from typing import Optional


@dataclass
class Plan:
    id: str
    name: str
    rental_type: str
    price: int
    duration_days: int
    max_opens: int


@dataclass
class RentalData:
    id: str
    pin: str
    compartment_id: str
    compartment_name: str
    expires_at: str
    qr_data: str = ""


@dataclass
class CompartmentData:
    id: str
    name: str
    size: str
    locker_name: str


@dataclass
class AppState:
    mode: Optional[str] = None
    selected_size: Optional[str] = None
    selected_plan: Optional[Plan] = None
    selected_plan_group: Optional[str] = None
    available_plans: list[Plan] = field(default_factory=list)
    phone: Optional[str] = None
    payment_method: Optional[str] = None
    rental_data: Optional[RentalData] = None
    compartment_data: Optional[CompartmentData] = None
    pairing_session_id: Optional[str] = None
    pairing_code: Optional[str] = None
    pairing_expires_at: Optional[datetime] = None
    discovered_mcp_devices: list[dict] = field(default_factory=list)
    pairing_status: str = "IDLE"
    payment_order_code: Optional[int] = None
    payment_qr_string: Optional[str] = None
    payment_amount: Optional[int] = None
    payment_expires_at: Optional[str] = None   # ISO string or timestamp
    cached_availability: Optional[dict] = None  # {"SMALL": int, "LARGE": int}

    def reset_rent_flow(self) -> None:
        self.selected_size = None
        self.selected_plan = None
        self.selected_plan_group = None
        self.available_plans = []
        self.phone = None
        self.payment_method = None
        self.rental_data = None
        self.compartment_data = None
        self.payment_order_code = None
        self.payment_qr_string = None
        self.payment_amount = None
        self.payment_expires_at = None

    def reset_pairing_flow(self) -> None:
        self.pairing_session_id = None
        self.pairing_code = None
        self.pairing_expires_at = None
        self.discovered_mcp_devices = []
        self.pairing_status = "IDLE"

    def reset_all(self) -> None:
        self.mode = None
        self.reset_rent_flow()
        self.reset_pairing_flow()
