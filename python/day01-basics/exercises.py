"""
Day 1 exercises — Variables, Types, and the Object Model.
Run this file directly: python exercises.py
Each exercise has a check() call at the bottom that will print PASS/FAIL.
"""


def swap_without_temp(a, b):
    """Return (b, a) without using a temporary variable.
    Hint: Python lets you do multiple assignment on one line: x, y = y, x
    """
    # TODO: implement
    pass


def are_same_object(list_a, list_b):
    """Return True if list_a and list_b are literally the same object in memory
    (not just equal in value)."""
    # TODO: implement using `is`
    pass


def safe_copy_and_append(original_list, value):
    """Return a NEW list that is `original_list` with `value` appended,
    WITHOUT modifying original_list at all.
    Hint: you need to copy the list first (list(), .copy(), or slicing [:]).
    """
    # TODO: implement
    pass


def describe_type(value):
    """Return a string describing the value: 'int', 'float', 'str', 'list',
    'dict', 'set', 'tuple', 'bool', or 'NoneType'.
    Hint: type(value).__name__ gives you the type's name as a string.
    """
    # TODO: implement
    pass


def is_truthy(value):
    """Return True if `value` would be treated as truthy in an `if` statement,
    False otherwise. (Don't overthink this one.)
    """
    # TODO: implement
    pass


def mutate_vs_reassign_demo():
    """This one isn't graded — just read it, run it, and make sure the
    printed output matches what the comments predict BEFORE you run it.
    Predict first, then run, then compare.
    """
    original = [1, 2, 3]

    def append_in_place(lst):
        lst.append(4)

    def reassign_locally(lst):
        lst = [9, 9, 9]

    append_in_place(original)
    print("After append_in_place:", original)  # predict this first

    reassign_locally(original)
    print("After reassign_locally:", original)  # predict this first


# ---------------------------------------------------------------------------
# Checks — do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    check("swap_without_temp", swap_without_temp(1, 2) == (2, 1))

    x = [1, 2, 3]
    y = x
    z = [1, 2, 3]
    check("are_same_object true case", are_same_object(x, y) is True)
    check("are_same_object false case", are_same_object(x, z) is False)

    orig = [1, 2, 3]
    result = safe_copy_and_append(orig, 4)
    check("safe_copy_and_append returns correct result", result == [1, 2, 3, 4])
    check("safe_copy_and_append doesn't mutate original", orig == [1, 2, 3])

    check("describe_type int", describe_type(5) == "int")
    check("describe_type str", describe_type("hi") == "str")
    check("describe_type list", describe_type([1]) == "list")
    check("describe_type dict", describe_type({}) == "dict")
    check("describe_type NoneType", describe_type(None) == "NoneType")

    check("is_truthy empty list", is_truthy([]) is False)
    check("is_truthy nonempty list", is_truthy([0]) is True)
    check("is_truthy zero", is_truthy(0) is False)
    check("is_truthy empty string", is_truthy("") is False)
    check("is_truthy nonempty string", is_truthy("no") is True)

    print("\n--- mutate_vs_reassign_demo output ---")
    mutate_vs_reassign_demo()
