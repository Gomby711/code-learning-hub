// Day 12 exercises -- Testing with Jest.
// Run: npx jest day12-typescript-and-testing   (from the typescript-javascript root)
//   or: npx jest                                (from inside this folder)
//
// Note: an empty test body (no expect() call inside it) reports as PASSING
// in Jest, since nothing failed -- that's expected while these are still
// TODOs, not a sign you're already done. Fill in every TODO for real.

import { add, subtract, divide, average, studentAverage, firstElement, Student } from "./calculator";

test("adds two positive numbers", () => {
    // TODO: expect(add(2, 3)).toBe(5);
});

test("adds negative numbers", () => {
    // TODO: expect(add(-2, -3)).toBe(-5);
});

test.each([
    [2, 3, 5],
    [-2, -3, -5],
    [-2, 5, 3],
])("add(%i, %i) should be %i", (a, b, expected) => {
    // TODO: expect(add(a, b)).toBe(expected);
    // (test.each runs this test body once per row in the array above --
    // the Jest equivalent of pytest's @parametrize from the Python track,
    // if you've seen that.)
});

test("subtract", () => {
    // TODO: expect(subtract(10, 4)).toBe(6);
});

test("divide normal case", () => {
    // TODO: expect(divide(10, 2)).toBe(5);
});

test("divide by zero throws", () => {
    // TODO: expect(() => divide(10, 0)).toThrow("cannot divide by zero");
    // Remember: wrap the call in an extra () => ... arrow function!
});

test("average of a list", () => {
    // TODO: expect(average([2, 4, 6])).toBe(4);
});

test("average of an empty array throws", () => {
    // TODO: expect(() => average([])).toThrow();
});

test("studentAverage uses the Student interface correctly", () => {
    const student: Student = { name: "Ana", scores: [80, 90, 100] };
    // TODO: expect(studentAverage(student)).toBe(90);
});

test("firstElement works with numbers", () => {
    // TODO: expect(firstElement([1, 2, 3])).toBe(1);
});

test("firstElement works with strings (generic, same function)", () => {
    // TODO: expect(firstElement(["a", "b"])).toBe("a");
});
