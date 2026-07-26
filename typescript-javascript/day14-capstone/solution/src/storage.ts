import * as fs from "fs/promises";
import { Expense, ExpenseData } from "./models";
import { ExpenseTracker } from "./tracker";

const DEFAULT_PATH = "expenses.json";

export async function loadTracker(path: string = DEFAULT_PATH): Promise<ExpenseTracker> {
    const tracker = new ExpenseTracker();
    try {
        const contents = await fs.readFile(path, "utf-8");
        const data: ExpenseData[] = JSON.parse(contents);
        tracker.expenses = data.map((item) => Expense.fromJSON(item));
    } catch (error) {
        // file doesn't exist yet on first run -- start with an empty tracker
    }
    return tracker;
}

export async function saveTracker(tracker: ExpenseTracker, path: string = DEFAULT_PATH): Promise<void> {
    const data = tracker.expenses.map((expense) => expense.toJSON());
    await fs.writeFile(path, JSON.stringify(data, null, 2));
}

export async function exportCSV(tracker: ExpenseTracker, path: string): Promise<void> {
    const header = "amount,description,category,timestamp";
    const rows = tracker.expenses.map((expense) => {
        const data = expense.toJSON();
        return `${data.amount},"${data.description}",${data.category},${data.timestamp}`;
    });
    await fs.writeFile(path, [header, ...rows].join("\n"));
}
