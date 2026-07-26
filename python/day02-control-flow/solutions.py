"""Day 2 reference solutions."""


def classify_number(n):
    if n < 0:
        return "negative"
    elif n == 0:
        return "zero"
    else:
        return "positive"


def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result


def first_matching_index(items, predicate):
    for i, item in enumerate(items):
        if predicate(item):
            return i
    else:
        return -1


def squares_of_evens(numbers):
    return [n * n for n in numbers if n % 2 == 0]


def word_lengths(words):
    return {word: len(word) for word in words}


def describe_shape(shape):
    match shape:
        case ("circle", radius):
            return f"circle with radius {radius}"
        case ("rectangle", w, h):
            return f"rectangle {w}x{h}"
        case ("square", side):
            return f"square with side {side}"
        case _:
            return "unknown shape"
