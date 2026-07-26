# Day 7 — Shipping It: Vercel, Railway, and Electron

## Objectives
- Understand what "deploying" an app actually means, concretely — not as a vague buzzword
- Know the difference between deploying a static frontend, a backend + database, and a desktop app, and which
  tool fits each
- Be able to actually take Day 4's portfolio project idea live, on a real URL a stranger can open

## Why this day matters more than it might seem

A project sitting only in your local folder, however good, is invisible to everyone but you. **Deploying** it —
putting it on a server that's reachable over the internet, all the time, at a real URL — is what turns "I built
this" into something a hiring manager, a recruiter, or a friend can actually click and try in ten seconds,
without cloning your repo and running setup commands themselves. Recall from Day 4: a live link is dramatically
more convincing evidence than a description or a screenshot. This is genuinely one of the highest-leverage
hours you can spend on a portfolio project — many people build something solid and then never take this last
step, and it's the step that makes everything before it actually count for a hiring audience.

## Static frontend hosting — Vercel (and Netlify, GitHub Pages, similar)

If your project is a frontend-only site (plain HTML/CSS/JS, or a React app that builds down to static files —
no backend server of your own), a **static host** is the simplest, and usually free, way to deploy it.
**Vercel** is one of the most common: you connect your GitHub repository, it detects the project type
automatically (including React/Vite projects), runs the build command for you, and gives you a live URL — and
from then on, every time you push to your repo's main branch, it automatically redeploys the new version. This
"push to deploy" workflow is standard across most modern hosts and is worth experiencing firsthand once, since
you'll rely on it (or something extremely similar) at essentially any job that ships a web frontend.

```
1. Push your project to a GitHub repository (Day 1 skills)
2. Sign up at vercel.com, "Import Project," pick your repo
3. Vercel detects the framework (or "no framework" for plain HTML/CSS/JS) and builds it automatically
4. You get a live URL immediately -- share it, put it in your README, put it on your resume
```

## Backend + database hosting — Railway (and Render, Fly.io, similar)

A project with an actual backend server (Day 6's territory — a real Python/Node process that needs to keep
running, plus a database) needs a host that runs your *server*, not just static files. **Railway** is a common,
beginner-friendly choice: connect your repo, it detects your backend's language/framework, runs it in a
container, and can spin up a real managed database (including PostgreSQL) alongside it with a few clicks,
automatically wiring the connection details in as environment variables your code reads at startup. The core
concept worth understanding, regardless of which specific host you eventually use: your backend process needs
to run *continuously* somewhere (unlike a static site, which is just files being served), and **environment
variables** are the standard way production settings (database URLs, API keys) get into your code without
hardcoding secrets directly into your source files — you'll see `process.env.SOMETHING` (Node) or
`os.environ["SOMETHING"]` (Python) constantly in real backend code for exactly this reason.

## A critical habit: never commit secrets

API keys, database passwords, and similar secrets must never be committed to Git — once something is committed,
it's in your repository's history essentially forever, even if you delete it in a later commit, and public
GitHub repos get scanned by bots looking for exactly this. The standard pattern: put secrets in a `.env` file,
add `.env` to your `.gitignore` (from Day 1), and load them via environment variables in code — then set the
*real* values directly in your hosting platform's dashboard (Vercel and Railway both have a place for this),
never in a committed file.

## Desktop apps — Electron (and what this very app is built with)

Not every project is a website. **Electron** is a framework for building genuine desktop applications (that
install and run like any other program, with their own window and icon, not inside a browser tab) using web
technology — HTML, CSS, and JavaScript — by bundling a full Chromium browser engine and a Node.js runtime
together with your code. Real, well-known apps built this way: VS Code, Slack, Discord, Figma's desktop app.
This repo's own `app/` — the very app you're reading this lesson inside — takes a closely related approach: it
uses **pywebview** (see `app/server.py` and `app/README.md`) to open a native desktop window backed by Windows'
built-in WebView2 engine, running a small local Python server underneath, rather than bundling Chromium the way
Electron does — same underlying idea (web technology, wrapped as a real desktop app with its own window and
icon), a lighter-weight specific implementation. If you want to package a project of your own as an installable
desktop app rather than a website, Electron (`npm install electron`, then `electron-builder` or `electron-forge`
to produce an actual installer) is the standard, well-documented starting point.

## Choosing the right one for a given project

| Your project is... | Deploy it with |
|---|---|
| Plain HTML/CSS/JS, or a React app with no server of its own | Vercel, Netlify, or GitHub Pages (all free tiers) |
| A backend (Python/Node) + database that other apps or a frontend call | Railway, Render, or Fly.io |
| A full-stack app: frontend AND backend | Frontend on Vercel, backend+database on Railway, frontend calls the backend's live URL — OR some hosts (Railway included) can serve both from one project |
| A desktop program someone installs and runs like any other app | Electron (or pywebview, as this repo does, for a lighter-weight option) |

## Exercises

There's no `exercises.py` today — deployment is a "do it for real, once, on your actual project" skill, not
something a local grader can meaningfully check. Your task: take the project you scoped on Day 4 (or any small
project you've already built) and get it live on a real URL using the table above. If you don't have a project
ready yet, deploy something tiny and disposable just to walk the process once — a single HTML page is enough to
learn the Vercel flow end-to-end. Put the resulting live link somewhere you'll find it again; you'll want it for
Day 8.
