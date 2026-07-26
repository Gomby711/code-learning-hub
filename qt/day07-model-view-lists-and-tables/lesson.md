# Day 7 — Displaying Real Data: Lists and Tables

## Objectives
- Display a collection of items with `QListWidget`
- Display tabular data with `QTableWidget`
- Understand, at a conceptual level, the more powerful **model/view** pattern these convenience widgets
  are built on top of, and when you'd reach for it instead

## `QListWidget` — a simple, ready-to-use list

```python
from PySide6.QtWidgets import QListWidget

todo = QListWidget()
todo.addItem("Buy milk")
todo.addItem("Walk dog")
todo.addItem("Finish Qt lesson")

print(todo.count())               # 3
print(todo.item(0).text())          # "Buy milk"

todo.item(1).setText("Walk the dog")
print(todo.item(1).text())            # "Walk the dog"

todo.takeItem(0)                        # removes "Buy milk"
print(todo.count())                       # 2
```
`QListWidget` manages a list of `QListWidgetItem`s for you — add, read, edit, and remove them with plain
methods, no manual widget-per-row bookkeeping. This is the natural fit for the Career track's Day 2-3
"array-like" mental model, now with a real, visible on-screen list instead of a Python list.

### Making items checkable — a real to-do list

```python
from PySide6.QtCore import Qt

item = todo.item(0)
item.setFlags(item.flags() | Qt.ItemIsUserCheckable)
item.setCheckState(Qt.Unchecked)

item.setCheckState(Qt.Checked)
print(item.checkState() == Qt.Checked)     # True
```
`setFlags(...)` controls what a user is even ALLOWED to do with an item (checkable, editable, selectable)
— items start without checkboxes at all; you opt in explicitly. This is the exact mechanism you'll use in
tomorrow's mini project to build a real, checkable to-do list.

## `QTableWidget` — rows and columns

```python
from PySide6.QtWidgets import QTableWidget, QTableWidgetItem

table = QTableWidget(3, 2)          # 3 rows, 2 columns, to start
table.setHorizontalHeaderLabels(["Name", "Score"])

table.setItem(0, 0, QTableWidgetItem("Alice"))
table.setItem(0, 1, QTableWidgetItem("95"))
table.setItem(1, 0, QTableWidgetItem("Bob"))
table.setItem(1, 1, QTableWidgetItem("87"))

print(table.rowCount(), table.columnCount())      # 3 2
print(table.item(0, 0).text())                       # "Alice"
```
Cells are addressed by `(row, column)` — the exact same 2D coordinate thinking as a grid in the HTML/CSS
track (Day 6) or a nested list/2D array pattern in the Python track. Each cell holds a `QTableWidgetItem`,
not a plain string — that's what gives every cell its own selectable/editable/checkable state, same as
list items above.

## The model/view pattern, briefly — what these widgets are actually built on

`QListWidget` and `QTableWidget` are convenience widgets: easy to use, and completely fine for small to
medium amounts of data. Underneath, Qt has a more powerful, more general system called **model/view**:
a **model** holds and manages the actual data (independent of any UI), and one or more **views**
(`QListView`, `QTableView`) display that same model, staying automatically in sync with it. The practical
reason this matters: if your data is large (tens of thousands of rows), lives in a database, or needs to
be displayed in more than one place at once, model/view scales in ways that manually managing individual
items doesn't. For a large fraction of real, smaller desktop tools, `QListWidget`/`QTableWidget` is the right, simpler
tool. **Day 12** comes back to this and builds a real custom model — know that it exists as the next step
once you outgrow today's convenience widgets.

## Exercises

Open `exercises.py`. Build and read from lists/tables directly — no window needed to verify any of this.
