# Day 3 — More Widgets and Layouts: Building Real Forms

## Objectives
- Meet the rest of the standard input widgets: `QComboBox`, `QSpinBox`, `QRadioButton`, `QCheckBox`
- Use `QFormLayout` — the layout purpose-built for label/input pairs
- Nest layouts inside layouts to build genuinely real-looking UI, and group related options with
  `QGroupBox`

## The rest of the standard input widgets

| Widget | What it's for | Key method(s) |
|---|---|---|
| `QComboBox` | A dropdown of options, pick exactly one | `.addItems([...])`, `.currentText()` |
| `QSpinBox` | A number input with up/down arrows, within a range | `.setRange(min, max)`, `.value()` |
| `QRadioButton` | One choice among a group (only one can be selected per group) | `.isChecked()` |
| `QCheckBox` | An independent on/off toggle (any number can be checked) | `.isChecked()` |

```python
from PySide6.QtWidgets import QComboBox, QSpinBox

combo = QComboBox()
combo.addItems(["Small", "Medium", "Large"])
combo.setCurrentIndex(1)
print(combo.currentText())     # "Medium"

spin = QSpinBox()
spin.setRange(0, 10)
spin.setValue(15)              # out of range!
print(spin.value())             # 10 -- Qt automatically clamps to the range you set
```
That last line is worth sitting with: `QSpinBox` doesn't let you set an out-of-range value at all — it
silently clamps. This is a real, deliberate design choice (impossible states become unrepresentable,
rather than needing to be checked for after the fact) that shows up as a genuinely good practice in your
own code too, not just something Qt happens to do.

### Radio buttons need a group to be mutually exclusive

```python
from PySide6.QtWidgets import QRadioButton, QButtonGroup

small = QRadioButton("Small")
medium = QRadioButton("Medium")
large = QRadioButton("Large")

group = QButtonGroup()       # NOT a visible widget -- just enforces "only one checked at a time"
group.addButton(small)
group.addButton(medium)
group.addButton(large)

medium.setChecked(True)
print(small.isChecked(), medium.isChecked(), large.isChecked())    # False True False
large.setChecked(True)
print(small.isChecked(), medium.isChecked(), large.isChecked())    # False False True -- medium auto-unchecked
```
Without a shared `QButtonGroup`, radio buttons placed in the same layout happen to *look* grouped but
won't actually enforce "only one checked" — the group is what creates the real behavior.

## `QFormLayout` — built specifically for label/input pairs

You could build a form with `QVBoxLayout` and manually pair labels next to inputs using nested
`QHBoxLayout`s, but Qt provides a layout purpose-built for exactly this shape:

```python
from PySide6.QtWidgets import QWidget, QFormLayout, QLineEdit, QSpinBox

form = QFormLayout()
name_input = QLineEdit()
age_input = QSpinBox()
age_input.setRange(0, 120)

form.addRow("Name:", name_input)     # label text + widget, paired automatically
form.addRow("Age:", age_input)

widget = QWidget()
widget.setLayout(form)

print(form.rowCount())     # 2
```
`addRow(label_text, widget)` creates the label for you and aligns everything into a clean two-column
form — this is the standard, idiomatic way to build any settings/preferences/data-entry screen in Qt.

## `QGroupBox` — visually and logically grouping related controls

```python
from PySide6.QtWidgets import QGroupBox, QVBoxLayout, QRadioButton

box = QGroupBox("Size")           # draws a visible bordered box with a title
layout = QVBoxLayout()
layout.addWidget(QRadioButton("Small"))
layout.addWidget(QRadioButton("Medium"))
box.setLayout(layout)
```
A `QGroupBox` is both visual (a labeled border, telling the user these controls relate to each other) and
practical — a natural container to nest inside a bigger `QVBoxLayout`/`QFormLayout`, the same "layouts
made of smaller layouts, containers made of smaller containers" composition you practiced on Day 1.

## Exercises

Open `exercises.py`. As always, nothing here calls `.show()` or `app.exec()`.
