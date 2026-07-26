from __future__ import annotations

import sys

from .models import InvalidExpenseError
from .storage import load_tracker, save_tracker, export_csv


def main() -> None:
    tracker = load_tracker()
    args = sys.argv[1:]

    if not args:
        print("Usage: python -m expense_tracker [add|list|summary|export] ...")
        return

    command = args[0]

    if command == "add":
        if len(args) < 3:
            print("Usage: add <amount> <description> [--category CATEGORY]")
            return
        try:
            amount = float(args[1])
        except ValueError:
            print(f"Error: '{args[1]}' is not a valid amount.")
            return
        description = args[2]
        category = "general"
        if "--category" in args:
            idx = args.index("--category")
            if idx + 1 < len(args):
                category = args[idx + 1]
        try:
            tracker.add_expense(amount, description, category)
        except InvalidExpenseError as e:
            print(f"Error: {e}")
            return
        save_tracker(tracker)
        print("Expense added.")

    elif command == "list":
        category = None
        if "--category" in args:
            idx = args.index("--category")
            if idx + 1 < len(args):
                category = args[idx + 1]
        expenses = list(tracker.filter_by_category(category)) if category else tracker.expenses
        if not expenses:
            print("No expenses.")
        for e in expenses:
            print(f"{e.timestamp}  ${e.amount:>8.2f}  [{e.category}]  {e.description}")

    elif command == "summary":
        print(f"Total: ${tracker.total():.2f}")
        for category, total in tracker.total_by_category().items():
            print(f"  {category:<15} ${total:.2f}")

    elif command == "export":
        if len(args) < 2:
            print("Usage: export <path.csv>")
            return
        export_csv(tracker, args[1])
        print(f"Exported to {args[1]}")

    else:
        print(f"Unrecognized command: '{command}'.")


if __name__ == "__main__":
    main()
