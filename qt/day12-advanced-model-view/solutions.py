"""Day 12 solutions -- custom models and filtering/sorting."""
from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex, QSortFilterProxyModel
from PySide6.QtWidgets import QApplication

app = QApplication.instance() or QApplication([])


class PeopleModel(QAbstractTableModel):
    def __init__(self, people):
        super().__init__()
        self._people = people

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


def make_filtered_proxy(model, filter_text):
    proxy = QSortFilterProxyModel()
    proxy.setSourceModel(model)
    proxy.setFilterKeyColumn(0)
    proxy.setFilterFixedString(filter_text)
    return proxy


def get_column_values(model_or_proxy, column):
    return [model_or_proxy.data(model_or_proxy.index(r, column)) for r in range(model_or_proxy.rowCount())]
