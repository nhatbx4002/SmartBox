# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'SizeSelection.ui'
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

class Ui_SizeSelection(object):
    def setupUi(self, SizeSelection):
        if not SizeSelection.objectName():
            SizeSelection.setObjectName(u"SizeSelection")
        SizeSelection.resize(800, 355)
        SizeSelection.setStyleSheet(u"#SizeSelection{background-color:#0A0A0A}\n"
"#labelSubTitle {\n"
"    color: #A0A0A0;\n"
"    font-size: 13px;\n"
"    letter-spacing: 1px;\n"
"}\n"
"#labelTitle{\n"
"    color: #EAEAEA;\n"
"    font-size: 28px;\n"
"    font-weight: 600;\n"
"}")
        self.verticalLayout_9 = QVBoxLayout(SizeSelection)
        self.verticalLayout_9.setObjectName(u"verticalLayout_9")
        self.verticalLayout_8 = QVBoxLayout()
        self.verticalLayout_8.setSpacing(10)
        self.verticalLayout_8.setObjectName(u"verticalLayout_8")
        self.verticalLayout_8.setContentsMargins(-1, 10, -1, 10)
        self.labelTitle = QLabel(SizeSelection)
        self.labelTitle.setObjectName(u"labelTitle")
        self.labelTitle.setMaximumSize(QSize(16777215, 30))
        self.labelTitle.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout_8.addWidget(self.labelTitle)

        self.labelSubTitle = QLabel(SizeSelection)
        self.labelSubTitle.setObjectName(u"labelSubTitle")
        self.labelSubTitle.setMaximumSize(QSize(16777215, 30))
        self.labelSubTitle.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout_8.addWidget(self.labelSubTitle)

        self.horizontalLayout_5 = QHBoxLayout()
        self.horizontalLayout_5.setObjectName(u"horizontalLayout_5")
        self.cardSize1 = QFrame(SizeSelection)
        self.cardSize1.setObjectName(u"cardSize1")
        self.cardSize1.setStyleSheet(u"#cardSize1 {\n"
"    background-color: #111;\n"
"    border: 2px solid #2D9CDB;\n"
"    border-radius: 16px;\n"
"}\n"
"#cardSize1:hover {\n"
"    border: 2px solid #56CCF2;\n"
"}\n"
"#badgeSize1{\n"
"    background-color: rgba(45, 156, 219, 0.2);\n"
"    color: #2D9CDB;\n"
"    padding: 4px 10px;\n"
"    border-radius: 10px;\n"
"    font-weight: bold;\n"
"}\n"
"#iconSize1 {\n"
"    background-color: rgba(45, 156, 219, 0.15);\n"
"    border-radius: 12px;\n"
"    padding: 20px;\n"
"}\n"
"#titleSize1{\n"
"    color: white;\n"
"    font-size: 20px;\n"
"    font-weight: bold;\n"
"}\n"
"#dimension1 {\n"
"    color: #AAA;\n"
"    font-size: 12px;\n"
"}")
        self.cardSize1.setFrameShape(QFrame.Shape.StyledPanel)
        self.cardSize1.setFrameShadow(QFrame.Shadow.Raised)
        self.verticalLayout_4 = QVBoxLayout(self.cardSize1)
        self.verticalLayout_4.setObjectName(u"verticalLayout_4")
        self.verticalLayout_3 = QVBoxLayout()
        self.verticalLayout_3.setObjectName(u"verticalLayout_3")
        self.horizontalLayout_2 = QHBoxLayout()
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.badgeSize1 = QLabel(self.cardSize1)
        self.badgeSize1.setObjectName(u"badgeSize1")
        self.badgeSize1.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_2.addWidget(self.badgeSize1)

        self.horizontalSpacer_3 = QSpacerItem(245, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_2.addItem(self.horizontalSpacer_3)


        self.verticalLayout_3.addLayout(self.horizontalLayout_2)

        self.horizontalLayout = QHBoxLayout()
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.horizontalSpacer = QSpacerItem(40, 20, QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout.addItem(self.horizontalSpacer)

        self.verticalLayout = QVBoxLayout()
        self.verticalLayout.setObjectName(u"verticalLayout")
        self.iconSize1 = QLabel(self.cardSize1)
        self.iconSize1.setObjectName(u"iconSize1")
        self.iconSize1.setMaximumSize(QSize(88, 88))
        self.iconSize1.setPixmap(QPixmap(u":/icons/assets/icon/SmallIcon.png"))
        self.iconSize1.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout.addWidget(self.iconSize1)

        self.titleSize1 = QLabel(self.cardSize1)
        self.titleSize1.setObjectName(u"titleSize1")
        self.titleSize1.setMaximumSize(QSize(16777215, 30))
        self.titleSize1.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout.addWidget(self.titleSize1)


        self.horizontalLayout.addLayout(self.verticalLayout)

        self.horizontalSpacer_2 = QSpacerItem(40, 20, QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout.addItem(self.horizontalSpacer_2)


        self.verticalLayout_3.addLayout(self.horizontalLayout)

        self.dimension1 = QLabel(self.cardSize1)
        self.dimension1.setObjectName(u"dimension1")
        self.dimension1.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout_3.addWidget(self.dimension1)


        self.verticalLayout_4.addLayout(self.verticalLayout_3)


        self.horizontalLayout_5.addWidget(self.cardSize1)

        self.horizontalSpacer_7 = QSpacerItem(40, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_5.addItem(self.horizontalSpacer_7)

        self.cardSize2 = QFrame(SizeSelection)
        self.cardSize2.setObjectName(u"cardSize2")
        self.cardSize2.setStyleSheet(u"#cardSize2 {\n"
"    background-color: #111;\n"
"    border: 2px solid #2D9CDB;\n"
"    border-radius: 16px;\n"
"}\n"
"#cardSize2:hover {\n"
"    border: 2px solid #56CCF2;\n"
"}\n"
"#badgeSize2{\n"
"    background-color:rgba(242, 153, 74, 0.2);\n"
"    color: #FF6600;\n"
"    padding: 4px 10px;\n"
"    border-radius: 10px;\n"
"    font-weight: bold;\n"
"}\n"
"#iconSize2{\n"
"    background-color: rgba(45, 156, 219, 0.15);\n"
"    border-radius: 12px;\n"
"    padding: 20px;\n"
"}\n"
"#titleSize2{\n"
"    color: white;\n"
"    font-size: 20px;\n"
"    font-weight: bold;\n"
"}\n"
"#dimension2{\n"
"    color: #AAA;\n"
"    font-size: 12px;\n"
"}")
        self.cardSize2.setFrameShape(QFrame.Shape.StyledPanel)
        self.cardSize2.setFrameShadow(QFrame.Shadow.Raised)
        self.verticalLayout_5 = QVBoxLayout(self.cardSize2)
        self.verticalLayout_5.setObjectName(u"verticalLayout_5")
        self.verticalLayout_6 = QVBoxLayout()
        self.verticalLayout_6.setObjectName(u"verticalLayout_6")
        self.horizontalLayout_3 = QHBoxLayout()
        self.horizontalLayout_3.setObjectName(u"horizontalLayout_3")
        self.badgeSize2 = QLabel(self.cardSize2)
        self.badgeSize2.setObjectName(u"badgeSize2")
        self.badgeSize2.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_3.addWidget(self.badgeSize2)

        self.horizontalSpacer_4 = QSpacerItem(245, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_3.addItem(self.horizontalSpacer_4)


        self.verticalLayout_6.addLayout(self.horizontalLayout_3)

        self.horizontalLayout_4 = QHBoxLayout()
        self.horizontalLayout_4.setObjectName(u"horizontalLayout_4")
        self.horizontalSpacer_5 = QSpacerItem(40, 20, QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_4.addItem(self.horizontalSpacer_5)

        self.verticalLayout_7 = QVBoxLayout()
        self.verticalLayout_7.setObjectName(u"verticalLayout_7")
        self.iconSize2 = QLabel(self.cardSize2)
        self.iconSize2.setObjectName(u"iconSize2")
        self.iconSize2.setMaximumSize(QSize(88, 88))
        self.iconSize2.setPixmap(QPixmap(u":/icons/assets/icon/LargeIcon.png"))
        self.iconSize2.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout_7.addWidget(self.iconSize2)

        self.titleSize2 = QLabel(self.cardSize2)
        self.titleSize2.setObjectName(u"titleSize2")
        self.titleSize2.setMaximumSize(QSize(16777215, 30))
        self.titleSize2.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout_7.addWidget(self.titleSize2)


        self.horizontalLayout_4.addLayout(self.verticalLayout_7)

        self.horizontalSpacer_6 = QSpacerItem(40, 20, QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_4.addItem(self.horizontalSpacer_6)


        self.verticalLayout_6.addLayout(self.horizontalLayout_4)

        self.dimension2 = QLabel(self.cardSize2)
        self.dimension2.setObjectName(u"dimension2")
        self.dimension2.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout_6.addWidget(self.dimension2)


        self.verticalLayout_5.addLayout(self.verticalLayout_6)


        self.horizontalLayout_5.addWidget(self.cardSize2)


        self.verticalLayout_8.addLayout(self.horizontalLayout_5)


        self.verticalLayout_9.addLayout(self.verticalLayout_8)


        self.retranslateUi(SizeSelection)

        QMetaObject.connectSlotsByName(SizeSelection)
    # setupUi

    def retranslateUi(self, SizeSelection):
        SizeSelection.setWindowTitle(QCoreApplication.translate("SizeSelection", u"Form", None))
        self.labelTitle.setText(QCoreApplication.translate("SizeSelection", u"Ch\u1ecdn k\u00edch th\u01b0\u1edbc t\u1ee7 b\u1ea1n mu\u1ed1n thu\u00ea", None))
        self.labelSubTitle.setText(QCoreApplication.translate("SizeSelection", u"VUI L\u00d2NG CH\u1eccN NG\u0102N CH\u1ee8A PH\u00d9 H\u1ee2P V\u1edaI KI\u1ec6N H\u00c0NG C\u1ee6A B\u1ea0N", None))
        self.badgeSize1.setText(QCoreApplication.translate("SizeSelection", u"Size 1", None))
        self.iconSize1.setText("")
        self.titleSize1.setText(QCoreApplication.translate("SizeSelection", u"Nh\u1ecf", None))
        self.dimension1.setText(QCoreApplication.translate("SizeSelection", u"30x40x30 cm", None))
        self.badgeSize2.setText(QCoreApplication.translate("SizeSelection", u"Size 2", None))
        self.iconSize2.setText("")
        self.titleSize2.setText(QCoreApplication.translate("SizeSelection", u"L\u1edbn", None))
        self.dimension2.setText(QCoreApplication.translate("SizeSelection", u"60x80x100 cm", None))
    # retranslateUi

