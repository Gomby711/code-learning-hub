"""The module under test for Day 12. Add type hints to every function here
as your first exercise (see instructions in test_calculator.py), THEN write
tests for it in test_calculator.py.
"""


def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def divide(a, b):
    if b == 0:
        raise ValueError("cannot divide by zero")
    return a / b


def average(numbers):
    if not numbers:
        raise ValueError("cannot average an empty list")
    return sum(numbers) / len(numbers)


def is_palindrome(text):
    normalized = text.lower().replace(" ", "")
    return normalized == normalized[::-1]
