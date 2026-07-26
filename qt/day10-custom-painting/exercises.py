"""
Day 10 exercises -- QPainter, tested by inspecting pixel colors on a QPixmap.
Run this file directly: python exercises.py
"""
from PySide6.QtGui import QPixmap, QPainter, QColor
from PySide6.QtWidgets import QApplication

app = QApplication.instance() or QApplication([])


def draw_filled_square(size, color_name):
    """Create a size x size QPixmap, fill the ENTIRE thing with QColor(color_name)
    using painter.fillRect(...), and return the pixmap.
    Remember to call painter.end() before returning.
    """
    # TODO: implement
    pass


def draw_two_rectangles():
    """Create a 100x100 QPixmap, fill it white, then draw:
      - a RED filled rectangle at (0, 0) with width 50, height 100 (the left half)
      - a GREEN filled rectangle at (50, 0) with width 50, height 100 (the right half)
    Return the pixmap. (setBrush + setPen to the same color, then drawRect, is the
    simplest way -- see the lesson.)
    """
    # TODO: implement
    pass


def pixel_at(pixmap, x, y):
    """Return the hex color name (e.g. "#ff0000") of the pixel at (x, y) in the
    given QPixmap.
    Hint: pixmap.toImage().pixelColor(x, y).name()
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    square = draw_filled_square(20, "red")
    check("draw_filled_square returns a pixmap", isinstance(square, QPixmap))
    if isinstance(square, QPixmap):
        img = square.toImage()
        check("draw_filled_square fills top-left", img.pixelColor(2, 2).name() == "#ff0000")
        check("draw_filled_square fills bottom-right", img.pixelColor(18, 18).name() == "#ff0000")
    else:
        check("draw_filled_square fills top-left", False)
        check("draw_filled_square fills bottom-right", False)

    split = draw_two_rectangles()
    check("draw_two_rectangles returns a pixmap", isinstance(split, QPixmap))
    if isinstance(split, QPixmap):
        img2 = split.toImage()
        check("draw_two_rectangles left half is red", img2.pixelColor(10, 50).name() == "#ff0000")
        check("draw_two_rectangles right half is green", img2.pixelColor(90, 50).name() == "#008000")
    else:
        check("draw_two_rectangles left half is red", False)
        check("draw_two_rectangles right half is green", False)

    check("pixel_at reads a known color", pixel_at(square, 2, 2) == "#ff0000" if isinstance(square, QPixmap) else False)
