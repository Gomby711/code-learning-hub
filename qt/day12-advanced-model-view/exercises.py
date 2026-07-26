"""
Day 12 exercises -- custom models and filtering/sorting.
Run this file directly: python exercises.py
"""
from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex, QSortFilterProxyModel
from PySide6.QtWidgets import QApplication

app = QApplication.instance() or QApplication([])


class PeopleModel(QAbstractTableModel):
    """A model over a list of (name, age) tuples. Column 0 = name, column 1 = age.
    TODO: implement rowCount, columnCount, data, and headerData -- see the lesson
    for the exact shape each one needs.
    """
    def __init__(self, people):
        super().__init__()
        self._people = people

    def rowCount(self, parent=QModelIndex()):
        # TODO: implement
        pass

    def columnCount(self, parent=QModelIndex()):
        # TODO: implement
        pass

    def data(self, index, role=Qt.DisplayRole):
        # TODO: implement -- return None for any role other than Qt.DisplayRole
        pass

    def headerData(self, section, orientation, role=Qt.DisplayRole):
        # TODO: implement -- headers are ["Name", "Age"], only for Qt.Horizontal + Qt.DisplayRole
        pass


def make_filtered_proxy(model, filter_text):
    """Given a PeopleModel and a filter string, return a QSortFilterProxyModel
    wrapping it, filtering on column 0 (name) for filter_text.
    """
    # TODO: implement
    pass


def get_column_values(model_or_proxy, column):
    """Given ANY model or proxy model with rowCount()/data(), return a list of
    the .data() values in the given column, top to bottom, in its CURRENT order
    (respecting any active filter/sort).
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    people = [("Alice", 30), ("Bob", 25), ("Amy", 40)]
    model = PeopleModel(people)

    check("rowCount", model.rowCount() == 3)
    check("columnCount", model.columnCount() == 2)
    check("data name", model.data(model.index(0, 0)) == "Alice")
    check("data age", model.data(model.index(1, 1)) == "25")
    check("headerData", model.headerData(0, Qt.Horizontal) == "Name")

    proxy = make_filtered_proxy(model, "A")
    check("make_filtered_proxy returns a proxy", isinstance(proxy, QSortFilterProxyModel))
    if isinstance(proxy, QSortFilterProxyModel):
        check("filter narrows to matching rows", proxy.rowCount() == 2)
        names = get_column_values(proxy, 0)
        check("get_column_values through a filtered proxy", sorted(names) == ["Alice", "Amy"])

        proxy.sort(1, Qt.AscendingOrder)
        ages = get_column_values(proxy, 1)
        check("proxy respects sort order", ages == ["30", "40"])
    else:
        check("filter narrows to matching rows", False)
        check("get_column_values through a filtered proxy", False)
        check("proxy respects sort order", False)

    check("get_column_values on the unfiltered model", get_column_values(model, 0) == ["Alice", "Bob", "Amy"])
