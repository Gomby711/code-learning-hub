# Day 4 — Building a Real Portfolio Project (Without Disappearing Down a Rabbit Hole)

## Objectives
- Understand why "a project I built alone, that actually works, that a stranger can try" is the single strongest
  signal in a junior/early-career portfolio — stronger than a certificate, a GPA, or a list of finished tutorials
- Learn a scoping process that keeps a first solo project small enough to actually finish
- Know what makes a project *read as real* to whoever's evaluating it (a hiring manager, a recruiter, a
  potential collaborator), beyond just "the code runs"

## Why a portfolio project matters more than finishing more lessons

Every lesson exercise in this repo, no matter how well-designed, has one thing a real project doesn't: someone
already decided exactly what to build, and broke it into small, correctly-ordered steps for you. That's the
right way to *learn* a language — but it means finishing lessons demonstrates you can follow instructions and
implement a well-specified function. It does not yet demonstrate the separate skill of taking a vague idea
("I want an app that tracks my workouts") and turning it into a working thing through your own decisions:
what to build first, what to skip, how to structure files, what happens when your first approach doesn't work.
That second skill is exactly what a job is going to ask of you starting week one, and a portfolio project is the
only thing on a resume that actually proves you have it.

## The scoping trap, and how to avoid it

The single most common way a first solo project fails isn't "the code was bad" — it's **it never got finished**,
because the scope kept growing ("it should also have user accounts... and dark mode... and email notifications
...") until it became too big to finish in the time available, and got abandoned. The fix is a deliberate,
slightly uncomfortable discipline:

1. **Write one sentence describing the finished thing**, before writing any code: "A command-line tool that
   tracks daily habits and shows a streak count." Not five sentences. One.
2. **List every feature you can imagine for it** — dump everything, no filtering yet.
3. **Circle only the 3-5 features without which the one-sentence description would be a lie.** Everything else
   goes on a separate "v2 ideas" list — not deleted, just deliberately deferred.
4. **Build only the circled list first**, completely, before touching anything from the v2 list. A small,
   finished, working thing beats a large, half-finished, impressive-sounding thing every single time — a
   finished project is a portfolio piece; an unfinished one is a private embarrassment nobody will ever see.

## What actually makes a project read as "real" to someone evaluating it

- **It's deployed somewhere a stranger can open it themselves**, not just described in a README (covered
  concretely on Day 7 of this track) — "here's a live link" is dramatically more convincing than "here's a
  screenshot" or "trust me, it works on my machine."
- **The README explains what it is, why you built it, and how to run it**, in that order, in the first 30
  seconds of reading — not a wall of setup instructions before any context about what you're even looking at.
- **It has a couple of real commits with meaningful messages** (this is exactly why Day 1, Git, isn't optional)
  — a single "final version" commit with no history reads as either copied or rushed.
- **It handles at least one edge case visibly** — what happens with empty input, a network failure, an invalid
  form field? Code that only works on the happy path is the fastest tell that something was rushed.
- **It's yours** — not a copy of a tutorial project with the color scheme changed. Evaluators have seen the same
  handful of tutorial-clone projects (the same to-do app, the same weather app, the same clone of a famous site)
  hundreds of times; a project built around something you actually care about, even a small one, stands out
  immediately by comparison, and you'll have far more to say about it in an interview because you made the real
  decisions yourself.

## Good first-project shapes, by course

Pick something that genuinely interests you over anything on this list — but if you want a proven, right-sized
starting shape:
- **Python:** a CLI tool that solves an actual small annoyance in your own life (renames a folder of files by a
  pattern, tracks an expense log from a CSV, pulls today's weather via a free API and prints a one-line summary).
- **JavaScript/TypeScript + HTML/CSS:** a small single-page app with real interactivity and saved state (a
  focused to-do list with categories and localStorage persistence, a recipe box you can search and filter, a
  simple budget tracker) — this is also the natural project to extend once you've done Day 5 (React) here.
- **Full-stack (after Day 6 of this track):** the same kind of app, but with a real backend and database instead
  of `localStorage`, so data survives across devices — this is the project that most convincingly demonstrates
  "I understand the whole stack," and the one most worth deploying live for Day 7.

## Exercises

Open `exercises.py`. Today's single exercise: fill in a project-plan dictionary describing YOUR actual first
portfolio project idea (not a placeholder) — one sentence description, the circled must-have feature list (3-5
items), and the deferred "v2" list. The check just verifies you filled in something real and reasonably scoped
(not empty, not 15 "must-have" features) — the real test is whether you go build it afterward.
