"""Day 5 reference solutions."""


def normalize_whitespace(text):
    return " ".join(text.split())


def parse_csv_line(line):
    parts = [p.strip() for p in line.split(",")]
    return [parts[0], float(parts[1]), parts[2]]


def format_report(name, score):
    return f"{name:<10}: {score:>5.1f}%"


def write_lines_to_file(path, lines):
    with open(path, "w", encoding="utf-8") as f:
        for line in lines:
            f.write(line + "\n")


def read_nonempty_lines(path):
    result = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            stripped = line.strip()
            if stripped:
                result.append(stripped)
    return result
