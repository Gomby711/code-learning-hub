// Day 6 exercises -- Errors and Modules. Run: node exercises.js

class NegativeAmountError extends Error {
    constructor(message) {
        super(message);
        this.name = "NegativeAmountError";
    }
}

class InsufficientFundsError extends Error {
    constructor(message) {
        super(message);
        this.name = "InsufficientFundsError";
    }
}

function safeDivide(a, b) {
    // Return a / b, but if b is 0, return null instead of Infinity/NaN.
    // (Dividing by zero in JS doesn't throw -- it gives Infinity or NaN --
    // so you'll need an explicit check here, not a try/catch.)
    // TODO: implement
}

function parseIntOrDefault(value, defaultValue = 0) {
    // Try to convert `value` (a string) to an integer using parseInt(value, 10).
    // If the result is NaN (Not a Number -- check with Number.isNaN()),
    // return defaultValue instead.
    // e.g. parseIntOrDefault("42") -> 42
    //      parseIntOrDefault("abc") -> 0
    // TODO: implement
}

function withdraw(balance, amount) {
    // Return balance - amount.
    // Throw a NegativeAmountError if amount is negative.
    // Throw an InsufficientFundsError if amount > balance.
    // TODO: implement, using `throw new ...Error(...)`
}

// ---------------------------------------------------------------------------
function check(label, condition) {
    console.log((condition ? "PASS" : "FAIL") + ": " + label);
}

check("safeDivide normal", safeDivide(10, 2) === 5);
check("safeDivide by zero", safeDivide(10, 0) === null);

check("parseIntOrDefault valid", parseIntOrDefault("42") === 42);
check("parseIntOrDefault invalid", parseIntOrDefault("abc") === 0);
check("parseIntOrDefault custom default", parseIntOrDefault("abc", -1) === -1);

check("withdraw normal", withdraw(100, 30) === 70);

try {
    withdraw(100, -5);
    check("withdraw throws on negative amount", false);
} catch (error) {
    check("withdraw throws on negative amount", error instanceof NegativeAmountError);
}

try {
    withdraw(100, 200);
    check("withdraw throws on insufficient funds", false);
} catch (error) {
    check("withdraw throws on insufficient funds", error instanceof InsufficientFundsError);
}
