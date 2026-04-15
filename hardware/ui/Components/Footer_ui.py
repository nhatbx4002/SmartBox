# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'Footer.ui'
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

class Ui_Footer(object):
    def setupUi(self, Footer):
        if not Footer.objectName():
            Footer.setObjectName(u"Footer")
        Footer.resize(800, 60)
        Footer.setStyleSheet(u"#Footer {\n"
"    background-color:#0A0A0A;\n"
"    border-top: 0px solid transparent;\n"
"}\n"
"\n"
"#labelLeftText,\n"
"#labelTextRight {\n"
"    color: rgba(255, 200, 170, 0.45);\n"
"    font-size: 11px;\n"
"    font-weight: 500;\n"
"    letter-spacing: 2px;\n"
"}\n"
"\n"
"#labelCental {\n"
"    color: #ff6a00;\n"
"    font-size: 11px;\n"
"    font-weight: 700;\n"
"    letter-spacing: 2px;\n"
"}\n"
"")
        self.horizontalLayout_4 = QHBoxLayout(Footer)
        self.horizontalLayout_4.setObjectName(u"horizontalLayout_4")
        self.horizontalLayout_3 = QHBoxLayout()
        self.horizontalLayout_3.setObjectName(u"horizontalLayout_3")
        self.horizontalLayout_3.setContentsMargins(-1, 10, -1, -1)
        self.horizontalLayout = QHBoxLayout()
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.labelRightIcon = QLabel(Footer)
        self.labelRightIcon.setObjectName(u"labelRightIcon")
        self.labelRightIcon.setMinimumSize(QSize(16, 16))
        self.labelRightIcon.setMaximumSize(QSize(16, 16))
        self.labelRightIcon.setPixmap(QPixmap(u":/icons/assets/icon/maru.png"))
        self.labelRightIcon.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout.addWidget(self.labelRightIcon)

        self.labelTextRight = QLabel(Footer)
        self.labelTextRight.setObjectName(u"labelTextRight")

        self.horizontalLayout.addWidget(self.labelTextRight)

        self.horizontalSpacer = QSpacerItem(95, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout.addItem(self.horizontalSpacer)


        self.horizontalLayout_3.addLayout(self.horizontalLayout)

        self.labelCental = QLabel(Footer)
        self.labelCental.setObjectName(u"labelCental")
        self.labelCental.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_3.addWidget(self.labelCental)

        self.horizontalLayout_2 = QHBoxLayout()
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.horizontalSpacer_2 = QSpacerItem(140, 20, QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Minimum)

        self.horizontalLayout_2.addItem(self.horizontalSpacer_2)

        self.labelLeftIcon = QLabel(Footer)
        self.labelLeftIcon.setObjectName(u"labelLeftIcon")
        self.labelLeftIcon.setMinimumSize(QSize(16, 16))
        self.labelLeftIcon.setMaximumSize(QSize(16, 16))
        self.labelLeftIcon.setPixmap(QPixmap(u":/icons/assets/icon/footerIcon.png"))
        self.labelLeftIcon.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.horizontalLayout_2.addWidget(self.labelLeftIcon)

        self.labelLeftText = QLabel(Footer)
        self.labelLeftText.setObjectName(u"labelLeftText")

        self.horizontalLayout_2.addWidget(self.labelLeftText)


        self.horizontalLayout_3.addLayout(self.horizontalLayout_2)


        self.horizontalLayout_4.addLayout(self.horizontalLayout_3)


        self.retranslateUi(Footer)

        QMetaObject.connectSlotsByName(Footer)
    # setupUi

    def retranslateUi(self, Footer):
        Footer.setWindowTitle(QCoreApplication.translate("Footer", u"Form", None))
        self.labelRightIcon.setText("")
        self.labelTextRight.setText(QCoreApplication.translate("Footer", u"C\u01b0\u1eddng \u0111\u1ed9 t\u00edn hi\u1ec7u : T\u1ed1t", None))
        self.labelCental.setText(QCoreApplication.translate("Footer", u"SYSTEM ONLINE", None))
        self.labelLeftIcon.setText("")
        self.labelLeftText.setText(QCoreApplication.translate("Footer", u"SECURE SESSION", None))
    # retranslateUi

