# Day 4 — QMainWindow, Menus, Toolbars, and Dialogs

## Objectives
- Understand `QMainWindow` — the standard base for a real application window, distinct from a plain `QWidget`
- Build a menu bar and connect menu actions to functions
- Show dialogs — both Qt's built-in ones (`QMessageBox`) and your own custom dialog windows

## `QMainWindow` vs. plain `QWidget`

Day 1's `QWidget` is a blank canvas — fine for a small utility window, but real applications almost always
use **`QMainWindow`** instead: it comes with a built-in structure for a menu bar, toolbars, a status bar
(a message strip along the bottom), and one designated **central widget** for your actual content.

```python
from PySide6.QtWidgets import QMainWindow, QLabel

window = QMainWindow()
window.setWindowTitle("Real App")
window.setCentralWidget(QLabel("Main content goes here"))
window.statusBar().showMessage("Ready")

print(window.centralWidget().text())      # "Main content goes here"
print(window.statusBar().currentMessage())  # "Ready"
```
`setCentralWidget(...)` is the one method that makes `QMainWindow` different from `QWidget` in practice —
you don't call `.setLayout(...)` on the main window directly; instead you give it ONE central widget
(often a plain `QWidget` with its own layout attached, containing everything else), and `QMainWindow`
arranges the menu bar, toolbars, and status bar around it automatically.

## Menus — `QMenuBar`, `QMenu`, and `QAction`

```python
from PySide6.QtGui import QAction

window = QMainWindow()
menu_bar = window.menuBar()          # every QMainWindow has one automatically
file_menu = menu_bar.addMenu("File")

save_action = QAction("Save", window)
save_action.triggered.connect(lambda: print("saving..."))
file_menu.addAction(save_action)

print(file_menu.actions()[0].text())    # "Save"
save_action.trigger()                     # simulates clicking the menu item -- prints "saving..."
```
A **`QAction`** represents a single command a user can trigger — a menu item, but also reusable as a
toolbar button or a keyboard shortcut, all pointing at the same underlying action. Its `triggered` signal
works exactly like a button's `clicked` signal (Day 2) — connect it to a function the same way.
`.trigger()` simulates activating it programmatically, without needing to click a real menu.

## `QMessageBox` — Qt's built-in dialogs for common situations

```python
from PySide6.QtWidgets import QMessageBox

box = QMessageBox()
box.setWindowTitle("Confirm")
box.setText("Delete this file?")
box.setStandardButtons(QMessageBox.Yes | QMessageBox.No)
box.setDefaultButton(QMessageBox.No)

print(box.text())     # "Delete this file?"
# box.exec()  -- shows the real dialog and BLOCKS until answered; only call this
#                in code you run yourself in a terminal, per Day 0
```
`QMessageBox` (and its shortcuts like `QMessageBox.information(...)`, `QMessageBox.warning(...)`,
`QMessageBox.question(...)`) covers the vast majority of real "tell the user something" or "confirm a
destructive action" needs without building a custom dialog at all.

## Building your own dialog

For anything more specific than a message box, a **`QDialog`** is a window designed to be shown modally
(blocking interaction with the rest of the app until it's closed) — built exactly like the widgets you
already know:

```python
from PySide6.QtWidgets import QDialog, QVBoxLayout, QLineEdit, QPushButton, QLabel

class NameDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Enter name")
        layout = QVBoxLayout()
        self.name_input = QLineEdit()
        ok_button = QPushButton("OK")
        ok_button.clicked.connect(self.accept)     # QDialog's built-in "close, success" method
        layout.addWidget(QLabel("Name:"))
        layout.addWidget(self.name_input)
        layout.addWidget(ok_button)
        self.setLayout(layout)

dialog = NameDialog()
dialog.name_input.setText("Sam")
print(dialog.name_input.text())    # "Sam" -- read its state directly, no need to .exec() to test it
```
A `QDialog` subclass is a genuinely common, real pattern: a small class bundling its own widgets, layout,
and behavior together — the same "a class packages state and behavior together" idea from the Python
track's OOP days (8-9), now applied to a window instead of a data model.

## Exercises

Open `exercises.py`. As with every day so far, build and inspect state directly — no `.exec()`.
