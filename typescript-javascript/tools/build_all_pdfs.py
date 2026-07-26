"""
Generates:
  - one PDF per day, saved as <day-folder>/lesson.pdf, from that day's lesson.md
  - one combined PDF, typescript-javascript/full-course.pdf, with every lesson back to back

Run from anywhere:
    python build_all_pdfs.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from md_to_pdf import build_pdf_story, render_pdf

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TRACK_NAME = "Learn JavaScript & TypeScript"

DAYS = [
    ("day00-primer", "Day 0 - Before You Write Any Code: The Absolute Basics"),
    ("day01-basics", "Day 1 - Variables, Types, and Equality"),
    ("day02-control-flow", "Day 2 - Control Flow: Conditionals, Loops, Truthy/Falsy"),
    ("day03-data-structures", "Day 3 - Data Structures: Arrays and Objects, Destructuring, Spread/Rest"),
    ("day04-functions", "Day 4 - Functions: Declarations, Arrow Functions, Scope, Closures, this"),
    ("day05-strings-json-dates", "Day 5 - Strings, Template Literals, JSON, and Dates"),
    ("day06-errors-modules", "Day 6 - Errors, Modules, npm and Packages"),
    ("day07-mini-project", "Day 7 - Mini Project: Node.js CLI Task Tracker (Week 1 Review)"),
    ("day08-oop-fundamentals", "Day 8 - OOP Fundamentals: Classes, Constructors, Encapsulation"),
    ("day09-oop-advanced", "Day 9 - OOP Advanced: Inheritance, Prototypes, Static Members"),
    ("day10-async", "Day 10 - Asynchronous JavaScript: Callbacks, the Event Loop, Promises, async/await"),
    ("day11-real-data-and-typescript-intro", "Day 11 - Working With Real Data, and an Introduction to TypeScript"),
    ("day12-typescript-and-testing", "Day 12 - TypeScript Deep Dive + Testing with Jest"),
    ("day13-practical", "Day 13 - Practical: Project Structure, npm Scripts, Linting, Git Workflow"),
    ("day14-capstone", "Day 14 - Capstone Project: Expense Tracker (in TypeScript)"),
]


def main():
    combined_story = []

    for i, (folder, title) in enumerate(DAYS):
        md_path = os.path.join(ROOT, folder, "lesson.md")
        if not os.path.exists(md_path):
            print(f"SKIP (no lesson.md): {folder}")
            continue

        with open(md_path, encoding="utf-8") as f:
            text = f.read()

        day_story = build_pdf_story(text, day_title=title)
        day_pdf_path = os.path.join(ROOT, folder, "lesson.pdf")
        render_pdf(day_story, day_pdf_path, pdf_title=f"{TRACK_NAME} - {title}")
        print(f"Wrote {day_pdf_path}")

        combined_story.extend(build_pdf_story(text, day_title=title, start_with_page_break=(i > 0)))

    combined_pdf_path = os.path.join(ROOT, "full-course.pdf")
    render_pdf(combined_story, combined_pdf_path, pdf_title=f"{TRACK_NAME} - Full Course (All Lessons)")
    print(f"Wrote {combined_pdf_path}")


if __name__ == "__main__":
    main()
