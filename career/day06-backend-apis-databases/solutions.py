"""Day 6 solutions -- a tiny in-memory CRUD "backend"."""

TASKS = {}
NEXT_ID = [1]


def create_task(text):
    task_id = NEXT_ID[0]
    NEXT_ID[0] += 1
    task = {"id": task_id, "text": text, "done": False}
    TASKS[task_id] = task
    return task


def list_tasks():
    return [TASKS[k] for k in sorted(TASKS)]


def get_task(task_id):
    return TASKS.get(task_id)


def update_task(task_id, **fields):
    task = TASKS.get(task_id)
    if task is None:
        return None
    task.update(fields)
    return task


def delete_task(task_id):
    if task_id in TASKS:
        del TASKS[task_id]
        return True
    return False
