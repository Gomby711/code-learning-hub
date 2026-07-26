"""Code Learning Hub — local server.

Serves the learning-hub frontend, exposes the lesson folders as an API,
and runs Python / JavaScript / TypeScript snippets in a subprocess.

Run:  python server.py          (then open http://127.0.0.1:8899)
"""

import json
import os
import re
import subprocess
import sys
import tempfile
import threading
import urllib.error
import urllib.request
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

APP_DIR = Path(__file__).resolve().parent
ROOT = APP_DIR.parent          # D:\Git\learning-code
STATIC = APP_DIR / "static"
PORT = 8899

VERSION = "1.0.0"
GITHUB_REPO = "Gomby711/code-learning-hub"


def _version_tuple(v: str):
    parts = []
    for p in v.strip().lstrip("vV").split("."):
        try:
            parts.append(int(p))
        except ValueError:
            parts.append(0)
    return tuple(parts)


def get_latest_release_tag():
    """Best-effort check against GitHub Releases; returns None on any failure
    (offline, no releases published yet, rate-limited, etc.)."""
    try:
        req = urllib.request.Request(
            f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest",
            headers={"Accept": "application/vnd.github+json",
                     "User-Agent": "CodeLearningHub"})
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return data.get("tag_name", "").lstrip("vV") or None
    except (urllib.error.URLError, TimeoutError, ValueError, OSError):
        return None


def perform_update():
    """Pulls the latest code via git. Returns (ok, message)."""
    if not (ROOT / ".git").exists():
        return False, "not a git checkout — redownload the app to update"
    try:
        result = subprocess.run(
            ["git", "pull", "--ff-only"], cwd=str(ROOT),
            capture_output=True, text=True, timeout=30)
        if result.returncode != 0:
            return False, (result.stderr or result.stdout or "git pull failed").strip()[:300]
        return True, result.stdout.strip()
    except FileNotFoundError:
        return False, "git is not installed on this machine"
    except subprocess.TimeoutExpired:
        return False, "timed out reaching GitHub"


def restart_app():
    """Spawns a fresh copy of the app (same launch mode) and kills this process."""
    kwargs = {}
    if sys.platform == "win32":
        kwargs["creationflags"] = subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP
    subprocess.Popen([sys.executable, str(APP_DIR / "server.py"), "--window"],
                      cwd=str(APP_DIR), close_fds=True, **kwargs)
    os._exit(0)

COURSES = [
    {"id": "python", "title": "Python", "folder": "python", "accent": "#4B8BBE",
     "tagline": "14-day job-ready track: core language, OOP, data, testing.",
     "logo": "logos/python.png"},
    {"id": "typescript-javascript", "title": "JavaScript / TypeScript", "folder": "typescript-javascript", "accent": "#34406E",
     "tagline": "14-day track: JS fundamentals through async, TypeScript and testing.",
     "logo": "logos/javascript.png"},
    {"id": "html-css", "title": "HTML / CSS", "folder": "html-css", "accent": "#5BC8DB",
     "tagline": "14-day track: semantic HTML, flexbox, grid, responsive design.",
     "logo": "logos/html.png"},
    {"id": "qt", "title": "Qt (PySide6)", "folder": "qt", "accent": "#4C5A9C",
     "tagline": "15-day track: build real, installable desktop apps in Python with the Qt GUI framework.",
     "logo": "logos/qt.png"},
    {"id": "career", "title": "Career & Beyond", "folder": "career", "accent": "#f97316",
     "tagline": "Git, data structures & algorithms, React/Tailwind, backend & APIs, deployment, and how to actually get hired.",
     "logo": "logos/career.webp"},
]

SKIP_DIRS = {"node_modules", "__pycache__", "tools", ".git"}
TEXT_EXTS = {".md", ".py", ".js", ".ts", ".tsx", ".jsx", ".html", ".css",
             ".json", ".txt", ".cjs", ".mjs", ".csv", ".ui"}

RUN_TIMEOUT = 15  # seconds


def day_sort_key(name: str):
    m = re.match(r"day(\d+)", name)
    return (int(m.group(1)) if m else 999, name)


def lesson_title(day_dir: Path, fallback: str) -> str:
    lesson = day_dir / "lesson.md"
    if lesson.exists():
        try:
            with open(lesson, encoding="utf-8", errors="replace") as f:
                for _ in range(10):
                    line = f.readline()
                    if line.startswith("# "):
                        return line[2:].strip()
        except OSError:
            pass
    return fallback


def build_courses():
    out = []
    for c in COURSES:
        folder = ROOT / c["folder"]
        if not folder.is_dir():
            continue
        days = []
        for d in sorted((p for p in folder.iterdir()
                         if p.is_dir() and p.name not in SKIP_DIRS),
                        key=lambda p: day_sort_key(p.name)):
            files = [{"name": f.name,
                      "path": str(f.relative_to(ROOT)).replace("\\", "/")}
                     for f in sorted(d.iterdir())
                     if f.is_file() and f.suffix.lower() in TEXT_EXTS]
            if not files:
                continue
            m = re.match(r"day(\d+)-(.+)", d.name)
            fallback = (f"Day {int(m.group(1))} — {m.group(2).replace('-', ' ').title()}"
                        if m else d.name)
            days.append({"id": d.name,
                         "num": int(m.group(1)) if m else None,
                         "title": lesson_title(d, fallback),
                         "files": files})
        readme = folder / "README.md"
        out.append({**c,
                    "readme": readme.read_text(encoding="utf-8", errors="replace") if readme.exists() else "",
                    "days": days})
    return out


