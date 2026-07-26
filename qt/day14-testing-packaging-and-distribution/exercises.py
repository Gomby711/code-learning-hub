"""
Day 14 exercises -- testable widget design.
Run this file directly: python exercises.py

The point today: build a small widget whose LOGIC lives in plain methods (easy to
test directly, exactly like every exercise this week), completely separate from
any main()/app.exec() entry point (which would only exist in a real app file, not
here) -- the same separation that makes a class both testable AND packageable.
"""
from PySide6.QtWidgets import QApplication, QWidget, QLineEdit, QVBoxLayout

app = QApplication.instance() or QApplication([])


class Calculator(QWidget):
    """A tiny calculator widget. TODO: implement the methods below.

    self.display should be a QLineEdit, read-only (setReadOnly(True)), starting
    with the text "0", added to a QVBoxLayout that's set on the widget.
    """
    def __init__(self):
        super().__init__()
        # TODO: create self.display (QLineEdit, read-only, text "0"),
        # put it in a QVBoxLayout, and set that layout on self.

    def press_digit(self, digit):
        """Append `digit` (a string like "5") to the display -- EXCEPT if the
        display currently shows exactly "0", in which case REPLACE it (so typing
        "5" when it shows "0" gives "5", not "05").
        """
        # TODO: implement

    def clear(self):
        """Reset the display back to "0"."""
        # TODO: implement


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    calc = Calculator()
    check("Calculator has a display", hasattr(calc, "display") and isinstance(calc.display, QLineEdit))
    if hasattr(calc, "display"):
        check("display starts at 0", calc.display.text() == "0")
        check("display is read-only", calc.display.isReadOnly())
        check("has a layout", calc.layout() is not None)

        calc.press_digit("5")
        check("press_digit replaces leading zero", calc.display.text() == "5")

        calc.press_digit("3")
        check("press_digit appends", calc.display.text() == "53")

        calc.clear()
        check("clear resets to 0", calc.display.text() == "0")
    else:
        for label in ["display starts at 0", "display is read-only", "has a layout",
                       "press_digit replaces leading zero", "press_digit appends", "clear resets to 0"]:
            check(label, False)
