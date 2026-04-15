# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'RentSuccessfull.ui'
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

class Ui_RentSuccessfull(object):
    def setupUi(self, RentSuccessfull):
        if not RentSuccessfull.objectName():
            RentSuccessfull.setObjectName(u"RentSuccessfull")
        RentSuccessfull.resize(800, 360)
        RentSuccessfull.setMaximumSize(QSize(800, 360))
        RentSuccessfull.setStyleSheet(u"#RentSuccessfull {background-color: black}\n"
"\n"
"QLabel#labelTitle {\n"
"    color: #F3F1F1;\n"
"    font-size: 28px;\n"
"    font-weight: 800;\n"
"    background: transparent;\n"
"}\n"
"\n"
"QLabel#labelSubtitle {\n"
"    color: #D8B7A7;\n"
"    font-size: 16px;\n"
"    font-weight: 600;\n"
"    background: transparent;\n"
"}\n"
"\n"
"QFrame#pinFrame {\n"
"    background-color: #232327;\n"
"    border: 1px solid rgba(255, 255, 255, 0.06);\n"
"    border-radius: 18px;\n"
"}\n"
"\n"
"QLabel#labelTitlePin {\n"
"    color: #E0B9A5;\n"
"    font-size: 14px;\n"
"    font-weight: 700;\n"
"    background: transparent;\n"
"}\n"
"\n"
"QLabel#labelPinShow {\n"
"    color: #FF7A00;\n"
"    font-size: 42px;\n"
"    font-weight: 900;\n"
"    background: transparent;\n"
"}\n"
"QPushButton#useLater {\n"
"    background-color: #2D2D31;\n"
"    color: #F2B18A;\n"
"    border: 1px solid rgba(255, 122, 0, 0.55);\n"
"    border-radius: 14px;\n"
"    font-size: 16px;\n"
"    font-weight: 700;\n"
"    padding: 10px 18px;\n"
"   "
                        " text-align: center;\n"
"}\n"
"\n"
"QPushButton#useLater:hover {\n"
"    background-color: #35353A;\n"
"    border: 1px solid rgba(255, 122, 0, 0.8);\n"
"}\n"
"\n"
"QPushButton#useLater:pressed {\n"
"    background-color: #252529;\n"
"    border: 1px solid rgba(255, 122, 0, 0.95);\n"
"}\n"
"\n"
"QPushButton#useLater:disabled {\n"
"    background-color: #242428;\n"
"    color: rgba(242, 177, 138, 0.45);\n"
"    border: 1px solid rgba(255, 122, 0, 0.2);\n"
"}\n"
"\n"
"\n"
"QPushButton#useNow {\n"
"    background-color: #45C96F;\n"
"    color: #FFFFFF;\n"
"    border: none;\n"
"    border-radius: 14px;\n"
"    font-size: 16px;\n"
"    font-weight: 800;\n"
"    padding: 10px 18px;\n"
"    text-align: center;\n"
"}\n"
"\n"
"QFrame#IconBox {\n"
"    background-color: rgba(7, 24, 18, 0.85);\n"
"    border: 2px solid rgba(40, 180, 110, 0.35);\n"
"    border-radius: 20px;\n"
"}\n"
"\n"
"\n"
"QPushButton#useNow:hover {\n"
"    background-color: #52D97D;\n"
"}\n"
"\n"
"QPushButton#useNow:pressed {\n"
"    background-colo"
                        "r: #38B862;\n"
"}\n"
"\n"
"QPushButton#useNow:disabled {\n"
"    background-color: #2E7F49;\n"
"    color: rgba(255, 255, 255, 0.5);\n"
"}")
        self.verticalLayout_2 = QVBoxLayout(RentSuccessfull)
        self.verticalLayout_2.setObjectName(u"verticalLayout_2")
        self.verticalLayout = QVBoxLayout()
        self.verticalLayout.setSpacing(10)
        self.verticalLayout.setObjectName(u"verticalLayout")
        self.verticalLayout.setContentsMargins(20, 10, 20, 20)
        self.horizontalLayout_2 = QHBoxLayout()
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.horizontalSpacer_2 = QSpacerItem(40, 20, QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_2.addItem(self.horizontalSpacer_2)

        self.IconBox = QFrame(RentSuccessfull)
        self.IconBox.setObjectName(u"IconBox")
        self.IconBox.setMaximumSize(QSize(80, 45))
        font = QFont()
        font.setStyleStrategy(QFont.PreferDefault)
        self.IconBox.setFont(font)
        self.IconBox.setFrameShape(QFrame.Shape.StyledPanel)
        self.IconBox.setFrameShadow(QFrame.Shadow.Raised)
        self.horizontalLayout = QHBoxLayout(self.IconBox)
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.Icon = QLabel(self.IconBox)
        self.Icon.setObjectName(u"Icon")
        self.Icon.setPixmap(QPixmap(u":/icons/assets/icon/SuccessfullIcon.png"))
        self.Icon.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout.addWidget(self.Icon)


        self.horizontalLayout_2.addWidget(self.IconBox)

        self.horizontalSpacer_3 = QSpacerItem(40, 20, QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_2.addItem(self.horizontalSpacer_3)


        self.verticalLayout.addLayout(self.horizontalLayout_2)

        self.labelTitle = QLabel(RentSuccessfull)
        self.labelTitle.setObjectName(u"labelTitle")
        self.labelTitle.setMaximumSize(QSize(16777215, 40))
        self.labelTitle.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout.addWidget(self.labelTitle)

        self.labelSubtitle = QLabel(RentSuccessfull)
        self.labelSubtitle.setObjectName(u"labelSubtitle")
        self.labelSubtitle.setMaximumSize(QSize(16777215, 19))
        self.labelSubtitle.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout.addWidget(self.labelSubtitle)

        self.pinFrame = QFrame(RentSuccessfull)
        self.pinFrame.setObjectName(u"pinFrame")
        self.pinFrame.setMaximumSize(QSize(16777215, 121))
        self.pinFrame.setFrameShape(QFrame.Shape.StyledPanel)
        self.pinFrame.setFrameShadow(QFrame.Shadow.Raised)
        self.verticalLayout_4 = QVBoxLayout(self.pinFrame)
        self.verticalLayout_4.setObjectName(u"verticalLayout_4")
        self.verticalLayout_3 = QVBoxLayout()
        self.verticalLayout_3.setObjectName(u"verticalLayout_3")
        self.labelTitlePin = QLabel(self.pinFrame)
        self.labelTitlePin.setObjectName(u"labelTitlePin")
        self.labelTitlePin.setScaledContents(False)
        self.labelTitlePin.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout_3.addWidget(self.labelTitlePin)

        self.labelPinShow = QLabel(self.pinFrame)
        self.labelPinShow.setObjectName(u"labelPinShow")
        self.labelPinShow.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout_3.addWidget(self.labelPinShow)


        self.verticalLayout_4.addLayout(self.verticalLayout_3)


        self.verticalLayout.addWidget(self.pinFrame)

        self.btn = QHBoxLayout()
        self.btn.setObjectName(u"btn")
        self.useLater = QPushButton(RentSuccessfull)
        self.useLater.setObjectName(u"useLater")
        self.useLater.setMinimumSize(QSize(190, 50))
        self.useLater.setMaximumSize(QSize(190, 50))
        icon = QIcon()
        icon.addFile(u":/icons/assets/icon/UsingLaterIcon.png", QSize(), QIcon.Mode.Normal, QIcon.State.Off)
        self.useLater.setIcon(icon)

        self.btn.addWidget(self.useLater)

        self.horizontalSpacer = QSpacerItem(150, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.btn.addItem(self.horizontalSpacer)

        self.useNow = QPushButton(RentSuccessfull)
        self.useNow.setObjectName(u"useNow")
        self.useNow.setMinimumSize(QSize(190, 50))
        self.useNow.setMaximumSize(QSize(190, 50))
        icon1 = QIcon()
        icon1.addFile(u":/icons/assets/icon/OpenNowIcon.png", QSize(), QIcon.Mode.Normal, QIcon.State.Off)
        self.useNow.setIcon(icon1)

        self.btn.addWidget(self.useNow)


        self.verticalLayout.addLayout(self.btn)


        self.verticalLayout_2.addLayout(self.verticalLayout)


        self.retranslateUi(RentSuccessfull)

        QMetaObject.connectSlotsByName(RentSuccessfull)
    # setupUi

    def retranslateUi(self, RentSuccessfull):
        RentSuccessfull.setWindowTitle(QCoreApplication.translate("RentSuccessfull", u"Form", None))
        self.Icon.setText("")
        self.labelTitle.setText(QCoreApplication.translate("RentSuccessfull", u"Thu\u00ea t\u1ee7 th\u00e0nh c\u00f4ng", None))
        self.labelSubtitle.setText(QCoreApplication.translate("RentSuccessfull", u"T\u1ee7 Size 1", None))
        self.labelTitlePin.setText(QCoreApplication.translate("RentSuccessfull", u"M\u00e3 pin c\u1ee7a b\u1ea1n", None))
        self.labelPinShow.setText(QCoreApplication.translate("RentSuccessfull", u"123456", None))
        self.useLater.setText(QCoreApplication.translate("RentSuccessfull", u"D\u00f9ng sau", None))
        self.useNow.setText(QCoreApplication.translate("RentSuccessfull", u"M\u1edf ngay", None))
    # retranslateUi

