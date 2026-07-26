# Day 11 bonus exercise — a real HTTP API call (manual, not auto-checked)

This one isn't auto-graded because it needs network access and the `requests` package — do it by hand and eyeball the output.

## Setup
```
pip install requests
```

## Task

Write a small script `fetch_user.py` in this folder that:

1. Sends a GET request to `https://jsonplaceholder.typicode.com/users/1` (a free fake API for testing — no auth needed) with a 5-second timeout.
2. Handles the request failing entirely (no internet, DNS failure, timeout) by catching `requests.RequestException` and printing a clear error instead of crashing.
3. Handles a non-2xx status code using `response.raise_for_status()` inside the same try block.
4. On success, parses the JSON response and prints just the user's `name` and `email` fields.

## Stretch goal

Modify it to accept a user ID from the command line (`python fetch_user.py 3`) using `sys.argv`, same pattern as Day 7's task tracker, defaulting to user 1 if no argument is given.

## What to notice while doing this

- What does `response.json()` return — a dict? Compare its shape to what you'd get from `json.loads(response.text)` (they should be identical — `.json()` is just a convenience wrapper).
- Try pointing the URL at something that 404s (e.g. `/users/9999`) and confirm `raise_for_status()` actually raises and your except block catches it.
- Try setting `timeout=0.001` temporarily to force a timeout and confirm your error handling triggers.
