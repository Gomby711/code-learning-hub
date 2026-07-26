"""Day 8 reference solutions."""


class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            return False
        self.balance -= amount
        return True

    def __str__(self):
        return f"{self.owner}'s account: ${self.balance}"


class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height


class Playlist:
    def __init__(self):
        self.songs = []

    def add_song(self, title):
        self.songs.append(title)

    def __len__(self):
        return len(self.songs)
