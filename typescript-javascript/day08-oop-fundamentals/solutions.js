// Day 8 reference solutions.

class BankAccount {
    #balance;

    constructor(owner, balance = 0) {
        this.owner = owner;
        this.#balance = balance;
    }

    deposit(amount) {
        this.#balance += amount;
    }

    withdraw(amount) {
        if (amount > this.#balance) {
            return false;
        }
        this.#balance -= amount;
        return true;
    }

    get balance() {
        return this.#balance;
    }
}

class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }

    perimeter() {
        return 2 * (this.width + this.height);
    }

    isSquare() {
        return this.width === this.height;
    }
}

class Playlist {
    constructor() {
        this.songs = [];
    }

    addSong(title) {
        this.songs.push(title);
    }

    get length() {
        return this.songs.length;
    }
}

module.exports = { BankAccount, Rectangle, Playlist };
