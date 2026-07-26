"""Day 5 solutions -- file-handling logic and persistent settings."""
import os
import tempfile
from PySide6.QtCore import QSettings
from PySide6.QtWidgets import QApplication

app = QApplication.instance() or QApplication([])


def describe_selected_file(path):
    if not path:
        return "No file selected."
    return f"You picked: {path}"


def file_extension(path):
    _root, ext = os.path.splitext(path)
    return ext[1:].lower() if ext else ""


def make_temp_settings():
    tmp_dir = tempfile.mkdtemp()
    ini_path = os.path.join(tmp_dir, "settings.ini")
    return QSettings(ini_path, QSettings.IniFormat)


def save_last_folder(settings, folder_path):
    settings.setValue("last_folder", folder_path)
    settings.sync()


def load_last_folder(settings, default="~"):
    return settings.value("last_folder", default)
