// Day 5 exercises -- component thinking (data -> markup, the idea underneath React).
// Run: node exercises.js
// Each function is a "pure" render function: given the same input, always return
// the same HTML string, with NO side effects (no console.log inside these, no
// touching anything outside the function). That purity is exactly what makes a
// React component predictable.

function greetingHtml(name) {
    // Return the string "<h1>Hello, NAME!</h1>" with the given name substituted in.
    // TODO: implement
}

function todoItemHtml(todo) {
    // todo is { text: string, done: boolean }.
    // Return '<li class="done">TEXT</li>' if todo.done is true,
    // or '<li>TEXT</li>' if false. (Mirrors how a real component would
    // conditionally apply a CSS class based on state.)
    // TODO: implement
}

function todoListHtml(todos) {
    // todos is an array of { text, done } objects.
    // Return a single <ul>...</ul> string containing one <li> per todo,
    // by reusing todoItemHtml for each item and joining the results.
    // This mirrors how a real TodoList component renders a TodoItem per entry.
    // TODO: implement
}

function counterHtml(count) {
    // Return a string showing the count and a hint of the increment button,
    // in this EXACT shape: `<p>Count: N</p><button>+1</button>`
    // where N is the count. This mirrors a real Counter component's render output
    // for a given piece of state -- same input, same output, every time.
    // TODO: implement
}

// ---------------------------------------------------------------------------
// Checks -- do not need to edit below this line
// ---------------------------------------------------------------------------

function check(label, condition) {
    console.log((condition ? "PASS" : "FAIL") + ": " + label);
}

check("greetingHtml", greetingHtml("Sam") === "<h1>Hello, Sam!</h1>");

check("todoItemHtml done",
    todoItemHtml({ text: "Buy milk", done: true }) === '<li class="done">Buy milk</li>');
check("todoItemHtml not done",
    todoItemHtml({ text: "Buy milk", done: false }) === "<li>Buy milk</li>");

const todos = [
    { text: "Buy milk", done: true },
    { text: "Walk dog", done: false },
];
check("todoListHtml",
    todoListHtml(todos) === '<ul><li class="done">Buy milk</li><li>Walk dog</li></ul>');

check("counterHtml", counterHtml(3) === "<p>Count: 3</p><button>+1</button>");
check("counterHtml zero", counterHtml(0) === "<p>Count: 0</p><button>+1</button>");
