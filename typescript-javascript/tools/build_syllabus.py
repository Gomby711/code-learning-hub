from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, ListFlowable, ListItem
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER

OUT_PATH = r"D:\Git\learning-code\typescript-javascript\syllabus.pdf"

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
    title="Learn JavaScript & TypeScript - Syllabus", author="Learn to Code",
)

elements = []

elements.append(Spacer(1, 1.2 * inch))
elements.append(Paragraph("Learn JavaScript &amp; TypeScript", title_style))
elements.append(Paragraph("A 14-Day / 28-Hour Job-Ready Curriculum", subtitle_style))
elements.append(Paragraph(
    "Two hours a day for two weeks. JavaScript foundations first, then OOP, async, and TypeScript "
    "on top. Full depth on the 'why', hands-on exercises every day, a Week 1 Node.js project, and a "
    "Week 2 TypeScript capstone. Companion files live in D:/Git/learning-code/typescript-javascript/", body
))
elements.append(Spacer(1, 0.3 * inch))

overview_data = [
    ["Week", "Focus", "Days"],
    ["Week 1", "JavaScript language foundations", "Days 1-7"],
    ["Week 2", "OOP, async, TypeScript, testing, tooling", "Days 8-14"],
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

elements.append(Paragraph("How To Use This Track", h1))
elements.append(Paragraph(
    "Each day lives in its own folder: dayNN-topic/. Every folder has a lesson.md (read first), an "
    "exercises.js/.ts with TODO blanks you fill in and run yourself, and a solutions file to compare "
    "against afterward. New to coding entirely? Start with day00-primer/lesson.md before Day 1.", body
))
elements.append(Paragraph(
    "Setup: install Node.js (this track was built and verified against v24). No extra packages until "
    "Day 6 (npm basics), Day 11 (the TypeScript compiler), and Day 12 (Jest for testing) -- each lesson "
    "tells you exactly what to install when you get there.", body
))

elements.append(Paragraph("Week 1 -- JavaScript Foundations", h1))
week1 = [
    ("Day 1", "Variables, Types, and Equality",
     "let/const vs var; primitives; undefined vs null; == vs === and why professional code always uses "
     "===; type coercion; truthy/falsy (and how it differs from Python's rules)."),
    ("Day 2", "Control Flow: Conditionals, Loops, Truthy/Falsy",
     "if/else if/else; the ternary; for, while, for...of (values), for...in (object keys); break/continue; "
     "switch and the fall-through gotcha."),
    ("Day 3", "Data Structures: Arrays and Objects, Destructuring, Spread/Rest",
     "Array methods including the critical map/filter/reduce trio; objects as JS's key-value collection; "
     "destructuring; spread vs rest (same ... syntax, opposite jobs)."),
    ("Day 4", "Functions: Declarations, Arrow Functions, Scope, Closures, this",
     "Three ways to write a function and when to use each; default/rest parameters; block scope (let/const) "
     "vs function scope (var); closures; a real, correct mental model for `this`."),
    ("Day 5", "Strings, Template Literals, JSON, and Dates",
     "String methods; template literals in depth; JSON.stringify/parse; the Date object and its "
     "zero-indexed-months gotcha."),
    ("Day 6", "Errors, Modules, npm and Packages",
     "try/catch/finally; custom error classes; ES modules (import/export) vs CommonJS (require); npm and "
     "package.json."),
    ("Day 7", "Mini Project: Node.js CLI Task Tracker (Week 1 Review)",
     "A from-scratch command-line to-do app using process.argv and the fs module, combining every Week 1 "
     "topic -- verified working end-to-end including all edge cases."),
]
for day, title_, desc in week1:
    elements.append(Paragraph(f"{day}: {title_}", h2))
    elements.append(Paragraph(desc, body))

elements.append(PageBreak())

elements.append(Paragraph("Week 2 -- Job-Ready JavaScript &amp; TypeScript", h1))
week2 = [
    ("Day 8", "OOP Fundamentals: Classes, Constructors, Encapsulation",
     "class/constructor syntax; this inside methods; private fields (#field) and why encapsulation matters; "
     "getters/setters."),
    ("Day 9", "OOP Advanced: Inheritance, Prototypes, Static Members",
     "extends/super; polymorphism; what's really happening underneath class -- JS's prototype chain; static "
     "methods/properties."),
    ("Day 10", "Asynchronous JavaScript: Callbacks, the Event Loop, Promises, async/await",
     "Why JS needs async at all (the single-threaded event loop); callbacks and 'callback hell'; Promises "
     "and .then()/.catch(); async/await; Promise.all for concurrency -- verified with real timing tests."),
    ("Day 11", "Working With Real Data, and an Introduction to TypeScript",
     "The fetch API for real HTTP requests; why TypeScript exists; setting up tsc; basic type annotations, "
     "inference, and why to avoid `any`."),
    ("Day 12", "TypeScript Deep Dive + Testing with Jest",
     "interface and type; union types and narrowing; generics; setting up and writing real tests with Jest "
     "(test.each, async tests, .toThrow) -- verified passing via ts-jest."),
    ("Day 13", "Practical: Project Structure, npm Scripts, Linting, Git Workflow",
     "Conventional project layout; package.json/npm scripts in depth; the most important tsconfig.json "
     "settings (strict mode); ESLint/Prettier; the real git branch + commit + PR workflow."),
    ("Day 14", "Capstone Project: Expense Tracker (in TypeScript)",
     "A complete CLI application built mostly unassisted: typed OOP models, async file I/O, a custom error "
     "class, full Jest test suite, strict TypeScript throughout -- reference solution compiles clean and "
     "all 7 tests pass."),
]
for day, title_, desc in week2:
    elements.append(Paragraph(f"{day}: {title_}", h2))
    elements.append(Paragraph(desc, body))

elements.append(PageBreak())
elements.append(Paragraph("What You Should Be Able to Do After Day 14", h1))
outcomes = [
    "Read and reason about real JavaScript/TypeScript code, including closures, this-binding, promises, "
    "and async/await.",
    "Design classes with proper encapsulation, and know when composition/inheritance/plain objects each fit.",
    "Handle errors deliberately with custom error types instead of silent failures or raw crashes.",
    "Add TypeScript types (including generics and union types) to catch mistakes before code ever runs.",
    "Write and run a Jest test suite covering happy paths and edge cases for your own code.",
    "Set up a project with package.json, tsconfig.json, and a sane git workflow -- the same baseline "
    "expected on day one of a JS/TS job.",
]
elements.append(ListFlowable([ListItem(Paragraph(i, body)) for i in outcomes], bulletType="bullet"))

elements.append(Spacer(1, 0.3 * inch))
elements.append(Paragraph(
    "Full lessons, runnable exercises, and reference solutions for every day are in "
    "D:/Git/learning-code/typescript-javascript/. Start with day00-primer/lesson.md.", small
))

doc.build(elements)
print("PDF written to", OUT_PATH)
