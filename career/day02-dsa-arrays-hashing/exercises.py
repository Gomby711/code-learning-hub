"""
Day 2 exercises -- Arrays & Hashing.
Run this file directly: python exercises.py
Each exercise has a check() call at the bottom that will print PASS/FAIL.
"""


def has_duplicate(nums):
    """Return True if any value appears more than once in nums, False otherwise.
    Do this in O(n) time using a set -- NOT a nested loop.
    """
    # TODO: implement
    pass


def two_sum(nums, target):
    """Return a list [i, j] of the two indexes whose values add up to target
    (i != j). Assume exactly one valid pair exists. O(n) time using a dict.
    """
    # TODO: implement
    pass


def most_frequent_char(s):
    """Return the character that appears most often in s. If there's a tie,
    return whichever of the tied characters appears FIRST in s.
    Hint: build a dict of char -> count, then scan s again in order to break ties.
    """
    # TODO: implement
    pass


def is_anagram(s1, s2):
    """Return True if s1 and s2 use exactly the same letters the same number
    of times (ignoring order). E.g. "listen" and "silent" -> True.
    """
    # TODO: implement
    pass


def max_sum_of_k_consecutive(nums, k):
    """Return the largest sum of any k consecutive elements in nums.
    Use the sliding window technique -- O(n), not O(n*k).
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    check("has_duplicate true case", has_duplicate([1, 2, 3, 2]) is True)
    check("has_duplicate false case", has_duplicate([1, 2, 3]) is False)

    result = two_sum([2, 7, 11, 15], 9)
    check("two_sum finds correct pair", sorted(result) == [0, 1] if result else False)

    check("most_frequent_char", most_frequent_char("aabbbcc") == "b")
    check("most_frequent_char tie goes to first", most_frequent_char("abab") == "a")

    check("is_anagram true case", is_anagram("listen", "silent") is True)
    check("is_anagram false case", is_anagram("hello", "world") is False)
    check("is_anagram different lengths", is_anagram("abc", "ab") is False)

    check("max_sum_of_k_consecutive",
          max_sum_of_k_consecutive([2, 1, 5, 1, 3, 2], 3) == 9)
    check("max_sum_of_k_consecutive k=1",
          max_sum_of_k_consecutive([4, 1, 7], 1) == 7)
