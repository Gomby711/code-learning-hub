import pytest
from expense_tracker.models import Expense, InvalidExpenseError


def test_create_valid_expense():
    e = Expense(10.0, "Coffee", "food")
    assert e.amount == 10.0
    assert e.description == "Coffee"
    assert e.category == "food"


def test_negative_amount_raises():
    with pytest.raises(InvalidExpenseError):
        Expense(-5, "Bad expense")


def test_empty_description_raises():
    with pytest.raises(InvalidExpenseError):
        Expense(5, "   ")


def test_to_dict_and_from_dict_round_trip():
    e = Expense(10.0, "Coffee", "food", timestamp="2026-01-01T00:00:00")
    rebuilt = Expense.from_dict(e.to_dict())
    assert rebuilt == e


def test_lt_for_sorting():
    cheap = Expense(5, "Snack")
    pricey = Expense(50, "Dinner")
    assert cheap < pricey
