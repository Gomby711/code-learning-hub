"""Day 4 solutions -- QMainWindow, menus, and dialogs."""
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QLabel, QMessageBox, QDialog, QVBoxLayout,
    QLineEdit, QPushButton,
)
from PySide6.QtGui import QAction

app = QApplication.instance() or QApplication([])


def build_main_window(title, central_text, status_text):
    window = QMainWindow()
    window.setWindowTitle(title)
    window.setCentralWidget(QLabel(central_text))
    window.statusBar().showMessage(status_text)
    return window


def add_file_menu_action(window, action_label, on_trigger):
    file_menu = window.menuBar().addMenu("File")
    action = QAction(action_label, window)
    action.triggered.connect(on_trigger)
    file_menu.addAction(action)
    return action


def make_confirm_box(question_text):
    box = QMessageBox()
    box.setText(question_text)
    box.setStandardButtons(QMessageBox.Yes | QMessageBox.No)
    box.setDefaultButton(QMessageBox.No)
    return box


class NameDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Enter name")
        layout = QVBoxLayout()
        self.name_input = QLineEdit()
        ok_button = QPushButton("OK")
        ok_button.clicked.connect(self.accept)
        layout.addWidget(QLabel("Name:"))
        layout.addWidget(self.name_input)
        layout.addWidget(ok_button)
        self.setLayout(layout)
