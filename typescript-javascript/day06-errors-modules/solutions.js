// Day 6 reference solutions.

class NegativeAmountError extends Error {
    constructor(message) {
        super(message);
        this.name = "NegativeAmountError";
    }
}

class InsufficientFundsError extends Error {
    constructor(message) {
        super(message);
        this.name = "InsufficientFundsError";
    }
}

function safeDivide(a, b) {
    if (b === 0) {
        return null;
    }
    return a / b;
}

function parseIntOrDefault(value, defaultValue = 0) {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        return defaultValue;
    }
    return parsed;
}

function withdraw(balance, amount) {
    if (amount < 0) {
        throw new NegativeAmountError(`amount cannot be negative: ${amount}`);
    }
    if (amount > balance) {
        throw new InsufficientFundsError(`need ${amount}, have ${balance}`);
    }
    return balance - amount;
}

module.exports = { NegativeAmountError, InsufficientFundsError, safeDivide, parseIntOrDefault, withdraw };
