"""Day 6 reference solutions."""

import math


class NegativeAmountError(Exception):
    pass


class InsufficientFundsError(Exception):
    pass


def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None


def parse_int_or_default(value, default=0):
    try:
        return int(value)
    except ValueError:
        return default


def withdraw(balance, amount):
    if amount < 0:
        raise NegativeAmountError(f"amount cannot be negative: {amount}")
    if amount > balance:
        raise InsufficientFundsError(f"need {amount}, have {balance}")
    return balance - amount


def sqrt_of_sum_of_squares(*numbers):
    return math.sqrt(sum(n * n for n in numbers))


def main():
    print("Running Day 6 exercises directly.")
