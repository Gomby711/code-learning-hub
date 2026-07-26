// Day 5 reference solutions.

function normalizeWhitespace(text) {
    return text.trim().split(/\s+/).join(" ");
}

function formatReport(name, score) {
    return `${name} scored ${score.toFixed(1)}%`;
}

function roundTripThroughJSON(data) {
    return JSON.parse(JSON.stringify(data));
}

function getYearFromDate(dateObject) {
    return dateObject.getFullYear();
}

function daysBetween(date1, date2) {
    const millisecondsBetween = date2.getTime() - date1.getTime();
    return millisecondsBetween / (1000 * 60 * 60 * 24);
}

module.exports = { normalizeWhitespace, formatReport, roundTripThroughJSON, getYearFromDate, daysBetween };
