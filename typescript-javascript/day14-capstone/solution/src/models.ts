export class InvalidExpenseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidExpenseError";
    }
}

export interface ExpenseData {
    amount: number;
    description: string;
    category: string;
    timestamp: string;
}

export class Expense {
    amount: number;
    description: string;
    category: string;
    timestamp: Date;

    constructor(amount: number, description: string, category: string = "general", timestamp: Date = new Date()) {
        if (amount < 0) {
            throw new InvalidExpenseError(`amount cannot be negative: ${amount}`);
        }
        if (description.trim() === "") {
            throw new InvalidExpenseError("description cannot be empty");
        }
        this.amount = amount;
        this.description = description;
        this.category = category;
        this.timestamp = timestamp;
    }

    toJSON(): ExpenseData {
        return {
            amount: this.amount,
            description: this.description,
            category: this.category,
            timestamp: this.timestamp.toISOString(),
        };
    }

    static fromJSON(data: ExpenseData): Expense {
        return new Expense(data.amount, data.description, data.category, new Date(data.timestamp));
    }
}
