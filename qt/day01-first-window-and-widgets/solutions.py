"""Day 1 solutions -- widgets and layouts."""
from PySide6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QLineEdit,
)

app = QApplication.instance() or QApplication([])


def make_labeled_button(label_text, button_text):
    return QLabel(label_text), QPushButton(button_text)


def build_vertical_form():
    widget = QWidget()
    layout = QVBoxLayout()
    layout.addWidget(QLabel("Name:"))
    layout.addWidget(QLineEdit())
    layout.addWidget(QPushButton("Submit"))
    widget.setLayout(layout)
    return widget


def build_horizontal_button_row(labels):
    widget = QWidget()
    layout = QHBoxLayout()
    for text in labels:
        layout.addWidget(QPushButton(text))
    widget.setLayout(layout)
    return widget


def count_layout_items(widget):
    return widget.layout().count()


def get_nth_widget_text(widget, index):
    return widget.layout().itemAt(index).widget().text()
