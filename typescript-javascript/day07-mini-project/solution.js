// Day 7 reference solution -- Node.js CLI Task Tracker.
// Build your own first (see starter.js) -- compare afterward.

const fs = require("fs");

const TASKS_FILE = "tasks.json";

function loadTasks() {
    try {
        const contents = fs.readFileSync(TASKS_FILE, "utf-8");
        return JSON.parse(contents);
    } catch (error) {
        return [];
    }
}

function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function addTask(tasks, description) {
    tasks.push({ description, done: false });
}

function listTasks(tasks) {
    if (tasks.length === 0) {
        console.log("No tasks yet.");
        return;
    }
    tasks.forEach((task, i) => {
        const marker = task.done ? "x" : " ";
        console.log(`${i + 1}. [${marker}] ${task.description}`);
    });
}

function completeTask(tasks, index) {
    if (index < 1 || index > tasks.length) {
        console.log(`Error: no task at index ${index}.`);
        return;
    }
    tasks[index - 1].done = true;
}

function removeTask(tasks, index) {
    if (index < 1 || index > tasks.length) {
        console.log(`Error: no task at index ${index}.`);
        return;
    }
    tasks.splice(index - 1, 1);
}

function main() {
    const tasks = loadTasks();
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log("Usage: tasks.js [add|list|done|remove] ...");
        return;
    }

    const command = args[0];

    if (command === "add") {
        if (args.length < 2) {
            console.log("Error: 'add' requires a description.");
            return;
        }
        addTask(tasks, args[1]);
        saveTasks(tasks);
        console.log("Task added.");
    } else if (command === "list") {
        listTasks(tasks);
    } else if (command === "done") {
        if (args.length < 2) {
            console.log("Error: 'done' requires a task index.");
            return;
        }
        const index = parseInt(args[1], 10);
        if (Number.isNaN(index)) {
            console.log(`Error: '${args[1]}' is not a valid index.`);
            return;
        }
        completeTask(tasks, index);
        saveTasks(tasks);
    } else if (command === "remove") {
        if (args.length < 2) {
            console.log("Error: 'remove' requires a task index.");
            return;
        }
        const index = parseInt(args[1], 10);
        if (Number.isNaN(index)) {
            console.log(`Error: '${args[1]}' is not a valid index.`);
            return;
        }
        removeTask(tasks, index);
        saveTasks(tasks);
    } else {
        console.log(`Unrecognized command: '${command}'. Use add/list/done/remove.`);
    }
}

main();
