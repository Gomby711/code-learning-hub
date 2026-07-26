// Day 3 exercises -- Arrays, Objects, Destructuring, Spread/Rest. Run: node exercises.js

function doubleEvens(numbers) {
    // Return a NEW array containing double the value of only the EVEN
    // numbers in `numbers`, using .filter() and .map() chained together.
    // e.g. [1, 2, 3, 4] -> [4, 8]
    // TODO: implement
}

function sumArray(numbers) {
    // Return the sum of all numbers, using .reduce().
    // TODO: implement
}

function wordLengths(words) {
    // Return an OBJECT mapping each word to its length.
    // e.g. ["hi", "bye"] -> { hi: 2, bye: 3 }
    // TODO: implement (a plain loop or .reduce() both work -- your choice)
}

function mergeWithDefaults(overrides) {
    // There is a `defaults` object below. Return a NEW object that is
    // `defaults`, with any properties in `overrides` replacing the matching
    // ones. Use spread syntax -- do not mutate `defaults` itself.
    const defaults = { theme: "light", fontSize: 14, notifications: true };
    // TODO: implement using { ...defaults, ...overrides }
}

function firstAndRest(items) {
    // Return an array: [firstItem, restArrayLength]
    // e.g. firstAndRest([1, 2, 3, 4]) -> [1, 3]  (first is 1, rest is [2,3,4] which has length 3)
    // Use array destructuring with rest syntax: const [first, ...rest] = items;
    // TODO: implement
}

function getPersonSummary(person) {
    // `person` is an object with at least { name, age } properties, and
    // MAY have a `city` property. Use object destructuring (with a default
    // for city of "Unknown") to pull out name, age, and city, then return:
    // `${name} (${age}) - ${city}`
    // TODO: implement using destructuring
}

// ---------------------------------------------------------------------------
function check(label, condition) {
    console.log((condition ? "PASS" : "FAIL") + ": " + label);
}

function arraysEqual(a, b) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
}

check("doubleEvens", arraysEqual(doubleEvens([1, 2, 3, 4]), [4, 8]));

check("sumArray", sumArray([1, 2, 3, 4]) === 10);

const lengths = wordLengths(["hi", "bye"]) || {};
check("wordLengths", lengths.hi === 2 && lengths.bye === 3);

const merged = mergeWithDefaults({ fontSize: 18 }) || {};
check("mergeWithDefaults overrides one field", merged.fontSize === 18);
check("mergeWithDefaults keeps other defaults", merged.theme === "light" && merged.notifications === true);

check("firstAndRest", arraysEqual(firstAndRest([1, 2, 3, 4]), [1, 3]));

check(
    "getPersonSummary with city",
    getPersonSummary({ name: "Ana", age: 30, city: "Boston" }) === "Ana (30) - Boston"
);
check(
    "getPersonSummary without city (default)",
    getPersonSummary({ name: "Bo", age: 25 }) === "Bo (25) - Unknown"
);
