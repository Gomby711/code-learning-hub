# Day 8 — Mini Project 1: A Real Desktop To-Do App

## Objectives
- Build a complete, real, runnable desktop application, tying together everything from Days 1-6:
  layouts, widgets, signals/slots, a checkable list, and QSS styling
- Practice structuring a GUI app's code so the UI and the "what happens when" logic stay readable

## The project

A to-do list desktop app with:
- A text box + "Add" button to add a new task
- Each task shown as a checkable item in a list (check it off when done)
- A "Delete selected" button to remove the currently-selected task
- Basic QSS styling so it doesn't look like an unstyled default window

This is deliberately the same *idea* as the Python track's Day 7 CLI task tracker and the Career track's
Day 6 in-memory CRUD backend — create, read, update (check off), delete — now with a real, clickable
interface instead of a terminal or an in-memory dict. This is the first of two mini projects in this
track — a smaller one now, to consolidate the fundamentals, and a bigger, more integrative one on Day 13
once you've picked up threading, files, and custom models.

## Run it for real

Unlike every other day so far, **this project genuinely needs a real window** to be worth anything — a
checkable to-do list you can't see or click isn't much of a demo. Per Day 0: don't use this app's ▶ Run
button for `starter.py`/`solution.py` (both call `app.exec()`, which will hang until the 15-second timeout
since there's no real screen for you to interact with here). Instead, open a real terminal and run:
```
python starter.py
```

## `starter.py` — your scaffold

`starter.py` in this folder is a real, structured PySide6 app with the window, layout, and widgets
already built — and the four pieces of *behavior* left as `# TODO`s for you to implement:
1. **Add a task** — read the text box, create a checkable `QListWidgetItem`, add it to the list, clear
   the text box
2. **Prevent adding empty tasks** — don't add anything if the text box is blank/whitespace
3. **Delete the selected task** — remove whichever item is currently selected in the list (do nothing if
   none is selected)
4. **Wire the signals** — connect the Add button's `clicked` and the text box's `returnPressed` (so
   pressing Enter also works) to your add-task function, and the Delete button's `clicked` to your
   delete-task function

Every concept you need was covered in Days 1-7: `QListWidgetItem` + `Qt.ItemIsUserCheckable` (Day 7),
`.clicked.connect(...)` and `.returnPressed.connect(...)` (Day 2), `.currentItem()`/`.currentRow()` for
finding the selected item (new — check `QListWidget`'s docs, or just try it: `list_widget.currentItem()`
returns `None` if nothing is selected, which is exactly the case you need to guard against for #3).

## Struggle productively, then compare

Give it a real, honest attempt — 20-30 minutes is reasonable for a project this size — before opening
`solution.py`. If you get stuck on one specific piece, it's completely fine to peek at just that one
function in the solution and then close it again; you don't have to choose between "fully stuck" and
"read the whole file."

## Exercises

There's no `exercises.py`/PASS-FAIL grading for a mini project (same as every other track's Day 7) —
the project itself, actually running and working when you use it, is the check. Run `starter.py`, build
the four pieces, and confirm you can add tasks, check them off, and delete them.
