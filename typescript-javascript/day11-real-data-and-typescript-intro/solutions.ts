// Day 11 reference solutions.

function add(a: number, b: number): number {
    return a + b;
}

function greet(person: { name: string; age: number }): string {
    return `${person.name} is ${person.age}`;
}

function sumArray(numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0);
}

async function safeFetchJSON(url: string): Promise<any> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

export { add, greet, sumArray, safeFetchJSON };
