// Day 8 exercises -- OOP Fundamentals. Run: node exercises.js

class BankAccount {
    #balance;

    constructor(owner, balance = 0) {
        // TODO: store owner as this.owner and balance in the private #balance field.
    }

    deposit(amount) {
        // TODO: add amount to the private balance.
    }

    withdraw(amount) {
        // TODO: subtract amount from balance IF there's enough balance,
        // otherwise return false without changing anything.
        // Return true on a successful withdrawal.
    }

    get balance() {
        // TODO: return the private #balance field.
    }
}

class Rectangle {
    constructor(width, height) {
        // TODO: store width and height
    }

    area() {
        // TODO: return width * height
    }

    perimeter() {
        // TODO: return 2 * (width + height)
    }

    isSquare() {
        // TODO: return true if width === height
    }
}

class Playlist {
    constructor() {
        // TODO: set this.songs = []
    }

    addSong(title) {
        // TODO: push title onto this.songs
    }

    get length() {
        // TODO: return this.songs.length
    }
}

// ---------------------------------------------------------------------------
function check(label, condition) {
    console.log((condition ? "PASS" : "FAIL") + ": " + label);
}

const acc = new BankAccount("Ana", 100);
acc.deposit(50);
check("BankAccount deposit", acc.balance === 150);
const ok = acc.withdraw(30);
check("BankAccount withdraw success", ok === true && acc.balance === 120);
const ok2 = acc.withdraw(9999);
check("BankAccount withdraw insufficient funds", ok2 === false && acc.balance === 120);

const rect = new Rectangle(4, 5);
check("Rectangle area", rect.area() === 20);
check("Rectangle perimeter", rect.perimeter() === 18);
check("Rectangle isSquare false", rect.isSquare() === false);
const square = new Rectangle(3, 3);
check("Rectangle isSquare true", square.isSquare() === true);

const p1 = new Playlist();
const p2 = new Playlist();
p1.addSong("Song A");
check("Playlist instances have separate song lists", p2.length === 0);
check("Playlist length getter works", p1.length === 1);
