"""
A complete, real Qt window. This file is NOT graded by the app -- run it yourself
in a real terminal to see an actual window:

    python hello_window.py

Click the button a few times and watch the label update.
"""
from PySide6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton,
)


def main():
    app = QApplication.instance() or QApplication([])

    window = QWidget()
    window.setWindowTitle("Hello, Qt")
    window.resize(320, 160)

    layout = QVBoxLayout()
    prompt = QLabel("Enter your name:")
    name_input = QLineEdit()
    name_input.setPlaceholderText("Sam")
    greet_button = QPushButton("Say hello")
    greeting = QLabel("")

    layout.addWidget(prompt)
    layout.addWidget(name_input)
    layout.addWidget(greet_button)
    layout.addWidget(greeting)
    window.setLayout(layout)

    def on_click():
        name = name_input.text().strip() or "stranger"
        greeting.setText(f"Hello, {name}!")

    greet_button.clicked.connect(on_click)   # you'll fully understand this line on Day 2

    window.show()
    app.exec()


if __name__ == "__main__":
    main()
