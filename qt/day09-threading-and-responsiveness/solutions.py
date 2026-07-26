"""Day 9 solutions -- worker-object logic."""
from PySide6.QtCore import QObject, Signal
from PySide6.QtWidgets import QApplication

app = QApplication.instance() or QApplication([])


class SumWorker(QObject):
    finished = Signal(int)

    def compute(self, numbers):
        self.finished.emit(sum(numbers))


class ProgressWorker(QObject):
    progress = Signal(int)
    finished = Signal(list)

    def process(self, items):
        results = []
        for i, item in enumerate(items):
            results.append(item.upper())
            self.progress.emit(i + 1)
        self.finished.emit(results)
