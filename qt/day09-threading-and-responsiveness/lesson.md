# Day 9 — Threading: Keeping the UI Responsive

## Objectives
- Understand *why* a slow operation freezes an entire Qt app if you're not careful, tying directly back
  to the event loop from Day 0
- Use the worker-object + `QThread` pattern to run slow work in the background without freezing the UI
- Understand why you can't safely touch widgets directly from a background thread, and the signal-based
  pattern that solves it

## Why a slow function freezes the whole window

Recall Day 0: `app.exec()` runs an event loop that processes one thing at a time — draw the window, handle
a click, run your slot function, repeat. **Your slot functions run ON that same single thread.** If a
button's click handler does something slow (reads a huge file, calls a slow network API, crunches numbers
for five seconds), the event loop cannot do *anything else* until that slot function returns — no
redrawing, no responding to other clicks, no moving the window. This is what "an app has frozen / stopped
responding" almost always actually means under the hood.

```python
import time
from PySide6.QtWidgets import QPushButton

def slow_click_handler():
    time.sleep(5)          # freezes the ENTIRE app for 5 full seconds -- don't do this
    print("done")

btn = QPushButton("Go")
btn.clicked.connect(slow_click_handler)
```
The fix is never "make the slow thing faster" (sometimes you genuinely can't) — it's **run the slow work
on a separate thread**, so the main thread stays free to keep the event loop running while it happens.

## The worker-object pattern

The idiomatic Qt way to do this: put your slow work in a plain `QObject` (a **worker**), move that worker
onto a `QThread`, and communicate results back via signals (Day 2) — never by directly returning a value,
since the two threads are running independently.

```python
from PySide6.QtCore import QObject, QThread, Signal

class Worker(QObject):
    finished = Signal(str)      # announces "the slow work is done, here's the result"

    def do_slow_thing(self):
        import time
        time.sleep(3)               # imagine this is a slow file/network operation
        self.finished.emit("result data")

# --- wiring it up from your main window ---
self.thread = QThread()
self.worker = Worker()
self.worker.moveToThread(self.thread)              # the worker now RUNS on the new thread

self.thread.started.connect(self.worker.do_slow_thing)   # start the work once the thread starts
self.worker.finished.connect(self.on_result)                # runs back on the MAIN thread automatically
self.worker.finished.connect(self.thread.quit)                # stop the thread once done

self.thread.start()          # returns immediately -- the UI stays responsive right now

def on_result(self, data):
    print("Got:", data)      # safe to update widgets here -- this runs on the main thread
```
The key guarantee that makes this safe: a signal connected across threads is automatically delivered back
onto the receiving object's own thread (your `on_result` slot lives on the main thread, so Qt makes sure
it's *called* on the main thread, even though `finished.emit(...)` was called from the worker thread) —
this is what makes it safe to touch widgets inside `on_result` but genuinely unsafe to touch them directly
inside `do_slow_thing`.

## The rule that matters most: never touch widgets from a background thread

```python
class Worker(QObject):
    finished = Signal()
    def do_slow_thing(self, label):
        import time
        time.sleep(2)
        label.setText("Done!")     # WRONG -- setText() called from a background thread
        self.finished.emit()
```
Qt widgets are only safe to read and modify from the main thread. Calling `label.setText(...)` directly
from inside worker code can appear to work sometimes and crash or corrupt the UI unpredictably other
times — exactly the kind of intermittent, hard-to-reproduce bug threading is infamous for. The fix is
always the same: the worker computes a *result* and emits it as a signal; only the main-thread slot that
receives that signal (like `on_result` above) is allowed to touch widgets.

## Testing worker logic without real threading

Real background timing is inherently non-deterministic — bad for fast, repeatable automated checks. So,
consistent with every other day: today's exercises test a `Worker`'s **logic** by calling its methods
directly and checking the signal it emits, synchronously, exactly like Day 2's custom-signal exercises —
never by actually starting a `QThread` and waiting for it. `slow_demo.py` in this folder is a complete,
real, actually-threaded example; run it yourself to see the UI stay responsive while "work" happens in the
background.

## Exercises

Open `exercises.py`.
