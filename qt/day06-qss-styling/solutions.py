"""Day 6 solutions -- QSS styling."""
from PySide6.QtWidgets import QApplication, QPushButton, QLabel

app = QApplication.instance() or QApplication([])


def style_button(text, css):
    btn = QPushButton(text)
    btn.setStyleSheet(css)
    return btn


def make_danger_button(text):
    btn = QPushButton(text)
    btn.setObjectName("dangerButton")
    return btn


def app_wide_button_style():
    return """
    QPushButton { background-color: #38bdf8; color: #10162f; }
    QPushButton:hover { background-color: #6dc5ff; }
    """
