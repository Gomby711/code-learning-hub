"""Day 14 solutions -- testable widget design."""
from PySide6.QtWidgets import QApplication, QWidget, QLineEdit, QVBoxLayout

app = QApplication.instance() or QApplication([])


class Calculator(QWidget):
    def __init__(self):
        super().__init__()
        self.display = QLineEdit("0")
        self.display.setReadOnly(True)
        layout = QVBoxLayout()
        layout.addWidget(self.display)
        self.setLayout(layout)

    def press_digit(self, digit):
        if self.display.text() == "0":
            self.display.setText(digit)
        else:
            self.display.setText(self.display.text() + digit)

    def clear(self):
        self.display.setText("0")
