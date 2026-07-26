"""
Day 3 exercises -- more widgets and layouts.
Run this file directly: python exercises.py
"""
from PySide6.QtWidgets import (
    QApplication, QWidget, QFormLayout, QLineEdit, QSpinBox, QComboBox,
    QRadioButton, QButtonGroup, QGroupBox, QVBoxLayout,
)

app = QApplication.instance() or QApplication([])


def make_size_combo():
    """Create a QComboBox with items "Small", "Medium", "Large" (in that order),
    with "Medium" selected by default. Return the combo box.
    """
    # TODO: implement
    pass


def make_bounded_spinbox(minimum, maximum, attempted_value):
    """Create a QSpinBox with the given range, then try to set its value to
    attempted_value (which may be out of range). Return the spin box -- let Qt's
    own clamping behavior do the work; don't clamp it yourself.
    """
    # TODO: implement
    pass


def make_exclusive_radio_group(labels):
    """Given a list of label strings, create that many QRadioButtons and put them
    all in ONE QButtonGroup so only one can ever be checked at a time.
    Return a tuple (group, buttons) where buttons is the list of QRadioButton
    objects, in the same order as labels.
    """
    # TODO: implement
    pass


def build_signup_form():
    """Build a QWidget containing a QFormLayout with two rows, in order:
    - "Name:" paired with a QLineEdit
    - "Age:"  paired with a QSpinBox (range 0-120)
    Return the WIDGET (not the layout).
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    combo = make_size_combo()
    check("make_size_combo has 3 items", combo is not None and combo.count() == 3)
    check("make_size_combo defaults to Medium", combo is not None and combo.currentText() == "Medium")

    spin = make_bounded_spinbox(0, 10, 15)
    check("make_bounded_spinbox clamps to max", spin is not None and spin.value() == 10)
    spin2 = make_bounded_spinbox(0, 10, -5)
    check("make_bounded_spinbox clamps to min", spin2 is not None and spin2.value() == 0)

    group_result = make_exclusive_radio_group(["A", "B", "C"])
    if isinstance(group_result, tuple) and len(group_result) == 2:
        group, buttons = group_result
        buttons[1].setChecked(True)
        checked_states = [b.isChecked() for b in buttons]
        check("make_exclusive_radio_group only one checked", checked_states == [False, True, False])
        buttons[2].setChecked(True)
        checked_states2 = [b.isChecked() for b in buttons]
        check("make_exclusive_radio_group enforces exclusivity on change", checked_states2 == [False, False, True])
    else:
        check("make_exclusive_radio_group only one checked", False)
        check("make_exclusive_radio_group enforces exclusivity on change", False)

    form = build_signup_form()
    check("build_signup_form has a layout", form is not None and form.layout() is not None)
    check("build_signup_form has 2 rows", form is not None and form.layout().rowCount() == 2)
