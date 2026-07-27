# Code Learning Hub

A desktop app for the five courses in this repo (Python, JavaScript/TypeScript, HTML/CSS,
Qt/PySide6, and Career & Beyond). Lessons render on the left; a Codecademy-style editor on the
right runs your code for real and grades your exercise answers with plain-English feedback.

## Easiest way to get it (no coding experience needed)

Download **`CodeLearningHub.exe`** from the
[latest release](https://github.com/Gomby711/code-learning-hub/releases/latest) and double-click
it. That's it — everything (all five courses, the app itself) is bundled inside that one file.
No Python install, no zip file, nothing to configure.

The first time it runs, it unpacks a real **`CodeLearningHub`** folder (all five course folders,
plus the app itself) into `%LOCALAPPDATA%\CodeLearningHub` — same as a real install, not just a
window that vanishes when you close it. You can open, edit, and browse those files directly in
File Explorer or any editor, exactly like the git checkout contributors use.

The only thing not bundled is the ability to actually *run/check* Python and JavaScript/TypeScript
exercises — that needs a real Python (and, for the JS/TS track, Node.js) installed on your
machine, since the app runs your code for real rather than faking it. Reading lessons, browsing
courses, flashcards, and quizzes all work with zero extra installs.

### "Windows protected your PC" / antivirus warnings

`CodeLearningHub.exe` isn't code-signed (that requires a paid certificate), so Windows
SmartScreen and some antivirus engines may flag a fresh download as unrecognized or even as a
false-positive threat — this is common for small, unsigned PyInstaller apps and not unique to
this one. If SmartScreen blocks it: click **More info** → **Run anyway**. If your antivirus
quarantines it outright, you can verify it's the real, unmodified build by comparing its SHA256
hash against the one printed in that release's notes (`Get-FileHash CodeLearningHub.exe` in
PowerShell), then restore it from quarantine / add an exclusion.

## Running from source instead (for contributors)

