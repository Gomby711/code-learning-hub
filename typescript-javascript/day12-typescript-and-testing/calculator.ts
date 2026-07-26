// The module under test for Day 12. Read through it -- everything here is
// already implemented and type-annotated, so you can focus on writing tests
// (and, in the last two functions, seeing interfaces/generics used for real).

export function add(a: number, b: number): number {
    return a + b;
}

export function subtract(a: number, b: number): number {
    return a - b;
}

export function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error("cannot divide by zero");
    }
    return a / b;
}

export function average(numbers: number[]): number {
    if (numbers.length === 0) {
        throw new Error("cannot average an empty array");
    }
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

export interface Student {
    name: string;
    scores: number[];
}

export function studentAverage(student: Student): number {
    return average(student.scores);
}

export function firstElement<T>(array: T[]): T | undefined {
    return array[0];
}
