# Learn Qt (PySide6) — 15-Day Real Desktop Apps Track

**Goal:** go from "I know Python" to genuinely **fluent** in building and shipping real, installable
desktop applications with a native GUI — not just able to follow a tutorial, but able to reach for the
right tool (threading, custom painting, a real data model, Designer) unprompted when a project calls for
it. This track assumes you've already completed (or are well into) the Python track in this repo — every
lesson here writes ordinary Python, plus a new library on top: **PySide6**, the official Qt bindings for
Python.

## Why this track exists

Everything you build in the Python track runs in a terminal — you type, it prints. That's the right way
to learn the language, but almost no end user of a real desktop application ever sees a terminal. **Qt**
is a mature, professional, cross-platform GUI framework (the actual toolkit behind real applications
like VLC, OBS Studio, and large parts of Autodesk Maya) — and **PySide6** lets you build with it using
Python instead of C++. Finishing this track means you can take any idea and ship it as a real `.exe` a
non-technical friend can double-click, with buttons, forms, and windows, not just a script.

## How this folder works

Same shape as the other tracks: `lesson.md` per day, `exercises.py` with `# TODO` blanks, `solutions.py`
to check against. One real difference worth understanding up front, covered in full in Day 0: **graded
exercises never call `app.exec()`** (the line that opens an interactive window and waits for you to
close it) — because this app runs your code headlessly (no visible window) to grade it automatically,
exactly the same way real Qt projects run their automated tests. Every lesson tells you the exact command
to run in your own terminal instead, whenever you want to actually **see** the window you built.

## Setup (do this once, before Day 0)

```
pip install PySide6
```
That's the only dependency for most of this track. Day 14 additionally needs `pip install pyinstaller`
(and optionally `pytest pytest-qt`) when you get there — the lesson tells you exactly when.

## Day index

| Day | Topic |
|---|---|
| 0 | Primer: what a GUI framework is, event-driven programming, and why/how this app grades GUI code without showing a window |
| 1 | Your first window: `QApplication`, `QWidget`, basic widgets, layouts |
| 2 | Signals and slots — Qt's core event-handling paradigm |
| 3 | More widgets and layouts: forms, input widgets, nested layouts |
| 4 | `QMainWindow`, menus, toolbars, and dialogs |
| 5 | Real files and persistent settings: `QFileDialog`, `QSettings` |
| 6 | Styling with Qt Style Sheets (QSS) — CSS-like styling for real desktop UI |
| 7 | Model-view basics: `QListWidget`, `QTableWidget`, and displaying real data |
| 8 | Mini project 1: a real desktop to-do app (Week 1 review) |
| 9 | Threading: keeping the UI responsive with `QThread` and worker objects |
| 10 | Custom painting with `QPainter` — drawing your own widgets |
| 11 | The Qt Designer workflow: `.ui` files and `QUiLoader` |
| 12 | Advanced model/view: custom `QAbstractTableModel` and `QSortFilterProxyModel` |
| 13 | Mini project 2: a CSV viewer integrating threading, files, settings, and custom models |
| 14 | Testing GUI code properly, and packaging for real distribution (Windows/macOS/Linux) |

## The arc

**Days 0-4 — Foundations.** What a widget is, how layouts arrange them, Qt's signal/slot event model, and
full application windows with menus and dialogs — the same core ideas every GUI framework has (including
the DOM events you may already know from the HTML/CSS and JS tracks), applied to a native desktop toolkit.

**Days 5-8 — Building and shipping a real (small) app.** Files, persistent settings, visual styling, and
displaying real data, culminating in Mini Project 1 — a complete, working to-do app tying Week 1 together.

**Days 9-12 — The skills that separate "toy app" from "real app."** Threading (so slow work never freezes
the UI), custom drawing, the visual Designer workflow real teams use, and a genuine custom data model —
the specific gaps that most tutorials skip and most real Qt jobs assume you already have.

**Days 13-14 — Integration and shipping.** Mini Project 2 forces everything from Days 5-12 to work
together in one coherent app, then Day 14 covers testing GUI code properly (`pytest-qt`) and packaging a
real, distributable executable for Windows, macOS, and Linux — the desktop-app equivalent of Day 7 in the
Career & Beyond track's deployment lesson.
