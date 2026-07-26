"""
Day 11 exercises -- loading a .ui file with QUiLoader.
Run this file directly: python exercises.py

The UI XML is embedded as a string and written to a fresh temp file before
loading -- this file needs to run standalone, without relying on any sibling
file (like this folder's signup_form.ui, which is here for you to READ, not
something this graded exercise depends on existing on disk).
"""
import os
import tempfile
from PySide6.QtWidgets import QApplication, QLabel, QLineEdit, QPushButton
from PySide6.QtUiTools import QUiLoader
from PySide6.QtCore import QFile

app = QApplication.instance() or QApplication([])

SIGNUP_FORM_UI = """<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
 <class>Form</class>
 <widget class="QWidget" name="Form">
  <layout class="QVBoxLayout" name="verticalLayout">
   <item>
    <widget class="QLabel" name="titleLabel">
     <property name="text">
      <string>Sign Up</string>
     </property>
    </widget>
   </item>
   <item>
    <widget class="QLineEdit" name="nameEdit">
     <property name="placeholderText">
      <string>Your name</string>
     </property>
    </widget>
   </item>
   <item>
    <widget class="QPushButton" name="submitButton">
     <property name="text">
      <string>Submit</string>
     </property>
    </widget>
   </item>
  </layout>
 </widget>
</ui>
"""


def write_temp_ui_file(ui_xml):
    """Write ui_xml to a fresh temp file ending in .ui and return its path.
    Hint: tempfile.mkdtemp() gives you a fresh temp DIRECTORY; join a filename
    onto it and write the text there with plain open(path, "w").
    """
    # TODO: implement
    pass


def load_signup_form(ui_path):
    """Load the .ui file at ui_path using QUiLoader and return the resulting
    top-level widget.
    Hint: open a QFile in QFile.ReadOnly mode, pass it to loader.load(...),
    then close the QFile (loader.load already built the widgets by then).
    """
    # TODO: implement
    pass


def get_title_text(form):
    """Given the loaded form, find the QLabel named "titleLabel" and return its
    .text().
    """
    # TODO: implement
    pass


def get_name_placeholder(form):
    """Given the loaded form, find the QLineEdit named "nameEdit" and return its
    .placeholderText().
    """
    # TODO: implement
    pass


def get_submit_button_text(form):
    """Given the loaded form, find the QPushButton named "submitButton" and
    return its .text().
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    ui_path = write_temp_ui_file(SIGNUP_FORM_UI)
    check("write_temp_ui_file creates a real file", isinstance(ui_path, str) and os.path.isfile(ui_path))

    form = load_signup_form(ui_path) if isinstance(ui_path, str) and os.path.isfile(ui_path) else None
    check("load_signup_form returns a widget", form is not None)

    if form is not None:
        check("get_title_text", get_title_text(form) == "Sign Up")
        check("get_name_placeholder", get_name_placeholder(form) == "Your name")
        check("get_submit_button_text", get_submit_button_text(form) == "Submit")
    else:
        check("get_title_text", False)
        check("get_name_placeholder", False)
        check("get_submit_button_text", False)
