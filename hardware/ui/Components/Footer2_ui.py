# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'Footer2.ui'
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
from PySide6.QtWidgets import (QApplication, QHBoxLayout, QPushButton, QSizePolicy,
    QSpacerItem, QWidget)
import resources_rc

class Ui_Footer2(object):
    def setupUi(self, Footer2):
        if not Footer2.objectName():
            Footer2.setObjectName(u"Footer2")
        Footer2.resize(800, 60)
        Footer2.setMinimumSize(QSize(800, 60))
        Footer2.setStyleSheet(u"#Footer2{background-color:#0A0A0A; border-top: 1px solid #222;}\n"
"#btnBack {\n"
"    color: white;\n"
"    border-radius: 10px;\n"
"    padding: 10px 20px;\n"
"    font-weight: bold;\n"
"}\n"
"#btnBack:hover {\n"
"    background-color: #FFB36B;\n"
"}\n"
"#btnHome {\n"
"    color: white;\n"
"    border-radius: 10px;\n"
"    padding: 10px 20px;\n"
"    font-weight: bold;\n"
"}\n"
"#btnHome:hover {\n"
"    background-color: #FFB36B;\n"
"}")
        self.horizontalLayout_2 = QHBoxLayout(Footer2)
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.horizontalLayout = QHBoxLayout()
        self.horizontalLayout.setSpacing(10)
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.horizontalLayout.setContentsMargins(40, -1, 40, -1)
        self.btnBack = QPushButton(Footer2)
        self.btnBack.setObjectName(u"btnBack")
        icon = QIcon()
        icon.addFile(u":/assets/icon/BackIcon.png", QSize(), QIcon.Mode.Normal, QIcon.State.Off)
        self.btnBack.setIcon(icon)
        self.btnBack.setIconSize(QSize(20, 20))

        self.horizontalLayout.addWidget(self.btnBack)

        self.horizontalSpacer = QSpacerItem(400, 20, QSizePolicy.Policy.MinimumExpanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout.addItem(self.horizontalSpacer)

        self.btnHome = QPushButton(Footer2)
        self.btnHome.setObjectName(u"btnHome")
        icon1 = QIcon()
        icon1.addFile(u":/assets/icon/HomeIcon.png", QSize(), QIcon.Mode.Normal, QIcon.State.Off)
        self.btnHome.setIcon(icon1)
        self.btnHome.setIconSize(QSize(16, 16))

        self.horizontalLayout.addWidget(self.btnHome)


        self.horizontalLayout_2.addLayout(self.horizontalLayout)


        self.retranslateUi(Footer2)

        QMetaObject.connectSlotsByName(Footer2)
    # setupUi

    def retranslateUi(self, Footer2):
        Footer2.setWindowTitle(QCoreApplication.translate("Footer2", u"Form", None))
        self.btnBack.setText(QCoreApplication.translate("Footer2", u"Quay l\u1ea1i", None))
        self.btnHome.setText(QCoreApplication.translate("Footer2", u"Trang ch\u00ednh", None))
    # retranslateUi

