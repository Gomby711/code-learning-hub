from greeter.core import greet


def test_greet():
    assert greet("Ana") == "Hello, Ana!"
