"""Day 11 solutions -- loading a .ui file with QUiLoader."""
import os
import tempfile
from PySide6.QtWidgets import QApplication, QLabel, QLineEdit, QPushButton
from PySide6.QtUiTools import QUiLoader
from PySide6.QtCore import QFile

app = QApplication.instance() or QApplication([])


def write_temp_ui_file(ui_xml):
    tmp_dir = tempfile.mkdtemp()
    path = os.path.join(tmp_dir, "form.ui")
    with open(path, "w", encoding="utf-8") as f:
        f.write(ui_xml)
    return path


def load_signup_form(ui_path):
    loader = QUiLoader()
    ui_file = QFile(ui_path)
    ui_file.open(QFile.ReadOnly)
    form = loader.load(ui_file)
    ui_file.close()
    return form


def get_title_text(form):
    return form.findChild(QLabel, "titleLabel").text()


def get_name_placeholder(form):
    return form.findChild(QLineEdit, "nameEdit").placeholderText()


def get_submit_button_text(form):
    return form.findChild(QPushButton, "submitButton").text()
