# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'OpenBox.ui'
##
## Created by: Qt User Interface Compiler version 6.11.0
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide6.QtCore import (QCoreApplication, QDate, QDateTime, QLocale,
    QMetaObject, QObject, QPoint, QRect,
    QSize, QTime, QUrl, Qt)
from PySide6.QtGui import (QBrush, QColor, QConicalGradient, QCursor,
    QFont, QFontDatabase, QGradient, QIcon,
    QImage, QKeySequence, QLinearGradient, QPainter,
    QPalette, QPixmap, QRadialGradient, QTransform)
from PySide6.QtWidgets import (QApplication, QFrame, QHBoxLayout, QLabel,
    QPushButton, QSizePolicy, QSpacerItem, QVBoxLayout,
    QWidget)
import resources_rc

class Ui_Form(object):
    def setupUi(self, Form):
        if not Form.objectName():
            Form.setObjectName(u"Form")
        Form.resize(800, 360)
        Form.setStyleSheet(u"/* ===== ROOT ===== */\n"
"QWidget#Form {\n"
"    background-color: #000000;\n"
"    color: #F2F2F2;\n"
"    font-family: \"Segoe UI\";\n"
"}\n"
"\n"
"/* ===== 2 CARD CH\u00cdNH ===== */\n"
"QFrame#frameStatusCard,\n"
"QFrame#frameTimerCard {\n"
"    background: qlineargradient(\n"
"        x1: 0, y1: 0, x2: 1, y2: 1,\n"
"        stop: 0 #1A1A1F,\n"
"        stop: 1 #131318\n"
"    );\n"
"    border: none;\n"
"    border-radius: 22px;\n"
"}\n"
"\n"
"/* ===== CARD TR\u1ea0NG TH\u00c1I ===== */\n"
"QLabel#labelStatusTitle {\n"
"    background: transparent;\n"
"    color: #E9A889;\n"
"    font-size: 16px;\n"
"    font-weight: 700;\n"
"    letter-spacing: 2px;\n"
"}\n"
"\n"
"QLabel#labelBoxName {\n"
"    background: transparent;\n"
"    color: #FFFFFF;\n"
"    font-size: 30px;\n"
"    font-weight: 800;\n"
"}\n"
"\n"
"QLabel#labelBoxState {\n"
"    background: transparent;\n"
"    color: #F2A07D;\n"
"    font-size: 20px;\n"
"    font-weight: 700;\n"
"}\n"
"\n"
"QLabel#labelInstruction {\n"
"    background: transpar"
                        "ent;\n"
"    color: #F4A07A;\n"
"    font-size: 18px;\n"
"    font-weight: 800;\n"
"}\n"
"\n"
"/* ===== ICON BOX ===== */\n"
"QFrame#frame_3 {\n"
"    background: rgba(255, 255, 255, 0.05);\n"
"    border: none;\n"
"    border-radius: 16px;\n"
"}\n"
"\n"
"QFrame#frame_3 QLabel#label {\n"
"    background: transparent;\n"
"    color: #F2A886;\n"
"    border: none;\n"
"}\n"
"\n"
"/* ===== CARD TH\u1edcI GIAN ===== */\n"
"QLabel#labelTimerTitle {\n"
"    background: transparent;\n"
"    color: #E3A487;\n"
"    font-size: 16px;\n"
"    font-weight: 700;\n"
"    letter-spacing: 2px;\n"
"}\n"
"\n"
"/* b\u1ecf to\u00e0n b\u1ed9 border ph\u1ea7n th\u1eddi gian */\n"
"QLabel#labelTimerValue,\n"
"QLabel#labelTimerUnit {\n"
"    background: transparent;\n"
"    border: none;\n"
"    outline: none;\n"
"    color: #FF7A00;\n"
"}\n"
"\n"
"QLabel#labelTimerValue {\n"
"    font-size: 56px;\n"
"    font-weight: 900;\n"
"}\n"
"\n"
"QLabel#labelTimerUnit {\n"
"    font-size: 24px;\n"
"    font-weight: 800;\n"
"    padding-left: 2"
                        "px;\n"
"}\n"
"\n"
"/* n\u1ebfu c\u00e1i vi\u1ec1n cam v\u1eabn c\u00f2n do label auto selected/focus */\n"
"QLabel#labelTimerTitle,\n"
"QLabel#labelTimerValue,\n"
"QLabel#labelTimerUnit {\n"
"    selection-background-color: transparent;\n"
"    selection-color: inherit;\n"
"}\n"
"\n"
"/* ===== BUTTON COMPLETE ===== */\n"
"QPushButton#btnComplete {\n"
"    background: qlineargradient(\n"
"        x1:0, y1:0, x2:1, y2:0,\n"
"        stop:0 #F0B08D,\n"
"        stop:1 #FF7A00\n"
"    );\n"
"    color: #4B210F;\n"
"    border: none;\n"
"    border-radius: 18px;\n"
"    font-size: 24px;\n"
"    font-weight: 900;\n"
"    padding-left: 22px;\n"
"    padding-right: 22px;\n"
"    text-align: center;\n"
"\n"
"}\n"
"\n"
"QPushButton#btnComplete:hover {\n"
"    background: qlineargradient(\n"
"        x1:0, y1:0, x2:1, y2:0,\n"
"        stop:0 #F6BC9C,\n"
"        stop:1 #FF8D23\n"
"    );\n"
"}\n"
"\n"
"QPushButton#btnComplete:pressed {\n"
"    background: #E56D00;\n"
"    color: #3A170A;\n"
"}")
        self.verticalLayout_4 = QVBoxLayout(Form)
        self.verticalLayout_4.setObjectName(u"verticalLayout_4")
        self.verticalLayout_3 = QVBoxLayout()
        self.verticalLayout_3.setSpacing(10)
        self.verticalLayout_3.setObjectName(u"verticalLayout_3")
        self.verticalLayout_3.setContentsMargins(20, 10, 20, 20)
        self.layoutTop = QHBoxLayout()
        self.layoutTop.setSpacing(10)
        self.layoutTop.setObjectName(u"layoutTop")
        self.layoutTop.setContentsMargins(0, -1, -1, -1)
        self.frameStatusCard = QFrame(Form)
        self.frameStatusCard.setObjectName(u"frameStatusCard")
        self.frameStatusCard.setFrameShape(QFrame.Shape.StyledPanel)
        self.frameStatusCard.setFrameShadow(QFrame.Shadow.Raised)
        self.widget = QWidget(self.frameStatusCard)
        self.widget.setObjectName(u"widget")
        self.widget.setGeometry(QRect(10, 20, 459, 151))
        self.horizontalLayout_2 = QHBoxLayout(self.widget)
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.horizontalLayout_2.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_2 = QVBoxLayout()
        self.verticalLayout_2.setObjectName(u"verticalLayout_2")
        self.labelStatusTitle = QLabel(self.widget)
        self.labelStatusTitle.setObjectName(u"labelStatusTitle")

        self.verticalLayout_2.addWidget(self.labelStatusTitle)

        self.labelBoxName = QLabel(self.widget)
        self.labelBoxName.setObjectName(u"labelBoxName")

        self.verticalLayout_2.addWidget(self.labelBoxName)

        self.labelBoxState = QLabel(self.widget)
        self.labelBoxState.setObjectName(u"labelBoxState")

        self.verticalLayout_2.addWidget(self.labelBoxState)

        self.labelInstruction = QLabel(self.widget)
        self.labelInstruction.setObjectName(u"labelInstruction")

        self.verticalLayout_2.addWidget(self.labelInstruction)


        self.horizontalLayout_2.addLayout(self.verticalLayout_2)

        self.horizontalSpacer = QSpacerItem(40, 20, QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_2.addItem(self.horizontalSpacer)

        self.frame_3 = QFrame(self.widget)
        self.frame_3.setObjectName(u"frame_3")
        self.frame_3.setMinimumSize(QSize(70, 60))
        self.frame_3.setMaximumSize(QSize(70, 60))
        self.frame_3.setFrameShape(QFrame.Shape.StyledPanel)
        self.frame_3.setFrameShadow(QFrame.Shadow.Raised)
        self.verticalLayout = QVBoxLayout(self.frame_3)
        self.verticalLayout.setObjectName(u"verticalLayout")
        self.label = QLabel(self.frame_3)
        self.label.setObjectName(u"label")
        self.label.setPixmap(QPixmap(u":/icons/assets/icon/OpenSucesspage.png"))
        self.label.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout.addWidget(self.label)


        self.horizontalLayout_2.addWidget(self.frame_3)


        self.layoutTop.addWidget(self.frameStatusCard)

        self.frameTimerCard = QFrame(Form)
        self.frameTimerCard.setObjectName(u"frameTimerCard")
        self.frameTimerCard.setFrameShape(QFrame.Shape.StyledPanel)
        self.frameTimerCard.setFrameShadow(QFrame.Shadow.Raised)
        self.labelTimerTitle = QLabel(self.frameTimerCard)
        self.labelTimerTitle.setObjectName(u"labelTimerTitle")
        self.labelTimerTitle.setGeometry(QRect(80, 10, 91, 21))
        self.widget1 = QWidget(self.frameTimerCard)
        self.widget1.setObjectName(u"widget1")
        self.widget1.setGeometry(QRect(70, 90, 122, 81))
        self.horizontalLayout = QHBoxLayout(self.widget1)
        self.horizontalLayout.setSpacing(0)
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.horizontalLayout.setContentsMargins(0, 0, 0, 0)
        self.labelTimerValue = QLabel(self.widget1)
        self.labelTimerValue.setObjectName(u"labelTimerValue")
        self.labelTimerValue.setAlignment(Qt.AlignmentFlag.AlignRight|Qt.AlignmentFlag.AlignTrailing|Qt.AlignmentFlag.AlignVCenter)

        self.horizontalLayout.addWidget(self.labelTimerValue)

        self.labelTimerUnit = QLabel(self.widget1)
        self.labelTimerUnit.setObjectName(u"labelTimerUnit")
        self.labelTimerUnit.setAlignment(Qt.AlignmentFlag.AlignBottom|Qt.AlignmentFlag.AlignLeading|Qt.AlignmentFlag.AlignLeft)

        self.horizontalLayout.addWidget(self.labelTimerUnit)


        self.layoutTop.addWidget(self.frameTimerCard)

        self.layoutTop.setStretch(0, 2)
        self.layoutTop.setStretch(1, 1)

        self.verticalLayout_3.addLayout(self.layoutTop)

        self.btnComplete = QPushButton(Form)
        self.btnComplete.setObjectName(u"btnComplete")

        self.verticalLayout_3.addWidget(self.btnComplete)


        self.verticalLayout_4.addLayout(self.verticalLayout_3)


        self.retranslateUi(Form)

        QMetaObject.connectSlotsByName(Form)
    # setupUi

    def retranslateUi(self, Form):
        Form.setWindowTitle(QCoreApplication.translate("Form", u"Form", None))
        self.labelStatusTitle.setText(QCoreApplication.translate("Form", u"Tr\u1ea1ng th\u00e1i \u00f4 t\u1ee7", None))
        self.labelBoxName.setText(QCoreApplication.translate("Form", u"T\u1ee7 1 ", None))
        self.labelBoxState.setText(QCoreApplication.translate("Form", u"\u0110ang m\u1edf", None))
        self.labelInstruction.setText(QCoreApplication.translate("Form", u"Vui l\u00f2ng b\u1ecf \u0111\u1ed3 v\u00e0 \u0111\u00f3ng t\u1ee7 ....", None))
        self.label.setText("")
        self.labelTimerTitle.setText(QCoreApplication.translate("Form", u"Th\u1eddi gian c\u00f2n l\u1ea1i", None))
        self.labelTimerValue.setText(QCoreApplication.translate("Form", u"60", None))
        self.labelTimerUnit.setText(QCoreApplication.translate("Form", u"s", None))
        self.btnComplete.setText(QCoreApplication.translate("Form", u"Ho\u00e0n t\u1ea5t", None))
    # retranslateUi

