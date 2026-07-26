# Day 5 — Real Files and Persistent Settings

## Objectives
- Open and save real files through the OS's native file picker with `QFileDialog`
- Persist small pieces of app state — window size, last-used folder, user preferences — across runs with
  `QSettings`
- Understand why today's exercises test the *logic around* file dialogs rather than the dialogs
  themselves

## `QFileDialog` — the native "Open"/"Save" picker

Every desktop app you've ever used opens the same kind of native file picker window for "Open" and "Save
As" — Qt gives you that exact native dialog (not a custom-drawn imitation) through `QFileDialog`:

```python
from PySide6.QtWidgets import QFileDialog

path, _ = QFileDialog.getOpenFileName(
    parent_widget, "Open a file", "", "Text files (*.txt);;All files (*)"
)
if path:                    # empty string means the user hit Cancel
    print(f"You picked: {path}")
```
- `QFileDialog.getOpenFileName(...)` — pick one existing file to open. Returns a tuple: `(path, filter_used)`.
- `QFileDialog.getSaveFileName(...)` — pick a destination path to save to (lets the user type a new
  filename, unlike Open).
- `QFileDialog.getExistingDirectory(...)` — pick a folder instead of a file.
- The filter string (`"Text files (*.txt);;All files (*)"`) controls what shows up in the picker's
  file-type dropdown — `;;` separates multiple filter options.

**Why today's exercises never call these directly:** exactly like `app.exec()` (Day 0), these are
*blocking* calls that open a real native OS window and wait for a human to click something — there's no
human here to click it, so calling one headless would simply hang. The professional pattern (and the one
today's exercises practice) is to keep your file-handling **logic** in its own plain function that takes a
path as a parameter — genuinely testable — and call `QFileDialog` only in the thin layer of actual button-
click code that then hands the resulting path to that logic function. `browse_demo.py` in this folder is a
complete, real file showing the full pattern connected to a real button; run it yourself to see the actual
picker.

## `QSettings` — small persistent values, without managing a file yourself

Apps constantly need to remember things between runs: window size, the last folder you opened, a "remember
me" checkbox. `QSettings` gives you a simple key-value store that survives your app closing, without you
writing any file-handling code:

```python
from PySide6.QtCore import QSettings

settings = QSettings("MyCompany", "MyApp")     # organization name, app name
settings.setValue("last_folder", "/home/sam/projects")
settings.setValue("window_width", 800)

# ... later, even in a completely separate run of the program ...
settings = QSettings("MyCompany", "MyApp")
print(settings.value("last_folder"))              # "/home/sam/projects"
print(settings.value("window_width", 600))          # 800 -- or 600 if it was never set (the default)
```
By default, `QSettings("MyCompany", "MyApp")` stores its data in the OS's standard location for this kind
of thing (the Windows Registry, on Windows) — convenient for a real app, but not something you want
graded exercises touching automatically on every run. So today's exercises instead use the **explicit
file** form, which behaves identically but writes to a plain `.ini` file you control the path of —
exactly what you'd also reach for if you specifically wanted a portable, inspectable settings file instead
of the registry:

```python
from PySide6.QtCore import QSettings

settings = QSettings("/tmp/my_app_settings.ini", QSettings.IniFormat)
settings.setValue("theme", "dark")
settings.sync()          # force it to actually write to disk right now
```
`.sync()` isn't strictly required (Qt writes automatically at sensible points, like app shutdown), but
calling it explicitly — as today's exercises do — guarantees the value is on disk before the very next
line reads it back, which matters for fast, deterministic testing.

## Exercises

Open `exercises.py`. The settings exercises use a temporary `.ini` path (via Python's own `tempfile`
module) so nothing touches your real system settings. The file-handling exercises test a "given a path"
function directly — never a real `QFileDialog` call, per the explanation above.
