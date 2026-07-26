"""
Day 13 mini project -- CSV Viewer.
Run this yourself in a real terminal (NOT the in-app Run button -- see lesson.md):

    python starter.py

Then use File > Open CSV... and pick sample_people.csv (in this same folder).
"""
import csv
from PySide6.QtCore import Qt, QObject, QThread, Signal, QAbstractTableModel, QModelIndex, QSortFilterProxyModel, QSettings
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QLineEdit, QTableView,
    QFileDialog, QLabel,
)
from PySide6.QtGui import QAction


class CsvLoadWorker(QObject):
    loaded = Signal(list, list)   # headers, rows
    failed = Signal(str)

    def load(self, path):
        # TODO 1: open `path` with Python's csv module (csv.reader), read every
        # row into a list. The FIRST row is headers, everything after is data
        # rows. Emit self.loaded(headers, rows) when done.
        # Wrap the whole thing in try/except and emit self.failed(str(e)) on error.
        pass


class CsvTableModel(QAbstractTableModel):
    """TODO 2: implement rowCount, columnCount, data, and headerData exactly
    like Day 12 -- but sourced from self._headers / self._rows instead of a
    fixed list of tuples. Also implement set_data(headers, rows) which replaces
    self._headers/self._rows and calls self.layoutChanged.emit() so the view
    redraws with the new data.
    """
    def __init__(self):
        super().__init__()
        self._headers = []
        self._rows = []

    def rowCount(self, parent=QModelIndex()):
        # TODO: implement
        pass

    def columnCount(self, parent=QModelIndex()):
        # TODO: implement
        pass

    def data(self, index, role=Qt.DisplayRole):
        # TODO: implement
        pass

    def headerData(self, section, orientation, role=Qt.DisplayRole):
        # TODO: implement
        pass

    def set_data(self, headers, rows):
        # TODO: implement
        pass


class CsvViewer(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("CSV Viewer")
        self.resize(560, 420)
        self.settings = QSettings("CodeLearningHub", "CsvViewer")

        self.model = CsvTableModel()
        self.proxy = QSortFilterProxyModel()
        self.proxy.setSourceModel(self.model)
        self.proxy.setFilterKeyColumn(0)

        self.table = QTableView()
        self.table.setModel(self.proxy)

        self.search_box = QLineEdit()
        self.search_box.setPlaceholderText("Search first column...")
        self.search_box.textChanged.connect(self.on_search_text_changed)

        central = QWidget()
        layout = QVBoxLayout()
        layout.addWidget(self.search_box)
        layout.addWidget(self.table)
        central.setLayout(layout)
        self.setCentralWidget(central)
        self.statusBar().showMessage("Open a CSV file to begin.")

        open_action = QAction("Open CSV...", self)
        open_action.triggered.connect(self.on_open_clicked)
        self.menuBar().addMenu("File").addAction(open_action)

        self.thread = None
        self.worker = None

    def on_open_clicked(self):
        # TODO 3:
        #   - last_folder = self.settings.value("last_folder", "")
        #   - path, _ = QFileDialog.getOpenFileName(self, "Open CSV", last_folder, "CSV files (*.csv)")
        #   - if no path was picked (empty string), just return
        #   - save the NEW folder: self.settings.setValue("last_folder", <folder of path>), self.settings.sync()
        #   - update the status bar to "Loading..."
        #   - create a CsvLoadWorker, moveToThread it (Day 9's pattern), connect
        #     .loaded to a slot that calls self.model.set_data(headers, rows) and
        #     updates the status bar with the row count, start the thread and
        #     call worker.load(path) once it starts
        pass

    def on_search_text_changed(self, text):
        # TODO 4: set the proxy's filter string to `text`
        pass


def main():
    app = QApplication.instance() or QApplication([])
    window = CsvViewer()
    window.show()
    app.exec()


if __name__ == "__main__":
    main()
