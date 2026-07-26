// Day 9 exercises -- OOP Advanced. Run: node exercises.js

class Shape {
    constructor(name) {
        // TODO: store name as this.name
    }

    area() {
        // TODO: throw new Error("Subclasses must implement area()")
    }

    describe() {
        // TODO: return `${this.name} has area ${this.area().toFixed(2)}`
        // (this method should NOT need to change in any subclass)
    }
}

class Circle extends Shape {
    constructor(radius) {
        super("Circle");   // already provided -- a derived class MUST call super() before using `this`
        // TODO: store this.radius = radius
    }

    area() {
        // TODO: return 3.14159 * this.radius ** 2
    }

    static fromDiameter(diameter) {
        // TODO: return new Circle(diameter / 2)
    }
}

class Square extends Shape {
    constructor(side) {
        super("Square");   // already provided -- a derived class MUST call super() before using `this`
        // TODO: store this.side = side
    }

    area() {
        // TODO: return this.side ** 2
    }
}

class Money {
    constructor(amount) {
        // TODO: store this.amount = amount
    }

    add(other) {
        // TODO: return a NEW Money with amounts summed (do not mutate this one)
    }

    equals(other) {
        // TODO: return true if this.amount === other.amount
    }

    toString() {
        // TODO: return `$${this.amount}`
    }
}

// ---------------------------------------------------------------------------
// check() runs `fn` and reports PASS/FAIL -- wrapped in try/catch so that an
// incomplete TODO (which might throw, e.g. calling .toFixed() on undefined)
// reports as a clean FAIL instead of crashing the whole script.
function check(label, fn) {
    try {
        const result = fn();
        console.log((result ? "PASS" : "FAIL") + ": " + label);
    } catch (error) {
        console.log(`FAIL: ${label} (threw: ${error.message})`);
    }
}

const shapes = [new Circle(2), new Square(3)];
check("Circle instanceof Shape (polymorphism)", () => shapes[0] instanceof Shape);
check("Circle area", () => Math.abs(shapes[0].area() - 12.56636) < 0.001);
check("Square area", () => shapes[1].area() === 9);
check("describe works without override", () => shapes[0].describe().startsWith("Circle has area"));

check("Circle.fromDiameter static factory", () => {
    const fromDiam = Circle.fromDiameter(10);
    return fromDiam instanceof Circle && fromDiam.radius === 5;
});

const m1 = new Money(10);
const m3 = new Money(5);
check("Money add returns new Money", () => {
    const sum = m1.add(m3);
    return sum instanceof Money && sum.amount === 15;
});
check("Money original unchanged", () => m1.amount === 10);
check("Money equals", () => new Money(10).equals(m1));
check("Money toString", () => m1.toString() === "$10");
