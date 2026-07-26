// Day 4 reference solutions.

function sumAll(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}

function greetWithDefault(name, greeting = "Hello") {
    return `${greeting}, ${name}!`;
}

function makeCounter() {
    let count = 0;
    return function () {
        count += 1;
        return count;
    };
}

function makeAdders(n) {
    const indices = [];
    for (let i = 0; i < n; i++) {
        indices.push(i);
    }
    return indices.map((i) => () => i);
}

const bandRoom = {
    name: "The Basement",
    instruments: ["guitar", "drums", "bass"],
    listInstruments: function () {
        return this.instruments.map((instrument) => `${this.name} has a ${instrument}`);
    },
};

module.exports = { sumAll, greetWithDefault, makeCounter, makeAdders, bandRoom };
