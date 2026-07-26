"""Day 12 exercises — Testing with pytest.

Setup: pip install pytest
Run:   pytest test_calculator.py -v

Your tasks:
1. Add type hints to every function in calculator.py (int/float params and
   return types, list[float] for average, str/bool for is_palindrome).
   This isn't checked by pytest -- do it by hand and re-read the file after.
2. Fill in the TODO test functions below. Each docstring tells you what to
   test. Use plain `assert` and `pytest.raises` as shown in the lesson.
3. Convert the three separate `test_add_*` tests into ONE parametrized test
   using @pytest.mark.parametrize (see the TODO comment above it).
"""

import pytest
from calculator import add, subtract, divide, average, is_palindrome


def test_add_positive_numbers():
    # TODO: assert add(2, 3) == 5
    pass


def test_add_negative_numbers():
    # TODO: assert add(-2, -3) == -5
    pass


def test_add_mixed_signs():
    # TODO: assert add(-2, 5) == 3
    pass


# TODO: once the three tests above pass individually, replace them with a
# single parametrized test here, e.g.:
#
# @pytest.mark.parametrize("a, b, expected", [
#     (2, 3, 5),
#     (-2, -3, -5),
#     (-2, 5, 3),
# ])
# def test_add_parametrized(a, b, expected):
#     assert add(a, b) == expected


def test_subtract():
    """assert subtract(10, 4) == 6"""
    # TODO: implement
    pass


def test_divide_normal():
    """assert divide(10, 2) == 5"""
    # TODO: implement
    pass


def test_divide_by_zero_raises_value_error():
    """Use `with pytest.raises(ValueError): divide(10, 0)`"""
    # TODO: implement
    pass


def test_average_of_list():
    """assert average([2, 4, 6]) == 4"""
    # TODO: implement
    pass


def test_average_of_empty_list_raises():
    """average([]) should raise ValueError -- use pytest.raises"""
    # TODO: implement
    pass


def test_is_palindrome_true_case():
    """is_palindrome("racecar") should be True.
    Also test is_palindrome("A man a plan a canal Panama") -- should be True
    once spaces/case are normalized (this exercises the .lower()/.replace()
    logic in calculator.py -- read it to understand why case/spaces matter)."""
    # TODO: implement
    pass


def test_is_palindrome_false_case():
    """is_palindrome("hello") should be False"""
    # TODO: implement
    pass
