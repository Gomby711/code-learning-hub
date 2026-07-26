"""Day 1 reference solutions. Try exercises.py first."""


def swap_without_temp(a, b):
    return b, a


def are_same_object(list_a, list_b):
    return list_a is list_b


def safe_copy_and_append(original_list, value):
    copy = original_list.copy()  # or list(original_list), or original_list[:]
    copy.append(value)
    return copy


def describe_type(value):
    return type(value).__name__


def is_truthy(value):
    return bool(value)


def mutate_vs_reassign_demo():
    original = [1, 2, 3]

    def append_in_place(lst):
        lst.append(4)

    def reassign_locally(lst):
        lst = [9, 9, 9]

    append_in_place(original)
    print("After append_in_place:", original)  # [1, 2, 3, 4]

    reassign_locally(original)
    print("After reassign_locally:", original)  # [1, 2, 3, 4] -- unchanged


if __name__ == "__main__":
    mutate_vs_reassign_demo()
