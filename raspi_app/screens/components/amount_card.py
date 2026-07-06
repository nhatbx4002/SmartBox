from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLabel, QVBoxLayout, QWidget

from screens.components.theme import COLOR_BORDER, COLOR_CARD, COLOR_MUTED, COLOR_PRIMARY, FONT_FAMILY


class AmountCard(QFrame):
    def __init__(
        self,
        *,
        title: str = "Số tiền thanh toán",
        amount: str = "0đ",
        parent: QWidget | None = None,
        object_name: str = "amountCard",
        amount_object_name: str = "lblAmount",
        height: int = 200,
        radius: int = 24,
        amount_font_size: int = 80,
    ):
        super().__init__(parent)
        self.setObjectName(object_name)
        self.setFixedHeight(height)
        self.setStyleSheet(
            f"QFrame#{object_name} {{"
            f"background-color: {COLOR_CARD};"
            f"border: 2px solid {COLOR_BORDER};"
            f"border-radius: {radius}px;"
            "}"
            "QLabel {background: transparent;border: none;}"
        )

        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignCenter)
        layout.setSpacing(6)

        self.title_label = QLabel(title, self)
        self.title_label.setAlignment(Qt.AlignCenter)
        self.title_label.setStyleSheet(
            f"color: {COLOR_MUTED};"
            f"font-family: {FONT_FAMILY};"
            "font-size: 18px;font-weight: 500;"
        )

        self.amount_label = QLabel(amount, self)
        self.amount_label.setObjectName(amount_object_name)
        self.amount_label.setAlignment(Qt.AlignCenter)
        self.amount_label.setStyleSheet(
            f"color: {COLOR_PRIMARY};"
            f"font-family: {FONT_FAMILY};"
            f"font-size: {amount_font_size}px;"
            "font-weight: 900;"
        )

        layout.addWidget(self.title_label)
        layout.addWidget(self.amount_label)

    def set_amount(self, amount: str) -> None:
        self.amount_label.setText(amount)

    def set_title(self, title: str) -> None:
        self.title_label.setText(title)
