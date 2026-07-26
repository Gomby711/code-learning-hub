# Day 1 — Your First Window: Widgets and Layouts

## Objectives
- Create a real window with `QWidget`, and understand the widget tree (windows contain widgets, which
  can contain other widgets)
- Meet the handful of widgets you'll use constantly: `QLabel`, `QPushButton`, `QLineEdit`
- Understand layouts (`QVBoxLayout`, `QHBoxLayout`) — how Qt actually arranges widgets on screen, so you
  never have to calculate pixel positions by hand

## Every widget is a QWidget

`QWidget` is the base building block of every visual thing in Qt — a window is a `QWidget`, a button is a
`QWidget` (specifically a `QPushButton`, which is a more specific *kind* of `QWidget` — the exact same
"specific type built on a general one" idea as Python's class inheritance, which you met in the Python
track's Day 9). A window, in Qt, is just a `QWidget` that isn't placed inside any other widget — it
becomes a real top-level window the moment you call `.show()` on it.

```python
from PySide6.QtWidgets import QApplication, QWidget

app = QApplication.instance() or QApplication([])
window = QWidget()
window.setWindowTitle("My First App")
window.resize(300, 150)
# window.show(); app.exec()   -- run this yourself in a real terminal to actually see it (Day 0)
```

## Widgets you'll use constantly

| Widget | What it's for |
|---|---|
| `QLabel` | Displays text (or an image) — not interactive, just shown |
| `QPushButton` | A clickable button |
| `QLineEdit` | A single-line text input box |
| `QCheckBox` | A toggleable checkbox |
| `QWidget` | A generic container / the base of everything else |

```python
from PySide6.QtWidgets import QLabel, QPushButton, QLineEdit

label = QLabel("Enter your name:")
edit = QLineEdit()
edit.setPlaceholderText("Sam")     # greyed-out hint text, shown only when empty
btn = QPushButton("Submit")

print(label.text())          # "Enter your name:"
edit.setText("Alice")
print(edit.text())            # "Alice"
```
Every widget's visible text is readable and settable through plain methods like `.text()` /
`.setText(...)` — this is exactly the pattern the graded exercises check against, without ever needing a
real, visible window.

## Layouts — arranging widgets without hand-placing pixels

If you only create widgets, Qt has no idea how to arrange them relative to each other. A **layout**
solves this: you add widgets to a layout object, and the layout automatically positions and resizes them
— including re-arranging everything automatically if the user resizes the window, which manual pixel
placement could never do.

```python
from PySide6.QtWidgets import QWidget, QVBoxLayout, QLabel, QPushButton

window = QWidget()
layout = QVBoxLayout()          # arranges children in a single VERTICAL column, top to bottom
layout.addWidget(QLabel("Step 1"))
layout.addWidget(QLabel("Step 2"))
layout.addWidget(QPushButton("Next"))
window.setLayout(layout)         # attach the layout to the window -- required, or nothing shows up

print(layout.count())        # 3 -- how many items are in this layout
print(layout.itemAt(0).widget().text())    # "Step 1" -- reach into a layout to inspect its widgets
```
- **`QVBoxLayout`** — stacks widgets vertically, top to bottom (like normal document flow in HTML, or a
  flexbox column, if you've done the HTML/CSS track).
- **`QHBoxLayout`** — arranges widgets horizontally, left to right (like a flexbox row).
- You'll nest these inside each other constantly for real layouts: a `QVBoxLayout` containing a
  `QHBoxLayout` of buttons at the bottom, for example — the exact same "layouts made of smaller layouts"
  thinking as nested flexbox containers or React's component composition (Career track, Day 5).

**A layout must be attached with `.setLayout(...)`** (or, for widgets placed inside another widget,
passed a `parent` — covered on Day 3) — creating a layout and adding widgets to it does nothing visible
until it's actually attached to a widget.

## Putting it together: a real, complete window file

`hello_window.py` in this folder is a complete, runnable example — open it, read it top to bottom, then
run it for real in your own terminal (`python hello_window.py`) to see an actual window with a label, a
text box, and a button that updates the label when clicked (you'll fully understand *how* the click
triggers code on Day 2 — for today, just observe that it works).

## Exercises

Open `exercises.py`. Every function builds some widgets/layout and returns them (or a value read from
them) for the check to inspect — none of them call `.show()` or `app.exec()`, per Day 0's explanation.
Run with `python exercises.py`.
