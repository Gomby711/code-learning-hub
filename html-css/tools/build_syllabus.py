"""Generates html-css/syllabus.pdf -- a short overview of the whole 2-week plan."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from md_to_pdf import H1, H2, BODY, DOC_TITLE
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, ListFlowable, ListItem
from xml.sax.saxutils import escape

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_PATH = os.path.join(ROOT, "syllabus.pdf")

subtitle_style = ParagraphStyle("Subtitle", parent=BODY, fontSize=13, textColor=colors.HexColor("#444444"),
                                 spaceAfter=20, alignment=1)

elements = []
elements.append(Spacer(1, 1.2 * inch))
elements.append(Paragraph("Learn HTML &amp; CSS", DOC_TITLE))
elements.append(Paragraph("A 14-Day / 28-Hour Job-Ready Curriculum", subtitle_style))
elements.append(Paragraph(
    "Two hours a day for two weeks. Full depth on the 'why' behind every layout decision, "
    "hands-on browser-based exercises every day, a Week 1 portfolio project, and a Week 2 "
    "multi-page responsive capstone. Companion files live in D:/Git/learning-code/html-css/", BODY
))
elements.append(Spacer(1, 0.3 * inch))

overview_data = [
    ["Week", "Focus", "Days"],
    ["Week 1", "HTML structure, CSS fundamentals, Flexbox, Grid", "Days 0-7"],
    ["Week 2", "Responsive design, polish, accessibility, architecture, deployment", "Days 8-14"],
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

elements.append(Paragraph("How To Use This Track", H1))
elements.append(Paragraph(
    "Each day lives in its own folder: dayNN-topic/. Every folder has a lesson.md (read first), "
    "a starter.html (and starter.css on CSS-focused days) with TODO markers you fill in yourself, "
    "a solution.html/solution.css reference, and a CHECKLIST.md for manual, visual verification -- "
    "HTML/CSS can't be auto-graded with a PASS/FAIL script the way code can, so verification means "
    "opening the file in a browser and comparing against the checklist.", BODY
))

elements.append(Paragraph("Week 1 -- Foundations", H1))
week1 = [
    ("Day 0", "Primer", "What HTML/CSS are, how browsers render them, DevTools basics."),
    ("Day 1", "HTML Basics", "Document structure, headings, paragraphs, links, images, lists, attributes."),
    ("Day 2", "Forms, Tables, Semantic HTML5", "Form inputs, labels, tables, header/nav/main/article/footer."),
    ("Day 3", "CSS Basics", "Selectors, the cascade, specificity, the box model, box-sizing."),
    ("Day 4", "CSS Layout Fundamentals", "display, position, positioning contexts, margin collapsing."),
    ("Day 5", "Flexbox", "Main/cross axis, justify-content, align-items, flex-grow/shrink/basis."),
    ("Day 6", "CSS Grid", "grid-template-columns/rows, fr unit, grid-template-areas, Grid vs Flexbox."),
    ("Day 7", "Mini Project", "A personal portfolio/landing page combining all of Week 1."),
]
for day, title_, desc in week1:
    elements.append(Paragraph(f"{day}: {title_}", H2))
    elements.append(Paragraph(desc, BODY))

elements.append(PageBreak())
elements.append(Paragraph("Week 2 -- Job-Ready Polish", H1))
week2 = [
    ("Day 8", "Responsive Design", "Media queries, mobile-first, viewport meta tag, em/rem/vw/vh."),
    ("Day 9", "CSS Advanced", "Pseudo-classes/elements, transitions, keyframe animations, custom properties."),
    ("Day 10", "Typography, Color, Accessibility", "Font stacks, line-height, color formats, contrast ratios."),
    ("Day 11", "CSS Architecture", "BEM naming, organizing stylesheets, resets/normalize."),
    ("Day 12", "Forms & Debugging", "HTML5 validation, :valid/:invalid styling, systematic DevTools debugging."),
    ("Day 13", "Practical", "Multi-page project structure, git workflow, deploying to GitHub Pages."),
    ("Day 14", "Capstone", "A complete multi-page responsive website, built mostly unassisted."),
]
for day, title_, desc in week2:
    elements.append(Paragraph(f"{day}: {title_}", H2))
    elements.append(Paragraph(desc, BODY))

elements.append(Spacer(1, 0.3 * inch))
elements.append(Paragraph(
    "Full lessons, starter/solution files, and checklists for every day are in "
    "D:/Git/learning-code/html-css/. Start with day00-primer/lesson.md.", BODY
))

doc = SimpleDocTemplate(OUT_PATH, pagesize=LETTER, topMargin=0.75 * inch, bottomMargin=0.75 * inch,
                         leftMargin=0.8 * inch, rightMargin=0.8 * inch,
                         title="Learn HTML & CSS - Syllabus", author="Learn to Code")
doc.build(elements)
print(f"Wrote {OUT_PATH}")
