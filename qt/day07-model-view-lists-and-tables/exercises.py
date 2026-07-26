"""
Day 7 exercises -- lists and tables.
Run this file directly: python exercises.py
"""
from PySide6.QtWidgets import QApplication, QListWidget, QTableWidget, QTableWidgetItem
from PySide6.QtCore import Qt

app = QApplication.instance() or QApplication([])


def build_todo_list(items):
    """Given a list of strings, build a QListWidget with one item per string, in
    order. Return the list widget.
    """
    # TODO: implement
    pass


def make_checkable(list_widget, index):
    """Given a QListWidget and an index, make the item at that index checkable
    and set its initial check state to Unchecked. Return the item.
    Hint: item.setFlags(item.flags() | Qt.ItemIsUserCheckable)
    """
    # TODO: implement
    pass


def build_score_table(rows):
    """Given rows -- a list of (name, score) tuples -- build a QTableWidget with
    len(rows) rows and 2 columns, headers ["Name", "Score"], filled in with
    QTableWidgetItem(name) and QTableWidgetItem(str(score)) per row.
    Return the table.
    """
    # TODO: implement
    pass


def get_column_values(table, column):
    """Given a QTableWidget and a column index, return a list of the .text() of
    every item in that column, top to bottom.
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    todo = build_todo_list(["Buy milk", "Walk dog", "Finish lesson"])
    check("build_todo_list count", todo is not None and todo.count() == 3)
    check("build_todo_list order", todo is not None and todo.item(1).text() == "Walk dog")

    item = make_checkable(todo, 0) if todo else None
    check("make_checkable is checkable", item is not None and bool(item.flags() & Qt.ItemIsUserCheckable))
    if item is not None:
        check("make_checkable starts unchecked", item.checkState() == Qt.Unchecked)
        item.setCheckState(Qt.Checked)
        check("make_checkable can be checked", item.checkState() == Qt.Checked)
    else:
        check("make_checkable starts unchecked", False)
        check("make_checkable can be checked", False)

    table = build_score_table([("Alice", 95), ("Bob", 87)])
    check("build_score_table dimensions", table is not None and table.rowCount() == 2 and table.columnCount() == 2)
    check(
        "build_score_table headers",
        table is not None and [table.horizontalHeaderItem(i).text() for i in range(2)] == ["Name", "Score"],
    )
    check("build_score_table cell value", table is not None and table.item(0, 0).text() == "Alice")

    names = get_column_values(table, 0) if table else None
    check("get_column_values", names == ["Alice", "Bob"])
