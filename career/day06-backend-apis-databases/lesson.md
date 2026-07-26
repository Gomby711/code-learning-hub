# Day 6 — Backend, APIs, and Databases: How the Pieces Actually Talk to Each Other

## Objectives
- Understand what a "backend" and a "frontend" actually are, and why almost every real app has both
- Understand HTTP well enough to read a request/response and know what's happening
- Understand what a REST API is, and what "CRUD" means in practice
- Understand what a database is for, at a level that makes SQL and NoSQL docs make sense later
- Build a tiny in-memory API and database yourself, in plain Python, to see the whole shape at once

## Frontend vs. backend — the actual division of responsibility

The **frontend** is everything that runs in the user's own browser (or app) — the HTML/CSS/JS you've already
learned, including React, which still ultimately runs in the browser. The **backend** is a separate program that
runs on a server somewhere else, which the frontend talks to over the network to do things the browser can't or
shouldn't do itself: store data permanently, check a password against a database without exposing it, talk to
other services, enforce rules no user should be able to bypass by just editing JavaScript in their browser's dev
tools. The Python track's day00-day14 content is exactly the language you'd use to write a backend — Python, via
a web framework, is one of the most common backend languages in the industry (alongside JavaScript/Node,
frameworks in Java, Go, Ruby, and others).

**Why you can't just do everything in the frontend:** anything that runs in a user's browser is fully visible
and editable by that user — if "check the password" logic lived only in JavaScript in the browser, anyone could
open dev tools and skip it. Data also needs a permanent home that survives a user closing their browser or
switching devices — `localStorage` (used throughout the JS/TS track's exercises) only lives in one browser, on
one device. A backend with a real database solves both problems: it's a trusted place, outside any user's
control, where the real rules get enforced and the real data lives.

## HTTP — the protocol the frontend and backend actually speak

Every request your browser makes (loading a page, submitting a form, an API call) is an **HTTP request**, and
gets back an **HTTP response**. A request has a **method** (what kind of action), a **path** (which resource),
and often a **body** (data being sent); a response has a **status code** (a 3-digit number summarizing what
happened) and usually a body too.

| Method | Meaning | Example |
|---|---|---|
| `GET` | Read/fetch data, no side effects | `GET /api/tasks` — get the list of tasks |
| `POST` | Create something new | `POST /api/tasks` with a body — create a new task |
| `PUT`/`PATCH` | Update something existing | `PATCH /api/tasks/7` — update task #7 |
| `DELETE` | Remove something | `DELETE /api/tasks/7` — delete task #7 |

| Status code range | Meaning |
|---|---|
| `2xx` | Success — `200 OK`, `201 Created` |
| `3xx` | Redirect — go look somewhere else |
| `4xx` | The CLIENT made a mistake — `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| `5xx` | The SERVER made a mistake — `500 Internal Server Error` |

You've already been reading these constantly without necessarily naming them — every time a browser fails to
load a page with "404," that's this exact system. This repo's own `app/server.py` (the very app you're reading
this in) is a small, real example of an HTTP server — its `do_GET`/`do_POST` methods are handling exactly this.

## REST APIs and CRUD — the common shape most backends follow

A **REST API** is a backend that exposes its data as a set of URLs ("resources"), where the standard HTTP
methods above map onto the four basic operations you can do to data, known by the acronym **CRUD**:
**C**reate (`POST`), **R**ead (`GET`), **U**pdate (`PUT`/`PATCH`), **D**elete (`DELETE`). Almost every backend
you'll ever touch — a to-do app, a social feed, an e-commerce store — is CRUD operations on some set of
resources, wearing different clothes. Recognizing "oh, this is just CRUD on a `posts` resource" is a genuinely
useful shortcut for quickly understanding an unfamiliar API.

```
GET    /api/tasks         -> return the list of all tasks
POST   /api/tasks         -> create a new task from the request body, return it
GET    /api/tasks/7       -> return task #7
PATCH  /api/tasks/7       -> update task #7 from the request body
DELETE /api/tasks/7       -> delete task #7
```

## JSON — the data format APIs almost always speak

You met JSON already in the Python track's Day 11 and the JS track's Day 5 — it's worth restating here because
it's specifically the format REST APIs use to send structured data in request/response bodies: a JSON object
looks exactly like a Python dict or a JS object literal, as plain text, and both frontend and backend parse it
into their own native data structure on their end.

## Databases — where the real data actually lives

A database is a program specifically built to store data permanently, retrieve it quickly (even from millions
of rows), and keep it consistent even if many things are reading/writing at once — all things a plain file
struggles with at any real scale. Two broad categories:

- **Relational (SQL)** databases (PostgreSQL, MySQL, SQLite) store data in tables with rows and columns, with
  defined relationships between tables (a `users` table, a `posts` table, each post linked to the user who wrote
  it via a `user_id` column) — you query them with SQL, a language purpose-built for asking precise questions
  about structured, related data.
- **Document/NoSQL** databases (MongoDB and similar) store more flexible, JSON-like documents instead of rigid
  rows and columns — often a simpler starting mental model, at the cost of some of the structural guarantees
  SQL databases enforce automatically.

For a first full-stack project, **SQLite** (built into Python's standard library, `import sqlite3` — no separate
install or server needed) is the easiest realistic starting point: a full, real SQL database that lives in a
single file, still gives you genuine SQL practice, and is exactly the shape you'd upgrade later to PostgreSQL
once a project needs to run in production against real concurrent traffic.

## Exercises

Open `exercises.py`. Rather than reaching for a web framework, you'll build a tiny **in-memory** backend
entirely in plain Python — an in-memory "database" (just a dict) and functions that mimic what each CRUD HTTP
endpoint would do. This is deliberately the smallest possible version of the whole shape above, so you can see
"request comes in -> touches the data store -> response goes out" as one clear, traceable path, before adding a
real framework's routing and a real database's syntax on top of a concept you already understand solidly.
