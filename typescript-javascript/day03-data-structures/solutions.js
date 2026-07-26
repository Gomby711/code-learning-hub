// Day 3 reference solutions.

function doubleEvens(numbers) {
    return numbers.filter((n) => n % 2 === 0).map((n) => n * 2);
}

function sumArray(numbers) {
    return numbers.reduce((sum, n) => sum + n, 0);
}

function wordLengths(words) {
    const result = {};
    for (const word of words) {
        result[word] = word.length;
    }
    return result;
}

function mergeWithDefaults(overrides) {
    const defaults = { theme: "light", fontSize: 14, notifications: true };
    return { ...defaults, ...overrides };
}

function firstAndRest(items) {
    const [first, ...rest] = items;
    return [first, rest.length];
}

function getPersonSummary(person) {
    const { name, age, city = "Unknown" } = person;
    return `${name} (${age}) - ${city}`;
}

module.exports = { doubleEvens, sumArray, wordLengths, mergeWithDefaults, firstAndRest, getPersonSummary };
