import { ExpenseTracker } from "../src/tracker";

test("add and total", () => {
    const tracker = new ExpenseTracker();
    tracker.addExpense(10, "Coffee", "food");
    tracker.addExpense(20, "Bus pass", "transport");
    expect(tracker.total()).toBe(30);
});

test("filterByCategory", () => {
    const tracker = new ExpenseTracker();
    tracker.addExpense(10, "Coffee", "food");
    tracker.addExpense(5, "Snack", "food");
    tracker.addExpense(20, "Bus pass", "transport");

    const foodExpenses = tracker.filterByCategory("food");
    expect(foodExpenses.map((e) => e.description)).toEqual(["Coffee", "Snack"]);
});

test("totalByCategory", () => {
    const tracker = new ExpenseTracker();
    tracker.addExpense(10, "Coffee", "food");
    tracker.addExpense(5, "Snack", "food");
    tracker.addExpense(20, "Bus pass", "transport");
    expect(tracker.totalByCategory()).toEqual({ food: 15, transport: 20 });
});
