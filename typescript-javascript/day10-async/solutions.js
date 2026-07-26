// Day 10 reference solutions.

function delay(ms, value) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), ms);
    });
}

async function delayThenDouble(n) {
    const value = await delay(100, n);
    return value * 2;
}

async function fetchAllInParallel(values) {
    return Promise.all(values.map((n) => delay(50, n)));
}

async function safeDelay(ms, shouldFail) {
    if (shouldFail) {
        throw new Error("failed on purpose");
    }
    return delay(ms, "success");
}

module.exports = { delay, delayThenDouble, fetchAllInParallel, safeDelay };
