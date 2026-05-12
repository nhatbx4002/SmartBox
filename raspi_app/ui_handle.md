1.RentPlan
# RentPlanScreen Logic Spec

Khi mở màn `RentPlanScreen`, set 3 card về trạng thái thu gọn, ẩn toàn bộ sub-options và disable nút tiếp tục.

ObjectNames cần có:

- `cardPlanSingle`
- `cardPlanMulti`
- `cardPlanMonthly`
- `btnSingle1Day`
- `btnSingle7Days`
- `btnMulti5_30`
- `btnMulti10_90`
- `btnMonth1`
- `btnMonth3`
- `btnMonth6`
- `btnBackMain`
- `btnContinue`

Initial state:

```python
cardPlanSingle.setGeometry(26, 220, 656, 98)
cardPlanMulti.setGeometry(26, 360, 656, 98)
cardPlanMonthly.setGeometry(26, 500, 656, 98)

hide_all_options()
btnContinue.setEnabled(False)