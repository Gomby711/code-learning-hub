"""
Day 4 exercise -- plan your own portfolio project.
Run this file directly: python exercises.py
Fill in YOUR real idea below -- this is graded loosely (did you actually fill it in
with something real and reasonably scoped), not against one fixed correct answer.
"""


def my_project_plan():
    """Return a dict describing your first portfolio project idea:
    {
        "one_sentence": "A command-line tool that ...",
        "must_have": ["feature 1", "feature 2", "feature 3"],   # 3-5 items
        "v2_ideas": ["deferred idea 1", "deferred idea 2"],       # 1+ items
    }
    """
    # TODO: implement with YOUR real idea, not placeholder text
    return {
        "one_sentence": "",
        "must_have": [],
        "v2_ideas": [],
    }


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    plan = my_project_plan()

    check("one_sentence is filled in (not empty, not a placeholder)",
          isinstance(plan.get("one_sentence"), str) and len(plan.get("one_sentence", "").strip()) >= 15)

    must_have = plan.get("must_have", [])
    check("must_have has 3-5 features (a real, finishable scope)",
          isinstance(must_have, list) and 3 <= len(must_have) <= 5 and all(isinstance(f, str) and f.strip() for f in must_have))

    v2 = plan.get("v2_ideas", [])
    check("v2_ideas has at least 1 deferred idea (proves you scoped something OUT)",
          isinstance(v2, list) and len(v2) >= 1 and all(isinstance(f, str) and f.strip() for f in v2))

    if all([
        isinstance(plan.get("one_sentence"), str) and len(plan.get("one_sentence", "").strip()) >= 15,
        isinstance(must_have, list) and 3 <= len(must_have) <= 5,
        isinstance(v2, list) and len(v2) >= 1,
    ]):
        print("\nYour plan:")
        print(f"  {plan['one_sentence']}")
        print(f"  Must-have: {', '.join(must_have)}")
        print(f"  Deferred to v2: {', '.join(v2)}")
        print("\nNow go build it. This file did its job the moment you wrote a real plan.")
