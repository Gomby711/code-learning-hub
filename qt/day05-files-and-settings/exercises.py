"""
Day 5 exercises -- file-handling logic and persistent settings.
Run this file directly: python exercises.py
None of these call QFileDialog.* directly -- see the lesson for why.
"""
import os
import tempfile
from PySide6.QtCore import QSettings
from PySide6.QtWidgets import QApplication

app = QApplication.instance() or QApplication([])


def describe_selected_file(path):
    """Given a path string (as if it came back from QFileDialog.getOpenFileName),
    return "No file selected." if path is empty/falsy, otherwise return
    f"You picked: {path}".
    """
    # TODO: implement
    pass


def file_extension(path):
    """Given a file path string, return its extension WITHOUT the dot, lowercased
    (e.g. "photo.JPG" -> "jpg"). Return "" if there's no extension.
    Hint: os.path.splitext(path) returns (root, ext) where ext includes the dot.
    """
    # TODO: implement
    pass


def make_temp_settings():
    """Create and return a QSettings using QSettings.IniFormat, pointed at a
    fresh temporary .ini path (use tempfile.mkstemp() or tempfile.mkdtemp() plus
    a filename -- either is fine, just make sure the path is inside a temp dir).
    """
    # TODO: implement
    pass


def save_last_folder(settings, folder_path):
    """Store folder_path under the key "last_folder" in the given QSettings, and
    make sure it's actually written to disk before returning (see .sync() in the
    lesson).
    """
    # TODO: implement
    pass


def load_last_folder(settings, default="~"):
    """Return the value stored under "last_folder" in the given QSettings, or
    `default` if nothing has been saved yet.
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    check("describe_selected_file empty", describe_selected_file("") == "No file selected.")
    check("describe_selected_file with path", describe_selected_file("/tmp/x.txt") == "You picked: /tmp/x.txt")

    check("file_extension basic", file_extension("photo.jpg") == "jpg")
    check("file_extension uppercase", file_extension("photo.JPG") == "jpg")
    check("file_extension none", file_extension("README") == "")

    settings = make_temp_settings()
    check("make_temp_settings returns a QSettings", isinstance(settings, QSettings))

    if isinstance(settings, QSettings):
        empty_default = load_last_folder(settings, default="~")
        check("load_last_folder returns default when unset", empty_default == "~")

        save_last_folder(settings, "/home/sam/projects")
        # A FRESH QSettings pointed at the same file, to prove it was really written to disk.
        reloaded = QSettings(settings.fileName(), QSettings.IniFormat)
        check("save_last_folder persists to disk", load_last_folder(reloaded) == "/home/sam/projects")
    else:
        check("load_last_folder returns default when unset", False)
        check("save_last_folder persists to disk", False)