def safe_resolve(rel_path: str) -> Path | None:
    try:
        p = (ROOT / rel_path).resolve()
    except (OSError, ValueError):
        return None
    if not p.is_file() or ROOT not in p.parents:
        return None
    if p.suffix.lower() not in TEXT_EXTS:
        return None
    if any(part in SKIP_DIRS for part in p.parts):
        return None
    return p


def run_code(lang: str, code: str, stdin_text: str) -> dict:
    tmpdir = Path(tempfile.mkdtemp(prefix="hub_run_"))
    try:
        if lang == "python":
            src = tmpdir / "main.py"
            src.write_text(code, encoding="utf-8")
            cmd = [sys.executable, "-X", "utf8", str(src)]
        elif lang == "js":
            src = tmpdir / "main.js"
            src.write_text(code, encoding="utf-8")
            cmd = ["node", str(src)]
        elif lang == "ts":
            src = tmpdir / "main.ts"
            src.write_text(code, encoding="utf-8")
            cmd = ["node", str(APP_DIR / "run_ts.js"), str(src)]
        else:
            return {"error": f"unsupported language: {lang}"}
        env = {**os.environ, "NO_COLOR": "1", "PYTHON_COLORS": "0",
               "NODE_DISABLE_COLORS": "1", "FORCE_COLOR": "0",
               "QT_QPA_PLATFORM": "offscreen",
               "QT_QPA_FONTDIR": r"C:\Windows\Fonts"}
        try:
            proc = subprocess.run(
                cmd, cwd=str(tmpdir), input=stdin_text, env=env,
                capture_output=True, text=True, encoding="utf-8",
                errors="replace", timeout=RUN_TIMEOUT)
            return {"stdout": proc.stdout, "stderr": proc.stderr,
                    "exit": proc.returncode, "timedOut": False}
        except subprocess.TimeoutExpired as e:
            return {"stdout": e.stdout or "", "stderr": e.stderr or "",
                    "exit": -1, "timedOut": True}
        except FileNotFoundError:
            return {"error": f"runtime for '{lang}' not found on this machine"}
    finally:
        try:
            for f in tmpdir.iterdir():
                f.unlink(missing_ok=True)
            tmpdir.rmdir()
        except OSError:
            pass


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def _send(self, status: int, body: bytes, ctype: str):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, obj, status=200):
        self._send(status, json.dumps(obj).encode("utf-8"),
                   "application/json; charset=utf-8")

    def do_GET(self):
        url = urlparse(self.path)
        if url.path == "/api/courses":
            self._json(build_courses())
            return
        if url.path == "/api/file":
            rel = parse_qs(url.query).get("path", [""])[0]
            p = safe_resolve(rel)
            if p is None:
                self._json({"error": "not found"}, 404)
                return
            self._json({"path": rel,
                        "content": p.read_text(encoding="utf-8", errors="replace")})
            return
        if url.path == "/api/version":
            latest = get_latest_release_tag()
            update_available = bool(latest) and _version_tuple(latest) > _version_tuple(VERSION)
            self._json({"current": VERSION, "latest": latest, "updateAvailable": update_available})
            return
        # static files
        name = url.path.lstrip("/") or "index.html"
        f = (STATIC / name).resolve()
        if STATIC not in f.parents or not f.is_file():
            self._send(404, b"not found", "text/plain")
            return
        ctypes = {".html": "text/html; charset=utf-8",
                  ".css": "text/css; charset=utf-8",
                  ".js": "text/javascript; charset=utf-8",
                  ".svg": "image/svg+xml",
                  ".png": "image/png",
                  ".webp": "image/webp",
                  ".ico": "image/x-icon"}
        self._send(200, f.read_bytes(),
                   ctypes.get(f.suffix.lower(), "application/octet-stream"))

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/apply-update":
            ok, message = perform_update()
            self._json({"ok": ok, "message": message})
            if ok:
                threading.Timer(0.8, restart_app).start()
            return
        if path != "/api/run":
            self._json({"error": "not found"}, 404)
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            lang = payload.get("lang", "")
            code = payload.get("code", "")
            stdin_text = payload.get("stdin", "")
        except (ValueError, json.JSONDecodeError):
            self._json({"error": "bad request"}, 400)
            return
        self._json(run_code(lang, code, stdin_text))


def main():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    url = f"http://127.0.0.1:{PORT}"

    if "--window" in sys.argv:
        # Standalone desktop window (native WebView2), no browser involved.
        if sys.platform == "win32":
            # Without an explicit AppUserModelID, Windows resolves this
            # process's taskbar icon from the .py file association instead
            # of the window's own icon.
            import ctypes
            ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(
                "CodeLearningHub.App")
        import webview
        threading.Thread(target=server.serve_forever, daemon=True).start()
        webview.create_window("Code Learning Hub", url,
                               width=1440, height=900,
                               min_size=(900, 600))
        webview.start(icon=str(APP_DIR / "icon.ico"))
        server.shutdown()
        return

    print(f"Code Learning Hub running at {url}  (Ctrl+C to stop)")
    if "--no-browser" not in sys.argv:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
