from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, ListFlowable, ListItem
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

OUT_PATH = r"D:\Git\learning-code\python\syllabus.pdf"

styles = getSampleStyleSheet()
title_style = ParagraphStyle("TitleBig", parent=styles["Title"], fontSize=24, spaceAfter=6)
subtitle_style = ParagraphStyle("Subtitle", parent=styles["Normal"], fontSize=13, textColor=colors.HexColor("#444444"), spaceAfter=20, alignment=TA_CENTER)
h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=16, spaceBefore=18, spaceAfter=8, textColor=colors.HexColor("#1a3d7c"))
h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=12.5, spaceBefore=10, spaceAfter=4, textColor=colors.HexColor("#22548c"))
body = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=14, spaceAfter=6)
small = ParagraphStyle("Small", parent=styles["Normal"], fontSize=9, leading=12, textColor=colors.HexColor("#555555"))

doc = SimpleDocTemplate(
    OUT_PATH, pagesize=LETTER,
    topMargin=0.75 * inch, bottomMargin=0.75 * inch,
    leftMargin=0.8 * inch, rightMargin=0.8 * inch,
    title="Learn Python - Syllabus", author="Learn to Code",
)

elements = []

elements.append(Spacer(1, 1.2 * inch))
elements.append(Paragraph("Learn Python", title_style))
elements.append(Paragraph("A 14-Day / 28-Hour Job-Ready Curriculum", subtitle_style))
elements.append(Paragraph(
    "Two hours a day for two weeks. Full depth on the 'why', hands-on exercises every day, "
    "a Week 1 project, and a Week 2 capstone. Companion files live in "
    "D:/Git/learning-code/python/", body
))
elements.append(Spacer(1, 0.3 * inch))

overview_data = [
    ["Week", "Focus", "Days"],
    ["Week 1", "Core language foundations", "Days 1-7"],
    ["Week 2", "Job-ready practices: OOP, testing, real data, packaging", "Days 8-14"],
]
t = Table(overview_data, colWidths=[1.0 * inch, 4.3 * inch, 1.1 * inch])
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a3d7c")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 9.5),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cccccc")),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f2f5fa")]),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
]))
elements.append(t)
elements.append(PageBreak())

# ---------------------------------------------------------------------------
elements.append(Paragraph("How To Use This Track", h1))
elements.append(Paragraph(
    "Each day lives in its own folder: dayNN-topic/. Every folder has a lesson.md "
    "(read first, ~35 min), an exercises.py with TODO blanks you fill in and run yourself "
    "(~70 min), and a solutions.py reference (~15 min to compare against, after you've "
    "genuinely attempted it). Struggling with a problem for 10-15 minutes before checking "
    "the answer is where the actual learning happens -- don't skip that step.", body
))
elements.append(Paragraph(
    "Setup: you need Python 3.10+ (verify with <font face='Courier'>python --version</font>). "
    "No extra packages until Day 11 (requests) and Day 12 (pytest) -- each lesson tells you "
    "exactly what to install when you get there.", body
))

elements.append(Paragraph("The Daily Rhythm (~2 hours)", h2))
rhythm_items = [
    "Read lesson.md, running every example yourself in a Python REPL as you go (35 min)",
    "Complete the exercises in exercises.py -- run it and iterate on PASS/FAIL output (70 min)",
    "Compare against solutions.py; for anything wrong, write one sentence on WHY (15 min)",
]
elements.append(ListFlowable([ListItem(Paragraph(i, body)) for i in rhythm_items], bulletType="bullet"))

# ---------------------------------------------------------------------------
elements.append(Paragraph("Week 1 -- Foundations", h1))

week1 = [
    ("Day 1", "Variables, Types, and the Object Model",
     "Variables as names (not boxes); mutability vs immutability; id() vs ==; how Python passes "
     "arguments; the core built-in types; dynamic vs duck typing; truthiness."),
    ("Day 2", "Control Flow: Conditionals, Loops, Comprehensions",
     "if/elif/else and comparison chaining; for as 'iterate,' not 'count'; enumerate/zip; while "
     "vs for; break/continue/for-else; list/dict/set comprehensions and when to avoid them; "
     "the match statement."),
    ("Day 3", "Data Structures: Lists, Tuples, Dicts, Sets",
     "When to reach for each container; hash tables and why dict/set lookup is O(1); why dict "
     "keys must be hashable; slicing in depth; the list/dict/set methods used daily."),
    ("Day 4", "Functions: Args, Scope, Closures, First-Class Functions",
     "*args/**kwargs and parameter ordering; the mutable default argument trap; the LEGB scope "
     "rule and 'global'/'nonlocal'; closures and the late-binding loop gotcha; functions as "
     "first-class objects; lambdas."),
    ("Day 5", "Strings, Formatting, Files, and Context Managers",
     "Core string methods; f-strings and format specs; text vs binary file modes; why 'with' "
     "exists (__enter__/__exit__ and guaranteed cleanup); encoding pitfalls."),
    ("Day 6", "Errors, Exceptions, Modules, and Packages",
     "EAFP vs LBYL; try/except/else/finally; custom exception classes and exception chaining; "
     "modules, packages, and imports; the if __name__ == '__main__' pattern."),
    ("Day 7", "Mini Project: CLI Task Tracker (Week 1 Review)",
     "A from-scratch command-line to-do app with JSON persistence, combining every Week 1 topic. "
     "Less hand-holding by design -- this is where independent problem-solving starts."),
]

