# Learn HTML & CSS — 14 Day / 28 Hour Job-Ready Track

**Goal:** go from "never built a web page" to "can build and style a real, responsive, multi-page website, and read/modify an existing site's HTML/CSS at a job." ~2 hours/day for 14 days.

**New to coding entirely?** Start with `day00-primer/lesson.md` before Day 1 — it covers the absolute basics (what HTML and CSS actually are, how a browser turns them into a page on screen, how to open a page and inspect it with DevTools) that every later lesson assumes you already know. Every lesson from Day 1 onward is written for a true beginner: every term is defined in plain English the first time it's used, with analogies and step-by-step reasoning, not just syntax.

## How this folder works

Each `dayNN-topic/` folder has:

- `lesson.md` — the reading + explanation for that day, in detail (~30-45 min for early days, more for later ones — take the time it takes).
- `lesson.pdf` — the exact same lesson, as a PDF, if you'd rather read it away from a screen full of code, or print it out.
- `starter.html` (and `starter.css` on CSS-focused days) — a file with `<!-- TODO: ... -->` / `/* TODO: ... */` markers describing what to build. Open it directly in your browser (double-click the file, or right-click → Open With → your browser) to see your progress as you go.
- `solution.html` / `solution.css` — a reference implementation. **Don't open it until you've genuinely tried.** Struggling productively for 10-15 minutes before peeking is where the learning happens.
- `CHECKLIST.md` (most days) — a manual, visual verification checklist. **HTML/CSS work can't be auto-graded with a PASS/FAIL script the way Python code can** — the "test" for a web page is "does it look and behave the way it's supposed to," which you check by opening it in a browser and comparing against this checklist (and against `solution.html` if you want a side-by-side reference).

There's also:
- `syllabus.pdf` — a short, one-glance overview of the whole 2-week plan and what each day covers, good for tracking progress.
- `full-course.pdf` — every single day's full lesson, in order, combined into one document, in case you prefer reading the entire course in writing (e.g. on a tablet, printed, or offline).

## Daily rhythm (suggested, ~2 hrs)

1. Read `lesson.md`, and as you read, actually open your browser's DevTools (see Day 0) and try each example for yourself — don't just read markup, render it (35 min)
2. Build the day's exercise in `starter.html`/`starter.css`, checking your progress by reloading it in the browser as you go (70 min)
3. Compare against `CHECKLIST.md` and `solution.html`/`solution.css`; for anything that doesn't match, write one sentence in your own words about *why* your version didn't work (15 min)

## Setup (do this once, before Day 1)

You need:
- A code editor (VS Code is the standard free choice — install it if you don't already have one).
- A modern web browser (Chrome, Firefox, or Edge all work well — this course uses Chrome/Edge-style DevTools terminology, but the concepts and shortcuts are nearly identical everywhere).

That's it — unlike a programming language, HTML and CSS need no separate installation, compiler, or interpreter. Your browser already understands them.

## The arc

**Week 1 — Foundations.** How HTML documents are structured, semantic elements, forms and tables, how CSS selects and styles elements, the box model, and the two layout systems (Flexbox and Grid) that power essentially all modern web layout. Ends with a portfolio/landing page project tying it together.

**Week 2 — Job-ready.** Responsive design (the same page working on a phone and a desktop), the CSS features that make interfaces feel polished (transitions, pseudo-classes, custom properties), typography/color/accessibility, how to organize CSS as a project grows, forms and debugging with DevTools, and real project structure/deployment. Ends with a multi-page responsive website capstone you build mostly unassisted.

## Day index

| Day | Topic |
|---|---|
| 0 | Primer: what HTML/CSS are, how browsers render them, DevTools basics |
| 1 | HTML basics: document structure, common elements, attributes |
| 2 | HTML forms, tables, and semantic HTML5 |
| 3 | CSS basics: selectors, the cascade, specificity, the box model |
| 4 | CSS layout fundamentals: display, position, box-sizing, margin collapsing |
| 5 | Flexbox |
| 6 | CSS Grid |
| 7 | Mini project: portfolio/landing page (Week 1 review) |
| 8 | Responsive design: media queries, units, mobile-first |
| 9 | CSS advanced: pseudo-classes/elements, transitions, animations, custom properties |
| 10 | Typography, color, and accessibility |
| 11 | CSS architecture: BEM, organizing stylesheets, resets |
| 12 | Forms in depth and debugging with DevTools |
| 13 | Practical: project structure, git workflow, deploying a static site |
| 14 | Capstone: multi-page responsive website |
