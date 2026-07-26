"""Day 7 reference solution -- CLI Task Tracker.
Build your own first (see starter.py) -- compare afterward.
"""

import sys
import json

TASKS_FILE = "tasks.json"


def load_tasks():
    try:
        with open(TASKS_FILE, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def save_tasks(tasks):
    with open(TASKS_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2)


def add_task(tasks, description):
    tasks.append({"description": description, "done": False})


def list_tasks(tasks):
    if not tasks:
        print("No tasks yet.")
        return
    for i, task in enumerate(tasks, start=1):
        marker = "x" if task["done"] else " "
        print(f"{i}. [{marker}] {task['description']}")


def complete_task(tasks, index):
    if not (1 <= index <= len(tasks)):
        print(f"Error: no task at index {index}.")
        return
    tasks[index - 1]["done"] = True


def remove_task(tasks, index):
    if not (1 <= index <= len(tasks)):
        print(f"Error: no task at index {index}.")
        return
    tasks.pop(index - 1)


def main():
    tasks = load_tasks()
    args = sys.argv[1:]

    if not args:
        print("Usage: tasks.py [add|list|done|remove] ...")
        return

    command = args[0]

    if command == "add":
        if len(args) < 2:
            print("Error: 'add' requires a description.")
            return
        add_task(tasks, args[1])
        save_tasks(tasks)
        print("Task added.")

    elif command == "list":
        list_tasks(tasks)

    elif command == "done":
        if len(args) < 2:
            print("Error: 'done' requires a task index.")
            return
        try:
            index = int(args[1])
        except ValueError:
            print(f"Error: '{args[1]}' is not a valid index.")
            return
        complete_task(tasks, index)
        save_tasks(tasks)

    elif command == "remove":
        if len(args) < 2:
            print("Error: 'remove' requires a task index.")
            return
        try:
            index = int(args[1])
        except ValueError:
            print(f"Error: '{args[1]}' is not a valid index.")
            return
        remove_task(tasks, index)
        save_tasks(tasks)

    else:
        print(f"Unrecognized command: '{command}'. Use add/list/done/remove.")


if __name__ == "__main__":
    main()
