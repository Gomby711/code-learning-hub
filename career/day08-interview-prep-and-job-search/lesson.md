# Day 8 — Interview Prep & the Job Search: Putting It All Together

## Objectives
- Know what a junior/early-career resume and portfolio should actually contain, and what to leave out
- Understand the standard structure of a technical interview and a behavioral interview, and how to prepare for
  each differently
- Have a realistic, honest picture of the timeline and volume this process usually takes, so you can pace
  yourself instead of being blindsided

## The resume — what actually gets read

A hiring manager or recruiter typically spends well under a minute on a first pass of a resume. What earns a
second look, for someone early in their career with no long job history to lean on:
- **Projects, with a live link and a one-line description of what they do and what you used to build them** —
  this is usually the single most important section for a career-changer or new grad; it's the concrete
  evidence everything else on the page is pointing at.
- **Specific technologies, not vague claims.** "Built a task-tracking API with Python, Flask, and PostgreSQL,
  deployed on Railway" is checkable and specific. "Proficient in various programming languages" tells a reader
  nothing and reads as filler.
- **Any real collaborative experience**, even outside a formal job — a group project, an open-source
  contribution, freelance work — because it speaks directly to the "can you work with other people's code and
  people" question every employer actually has.
- **What to leave off:** a long list of every tutorial or course completed with no project to show for it,
  a skills section listing dozens of buzzwords, an "objective" paragraph restating that you want the job you're
  applying for.

## Portfolio presentation — beyond just having projects

For each project, a short **README** matters as much as the code (Day 4's territory). When someone opens a
project link, they should be able to answer, in under a minute: what does this do, why did you build it, what
did you personally build vs. use off the shelf, and — if it's not obvious — how do the interesting parts work.
A one-paragraph "how it works" section describing a genuinely tricky decision you made (why you chose a
particular data structure, how you handled a tricky edge case) shows more real engineering judgment than a long
feature list ever will.

## The behavioral interview — a learnable, structured format

Behavioral questions ("tell me about a time you disagreed with someone," "describe a project you're proud of,"
"tell me about a time something didn't work and what you did") aren't testing whether interesting things have
happened to you — they're testing whether you can **clearly communicate your own reasoning and actions**. The
standard structure that consistently reads well: **STAR** — **S**ituation (brief context), **T**ask (what you
specifically needed to do), **A**ction (what YOU did — not "we," specifically you), **R**esult (what happened,
ideally with a concrete outcome). Prepare 3-4 real stories from your own projects or experience *before* an
interview, in this shape, so you're recalling a rehearsed structure under pressure instead of improvising one.
For someone early in their career, a portfolio project's own decisions ("I chose to restructure the data model
halfway through when I realized my first approach couldn't handle X") are completely legitimate, real STAR
stories — you don't need prior job experience to have genuine examples.

## The technical interview — what Days 2-3 of this track were actually preparing you for

Format varies, but a common shape: a problem statement, shared code editor or whiteboard, and an expectation
that you **talk through your reasoning out loud** while solving it — not just produce a correct final answer
silently. Revisit the process from Day 2-3 of this track directly:
1. Restate the problem, ask clarifying questions about edge cases.
2. Say the brute-force approach out loud first, even if it's not the final answer.
3. Look for the pattern (hash map for repeated lookups, two-pointer for sorted data, sliding window for
   contiguous runs, recursion for "smaller version of the same problem," BFS/DFS for reachability).
4. Trace a small example by hand before finalizing code.
5. State the time/space complexity, unprompted, when you're done.

**Practicing out loud, alone or with a friend, matters as much as solving the problem correctly** — explaining
your reasoning clearly under mild pressure is a distinct, practicable skill, separate from knowing the pattern.
Recording yourself solving one problem out loud and listening back is an uncomfortable but genuinely effective
way to notice where your explanation gets muddled.

Some companies also ask **system design** or **take-home project** questions instead of or alongside algorithm
questions, especially for slightly more experienced roles — "design a URL shortener," or "build a small feature
in this starter repo and explain your decisions." The Day 4-7 material in this track (scoping, structuring,
deploying a real project) is direct, transferable preparation for that format specifically.

## A realistic timeline — so you can pace yourself, not panic

Job searching, for almost everyone, involves applying to many roles, hearing back from a fraction of them, and
converting only a fraction of *those* into offers — this is close to universally true and is not a reflection
of your specific skill level. Concretely, expect: dozens of applications for every interview, several
interviews for every offer, and a process that commonly takes weeks to a few months of consistent effort,
sometimes longer depending on the market and role. **The single most controllable input is consistency** —
a steady, sustainable pace of applications plus ongoing DSA and project practice beats sporadic bursts of effort
followed by long gaps. Keep a simple log (even a spreadsheet: company, role, date applied, status) — it turns a
diffuse, anxiety-inducing process into a concrete, trackable one, and makes it easy to follow up at the right
times.

## Exercises

Open `exercises.py` — today's exercise is a self-assessment checklist covering the concrete, checkable outputs
of this entire track: a real Git repository you've used for real work, at least one deployed project with a
live link, and one STAR-format story written out in full. It's graded on whether you've actually produced these
artifacts, not on trivia — by the time this passes, you have the literal, tangible starting materials for a job
search, not just completed lessons.
