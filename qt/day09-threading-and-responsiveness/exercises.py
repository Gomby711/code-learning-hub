"""
Day 9 exercises -- worker-object logic (tested synchronously, no real QThread --
see the lesson for why).
Run this file directly: python exercises.py
"""
from PySide6.QtCore import QObject, Signal
from PySide6.QtWidgets import QApplication

app = QApplication.instance() or QApplication([])


class SumWorker(QObject):
    """A worker whose job is to sum a list of numbers.
    TODO:
      1. Declare a class-level signal `finished = Signal(int)`
      2. Implement compute(self, numbers): sum the numbers and emit `finished`
         with the total.
    """
    # TODO: implement


class ProgressWorker(QObject):
    """A worker that 'processes' a list of items one at a time, reporting
    progress as it goes.
    TODO:
      1. Declare two class-level signals:
         - progress = Signal(int)   -- emits the number of items done SO FAR
         - finished = Signal(list)  -- emits the final list of processed results
      2. Implement process(self, items): for each item in items (in order),
         uppercase it (str.upper()), collect the results, and after EACH item
         emit `progress` with how many have been done so far (1, 2, 3, ...).
         After the loop, emit `finished` with the full list of uppercased results.
    """
    # TODO: implement


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    try:
        sum_worker = SumWorker()
        results = []
        sum_worker.finished.connect(lambda total: results.append(total))
        sum_worker.compute([1, 2, 3, 4, 5])
        check("SumWorker.finished emits the correct sum", results == [15])
    except Exception:
        check("SumWorker.finished emits the correct sum", False)

    try:
        progress_worker = ProgressWorker()
        progress_events = []
        final_results = []
        progress_worker.progress.connect(lambda n: progress_events.append(n))
        progress_worker.finished.connect(lambda r: final_results.append(r))
        progress_worker.process(["a", "b", "c"])
        check("ProgressWorker.progress fires once per item, in order", progress_events == [1, 2, 3])
        check("ProgressWorker.finished emits the processed results", final_results == [["A", "B", "C"]])
    except Exception:
        check("ProgressWorker.progress fires once per item, in order", False)
        check("ProgressWorker.finished emits the processed results", False)
