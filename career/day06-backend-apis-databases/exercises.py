"""
Day 6 exercises -- a tiny in-memory CRUD "backend," in plain Python.
Run this file directly: python exercises.py

There's no real network or database here -- `TASKS` is your "database" (just a
dict of id -> task), and each function below mimics what a real HTTP handler for
that endpoint would do. This is the whole REST/CRUD shape, minus the framework.
"""

TASKS = {}         # id (int) -> {"id": int, "text": str, "done": bool}
NEXT_ID = [1]        # a mutable box so helper functions can bump it


def create_task(text):
    """Mimics: POST /api/tasks
    Create a new task with the given text, done=False, and a fresh id.
    Store it in TASKS, and return the created task dict.
    """
    # TODO: implement
    pass


def list_tasks():
    """Mimics: GET /api/tasks
    Return a list of all tasks currently in TASKS, in ascending id order.
    """
    # TODO: implement
    pass


def get_task(task_id):
    """Mimics: GET /api/tasks/<id>
    Return the task dict for task_id, or None if it doesn't exist (mimics a 404).
    """
    # TODO: implement
    pass


def update_task(task_id, **fields):
    """Mimics: PATCH /api/tasks/<id>
    Update the task with task_id using the given fields (e.g. done=True), and
    return the updated task. If the task doesn't exist, return None.
    """
    # TODO: implement
    pass


def delete_task(task_id):
    """Mimics: DELETE /api/tasks/<id>
    Remove the task with task_id from TASKS. Return True if something was
    deleted, False if that id didn't exist.
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    t1 = create_task("Buy milk")
    check("create_task returns a dict with text", t1 is not None and t1.get("text") == "Buy milk")
    check("create_task defaults done to False", t1 is not None and t1.get("done") is False)

    t2 = create_task("Walk dog")
    check("create_task gives each task a distinct id", t1 is not None and t2 is not None and t1["id"] != t2["id"])

    tasks = list_tasks()
    check("list_tasks returns both created tasks", len(tasks) == 2)

    fetched = get_task(t1["id"])
    check("get_task finds an existing task", fetched is not None and fetched["text"] == "Buy milk")
    check("get_task returns None for a missing id", get_task(9999) is None)

    updated = update_task(t1["id"], done=True)
    check("update_task applies the change", updated is not None and updated["done"] is True)
    check("update_task returns None for a missing id", update_task(9999, done=True) is None)

    check("delete_task removes an existing task", delete_task(t2["id"]) is True)
    check("delete_task returns False for a missing id", delete_task(9999) is False)
    check("deleted task is really gone", get_task(t2["id"]) is None)
    check("list_tasks reflects the deletion", len(list_tasks()) == 1)
