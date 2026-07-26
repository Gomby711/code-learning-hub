# Learn Python — 14 Day / 28 Hour Job-Ready Track

**Goal:** go from "knows some syntax" to "can pick up a Python codebase at a job and contribute." ~2 hours/day for 14 days.

**New to coding entirely?** Start with `day00-primer/lesson.md` before Day 1 — it covers the absolute basics (what a terminal is, what running a script means, how to read an error message, what indentation is) that every later lesson assumes you already know. Every lesson from Day 1 onward is written for a true beginner: every term is defined in plain English the first time it's used, with analogies and step-by-step reasoning, not just syntax.

## How this folder works

Each `dayNN-topic/` folder has:

- `lesson.md` — the reading + explanation for that day, in detail (~30-45 min for early days, more for later ones — take the time it takes).
- `lesson.pdf` — the exact same lesson, as a PDF, if you'd rather read it away from a screen full of code or print it out.
- `exercises.py` — runnable starter code with `# TODO` blanks. You write the code (~60-75 min). Run it with `python exercises.py`.
- `solutions.py` — a reference solution. **Don't open it until you've genuinely tried.** Struggling productively for 10-15 minutes on a problem before peeking is where the learning happens — if you check the answer the moment you're stuck, your brain never builds the retrieval pathway.

There's also:
- `syllabus.pdf` — a short, one-glance overview of the whole 2-week plan and what each day covers, good for tracking progress.
- `full-course.pdf` — every single day's full lesson, in order, combined into one document, in case you prefer reading the entire course in writing (e.g. on a tablet, printed, or offline).

## Daily rhythm (suggested, ~2 hrs)

1. Read `lesson.md`, run every example yourself in a REPL as you read — don't just read code, execute it (35 min)
2. Do the exercises in `exercises.py` (70 min)
3. Check against `solutions.py`, and for anything you got wrong, write one sentence in your own words about *why* your version didn't work (15 min)

## Setup (do this once, before Day 1)

You need Python 3.10+ (you have 3.14.5, which is fine — you'll even get to use some newer syntax like the `match` statement and improved error messages).

Check it works:
```
python --version
```

No extra packages needed until Day 11 (APIs) and Day 12 (testing), where the lesson tells you exactly what to `pip install`.

## The arc

**Week 1 — Foundations.** Core language: types, control flow, data structures, functions, strings/files, errors/modules. Ends with a mini CLI project tying it together.

**Week 2 — Job-ready.** OOP (how real codebases are structured), generators/decorators (idiomatic Python, shows up constantly in interviews and frameworks), working with real data (JSON/CSV/APIs), testing (non-negotiable at a job), and packaging/project structure. Ends with a capstone project you build mostly unassisted.

## Day index

| Day | Topic |
|---|---|
| 0 | Primer: absolute basics (terminal, running scripts, REPL, indentation, reading errors) |
| 1 | Variables, types, and the object model |
| 2 | Control flow: conditionals, loops, comprehensions |
| 3 | Data structures: lists, tuples, dicts, sets |
| 4 | Functions: args, scope, closures, first-class functions |
| 5 | Strings, formatting, files, and context managers |
| 6 | Errors, exceptions, modules, and packages |
| 7 | Mini project: CLI task tracker (Week 1 review) |
| 8 | OOP fundamentals: classes, `self`, instances |
| 9 | OOP advanced: inheritance, dunder methods, composition |
| 10 | Iterators, generators, and decorators |
| 11 | Working with real data: JSON, CSV, HTTP APIs, venvs |
| 12 | Testing and debugging with pytest, type hints |
| 13 | Practical Python: project structure, packaging, git workflow |
| 14 | Capstone project |
