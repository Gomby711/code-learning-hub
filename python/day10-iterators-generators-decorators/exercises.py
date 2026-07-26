"""Day 10 exercises — Iterators, Generators, Decorators. Run: python exercises.py"""

from functools import wraps


def evens_up_to(n):
    """A GENERATOR function (must use yield, not return + a list) that
    yields each even number from 0 up to and including n, in order.
    e.g. list(evens_up_to(10)) -> [0, 2, 4, 6, 8, 10]
    """
    # TODO: implement using yield in a loop
    pass


def fibonacci():
    """An INFINITE generator yielding the Fibonacci sequence: 0, 1, 1, 2,
    3, 5, 8, 13, ... forever. (Caller is responsible for stopping, e.g. with
    itertools.islice or a manual break -- don't try to make this finite.)
    """
    # TODO: implement with an infinite while True loop and yield
    pass


def take(iterable, n):
    """Return a list of the first n items pulled from `iterable` (which
    might be an infinite generator like fibonacci() -- this function must
    only pull exactly n items, not try to exhaust the whole thing).
    """
    # TODO: implement using iter()/next() or by looping with a counter/break
    pass


def uppercase_result(func):
    """A DECORATOR: wraps `func` so that whatever string it returns is
    converted to uppercase before being returned. Must use functools.wraps
    to preserve the original function's __name__.
    """
    # TODO: implement -- return a wrapper function
    pass


def retry(times):
    """A DECORATOR FACTORY: retry(times) returns a decorator. The decorated
    function is called up to `times` times; if it raises an exception, the
    exception is caught and the function is retried, UNLESS it's the last
    attempt, in which case the exception should propagate (be re-raised).
    If any attempt succeeds, return that result immediately (no more retries).
    """
    # TODO: implement (this is the two-layers-of-nesting pattern from the lesson)
    pass


# ---------------------------------------------------------------------------
def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    check("evens_up_to", list(evens_up_to(10)) == [0, 2, 4, 6, 8, 10])

    fib_gen = fibonacci()
    check("fibonacci is a generator (has __next__)", hasattr(fib_gen, "__next__"))

    first_ten_fib = take(fibonacci(), 10)
    check("take from infinite generator", first_ten_fib == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34])

    @uppercase_result
    def greet(name):
        """Return a greeting."""
        return f"hello, {name}"

    check("uppercase_result decorator", greet("ana") == "HELLO, ANA")
    check("uppercase_result preserves __name__", greet.__name__ == "greet")

    attempt_counter = {"count": 0}

    @retry(times=3)
    def flaky():
        attempt_counter["count"] += 1
        if attempt_counter["count"] < 3:
            raise ValueError("not yet")
        return "success"

    check("retry decorator eventually succeeds", flaky() == "success")
    check("retry decorator retried exactly 3 times", attempt_counter["count"] == 3)

    @retry(times=2)
    def always_fails():
        raise ValueError("nope")

    try:
        always_fails()
        check("retry decorator re-raises after exhausting attempts", False)
    except ValueError:
        check("retry decorator re-raises after exhausting attempts", True)
