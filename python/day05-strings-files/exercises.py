"""Day 5 exercises — Strings, Files, Context Managers. Run: python exercises.py
This creates and deletes a few temp files in the current folder while running.
"""

import os


def normalize_whitespace(text):
    """Collapse any run of whitespace into a single space, and strip leading/
    trailing whitespace. e.g. "  hi   there  \n" -> "hi there"
    Hint: text.split() with no args + " ".join(...)
    """
    # TODO: implement
    pass


def parse_csv_line(line):
    """Given a single comma-separated line like "Ana,91.5,pass", return a
    list [str, float, str] -- i.e. split on comma and convert the 2nd field
    to float. Strip whitespace from each field first.
    """
    # TODO: implement
    pass


def format_report(name, score):
    """Return a string formatted EXACTLY as:
    "Ana       :  91.5%"
    i.e. name left-aligned padded to width 10, then ": ", then score with
    exactly 1 decimal place, then "%".
    Use an f-string with format specs -- don't hand-pad with string math.
    """
    # TODO: implement
    pass


def write_lines_to_file(path, lines):
    """Write each string in `lines` to a new line in the file at `path`,
    using `with` so the file is guaranteed to close. Overwrite any existing
    content (don't append).
    """
    # TODO: implement
    pass


def read_nonempty_lines(path):
    """Read the file at `path` and return a list of its lines with
    whitespace stripped, EXCLUDING any lines that are empty after stripping.
    Use `with` and iterate the file object directly (don't use readlines()).
    """
    # TODO: implement
    pass


# ---------------------------------------------------------------------------
def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    check("normalize_whitespace", normalize_whitespace("  hi   there  \n") == "hi there")

    parsed = parse_csv_line("Ana, 91.5 ,pass")
    check("parse_csv_line", parsed == ["Ana", 91.5, "pass"] if parsed else False)

    check("format_report", format_report("Ana", 91.5) == "Ana       :  91.5%")

    test_path = "day05_temp_test.txt"
    write_lines_to_file(test_path, ["first", "", "  ", "second", "third"])
    result = read_nonempty_lines(test_path)
    check("write_lines_to_file + read_nonempty_lines round trip",
          result == ["first", "second", "third"])

    if os.path.exists(test_path):
        os.remove(test_path)
