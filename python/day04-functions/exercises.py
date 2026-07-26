"""Day 4 exercises — Functions. Run: python exercises.py"""


def summarize(*numbers, **labels):
    """Return a dict: {"count": N, "total": sum, **labels}
    e.g. summarize(1, 2, 3, source="api") -> {"count": 3, "total": 6, "source": "api"}
    """
    # TODO: implement using *args and **kwargs
    pass


def add_item_safely(item, bucket=None):
    """Fix the classic mutable-default-argument bug: appends `item` to
    `bucket` and returns it. If bucket is None, start a fresh list each call.
    """
    # TODO: implement using the None-sentinel pattern
    pass


def make_counter():
    """Return a function `increment` that takes no arguments, and each time
    it's called, returns the next integer starting from 1 (1, 2, 3, ...).
    Use a closure with `nonlocal` -- do not use a global variable or a class.
    """
    # TODO: implement
    pass


def make_adders(n):
    """Return a list of n functions, where the i-th function (0-indexed)
    takes no args and returns i when called.
    This specifically tests the late-binding closure gotcha -- make sure
    calling the returned functions gives [0, 1, ..., n-1], not [n-1]*n.
    """
    # TODO: implement (hint: default-argument capture trick)
    pass


def apply_to_all(func, items):
    """Return a new list with func applied to each item in items.
    (This is literally what the builtin `map` does -- implement it yourself
    with a list comprehension or loop to practice passing functions around.)
    """
    # TODO: implement
    pass


def compose(f, g):
    """Return a new function h(x) such that h(x) == f(g(x)).
    e.g. compose(lambda x: x + 1, lambda x: x * 2)(3) -> f(g(3)) -> f(6) -> 7
    """
    # TODO: implement -- return a function (can be a lambda or nested def)
    pass


# ---------------------------------------------------------------------------
def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    check("summarize", summarize(1, 2, 3, source="api") == {"count": 3, "total": 6, "source": "api"})

    b = add_item_safely("a")
    b2 = add_item_safely("b")  # should NOT contain "a" -- fresh bucket
    check("add_item_safely fresh bucket each call", b == ["a"] and b2 == ["b"])

    counter = make_counter()
    seq = [counter(), counter(), counter()]
    check("make_counter", seq == [1, 2, 3])

    adders = make_adders(3)
    check("make_adders no late-binding bug", [a() for a in adders] == [0, 1, 2])

    check("apply_to_all", apply_to_all(lambda x: x * x, [1, 2, 3]) == [1, 4, 9])

    h = compose(lambda x: x + 1, lambda x: x * 2)
    check("compose", h(3) == 7)
