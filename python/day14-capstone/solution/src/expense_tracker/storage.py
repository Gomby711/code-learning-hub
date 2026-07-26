from __future__ import annotations

import json
import csv
from pathlib import Path

from .models import Expense
from .tracker import ExpenseTracker

DEFAULT_PATH = Path("expenses.json")


def load_tracker(path: Path = DEFAULT_PATH) -> ExpenseTracker:
    tracker = ExpenseTracker()
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        tracker.expenses = [Expense.from_dict(item) for item in data]
    except FileNotFoundError:
        pass
    return tracker


def save_tracker(tracker: ExpenseTracker, path: Path = DEFAULT_PATH) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump([e.to_dict() for e in tracker.expenses], f, indent=2)


def export_csv(tracker: ExpenseTracker, path: str) -> None:
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["amount", "description", "category", "timestamp"])
        writer.writeheader()
        for expense in tracker.expenses:
            writer.writerow(expense.to_dict())
