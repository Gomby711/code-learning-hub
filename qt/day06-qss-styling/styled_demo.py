"""
A complete, styled Qt window. NOT graded -- run it yourself:

    python styled_demo.py
"""
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QLabel


def main():
    app = QApplication.instance() or QApplication([])
    app.setStyleSheet("""
        QWidget { background-color: #10162f; }
        QLabel { color: #f5f7ff; font-size: 15px; }
        QPushButton {
            background-color: #38bdf8; color: #10162f; font-weight: bold;
            padding: 8px 16px; border-radius: 6px; border: none;
        }
        QPushButton:hover { background-color: #6dc5ff; }
        QPushButton:pressed { background-color: #1a8fd1; }
        QPushButton#dangerButton { background-color: #ff7a7a; color: white; }
        QPushButton#dangerButton:hover { background-color: #ff9d9d; }
    """)

    window = QWidget()
    window.setWindowTitle("Styled Demo")
    layout = QVBoxLayout()
    layout.addWidget(QLabel("Hover and click the buttons below:"))

    save_button = QPushButton("Save")
    delete_button = QPushButton("Delete")
    delete_button.setObjectName("dangerButton")

    layout.addWidget(save_button)
    layout.addWidget(delete_button)
    window.setLayout(layout)

    window.show()
    app.exec()


if __name__ == "__main__":
    main()
