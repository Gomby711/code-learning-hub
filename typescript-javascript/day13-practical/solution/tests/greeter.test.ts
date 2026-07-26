import { greet } from "../src/greeter";

test("greet", () => {
    expect(greet("Ana")).toBe("Hello, Ana!");
});
