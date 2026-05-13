import unittest

from services.app_state import AppState, CompartmentData, Plan, RentalData


class AppStateTests(unittest.TestCase):
    def test_reset_rent_flow_clears_rental_fields_but_keeps_mode(self):
        state = AppState()
        state.mode = "rent"
        state.selected_size = "SMALL"
        state.selected_plan = Plan("p1", "1 ngày", "single", 15000, 1, 1)
        state.phone = "+84987654321"
        state.payment_method = "MOMO"
        state.rental_data = RentalData("r1", "847291", "c1", "A1", "2026-05-19T00:00:00Z")
        state.compartment_data = CompartmentData("c1", "Ngăn A1", "SMALL", "Tủ A")

        state.reset_rent_flow()

        self.assertEqual(state.mode, "rent")
        self.assertIsNone(state.selected_size)
        self.assertIsNone(state.selected_plan)
        self.assertIsNone(state.phone)
        self.assertIsNone(state.payment_method)
        self.assertIsNone(state.rental_data)
        self.assertIsNone(state.compartment_data)

    def test_reset_all_clears_everything(self):
        state = AppState()
        state.mode = "pickup"
        state.selected_size = "LARGE"

        state.reset_all()

        self.assertIsNone(state.mode)
        self.assertIsNone(state.selected_size)


if __name__ == "__main__":
    unittest.main()
