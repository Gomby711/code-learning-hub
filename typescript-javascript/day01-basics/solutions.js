// Day 1 reference solutions.

function describeType(value) {
    if (value === null) {
        return "null";
    }
    return typeof value;
}

function isStrictlyEqual(a, b) {
    return a === b;
}

function safeAdd(a, b) {
    return Number(a) + Number(b);
}

function isNullish(value) {
    return value === null || value === undefined;
}

function isTruthy(value) {
    return Boolean(value);
}

function constVsLetDemo() {
    const numbers = [1, 2, 3];
    numbers.push(4);
    console.log("After push:", numbers); // [1, 2, 3, 4]

    let count = 0;
    count = count + 1;
    console.log("After reassignment:", count); // 1
}

module.exports = { describeType, isStrictlyEqual, safeAdd, isNullish, isTruthy, constVsLetDemo };
