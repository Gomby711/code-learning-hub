"""Day 3 solutions -- Recursion, Trees, and Graphs."""


def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)


def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


def tree_sum(node):
    if node is None:
        return 0
    total = node["value"]
    for child in node["children"]:
        total += tree_sum(child)
    return total


def tree_max_depth(node):
    if node is None:
        return 0
    if not node["children"]:
        return 1
    return 1 + max(tree_max_depth(child) for child in node["children"])


def has_path(graph, start, end, visited=None):
    if visited is None:
        visited = set()
    if start == end:
        return True
    if start in visited:
        return False
    visited.add(start)
    for neighbor in graph[start]:
        if has_path(graph, neighbor, end, visited):
            return True
    return False
