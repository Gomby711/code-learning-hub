"""Day 6 exercises — Errors, Modules. Run: python exercises.py"""

import math


class NegativeAmountError(Exception):
    """Custom exception for negative amounts."""
    pass


class InsufficientFundsError(Exception):
    """Custom exception for withdrawals exceeding balance."""
    pass


def safe_divide(a, b):
    """Return a / b, but if b is 0, return None instead of raising
    ZeroDivisionError. Use try/except, not an `if b == 0` check.
    """
    # TODO: implement
    pass


def parse_int_or_default(value, default=0):
    """Try to convert `value` (a string) to an int. If it can't be
    converted (raises ValueError), return `default` instead.
    e.g. parse_int_or_default("42") -> 42
         parse_int_or_default("abc") -> 0
    """
    # TODO: implement
    pass


def withdraw(balance, amount):
    """Return balance - amount.
    Raise NegativeAmountError if amount is negative.
    Raise InsufficientFundsError if amount > balance.
    (Both are the custom exceptions defined above.)
    """
    # TODO: implement, raising the appropriate custom exception
    pass


def sqrt_of_sum_of_squares(*numbers):
    """Return math.sqrt(sum of squares of numbers). Uses the `math` module
    imported at the top of this file -- practice using an imported module.
    e.g. sqrt_of_sum_of_squares(3, 4) -> 5.0
    """
    # TODO: implement
    pass


def main():
    """This should only print when the file is run directly, NOT when
    imported. (You don't need to change this function -- just make sure
    the `if __name__ == "__main__":` guard at the bottom is correct.)
    """
    print("Running Day 6 exercises directly.")


# ---------------------------------------------------------------------------
def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    main()

    check("safe_divide normal", safe_divide(10, 2) == 5.0)
    check("safe_divide by zero", safe_divide(10, 0) is None)

    check("parse_int_or_default valid", parse_int_or_default("42") == 42)
    check("parse_int_or_default invalid", parse_int_or_default("abc") == 0)
    check("parse_int_or_default custom default", parse_int_or_default("abc", -1) == -1)

    check("withdraw normal", withdraw(100, 30) == 70)

    try:
        withdraw(100, -5)
        check("withdraw raises on negative amount", False)
    except NegativeAmountError:
        check("withdraw raises on negative amount", True)

    try:
        withdraw(100, 200)
        check("withdraw raises on insufficient funds", False)
    except InsufficientFundsError:
        check("withdraw raises on insufficient funds", True)

    check("sqrt_of_sum_of_squares", sqrt_of_sum_of_squares(3, 4) == 5.0)
