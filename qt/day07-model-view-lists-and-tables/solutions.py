"""Day 7 solutions -- lists and tables."""
from PySide6.QtWidgets import QApplication, QListWidget, QTableWidget, QTableWidgetItem
from PySide6.QtCore import Qt

app = QApplication.instance() or QApplication([])


def build_todo_list(items):
    lw = QListWidget()
    for text in items:
        lw.addItem(text)
    return lw


def make_checkable(list_widget, index):
    item = list_widget.item(index)
    item.setFlags(item.flags() | Qt.ItemIsUserCheckable)
    item.setCheckState(Qt.Unchecked)
    return item


def build_score_table(rows):
    table = QTableWidget(len(rows), 2)
    table.setHorizontalHeaderLabels(["Name", "Score"])
    for r, (name, score) in enumerate(rows):
        table.setItem(r, 0, QTableWidgetItem(name))
        table.setItem(r, 1, QTableWidgetItem(str(score)))
    return table


def get_column_values(table, column):
    return [table.item(r, column).text() for r in range(table.rowCount())]
