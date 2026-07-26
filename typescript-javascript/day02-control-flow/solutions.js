// Day 2 reference solutions.

function classifyNumber(n) {
    if (n < 0) {
        return "negative";
    } else if (n === 0) {
        return "zero";
    } else {
        return "positive";
    }
}

function fizzbuzz(n) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) {
            result.push("FizzBuzz");
        } else if (i % 3 === 0) {
            result.push("Fizz");
        } else if (i % 5 === 0) {
            result.push("Buzz");
        } else {
            result.push(String(i));
        }
    }
    return result;
}

function sumUntilNegative(numbers) {
    let total = 0;
    for (const n of numbers) {
        if (n < 0) {
            break;
        }
        total += n;
    }
    return total;
}

function describeShape(shape) {
    switch (shape.type) {
        case "circle":
            return `circle with radius ${shape.radius}`;
        case "rectangle":
            return `rectangle ${shape.width}x${shape.height}`;
        case "square":
            return `square with side ${shape.side}`;
        default:
            return "unknown shape";
    }
}

function countVowels(word) {
    const vowels = "aeiou";
    let count = 0;
    for (const character of word) {
        if (vowels.includes(character)) {
            count++;
        }
    }
    return count;
}

module.exports = { classifyNumber, fizzbuzz, sumUntilNegative, describeShape, countVowels };
