"""
Day 6 exercises -- QSS styling.
Run this file directly: python exercises.py
"""
from PySide6.QtWidgets import QApplication, QPushButton, QLabel

app = QApplication.instance() or QApplication([])


def style_button(text, css):
    """Create a QPushButton with the given text, apply css as its style sheet
    (via .setStyleSheet), and return the button.
    """
    # TODO: implement
    pass


def make_danger_button(text):
    """Create a QPushButton with the given text, and set its objectName to
    exactly "dangerButton" (so a QSS rule like QPushButton#dangerButton could
    target it). Return the button.
    """
    # TODO: implement
    pass


def app_wide_button_style():
    """Return a QSS string (just the string, don't apply it to anything) that:
      - sets a background-color and color for ALL QPushButtons
      - has a QPushButton:hover rule with a DIFFERENT background-color
    The check just verifies both pieces are present as text -- get the shape
    right: "QPushButton { ... }" and "QPushButton:hover { ... }".
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    btn = style_button("Save", "background-color: red; color: white;")
    check("style_button text", btn is not None and btn.text() == "Save")
    check("style_button applied", btn is not None and "background-color" in btn.styleSheet())

    danger = make_danger_button("Delete")
    check("make_danger_button objectName", danger is not None and danger.objectName() == "dangerButton")

    css = app_wide_button_style()
    check("app_wide_button_style has QPushButton rule", isinstance(css, str) and "QPushButton" in css and "{" in css)
    check("app_wide_button_style has hover rule", isinstance(css, str) and "QPushButton:hover" in css)
    check(
        "app_wide_button_style hover differs from base",
        isinstance(css, str) and css.count("background-color") >= 2,
    )
