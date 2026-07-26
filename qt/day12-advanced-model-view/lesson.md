# Day 12 — Advanced Model/View: Custom Models and Filtering

## Objectives
- Build a real custom model with `QAbstractTableModel`, the general-purpose foundation Day 7's
  `QTableWidget` is a convenience wrapper around
- Understand why a custom model scales better than `QTableWidget` once data gets large or comes from
  somewhere else (a file, a database, an API)
- Filter and sort a model's data live with `QSortFilterProxyModel`, without touching your original data

## Why go back to model/view after Day 7 already worked fine

Day 7's `QTableWidget` stores its own internal copy of every cell, as `QTableWidgetItem` objects — simple,
and completely fine for small, static tables. It breaks down once: your data already lives somewhere else
(a list of Python objects, rows from a database, JSON from an API) and you don't want to duplicate it into
a second, separate copy just for display; your data is large enough that creating a widget-item per cell
gets slow; or you want the SAME data shown in more than one place (a list and a chart, say) and kept
automatically in sync. A custom model solves all three: you write a class that tells Qt **how to read your
existing data**, and a view (`QTableView`) displays it directly — no separate copy, ever.

## `QAbstractTableModel` — implement four methods, get a real model

```python
from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex

class PeopleModel(QAbstractTableModel):
    def __init__(self, people):
        super().__init__()
        self._people = people          # list of (name, age) tuples -- YOUR existing data, untouched

    def rowCount(self, parent=QModelIndex()):
        return len(self._people)

    def columnCount(self, parent=QModelIndex()):
        return 2

    def data(self, index, role=Qt.DisplayRole):
        if role != Qt.DisplayRole:
            return None
        name, age = self._people[index.row()]
        return name if index.column() == 0 else str(age)

    def headerData(self, section, orientation, role=Qt.DisplayRole):
        if role == Qt.DisplayRole and orientation == Qt.Horizontal:
            return ["Name", "Age"][section]
        return None
```
- **`rowCount`/`columnCount`** — tell Qt the table's dimensions, computed from YOUR data, live (add to
  `self._people` and `rowCount` reflects it automatically the next time Qt asks).
- **`data(index, role)`** — the heart of the model: given a cell position (`index.row()`,
  `index.column()`) and a `role` (what KIND of information is being asked for — `Qt.DisplayRole` means
  "the text to show," there are others for icons, colors, tooltips, etc.), return the right value.
- **`headerData`** — column/row headers, the model equivalent of Day 7's `setHorizontalHeaderLabels`.

Using it — a `QTableView` (the model/view sibling of `QTableWidget`) just needs a model:
```python
from PySide6.QtWidgets import QTableView

model = PeopleModel([("Alice", 30), ("Bob", 25)])
view = QTableView()
view.setModel(model)     # the view now displays YOUR data directly, live
```
Even without a real view, you can call `data()`/`rowCount()` directly to test the model's logic — exactly
as today's exercises do.

## `QSortFilterProxyModel` — filtering and sorting without touching your data

A **proxy model** sits between your real model and a view, reordering or hiding rows *on the way through*
— your original model and data never change:

```python
from PySide6.QtCore import QSortFilterProxyModel

proxy = QSortFilterProxyModel()
proxy.setSourceModel(model)               # wraps the real model
proxy.setFilterKeyColumn(0)                 # filter based on column 0 (Name)
proxy.setFilterFixedString("A")               # only show rows where column 0 contains "A"

view.setModel(proxy)                            # the view shows the FILTERED view now

proxy.sort(1, Qt.AscendingOrder)                   # sort by column 1 (Age), ascending
```
This is directly the same idea as a search box live-filtering a list — type a search term, set it as the
proxy's filter string, and the view updates immediately, with zero changes to your actual data or model.
`proxy.data(proxy.index(row, col))` reads a value through the proxy's current filter/sort order — useful
for testing, and exactly what today's exercises do.

## Exercises

Open `exercises.py`. Every check calls model/proxy methods directly — no `QTableView`, no window, per
Day 0's pattern all week.
