"""Day 10 solutions -- QPainter."""
from PySide6.QtGui import QPixmap, QPainter, QColor
from PySide6.QtWidgets import QApplication

app = QApplication.instance() or QApplication([])


def draw_filled_square(size, color_name):
    pixmap = QPixmap(size, size)
    painter = QPainter(pixmap)
    painter.fillRect(pixmap.rect(), QColor(color_name))
    painter.end()
    return pixmap


def draw_two_rectangles():
    pixmap = QPixmap(100, 100)
    pixmap.fill(QColor("white"))
    painter = QPainter(pixmap)
    painter.setPen(QColor("red"))
    painter.setBrush(QColor("red"))
    painter.drawRect(0, 0, 50, 100)
    painter.setPen(QColor("green"))
    painter.setBrush(QColor("green"))
    painter.drawRect(50, 0, 50, 100)
    painter.end()
    return pixmap


def pixel_at(pixmap, x, y):
    return pixmap.toImage().pixelColor(x, y).name()
