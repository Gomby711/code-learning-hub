"""
Day 13 mini project -- CSV Viewer (solution).
Run it yourself in a real terminal:

    python solution.py
"""
import csv
import os
from PySide6.QtCore import Qt, QObject, QThread, Signal, QAbstractTableModel, QModelIndex, QSortFilterProxyModel, QSettings
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QLineEdit, QTableView,
    QFileDialog, QLabel,
)
from PySide6.QtGui import QAction


class CsvLoadWorker(QObject):
    loaded = Signal(list, list)
    failed = Signal(str)

    def load(self, path):
        try:
            with open(path, newline="", encoding="utf-8") as f:
                reader = csv.reader(f)
                all_rows = list(reader)
            if not all_rows:
                self.loaded.emit([], [])
                return
            headers, rows = all_rows[0], all_rows[1:]
            self.loaded.emit(headers, rows)
        except Exception as e:
            self.failed.emit(str(e))


class CsvTableModel(QAbstractTableModel):
    def __init__(self):
        super().__init__()
        self._headers = []
        self._rows = []

    def rowCount(self, parent=QModelIndex()):
        return len(self._rows)

    def columnCount(self, parent=QModelIndex()):
        return len(self._headers)

    def data(self, index, role=Qt.DisplayRole):
        if role != Qt.DisplayRole:
            return None
        return self._rows[index.row()][index.column()]

    def headerData(self, section, orientation, role=Qt.DisplayRole):
        if role == Qt.DisplayRole and orientation == Qt.Horizontal:
            return self._headers[section]
        return None

    def set_data(self, headers, rows):
        self._headers = headers
        self._rows = rows
        self.layoutChanged.emit()


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
        last_folder = self.settings.value("last_folder", "")
        path, _ = QFileDialog.getOpenFileName(self, "Open CSV", last_folder, "CSV files (*.csv)")
        if not path:
            return
        self.settings.setValue("last_folder", os.path.dirname(path))
        self.settings.sync()
        self.load_path(path)

    def load_path(self, path):
        """The testable core: load a CSV path via a background worker thread."""
        self.statusBar().showMessage("Loading...")

        self.thread = QThread()
        self.worker = CsvLoadWorker()
        self.worker.moveToThread(self.thread)
        self.thread.started.connect(lambda: self.worker.load(path))
        self.worker.loaded.connect(self.on_loaded)
        self.worker.loaded.connect(self.thread.quit)
        self.worker.failed.connect(self.on_failed)
        self.worker.failed.connect(self.thread.quit)
        self.thread.start()

    def on_loaded(self, headers, rows):
        self.model.set_data(headers, rows)
        self.statusBar().showMessage(f"{len(rows)} row(s) loaded.")

    def on_failed(self, message):
        self.statusBar().showMessage(f"Failed to load: {message}")

    def on_search_text_changed(self, text):
        self.proxy.setFilterFixedString(text)


def main():
    app = QApplication.instance() or QApplication([])
    window = CsvViewer()
    window.show()
    app.exec()


if __name__ == "__main__":
    main()
