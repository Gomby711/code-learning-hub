"""
Day 2 exercises -- signals and slots.
Run this file directly: python exercises.py
"""
from PySide6.QtCore import QObject, Signal
from PySide6.QtWidgets import QApplication, QPushButton, QLineEdit, QCheckBox

app = QApplication.instance() or QApplication([])


def make_click_counter():
    """Create a QPushButton and connect its `clicked` signal to a function that
    increments a counter each time it fires.
    Return a tuple (button, get_count) where get_count is a zero-argument function
    that returns the CURRENT count when called.
    Hint: use a list with one item (e.g. count = [0]) as a mutable box so the inner
    function can modify it -- the same closure pattern from the language tracks.
    """
    # TODO: implement
    pass


def track_text_history(line_edit):
    """Connect to line_edit's textChanged signal so that every new text value gets
    appended, in order, to a list. Return that list (it will be empty until the
    caller sets text on line_edit afterward -- the list updates itself via the
    connection, since lists are mutable).
    """
    # TODO: implement
    pass


def make_toggle_tracker():
    """Create a QCheckBox and connect its stateChanged signal to a function that
    appends the checkbox's CURRENT .isChecked() value (True/False) to a list each
    time it fires. Return a tuple (checkbox, history_list).
    """
    # TODO: implement
    pass


class Counter(QObject):
    """A custom QObject with a signal named `value_changed` that carries an int --
    the new value -- each time increment() is called.
    TODO:
      1. Declare a class-level Signal(int) named value_changed
      2. In __init__, call super().__init__() and set self._value = 0
      3. Implement increment(self): increase self._value by 1, then emit
         value_changed with the new value
    """
    # TODO: implement


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    result = make_click_counter()
    if isinstance(result, tuple) and len(result) == 2:
        btn, get_count = result
        btn.click(); btn.click(); btn.click()
        check("make_click_counter counts clicks", get_count() == 3)
    else:
        check("make_click_counter counts clicks", False)

    edit = QLineEdit()
    history = track_text_history(edit)
    if history is not None:
        edit.setText("h")
        edit.setText("he")
        edit.setText("hel")
        check("track_text_history", history == ["h", "he", "hel"])
    else:
        check("track_text_history", False)

    toggle_result = make_toggle_tracker()
    if isinstance(toggle_result, tuple) and len(toggle_result) == 2:
        cb, toggles = toggle_result
        cb.setChecked(True)
        cb.setChecked(False)
        check("make_toggle_tracker", toggles == [True, False])
    else:
        check("make_toggle_tracker", False)

    try:
        counter = Counter()
        seen = []
        counter.value_changed.connect(lambda v: seen.append(v))
        counter.increment()
        counter.increment()
        counter.increment()
        check("Counter.value_changed emits the running value", seen == [1, 2, 3])
    except Exception as e:
        check("Counter.value_changed emits the running value", False)
