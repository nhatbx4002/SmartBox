import os
import unittest

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

from PySide6.QtWidgets import QApplication

from screens.rent_plan import RentPlanController
from screens.rent_plan_options import RentPlanOptionsController
from services.app_state import AppState, Plan


class ApiClientStub:
    def get_plans(self, size):
        return [
            Plan("plan-once-1", "1 ngay", "ONCE", 10000, 1, 1),
            Plan("plan-once-7", "7 ngay", "ONCE", 15000, 7, 1),
            Plan("plan-daily-5", "5 luot / 30 ngay", "DAILY", 50000, 30, 5),
            Plan("plan-daily-10", "10 luot / 90 ngay", "DAILY", 90000, 90, 10),
            Plan("plan-monthly-1", "1 thang", "MONTHLY", 150000, 30, 999),
            Plan("plan-monthly-3", "3 thang", "MONTHLY", 400000, 90, 999),
            Plan("plan-monthly-6", "6 thang", "MONTHLY", 700000, 180, 999),
        ]


class AppStub:
    def __init__(self):
        self.config = {}
        self.state = AppState(selected_size="SMALL")
        self.api_client = ApiClientStub()
        self.controllers = {}

    def navigate(self, route, data=None, replace=False):
        self.navigated_to = route


class RentPlanControllerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.qt_app = QApplication.instance() or QApplication([])

    def test_on_enter_loads_and_groups_plans(self):
        controller = RentPlanController(AppStub())

        controller.on_enter({})

        self.assertIsNotNone(controller.state.available_plans)
        self.assertEqual(len(controller.state.available_plans), 7)
        layout = controller.plans_layout
        self.assertGreater(layout.count(), 0)

    def test_on_enter_without_size_navigates_back(self):
        app = AppStub()
        app.state.selected_size = None
        controller = RentPlanController(app)

        controller.on_enter({})

        self.assertEqual(app.navigated_to, "/rent-size")

    def test_select_group_enables_continue(self):
        app = AppStub()
        controller = RentPlanController(app)

        controller.on_enter({})
        self.assertFalse(controller.continue_button.isEnabled())

        controller._select_group("DAILY")

        self.assertEqual(controller.selected_group_type, "DAILY")
        self.assertTrue(controller.continue_button.isEnabled())
        self.assertIsNone(app.state.selected_plan_group)

    def test_continue_navigates_to_plan_options(self):
        app = AppStub()
        controller = RentPlanController(app)

        controller.on_enter({})
        controller._select_group("DAILY")
        controller.continue_button.click()

        self.assertEqual(app.state.selected_plan_group, "DAILY")
        self.assertEqual(app.navigated_to, "/rent-plan-options")


class RentPlanOptionsControllerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.qt_app = QApplication.instance() or QApplication([])

    def test_on_enter_filters_plans_by_group(self):
        app = AppStub()
        app.state.selected_size = "SMALL"
        app.state.selected_plan_group = "DAILY"
        app.state.available_plans = ApiClientStub().get_plans("SMALL")
        controller = RentPlanOptionsController(app)

        controller.on_enter({})

        layout = controller.options_layout
        self.assertGreater(layout.count(), 0)
        self.assertFalse(controller.continue_button.isEnabled())

    def test_select_plan_enables_continue(self):
        app = AppStub()
        app.state.selected_size = "SMALL"
        app.state.selected_plan_group = "ONCE"
        app.state.available_plans = ApiClientStub().get_plans("SMALL")
        controller = RentPlanOptionsController(app)

        controller.on_enter({})
        plan = app.state.available_plans[0]

        from screens.components.selectable_card import SelectableCard
        dummy_card = SelectableCard(title="test")
        controller._select_plan(plan, dummy_card)

        self.assertIsNotNone(app.state.selected_plan)
        self.assertEqual(app.state.selected_plan.id, plan.id)
        self.assertTrue(controller.continue_button.isEnabled())

    def test_on_enter_without_group_navigates_back(self):
        app = AppStub()
        app.state.selected_size = "SMALL"
        controller = RentPlanOptionsController(app)

        controller.on_enter({})

        self.assertEqual(app.navigated_to, "/rent-plan")


if __name__ == "__main__":
    unittest.main()
