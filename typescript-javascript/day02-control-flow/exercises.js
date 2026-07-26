// Day 2 exercises -- Control Flow. Run: node exercises.js

function classifyNumber(n) {
    // Return "negative", "zero", or "positive".
    // TODO: implement with if/else if/else
}

function fizzbuzz(n) {
    // Return an ARRAY of strings for 1..n inclusive:
    // - multiples of 3 -> "Fizz"
    // - multiples of 5 -> "Buzz"
    // - multiples of both -> "FizzBuzz"
    // - otherwise -> String(the number)
    // TODO: implement with a for loop from 1 to n
}

function sumUntilNegative(numbers) {
    // Add up numbers from the array IN ORDER, but stop (do not include) the
    // first negative number you encounter. Use for...of and break.
    // e.g. sumUntilNegative([1, 2, -1, 3]) -> 3 (1 + 2, stop at -1)
    // TODO: implement
}

function describeShape(shape) {
    // `shape` is an object with a `type` property.
    // Use switch on shape.type:
    // "circle"    -> `circle with radius ${shape.radius}`
    // "rectangle" -> `rectangle ${shape.width}x${shape.height}`
    // "square"    -> `square with side ${shape.side}`
    // anything else -> "unknown shape"
    // TODO: implement using switch
}

function countVowels(word) {
    // Return how many vowels (a, e, i, o, u -- lowercase only, assume input
    // is already lowercase) appear in `word`. Use for...of over the string.
    // TODO: implement
}

// ---------------------------------------------------------------------------
function check(label, condition) {
    console.log((condition ? "PASS" : "FAIL") + ": " + label);
}

check("classifyNumber negative", classifyNumber(-5) === "negative");
check("classifyNumber zero", classifyNumber(0) === "zero");
check("classifyNumber positive", classifyNumber(5) === "positive");

const fb = fizzbuzz(15) || [];
check("fizzbuzz length", fb.length === 15);
check("fizzbuzz[2] is Fizz", fb[2] === "Fizz");
check("fizzbuzz[4] is Buzz", fb[4] === "Buzz");
check("fizzbuzz[14] is FizzBuzz", fb[14] === "FizzBuzz");
check("fizzbuzz[0] is '1'", fb[0] === "1");

check("sumUntilNegative", sumUntilNegative([1, 2, -1, 3]) === 3);
check("sumUntilNegative no negatives", sumUntilNegative([1, 2, 3]) === 6);

check("describeShape circle", describeShape({ type: "circle", radius: 5 }) === "circle with radius 5");
check("describeShape rectangle", describeShape({ type: "rectangle", width: 3, height: 4 }) === "rectangle 3x4");
check("describeShape unknown", describeShape({ type: "triangle" }) === "unknown shape");

check("countVowels", countVowels("hello world") === 3);
check("countVowels none", countVowels("xyz") === 0);
