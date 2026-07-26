import { Expense } from "./models";

export class ExpenseTracker {
    expenses: Expense[] = [];

    addExpense(amount: number, description: string, category: string = "general"): Expense {
        const expense = new Expense(amount, description, category);
        this.expenses.push(expense);
        return expense;
    }

    filterByCategory(category: string): Expense[] {
        return this.expenses.filter((expense) => expense.category === category);
    }

    total(): number {
        return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    totalByCategory(): Record<string, number> {
        const totals: Record<string, number> = {};
        for (const expense of this.expenses) {
            totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
        }
        return totals;
    }
}
