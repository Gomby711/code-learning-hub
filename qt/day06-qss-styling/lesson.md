# Day 6 — Styling with Qt Style Sheets (QSS)

## Objectives
- Understand QSS — Qt's CSS-inspired styling language for widgets
- Apply styles to a single widget, and app-wide from the `QApplication`
- Target widgets by type, by object name (like an HTML `id`), and by state (like CSS `:hover`)

## QSS is deliberately CSS-shaped

If you've done the HTML/CSS track, QSS will feel immediately familiar on purpose — Qt's authors modeled
it directly on CSS: selectors, declaration blocks, property-value pairs separated by semicolons.

```python
from PySide6.QtWidgets import QPushButton

btn = QPushButton("Save")
btn.setStyleSheet("background-color: #3ee08c; color: black; padding: 8px; border-radius: 6px;")
print(btn.styleSheet())
```
The big-picture differences from real web CSS: QSS only covers a subset of properties (no flexbox/grid —
Qt widgets are already positioned by their layout, from Days 1 and 3), property names sometimes differ
slightly (`background-color` still works, but so does Qt-specific `background`), and selectors target
Qt's widget class hierarchy instead of HTML tags.

## Selecting by widget type

```python
app.setStyleSheet("""
QPushButton {
    background-color: #2b3564;
    color: white;
    padding: 6px 14px;
    border-radius: 6px;
    border: none;
}
QLabel {
    font-size: 14px;
    color: #333;
}
""")
```
Setting a style sheet on the `QApplication` itself (rather than on one widget) applies it **globally** —
every `QPushButton` in the whole app picks up that style, exactly like a CSS rule targeting a tag name
applies to every matching element on a page. This is almost always how real apps handle styling: one
consistent, app-wide style sheet, set once at startup, rather than styling every widget individually.

## Targeting one specific widget with `objectName`

Sometimes you need to style ONE particular button differently from every other button — CSS solves this
with `id`, and QSS solves it the exact same way, via a widget's `objectName`:

```python
danger_button = QPushButton("Delete")
danger_button.setObjectName("dangerButton")     # like HTML's id="dangerButton"

app.setStyleSheet("""
QPushButton { background-color: #2b3564; color: white; }
QPushButton#dangerButton { background-color: #ff7a7a; }
""")
```
`QPushButton#dangerButton` — a `#` after the type selector, exactly like CSS's `tag#id` — matches only the
one widget with that exact `objectName`, while every other `QPushButton` still gets the general rule.

## State-based styling: `:hover`, `:pressed`, `:disabled`

```python
app.setStyleSheet("""
QPushButton {
    background-color: #38bdf8;
}
QPushButton:hover {
    background-color: #6dc5ff;
}
QPushButton:pressed {
    background-color: #1a8fd1;
}
QPushButton:disabled {
    background-color: #555;
    color: #999;
}
""")
```
These pseudo-states work exactly like CSS's `:hover`/`:active`/`:disabled` — Qt is a native desktop
toolkit, not a browser, but it tracks the same real states (is the mouse over this widget right now, is
it currently pressed, is it disabled) and lets QSS react to them the same way.

## Checking styling in code (since you can't literally "see hover" without a real window)

You can't verify visual hover behavior without an actual screen — but you CAN verify the style sheet
string itself was set correctly, which is what today's exercises check:

```python
btn = QPushButton("Save")
btn.setStyleSheet("background-color: red;")
print("background-color" in btn.styleSheet())     # True
```

## Exercises

Open `exercises.py`. To actually SEE styled widgets, `styled_demo.py` in this folder is a complete,
runnable file — open it, read it, then run it in your own terminal per Day 0.
