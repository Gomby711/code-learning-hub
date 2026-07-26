"""Day 9 exercises — OOP Advanced. Run: python exercises.py"""


class Shape:
    """Base class. TODO: implement __init__(self, name) storing self.name.
    TODO: implement area(self) that raises NotImplementedError -- subclasses
    must override it (this is the standard "abstract method" pattern
    without needing the `abc` module).
    TODO: implement describe(self) returning f"{self.name} has area {self.area():.2f}"
    (describe() should NOT need to change in any subclass -- that's the point).
    """

    def __init__(self, name):
        pass

    def area(self):
        pass

    def describe(self):
        pass


class Circle(Shape):
    """TODO: implement __init__(self, radius) that calls super().__init__("Circle")
    and stores self.radius.
    TODO: implement area(self) -> 3.14159 * radius ** 2
    """

    def __init__(self, radius):
        pass

    def area(self):
        pass


class Square(Shape):
    """TODO: implement __init__(self, side) that calls super().__init__("Square")
    and stores self.side.
    TODO: implement area(self) -> side ** 2
    """

    def __init__(self, side):
        pass

    def area(self):
        pass


class Money:
    """A small value class demonstrating dunder methods.
    TODO: implement __init__(self, amount) storing self.amount (a float/int).
    TODO: implement __repr__(self) -> f"Money({self.amount})"
    TODO: implement __eq__(self, other) -> True if self.amount == other.amount
    TODO: implement __add__(self, other) -> a NEW Money with amounts summed
    TODO: implement __lt__(self, other) -> True if self.amount < other.amount
    (implementing __lt__ lets you use sorted() on a list of Money objects)
    """

    def __init__(self, amount):
        pass

    def __repr__(self):
        pass

    def __eq__(self, other):
        pass

    def __add__(self, other):
        pass

    def __lt__(self, other):
        pass


class Engine:
    def start(self):
        return "engine running"


class Car:
    """Composition example.
    TODO: implement __init__(self) that creates self.engine = Engine()
    TODO: implement start(self) that delegates to self.engine.start()
    and returns f"Car: {result}"
    """

    def __init__(self):
        pass

    def start(self):
        pass


# ---------------------------------------------------------------------------
def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    shapes = [Circle(2), Square(3)]
    check("Circle isinstance Shape (polymorphism)", isinstance(shapes[0], Shape))
    check("Circle area", abs(shapes[0].area() - 12.56636) < 0.001)
    check("Square area", shapes[1].area() == 9)
    check("Circle describe", shapes[0].describe().startswith("Circle has area"))

    m1 = Money(10)
    m2 = Money(10)
    m3 = Money(5)
    check("Money __repr__", repr(m1) == "Money(10)")
    check("Money __eq__", m1 == m2)
    check("Money __add__", (m1 + m3) == Money(15))
    check("Money __lt__ / sorted", sorted([m1, m3], key=lambda m: m.amount)[0] == m3)

    car = Car()
    check("Car composition (has-a Engine)", car.start() == "Car: engine running")
