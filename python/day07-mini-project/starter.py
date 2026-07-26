"""Day 7 mini project -- CLI Task Tracker.
This is an OPTIONAL scaffold. Feel free to ignore it and structure the
program your own way -- the goal is your own design decisions.

Usage:
    python starter.py add "Buy milk"
    python starter.py list
    python starter.py done 1
    python starter.py remove 1
"""

import sys
import json

TASKS_FILE = "tasks.json"


def load_tasks():
    """Return the list of tasks from TASKS_FILE, or an empty list if the
    file doesn't exist yet."""
    # TODO: implement (use try/except around open(), or os.path.exists)
    pass


def save_tasks(tasks):
    """Write `tasks` (a list of dicts) to TASKS_FILE as JSON."""
    # TODO: implement
    pass


def add_task(tasks, description):
    """Append a new task {"description": description, "done": False}
    to `tasks` (mutates in place or returns a new list -- your call)."""
    # TODO: implement
    pass


def list_tasks(tasks):
    """Print each task as "1. [ ] Buy milk" or "2. [x] Walk dog"."""
    # TODO: implement
    pass


def complete_task(tasks, index):
    """Mark the task at 1-based `index` as done. Print a clear error
    message (don't crash) if index is out of range."""
    # TODO: implement
    pass


def remove_task(tasks, index):
    """Remove the task at 1-based `index`. Print a clear error message
    (don't crash) if index is out of range."""
    # TODO: implement
    pass


def main():
    tasks = load_tasks()
    args = sys.argv[1:]

    if not args:
        print("Usage: tasks.py [add|list|done|remove] ...")
        return

    command = args[0]

    # TODO: implement the command dispatch:
    #   "add"    -> requires a description argument
    #   "list"   -> no extra arguments
    #   "done"   -> requires an integer index argument
    #   "remove" -> requires an integer index argument
    #   anything else -> print an "unrecognized command" message
    #
    # Remember to save_tasks(tasks) after any command that modifies data.


if __name__ == "__main__":
    main()
