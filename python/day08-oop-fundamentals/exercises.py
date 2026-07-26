"""Day 8 exercises — OOP Fundamentals. Run: python exercises.py"""


class BankAccount:
    """A simple bank account.

    TODO: implement __init__(self, owner, balance=0) storing both as
    instance attributes.

    TODO: implement deposit(self, amount) which adds amount to balance
    (assume amount is always positive -- no validation needed here).

    TODO: implement withdraw(self, amount) which subtracts amount from
    balance IF there's enough balance, otherwise returns False without
    changing balance. Return True on a successful withdrawal.

    TODO: implement __str__(self) so that str(account) returns something
    like "Ana's account: $150" (this is a "dunder" method -- more on Day 9,
    but try it now: Python calls __str__ automatically when you print() an
    instance or call str() on it).
    """

    def __init__(self, owner, balance=0):
        pass

    def deposit(self, amount):
        pass

    def withdraw(self, amount):
        pass

    def __str__(self):
        pass


class Rectangle:
    """TODO: implement __init__(self, width, height).

    TODO: implement area(self) -> width * height

    TODO: implement perimeter(self) -> 2 * (width + height)

    TODO: implement is_square(self) -> True if width == height
    """

    def __init__(self, width, height):
        pass

    def area(self):
        pass

    def perimeter(self):
        pass

    def is_square(self):
        pass


class Playlist:
    """A playlist that starts empty. Each Playlist instance must have its
    OWN list of songs -- this exercise specifically tests that you avoid
    the shared-mutable-class-attribute bug described in the lesson.

    TODO: implement __init__(self) with self.songs = []

    TODO: implement add_song(self, title) appending to self.songs

    TODO: implement __len__(self) returning the number of songs
    (another dunder -- lets you call len(playlist))
    """

    def __init__(self):
        pass

    def add_song(self, title):
        pass

    def __len__(self):
        pass


# ---------------------------------------------------------------------------
def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    acc = BankAccount("Ana", 100)
    acc.deposit(50)
    check("BankAccount deposit", acc.balance == 150)
    ok = acc.withdraw(30)
    check("BankAccount withdraw success", ok is True and acc.balance == 120)
    ok2 = acc.withdraw(9999)
    check("BankAccount withdraw insufficient funds", ok2 is False and acc.balance == 120)
    check("BankAccount __str__", str(acc) == "Ana's account: $120")

    rect = Rectangle(4, 5)
    check("Rectangle area", rect.area() == 20)
    check("Rectangle perimeter", rect.perimeter() == 18)
    check("Rectangle is_square false", rect.is_square() is False)
    square = Rectangle(3, 3)
    check("Rectangle is_square true", square.is_square() is True)

    p1 = Playlist()
    p2 = Playlist()
    p1.add_song("Song A")
    check("Playlist instances have separate song lists", len(p2) == 0)
    check("Playlist __len__ works", len(p1) == 1)
