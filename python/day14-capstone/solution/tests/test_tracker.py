import csv
from expense_tracker.tracker import ExpenseTracker
from expense_tracker.storage import export_csv


def test_add_and_total():
    tracker = ExpenseTracker()
    tracker.add_expense(10, "Coffee", "food")
    tracker.add_expense(20, "Bus pass", "transport")
    assert tracker.total() == 30


def test_filter_by_category_is_generator():
    tracker = ExpenseTracker()
    tracker.add_expense(10, "Coffee", "food")
    tracker.add_expense(5, "Snack", "food")
    tracker.add_expense(20, "Bus pass", "transport")

    food_expenses = tracker.filter_by_category("food")
    assert hasattr(food_expenses, "__next__")  # must be lazy/generator, not a list
    assert [e.description for e in food_expenses] == ["Coffee", "Snack"]


def test_total_by_category():
    tracker = ExpenseTracker()
    tracker.add_expense(10, "Coffee", "food")
    tracker.add_expense(5, "Snack", "food")
    tracker.add_expense(20, "Bus pass", "transport")
    assert tracker.total_by_category() == {"food": 15, "transport": 20}


def test_export_csv(tmp_path):
    tracker = ExpenseTracker()
    tracker.add_expense(10, "Coffee", "food")
    out_file = tmp_path / "out.csv"
    export_csv(tracker, str(out_file))

    with open(out_file, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    assert len(rows) == 1
    assert rows[0]["description"] == "Coffee"
    assert float(rows[0]["amount"]) == 10
