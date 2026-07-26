// Day 4 exercises -- Functions, Scope, Closures, this. Run: node exercises.js

function sumAll(...numbers) {
    // Use a REST parameter to accept any number of arguments, return their sum.
    // TODO: implement
}

function greetWithDefault(name, greeting = "Hello") {
    // Return `${greeting}, ${name}!` -- greeting should default to "Hello".
    // TODO: implement
}

function makeCounter() {
    // Return a function that takes no arguments. Each time the RETURNED
    // function is called, it should return the next integer starting at 1
    // (1, 2, 3, ...). Use a closure over a variable declared with `let`
    // inside makeCounter -- do NOT use a variable outside this function.
    // TODO: implement
}

function makeAdders(n) {
    // Return an ARRAY of n functions. The i-th function (0-indexed), when
    // called with no arguments, should return i.
    // Hint: use .map() over an array of indices, with an arrow function --
    // arrow functions capture each loop variable correctly, avoiding a classic
    // bug you'd hit with `var` in an old-style for loop.
    // e.g. makeAdders(3) -> three functions that return 0, 1, 2 respectively
    // TODO: implement
}

const bandRoom = {
    name: "The Basement",
    instruments: ["guitar", "drums", "bass"],
    // TODO: implement listInstruments as a method on this object (use the
    // `function` keyword, not an arrow function, for THIS outer method, so
    // `this` correctly refers to bandRoom) that returns an array of strings
    // like ["The Basement has a guitar", "The Basement has a drums", ...]
    // using this.instruments.map(...) with an ARROW FUNCTION inside map so
    // `this` is correctly inherited from listInstruments.
    listInstruments: function () {
        // TODO: implement using this.name, this.instruments, and .map() with an arrow function
    },
};

// ---------------------------------------------------------------------------
function check(label, condition) {
    console.log((condition ? "PASS" : "FAIL") + ": " + label);
}

check("sumAll", sumAll(1, 2, 3, 4) === 10);
check("sumAll empty", sumAll() === 0);

check("greetWithDefault default", greetWithDefault("Ana") === "Hello, Ana!");
check("greetWithDefault override", greetWithDefault("Bo", "Good morning") === "Good morning, Bo!");

const counter = makeCounter();
const sequence = counter ? [counter(), counter(), counter()] : [];
check("makeCounter", JSON.stringify(sequence) === JSON.stringify([1, 2, 3]));

const adders = makeAdders(3) || [];
check("makeAdders", JSON.stringify(adders.map((fn) => fn())) === JSON.stringify([0, 1, 2]));

const result = bandRoom.listInstruments ? bandRoom.listInstruments() : undefined;
check(
    "bandRoom.listInstruments uses `this` correctly",
    JSON.stringify(result) ===
        JSON.stringify(["The Basement has a guitar", "The Basement has a drums", "The Basement has a bass"])
);
