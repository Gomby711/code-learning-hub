# Day 2 — Signals and Slots: Qt's Event-Handling Paradigm

## Objectives
- Understand signals and slots — the mechanism every interactive Qt app is built on
- Connect a widget's built-in signals (like a button's `clicked`) to your own functions
- Create your own **custom signals** on a class, and understand why that matters for organizing bigger apps

## What a signal actually is

A **signal** is Qt's way of saying "something happened." Widgets emit signals constantly: a button emits
`clicked` when pressed, a checkbox emits `stateChanged` when toggled, a text box emits `textChanged` on
every keystroke. A **slot** is just a regular function that runs in response to a signal — "connecting" a
signal to a slot is how you tell Qt "when X happens, run this." This is the exact same underlying idea as
`addEventListener("click", fn)` in the JavaScript track, or Python's own `functools` callback patterns —
Qt just gives the pattern first-class syntax and a name.

```python
from PySide6.QtWidgets import QApplication, QPushButton

app = QApplication.instance() or QApplication([])

count = 0
def on_click():
    global count
    count += 1

btn = QPushButton("Click me")
btn.clicked.connect(on_click)     # "when btn emits clicked, call on_click"

btn.click()      # simulates a real click -- this is how you trigger it WITHOUT a real window
btn.click()
print(count)       # 2
```
`btn.clicked.connect(on_click)` is the entire pattern: `widget.signalName.connect(function_to_call)`.
Note that you pass the function itself (`on_click`), not the *result* of calling it (`on_click()`) — the
exact same "pass the function, don't call it yet" distinction from passing callbacks in the JavaScript
track's Day 4 (closures/first-class functions) and the Python track's Day 4.

## Common built-in signals you'll use constantly

| Widget | Signal | Fires when... |
|---|---|---|
| `QPushButton` | `clicked` | The button is clicked |
| `QLineEdit` | `textChanged` | The text changes, on every keystroke |
| `QLineEdit` | `returnPressed` | The user presses Enter while focused on it |
| `QCheckBox` | `stateChanged` | The checkbox is toggled |
| `QComboBox` | `currentTextChanged` | A different option is selected |

```python
from PySide6.QtWidgets import QLineEdit

edit = QLineEdit()
history = []
edit.textChanged.connect(lambda text: history.append(text))

edit.setText("h")
edit.setText("he")
edit.setText("hel")
print(history)     # ['h', 'he', 'hel'] -- textChanged fires on EVERY change, not just once at the end
```
A signal can pass along data about what happened — `textChanged` hands your function the new text
directly, as shown above with a lambda (a small, anonymous function — you may recall these from the
Python and JS tracks; they're common as slot functions for short one-liners like this).

## Writing your own custom signals

Once you're building anything beyond a single window, you'll want your OWN objects to announce things
happening — not just built-in widgets. Custom signals live on a class that inherits from `QObject`:

```python
from PySide6.QtCore import QObject, Signal

class Counter(QObject):
    value_changed = Signal(int)      # declares a custom signal that carries an int

    def __init__(self):
        super().__init__()
        self._value = 0

    def increment(self):
        self._value += 1
        self.value_changed.emit(self._value)     # announce the new value to anyone listening

counter = Counter()
seen = []
counter.value_changed.connect(lambda v: seen.append(v))
counter.increment()
counter.increment()
print(seen)     # [1, 2]
```
`Signal(int)` declares the signal's *shape* — what type(s) of data it carries when emitted — at the class
level, as a class attribute. `.emit(value)` is how you actually fire it. This is the pattern that lets
different, unrelated parts of a real app stay decoupled: your data logic can emit "I changed," and your UI
code just listens, without either side needing to know the other's internal details — the same "decoupled
components communicating through events" idea you've now seen in three different forms across this repo
(DOM events, React props/state, and now Qt signals).

## Exercises

Open `exercises.py`. Every check simulates events programmatically (`.click()`, `.setText(...)`,
`.emit(...)`) — no window, no `app.exec()`, per Day 0.
