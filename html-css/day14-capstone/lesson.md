# Day 14 — Capstone: Multi-Page Responsive Website

## Objectives

Build a complete, small, multi-page website using nearly everything from the last 13 days, mostly unassisted:
- Semantic HTML structure and forms (Days 1-2)
- Selectors, the cascade, specificity, the box model (Day 3)
- Layout fundamentals: display, position (Day 4)
- Flexbox (Day 5) and Grid (Day 6)
- Responsive design: media queries, mobile-first (Day 8)
- Pseudo-classes, transitions, custom properties (Day 9)
- Typography, color, accessibility (Day 10)
- BEM naming and organized CSS (Day 11)
- Form validation styling (Day 12)
- Proper project structure and (if applicable) real deployment (Day 13)

This is intentionally the least hand-held day. You get a specification, not a scaffold. Expect to get stuck — that's the design, not a bug in the lesson.

## The brief

Build a small, real, multi-page website — a fictional (or real) small business, portfolio, or organization's site — with at least 3 pages, sharing one consistent design:

1. **A homepage** (`index.html`) with a hero section and a preview of your other pages/content (e.g., 3 featured items in a Grid layout).
2. **An "About" or "Services" page** with real semantic content structure.
3. **A "Contact" page** with a properly validated form (required fields, `type="email"`, styled `:valid`/`:invalid` states).
4. **A shared navigation bar and footer**, identical across all 3+ pages, correctly linking between them using relative paths.
5. **Fully responsive**, tested at both a phone width (around 375px) and a desktop width (1200px+), using at least one media query breakpoint that meaningfully changes the layout (not just font sizes).

### Required design elements (this is the point of the exercise — don't skip these to save time)

- One shared, external stylesheet (or an organized set of them, per Day 11) — no inline `style` attributes or `<style>` blocks scattered across pages.
- Class names following BEM (Day 11) for at least your major reusable components (navbar, cards, buttons).
- At least one use of Flexbox AND at least one use of Grid, each chosen deliberately for the layout it's actually suited to (Day 6's decision criteria) — not just because you remember one better.
- A mobile-first responsive layout (Day 8) — write your default CSS for a narrow screen, then use `min-width` media queries to enhance it for wider screens.
- At least one `:hover`/`:focus` transition (Day 9) somewhere that benefits from it (a button, a nav link).
- CSS custom properties (Day 9) for your primary color(s), defined once in `:root` and reused throughout.
- Meaningful `alt` text on every image, properly connected `<label>`s on every form input, and visible `:focus` styles never removed without a replacement (Day 10's accessibility checklist).
- `box-sizing: border-box` and a small reset, applied globally, as the very first rules in your stylesheet (Days 3, 11).

### Suggested (not mandatory) file layout

```
day14-capstone/
├── index.html
├── about.html
├── contact.html
├── css/
│   └── styles.css
├── images/
```

## How to approach 2+ hours of mostly-unassisted work without stalling out

1. **Plan your pages and shared layout first**, on paper or in comments, before writing any code — which sections repeat on every page (navbar, footer), and which are unique to one page?
2. **Build the shared navbar and footer once**, in plain HTML with no styling, and copy that exact same markup across all 3 pages before doing anything else — get the multi-page linking working and correct first.
3. **Style one page fully** (probably the homepage) before moving to the next, rather than half-styling all three simultaneously.
4. **Build mobile-first**: write your default (unwrapped) CSS assuming a narrow screen, test it at 375px in DevTools, THEN add `min-width` media queries to enhance the layout for wider screens — resist the temptation to design for desktop first and retrofit mobile after, even though that may feel more natural if you're mentally picturing your own laptop screen while working.
5. **Once the happy path works**, go back through Day 10's accessibility checklist and Day 12's validation styling, and deliberately verify each item rather than assuming you did it right the first time.

## Definition of done

- All 3+ pages exist, share an identical navbar/footer, and link to each other correctly.
- The site is genuinely responsive — tested by hand in DevTools at both a phone width and a desktop width, with at least one layout (not just font-size) change between them.
- The contact form validates properly and shows clear `:valid`/`:invalid` feedback.
- Every image has meaningful `alt` text; every form input has a properly connected `<label>`.
- Your class names follow BEM for at least the reusable components (navbar, cards, buttons).

## Reference solution

`solution/` has a complete working implementation. Give yourself a genuine attempt — ideally the full 2 hours — before opening it. The value of this whole two weeks culminates here: if you can build this mostly on your own, you're at the level this track promised.
