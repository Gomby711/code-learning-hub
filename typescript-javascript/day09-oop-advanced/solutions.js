// Day 9 reference solutions.

class Shape {
    constructor(name) {
        this.name = name;
    }

    area() {
        throw new Error("Subclasses must implement area()");
    }

    describe() {
        return `${this.name} has area ${this.area().toFixed(2)}`;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super("Circle");
        this.radius = radius;
    }

    area() {
        return 3.14159 * this.radius ** 2;
    }

    static fromDiameter(diameter) {
        return new Circle(diameter / 2);
    }
}

class Square extends Shape {
    constructor(side) {
        super("Square");
        this.side = side;
    }

    area() {
        return this.side ** 2;
    }
}

class Money {
    constructor(amount) {
        this.amount = amount;
    }

    add(other) {
        return new Money(this.amount + other.amount);
    }

    equals(other) {
        return this.amount === other.amount;
    }

    toString() {
        return `$${this.amount}`;
    }
}

module.exports = { Shape, Circle, Square, Money };
