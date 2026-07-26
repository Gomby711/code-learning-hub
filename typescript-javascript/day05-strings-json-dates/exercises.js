// Day 5 exercises -- Strings, Template Literals, JSON, Dates. Run: node exercises.js

function normalizeWhitespace(text) {
    // Collapse any run of whitespace into a single space, and trim leading/
    // trailing whitespace. e.g. "  hi   there  \n" -> "hi there"
    // Hint: text.trim().split(/\s+/).join(" ")  -- split(/\s+/) splits on
    // ANY run of whitespace (this is a regular expression -- don't worry
    // about the details, just use it as shown).
    // TODO: implement
}

function formatReport(name, score) {
    // Return a template literal string EXACTLY as:
    // "Ana scored 91.5%"
    // where score is rounded to 1 decimal place using .toFixed(1).
    // TODO: implement
}

function roundTripThroughJSON(data) {
    // Convert `data` to a JSON string with JSON.stringify, then immediately
    // parse it back with JSON.parse, and return the result.
    // TODO: implement
}

function getYearFromDate(dateObject) {
    // Return the 4-digit year from a Date object, using .getFullYear().
    // TODO: implement
}

function daysBetween(date1, date2) {
    // Return the number of days between date1 and date2 (assume date2 is
    // AFTER date1). Use .getTime() on each, subtract, then convert
    // milliseconds to days.
    // TODO: implement
}

// ---------------------------------------------------------------------------
function check(label, condition) {
    console.log((condition ? "PASS" : "FAIL") + ": " + label);
}

check("normalizeWhitespace", normalizeWhitespace("  hi   there  \n") === "hi there");

check("formatReport", formatReport("Ana", 91.5) === "Ana scored 91.5%");
check("formatReport rounds", formatReport("Bo", 80.04) === "Bo scored 80.0%");

const result = roundTripThroughJSON({ x: [1, 2, 3], y: "hello" });
check(
    "roundTripThroughJSON",
    JSON.stringify(result) === JSON.stringify({ x: [1, 2, 3], y: "hello" })
);

check("getYearFromDate", getYearFromDate(new Date(2026, 0, 15)) === 2026);

check("daysBetween", daysBetween(new Date(2026, 0, 1), new Date(2026, 0, 15)) === 14);
