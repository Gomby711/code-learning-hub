"""
Generates:
  - one PDF per day, saved as <day-folder>/lesson.pdf, from that day's lesson.md
  - one combined PDF, html-css/full-course.pdf, with every lesson back to back in order

Run from anywhere:
    python build_all_pdfs.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from md_to_pdf import build_pdf_story, render_pdf

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TRACK_NAME = "Learn HTML & CSS"

DAYS = [
    ("day00-primer", "Day 0 - Before You Write Any Code: The Absolute Basics"),
    ("day01-html-basics", "Day 1 - HTML Basics: Document Structure, Common Elements, Attributes"),
    ("day02-forms-tables-semantic", "Day 2 - HTML Forms, Tables, and Semantic HTML5"),
    ("day03-css-basics", "Day 3 - CSS Basics: Selectors, the Cascade, Specificity, the Box Model"),
    ("day04-css-layout-fundamentals", "Day 4 - CSS Layout Fundamentals: Display, Position, Margin Collapsing"),
    ("day05-flexbox", "Day 5 - Flexbox"),
    ("day06-css-grid", "Day 6 - CSS Grid"),
    ("day07-mini-project", "Day 7 - Mini Project: Portfolio/Landing Page (Week 1 Review)"),
    ("day08-responsive-design", "Day 8 - Responsive Design: Media Queries, Units, Mobile-First"),
    ("day09-css-advanced", "Day 9 - CSS Advanced: Pseudo-classes, Transitions, Custom Properties"),
    ("day10-typography-color-accessibility", "Day 10 - Typography, Color, and Accessibility"),
    ("day11-css-architecture", "Day 11 - CSS Architecture: BEM, Organizing Stylesheets, Resets"),
    ("day12-forms-debugging", "Day 12 - Forms in Depth and Debugging with DevTools"),
    ("day13-practical-project-structure", "Day 13 - Practical: Project Structure, Git Workflow, Deployment"),
    ("day14-capstone", "Day 14 - Capstone: Multi-Page Responsive Website"),
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
