# Day 0 — Before You Build Any Window: GUI Programming, and How Grading Works Here

## Objectives
- Understand what a GUI framework actually provides, and how "event-driven" programs differ from the
  top-to-bottom scripts you've written so far
- Understand exactly why and how this app grades your Qt exercises **without ever showing you a window**
  — and why that's not a workaround, it's how real Qt projects test their UI code too
- Get PySide6 installed and confirm it works

## What a GUI framework actually gives you

Every program you've written in the Python track runs top to bottom: it starts, does things in order,
and finishes. A GUI (Graphical User Interface) application is fundamentally different in shape: it draws
a window with buttons, text fields, and other visual pieces (**widgets**), then **waits** — doing
nothing — until the user clicks, types, or otherwise interacts with something. When that happens, your
code runs *in response*, then the program goes back to waiting. This "wait for something to happen, then
react" shape is called **event-driven programming**, and it's the shared foundation of every GUI
framework and every interactive web page (the same underlying idea as `addEventListener` in the
JavaScript track, and the same underlying idea as a REST API's server waiting for a request in the
Career track's Day 6 — waiting, then reacting, shows up constantly in real software).

**Qt** is a mature, professional toolkit that provides the actual visual widgets (buttons, text boxes,
windows), the machinery to draw them on screen, and the event-handling system that connects user actions
to your code. **PySide6** is the official set of Python bindings for Qt — it lets you call all of Qt's
real, battle-tested C++ functionality directly from ordinary Python.

## The two things every Qt app needs

```python
from PySide6.QtWidgets import QApplication, QWidget

app = QApplication([])      # ONE of these must exist before creating any widget
window = QWidget()          # a blank window
window.show()               # tell it to actually become visible
app.exec()                  # start the event loop -- waits here until the window is closed
```
- **`QApplication`** manages application-wide state (fonts, styles, the event loop itself) — every Qt
  program creates exactly one, before creating any widgets.
- **`app.exec()`** starts the **event loop** — this is the line that actually makes the "wait, then
  react" behavior happen. Execution stops here and stays here, handling clicks and other events, until
  the user closes the window (or your code calls `app.quit()`). Nothing after `app.exec()` in your file
  runs until the window closes.

## Why this app's exercises never call `app.exec()`

This local app grades your code the exact same way it grades Python/JS exercises: it runs your file as a
subprocess and reads what gets printed. If a graded file called `app.exec()`, the process would open an
invisible (headless) window and then **hang forever waiting for a click that can never come** — there's
no display, and nothing here can click your buttons for you. So every exercise in this track is
structured to build widgets and **check their state directly in code** — reading a label's text, checking
whether a checkbox is checked, simulating a click programmatically — all without ever starting the event
loop. Watch:

```python
from PySide6.QtWidgets import QApplication, QPushButton

app = QApplication.instance() or QApplication([])   # create ONE, or reuse the existing one
btn = QPushButton("Save")
print(btn.text())          # "Save" -- printed instantly, no window, no waiting
btn.click()                 # simulates a real click programmatically -- no window needed
```
`QApplication.instance() or QApplication([])` is a pattern you'll use constantly in this track's
exercises: it reuses an existing `QApplication` if one already exists (grading may run multiple checks
against the same process) rather than crashing with "a QApplication already exists."

**This is not a toy simplification invented for this app** — real Qt projects test their UI exactly this
way, using a tool called `pytest-qt` and an environment variable (`QT_QPA_PLATFORM=offscreen`, which this
app's local server already sets for you automatically) that renders widgets without any real screen.
Checking "does this button have the right label" and "does clicking it produce the right result" in code,
automatically, is a genuinely professional testing practice — you're learning the real skill, not a
workaround.

## When you actually want to SEE the window

Every lesson from here on gives you real, complete example files. To see them running for real, as an
actual window on your screen, run them yourself in a real terminal — not through this app's ▶ Run button:
```
python day01-first-window-and-widgets/hello_window.py
```
This is the same distinction Day 7 of the Career track draws for deployment: this app is for fast,
graded, iterative practice; your own terminal is for the real, final experience of what you built.

## Setup

```
pip install PySide6
```
Confirm it worked:
```python
import PySide6
print(PySide6.__version__)
```

## Exercises

There's no `exercises.py` today — Day 0 across every track in this repo is orientation. Your one task:
run the `pip install` command above if you haven't already, and run the confirmation snippet to make sure
it printed a version number without errors.
