"""
Day 1 exercises -- Git & GitHub scenarios.
Run this file directly: python exercises.py
Each function returns the git command (as a string) you'd run for the situation described.
Answers are checked loosely -- reasonable equivalent commands (e.g. `git switch -c x` vs
`git checkout -b x`) both pass, since both are correct in real usage.
"""


def start_tracking_a_new_project():
    """You just created a new project folder and want Git to start tracking it.
    Return the single command that turns the current folder into a Git repository.
    """
    # TODO: implement
    return ""


def see_whats_changed():
    """You've edited some files and want to see which ones changed before committing.
    Return the command that shows this.
    """
    # TODO: implement
    return ""


def stage_and_commit_everything(message):
    """Return the TWO commands, joined by ' && ', that stage every changed file
    and commit them with the given message.
    Example shape: "git add . && git commit -m \\"message\\""
    """
    # TODO: implement
    return ""


def create_and_switch_to_branch(branch_name):
    """Return the single command that creates a new branch with the given name
    AND switches to it in one step.
    """
    # TODO: implement
    return ""


def push_new_branch_first_time(branch_name):
    """You're pushing a brand-new local branch to GitHub for the first time, and want
    Git to remember this branch's remote so future plain `git push` works.
    Return that command.
    """
    # TODO: implement
    return ""


def undo_unstaged_changes_to_file(filename):
    """You edited a file, haven't staged it yet, and want to throw away your edits,
    reverting the file back to its last committed version.
    Return that command.
    """
    # TODO: implement
    return ""


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def norm(s):
    return " ".join(s.strip().lower().split())


def any_match(actual, options):
    a = norm(actual)
    return any(a == norm(o) for o in options)


def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    check("start_tracking_a_new_project",
          any_match(start_tracking_a_new_project(), ["git init"]))

    check("see_whats_changed",
          any_match(see_whats_changed(), ["git status"]))

    check("stage_and_commit_everything",
          any_match(stage_and_commit_everything("add login form"),
                     ['git add . && git commit -m "add login form"']))

    check("create_and_switch_to_branch",
          any_match(create_and_switch_to_branch("add-login-page"),
                     ["git switch -c add-login-page", "git checkout -b add-login-page"]))

    check("push_new_branch_first_time",
          any_match(push_new_branch_first_time("add-login-page"),
                     ["git push -u origin add-login-page", "git push --set-upstream origin add-login-page"]))

    check("undo_unstaged_changes_to_file",
          any_match(undo_unstaged_changes_to_file("app.py"),
                     ["git checkout -- app.py", "git restore app.py"]))
