import { add, subtract, divide, average, studentAverage, firstElement, Student } from "./calculator";

test("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
});

test("adds negative numbers", () => {
    expect(add(-2, -3)).toBe(-5);
});

test.each([
    [2, 3, 5],
    [-2, -3, -5],
    [-2, 5, 3],
])("add(%i, %i) should be %i", (a, b, expected) => {
    expect(add(a, b)).toBe(expected);
});

test("subtract", () => {
    expect(subtract(10, 4)).toBe(6);
});

test("divide normal case", () => {
    expect(divide(10, 2)).toBe(5);
});

test("divide by zero throws", () => {
    expect(() => divide(10, 0)).toThrow("cannot divide by zero");
});

test("average of a list", () => {
    expect(average([2, 4, 6])).toBe(4);
});

test("average of an empty array throws", () => {
    expect(() => average([])).toThrow();
});

test("studentAverage uses the Student interface correctly", () => {
    const student: Student = { name: "Ana", scores: [80, 90, 100] };
    expect(studentAverage(student)).toBe(90);
});

test("firstElement works with numbers", () => {
    expect(firstElement([1, 2, 3])).toBe(1);
});

test("firstElement works with strings (generic, same function)", () => {
    expect(firstElement(["a", "b"])).toBe("a");
});
