"""
A real, actually-threaded demo. NOT graded -- run it yourself:

    python slow_demo.py

Click "Start slow work" and notice you can still move the window, resize it, and
the spinner keeps animating -- the UI never freezes, because the 3-second "work"
runs on a background QThread instead of the main thread.
"""
import time
from PySide6.QtCore import QObject, QThread, Signal
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QPushButton


class Worker(QObject):
    finished = Signal(str)

    def do_slow_thing(self):
        time.sleep(3)   # imagine a slow file read or network call
        self.finished.emit("Work complete!")


class DemoWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Threading Demo")
        self.resize(320, 140)

        self.status = QLabel("Idle. Try dragging this window while working!")
        self.status.setWordWrap(True)
        self.start_button = QPushButton("Start slow work")
        self.start_button.clicked.connect(self.start_work)

        layout = QVBoxLayout()
        layout.addWidget(self.status)
        layout.addWidget(self.start_button)
        self.setLayout(layout)

        self.thread = None
        self.worker = None

    def start_work(self):
        self.start_button.setEnabled(False)
        self.status.setText("Working in the background... drag this window now!")

        self.thread = QThread()
        self.worker = Worker()
        self.worker.moveToThread(self.thread)
        self.thread.started.connect(self.worker.do_slow_thing)
        self.worker.finished.connect(self.on_finished)
        self.worker.finished.connect(self.thread.quit)
        self.thread.start()

    def on_finished(self, message):
        self.status.setText(message)
        self.start_button.setEnabled(True)


def main():
    app = QApplication.instance() or QApplication([])
    window = DemoWindow()
    window.show()
    app.exec()


if __name__ == "__main__":
    main()
