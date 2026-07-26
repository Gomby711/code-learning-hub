# Day 10 — Custom Painting with QPainter

## Objectives
- Understand `QPainter` — Qt's 2D drawing API, for anything a stock widget can't already show you
- Draw shapes, lines, and text onto a real surface (`QPixmap`)
- Override `paintEvent` to make a genuinely custom-drawn widget

## When you need `QPainter`

Every widget from Days 1-9 was something Qt already drew for you — a button, a label, a list. Sometimes
you need something no stock widget provides: a custom chart, a colored status indicator, a drawing
canvas, a game board. `QPainter` is Qt's general-purpose 2D drawing API — the same underlying tool Qt uses
internally to draw every one of those stock widgets, now available directly to you.

## Painting onto a `QPixmap`

A `QPixmap` is an off-screen image you can draw onto directly — the simplest way to learn `QPainter`'s
API, and, conveniently, fully testable without any real window (you can inspect the exact color of any
pixel afterward):

```python
from PySide6.QtGui import QPixmap, QPainter, QColor, QPen

pixmap = QPixmap(100, 100)
pixmap.fill(QColor("white"))          # start with a blank white canvas

painter = QPainter(pixmap)
painter.setBrush(QColor("red"))        # fill color for shapes
painter.setPen(QColor("red"))            # outline color
painter.drawRect(10, 10, 30, 30)           # x, y, width, height
painter.setBrush(QColor("blue"))
painter.drawEllipse(50, 50, 40, 40)          # a circle, since width == height
painter.end()                                  # ALWAYS call .end() when done painting

image = pixmap.toImage()
print(image.pixelColor(20, 20).name())     # "#ff0000" -- inside the red rectangle
print(image.pixelColor(70, 70).name())     # "#0000ff" -- inside the blue circle
```
A few things worth internalizing:
- **`setBrush`** controls how shapes are *filled*; **`setPen`** controls *outlines* and lines. Set
  `painter.setPen(Qt.NoPen)` if you want a shape with no visible border at all.
- **You must call `.end()`** when you're done drawing on a given device — forgetting it is a common source
  of confusing warnings/errors.
- **Coordinates start at `(0, 0)` in the top-left corner**, x increasing right, y increasing *down* — the
  same coordinate system as HTML/CSS positioning, not traditional math-class coordinates.
- **Named colors aren't always what you'd guess:** `QColor("green")` is `#008000` (a darker, muted green),
  *not* pure `#00ff00` — Qt follows the SVG/X11 color-naming standard, the same one many CSS named colors
  come from. If you want an exact color, pass hex directly: `QColor("#00ff00")`.

## Drawing text

```python
painter = QPainter(pixmap)
painter.drawText(10, 50, "Hello!")            # x, y is the BASELINE of the text, not the top-left
painter.end()
```

## Making a real custom widget: overriding `paintEvent`

To make an actual reusable widget that draws itself (rather than a one-off pixmap), subclass `QWidget` and
override `paintEvent` — Qt calls this method automatically, every time the widget needs to redraw (when
first shown, when resized, when something changes) — you never call it yourself:

```python
from PySide6.QtWidgets import QWidget
from PySide6.QtGui import QPainter, QColor

class ColorSwatch(QWidget):
    def __init__(self, color):
        super().__init__()
        self.color = QColor(color)

    def paintEvent(self, event):
        painter = QPainter(self)          # paint directly onto THIS widget, not a pixmap
        painter.fillRect(self.rect(), self.color)
        painter.end()

    def set_color(self, color):
        self.color = QColor(color)
        self.update()          # schedules a repaint -- Qt calls paintEvent again soon after
```
`self.update()` is the method you call whenever your widget's data changes and it needs to look different
— it does NOT call `paintEvent` immediately; it schedules a repaint for the next time Qt processes events,
which is the correct, efficient way to do it (calling `paintEvent` directly yourself is almost never
right).

## Exercises

Open `exercises.py` — every check draws onto a `QPixmap` and inspects specific pixel colors afterward, the
same fully-offline-testable pattern from the lesson above.
