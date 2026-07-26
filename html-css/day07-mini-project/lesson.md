# Day 7 — Mini Project: Personal Portfolio/Landing Page (Week 1 Review)

## Objectives
Combine everything from Days 1-6 into one real, complete page:
- Document structure and semantic HTML5 elements (Days 1-2)
- Forms (Day 2)
- Selectors, the cascade, specificity, the box model (Day 3)
- Display, position, margin (Day 4)
- Flexbox (Day 5)
- Grid (Day 6)

This is intentionally less hand-held than the previous days — the point of a review project is to make the design decisions yourself, using what you've learned, and get stuck in the productive way.

## The brief

Build a single-page personal portfolio/landing page, `index.html` plus `styles.css`, for a fictional (or real, if you like) person. It should include:

1. A **header** with a name/logo and a navigation bar (Flexbox: logo left, links right)
2. A **hero section** — a large introductory area with a heading, a short tagline, and maybe a call-to-action button, vertically and horizontally centered (Flexbox)
3. A **projects/work section** — at least 3 "cards" (each with a title and a short description) arranged in a responsive grid (CSS Grid, using `repeat()` and `fr`)
4. An **about section** — a paragraph or two about the person, using proper semantic elements
5. A **contact section** — a real form (name, email, message, submit button), with every input properly connected to a `<label>`
6. A **footer** with a copyright line

### Suggested (not mandatory) structure

```
day07-mini-project/
├── index.html
├── styles.css
```
One HTML file, one CSS file, linked together — you don't need multiple pages yet (that comes with the Day 14 capstone).

### Things to deliberately think about, not just copy from earlier days

- Where does `box-sizing: border-box` go, and why should it be one of the very first rules in your stylesheet? (Day 3)
- Which sections should be Flexbox, and which should be Grid? Reason through it using Day 6's "when to use which" guidance, rather than defaulting to whichever you remember better.
- Are you using semantically correct elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) instead of an unbroken wall of generic `<div>`s? (Days 1-2)
- Is every form input properly connected to a `<label>` via matching `for`/`id`? (Day 2)
- Does your CSS have any selector conflicts you didn't intend? Use DevTools to check which rule is actually winning on any element that doesn't look right (Day 3's specificity).

## How to approach this (process, not just code)

1. Write the full HTML structure FIRST, with no CSS linked at all, and confirm it makes sense and reads correctly even totally unstyled (this is exactly the "semantic HTML describes what things ARE" principle from Day 1-2 — a good structure should be sensible even before any visual design is applied).
2. Link an empty `styles.css` and add `box-sizing: border-box` as your very first rule.
3. Style one section at a time, top to bottom, checking in the browser after each one rather than writing all your CSS blind and debugging everything at once at the end.
4. Once every section looks right individually, check the whole page together, and adjust spacing (margin/padding/gap) so it reads as one coherent page, not several disconnected sections.

## What's provided

- `starter.html` and `starter-styles.css` — a minimal, empty scaffold (just the file structure, no actual content or styling) to get you started, optional to use.
- `solution/` — a full reference implementation. **Build your own first.** This project has many equally valid designs; comparing your approach to this one afterward is valuable, but only after you've made your own decisions and hit your own bugs.

## Checklist

See `CHECKLIST.md` in this folder for the full manual verification list once you're done.
