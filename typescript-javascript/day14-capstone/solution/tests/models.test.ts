import { Expense, InvalidExpenseError } from "../src/models";

test("create valid expense", () => {
    const e = new Expense(10, "Coffee", "food");
    expect(e.amount).toBe(10);
    expect(e.description).toBe("Coffee");
    expect(e.category).toBe("food");
});

test("negative amount throws", () => {
    expect(() => new Expense(-5, "Bad expense")).toThrow(InvalidExpenseError);
});

test("empty description throws", () => {
    expect(() => new Expense(5, "   ")).toThrow(InvalidExpenseError);
});

test("toJSON and fromJSON round trip", () => {
    const e = new Expense(10, "Coffee", "food", new Date("2026-01-01T00:00:00.000Z"));
    const rebuilt = Expense.fromJSON(e.toJSON());
    expect(rebuilt.amount).toBe(e.amount);
    expect(rebuilt.description).toBe(e.description);
    expect(rebuilt.category).toBe(e.category);
    expect(rebuilt.timestamp.toISOString()).toBe(e.timestamp.toISOString());
});
