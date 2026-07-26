// Day 7 mini project -- Node.js CLI Task Tracker.
// This is an OPTIONAL scaffold -- feel free to structure the program your own way.
//
// Usage:
//   node starter.js add "Buy milk"
//   node starter.js list
//   node starter.js done 1
//   node starter.js remove 1

const fs = require("fs");

const TASKS_FILE = "tasks.json";

function loadTasks() {
    // Return the array of tasks from TASKS_FILE, or [] if the file doesn't exist yet.
    // TODO: implement (try/catch around fs.readFileSync + JSON.parse)
}

function saveTasks(tasks) {
    // Write `tasks` to TASKS_FILE as JSON.
    // TODO: implement
}

function addTask(tasks, description) {
    // Push a new { description, done: false } onto tasks.
    // TODO: implement
}

function listTasks(tasks) {
    // Print each task as "1. [ ] Buy milk" or "2. [x] Walk dog"
    // TODO: implement
}

function completeTask(tasks, index) {
    // Mark the task at 1-based `index` as done. Print a clear error (don't
    // crash) if index is out of range.
    // TODO: implement
}

function removeTask(tasks, index) {
    // Remove the task at 1-based `index`. Print a clear error if out of range.
    // TODO: implement
}

function main() {
    const tasks = loadTasks();
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log("Usage: tasks.js [add|list|done|remove] ...");
        return;
    }

    const command = args[0];

    // TODO: implement the command dispatch:
    //   "add"    -> requires a description argument (args[1])
    //   "list"   -> no extra arguments
    //   "done"   -> requires an integer index argument (parse args[1])
    //   "remove" -> requires an integer index argument
    //   anything else -> print an "unrecognized command" message
    //
    // Remember to saveTasks(tasks) after any command that modifies data.
}

main();