for day, title_, desc in week1:
    elements.append(Paragraph(f"{day}: {title_}", h2))
    elements.append(Paragraph(desc, body))

elements.append(PageBreak())

# ---------------------------------------------------------------------------
elements.append(Paragraph("Week 2 -- Job-Ready Python", h1))

week2 = [
    ("Day 8", "OOP Fundamentals: Classes, self, Instances",
     "Classes as factories for objects; why self is explicit, not magic; __init__; class "
     "attributes vs instance attributes (and the shared-mutable-default bug); when a class "
     "beats a dict or a function."),
    ("Day 9", "OOP Advanced: Inheritance, Dunder Methods, Composition",
     "Inheritance and super(); polymorphism and isinstance vs type(); dunder methods "
     "(__repr__, __str__, __eq__, __add__, and more) that hook your classes into built-in "
     "syntax; composition vs inheritance and when to prefer each."),
    ("Day 10", "Iterators, Generators, and Decorators",
     "The iterator protocol behind every for loop; generator functions with yield and why "
     "they're memory-efficient; decorators as closures wrapping functions; functools.wraps; "
     "decorators that take their own arguments."),
    ("Day 11", "Working with Real Data: JSON, CSV, HTTP APIs, Virtual Environments",
     "json.dump(s)/load(s) in depth; the csv module (and why not to parse it by hand); making "
     "HTTP requests with the requests library, timeouts, and error handling; what a virtual "
     "environment is and why every real project uses one."),
    ("Day 12", "Testing and Debugging with pytest, Type Hints",
     "Why automated tests matter beyond 'does it work once'; pytest assertions, "
     "pytest.raises, fixtures, and parametrize; what type hints do (and don't) give you; using "
     "a real debugger (breakpoint()) instead of scattered print() calls."),
    ("Day 13", "Practical Python: Project Structure, Packaging, Git Workflow",
     "The conventional src-layout; pyproject.toml and dependency management; .gitignore and "
     "why __pycache__/.venv are never committed; the real git branch + commit + PR workflow "
     "applied to a Python project; linting/formatting with ruff and black."),
    ("Day 14", "Capstone Project: Expense Tracker",
     "A complete CLI application built mostly unassisted: OOP models, a generator-based "
     "filter method, a hand-built logging decorator, JSON persistence, CSV export, custom "
     "exceptions, type hints throughout, and a real pytest suite -- proof of end-to-end "
     "fluency."),
]

for day, title_, desc in week2:
    elements.append(Paragraph(f"{day}: {title_}", h2))
    elements.append(Paragraph(desc, body))

elements.append(PageBreak())

# ---------------------------------------------------------------------------
elements.append(Paragraph("What You Should Be Able to Do After Day 14", h1))
outcomes = [
    "Read and reason about someone else's Python code, including idioms like comprehensions, "
    "context managers, decorators, and generators.",
    "Design a small program with classes when appropriate, and justify composition vs inheritance choices.",
    "Handle errors deliberately (custom exceptions, EAFP) instead of letting a program crash on bad input.",
    "Read/write JSON and CSV, and call a real HTTP API with proper timeout and error handling.",
    "Write and run a pytest suite covering happy paths and edge cases for your own code.",
    "Set up a project with a virtual environment, pyproject.toml, and a sane git workflow -- the same "
    "baseline expected on day one of a Python job.",
]
elements.append(ListFlowable([ListItem(Paragraph(i, body)) for i in outcomes], bulletType="bullet"))

elements.append(Spacer(1, 0.3 * inch))
elements.append(Paragraph(
    "Full lessons, runnable exercises, and reference solutions for every day are in "
    "D:/Git/learning-code/python/. Start with day01-basics/lesson.md.", small
))

doc.build(elements)
print("PDF written to", OUT_PATH)