1. Install the one dependency window mode needs: `pip install -r app/requirements.txt`
   (just [pywebview](https://pywebview.flowrl.com/) — rendering itself uses Windows' built-in
   WebView2 runtime, which ships with Windows 10/11 and current Edge installs by default).
2. Double-click `app/install_shortcut.vbs` once to create a **Code Learning Hub** shortcut on
   your Desktop.

Double-click that shortcut to start it, or run it manually:

```
python app/server.py --window   # opens as a native app window
python app/server.py            # or: runs as a plain local server, open http://127.0.0.1:8899 yourself
```

## Pin it to the taskbar

Either of these works:

- **Pin the shortcut:** right-click the Desktop **Code Learning Hub** shortcut →
  *Show more options* → **Pin to taskbar**. The pinned button uses the `</>` icon.
- **Pin the running window:** launch the app, then right-click its taskbar button →
  **Pin to taskbar**. The window's icon comes from the app itself (`static/icon.png`).

## What's what

| File | Purpose |
|---|---|
| `server.py` | Local server: serves the UI, reads lesson folders live, runs code (Python via `python`, JS via `node`, TS via the course's own TypeScript compiler) |
| `run_ts.js` | Transpiles + runs TypeScript snippets |
| `static/` | Frontend (fully offline — no CDNs, no internet needed) |
| `launch.vbs` | Launcher used by the shortcuts: runs `server.py --window`, which opens a native app window directly (no separate browser process) |
| `icon.ico` / `icon.png` | The `</>` app icon |

## Features

- **Tabs** per language + a Home page with progress, hero terminal, and course cards
- **Sidebar** lists every day folder; titles come from each `lesson.md`
- **▶ Try it** on any lesson code example loads it into the editor; opening `exercises.*` auto-loads it
- **▶ Run** (Ctrl+Enter) executes Python / JS / TS and shows output; HTML/CSS shows a live preview
- **✓ Check answer** grades exercises using their built-in PASS/FAIL checks and explains *why*
  each failure failed: un-filled TODOs are called out, hints are pulled from the exercise's own
  docstrings, and runtime errors are translated into plain English with the offending line number.
  On HTML/CSS days it shows your page side-by-side with the goal (`solution.html`)
- **Syntax highlighting** + line numbers in the editor; **stdin box** for `input()` programs
- **Animated concept diagrams** embedded right in the hardest lessons (the mutable/reference
  object model, the call stack, the JS event loop, the CSS box model, flexbox/grid axes, the
  prototype chain, generators vs. lists, closures) — self-contained SVG/CSS, no external assets
- **🛠 Workshop tab** — a free-form, language-toggle scratchpad for your own projects, separate
  from the lesson exercises. **🔍 Review my code** runs it for real, explains any crash in plain
  English with the exact line, and (on a clean run) flags common per-language pitfalls — mutable
  default args, `==` vs `is`/`===`, `var` usage, loose equality, missing `alt`/`label`/`<title>`,
  possibly-unused imports/variables, overly long functions, deep nesting, leftover TODOs, and
  more. Includes a **📐 Box Model Inspector** (hover the HTML/CSS preview for live content/
  padding/border/margin sizes — also available on the HTML/CSS course tab), a **🧪 Regex Tester**,
  and a **⏱ Big-O Cheatsheet**. Everything here is free, instant, and fully offline — rule-based,
  not an LLM — by design (see `career/day00-roadmap-overview` for the honest tradeoffs)
- **🪟 Qt (PySide6) course** — 15 days building real, installable desktop apps in Python: widgets and
  layouts, signals/slots, forms, `QMainWindow`/menus/dialogs, files/settings, QSS styling, lists/tables,
  a to-do-app mini project, threading (`QThread`), custom painting (`QPainter`), the Qt Designer `.ui`
  workflow, custom data models (`QAbstractTableModel`/`QSortFilterProxyModel`), a second integrative
  CSV-viewer mini project, and testing + cross-platform packaging with PyInstaller. Graded
  exercises run headlessly (`QT_QPA_PLATFORM=offscreen`, set automatically by `server.py`) — the
  same technique real Qt projects use for automated testing, no visible window needed to grade
- **🚀 Career & Beyond course** — Git/GitHub workflow, algorithmic interview prep (arrays/hashing,
  recursion/trees/graphs), scoping and building a real portfolio project, the modern frontend
  stack (React/Tailwind), backend/APIs/databases, deployment (Vercel/Railway/Electron), and
  interview + job-search prep
- **🏗 Project Workspace tab** — real multi-file frontend work: a linked `index.html` / `style.css`
  / `script.js` combined live into one real page with a real DOM (unlike the JS track's Node-only
  execution) — click handlers, DOM updates, forms, the works. Includes a responsive width toggle
  (mobile/tablet/desktop) and the Box Model Inspector. Also available on the HTML/CSS course tab
- **Real WCAG contrast checking** — the Workshop's code review parses hex/rgb color+background
  pairs and computes actual contrast ratios against the WCAG AA 4.5:1 threshold, not just
  alt-text presence
- **🧠 Interview Flashcards tab** — a self-graded, lightly spaced-repetition deck covering JS
  gotchas, CSS trivia, Python trivia, and DSA pattern recognition
- **⚡ XP and 🔥 streaks** — 25 XP for a first all-green check per day, 50 XP for completing a day,
  confetti included. Solutions files nudge you to try for 10–15 minutes before peeking
- Progress, XP, streaks, and any saved Workshop/Project files live entirely in your own
  Windows account's local browser storage — every fresh install starts empty, and no one
  else who runs this app (including other machines) ever sees your data or you theirs.
  Lessons are read from disk on every load, so edits to the course folders show up immediately
- **🔄 In-app live updates** — a green "Update available" button appears in the top bar whenever
  a newer version is published; one click updates and restarts the app automatically (this
  requires the install to be a git checkout; the standalone .exe download will show a message
  to grab the new version manually until a future release adds a self-updating installer)

## Releasing a new version

1. Bump `VERSION` in `app/server.py`, commit, and push to `main`.
2. `gh release create vX.Y.Z --title "vX.Y.Z" --notes "..."`
3. `./build_release.ps1 -Tag vX.Y.Z` — builds the fully standalone exe (all course content +
   static assets embedded, zero sibling files needed) and uploads it straight to that release.

Anyone downloading `CodeLearningHub.exe` from the Releases page always gets this one-click,
no-zip experience — the build script is the single source of truth for how it's produced, so
every future release follows the same process automatically.
