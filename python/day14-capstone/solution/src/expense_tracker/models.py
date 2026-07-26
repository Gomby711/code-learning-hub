from __future__ import annotations

from datetime import datetime


class InvalidExpenseError(Exception):
    """Raised when an expense would be created with invalid data."""
    pass


class Expense:
    def __init__(
        self,
        amount: float,
        description: str,
        category: str = "general",
        timestamp: str | None = None,
    ) -> None:
        if amount < 0:
            raise InvalidExpenseError(f"amount cannot be negative: {amount}")
        if not description.strip():
            raise InvalidExpenseError("description cannot be empty")

        self.amount = amount
        self.description = description
        self.category = category
        self.timestamp = timestamp or datetime.now().isoformat(timespec="seconds")

    def __repr__(self) -> str:
        return (
            f"Expense(amount={self.amount}, description={self.description!r}, "
            f"category={self.category!r}, timestamp={self.timestamp!r})"
        )

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Expense):
            return NotImplemented
        return (
            self.amount == other.amount
            and self.description == other.description
            and self.category == other.category
            and self.timestamp == other.timestamp
        )

    def __lt__(self, other: "Expense") -> bool:
        return self.amount < other.amount

    def to_dict(self) -> dict:
        return {
            "amount": self.amount,
            "description": self.description,
            "category": self.category,
            "timestamp": self.timestamp,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Expense":
        return cls(
            amount=data["amount"],
            description=data["description"],
            category=data["category"],
            timestamp=data["timestamp"],
        )
