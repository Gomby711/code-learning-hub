# Day 1 — Git & GitHub: The Workflow Every Team Actually Uses

## Objectives
- Understand what Git actually tracks (snapshots of your whole project over time) and why that's different from
  "undo" in a text editor
- Learn the daily-driver commands: `init`, `status`, `add`, `commit`, `log`, `diff`, `branch`, `checkout`/`switch`,
  `merge`, `push`, `pull`
- Understand *why* teams use branches and pull requests instead of everyone editing the same files directly
- Know how to resolve a merge conflict without panicking

## Git vs. GitHub — two different things people conflate constantly

**Git** is a program that runs on your own computer. It tracks the history of a folder (a "repository," or
"repo") as a series of snapshots called **commits**. It works completely offline — you could use Git for the
rest of your life without ever touching the internet.

**GitHub** is a website that *hosts* Git repositories online, so other people (and other computers — like a
deploy server) can access them, and adds collaboration features Git itself doesn't have: pull requests, issues,
code review comments, and a place to store your work that survives your laptop dying. GitLab and Bitbucket are
direct competitors that do the same job. You will use Git every single day; you'll push to GitHub whenever you
want to back up or share your work.

## What a commit actually is

A commit is a labeled snapshot of your entire project at one moment, plus a message describing what changed and
why. Git doesn't store "line 4 changed" the way a word processor's track-changes does — conceptually, it stores
"here is what every file looked like at this point in history," and it's smart enough to store the differences
efficiently under the hood so this doesn't waste space. The practical effect: you can jump back to *any* previous
commit and see your entire project exactly as it was at that moment, and you can compare any two commits to see
precisely what changed between them.

## The daily-driver commands

```
git init                      # turn the current folder into a new Git repository (do this once, per project)
git status                     # THE command you'll run more than any other -- what's changed, what's staged?
git add <file>                  # stage a file's current changes -- "mark this for inclusion in the next commit"
git add .                        # stage every changed file in the current folder and below
git commit -m "message"            # take a snapshot of everything currently staged, with a description
git log                              # see the history of commits, newest first
git diff                              # see exactly what's changed but NOT yet staged
git diff --staged                      # see exactly what's staged, about to be committed
```

The **staging area** (what `git add` populates) is the part that trips up beginners: it's a middle step between
"I changed a file" and "I made a commit," letting you build a commit out of only *some* of your current changes,
even if you've been editing five different files for five different reasons. Most days, you'll just `git add .`
and commit everything at once — but knowing the staging area exists explains what `git add` is actually *for*.

### A sane commit message habit

Write commit messages as a command completing the sentence "If applied, this commit will ___": `"add login form
validation"`, not `"fixed stuff"` or `"updates"`. Six months from now, `git log` is how you (or a teammate)
figure out why a particular line of code exists — a vague message throws that information away permanently.

## Branches — working on something without touching the main line

A **branch** is an independent line of development — a copy of the project's history that you can commit to
without affecting anyone else's copy, until you deliberately combine the two. The default branch is
conventionally called `main`. The entire point of branches: multiple people (or multiple features) can be worked
on simultaneously without stepping on each other, and nothing lands on `main` — the version that's usually
considered "the real, working project" — until it's ready and reviewed.

```
git branch                       # list all branches, * marks the one you're currently on
git switch -c add-login-page       # create a NEW branch called add-login-page, and switch to it
git switch main                     # switch back to the main branch
git merge add-login-page              # (while on main) bring add-login-page's commits into main
```
(`git checkout -b <name>` is the older, still extremely common way to write `git switch -c <name>` — you'll see
both constantly in real projects and tutorials; they do the same thing.)

## The real-world workflow: branch → commit → push → pull request → merge

At an actual job, you almost never commit straight to `main`. The standard cycle:

1. `git switch -c fix-signup-bug` — create a branch named after the specific thing you're doing
2. Make your changes, `git add`/`git commit` as you go, describing each logical change
3. `git push -u origin fix-signup-bug` — push your branch up to GitHub (`-u` remembers this branch's remote for
   future plain `git push`es)
4. On GitHub, open a **pull request** (PR) — a request to merge your branch into `main`, which shows the exact
   diff and lets teammates leave comments on specific lines
5. Someone reviews it, maybe asks for changes (you commit more, push again — the PR updates automatically),
   then approves and merges it
6. `git pull` on your local `main` to bring down the now-merged changes, delete your feature branch, repeat

This is *why* branches and PRs matter, beyond ceremony: it gives every change a second set of eyes before it
reaches the version everyone depends on, and it gives you a paper trail of exactly what changed, when, and why,
forever.

## Merge conflicts — what they are, and how to actually resolve one

A conflict happens when two branches changed the **same lines** of the **same file** in different ways, and Git
genuinely cannot guess which version you want. Git will pause the merge and mark the file:

```
<<<<<<< HEAD
const greeting = "Hello there";
=======
const greeting = "Hi!";
>>>>>>> add-login-page
```

Everything between `<<<<<<< HEAD` and `=======` is *your current branch's* version; everything between `=======`
and `>>>>>>> add-login-page` is the *incoming branch's* version. Resolving it means: open the file, decide what
the line(s) should actually say (keep one side, keep the other, or write something new combining both), delete
all three marker lines (`<<<<<<<`, `=======`, `>>>>>>>`) completely, save, then `git add` the file and
`git commit` to finish the merge. A conflict is not an error you did something wrong — it's Git correctly
refusing to silently guess between two real, valid edits, and handing the decision to you.

## `.gitignore` — telling Git what to never track

Some files should never be committed: dependency folders (`node_modules/`), secrets (`.env` files with API
keys), build output, OS junk files. A `.gitignore` file, one pattern per line, tells Git to simply not track
matching files at all:
```
node_modules/
.env
__pycache__/
*.log
```

## Exercises

Open `exercises.py` — today's "exercises" are scenario questions: given a situation, write the exact Git
command(s) you'd run. Run it with `python exercises.py` to check your answers. This won't replace actually using
Git for real — starting **today**, put every exercise file you write from any track in this repo under a real
Git repo of your own, and commit as you go. That repeated real-world rep is what actually builds the habit.
