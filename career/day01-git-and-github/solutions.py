"""Day 1 solutions -- Git & GitHub scenarios."""


def start_tracking_a_new_project():
    return "git init"


def see_whats_changed():
    return "git status"


def stage_and_commit_everything(message):
    return f'git add . && git commit -m "{message}"'


def create_and_switch_to_branch(branch_name):
    return f"git switch -c {branch_name}"


def push_new_branch_first_time(branch_name):
    return f"git push -u origin {branch_name}"


def undo_unstaged_changes_to_file(filename):
    return f"git restore {filename}"
