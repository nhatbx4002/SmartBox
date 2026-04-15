# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'Home.ui'
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
from PySide6.QtWidgets import (QApplication, QFrame, QGridLayout, QHBoxLayout,
    QLabel, QSizePolicy, QSpacerItem, QVBoxLayout,
    QWidget)
import resources_rc

class Ui_Home(object):
    def setupUi(self, Home):
        if not Home.objectName():
            Home.setObjectName(u"Home")
        Home.resize(800, 360)
        Home.setMinimumSize(QSize(800, 360))
        Home.setMaximumSize(QSize(800, 360))
        Home.setStyleSheet(u"#Home{background-color:#0A0A0A}")
        self.gridLayout_2 = QGridLayout(Home)
        self.gridLayout_2.setObjectName(u"gridLayout_2")
        self.gridLayout = QGridLayout()
        self.gridLayout.setSpacing(10)
        self.gridLayout.setObjectName(u"gridLayout")
        self.gridLayout.setContentsMargins(16, 16, 16, 16)
        self.cardSend = QFrame(Home)
        self.cardSend.setObjectName(u"cardSend")
        self.cardSend.setMinimumSize(QSize(370, 150))
        self.cardSend.setMaximumSize(QSize(370, 150))
        self.cardSend.setStyleSheet(u"QFrame#cardSend{background-color:#FF6600;border-radius: 24px}\n"
"\n"
"QFrame#iconBoxSend{background-color: rgba(255,255,255,0.12);\n"
"border-radius: 18px;border: 1px solid rgba(255,255,255,0.08)}\n"
"#labelSend{\n"
"	color: white;\n"
"    font-size: 19px;\n"
"    font-weight: 700;\n"
"    letter-spacing: 1px;\n"
"    background: transparent;\n"
"}")
        self.cardSend.setFrameShape(QFrame.Shape.StyledPanel)
        self.cardSend.setFrameShadow(QFrame.Shadow.Raised)
        self.verticalLayout_2 = QVBoxLayout(self.cardSend)
        self.verticalLayout_2.setObjectName(u"verticalLayout_2")
        self.horizontalLayout_3 = QHBoxLayout()
        self.horizontalLayout_3.setObjectName(u"horizontalLayout_3")
        self.horizontalSpacer_2 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_3.addItem(self.horizontalSpacer_2)

        self.iconBoxSend = QFrame(self.cardSend)
        self.iconBoxSend.setObjectName(u"iconBoxSend")
        self.iconBoxSend.setFrameShape(QFrame.Shape.NoFrame)
        self.iconBoxSend.setFrameShadow(QFrame.Shadow.Raised)
        self.horizontalLayout_2 = QHBoxLayout(self.iconBoxSend)
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.horizontalLayout = QHBoxLayout()
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.label = QLabel(self.iconBoxSend)
        self.label.setObjectName(u"label")
        self.label.setPixmap(QPixmap(u":/icons/assets/icon/SendIcon.png"))
        self.label.setScaledContents(False)
        self.label.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout.addWidget(self.label)


        self.horizontalLayout_2.addLayout(self.horizontalLayout)


        self.horizontalLayout_3.addWidget(self.iconBoxSend)

        self.horizontalSpacer_3 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_3.addItem(self.horizontalSpacer_3)


        self.verticalLayout_2.addLayout(self.horizontalLayout_3)

        self.horizontalLayout_4 = QHBoxLayout()
        self.horizontalLayout_4.setObjectName(u"horizontalLayout_4")
        self.horizontalSpacer_4 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_4.addItem(self.horizontalSpacer_4)

        self.labelSend = QLabel(self.cardSend)
        self.labelSend.setObjectName(u"labelSend")
        self.labelSend.setTextFormat(Qt.TextFormat.AutoText)
        self.labelSend.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_4.addWidget(self.labelSend)

        self.horizontalSpacer_5 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_4.addItem(self.horizontalSpacer_5)


        self.verticalLayout_2.addLayout(self.horizontalLayout_4)


        self.gridLayout.addWidget(self.cardSend, 0, 0, 1, 1)

        self.cardReceive = QFrame(Home)
        self.cardReceive.setObjectName(u"cardReceive")
        self.cardReceive.setMinimumSize(QSize(370, 150))
        self.cardReceive.setMaximumSize(QSize(370, 150))
        self.cardReceive.setStyleSheet(u"QFrame#cardReceive{background-color:#1565C0;border-radius: 24px}\n"
"\n"
"QFrame#iconBoxReceive{background-color: rgba(255,255,255,0.12);\n"
"border-radius: 18px;border: 1px solid rgba(255,255,255,0.08)}\n"
"#labelReceive{\n"
"	color: white;\n"
"    font-size: 19px;\n"
"    font-weight: 700;\n"
"    letter-spacing: 1px;\n"
"    background: transparent;\n"
"}")
        self.cardReceive.setFrameShape(QFrame.Shape.StyledPanel)
        self.cardReceive.setFrameShadow(QFrame.Shadow.Raised)
        self.verticalLayout_3 = QVBoxLayout(self.cardReceive)
        self.verticalLayout_3.setObjectName(u"verticalLayout_3")
        self.horizontalLayout_5 = QHBoxLayout()
        self.horizontalLayout_5.setObjectName(u"horizontalLayout_5")
        self.horizontalSpacer_6 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_5.addItem(self.horizontalSpacer_6)

        self.iconBoxReceive = QFrame(self.cardReceive)
        self.iconBoxReceive.setObjectName(u"iconBoxReceive")
        self.iconBoxReceive.setFrameShape(QFrame.Shape.NoFrame)
        self.iconBoxReceive.setFrameShadow(QFrame.Shadow.Raised)
        self.horizontalLayout_6 = QHBoxLayout(self.iconBoxReceive)
        self.horizontalLayout_6.setObjectName(u"horizontalLayout_6")
        self.horizontalLayout_7 = QHBoxLayout()
        self.horizontalLayout_7.setObjectName(u"horizontalLayout_7")
        self.iconReceive = QLabel(self.iconBoxReceive)
        self.iconReceive.setObjectName(u"iconReceive")
        self.iconReceive.setPixmap(QPixmap(u":/assets/icon/ReceiveIcon.png"))
        self.iconReceive.setScaledContents(False)
        self.iconReceive.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_7.addWidget(self.iconReceive)


        self.horizontalLayout_6.addLayout(self.horizontalLayout_7)


        self.horizontalLayout_5.addWidget(self.iconBoxReceive)

        self.horizontalSpacer_7 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_5.addItem(self.horizontalSpacer_7)


        self.verticalLayout_3.addLayout(self.horizontalLayout_5)

        self.horizontalLayout_8 = QHBoxLayout()
        self.horizontalLayout_8.setObjectName(u"horizontalLayout_8")
        self.horizontalSpacer_8 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_8.addItem(self.horizontalSpacer_8)

        self.labelReceive = QLabel(self.cardReceive)
        self.labelReceive.setObjectName(u"labelReceive")
        self.labelReceive.setTextFormat(Qt.TextFormat.AutoText)
        self.labelReceive.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_8.addWidget(self.labelReceive)

        self.horizontalSpacer_9 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_8.addItem(self.horizontalSpacer_9)


        self.verticalLayout_3.addLayout(self.horizontalLayout_8)


        self.gridLayout.addWidget(self.cardReceive, 0, 1, 1, 1)

        self.cardRent = QFrame(Home)
        self.cardRent.setObjectName(u"cardRent")
        self.cardRent.setMinimumSize(QSize(370, 150))
        self.cardRent.setMaximumSize(QSize(370, 150))
        self.cardRent.setStyleSheet(u"QFrame#cardRent{background-color:#2E7D32;border-radius: 24px}\n"
"\n"
"QFrame#iconBoxRent{background-color: rgba(255,255,255,0.12);\n"
"border-radius: 18px;border: 1px solid rgba(255,255,255,0.08)}\n"
"#labelRent{\n"
"	color: white;\n"
"    font-size: 19px;\n"
"    font-weight: 700;\n"
"    letter-spacing: 1px;\n"
"    background: transparent;\n"
"}")
        self.cardRent.setFrameShape(QFrame.Shape.StyledPanel)
        self.cardRent.setFrameShadow(QFrame.Shadow.Raised)
        self.verticalLayout_4 = QVBoxLayout(self.cardRent)
        self.verticalLayout_4.setObjectName(u"verticalLayout_4")
        self.horizontalLayout_9 = QHBoxLayout()
        self.horizontalLayout_9.setObjectName(u"horizontalLayout_9")
        self.horizontalSpacer_10 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_9.addItem(self.horizontalSpacer_10)

        self.iconBoxRent = QFrame(self.cardRent)
        self.iconBoxRent.setObjectName(u"iconBoxRent")
        self.iconBoxRent.setFrameShape(QFrame.Shape.NoFrame)
        self.iconBoxRent.setFrameShadow(QFrame.Shadow.Raised)
        self.horizontalLayout_10 = QHBoxLayout(self.iconBoxRent)
        self.horizontalLayout_10.setObjectName(u"horizontalLayout_10")
        self.horizontalLayout_11 = QHBoxLayout()
        self.horizontalLayout_11.setObjectName(u"horizontalLayout_11")
        self.iconRent = QLabel(self.iconBoxRent)
        self.iconRent.setObjectName(u"iconRent")
        self.iconRent.setPixmap(QPixmap(u":/icons/assets/icon/RentIcon.png"))
        self.iconRent.setScaledContents(False)
        self.iconRent.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_11.addWidget(self.iconRent)


        self.horizontalLayout_10.addLayout(self.horizontalLayout_11)


        self.horizontalLayout_9.addWidget(self.iconBoxRent)

        self.horizontalSpacer_11 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_9.addItem(self.horizontalSpacer_11)


        self.verticalLayout_4.addLayout(self.horizontalLayout_9)

        self.horizontalLayout_12 = QHBoxLayout()
        self.horizontalLayout_12.setObjectName(u"horizontalLayout_12")
        self.horizontalSpacer_12 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_12.addItem(self.horizontalSpacer_12)

        self.labelRent = QLabel(self.cardRent)
        self.labelRent.setObjectName(u"labelRent")
        self.labelRent.setTextFormat(Qt.TextFormat.AutoText)
        self.labelRent.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_12.addWidget(self.labelRent)

        self.horizontalSpacer_13 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_12.addItem(self.horizontalSpacer_13)


        self.verticalLayout_4.addLayout(self.horizontalLayout_12)


        self.gridLayout.addWidget(self.cardRent, 1, 0, 1, 1)

        self.cardSupport = QFrame(Home)
        self.cardSupport.setObjectName(u"cardSupport")
        self.cardSupport.setMinimumSize(QSize(370, 150))
        self.cardSupport.setMaximumSize(QSize(370, 150))
        self.cardSupport.setStyleSheet(u"QFrame#cardSupport{background-color:#2A2A2A;border-radius: 24px}\n"
"\n"
"QFrame#iconBoxSupport{background-color: rgba(255,255,255,0.12);\n"
"border-radius: 18px;border: 1px solid rgba(255,255,255,0.08)}\n"
"#labelSupport{\n"
"	color: white;\n"
"    font-size: 19px;\n"
"    font-weight: 700;\n"
"    letter-spacing: 1px;\n"
"    background: transparent;\n"
"}")
        self.cardSupport.setFrameShape(QFrame.Shape.StyledPanel)
        self.cardSupport.setFrameShadow(QFrame.Shadow.Raised)
        self.verticalLayout_5 = QVBoxLayout(self.cardSupport)
        self.verticalLayout_5.setObjectName(u"verticalLayout_5")
        self.horizontalLayout_13 = QHBoxLayout()
        self.horizontalLayout_13.setObjectName(u"horizontalLayout_13")
        self.horizontalSpacer_14 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_13.addItem(self.horizontalSpacer_14)

        self.iconBoxSupport = QFrame(self.cardSupport)
        self.iconBoxSupport.setObjectName(u"iconBoxSupport")
        self.iconBoxSupport.setFrameShape(QFrame.Shape.NoFrame)
        self.iconBoxSupport.setFrameShadow(QFrame.Shadow.Raised)
        self.horizontalLayout_14 = QHBoxLayout(self.iconBoxSupport)
        self.horizontalLayout_14.setObjectName(u"horizontalLayout_14")
        self.horizontalLayout_15 = QHBoxLayout()
        self.horizontalLayout_15.setObjectName(u"horizontalLayout_15")
        self.iconSupport = QLabel(self.iconBoxSupport)
        self.iconSupport.setObjectName(u"iconSupport")
        self.iconSupport.setPixmap(QPixmap(u":/icons/assets/icon/supportIcon.png"))
        self.iconSupport.setScaledContents(False)
        self.iconSupport.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_15.addWidget(self.iconSupport)


        self.horizontalLayout_14.addLayout(self.horizontalLayout_15)


        self.horizontalLayout_13.addWidget(self.iconBoxSupport)

        self.horizontalSpacer_15 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_13.addItem(self.horizontalSpacer_15)


        self.verticalLayout_5.addLayout(self.horizontalLayout_13)

        self.horizontalLayout_16 = QHBoxLayout()
        self.horizontalLayout_16.setObjectName(u"horizontalLayout_16")
        self.horizontalSpacer_16 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_16.addItem(self.horizontalSpacer_16)

        self.labelSupport = QLabel(self.cardSupport)
        self.labelSupport.setObjectName(u"labelSupport")
        self.labelSupport.setTextFormat(Qt.TextFormat.AutoText)
        self.labelSupport.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_16.addWidget(self.labelSupport)

        self.horizontalSpacer_17 = QSpacerItem(120, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_16.addItem(self.horizontalSpacer_17)


        self.verticalLayout_5.addLayout(self.horizontalLayout_16)


        self.gridLayout.addWidget(self.cardSupport, 1, 1, 1, 1)


        self.gridLayout_2.addLayout(self.gridLayout, 0, 0, 1, 1)


        self.retranslateUi(Home)

        QMetaObject.connectSlotsByName(Home)
    # setupUi

    def retranslateUi(self, Home):
        Home.setWindowTitle(QCoreApplication.translate("Home", u"Form", None))
        self.label.setText("")
        self.labelSend.setText(QCoreApplication.translate("Home", u"G\u1eedi H\u00e0ng", None))
        self.iconReceive.setText("")
        self.labelReceive.setText(QCoreApplication.translate("Home", u"Nh\u1eadn h\u00e0ng", None))
        self.iconRent.setText("")
        self.labelRent.setText(QCoreApplication.translate("Home", u"Thu\u00ea T\u1ee7", None))
        self.iconSupport.setText("")
        self.labelSupport.setText(QCoreApplication.translate("Home", u"H\u1ed7 tr\u1ee3", None))
    # retranslateUi

