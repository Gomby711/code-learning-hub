"""Day 12 reference solution -- type-hinted version of calculator.py."""


def add(a: float, b: float) -> float:
    return a + b


def subtract(a: float, b: float) -> float:
    return a - b


def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("cannot divide by zero")
    return a / b


def average(numbers: list[float]) -> float:
    if not numbers:
        raise ValueError("cannot average an empty list")
    return sum(numbers) / len(numbers)


def is_palindrome(text: str) -> bool:
    normalized = text.lower().replace(" ", "")
    return normalized == normalized[::-1]
