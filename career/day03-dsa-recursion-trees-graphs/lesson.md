# Day 3 — Data Structures & Algorithms, Part 2: Recursion, Trees, and Graphs

## Objectives
- Understand recursion well enough to write your own recursive functions with confidence, not just recognize them
- Understand trees as a data structure (not just a metaphor) and traverse one correctly
- Understand graphs, and the two standard ways to explore one: breadth-first and depth-first search
- Build a repeatable process for approaching a new, unfamiliar problem out loud in an interview

## Recursion — a function that calls itself, on a smaller version of the same problem

Every correct recursive function needs exactly two things: a **base case** (the smallest version of the problem,
answered directly, with no further recursive call) and a **recursive case** (the function calling itself on a
*smaller* piece of the problem, then combining that result into the current answer). Miss the base case, or
never actually shrink the problem, and you get infinite recursion — Python will eventually raise a
`RecursionError` rather than hang forever, but the bug is the same one that causes infinite loops elsewhere.

```python
def factorial(n):
    if n <= 1:            # base case -- the smallest version, answered directly
        return 1
    return n * factorial(n - 1)     # recursive case -- smaller problem, combined with n
```

The mental model that actually helps: **trust the recursive call to correctly solve the smaller problem, and
focus only on how to combine its result with the current step.** Trying to mentally trace every single nested
call by hand for anything non-trivial is slow and error-prone — instead, verify the base case is correct, verify
that each recursive call genuinely receives a smaller problem, and trust the rest.

```python
def sum_list(nums):
    if not nums:                 # base case -- an empty list sums to 0
        return 0
    return nums[0] + sum_list(nums[1:])    # trust sum_list to correctly sum "the rest"
```

### Recursion has a real cost: revisit `day10-iterators-generators-decorators`'s call-stack diagram

Every recursive call pushes a new frame onto the call stack (exactly the mechanism from the Python track's Day
12 and the JS track's Day 6) — Python's default limit is around 1000 frames deep, after which you get a
`RecursionError`. This is *why* some recursive solutions get rewritten as loops in performance-sensitive code,
and why some languages/runtimes optimize a specific pattern called "tail recursion" (Python deliberately does
not) — good to know exists, not something you need to solve today.

## Trees — a hierarchical structure, most easily represented as nested dicts/objects for practice

A tree is a structure where each node has some value and a set of "children" nodes, with exactly one node (the
"root") that has no parent, and no cycles (you can never follow child links back to an ancestor). Real examples
you already know: a file system (folders contain files and folders), an HTML page (elements contain elements —
this is *literally* the DOM, which you'll meet directly in the HTML/CSS track), a company's org chart.

```python
tree = {
    "value": 1,
    "children": [
        {"value": 2, "children": [
            {"value": 4, "children": []},
            {"value": 5, "children": []},
        ]},
        {"value": 3, "children": []},
    ],
}
```

**Traversal** means visiting every node exactly once, in some defined order. The two you'll use constantly:
```python
def depth_first_values(node):
    """Go as deep as possible down one branch before backtracking -- naturally recursive."""
    if node is None:
        return []
    values = [node["value"]]
    for child in node["children"]:
        values += depth_first_values(child)
    return values

def breadth_first_values(root):
    """Visit level by level, left to right -- needs an explicit queue, NOT naturally recursive."""
    values = []
    queue = [root]
    while queue:
        current = queue.pop(0)     # take from the FRONT -- this is what makes it breadth-first
        values.append(current["value"])
        queue += current["children"]
    return values
```
The single most important distinction between these two: depth-first naturally falls out of recursion (the call
stack *is* the mechanism tracking "where to backtrack to"); breadth-first needs you to manage an explicit queue
yourself, because the call stack doesn't give you level-by-level ordering for free.

## Graphs — trees without the "no cycles, one root" restriction

A graph is a more general structure: a set of nodes, and a set of edges connecting pairs of them, with no
restriction on cycles or a single root. A common, practical representation is an **adjacency list** — a dict
mapping each node to a list of the nodes it directly connects to:
```python
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A"],
    "D": ["B"],
}
```
Because graphs can have cycles, traversal needs a **visited set** to avoid looping forever — this is the one
real addition compared to tree traversal:
```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    if start in visited:
        return []
    visited.add(start)
    result = [start]
    for neighbor in graph[start]:
        result += dfs(graph, neighbor, visited)
    return result
```
Real, practical uses of graph traversal you'll recognize: "are these two users connected" (social networks),
"what's the shortest route" (maps), "does installing this package create a circular dependency" (build tools) —
this isn't abstract interview trivia, it's the same handful of operations underneath a lot of real software.

## The approach process, extended from Day 2

1. Restate the problem, clarify edge cases (empty input? a tree with one node? a graph with a cycle?).
2. Identify the shape: is there a natural "smaller version of the same problem" (recursion signal)? A
   hierarchy to walk (tree signal)? Connections between things where you need "can I reach X from Y" or
   "shortest path" (graph/BFS signal)?
3. Write the base case first, explicitly, before anything else.
4. Trust the recursive call for the smaller case — don't try to mentally unwind the whole tree of calls.
5. State the time complexity out loud: most tree/graph traversals that visit every node once are `O(n)` in the
   number of nodes — say so, and say why.

## Exercises

Open `exercises.py`. A couple of these will genuinely take longer than a "fill in one line" exercise — that's
correct and expected for recursion the first several times you write it yourself; work through it by hand on
paper for the smallest possible case before writing code, if you get stuck.
