"""Day 10 reference solutions."""

from functools import wraps


def evens_up_to(n):
    for i in range(0, n + 1, 2):
        yield i


def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b


def take(iterable, n):
    it = iter(iterable)
    return [next(it) for _ in range(n)]


def uppercase_result(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper


def retry(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except Exception:
                    if attempt == times:
                        raise
        return wrapper
    return decorator
