# Day 5 — The Modern Frontend Stack: React and Tailwind

## Objectives
- Understand *why* React exists — what problem it solves that plain HTML/CSS/JS (the HTML/CSS track's approach)
  starts to struggle with as an app grows
- Understand React's core idea — components, props, and state — well enough to read real React code and know
  what it's doing, even before writing much of your own
- Understand what Tailwind CSS is, why so many teams use it, and how it relates to the CSS you already know
- Know exactly how to get a real React + Tailwind project running on your own machine today

## A crucial framing before anything else: this is a map, not a full course

Building genuine fluency in React takes real, focused practice — roughly the same order of effort as one of
this repo's 14-day language tracks, and it deserves that treatment rather than being compressed into one day.
**What today actually gives you: the mental model and vocabulary**, so that when you do sit down with React's
own docs or a dedicated course, nothing feels like it's coming out of nowhere — you'll already know what a
"component" is, why it needs "props" and "state," and where Tailwind fits, and you can spend your time on syntax
and practice instead of concepts.

## Why React exists: the problem with growing plain JavaScript apps

The HTML/CSS and JS/TS tracks teach you to build a page by directly writing HTML, then reaching into it with
JavaScript (`document.querySelector`, `.innerHTML`, `.appendChild`) to change things when something happens.
This works great for small pages. It starts to break down as an app grows, for a specific, recurring reason:
**keeping "what's currently true" (your data) in sync with "what's currently on screen" (the DOM) by hand gets
exponentially harder as more things can change it.** A todo list with 200 lines of manual DOM manipulation
scattered across click handlers becomes a real source of bugs — a checkbox toggle here forgets to update the
counter over there, a delete button removes the wrong list item because an event listener was attached to a
stale reference.

React's core idea: **you describe what the UI should look like FOR A GIVEN STATE, and React figures out how to
update the actual DOM to match, whenever that state changes** — you stop manually writing "when X happens, go
find this element and change it," and instead write "when the data is like THIS, the screen should look like
THIS," as a function of the data. This is a genuinely different way of thinking about UI, not just a different
syntax for the same thing.

## Components — the fundamental unit of a React app

A **component** is a JavaScript function that returns a description of some UI (using JSX, a syntax that looks
like HTML embedded directly in JavaScript) based on its inputs:

```jsx
function Greeting({ name }) {
    return <h1>Hello, {name}!</h1>;
}

// used like:  <Greeting name="Sam" />  -->  renders <h1>Hello, Sam!</h1>
```

- **Props** ("properties") are how data flows INTO a component from whoever's using it — exactly like function
  arguments, and in fact that's literally what they are (`{ name }` above is destructuring the props object).
  Props are read-only from the component's own perspective; a component never modifies its own props.
- **State** is data a component owns and can change over time, using React's `useState`:

```jsx
function Counter() {
    const [count, setCount] = useState(0);   // [currentValue, functionToUpdateIt], starts at 0
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
        </div>
    );
}
```
Calling `setCount(...)` doesn't just change a variable — it tells React "this component's state changed, please
re-run this function and update the screen to match the new result." You never manually touch the DOM; you
change the *data*, and describe the UI as a function of that data, and React handles making the screen match.
This is the entire mental shift, and once it clicks, most of the rest of React is filling in details around it.

## Composing components — building a real page out of small pieces

Real React apps are trees of small components nested inside each other, each responsible for one piece of the
UI — this maps directly onto the tree structure you just practiced on Day 3 of this same track:
```jsx
function App() {
    return (
        <div>
            <Header />
            <TodoList items={todos} />
            <Footer />
        </div>
    );
}
```
`TodoList` doesn't need to know where `todos` came from — it just receives it as a prop and renders it. This is
the same "single responsibility, clear inputs" thinking as writing small, focused functions in plain Python or
JavaScript — React doesn't invent a new discipline, it applies function-composition thinking to UI.

## Tailwind CSS — utility classes instead of hand-written stylesheets

You already know "real" CSS from the HTML/CSS track — writing your own class names and rules in a stylesheet.
**Tailwind CSS** takes a different approach: instead of writing custom CSS, you compose a look directly in your
HTML/JSX using small, single-purpose utility classes that Tailwind already defines:
```html
<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
    Click me
</button>
```
Each class does one specific thing (`bg-blue-500` = a specific background color, `py-2` = vertical padding,
`rounded` = rounded corners) — you build up a design by combining many small classes rather than writing a new
custom CSS rule for every element. The appeal, in practice: you never have to invent a class name or context-
switch to a separate CSS file for small styling changes, and a component's exact appearance is fully visible
right there in its markup instead of split across files. The tradeoff, honestly: your HTML gets visually busier
with class names, and it takes a little time to memorize Tailwind's naming conventions. Everything Tailwind's
utility classes do is still real CSS underneath — it does not replace what you learned, it's a different way of
authoring it, and understanding real CSS first (which you already do) makes Tailwind click faster, not slower.

## Getting a real React + Tailwind project running today

This repo's local server doesn't run a JS bundler, so you can't build actual React apps directly inside this
Workshop tab — but starting one for real, on your own machine, takes about two minutes:
```
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```
This scaffolds a real, working React project with a live-reloading dev server (Vite is the modern standard
build tool that bundles your JSX + JavaScript into something a browser can run, and instantly reflects your
edits). Tailwind's own docs (tailwindcss.com) have the exact, current setup snippet for wiring it into a Vite
project — small config details change between versions, so that's the source of truth, not a guess pasted here.

## Exercises

Open `exercises.js` — since a real bundler isn't available here, these exercises practice the *underlying
thinking* React is built on (pure functions that turn data into a description of output) using plain JavaScript
functions that return HTML strings, runnable directly with Node. This is a genuinely useful mental warm-up for
JSX, not just a workaround — "a function that turns data into markup" is the exact idea you'll carry into real
React components once you set one up using the steps above.
