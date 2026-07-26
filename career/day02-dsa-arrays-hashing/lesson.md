# Day 2 — Data Structures & Algorithms, Part 1: Big-O, Arrays, and Hashing

## Objectives
- Understand Big-O notation well enough to look at a piece of code and state its time complexity
- Recognize the "have I seen this before / do I need fast lookups" signal that means "use a hash map"
- Solve the handful of array/hashing patterns that cover a large fraction of "easy" and "medium" interview
  questions: two-pointer, sliding window, and hash-map frequency counting

## Why this day exists, separately from "knowing Python/JS"

Being able to write correct code and being able to solve an *unfamiliar* problem efficiently, under time
pressure, in an interview are different skills. Interviewers at most companies (not all, but most, especially
larger ones) ask questions from a fairly small, well-known set of patterns — not because they expect you to have
memorized the specific answer, but because your approach to a *new* problem reveals whether you actually
understand the underlying tools (arrays, hash maps, sorting, recursion) or were just pattern-matching syntax.
The good news: because the patterns really are a small, well-known set, deliberate practice on them transfers
directly, and gets noticeably easier after roughly 15-30 solved problems.

## Big-O notation — how "fast" actually gets measured

Big-O describes how the *amount of work* a piece of code does grows as its input grows, ignoring constant
factors and lower-order terms — it answers "if I double the input size, roughly what happens to the runtime?"
not "how many milliseconds does this take on my machine" (which depends on hardware and isn't a property of the
algorithm itself).

| Notation | Name | What it means, concretely | Example |
|---|---|---|---|
| `O(1)` | constant | Same amount of work regardless of input size | Looking up a value by key in a hash map |
| `O(log n)` | logarithmic | Work grows very slowly — doubling input adds only ONE more step | Binary search on a sorted list |
| `O(n)` | linear | Work grows directly proportional to input size | A single loop over every item once |
| `O(n log n)` | linearithmic | Slightly worse than linear | Most efficient general-purpose sorting algorithms |
| `O(n²)` | quadratic | Work grows with the SQUARE of input size | A loop nested inside another loop, both over the input |

The practical habit to build: whenever you write a loop, ask "does this loop's body do more looping inside it,
over the same or related data?" A loop inside a loop over `n` items is almost always `O(n²)` — fine for small
inputs, a real problem once `n` reaches the thousands or millions, and one of the most common things an
interviewer is listening for when they ask "can you make this faster?"

```python
def has_duplicate_slow(nums):        # O(n^2) -- a loop nested inside a loop
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False

def has_duplicate_fast(nums):        # O(n) -- one loop, plus a hash set for O(1) lookups
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False
```
Both functions return the same answer. The second is the one that passes an interview — and, not
coincidentally, the one that would still run fast on a million-item list instead of taking hours.

## The hash map / hash set — your single most powerful interview tool

A hash map (Python `dict`, JS `Map`/plain object) and hash set (Python `set`, JS `Set`) give you `O(1)` average-
case lookup, insert, and delete — "does this exist already?" and "what value is paired with this key?" become
essentially free, regardless of how much data is in there. An enormous fraction of "make it faster" interview
answers are some version of "trade a small amount of extra memory for a hash map, to turn a nested loop into a
single pass." The pattern to recognize: **any time you're asking "have I seen this value before?" or "what's
paired with this?" inside a loop, that's a hash map/set signal.**

```python
def two_sum(nums, target):
    """Classic example: for each number, check if 'the number that would complete
    the target' has already been seen -- one pass, O(n), using a dict as memory."""
    seen = {}   # maps value -> its index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return None
```

## Two pointers — for sorted or ordered data

When data is sorted (or you can sort it), two pointers starting at opposite ends and moving inward often replace
a nested loop with a single linear pass:
```python
def has_pair_with_sum(sorted_nums, target):
    left, right = 0, len(sorted_nums) - 1
    while left < right:
        current = sorted_nums[left] + sorted_nums[right]
        if current == target:
            return True
        elif current < target:
            left += 1     # sum too small -- need a bigger number, move left pointer up
        else:
            right -= 1     # sum too big -- need a smaller number, move right pointer down
    return False
```

## Sliding window — for "best contiguous subsequence" problems

When a problem asks about a contiguous run of elements (a subarray, a substring) and you'd otherwise re-scan
overlapping sections repeatedly, a sliding window keeps a running result and adjusts its edges incrementally
instead of restarting from scratch:
```python
def max_sum_of_k_consecutive(nums, k):
    window_sum = sum(nums[:k])
    best = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]    # add the new right edge, drop the old left edge
        best = max(best, window_sum)
    return best
```
Notice what *didn't* happen: no re-summing the whole window from scratch each time — that would silently make
this `O(n*k)` instead of `O(n)`.

## How to approach an unfamiliar problem in an interview (a repeatable process)

1. **Restate the problem in your own words** out loud, and clarify anything ambiguous (can the input be empty?
   are there duplicates? negative numbers?). This alone signals a lot to an interviewer.
2. **Start with the brute-force answer**, even if it's slow — say so explicitly ("the simple way is a nested
   loop, which is O(n²); let's see if we can do better"). A correct slow answer beats a broken fast one.
3. **Ask: is there repeated lookup work I could cache?** (hash map signal) **Is the data sorted, or could I sort
   it?** (two-pointer signal) **Am I looking at a contiguous run?** (sliding window signal)
4. **Trace through a small example by hand** before writing the final code — catches off-by-one errors before
   they cost you time.
5. **State the final time and space complexity** out loud, unprompted — interviewers consistently rate this
   highly, and it's an easy, learnable habit independent of how hard the problem was.

## Exercises

Open `exercises.py`. Implement each function, run `python exercises.py`, and for each one, before you even open
`solutions.py`, say out loud (or write down) its time complexity — that habit is the actual point of today, more
than getting each answer correct on the first try.
