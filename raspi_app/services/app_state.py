from dataclasses import dataclass
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
    phone: Optional[str] = None
    payment_method: Optional[str] = None
    rental_data: Optional[RentalData] = None
    compartment_data: Optional[CompartmentData] = None

    def reset_rent_flow(self) -> None:
        self.selected_size = None
        self.selected_plan = None
        self.phone = None
        self.payment_method = None
        self.rental_data = None
        self.compartment_data = None

    def reset_all(self) -> None:
        self.mode = None
        self.reset_rent_flow()
