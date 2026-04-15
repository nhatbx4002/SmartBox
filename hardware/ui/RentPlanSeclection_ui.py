# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'RentPlanSeclection.ui'
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
    QSizePolicy, QSpacerItem, QVBoxLayout, QWidget)
import resources_rc

class Ui_RentPlanSelection(object):
    def setupUi(self, RentPlanSelection):
        if not RentPlanSelection.objectName():
            RentPlanSelection.setObjectName(u"RentPlanSelection")
        RentPlanSelection.resize(800, 360)
        RentPlanSelection.setStyleSheet(u"/* =========================\n"
"   MAIN CONTENT\n"
"   ========================= */\n"
"\n"
"QWidget {\n"
"    background-color: #050505;\n"
"    color: #F2F2F2;\n"
"    font-family: \"Segoe UI\", \"Arial\", sans-serif;\n"
"}\n"
"\n"
"\n"
"/* =========================\n"
"   TITLE + SUBTITLE\n"
"   ========================= */\n"
"\n"
"QLabel#labelTitle {\n"
"    color: #F3F3F3;\n"
"    font-size: 26px;\n"
"    font-weight: 700;\n"
"    background: transparent;\n"
"    padding: 0px;\n"
"}\n"
"\n"
"QLabel#labelSizeSelection {\n"
"    color: #E5AE8A;\n"
"    font-size: 16px;\n"
"    font-weight: 600;\n"
"    background: transparent;\n"
"    padding: 0px;\n"
"}\n"
"\n"
"\n"
"/* =========================\n"
"   PLAN CARD BASE\n"
"   ========================= */\n"
"\n"
"QFrame#framePlan1,\n"
"QFrame#framePlan2,\n"
"QFrame#framePlan3 {\n"
"    background-color: #141414;\n"
"    border: 1px solid #1E1E1E;\n"
"    border-left: 6px solid #35E08A;\n"
"    border-radius: 12px;\n"
"}\n"
"\n"
"\n"
"/* hover nh\u1eb9 cho "
                        "\u0111\u1eb9p */\n"
"QFrame#framePlan1:hover,\n"
"QFrame#framePlan2:hover,\n"
"QFrame#framePlan3:hover {\n"
"    background-color: #181818;\n"
"    border: 1px solid #2A2A2A;\n"
"    border-left: 6px solid #42F39A;\n"
"}\n"
"\n"
"\n"
"/* n\u1ebfu mu\u1ed1n plan \u0111ang ch\u1ecdn n\u1ed5i h\u01a1n th\u00ec d\u00f9ng c\u00e1i n\u00e0y\n"
"   r\u1ed3i sau n\u00e0y set property ho\u1eb7c \u0111\u1ed5i objectName ri\u00eang */\n"
"QFrame#framePlan1 {\n"
"    background-color: #161616;\n"
"}\n"
"\n"
"\n"
"/* =========================\n"
"   PLAN TITLE\n"
"   ========================= */\n"
"\n"
"QLabel#labelPlanTitle1,\n"
"QLabel#labelPlanTitle2,\n"
"QLabel#labelPlanTitle3 {\n"
"    color: #F4F4F4;\n"
"    font-size: 20px;\n"
"    font-weight: 700;\n"
"    background: transparent;\n"
"    border: none;\n"
"    padding: 0px;\n"
"    margin: 0px;\n"
"}\n"
"\n"
"\n"
"/* =========================\n"
"   PLAN SUBTITLE\n"
"   ========================= */\n"
"\n"
"QLabel#labelPlanSubtitle1,\n"
"QLabel#labelPlanSubtitle2,"
                        "\n"
"QLabel#labelPlanSubtitle3 {\n"
"    color: #D9B19A;\n"
"    font-size: 13px;\n"
"    font-weight: 500;\n"
"    background: transparent;\n"
"    border: none;\n"
"    padding: 0px;\n"
"    margin: 0px;\n"
"}\n"
"\n"
"\n"
"/* =========================\n"
"   PLAN PRICE\n"
"   cover lu\u00f4n t\u00ean hi\u1ec7n t\u1ea1i: labelPlanPrice\n"
"   v\u00e0 t\u00ean m\u1edbi n\u00ean d\u00f9ng: labelPlanPrice1/2/3\n"
"   ========================= */\n"
"\n"
"QLabel#labelPlanPrice,\n"
"QLabel#labelPlanPrice1,\n"
"QLabel#labelPlanPrice2,\n"
"QLabel#labelPlanPrice3 {\n"
"    color: #41E38C;\n"
"    font-size: 20px;\n"
"    font-weight: 700;\n"
"    background: transparent;\n"
"    border: none;\n"
"    padding: 0px;\n"
"    margin: 0px;\n"
"}\n"
"\n"
"\n"
"/* =========================\n"
"   PLAN ARROW\n"
"   cover lu\u00f4n t\u00ean hi\u1ec7n t\u1ea1i: next\n"
"   v\u00e0 t\u00ean m\u1edbi n\u00ean d\u00f9ng: labelNext1/2/3\n"
"   ========================= */\n"
"\n"
"QLabel#next,\n"
"QLabel#labelNext1,\n"
"QLabel#la"
                        "belNext2,\n"
"QLabel#labelNext3 {\n"
"    color: #9B7B6F;\n"
"    font-size: 24px;\n"
"    font-weight: 700;\n"
"    background: transparent;\n"
"    border: none;\n"
"    padding: 0px 6px 0px 6px;\n"
"    margin: 0px;\n"
"}\n"
"\n"
"\n"
"/* =========================\n"
"   OPTIONAL:\n"
"   n\u1ebfu b\u00ean trong card c\u00f2n c\u00f3 label kh\u00e1c\n"
"   th\u00ec \u00e9p n\u1ec1n trong su\u1ed1t cho s\u1ea1ch\n"
"   ========================= */\n"
"\n"
"QFrame#framePlan1 QLabel,\n"
"QFrame#framePlan2 QLabel,\n"
"QFrame#framePlan3 QLabel {\n"
"    background: transparent;\n"
"}\n"
"\n"
"\n"
"/* =========================\n"
"   OPTIONAL:\n"
"   b\u1ecf vi\u1ec1n x\u1ea5u khi focus\n"
"   ========================= */\n"
"\n"
"QFrame#framePlan1:focus,\n"
"QFrame#framePlan2:focus,\n"
"QFrame#framePlan3:focus,\n"
"QLabel#labelPlanTitle1:focus,\n"
"QLabel#labelPlanTitle2:focus,\n"
"QLabel#labelPlanTitle3:focus,\n"
"QLabel#labelPlanSubtitle1:focus,\n"
"QLabel#labelPlanSubtitle2:focus,\n"
"QLabel#labelPlanSubtitle3"
                        ":focus,\n"
"QLabel#labelPlanPrice:focus,\n"
"QLabel#labelPlanPrice1:focus,\n"
"QLabel#labelPlanPrice2:focus,\n"
"QLabel#labelPlanPrice3:focus,\n"
"QLabel#next:focus,\n"
"QLabel#labelNext1:focus,\n"
"QLabel#labelNext2:focus,\n"
"QLabel#labelNext3:focus {\n"
"    outline: none;\n"
"    border: none;\n"
"}")
        self.verticalLayout_5 = QVBoxLayout(RentPlanSelection)
        self.verticalLayout_5.setObjectName(u"verticalLayout_5")
        self.verticalLayout_4 = QVBoxLayout()
        self.verticalLayout_4.setSpacing(10)
        self.verticalLayout_4.setObjectName(u"verticalLayout_4")
        self.labelTitle = QLabel(RentPlanSelection)
        self.labelTitle.setObjectName(u"labelTitle")
        self.labelTitle.setMaximumSize(QSize(16777215, 40))

        self.verticalLayout_4.addWidget(self.labelTitle)

        self.labelSizeSelection = QLabel(RentPlanSelection)
        self.labelSizeSelection.setObjectName(u"labelSizeSelection")
        self.labelSizeSelection.setMaximumSize(QSize(16777215, 30))

        self.verticalLayout_4.addWidget(self.labelSizeSelection)

        self.framePlan1 = QFrame(RentPlanSelection)
        self.framePlan1.setObjectName(u"framePlan1")
        self.framePlan1.setFrameShape(QFrame.Shape.StyledPanel)
        self.framePlan1.setFrameShadow(QFrame.Shadow.Raised)
        self.horizontalLayout = QHBoxLayout(self.framePlan1)
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.horizontalLayout.setContentsMargins(20, -1, 20, -1)
        self.verticalLayout = QVBoxLayout()
        self.verticalLayout.setObjectName(u"verticalLayout")
        self.labelPlanTitle1 = QLabel(self.framePlan1)
        self.labelPlanTitle1.setObjectName(u"labelPlanTitle1")

        self.verticalLayout.addWidget(self.labelPlanTitle1)

        self.labelPlanSubtitle1 = QLabel(self.framePlan1)
        self.labelPlanSubtitle1.setObjectName(u"labelPlanSubtitle1")

        self.verticalLayout.addWidget(self.labelPlanSubtitle1)


        self.horizontalLayout.addLayout(self.verticalLayout)

        self.horizontalSpacer = QSpacerItem(470, 20, QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout.addItem(self.horizontalSpacer)

        self.labelPlanPrice = QLabel(self.framePlan1)
        self.labelPlanPrice.setObjectName(u"labelPlanPrice")

        self.horizontalLayout.addWidget(self.labelPlanPrice)

        self.next = QLabel(self.framePlan1)
        self.next.setObjectName(u"next")
        self.next.setPixmap(QPixmap(u":/icons/assets/icon/rentPlantNext.png"))

        self.horizontalLayout.addWidget(self.next)


        self.verticalLayout_4.addWidget(self.framePlan1)

        self.framePlan2 = QFrame(RentPlanSelection)
        self.framePlan2.setObjectName(u"framePlan2")
        self.framePlan2.setFrameShape(QFrame.Shape.StyledPanel)
        self.framePlan2.setFrameShadow(QFrame.Shadow.Raised)
        self.horizontalLayout_2 = QHBoxLayout(self.framePlan2)
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.horizontalLayout_2.setContentsMargins(20, -1, 20, -1)
        self.verticalLayout_2 = QVBoxLayout()
        self.verticalLayout_2.setObjectName(u"verticalLayout_2")
        self.labelPlanTitle2 = QLabel(self.framePlan2)
        self.labelPlanTitle2.setObjectName(u"labelPlanTitle2")

        self.verticalLayout_2.addWidget(self.labelPlanTitle2)

        self.labelPlanSubtitle2 = QLabel(self.framePlan2)
        self.labelPlanSubtitle2.setObjectName(u"labelPlanSubtitle2")

        self.verticalLayout_2.addWidget(self.labelPlanSubtitle2)


        self.horizontalLayout_2.addLayout(self.verticalLayout_2)

        self.horizontalSpacer2 = QSpacerItem(441, 20, QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_2.addItem(self.horizontalSpacer2)

        self.labelPlanPrice2 = QLabel(self.framePlan2)
        self.labelPlanPrice2.setObjectName(u"labelPlanPrice2")

        self.horizontalLayout_2.addWidget(self.labelPlanPrice2)

        self.next2 = QLabel(self.framePlan2)
        self.next2.setObjectName(u"next2")
        self.next2.setPixmap(QPixmap(u":/icons/assets/icon/rentPlantNext.png"))

        self.horizontalLayout_2.addWidget(self.next2)


        self.verticalLayout_4.addWidget(self.framePlan2)

        self.framePlan3 = QFrame(RentPlanSelection)
        self.framePlan3.setObjectName(u"framePlan3")
        self.framePlan3.setFrameShape(QFrame.Shape.StyledPanel)
        self.framePlan3.setFrameShadow(QFrame.Shadow.Raised)
        self.horizontalLayout_3 = QHBoxLayout(self.framePlan3)
        self.horizontalLayout_3.setObjectName(u"horizontalLayout_3")
        self.horizontalLayout_3.setContentsMargins(20, -1, 20, -1)
        self.verticalLayout_3 = QVBoxLayout()
        self.verticalLayout_3.setObjectName(u"verticalLayout_3")
        self.labelPlanTitle3 = QLabel(self.framePlan3)
        self.labelPlanTitle3.setObjectName(u"labelPlanTitle3")

        self.verticalLayout_3.addWidget(self.labelPlanTitle3)

        self.labelPlanSubtitle3 = QLabel(self.framePlan3)
        self.labelPlanSubtitle3.setObjectName(u"labelPlanSubtitle3")

        self.verticalLayout_3.addWidget(self.labelPlanSubtitle3)


        self.horizontalLayout_3.addLayout(self.verticalLayout_3)

        self.horizontalSpacer3 = QSpacerItem(441, 20, QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_3.addItem(self.horizontalSpacer3)

        self.labelPlanPrice3 = QLabel(self.framePlan3)
        self.labelPlanPrice3.setObjectName(u"labelPlanPrice3")

        self.horizontalLayout_3.addWidget(self.labelPlanPrice3)

        self.next3 = QLabel(self.framePlan3)
        self.next3.setObjectName(u"next3")
        self.next3.setPixmap(QPixmap(u":/icons/assets/icon/rentPlantNext.png"))

        self.horizontalLayout_3.addWidget(self.next3)


        self.verticalLayout_4.addWidget(self.framePlan3)


        self.verticalLayout_5.addLayout(self.verticalLayout_4)

        self.framePlan1.raise_()
        self.labelSizeSelection.raise_()
        self.framePlan2.raise_()
        self.framePlan3.raise_()

        self.retranslateUi(RentPlanSelection)

        QMetaObject.connectSlotsByName(RentPlanSelection)
    # setupUi

    def retranslateUi(self, RentPlanSelection):
        RentPlanSelection.setWindowTitle(QCoreApplication.translate("RentPlanSelection", u"Form", None))
        self.labelTitle.setText(QCoreApplication.translate("RentPlanSelection", u"Ch\u1ecdn g\u00f3i thu\u00ea ph\u00f9 h\u1ee3p v\u1edbi b\u1ea1n", None))
        self.labelSizeSelection.setText(QCoreApplication.translate("RentPlanSelection", u"B\u1ea1n \u0111\u00e3 ch\u1ecdn Size 1", None))
        self.labelPlanTitle1.setText(QCoreApplication.translate("RentPlanSelection", u"Thu\u00ea theo l\u01b0\u1ee3t", None))
        self.labelPlanSubtitle1.setText(QCoreApplication.translate("RentPlanSelection", u"M\u1ed9t l\u1ea7n g\u1eedi", None))
        self.labelPlanPrice.setText(QCoreApplication.translate("RentPlanSelection", u"15.000\u0111", None))
        self.next.setText("")
        self.labelPlanTitle2.setText(QCoreApplication.translate("RentPlanSelection", u"Thu\u00ea nhi\u1ec1u l\u01b0\u1ee3t", None))
        self.labelPlanSubtitle2.setText(QCoreApplication.translate("RentPlanSelection", u"M\u1ed9t l\u1ea7n g\u1eedi", None))
        self.labelPlanPrice2.setText(QCoreApplication.translate("RentPlanSelection", u"120.000\u0111", None))
        self.next2.setText("")
        self.labelPlanTitle3.setText(QCoreApplication.translate("RentPlanSelection", u"Thu\u00ea theo th\u00e1ng", None))
        self.labelPlanSubtitle3.setText(QCoreApplication.translate("RentPlanSelection", u"M\u1ed9t l\u1ea7n g\u1eedi", None))
        self.labelPlanPrice3.setText(QCoreApplication.translate("RentPlanSelection", u"450.000\u0111", None))
        self.next3.setText("")
    # retranslateUi

