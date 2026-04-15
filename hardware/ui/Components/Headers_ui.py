# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'Headers.ui'
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
from PySide6.QtWidgets import (QApplication, QHBoxLayout, QLabel, QSizePolicy,
    QSpacerItem, QWidget)
import resources_rc

class Ui_Headers(object):
    def setupUi(self, Headers):
        if not Headers.objectName():
            Headers.setObjectName(u"Headers")
        Headers.resize(800, 60)
        Headers.setStyleSheet(u"#Headers {\n"
"    background-color: #0d0d0d;\n"
"    border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n"
"}\n"
"\n"
"/* Logo text: SmartBox */\n"
"#labelAppName {\n"
"    color: #ffb38a;\n"
"    font-size: 20px;\n"
"    font-weight: 600;\n"
"}\n"
"\n"
"/* SYSTEM text */\n"
"#labelSystem {\n"
"    color: #ff6a00;\n"
"    font-size: 18px;\n"
"    font-weight: bold;\n"
"    letter-spacing: 2px;\n"
"}\n"
"\n"
"/* Time */\n"
"#labelTime{\n"
"    color: #ffffff;\n"
"    font-size: 18px;\n"
"    font-weight: 500;\n"
"}\n"
"\n"
"/* Optional: icon b\u00ean tr\u00e1i */\n"
"#iconApp {\n"
"    background: transparent;\n"
"}")
        self.horizontalLayout_3 = QHBoxLayout(Headers)
        self.horizontalLayout_3.setObjectName(u"horizontalLayout_3")
        self.horizontalLayout_2 = QHBoxLayout()
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.horizontalLayout = QHBoxLayout()
        self.horizontalLayout.setSpacing(20)
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.iconApp = QLabel(Headers)
        self.iconApp.setObjectName(u"iconApp")
        sizePolicy = QSizePolicy(QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.iconApp.sizePolicy().hasHeightForWidth())
        self.iconApp.setSizePolicy(sizePolicy)
        self.iconApp.setMinimumSize(QSize(24, 24))
        self.iconApp.setMaximumSize(QSize(40, 40))
        self.iconApp.setPixmap(QPixmap(u":/assets/icon/headerIcon.png"))
        self.iconApp.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout.addWidget(self.iconApp)

        self.labelAppName = QLabel(Headers)
        self.labelAppName.setObjectName(u"labelAppName")
        sizePolicy1 = QSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        sizePolicy1.setHorizontalStretch(0)
        sizePolicy1.setVerticalStretch(0)
        sizePolicy1.setHeightForWidth(self.labelAppName.sizePolicy().hasHeightForWidth())
        self.labelAppName.setSizePolicy(sizePolicy1)
        self.labelAppName.setMinimumSize(QSize(0, 17))
        self.labelAppName.setMaximumSize(QSize(16777215, 17))
        font = QFont()
        font.setWeight(QFont.DemiBold)
        self.labelAppName.setFont(font)
        self.labelAppName.setLayoutDirection(Qt.LayoutDirection.LeftToRight)
        self.labelAppName.setAlignment(Qt.AlignmentFlag.AlignLeading|Qt.AlignmentFlag.AlignLeft|Qt.AlignmentFlag.AlignVCenter)

        self.horizontalLayout.addWidget(self.labelAppName)

        self.horizontalSpacer = QSpacerItem(450, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout.addItem(self.horizontalSpacer)


        self.horizontalLayout_2.addLayout(self.horizontalLayout)

        self.labelSystem = QLabel(Headers)
        self.labelSystem.setObjectName(u"labelSystem")

        self.horizontalLayout_2.addWidget(self.labelSystem)

        self.labelTime = QLabel(Headers)
        self.labelTime.setObjectName(u"labelTime")
        self.labelTime.setMinimumSize(QSize(75, 0))

        self.horizontalLayout_2.addWidget(self.labelTime)


        self.horizontalLayout_3.addLayout(self.horizontalLayout_2)


        self.retranslateUi(Headers)

        QMetaObject.connectSlotsByName(Headers)
    # setupUi

    def retranslateUi(self, Headers):
        Headers.setWindowTitle(QCoreApplication.translate("Headers", u"Form", None))
        self.iconApp.setText("")
        self.labelAppName.setText(QCoreApplication.translate("Headers", u"SmartBox", None))
        self.labelSystem.setText(QCoreApplication.translate("Headers", u"SYSTEM", None))
        self.labelTime.setText(QCoreApplication.translate("Headers", u"12:45 PM", None))
    # retranslateUi

