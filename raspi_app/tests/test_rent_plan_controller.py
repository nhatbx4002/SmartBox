import os
import unittest

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

from PySide6.QtWidgets import QApplication

from screens.rent_plan import RentPlanController
from services.app_state import AppState, Plan


class ApiClientStub:
    def get_plans(self, size):
        return [
            Plan("single-1-day", "1 ngay", "single", 10000, 1, 1),
            Plan("single-7-days", "7 ngay", "single", 15000, 7, 1),
            Plan("multi-5-30", "5 luot / 30 ngay", "multi", 50000, 30, 5),
            Plan("multi-10-90", "10 luot / 90 ngay", "multi", 90000, 90, 10),
            Plan("month-1", "1 thang", "monthly", 150000, 30, 999),
            Plan("month-3", "3 thang", "monthly", 400000, 90, 999),
            Plan("month-6", "6 thang", "monthly", 700000, 180, 999),
        ]


class AppStub:
    def __init__(self):
        self.config = {}
        self.state = AppState(selected_size="SMALL")
        self.api_client = ApiClientStub()

    def navigate(self, route, data=None, replace=False):
        self.navigated_to = route


class RentPlanControllerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.qt_app = QApplication.instance() or QApplication([])

    def test_on_enter_shows_suboptions_for_all_plan_groups(self):
        controller = RentPlanController(AppStub())

        controller.on_enter({})

        for button in controller.plan_buttons.values():
            self.assertFalse(button.isHidden())
        for card in controller.cards.values():
            self.assertGreaterEqual(card.height(), 170)


if __name__ == "__main__":
    unittest.main()
