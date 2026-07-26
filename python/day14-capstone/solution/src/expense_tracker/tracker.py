from __future__ import annotations

from collections import defaultdict
from functools import wraps
from typing import Callable, Iterator

from .models import Expense


def log_call(func: Callable) -> Callable:
    """Logs every call to the wrapped method with its arguments."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        arg_repr = ", ".join([repr(a) for a in args[1:]] + [f"{k}={v!r}" for k, v in kwargs.items()])
        print(f"[log] {func.__name__}({arg_repr})")
        return func(*args, **kwargs)
    return wrapper


class ExpenseTracker:
    def __init__(self) -> None:
        self.expenses: list[Expense] = []

    @log_call
    def add_expense(self, amount: float, description: str, category: str = "general") -> Expense:
        expense = Expense(amount, description, category)
        self.expenses.append(expense)
        return expense

    def filter_by_category(self, category: str) -> Iterator[Expense]:
        for expense in self.expenses:
            if expense.category == category:
                yield expense

    def total(self) -> float:
        return sum(e.amount for e in self.expenses)

    def total_by_category(self) -> dict[str, float]:
        totals: dict[str, float] = defaultdict(float)
        for expense in self.expenses:
            totals[expense.category] += expense.amount
        return dict(totals)
