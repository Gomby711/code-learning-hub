"""Day 2 solutions -- Arrays & Hashing."""


def has_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False


def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return None


def most_frequent_char(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    best_char, best_count = None, -1
    for ch in s:
        if counts[ch] > best_count:
            best_char, best_count = ch, counts[ch]
    return best_char


def is_anagram(s1, s2):
    if len(s1) != len(s2):
        return False
    counts = {}
    for ch in s1:
        counts[ch] = counts.get(ch, 0) + 1
    for ch in s2:
        if ch not in counts:
            return False
        counts[ch] -= 1
        if counts[ch] == 0:
            del counts[ch]
    return not counts


def max_sum_of_k_consecutive(nums, k):
    window_sum = sum(nums[:k])
    best = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        best = max(best, window_sum)
    return best
