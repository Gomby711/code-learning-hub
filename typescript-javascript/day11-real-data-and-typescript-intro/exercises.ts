// Day 11 exercises -- Real Data + TypeScript Intro.
// Compile: npx tsc exercises.ts   (run this from inside this folder)
// Run:     node exercises.js

function add(a: number, b: number): number {
    // TODO: implement -- add type annotations are already done for you above,
    // just implement the logic.
    return 0;
}

function greet(person: { name: string; age: number }): string {
    // Return `${person.name} is ${person.age}`
    // TODO: implement
    return "";
}

function sumArray(numbers: number[]): number {
    // Return the sum of all numbers in the array.
    // TODO: implement
    return 0;
}

async function safeFetchJSON(url: string): Promise<any> {
    // Use fetch(url), check response.ok, and return response.json() if ok.
    // If the response is not ok, OR if fetch itself throws (network error),
    // return null instead of throwing.
    // Notice the return type: Promise<any> -- this function is async, so it
    // always returns a Promise; <any> here is a deliberate simplification
    // since we don't know the exact shape of arbitrary JSON in advance.
    // TODO: implement with try/catch
    return null;
}

// ---------------------------------------------------------------------------
function check(label: string, condition: boolean): void {
    console.log((condition ? "PASS" : "FAIL") + ": " + label);
}

async function checkAsync(label: string, asyncFn: () => Promise<boolean>): Promise<void> {
    try {
        const result = await asyncFn();
        console.log((result ? "PASS" : "FAIL") + ": " + label);
    } catch (error: any) {
        console.log(`FAIL: ${label} (threw: ${error.message})`);
    }
}

async function main() {
    check("add", add(2, 3) === 5);
    check("greet", greet({ name: "Ana", age: 30 }) === "Ana is 30");
    check("sumArray", sumArray([1, 2, 3, 4]) === 10);

    await checkAsync("safeFetchJSON handles a bad URL gracefully (no crash)", async () => {
        const result = await safeFetchJSON("https://this-domain-does-not-exist-12345.invalid/data");
        return result === null;
    });
}

main();
