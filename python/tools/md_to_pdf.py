"""
Converts a lesson.md file (written in the specific markdown subset used
throughout this course: #/##/### headers, ```code blocks```, `inline code`,
**bold**, "- " bullet lists, "1. " numbered lists, and "| a | b |" tables)
into a nicely formatted PDF using reportlab.

Usage as a library:
    from md_to_pdf import build_pdf_story, render_pdf
    story = build_pdf_story(markdown_text, day_title="Day 1 - Basics")
    render_pdf(story, "out.pdf")

Usage from the command line:
    python md_to_pdf.py input.md output.pdf "Optional Title"
"""

import re
import sys
from xml.sax.saxutils import escape

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Preformatted, Table, TableStyle,
    ListFlowable, ListItem, PageBreak,
)

styles = getSampleStyleSheet()

H1 = ParagraphStyle("MdH1", parent=styles["Heading1"], fontSize=17, spaceBefore=16,
                     spaceAfter=8, textColor=colors.HexColor("#1a3d7c"))
H2 = ParagraphStyle("MdH2", parent=styles["Heading2"], fontSize=13, spaceBefore=12,
                     spaceAfter=6, textColor=colors.HexColor("#22548c"))
H3 = ParagraphStyle("MdH3", parent=styles["Heading3"], fontSize=11, spaceBefore=10,
                     spaceAfter=4, textColor=colors.HexColor("#2b6cb0"))
BODY = ParagraphStyle("MdBody", parent=styles["Normal"], fontSize=10, leading=14.5, spaceAfter=7)
BULLET = ParagraphStyle("MdBullet", parent=BODY, spaceAfter=3)
CODE = ParagraphStyle("MdCode", parent=styles["Code"], fontName="Courier", fontSize=8.6,
                       leading=11.5, backColor=colors.HexColor("#f4f4f4"),
                       borderColor=colors.HexColor("#dddddd"), borderWidth=0.5,
                       borderPadding=6, spaceAfter=8, spaceBefore=2)
DOC_TITLE = ParagraphStyle("MdDocTitle", parent=styles["Title"], fontSize=22, spaceAfter=18)


def inline_format(text: str) -> str:
    text = escape(text)
    text = re.sub(r"`([^`]+)`", r'<font face="Courier" size="9" color="#a3313a">\1</font>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    return text


def build_pdf_story(markdown_text: str, day_title: str | None = None, start_with_page_break: bool = False):
    lines = markdown_text.split("\n")
    story = []

    if start_with_page_break:
        story.append(PageBreak())

    if day_title:
        story.append(Paragraph(escape(day_title), DOC_TITLE))

    i = 0
    n = len(lines)
    paragraph_buffer = []

    def flush_paragraph():
        if paragraph_buffer:
            text = " ".join(paragraph_buffer).strip()
            if text:
                story.append(Paragraph(inline_format(text), BODY))
            paragraph_buffer.clear()

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```"):
            flush_paragraph()
            code_lines = []
            i += 1
            while i < n and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1
            story.append(Preformatted("\n".join(code_lines), CODE))
            continue

        if stripped.startswith("# "):
            flush_paragraph()
            story.append(Paragraph(escape(stripped[2:]), H1))
            i += 1
            continue

        if stripped.startswith("## "):
            flush_paragraph()
            story.append(Paragraph(escape(stripped[3:]), H1))
            i += 1
            continue

        if stripped.startswith("### "):
            flush_paragraph()
            story.append(Paragraph(escape(stripped[4:]), H2))
            i += 1
            continue

        if stripped.startswith("|"):
            flush_paragraph()
            table_lines = []
            while i < n and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            rows = []
            for tl in table_lines:
                cells = [c.strip() for c in tl.strip("|").split("|")]
                if all(re.fullmatch(r":?-+:?", c) for c in cells):
                    continue
                rows.append(cells)
            if rows:
                width_total = 6.3 * inch
                col_count = max(len(r) for r in rows)
                rows = [r + [""] * (col_count - len(r)) for r in rows]
                col_width = width_total / col_count
                formatted_rows = [
                    [Paragraph(inline_format(cell), BODY) for cell in row]
                    for row in rows
                ]
                t = Table(formatted_rows, colWidths=[col_width] * col_count)
                t.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a3d7c")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cccccc")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f2f5fa")]),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ]))
                story.append(t)
                story.append(Spacer(1, 10))
            continue

        if re.match(r"^-\s+", stripped):
            flush_paragraph()
            items = []
            while i < n and re.match(r"^-\s+", lines[i].strip()):
                item_text = re.sub(r"^-\s+", "", lines[i].strip())
                items.append(ListItem(Paragraph(inline_format(item_text), BULLET), leftIndent=12))
                i += 1
            story.append(ListFlowable(items, bulletType="bullet", start="circle", leftIndent=18))
            story.append(Spacer(1, 6))
            continue

        if re.match(r"^\d+\.\s+", stripped):
            flush_paragraph()
            items = []
            while i < n and re.match(r"^\d+\.\s+", lines[i].strip()):
                item_text = re.sub(r"^\d+\.\s+", "", lines[i].strip())
                items.append(ListItem(Paragraph(inline_format(item_text), BULLET), leftIndent=12))
                i += 1
            story.append(ListFlowable(items, bulletType="1", start="1", leftIndent=18))
            story.append(Spacer(1, 6))
            continue

        if stripped == "":
            flush_paragraph()
            i += 1
            continue

        paragraph_buffer.append(stripped)
        i += 1

    flush_paragraph()
    return story


def render_pdf(story, output_path: str, pdf_title: str | None = None):
    """pdf_title sets the PDF's document-metadata Title -- this is what a
    browser tab (Chrome, Edge, etc.) displays when the PDF is opened, as
    opposed to the filename, which is what shows if no metadata title is set.
    """
    doc = SimpleDocTemplate(
        output_path, pagesize=LETTER,
        topMargin=0.75 * inch, bottomMargin=0.75 * inch,
        leftMargin=0.8 * inch, rightMargin=0.8 * inch,
        title=pdf_title or "",
        author="Learn to Code",
    )
    doc.build(story)


def convert_file(input_md_path: str, output_pdf_path: str, title: str | None = None, pdf_title: str | None = None):
    with open(input_md_path, encoding="utf-8") as f:
        text = f.read()
    story = build_pdf_story(text, day_title=title)
    render_pdf(story, output_pdf_path, pdf_title=pdf_title or title)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python md_to_pdf.py input.md output.pdf [\"Title\"]")
        sys.exit(1)
    in_path = sys.argv[1]
    out_path = sys.argv[2]
    title_arg = sys.argv[3] if len(sys.argv) > 3 else None
    convert_file(in_path, out_path, title_arg)
    print(f"Wrote {out_path}")
