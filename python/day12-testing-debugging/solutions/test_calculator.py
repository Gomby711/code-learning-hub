"""Day 12 reference solution -- filled-in tests."""

import pytest
from calculator import add, subtract, divide, average, is_palindrome


@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (-2, -3, -5),
    (-2, 5, 3),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected


def test_subtract():
    assert subtract(10, 4) == 6


def test_divide_normal():
    assert divide(10, 2) == 5


def test_divide_by_zero_raises_value_error():
    with pytest.raises(ValueError):
        divide(10, 0)


def test_average_of_list():
    assert average([2, 4, 6]) == 4


def test_average_of_empty_list_raises():
    with pytest.raises(ValueError):
        average([])


def test_is_palindrome_true_case():
    assert is_palindrome("racecar") is True
    assert is_palindrome("A man a plan a canal Panama") is True


def test_is_palindrome_false_case():
    assert is_palindrome("hello") is False
