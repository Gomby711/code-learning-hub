"""
Day 4 exercises -- QMainWindow, menus, and dialogs.
Run this file directly: python exercises.py
"""
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QLabel, QMessageBox, QDialog, QVBoxLayout,
    QLineEdit, QPushButton,
)
from PySide6.QtGui import QAction

app = QApplication.instance() or QApplication([])


def build_main_window(title, central_text, status_text):
    """Build a QMainWindow with the given window title, a QLabel(central_text) as
    its central widget, and status_text shown in its status bar.
    Return the window.
    """
    # TODO: implement
    pass


def add_file_menu_action(window, action_label, on_trigger):
    """Given a QMainWindow, add a "File" menu (create it if it doesn't exist yet --
    window.menuBar().addMenu("File") is safe to call once) containing one QAction
    with text action_label, connected to on_trigger.
    Return the QAction.
    """
    # TODO: implement
    pass


def make_confirm_box(question_text):
    """Create a QMessageBox with Yes/No standard buttons, No as the default, and
    question_text as its text. Return the box (don't call .exec()).
    """
    # TODO: implement
    pass


class NameDialog(QDialog):
    """A QDialog with:
      - self.name_input: a QLineEdit
      - an "OK" QPushButton whose click calls self.accept
      - a layout containing (in order) a QLabel("Name:"), self.name_input, the OK button
    TODO: implement __init__ following this shape.
    """
    def __init__(self):
        super().__init__()
        # TODO: implement


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    win = build_main_window("My App", "Welcome", "Ready")
    check("build_main_window title", win is not None and win.windowTitle() == "My App")
    check("build_main_window central widget", win is not None and win.centralWidget() is not None and win.centralWidget().text() == "Welcome")
    check("build_main_window status bar", win is not None and win.statusBar().currentMessage() == "Ready")

    fired = []
    action = add_file_menu_action(win, "Save", lambda: fired.append("saved")) if win else None
    if action is not None:
        check("add_file_menu_action label", action.text() == "Save")
        action.trigger()
        check("add_file_menu_action connects", fired == ["saved"])
    else:
        check("add_file_menu_action label", False)
        check("add_file_menu_action connects", False)

    box = make_confirm_box("Delete this file?")
    check("make_confirm_box text", box is not None and box.text() == "Delete this file?")
    check(
        "make_confirm_box has Yes/No buttons",
        box is not None and bool(box.standardButtons() & QMessageBox.Yes) and bool(box.standardButtons() & QMessageBox.No),
    )

    dialog = NameDialog()
    check("NameDialog has name_input", hasattr(dialog, "name_input") and isinstance(dialog.name_input, QLineEdit))
    if hasattr(dialog, "name_input"):
        dialog.name_input.setText("Sam")
        check("NameDialog name_input holds text", dialog.name_input.text() == "Sam")
    else:
        check("NameDialog name_input holds text", False)
    check("NameDialog has a layout", dialog.layout() is not None and dialog.layout().count() == 3)
