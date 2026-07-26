"""
Day 3 exercises -- Recursion, Trees, and Graphs.
Run this file directly: python exercises.py
"""


def factorial(n):
    """Return n! (n factorial) using RECURSION, not a loop.
    factorial(0) == 1, factorial(5) == 120.
    """
    # TODO: implement
    pass


def fibonacci(n):
    """Return the n-th Fibonacci number (0-indexed: fib(0)=0, fib(1)=1, fib(2)=1,
    fib(3)=2, fib(4)=3, fib(5)=5) using recursion.
    """
    # TODO: implement
    pass


def tree_sum(node):
    """Given a tree node shaped like {"value": int, "children": [...]},
    return the sum of every value in the tree. An empty tree (None) sums to 0.
    """
    # TODO: implement
    pass


def tree_max_depth(node):
    """Return the depth of the tree (a single node with no children has depth 1;
    None/empty has depth 0).
    """
    # TODO: implement
    pass


def has_path(graph, start, end, visited=None):
    """Given an adjacency-list graph (dict of node -> list of neighbors), return
    True if there's ANY path from start to end (they may be the same node).
    Use depth-first search with a visited set to avoid infinite loops on cycles.
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
# Checks -- do not need to edit below this line
# ---------------------------------------------------------------------------

def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    check("factorial(0)", factorial(0) == 1)
    check("factorial(5)", factorial(5) == 120)

    check("fibonacci(0)", fibonacci(0) == 0)
    check("fibonacci(5)", fibonacci(5) == 5)
    check("fibonacci(7)", fibonacci(7) == 13)

    sample_tree = {
        "value": 1,
        "children": [
            {"value": 2, "children": [
                {"value": 4, "children": []},
                {"value": 5, "children": []},
            ]},
            {"value": 3, "children": []},
        ],
    }
    check("tree_sum", tree_sum(sample_tree) == 15)
    check("tree_sum empty", tree_sum(None) == 0)
    check("tree_max_depth", tree_max_depth(sample_tree) == 3)
    check("tree_max_depth empty", tree_max_depth(None) == 0)

    sample_graph = {
        "A": ["B", "C"],
        "B": ["A", "D"],
        "C": ["A"],
        "D": ["B"],
        "E": [],
    }
    check("has_path direct", has_path(sample_graph, "A", "B") is True)
    check("has_path indirect", has_path(sample_graph, "A", "D") is True)
    check("has_path unreachable", has_path(sample_graph, "A", "E") is False)
    check("has_path with cycle doesn't hang", has_path(sample_graph, "B", "C") is True)
