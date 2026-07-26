"""Day 4 reference solutions."""


def summarize(*numbers, **labels):
    return {"count": len(numbers), "total": sum(numbers), **labels}


def add_item_safely(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket


def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment


def make_adders(n):
    return [(lambda i=i: i) for i in range(n)]


def apply_to_all(func, items):
    return [func(item) for item in items]


def compose(f, g):
    def h(x):
        return f(g(x))
    return h
