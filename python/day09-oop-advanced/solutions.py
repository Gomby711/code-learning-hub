"""Day 9 reference solutions."""


class Shape:
    def __init__(self, name):
        self.name = name

    def area(self):
        raise NotImplementedError("subclasses must implement area()")

    def describe(self):
        return f"{self.name} has area {self.area():.2f}"


class Circle(Shape):
    def __init__(self, radius):
        super().__init__("Circle")
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2


class Square(Shape):
    def __init__(self, side):
        super().__init__("Square")
        self.side = side

    def area(self):
        return self.side ** 2


class Money:
    def __init__(self, amount):
        self.amount = amount

    def __repr__(self):
        return f"Money({self.amount})"

    def __eq__(self, other):
        return self.amount == other.amount

    def __add__(self, other):
        return Money(self.amount + other.amount)

    def __lt__(self, other):
        return self.amount < other.amount


class Engine:
    def start(self):
        return "engine running"


class Car:
    def __init__(self):
        self.engine = Engine()

    def start(self):
        return f"Car: {self.engine.start()}"
