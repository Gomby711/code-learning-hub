"""
Day 1 exercises -- widgets and layouts.
Run this file directly: python exercises.py
None of these should call .show() or app.exec() -- see Day 0 for why.
"""
from PySide6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QLineEdit,
)

app = QApplication.instance() or QApplication([])


def make_labeled_button(label_text, button_text):
    """Return a tuple (label, button): a QLabel with label_text and a QPushButton
    with button_text. Just create and return them -- no layout needed for this one.
    """
    # TODO: implement
    pass


def build_vertical_form():
    """Build a QWidget containing a QVBoxLayout with, in order:
    - a QLabel reading "Name:"
    - a QLineEdit (leave it empty)
    - a QPushButton reading "Submit"
    Attach the layout to the widget with .setLayout(...), then return the WIDGET
    (not the layout).
    """
    # TODO: implement
    pass


def build_horizontal_button_row(labels):
    """Given a list of strings, build a QWidget containing a QHBoxLayout with one
    QPushButton per string (in order), then return the WIDGET.
    """
    # TODO: implement
    pass


def count_layout_items(widget):
    """Given a widget that has a layout attached (via .layout()), return how many
    items are in that layout.
    """
    # TODO: implement
    pass


def get_nth_widget_text(widget, index):
    """Given a widget with a layout attached, return the .text() of the widget at
    position `index` in that layout.
    Hint: widget.layout().itemAt(index).widget() gives you the widget at that slot.
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    lb_result = make_labeled_button("Score:", "Reset")
    label, button = lb_result if isinstance(lb_result, tuple) and len(lb_result) == 2 else (None, None)
    check("make_labeled_button label text", label is not None and label.text() == "Score:")
    check("make_labeled_button button text", button is not None and button.text() == "Reset")

    form = build_vertical_form()
    check("build_vertical_form returns a widget with a layout", form is not None and form.layout() is not None)
    check("build_vertical_form has 3 items", form is not None and form.layout().count() == 3)

    row = build_horizontal_button_row(["One", "Two", "Three"])
    check("build_horizontal_button_row has 3 items", row is not None and row.layout().count() == 3)
    check(
        "build_horizontal_button_row button texts in order",
        row is not None and [row.layout().itemAt(i).widget().text() for i in range(3)] == ["One", "Two", "Three"],
    )

    check("count_layout_items", count_layout_items(form) == 3)

    nth_text = get_nth_widget_text(form, 0) if form else None
    check("get_nth_widget_text", isinstance(nth_text, str) and nth_text.strip(":") == "Name")
