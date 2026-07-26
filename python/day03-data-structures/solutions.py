"""Day 3 reference solutions."""

from collections import defaultdict


def reverse_every_other(items):
    return items[::-2]


def word_count(words):
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts


def group_by_first_letter(words):
    groups = defaultdict(list)
    for word in words:
        groups[word[0]].append(word)
    return dict(groups)


def common_elements(list1, list2):
    return set(list1) & set(list2)


def safe_lookup(d, key, default):
    return d.get(key, default)


def swap_keys_and_values(d):
    return {value: key for key, value in d.items()}
