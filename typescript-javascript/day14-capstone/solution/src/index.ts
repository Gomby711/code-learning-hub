import { InvalidExpenseError } from "./models";
import { loadTracker, saveTracker, exportCSV } from "./storage";

async function main(): Promise<void> {
    const tracker = await loadTracker();
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log("Usage: index.js [add|list|summary|export] ...");
        return;
    }

    const command = args[0];

    if (command === "add") {
        if (args.length < 3) {
            console.log("Usage: add <amount> <description> [--category CATEGORY]");
            return;
        }
        const amount = Number(args[1]);
        if (Number.isNaN(amount)) {
            console.log(`Error: '${args[1]}' is not a valid amount.`);
            return;
        }
        const description = args[2];
        let category = "general";
        const categoryIndex = args.indexOf("--category");
        if (categoryIndex !== -1 && args[categoryIndex + 1]) {
            category = args[categoryIndex + 1];
        }
        try {
            tracker.addExpense(amount, description, category);
        } catch (error) {
            if (error instanceof InvalidExpenseError) {
                console.log(`Error: ${error.message}`);
                return;
            }
            throw error;
        }
        await saveTracker(tracker);
        console.log("Expense added.");
    } else if (command === "list") {
        let category: string | null = null;
        const categoryIndex = args.indexOf("--category");
        if (categoryIndex !== -1 && args[categoryIndex + 1]) {
            category = args[categoryIndex + 1];
        }
        const expenses = category ? tracker.filterByCategory(category) : tracker.expenses;
        if (expenses.length === 0) {
            console.log("No expenses.");
        }
        for (const expense of expenses) {
            console.log(
                `${expense.timestamp.toISOString()}  $${expense.amount.toFixed(2).padStart(8)}  [${expense.category}]  ${expense.description}`
            );
        }
    } else if (command === "summary") {
        console.log(`Total: $${tracker.total().toFixed(2)}`);
        for (const [category, total] of Object.entries(tracker.totalByCategory())) {
            console.log(`  ${category.padEnd(15)} $${total.toFixed(2)}`);
        }
    } else if (command === "export") {
        if (args.length < 2) {
            console.log("Usage: export <path.csv>");
            return;
        }
        await exportCSV(tracker, args[1]);
        console.log(`Exported to ${args[1]}`);
    } else {
        console.log(`Unrecognized command: '${command}'.`);
    }
}

main();
