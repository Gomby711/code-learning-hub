# Day 13 — Mini Project 2: A CSV Viewer (Threading + Files + Custom Models)

## Objectives
- Build a real, larger desktop app that genuinely integrates Days 5, 7, 9, and 12 — not a toy exercise
  for any one of them in isolation
- Practice the real shape of a non-trivial Qt app: a menu action opens a file, a background thread loads
  it without freezing the window, a custom model displays it, and a search box filters it live

## The project

A CSV viewer:
- **File > Open CSV...** opens a real file picker (Day 5), remembers the last folder used via `QSettings`
  (Day 5) so the next open starts in the same place
- Loading happens on a background thread (Day 9) — the window stays responsive even on a large file,
  and the status bar shows "Loading..." while it happens
- Loaded rows are displayed through a custom `QAbstractTableModel` (Day 12) in a `QTableView` — not a
  `QTableWidget`, deliberately, since this is exactly the "data from somewhere else, possibly large"
  situation Day 12 said a custom model is for
- A search box live-filters the visible rows via `QSortFilterProxyModel` (Day 12), searching across the
  first column

This is a genuinely realistic shape for a small, real utility app — "open a file, load it in the
background, show it, let the user search it" describes an enormous fraction of real desktop tools.

## Run it for real

Same as Day 8: this project needs a real window and a real file picker to be worth building. Run it in
your own terminal, not through this app's ▶ Run button:
```
python starter.py
```
`sample_people.csv` in this folder is a small, ready-made file to test with immediately.

## `starter.py` — your scaffold

The window, menu, table view, and search box are already built. Four pieces of behavior are left as
`# TODO`s:
1. **`CsvLoadWorker`** — a `QObject` (Day 9's worker pattern) whose `load(path)` method reads the CSV file
   at `path` using Python's built-in `csv` module, and emits a `loaded` signal carrying `(headers, rows)`
   — `headers` is the first row, `rows` is every row after it.
2. **`CsvTableModel`** — the `QAbstractTableModel` (Day 12) that displays whatever `(headers, rows)` the
   worker loaded.
3. **`on_open_clicked`** — show a `QFileDialog.getOpenFileName(...)` filtered to `*.csv`, remembering and
   updating the last-used folder via `QSettings` (Day 5), and if a file was picked, kick off a
   `CsvLoadWorker` on a background `QThread` (Day 9's exact wiring pattern) instead of loading it directly.
4. **`on_search_text_changed`** — set the proxy model's filter string as the user types in the search box.

Every piece was covered in an earlier day; the actual new skill today is **wiring several pieces together
into one coherent app**, which is genuinely a different (and very real) skill from implementing any one
piece in isolation.

## Exercises

No `exercises.py` today, same as Day 8 — build the project, run it for real, open `sample_people.csv`,
confirm the table populates, and confirm typing in the search box actually filters the rows live.
