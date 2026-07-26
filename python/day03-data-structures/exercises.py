"""Day 3 exercises — Data Structures. Run: python exercises.py"""

from collections import defaultdict


def reverse_every_other(items):
    """Given a list, return a NEW list containing every other element
    starting from index 0, reversed. e.g. [0,1,2,3,4,5,6] -> [6,4,2,0]
    Hint: one slice expression can do this.
    """
    # TODO: implement using slicing
    pass


def word_count(words):
    """Given a list of words, return a dict mapping each word to how many
    times it appears. e.g. ["a","b","a"] -> {"a": 2, "b": 1}
    Do this WITHOUT using collections.Counter (practice the dict.get or
    setdefault pattern by hand).
    """
    # TODO: implement
    pass


def group_by_first_letter(words):
    """Return a dict mapping first letter -> list of words starting with it.
    e.g. ["apple", "banana", "avocado"] -> {"a": ["apple", "avocado"], "b": ["banana"]}
    Use collections.defaultdict(list).
    """
    # TODO: implement
    pass


def common_elements(list1, list2):
    """Return a SET of elements that appear in both list1 and list2.
    Must run in roughly O(n + m) time -- use set operations, not nested loops.
    """
    # TODO: implement
    pass


def safe_lookup(d, key, default):
    """Return d[key] if key exists, otherwise `default`, without ever
    raising KeyError. One line, using a dict method.
    """
    # TODO: implement
    pass


def swap_keys_and_values(d):
    """Given a dict with unique values, return a new dict with keys and
    values swapped. e.g. {"a": 1, "b": 2} -> {1: "a", 2: "b"}
    """
    # TODO: implement using a dict comprehension
    pass


# ---------------------------------------------------------------------------
def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    check("reverse_every_other", reverse_every_other([0, 1, 2, 3, 4, 5, 6]) == [6, 4, 2, 0])

    check("word_count", word_count(["a", "b", "a"]) == {"a": 2, "b": 1})

    grouped = group_by_first_letter(["apple", "banana", "avocado"])
    check("group_by_first_letter", grouped == {"a": ["apple", "avocado"], "b": ["banana"]})

    check("common_elements", common_elements([1, 2, 3], [2, 3, 4]) == {2, 3})

    check("safe_lookup found", safe_lookup({"a": 1}, "a", 0) == 1)
    check("safe_lookup default", safe_lookup({"a": 1}, "z", 0) == 0)

    check("swap_keys_and_values", swap_keys_and_values({"a": 1, "b": 2}) == {1: "a", 2: "b"})
