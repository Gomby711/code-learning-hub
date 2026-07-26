// Day 10 exercises -- Async JavaScript. Run: node exercises.js
// This file uses real timers, so it takes a couple of seconds to finish -- that's expected.

function delay(ms, value) {
    // Return a Promise that resolves with `value` after `ms` milliseconds.
    // Use `new Promise((resolve) => { setTimeout(() => resolve(value), ms); })`
    // TODO: implement
}

async function delayThenDouble(n) {
    // `await` a call to delay(100, n), then return double that value.
    // e.g. delayThenDouble(5) should eventually resolve to 10.
    // TODO: implement (must be an async function using await)
}

async function fetchAllInParallel(values) {
    // Given an array of numbers, e.g. [1, 2, 3], start a delay(50, n) for
    // EACH one at the same time (don't await them one at a time in a loop --
    // that would run sequentially!). Use Promise.all with .map() to start
    // them all together, then return the resolved array of values.
    // e.g. fetchAllInParallel([1, 2, 3]) -> [1, 2, 3] (after ~50ms total, not ~150ms)
    // TODO: implement
}

async function safeDelay(ms, shouldFail) {
    // If shouldFail is true, this should THROW an Error with message "failed on purpose".
    // Otherwise, it should await delay(ms, "success") and return that value.
    // Practice try/catch is NOT needed here -- just the throw/return logic;
    // the CALLER (in the checks below) will use try/catch.
    // TODO: implement
}

// ---------------------------------------------------------------------------
function check(label, condition) {
    console.log((condition ? "PASS" : "FAIL") + ": " + label);
}

async function checkAsync(label, asyncFn) {
    try {
        const result = await asyncFn();
        console.log((result ? "PASS" : "FAIL") + ": " + label);
    } catch (error) {
        console.log(`FAIL: ${label} (threw: ${error.message})`);
    }
}

async function main() {
    await checkAsync("delay resolves with the given value", async () => {
        const value = await delay(10, "hello");
        return value === "hello";
    });

    await checkAsync("delayThenDouble", async () => {
        const result = await delayThenDouble(5);
        return result === 10;
    });

    await checkAsync("fetchAllInParallel returns correct values", async () => {
        const result = await fetchAllInParallel([1, 2, 3]);
        return JSON.stringify(result) === JSON.stringify([1, 2, 3]);
    });

    await checkAsync("fetchAllInParallel actually runs in parallel (fast)", async () => {
        const start = Date.now();
        await fetchAllInParallel([1, 2, 3, 4, 5]); // 5 x 50ms -- sequentially this would be ~250ms
        const elapsed = Date.now() - start;
        return elapsed < 200; // should be close to 50ms if truly parallel
    });

    await checkAsync("safeDelay succeeds when shouldFail is false", async () => {
        const result = await safeDelay(10, false);
        return result === "success";
    });

    try {
        await safeDelay(10, true);
        check("safeDelay throws when shouldFail is true", false);
    } catch (error) {
        check("safeDelay throws when shouldFail is true", error.message === "failed on purpose");
    }
}

main();
