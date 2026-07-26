"""Day 2 solutions -- signals and slots."""
from PySide6.QtCore import QObject, Signal
from PySide6.QtWidgets import QApplication, QPushButton, QLineEdit, QCheckBox

app = QApplication.instance() or QApplication([])


def make_click_counter():
    count = [0]
    btn = QPushButton("Click me")

    def on_click():
        count[0] += 1

    btn.clicked.connect(on_click)
    return btn, (lambda: count[0])


def track_text_history(line_edit):
    history = []
    line_edit.textChanged.connect(lambda text: history.append(text))
    return history


def make_toggle_tracker():
    history = []
    cb = QCheckBox("agree")
    cb.stateChanged.connect(lambda _state: history.append(cb.isChecked()))
    return cb, history


class Counter(QObject):
    value_changed = Signal(int)

    def __init__(self):
        super().__init__()
        self._value = 0

    def increment(self):
        self._value += 1
        self.value_changed.emit(self._value)
