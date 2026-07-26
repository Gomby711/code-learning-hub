"""
Generates:
  - one PDF per day, saved as <day-folder>/lesson.pdf, from that day's lesson.md
  - one combined PDF, python/full-course.pdf, with every lesson back to back in order

Run from anywhere:
    python build_all_pdfs.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from md_to_pdf import build_pdf_story, render_pdf

PYTHON_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TRACK_NAME = "Learn Python"

DAYS = [
    ("day00-primer", "Day 0 - Before You Write Any Code: The Absolute Basics"),
    ("day01-basics", "Day 1 - Variables, Types, and the Object Model"),
    ("day02-control-flow", "Day 2 - Control Flow: Conditionals, Loops, Comprehensions"),
    ("day03-data-structures", "Day 3 - Data Structures: Lists, Tuples, Dicts, Sets"),
    ("day04-functions", "Day 4 - Functions: Args, Scope, Closures, First-Class Functions"),
    ("day05-strings-files", "Day 5 - Strings, Formatting, Files, and Context Managers"),
    ("day06-errors-modules", "Day 6 - Errors, Exceptions, Modules, and Packages"),
    ("day07-mini-project", "Day 7 - Mini Project: CLI Task Tracker (Week 1 Review)"),
    ("day08-oop-fundamentals", "Day 8 - OOP Fundamentals: Classes, self, Instances"),
    ("day09-oop-advanced", "Day 9 - OOP Advanced: Inheritance, Dunder Methods, Composition"),
    ("day10-iterators-generators-decorators", "Day 10 - Iterators, Generators, and Decorators"),
    ("day11-real-data", "Day 11 - Working With Real Data: JSON, CSV, HTTP APIs, Virtual Environments"),
    ("day12-testing-debugging", "Day 12 - Testing and Debugging: pytest, Type Hints"),
    ("day13-practical-python", "Day 13 - Practical Python: Project Structure, Packaging, Git Workflow"),
    ("day14-capstone", "Day 14 - Capstone Project: Expense Tracker"),
]


def main():
    combined_story = []

    for i, (folder, title) in enumerate(DAYS):
        md_path = os.path.join(PYTHON_ROOT, folder, "lesson.md")
        if not os.path.exists(md_path):
            print(f"SKIP (no lesson.md): {folder}")
            continue

        with open(md_path, encoding="utf-8") as f:
            text = f.read()

        # Per-day PDF
        day_story = build_pdf_story(text, day_title=title)
        day_pdf_path = os.path.join(PYTHON_ROOT, folder, "lesson.pdf")
        render_pdf(day_story, day_pdf_path, pdf_title=f"{TRACK_NAME} - {title}")
        print(f"Wrote {day_pdf_path}")

        # Append into the combined story (page break before every day except the first)
        combined_story.extend(build_pdf_story(text, day_title=title, start_with_page_break=(i > 0)))

    combined_pdf_path = os.path.join(PYTHON_ROOT, "full-course.pdf")
    render_pdf(combined_story, combined_pdf_path, pdf_title=f"{TRACK_NAME} - Full Course (All Lessons)")
    print(f"Wrote {combined_pdf_path}")


if __name__ == "__main__":
    main()
