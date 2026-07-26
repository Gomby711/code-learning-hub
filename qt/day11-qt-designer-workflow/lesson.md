# Day 11 — The Qt Designer Workflow: Building UI Visually

## Objectives
- Understand what Qt Designer is, and why many real Qt teams build layouts visually instead of writing
  widget/layout code by hand for every screen
- Understand the `.ui` file format — an XML description of a widget tree, not Python code
- Load a `.ui` file at runtime with `QUiLoader`, and know the alternative (compiling it to Python with
  `pyside6-uic`)

## What Qt Designer actually is

**Qt Designer** is a separate, visual, drag-and-drop application (installed alongside PySide6 as the
`pyside6-designer` command) for building widget layouts by dragging widgets onto a canvas, arranging them,
and setting their properties in a panel — instead of writing `QVBoxLayout()`, `.addWidget(...)`, and
`.setText(...)` calls by hand, the way you have every day so far. It saves what you build as a `.ui` file.
**This app can't run or screenshot Qt Designer for you** (it's a full graphical application, not something
that fits this repo's headless-grading model) — but understanding the file format it produces, and how to
load that file, is the genuinely useful, portable skill; the drag-and-drop part is self-explanatory once
you open it yourself with `pyside6-designer` in a real terminal.

## Why teams use it

Building UI visually is faster to iterate on (drag, drop, see it immediately) and lets designers or
teammates who don't write Python still contribute to layout — a real division of labor at companies with
dedicated UI/UX people. The tradeoff: very dynamic UI (widgets that need to be created/arranged based on
runtime data, like Day 7's variable-length list of tasks) is often still easier to build in code. Most
real Qt codebases use *both*: static screens (settings dialogs, forms, about boxes) built in Designer,
dynamic content built in code — exactly the split you'll practice in Day 13's project.

## The `.ui` file — XML describing a widget tree

Open `signup_form.ui` in this folder in a plain text editor (it's just XML, entirely readable without
Designer):
```xml
<widget class="QLabel" name="titleLabel">
 <property name="text">
  <string>Sign Up</string>
 </property>
</widget>
```
This is the exact widget tree you've been building in Python all week — `class="QLabel"` is the widget
type, `name="titleLabel"` is its `objectName` (exactly like Day 5's QSS `#dangerButton` targeting), and
each `<property>` sets one property, the XML equivalent of a `.setText(...)` call. A Designer session
produces exactly this file; you never need to hand-write one yourself, but reading it demystifies what
Designer is actually doing.

## Loading a `.ui` file at runtime: `QUiLoader`

```python
from PySide6.QtWidgets import QApplication, QLabel, QLineEdit, QPushButton
from PySide6.QtUiTools import QUiLoader
from PySide6.QtCore import QFile

app = QApplication.instance() or QApplication([])

loader = QUiLoader()
ui_file = QFile("signup_form.ui")
ui_file.open(QFile.ReadOnly)
form = loader.load(ui_file)     # builds the ENTIRE widget tree from the file, right now
ui_file.close()

title = form.findChild(QLabel, "titleLabel")
name_edit = form.findChild(QLineEdit, "nameEdit")
submit = form.findChild(QPushButton, "submitButton")
print(title.text())               # "Sign Up"
print(name_edit.placeholderText())  # "Your name"
```
`findChild(WidgetType, "objectName")` is how you reach into a loaded `.ui` file's widgets from Python — it
searches the widget tree for a descendant of that type with that exact `objectName`, the same `objectName`
concept from Day 6's QSS styling. `QUiLoader` reads and builds the widget tree fresh every time your
program runs — simple, and the approach this track's exercises use.

## The alternative: compiling with `pyside6-uic`

A second, common approach compiles a `.ui` file into a real `.py` file, once, ahead of time:
```
pyside6-uic signup_form.ui -o ui_signup_form.py
```
This generates a Python class with all the widget-building code already written out (the exact same kind
of code you've hand-written all week), which you then import and use directly — slightly faster to load
at runtime (no XML parsing), and gives you real code you could technically read line-by-line, at the cost
of needing to re-run the compile step every time you edit the `.ui` file. **A real, practical gotcha
worth knowing about ahead of time:** on some systems, pip-installed command-line tools like `pyside6-uic`
land in a Python "Scripts" folder that isn't automatically on your terminal's `PATH`, so the bare command
comes back "not recognized." If that happens, find the file yourself (it sits alongside your Python
installation's `Scripts` folder — e.g. search for `pyside6-uic.exe` on Windows) and either run it by its
full path once or add that folder to your `PATH`. This is a common, unremarkable Python packaging quirk,
not something broken about Qt.

## Exercises

Open `exercises.py` — it loads `signup_form.ui` (already provided in this folder) with `QUiLoader` and
checks that you can correctly reach into the loaded form's widgets.
