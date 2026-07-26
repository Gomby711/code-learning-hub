"""
A real file-picker demo. NOT graded -- run it yourself:

    python browse_demo.py

Click "Browse..." to open a REAL native file picker.
"""
from PySide6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QFileDialog,
)


def describe_file(path):
    """The testable LOGIC -- takes a path, returns a description. No dialog here
    at all, which is exactly why this function is easy to unit test (see
    exercises.py) even though the button that calls it opens a real dialog."""
    if not path:
        return "No file selected."
    return f"You picked: {path}"


class BrowseDemo(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("File Picker Demo")
        self.resize(360, 120)

        self.result_label = QLabel("No file selected.")
        browse_button = QPushButton("Browse...")
        browse_button.clicked.connect(self.on_browse)

        row = QHBoxLayout()
        row.addWidget(browse_button)
        layout = QVBoxLayout()
        layout.addWidget(self.result_label)
        layout.addLayout(row)
        self.setLayout(layout)

    def on_browse(self):
        path, _ = QFileDialog.getOpenFileName(self, "Choose a file", "", "All files (*)")
        self.result_label.setText(describe_file(path))


def main():
    app = QApplication.instance() or QApplication([])
    window = BrowseDemo()
    window.show()
    app.exec()


if __name__ == "__main__":
    main()
