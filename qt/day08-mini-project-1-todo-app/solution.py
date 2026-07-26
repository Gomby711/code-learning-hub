"""
Day 8 mini project -- Desktop To-Do App (solution).
Run it yourself in a real terminal:

    python solution.py
"""
from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout,
    QLineEdit, QPushButton, QListWidget, QListWidgetItem, QLabel,
)


class TodoApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("To-Do")
        self.resize(360, 420)
        self.setStyleSheet("""
            QWidget { background-color: #10162f; color: #f5f7ff; font-size: 13px; }
            QLineEdit { background: #1a2348; border: 1px solid #2b3564; border-radius: 6px; padding: 6px; }
            QPushButton { background-color: #38bdf8; color: #10162f; font-weight: bold;
                          padding: 6px 12px; border-radius: 6px; border: none; }
            QPushButton:hover { background-color: #6dc5ff; }
            QPushButton#deleteButton { background-color: #ff7a7a; }
            QPushButton#deleteButton:hover { background-color: #ff9d9d; }
            QListWidget { background: #1a2348; border: 1px solid #2b3564; border-radius: 6px; }
        """)

        self.input = QLineEdit()
        self.input.setPlaceholderText("What needs doing?")
        self.add_button = QPushButton("Add")
        self.list_widget = QListWidget()
        self.delete_button = QPushButton("Delete selected")
        self.delete_button.setObjectName("deleteButton")

        top_row = QHBoxLayout()
        top_row.addWidget(self.input)
        top_row.addWidget(self.add_button)

        layout = QVBoxLayout()
        layout.addWidget(QLabel("My tasks"))
        layout.addLayout(top_row)
        layout.addWidget(self.list_widget)
        layout.addWidget(self.delete_button)
        self.setLayout(layout)

        self.add_button.clicked.connect(self.add_task)
        self.input.returnPressed.connect(self.add_task)
        self.delete_button.clicked.connect(self.delete_selected)

    def add_task(self):
        text = self.input.text().strip()
        if not text:
            return
        item = QListWidgetItem(text)
        item.setFlags(item.flags() | Qt.ItemIsUserCheckable)
        item.setCheckState(Qt.Unchecked)
        self.list_widget.addItem(item)
        self.input.clear()

    def delete_selected(self):
        row = self.list_widget.currentRow()
        if row < 0:
            return
        self.list_widget.takeItem(row)


def main():
    app = QApplication.instance() or QApplication([])
    window = TodoApp()
    window.show()
    app.exec()


if __name__ == "__main__":
    main()
