"""Day 2 exercises — Control Flow. Run: python exercises.py"""


def classify_number(n):
    """Return 'negative', 'zero', or 'positive'."""
    # TODO: implement with if/elif/else
    pass


def fizzbuzz(n):
    """Return a list of strings for 1..n inclusive:
    - multiples of 3 -> 'Fizz'
    - multiples of 5 -> 'Buzz'
    - multiples of both -> 'FizzBuzz'
    - otherwise -> str(the number)
    """
    # TODO: implement with a for loop over range(1, n+1)
    pass


def first_matching_index(items, predicate):
    """Return the index of the first item in `items` for which predicate(item)
    is True, using a for...else. Return -1 if none match.
    Hint: this is a good place to practice for...else, but a plain loop with
    a return in the middle also solves it -- try the for...else version.
    """
    # TODO: implement
    pass


def squares_of_evens(numbers):
    """Return a list of squares of only the even numbers in `numbers`,
    using a single list comprehension.
    """
    # TODO: implement
    pass


def word_lengths(words):
    """Return a dict mapping each word to its length, using a dict
    comprehension. e.g. ["hi", "bye"] -> {"hi": 2, "bye": 3}
    """
    # TODO: implement
    pass


def describe_shape(shape):
    """`shape` is a tuple. Use a match statement:
    - ("circle", radius) -> f"circle with radius {radius}"
    - ("rectangle", w, h) -> f"rectangle {w}x{h}"
    - ("square", side) -> f"square with side {side}"
    - anything else -> "unknown shape"
    """
    # TODO: implement using match/case
    pass


# ---------------------------------------------------------------------------
def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    check("classify_number negative", classify_number(-5) == "negative")
    check("classify_number zero", classify_number(0) == "zero")
    check("classify_number positive", classify_number(5) == "positive")

    fb = fizzbuzz(15)
    check("fizzbuzz length", len(fb) == 15 if fb else False)
    check("fizzbuzz[2] is Fizz", fb[2] == "Fizz" if fb else False)
    check("fizzbuzz[4] is Buzz", fb[4] == "Buzz" if fb else False)
    check("fizzbuzz[14] is FizzBuzz", fb[14] == "FizzBuzz" if fb else False)
    check("fizzbuzz[0] is '1'", fb[0] == "1" if fb else False)

    check("first_matching_index found", first_matching_index([1, 3, 4, 5], lambda x: x % 2 == 0) == 2)
    check("first_matching_index not found", first_matching_index([1, 3, 5], lambda x: x % 2 == 0) == -1)

    check("squares_of_evens", squares_of_evens([1, 2, 3, 4, 5]) == [4, 16])

    check("word_lengths", word_lengths(["hi", "bye"]) == {"hi": 2, "bye": 3})

    check("describe_shape circle", describe_shape(("circle", 5)) == "circle with radius 5")
    check("describe_shape rectangle", describe_shape(("rectangle", 3, 4)) == "rectangle 3x4")
    check("describe_shape square", describe_shape(("square", 2)) == "square with side 2")
    check("describe_shape unknown", describe_shape(("triangle", 1, 2, 3)) == "unknown shape")
