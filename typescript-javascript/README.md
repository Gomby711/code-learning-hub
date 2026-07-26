# Learn JavaScript & TypeScript — 14 Day / 28 Hour Job-Ready Track

**Goal:** go from "knows some syntax" to "can pick up a JavaScript/TypeScript codebase at a job and contribute." ~2 hours/day for 14 days.

**New to coding entirely?** Start with `day00-primer/lesson.md` before Day 1 — it covers the absolute basics (what JavaScript is, how it actually runs, using Node.js and the browser console, reading an error message) that every later lesson assumes you already know. If you've already done the Python track in `../python/`, several ideas (variables, functions, loops) will feel familiar — the lessons still explain everything from scratch for THIS language, since the details differ in important ways.

## How this folder works

Each `dayNN-topic/` folder has:

- `lesson.md` — the reading + explanation for that day, in detail. Read this first.
- `lesson.pdf` — the exact same lesson, as a PDF, if you'd rather read it away from a screen full of code or print it out.
- `exercises.js` (or `.ts` from Day 11 onward) — runnable starter code with `// TODO` blanks. You write the code, then run it with `node exercises.js`.
- `solutions.js`/`.ts` — a reference solution. **Don't open it until you've genuinely tried.** Struggling productively for 10-15 minutes on a problem before peeking is where the learning happens.

- `lesson.pdf` — the exact same lesson, as a PDF, if you'd rather read it away from a screen full of code or print it out.

There's also:
- `syllabus.pdf` — a short, one-glance overview of the whole 2-week plan.
- `full-course.pdf` — every single day's full lesson, in order, combined into one document.
- A shared `package.json`, `node_modules/`, and `tsconfig.json` at this folder's root — installed once (TypeScript + Jest) so Day 11 onward can compile/test without per-day setup.

## Daily rhythm (suggested, ~2 hrs)

1. Read `lesson.md`, running every example yourself in the Node.js REPL or console as you read (35 min)
2. Do the exercises in `exercises.js`/`.ts` (70 min)
3. Check against the solution file, and for anything you got wrong, write one sentence in your own words about *why* your version didn't work (15 min)

## Setup (do this once, before Day 1)

You need [Node.js](https://nodejs.org) installed (this environment has v24, which is fine). Check it works:
```
node --version
npm --version
```
`node` runs JavaScript files directly from your terminal, outside a browser — you'll use it constantly this week. `npm` ("Node Package Manager") is how you install extra packages other people have published — you won't need it until Day 6.

No extra packages needed until Day 6 (modules/npm basics), Day 11 (TypeScript compiler), and Day 12 (a test runner) — each lesson tells you exactly what to install when you get there.

## The arc

**Week 1 — JavaScript Foundations.** Core language: variables/types, control flow, data structures (arrays/objects), functions, strings, errors/modules. Ends with a mini Node.js CLI project tying it together.

**Week 2 — Job-Ready JavaScript & TypeScript.** OOP (classes, how JS's prototype system actually works), asynchronous JavaScript (promises/async-await — arguably THE defining feature of professional JS work), then TypeScript itself (why static types on top of JS, interfaces, generics), testing, and project structure/tooling. Ends with a capstone project written in TypeScript, built mostly unassisted.

## Day index

| Day | Topic |
|---|---|
| 0 | Primer: what JS is, running it (Node/browser console), reading errors |
| 1 | Variables, types, and equality (`==` vs `===`) |
| 2 | Control flow: conditionals, loops, truthy/falsy |
| 3 | Data structures: arrays and objects, destructuring, spread/rest |
| 4 | Functions: declarations, arrow functions, scope, closures, `this` |
| 5 | Strings, template literals, JSON, dates |
| 6 | Errors, modules (import/export), npm and packages |
| 7 | Mini project: Node.js CLI task tracker (Week 1 review) |
| 8 | OOP fundamentals: classes, constructors, encapsulation |
| 9 | OOP advanced: inheritance, prototypes, getters/setters, static members |
| 10 | Asynchronous JavaScript: callbacks, the event loop, promises, async/await |
| 11 | Real data + intro to TypeScript: fetch/JSON, npm packages, why static types |
| 12 | TypeScript deep dive + testing: interfaces, generics, Jest/Vitest |
| 13 | Practical: project structure, package.json/tsconfig, ESLint/Prettier, git |
| 14 | Capstone project (in TypeScript) |
