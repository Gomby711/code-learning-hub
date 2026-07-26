// Day 1 exercises -- Variables, Types, Equality. Run: node exercises.js

function describeType(value) {
    // Return a string describing the type of `value`, using typeof.
    // Special case: typeof null is "object" (a JS quirk) -- but we want this
    // function to return "null" specifically when given null. Handle that
    // special case explicitly before falling back to typeof for everything else.
    // TODO: implement
}

function isStrictlyEqual(a, b) {
    // Return true if a and b are equal using STRICT equality (===).
    // TODO: implement
}

function safeAdd(a, b) {
    // Return a + b, but coerce BOTH a and b to numbers first using Number(),
    // so that safeAdd("5", "3") returns the number 8, not the string "53".
    // TODO: implement
}

function isNullish(value) {
    // Return true if value is EITHER null OR undefined, false otherwise.
    // Hint: use === twice with || (logical or), not == .
    // TODO: implement
}

function isTruthy(value) {
    // Return true if `value` would be treated as truthy in an if-statement.
    // Hint: Boolean(value)
    // TODO: implement
}

function constVsLetDemo() {
    // Not graded -- just read, predict the output, then run and compare.
    const numbers = [1, 2, 3];
    numbers.push(4);
    console.log("After push:", numbers); // predict this first

    let count = 0;
    count = count + 1;
    console.log("After reassignment:", count); // predict this first
}

// ---------------------------------------------------------------------------
function check(label, condition) {
    console.log((condition ? "PASS" : "FAIL") + ": " + label);
}

check("describeType number", describeType(5) === "number");
check("describeType string", describeType("hi") === "string");
check("describeType boolean", describeType(true) === "boolean");
check("describeType undefined", describeType(undefined) === "undefined");
check("describeType null", describeType(null) === "null");

check("isStrictlyEqual true case", isStrictlyEqual(5, 5) === true);
check("isStrictlyEqual false case (different types)", isStrictlyEqual(5, "5") === false);

check("safeAdd with strings", safeAdd("5", "3") === 8);
check("safeAdd with numbers", safeAdd(2, 3) === 5);

check("isNullish null", isNullish(null) === true);
check("isNullish undefined", isNullish(undefined) === true);
check("isNullish zero (not nullish)", isNullish(0) === false);

check("isTruthy empty string", isTruthy("") === false);
check("isTruthy zero", isTruthy(0) === false);
check("isTruthy empty array (truthy in JS!)", isTruthy([]) === true);
check("isTruthy nonzero number", isTruthy(42) === true);

console.log("\n--- constVsLetDemo output ---");
constVsLetDemo();
