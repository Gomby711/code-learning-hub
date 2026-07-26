# Day 14 — Testing GUI Code Properly, and Packaging for Real Distribution

## Objectives
- Understand `pytest-qt` — the real, professional tool for automated Qt testing (the same offscreen
  technique this app has been using all week, formalized into an actual test suite)
- Package a PySide6 app into a single, real, double-click-to-run executable with **PyInstaller**
- Know the realistic difference between "runs on my machine" and "something I can actually hand a stranger"

## `pytest-qt` — the real version of what this app has been doing all week

Every exercise this week has quietly used the same core trick real Qt developers use: build widgets,
simulate interaction (`.click()`, `.setText(...)`), and assert on the resulting state — no visible window,
no manual clicking. The actual professional tool for this is **`pytest-qt`**, a plugin for `pytest` (the
same test framework from the Python track's Day 12) that adds a `qtbot` fixture for simulating real user
input (not just calling `.click()` directly, but genuinely dispatching mouse/keyboard events):

```
pip install pytest pytest-qt
```
```python
# test_todo.py
from solution import TodoApp

def test_add_task(qtbot):
    widget = TodoApp()
    qtbot.addWidget(widget)          # registers it for qtbot to manage/clean up
    widget.input.setText("Buy milk")
    qtbot.mouseClick(widget.add_button, Qt.LeftButton)   # a REAL simulated click
    assert widget.list_widget.count() == 1
    assert widget.list_widget.item(0).text() == "Buy milk"
```
Run it with `pytest test_todo.py` — same command, same PASS/FAIL reporting, same philosophy as every
other test you've written in this repo. The only new piece is the `qtbot` fixture giving you realistic
simulated interaction instead of calling widget methods directly. Today's exercises don't require
installing `pytest-qt` (this app's own grader still uses the simpler direct-call style you've used
throughout this track) — but knowing this tool exists, and roughly how it's used, is genuinely what a
real Qt job expects.

## Packaging with PyInstaller

Everything so far has needed Python and PySide6 installed to run. **PyInstaller** bundles your script,
the Python interpreter, and every library it depends on into one distributable package — so someone with
no Python installed at all can run your app.

```
pip install pyinstaller
pyinstaller --onefile --windowed --name TodoApp solution.py
```
- `--onefile` — bundle everything into a single `.exe` (as opposed to a folder of many files)
- `--windowed` — don't open a console/terminal window alongside your GUI (you want this for any real GUI
  app; leaving it off is mostly useful while debugging, so you can see printed errors)
- `--name TodoApp` — controls the output file's name

The result lands in a new `dist/` folder — `dist/TodoApp.exe` is a real, standalone, double-click-to-run
program. This is the direct desktop-app equivalent of the Career track's Day 7 (Vercel/Railway
deployment): the step that turns "code that runs for me" into "something anyone can actually use," and
arguably the single most satisfying moment in this entire track — handing a working `.exe` to a friend who
has never heard of Python and watching it just work.

## Packaging for macOS and Linux — what actually changes

PyInstaller itself is cross-platform, but **you must run it ON the target operating system** — it doesn't
cross-compile. Building a Windows `.exe` requires running PyInstaller on Windows; building for macOS or
Linux means running the same command on that OS instead. The command itself is nearly identical:

```
# macOS -- produces dist/TodoApp.app, a real double-clickable Mac application bundle
pyinstaller --onefile --windowed --name TodoApp solution.py

# Linux -- produces dist/TodoApp, a standalone executable (no .app/.exe wrapper concept on Linux)
pyinstaller --onefile --windowed --name TodoApp solution.py
```
What genuinely differs per platform, worth knowing exists even before you hit it:
- **macOS** adds real friction beyond the build itself: unsigned apps trigger a Gatekeeper warning
  ("cannot be opened because the developer cannot be verified"), and distributing outside your own machine
  smoothly requires an Apple Developer account to **code-sign and notarize** the build — a real cost and
  process, not just a checkbox.
- **Linux** has no single universal package format — a raw PyInstaller binary works, but real Linux
  distribution more often means an **AppImage** (a single portable file, closer to Windows' `.exe`
  experience) or a **Flatpak**, each with its own packaging tooling on top of PyInstaller.
- **Windows** (what this lesson has used throughout) is the simplest of the three: a plain `.exe` runs
  everywhere without a signing requirement, though unsigned `.exe`s do still get a "Windows protected your
  PC" SmartScreen prompt on first run from an unknown publisher.

You don't need to memorize this — the practical takeaway is simply: **"build once, run everywhere" is not
how native desktop packaging works**, unlike a website (Career track Day 7) where one deploy serves every
visitor's browser identically. If cross-platform distribution matters for a real project, budget real time
for it per target OS.

## A realistic note on packaging

PyInstaller bundles are large (expect 40-100+ MB even for a small PySide6 app, since the entire Qt
framework ships inside) and antivirus software occasionally flags PyInstaller-built `.exe` files as
suspicious on first run (a well-known false positive caused by how PyInstaller bundles code, not a sign
anything is actually wrong) — both are normal, expected realities of shipping a Python desktop app this
way, not something you did wrong.

## Exercises

Open `exercises.py` — a few small, direct checks reinforcing that a built app's core logic is correctly
separated from its `main()`/`app.exec()` entry point (exactly the shape `solution.py` from Day 8 already
follows, and exactly the shape that makes a class both testable AND packageable).
