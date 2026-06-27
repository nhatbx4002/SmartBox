from __future__ import annotations

from typing import Callable

from PySide6.QtCore import QEvent, QObject, Qt
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget


class ErrorDialog(QWidget):
    def __init__(
        self,
        parent: QWidget,
        retry_callback: Callable[[], None] | None = None,
        go_home_callback: Callable[[], None] | None = None,
    ):
        super().__init__(parent)
        self.retry_callback = retry_callback
        self.go_home_callback = go_home_callback

        pw = parent.width() if parent.width() > 0 else 720
        ph = parent.height() if parent.height() > 0 else 1280
        self.setGeometry(0, 0, pw, ph)
        self.setStyleSheet("background-color: rgba(0, 0, 0, 0.85);")

        self.dialog_card = QFrame(self)
        self.dialog_card.setFixedSize(600, 420)
        self.dialog_card.move((pw - 600) // 2, (ph - 420) // 2)
        self.dialog_card.setStyleSheet("""
            QFrame {
                background-color: #1C1C1B;
                border: 2px solid #FF6600;
                border-radius: 20px;
            }
        """)

        card_layout = QVBoxLayout(self.dialog_card)
        card_layout.setContentsMargins(32, 28, 32, 28)
        card_layout.setSpacing(12)
        card_layout.setAlignment(Qt.AlignCenter)

        self.lbl_icon = QLabel(self.dialog_card)
        self.lbl_icon.setAlignment(Qt.AlignCenter)
        self.lbl_icon.setFixedHeight(80)
        self.lbl_icon.setStyleSheet("background: transparent; border: none; font-size: 56px;")
        self.lbl_icon.setObjectName("lblDialogIcon")

        self.lbl_title = QLabel(self.dialog_card)
        self.lbl_title.setAlignment(Qt.AlignCenter)
        self.lbl_title.setStyleSheet(
            "background: transparent; border: none; color: #FF6600;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 24px; font-weight: 900;"
        )
        self.lbl_title.setObjectName("lblDialogTitle")

        self.lbl_message = QLabel(self.dialog_card)
        self.lbl_message.setAlignment(Qt.AlignCenter)
        self.lbl_message.setWordWrap(True)
        self.lbl_message.setStyleSheet(
            "background: transparent; border: none; color: #B0B0B0;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 16px; font-weight: 500;"
        )
        self.lbl_message.setObjectName("lblDialogMessage")

        self.lbl_hotline = QLabel(self.dialog_card)
        self.lbl_hotline.setAlignment(Qt.AlignCenter)
        self.lbl_hotline.setStyleSheet(
            "background: transparent; border: none; color: #FFFFFF;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 14px; font-weight: 700;"
        )
        self.lbl_hotline.setObjectName("lblHotline")

        btn_layout = QHBoxLayout()
        btn_layout.setSpacing(16)

        self.btn_retry = QPushButton("THỬ LẠI")
        self.btn_retry.setObjectName("btnRetry")
        self.btn_retry.setFixedHeight(56)
        self.btn_retry.setCursor(Qt.PointingHandCursor)
        self.btn_retry.setStyleSheet("""
            QPushButton {
                background-color: #FF6600;
                color: white;
                border: none;
                border-radius: 16px;
                font-size: 20px;
                font-weight: 800;
                font-family: 'Be Vietnam Pro', Arial, sans-serif;
            }
            QPushButton:disabled {
                background-color: #555;
                color: #999;
            }
        """)
        self.btn_retry.clicked.connect(self._on_retry)
        if not self.retry_callback:
            self.btn_retry.setVisible(False)

        self.btn_gohome = QPushButton("Về trang chủ")
        self.btn_gohome.setObjectName("btnGoHome")
        self.btn_gohome.setFixedHeight(56)
        self.btn_gohome.setCursor(Qt.PointingHandCursor)
        self.btn_gohome.setStyleSheet("""
            QPushButton {
                background-color: #333;
                color: white;
                border: 2px solid #666;
                border-radius: 16px;
                font-size: 20px;
                font-weight: 700;
                font-family: 'Be Vietnam Pro', Arial, sans-serif;
            }
            QPushButton:disabled {
                color: #777;
                border-color: #444;
            }
        """)
        self.btn_gohome.clicked.connect(self._on_gohome)

        btn_layout.addWidget(self.btn_retry, stretch=1)
        btn_layout.addWidget(self.btn_gohome, stretch=1)

        card_layout.addWidget(self.lbl_icon)
        card_layout.addWidget(self.lbl_title)
        card_layout.addWidget(self.lbl_message)
        card_layout.addWidget(self.lbl_hotline)
        card_layout.addLayout(btn_layout)

        self.installEventFilter(self)
        self.hide()

    def show_error(
        self,
        message: str,
        title: str = "ĐÃ XẢY RA LỖI",
        icon: str = "⚠️",
        hotline: str = "Hotline: 1900 1234",
    ) -> None:
        self.lbl_title.setText(title.upper())
        self.lbl_message.setText(message)

        if icon.startswith(":/") or icon.endswith(".svg") or icon.endswith(".png"):
            self.lbl_icon.setPixmap(QPixmap(icon))
        elif icon == "⚠️":
            self.lbl_icon.setPixmap(QPixmap(":/assets/warning.svg"))
        elif icon in ("❌", "error"):
            self.lbl_icon.setPixmap(QPixmap(":/assets/error.svg"))
        else:
            self.lbl_icon.setText(icon)

        self.lbl_hotline.setText(hotline)

        self.btn_retry.setEnabled(True)
        self.btn_retry.setText("THỬ LẠI")
        self.btn_gohome.setEnabled(True)

        self.raise_()
        self.show()

    def set_loading_state(self, is_loading: bool) -> None:
        self.btn_retry.setEnabled(not is_loading)
        self.btn_retry.setText("ĐANG KẾT NỐI..." if is_loading else "THỬ LẠI")
        self.btn_gohome.setEnabled(not is_loading)

    def _on_retry(self) -> None:
        if self.retry_callback:
            self.set_loading_state(True)
            self.retry_callback()

    def _on_gohome(self) -> None:
        self.hide()
        if self.go_home_callback:
            self.go_home_callback()

    def eventFilter(self, watched: QObject, event: QEvent) -> bool:
        if event.type() in (
            QEvent.MouseButtonPress,
            QEvent.MouseButtonRelease,
            QEvent.MouseButtonDblClick,
            QEvent.MouseMove,
            QEvent.TouchBegin,
            QEvent.TouchUpdate,
            QEvent.TouchEnd,
        ):
            pos = event.pos() if hasattr(event, "pos") else self.dialog_card.pos()
            global_pos = self.mapToGlobal(pos)
            local_pos = self.dialog_card.mapFromGlobal(global_pos)
            if self.dialog_card.rect().contains(local_pos):
                return False
            return True
        return super().eventFilter(watched, event)
