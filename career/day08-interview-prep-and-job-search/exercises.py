"""
Day 8 exercise -- a self-assessment checklist for the concrete outputs of this track.
Run this file directly: python exercises.py
Fill in real, honest answers about YOUR own situation -- graded loosely, on whether
you've actually produced these things, not against one fixed correct answer.
"""


def my_readiness_check():
    """Return a dict describing where you actually are:
    {
        "has_git_repo_in_use": bool,     # a real repo you commit to regularly
        "deployed_project_url": str,       # a real, live URL -- or "" if not yet
        "star_story": {
            "situation": str, "task": str, "action": str, "result": str,
        },
    }
    """
    # TODO: implement with YOUR real, honest situation
    return {
        "has_git_repo_in_use": False,
        "deployed_project_url": "",
        "star_story": {"situation": "", "task": "", "action": "", "result": ""},
    }


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    r = my_readiness_check()

    check("using a real git repo for your work", r.get("has_git_repo_in_use") is True)

    url = r.get("deployed_project_url", "")
    check("have a deployed project with a real URL",
          isinstance(url, str) and url.strip().lower().startswith(("http://", "https://")))

    star = r.get("star_story", {})
    check("STAR story is filled in with real content",
          all(isinstance(star.get(k), str) and len(star.get(k, "").strip()) >= 10
              for k in ("situation", "task", "action", "result")))

    if (r.get("has_git_repo_in_use") is True
            and isinstance(url, str) and url.strip().lower().startswith(("http://", "https://"))
            and all(isinstance(star.get(k), str) and len(star.get(k, "").strip()) >= 10
                    for k in ("situation", "task", "action", "result"))):
        print("\nAll three checked off. That's not a metaphor -- those are the literal")
        print("starting materials for a job search: a real workflow, a live project,")
        print("and a rehearsed story. Go apply.")
