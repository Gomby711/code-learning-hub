"""Day 3 solutions -- more widgets and layouts."""
from PySide6.QtWidgets import (
    QApplication, QWidget, QFormLayout, QLineEdit, QSpinBox, QComboBox,
    QRadioButton, QButtonGroup, QGroupBox, QVBoxLayout,
)

app = QApplication.instance() or QApplication([])


def make_size_combo():
    combo = QComboBox()
    combo.addItems(["Small", "Medium", "Large"])
    combo.setCurrentIndex(1)
    return combo


def make_bounded_spinbox(minimum, maximum, attempted_value):
    spin = QSpinBox()
    spin.setRange(minimum, maximum)
    spin.setValue(attempted_value)
    return spin


def make_exclusive_radio_group(labels):
    group = QButtonGroup()
    buttons = []
    for text in labels:
        btn = QRadioButton(text)
        group.addButton(btn)
        buttons.append(btn)
    return group, buttons


def build_signup_form():
    widget = QWidget()
    form = QFormLayout()
    form.addRow("Name:", QLineEdit())
    age = QSpinBox()
    age.setRange(0, 120)
    form.addRow("Age:", age)
    widget.setLayout(form)
    return widget
