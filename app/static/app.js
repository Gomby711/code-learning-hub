/* ---------- Code Learning Hub frontend ---------- */
"use strict";

const $ = (sel) => document.querySelector(sel);

const state = {
  courses: [],
  activeTab: "home",
  activeDay: null,
  activeFile: null,
  editorFile: null,   // path loaded into editor
  editorLangDirty: false,
};

const DEFAULT_LANG = {
  "python": "python",
  "typescript-javascript": "js",
  "html-css": "html",
  "qt": "python",
  "career": "python",
};
const FENCE_LANG = {
  python: "python", py: "python",
  javascript: "js", js: "js",
  typescript: "ts", ts: "ts",
  html: "html", css: "html",
};
const courseLogo = (c) => c.logo
  ? `<img class="course-logo" src="${escapeHtml(c.logo)}" alt="">`
  : `<span class="course-logo-fallback">${escapeHtml(c.title.slice(0, 1))}</span>`;

/* ================= progress / XP / streak ================= */
const doneKey = (c, d) => `hub-done:${c}/${d}`;
const isDone = (c, d) => localStorage.getItem(doneKey(c, d)) === "1";
const setDone = (c, d, v) =>
  v ? localStorage.setItem(doneKey(c, d), "1") : localStorage.removeItem(doneKey(c, d));
const courseProgress = (course) => {
  const total = course.days.length;
  const done = course.days.filter((d) => isDone(course.id, d.id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
};

const getXP = () => parseInt(localStorage.getItem("hub-xp") || "0", 10);
const getXpDaily = () => {
  try { return JSON.parse(localStorage.getItem("hub-xp-daily") || "{}"); }
  catch { return {}; }
};
function addXP(amount, reason) {
  localStorage.setItem("hub-xp", String(getXP() + amount));
  const today = new Date().toISOString().slice(0, 10);
  const daily = getXpDaily();
  daily[today] = (daily[today] || 0) + amount;
  localStorage.setItem("hub-xp-daily", JSON.stringify(daily));
  renderStats(true);
  if (state.activeTab === "home") renderWeekTracker();
  toast(`+${amount} XP — ${reason}`);
}

function touchStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const days = JSON.parse(localStorage.getItem("hub-days") || "[]");
  if (!days.includes(today)) {
    days.push(today);
    localStorage.setItem("hub-days", JSON.stringify(days.slice(-400)));
  }
}
function streakCount() {
  const days = new Set(JSON.parse(localStorage.getItem("hub-days") || "[]"));
  let n = 0;
  const d = new Date();
  while (days.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function renderStats(bump) {
  $("#xp-num").textContent = getXP();
  $("#streak-num").textContent = streakCount();
  if (bump) {
    $("#streak-badge").classList.remove("bump");
    void $("#streak-badge").offsetWidth;
    $("#streak-badge").classList.add("bump");
  }
}

let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

/* ================= confirm modal ================= */
function confirmModal({ title = "Are you sure?", message = "", okText = "Delete forever", danger = true } = {}) {
  return new Promise((resolve) => {
    const overlay = $("#confirm-modal");
    const okBtn = $("#confirm-modal-ok");
    const cancelBtn = $("#confirm-modal-cancel");
    $("#confirm-modal-title").textContent = title;
    $("#confirm-modal-msg").textContent = message;
    okBtn.textContent = okText;
    okBtn.className = danger ? "btn-danger" : "btn-yellow";
    overlay.hidden = false;
    const onKey = (e) => { if (e.key === "Escape") cleanup(false); };
    function cleanup(result) {
      overlay.hidden = true;
      okBtn.onclick = null; cancelBtn.onclick = null; overlay.onclick = null;
      removeEventListener("keydown", onKey);
      resolve(result);
    }
    okBtn.onclick = () => cleanup(true);
    cancelBtn.onclick = () => cleanup(false);
    overlay.onclick = (e) => { if (e.target === overlay) cleanup(false); };
    addEventListener("keydown", onKey);
  });
}

/* ================= confetti ================= */
function confetti() {
  const cv = $("#confetti");
  const ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ["#38bdf8", "#3ee08c", "#6dc5ff", "#ff7a7a", "#c792ea", "#ffffff"];
  const parts = Array.from({ length: 140 }, () => ({
    x: Math.random() * cv.width,
    y: -20 - Math.random() * cv.height * 0.4,
    w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
    vy: 2.2 + Math.random() * 3.2, vx: -1.4 + Math.random() * 2.8,
    rot: Math.random() * Math.PI, vr: -0.12 + Math.random() * 0.24,
    color: colors[(Math.random() * colors.length) | 0],
  }));
  const t0 = performance.now();
  (function frame(t) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (t - t0 < 2800) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, cv.width, cv.height);
  })(t0);
}

/* ================= syntax highlighting ================= */
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const KW = {
  python: "def|class|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|import|from|as|with|try|except|finally|raise|pass|break|continue|lambda|yield|global|nonlocal|del|assert|match|case|print|self|async|await",
  js: "const|let|var|function|return|if|else|for|while|of|in|new|class|extends|super|this|typeof|instanceof|null|undefined|true|false|import|export|from|default|try|catch|finally|throw|async|await|switch|case|break|continue|do|void|delete|yield|static|get|set|console",
  ts: "const|let|var|function|return|if|else|for|while|of|in|new|class|extends|super|this|typeof|instanceof|null|undefined|true|false|import|export|from|default|try|catch|finally|throw|async|await|switch|case|break|continue|do|void|delete|yield|static|get|set|console|interface|type|enum|implements|readonly|namespace|declare|as|keyof|never|unknown|any|string|number|boolean",
};

function tokenRegex(lang) {
  if (lang === "python")
    return new RegExp(
      `(#[^\\n]*)|("""[\\s\\S]*?"""|'''[\\s\\S]*?'''|"(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*')|\\b(\\d+(?:\\.\\d+)?)\\b|\\b(${KW.python})\\b`, "g");
  if (lang === "js" || lang === "ts")
    return new RegExp(
      `(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)|(\`(?:\\\\.|[^\`\\\\])*\`|"(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*')|\\b(\\d+(?:\\.\\d+)?)\\b|\\b(${KW[lang]})\\b`, "g");
  // html: comments, strings, tags
  return /(<!--[\s\S]*?-->)|("[^"\n]*"|'[^'\n]*')|(\d+(?:\.\d+)?)|(<\/?[a-zA-Z][\w-]*|\/?>)/g;
}

function highlightCode(code, lang) {
  const re = tokenRegex(lang);
  let out = "", last = 0, m;
  while ((m = re.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, m.index));
    const cls = m[1] != null ? "tok-com" : m[2] != null ? "tok-str"
      : m[3] != null ? "tok-num" : lang === "html" ? "tok-tag" : "tok-kw";
    out += `<span class="${cls}">${escapeHtml(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + escapeHtml(code.slice(last));
}

function refreshEditorHighlight() {
  const code = $("#editor").value;
  const lang = $("#run-lang").value;
  $("#highlight-code").innerHTML = highlightCode(code, lang) + "\n";
  const lineCount = code.split("\n").length;
  $("#gutter").textContent = Array.from({ length: lineCount }, (_, i) => i + 1).join("\n");
  syncEditorScroll();
}
function syncEditorScroll() {
  const ed = $("#editor");
  $("#highlight").scrollTop = ed.scrollTop;
  $("#highlight").scrollLeft = ed.scrollLeft;
  $("#gutter").scrollTop = ed.scrollTop;
}

/* ================= concept diagrams ================= */
/* Referenced from lesson.md via a fenced block: ```diagram\n<key>\n``` */
const DIAGRAMS = {
  "ref-model": `
    <div class="diagram-title">names point at objects</div>
    <svg viewBox="0 0 460 170" width="460" height="170">
      <text x="80" y="28" text-anchor="middle" fill="#f5f7ff" font="700 15px monospace">a</text>
      <text x="180" y="28" text-anchor="middle" fill="#f5f7ff" font="700 15px monospace">b</text>
      <path d="M80,36 Q80,70 128,78" stroke="#38bdf8" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
      <path d="M180,36 Q180,70 132,78" stroke="#38bdf8" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
      <rect x="90" y="80" width="120" height="46" rx="8" fill="#1a2348" stroke="#3ee08c" stroke-width="2" class="diag-pulse"/>
      <text x="150" y="108" text-anchor="middle" fill="#3ee08c" font="700 14px monospace">[1, 2, 3, 4]</text>
      <text x="150" y="145" text-anchor="middle" fill="#a3adc9" font="12px sans-serif">ONE object — both names point here</text>

      <text x="360" y="28" text-anchor="middle" fill="#f5f7ff" font="700 15px monospace">c</text>
      <path d="M360,36 L360,78" stroke="#c792ea" stroke-width="2" fill="none" marker-end="url(#arrow2)"/>
      <rect x="300" y="80" width="120" height="46" rx="8" fill="#1a2348" stroke="#c792ea" stroke-width="2"/>
      <text x="360" y="108" text-anchor="middle" fill="#c792ea" font="700 14px monospace">[1, 2, 3]</text>
      <text x="360" y="145" text-anchor="middle" fill="#a3adc9" font="12px sans-serif">a DIFFERENT object, equal contents</text>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#38bdf8"/></marker>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#c792ea"/></marker>
      </defs>
    </svg>
    <div class="diagram-cap"><code>a is b</code> → True (same object) &nbsp;·&nbsp; <code>a is c</code> → False &nbsp;·&nbsp; <code>a == c</code> → True (equal values)</div>`,

  "call-stack": `
    <div class="diagram-title">the call stack, one call at a time</div>
    <div class="dsteps" style="--steps:6; --dur:9s">
      <div class="dstep" style="--i:0"><b>1</b> <span class="arrow">→</span> main() calls greet("Sam")</div>
      <div class="dstep" style="--i:1"><b>2</b> <span class="arrow">→</span> greet() is pushed on top of the stack, calls format_name("Sam")</div>
      <div class="dstep" style="--i:2"><b>3</b> <span class="arrow">→</span> format_name() is pushed on top, computes "Sam", returns it</div>
      <div class="dstep" style="--i:3"><b>4</b> <span class="arrow">→</span> format_name() is popped off — control returns to greet()</div>
      <div class="dstep" style="--i:4"><b>5</b> <span class="arrow">→</span> greet() prints the result, then it is popped off too</div>
      <div class="dstep" style="--i:5"><b>6</b> <span class="arrow">→</span> control is back in main(), stack is empty again</div>
    </div>
    <div class="diagram-cap">Only the top of the stack ever runs. Each call waits for everything above it to finish first — that's why a crash deep in a call chain shows you the whole stack of "who called who."</div>`,

  "event-loop": `
    <div class="diagram-title">why does this log out of order?</div>
    <div class="dsteps" style="--steps:6; --dur:10s">
      <div class="dstep" style="--i:0"><b>1</b> <span class="arrow">→</span> console.log("A") runs immediately — prints A</div>
      <div class="dstep" style="--i:1"><b>2</b> <span class="arrow">→</span> setTimeout(fn, 0) hands fn to the browser/Node timer, does NOT run it now</div>
      <div class="dstep" style="--i:2"><b>3</b> <span class="arrow">→</span> console.log("B") runs immediately — prints B</div>
      <div class="dstep" style="--i:3"><b>4</b> <span class="arrow">→</span> the script finishes — call stack is now empty</div>
      <div class="dstep" style="--i:4"><b>5</b> <span class="arrow">→</span> ONLY NOW does the event loop pull fn off the callback queue</div>
      <div class="dstep" style="--i:5"><b>6</b> <span class="arrow">→</span> fn runs — prints C. Final order: A, B, C — never A, C, B</div>
    </div>
    <div class="diagram-cap">Rule: all queued callbacks (timers, promises, I/O) wait for the currently-running code to finish completely, even if the delay is 0ms.</div>`,

  "box-model": `
    <div class="diagram-title">the CSS box model, outside in</div>
    <svg viewBox="0 0 320 220" width="320" height="220">
      <rect x="10" y="10" width="300" height="200" fill="none" stroke="#c792ea" stroke-width="2" stroke-dasharray="6 4" class="diag-pulse" style="animation-delay:0s"/>
      <text x="16" y="26" fill="#c792ea" font="700 11px sans-serif">margin</text>
      <rect x="45" y="45" width="230" height="130" fill="none" stroke="#ff7a7a" stroke-width="2" class="diag-pulse" style="animation-delay:.6s"/>
      <text x="51" y="61" fill="#ff7a7a" font="700 11px sans-serif">border</text>
      <rect x="70" y="70" width="180" height="80" fill="none" stroke="#3ee08c" stroke-width="2" class="diag-pulse" style="animation-delay:1.2s"/>
      <text x="76" y="86" fill="#3ee08c" font="700 11px sans-serif">padding</text>
      <rect x="100" y="95" width="120" height="30" fill="#38bdf8" opacity=".85"/>
      <text x="160" y="115" text-anchor="middle" fill="#0a0c1b" font="700 12px sans-serif">content</text>
    </svg>
    <div class="diagram-cap">An element's total on-page size = content + padding + border + margin, all added together (unless <code>box-sizing: border-box</code> is set — then width/height already include padding + border).</div>`,

  "flexbox": `
    <div class="diagram-title">flex-direction: row — main axis flows left→right</div>
    <svg viewBox="0 0 400 120" width="400" height="120">
      <rect x="10" y="10" width="380" height="80" fill="none" stroke="#3d4a85" stroke-width="2" rx="6"/>
      <text x="16" y="8" fill="#a3adc9" font="11px sans-serif"></text>
      <rect x="26" y="26" width="60" height="48" rx="6" fill="#38bdf8"/>
      <text x="56" y="55" text-anchor="middle" fill="#0a0c1b" font="700 12px sans-serif">1</text>
      <rect x="98" y="26" width="60" height="48" rx="6" fill="#3ee08c"/>
      <text x="128" y="55" text-anchor="middle" fill="#0a0c1b" font="700 12px sans-serif">2</text>
      <rect x="170" y="26" width="60" height="48" rx="6" fill="#c792ea"/>
      <text x="200" y="55" text-anchor="middle" fill="#0a0c1b" font="700 12px sans-serif">3</text>
      <path d="M20,100 H380" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowf)"/>
      <text x="200" y="118" text-anchor="middle" fill="#38bdf8" font="700 11px sans-serif">main axis (justify-content acts here)</text>
      <path d="M394,15 V85" stroke="#ff7a7a" stroke-width="2" marker-end="url(#arrowf2)"/>
      <defs>
        <marker id="arrowf" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#38bdf8"/></marker>
        <marker id="arrowf2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#ff7a7a"/></marker>
      </defs>
    </svg>
    <div class="diagram-cap"><code>justify-content</code> positions items along the main axis (row: horizontal). <code>align-items</code> positions them along the cross axis (row: vertical). Switch <code>flex-direction: column</code> and the two axes swap.</div>`,

  "grid": `
    <div class="diagram-title">CSS grid — rows and columns you define up front</div>
    <svg viewBox="0 0 320 200" width="320" height="200">
      <rect x="10" y="10" width="90" height="80" fill="#38bdf8" opacity=".85"/>
      <rect x="106" y="10" width="90" height="80" fill="#3ee08c" opacity=".85"/>
      <rect x="202" y="10" width="108" height="80" fill="#c792ea" opacity=".85"/>
      <rect x="10" y="96" width="300" height="94" fill="#ff7a7a" opacity=".85"/>
      <text x="55" y="55" text-anchor="middle" fill="#0a0c1b" font="700 12px sans-serif">1 / 1</text>
      <text x="151" y="55" text-anchor="middle" fill="#0a0c1b" font="700 12px sans-serif">1 / 2</text>
      <text x="256" y="55" text-anchor="middle" fill="#0a0c1b" font="700 12px sans-serif">1 / 3</text>
      <text x="160" y="146" text-anchor="middle" fill="#0a0c1b" font="700 12px sans-serif">grid-column: 1 / 4  (spans all 3 columns)</text>
    </svg>
    <div class="diagram-cap">Grid thinks in a 2-D template (rows AND columns at once) that you define on the parent — flexbox only ever thinks in one axis at a time. Use grid for page-level layout, flexbox for arranging items inside a component.</div>`,

  "prototype-chain": `
    <div class="diagram-title">JS property lookup walks up the prototype chain</div>
    <svg viewBox="0 0 460 150" width="460" height="150">
      <rect x="10" y="55" width="110" height="40" rx="6" fill="#1a2348" stroke="#38bdf8" stroke-width="2"/>
      <text x="65" y="80" text-anchor="middle" fill="#38bdf8" font="700 12px monospace">dog (instance)</text>
      <rect x="175" y="55" width="110" height="40" rx="6" fill="#1a2348" stroke="#3ee08c" stroke-width="2"/>
      <text x="230" y="80" text-anchor="middle" fill="#3ee08c" font="700 12px monospace">Dog.prototype</text>
      <rect x="340" y="55" width="110" height="40" rx="6" fill="#1a2348" stroke="#c792ea" stroke-width="2"/>
      <text x="395" y="80" text-anchor="middle" fill="#c792ea" font="700 12px monospace">Object.prototype</text>
      <path d="M120,75 H175" stroke="#a3adc9" stroke-width="2" marker-end="url(#arrowp)"/>
      <path d="M285,75 H340" stroke="#a3adc9" stroke-width="2" marker-end="url(#arrowp)"/>
      <circle cx="65" cy="75" r="6" fill="#ffffff" class="diag-dot"/>
      <defs><marker id="arrowp" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#a3adc9"/></marker></defs>
    </svg>
    <div class="diagram-cap">dog.bark() first checks the dog object itself, then Dog.prototype, then Object.prototype, then stops at null. Python's version of this is the MRO (method resolution order) you'll see on Day 9.</div>`,

  "generators-vs-list": `
    <div class="diagram-title">a list builds everything now — a generator builds one value at a time, on demand</div>
    <div class="diagram-cols">
      <div class="diagram-col">
        <h4>list comprehension</h4>
        <div class="dsteps" style="--steps:3; --dur:6s">
          <div class="dstep" style="--i:0"><b>1</b> compute item 0, 1, 2 ... ALL of them, right now</div>
          <div class="dstep" style="--i:1"><b>2</b> store the entire result in memory at once</div>
          <div class="dstep" style="--i:2"><b>3</b> hand the caller the full, finished list</div>
        </div>
      </div>
      <div class="diagram-col">
        <h4>generator</h4>
        <div class="dsteps" style="--steps:3; --dur:6s">
          <div class="dstep" style="--i:0"><b>1</b> caller asks for the next value with next()</div>
          <div class="dstep" style="--i:1"><b>2</b> generator computes JUST that one value, then pauses</div>
          <div class="dstep" style="--i:2"><b>3</b> repeat — nothing beyond "the current item" ever sits in memory</div>
        </div>
      </div>
    </div>
    <div class="diagram-cap">This is why generators can represent infinite or huge sequences (reading a 10GB file line by line) without ever running out of memory.</div>`,

  "closures": `
    <div class="diagram-title">a closure remembers the variables that were in scope when it was created</div>
    <svg viewBox="0 0 420 160" width="420" height="160">
      <rect x="10" y="10" width="400" height="70" rx="8" fill="#1a2348" stroke="#38bdf8" stroke-width="2"/>
      <text x="20" y="30" fill="#38bdf8" font="700 12px monospace">function makeCounter() { let count = 0; ... }</text>
      <text x="20" y="52" fill="#a3adc9" font="12px monospace">returns an inner function that can still see "count"</text>
      <path d="M100,80 V115" stroke="#3ee08c" stroke-width="2" marker-end="url(#arrowc)"/>
      <rect x="30" y="118" width="150" height="34" rx="6" fill="#1a2348" stroke="#3ee08c" stroke-width="2" class="diag-pulse"/>
      <text x="105" y="140" text-anchor="middle" fill="#3ee08c" font="700 11px monospace">closure #1 — count: 2</text>
      <path d="M320,80 V115" stroke="#c792ea" stroke-width="2" marker-end="url(#arrowc2)"/>
      <rect x="250" y="118" width="150" height="34" rx="6" fill="#1a2348" stroke="#c792ea" stroke-width="2" class="diag-pulse" style="animation-delay:1s"/>
      <text x="325" y="140" text-anchor="middle" fill="#c792ea" font="700 11px monospace">closure #2 — count: 0</text>
      <defs>
        <marker id="arrowc" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#3ee08c"/></marker>
        <marker id="arrowc2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#c792ea"/></marker>
      </defs>
    </svg>
    <div class="diagram-cap">Each call to makeCounter() creates a brand new, private "count" — the two closures never share state, even though they came from the same function.</div>`,
};

function diagramHTML(key) {
  const body = DIAGRAMS[key.trim()];
  return body ? `<div class="diagram-wrap">${body}</div>`
              : `<div class="diagram-wrap diagram-missing">[missing diagram: ${escapeHtml(key)}]</div>`;
}

/* ================= markdown renderer ================= */
function inlineMd(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}

function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  let blockId = 0;

  const flushList = (items, ordered) =>
    out.push(`<${ordered ? "ol" : "ul"}>${items.map((x) => `<li>${x}</li>`).join("")}</${ordered ? "ol" : "ul"}>`);

  while (i < lines.length) {
    const line = lines[i];

    const fence = line.match(/^```\s*(\w*)/);
    if (fence) {
      const lang = (fence[1] || "").toLowerCase();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      const code = buf.join("\n");
      if (lang === "diagram") { out.push(diagramHTML(code)); continue; }
      const runnable = FENCE_LANG[lang] || null;
      const id = `cb${blockId++}`;
      const tryBtn = runnable
        ? `<button class="tryit" data-code-id="${id}" data-lang="${runnable}">▶ Try it</button>`
        : "";
      const highlighted = runnable ? highlightCode(code, runnable) : escapeHtml(code);
      out.push(
        `<div class="codeblock">${tryBtn}<pre><code id="${id}" data-raw="${escapeHtml(code)}">${highlighted}</code></pre></div>`
      );
      continue;
    }

    if (/^\s*$/.test(line)) { i++; continue; }

    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) { out.push(`<h${h[1].length}>${inlineMd(h[2])}</h${h[1].length}>`); i++; continue; }

    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote>${buf.map(inlineMd).join("<br>")}</blockquote>`);
      continue;
    }

    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => inlineMd(c.trim()));
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      out.push("<table><thead><tr>" + head.map((c) => `<th>${c}</th>`).join("") + "</tr></thead><tbody>"
        + body.map((r) => "<tr>" + r.map((c) => `<td>${c}</td>`).join("") + "</tr>").join("")
        + "</tbody></table>");
      continue;
    }

    const ul = line.match(/^(\s*)[-*]\s+(.*)/);
    const ol = line.match(/^(\s*)\d+[.)]\s+(.*)/);
    if (ul || ol) {
      const ordered = !!ol;
      const items = [];
      while (i < lines.length) {
        const m = ordered ? lines[i].match(/^\s*\d+[.)]\s+(.*)/) : lines[i].match(/^\s*[-*]\s+(.*)/);
        if (m) { items.push(inlineMd(m[1])); i++; }
        else if (/^\s{2,}\S/.test(lines[i]) && items.length) {
          items[items.length - 1] += "<br>" + inlineMd(lines[i].trim()); i++;
        } else break;
      }
      flushList(items, ordered);
      continue;
    }

    const buf = [line];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,4}\s|```|>|\s*[-*]\s|\s*\d+[.)]\s|\s*\|)/.test(lines[i]))
      buf.push(lines[i++]);
    out.push(`<p>${buf.map(inlineMd).join(" ")}</p>`);
  }
  return out.join("\n");
}

/* ================= API ================= */
const api = {
  courses: () => fetch("/api/courses").then((r) => r.json()),
  file: (path) => fetch(`/api/file?path=${encodeURIComponent(path)}`).then((r) => r.json()),
  run: (lang, code, stdin) =>
    fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, code, stdin }),
    }).then((r) => r.json()),
  version: () => fetch("/api/version").then((r) => r.json()),
  applyUpdate: () => fetch("/api/apply-update", { method: "POST" }).then((r) => r.json()),
};

/* ================= tabs ================= */
const TAB_GROUPS = [
  { id: "home", label: "Home", kind: "flat", accent: "#38bdf8" },
  { id: "tracks", label: "Tracks", kind: "group",
    children: () => state.courses.map((c) => ({ id: c.id, label: c.title, accent: c.accent })) },
  { id: "practice", label: "Practice", kind: "group",
    children: () => [
      { id: "quizzes", label: "Quizzes", accent: "#c792ea" },
      { id: "flashcards", label: "Flashcards", accent: "#c792ea" },
      { id: "workshop", label: "Workshop", accent: "#facc15" },
      { id: "project", label: "Project", accent: "#3ee08c" },
    ] },
];

function renderTabs() {
  const nav = $("#tabs");
  nav.innerHTML = "";
  for (const g of TAB_GROUPS) {
    if (g.kind === "flat") {
      const b = document.createElement("button");
      b.className = "tab" + (state.activeTab === g.id ? " active" : "");
      b.textContent = g.label;
      if (g.accent) b.style.setProperty("--tab-accent", g.accent);
      b.onclick = () => switchTab(g.id);
      nav.appendChild(b);
      continue;
    }
    const children = g.children();
    const activeChild = children.find((c) => c.id === state.activeTab);
    const wrap = document.createElement("div");
    wrap.className = "tab-group";
    const gbtn = document.createElement("button");
    gbtn.className = "tab tab-group-btn" + (activeChild ? " active" : "");
    gbtn.innerHTML = `${escapeHtml(activeChild ? activeChild.label : g.label)} <span class="tab-caret">▾</span>`;
    if (activeChild && activeChild.accent) gbtn.style.setProperty("--tab-accent", activeChild.accent);
    gbtn.onclick = (e) => {
      e.stopPropagation();
      const isOpen = wrap.classList.contains("open");
      document.querySelectorAll(".tab-group.open").forEach((el) => el.classList.remove("open"));
      if (!isOpen) wrap.classList.add("open");
    };
    const dd = document.createElement("div");
    dd.className = "tab-dropdown";
    for (const c of children) {
      const item = document.createElement("button");
      item.className = "tab-dropdown-item" + (c.id === state.activeTab ? " active" : "");
      item.textContent = c.label;
      if (c.accent) item.style.setProperty("--item-accent", c.accent);
      item.onclick = () => { wrap.classList.remove("open"); switchTab(c.id); };
      dd.appendChild(item);
    }
    wrap.appendChild(gbtn);
    wrap.appendChild(dd);
    nav.appendChild(wrap);
  }
}
document.addEventListener("click", () => document.querySelectorAll(".tab-group.open").forEach((el) => el.classList.remove("open")));

function switchTab(id) {
  state.activeTab = id;
  renderTabs();
  const home = id === "home";
  const workshop = id === "workshop";
  const project = id === "project";
  const flashcards = id === "flashcards";
  const quizzes = id === "quizzes";
  $("#view-home").hidden = !home;
  $("#view-workshop").hidden = !workshop;
  $("#view-project").hidden = !project;
  $("#view-flashcards").hidden = !flashcards;
  $("#view-quizzes").hidden = !quizzes;
  $("#view-course").hidden = !(!home && !workshop && !project && !flashcards && !quizzes);
  if (home) { renderHome(); return; }
  if (workshop) { initWorkshop(); return; }
  if (project) { initProjectWorkspace(); return; }
  if (flashcards) { initFlashcards(); return; }
  if (quizzes) { initQuizzes(); return; }
  const course = state.courses.find((c) => c.id === id);
  $("#run-lang").value = DEFAULT_LANG[id] || "python";
  refreshEditorHighlight();
  renderSidebar(course);
  const last = localStorage.getItem(`hub-lastday:${id}`);
  openDay(course, last && course.days.some((d) => d.id === last) ? last : null);
}

/* ================= home ================= */
function renderHome() {
  const wrap = $("#course-cards");
  wrap.innerHTML = "";
  for (const c of state.courses) {
    const p = courseProgress(c);
    const next = c.days.find((d) => !isDone(c.id, d.id));
    const card = document.createElement("div");
    card.className = "course-card";
    card.style.setProperty("--card-accent", c.accent);
    card.style.setProperty("--card-shadow", c.accent + "44");
    card.innerHTML = `
      <span class="card-icon">${courseLogo(c)}</span>
      <h3>${c.title}</h3>
      <p>${c.tagline}</p>
      <div class="meta"><span>${c.days.length} lessons</span>
      <span class="pct">${p.done}/${p.total} done</span></div>
      <div class="progress-bar"><div style="width:${p.pct}%"></div></div>
      <div class="resume">${p.done === 0 ? "Start course →" : p.done === p.total ? "Course complete!" : `Continue: ${escapeHtml(next.title)} →`}</div>`;
    card.onclick = () => switchTab(c.id);
    wrap.appendChild(card);
  }
  const isNew = getXP() === 0 && state.courses.every((c) => courseProgress(c).done === 0);
  $("#welcome-callout").hidden = !isNew || localStorage.getItem("hub-welcome-dismissed") === "1";
  renderWeekTracker();
}

function renderWeekTracker() {
  const wrap = $("#week-tracker");
  if (!wrap) return;
  const log = getXpDaily();
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  let weekTotal = 0;
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const xp = log[key] || 0;
    weekTotal += xp;
    days.push({ xp, isToday: key === todayKey, label: dayLabels[i] });
  }
  const maxXP = Math.max(1, ...days.map((d) => d.xp));
  wrap.innerHTML = `
    <div class="week-head"><span class="week-total"><b>${weekTotal} XP</b> earned this week</span></div>
    <div class="week-bars">
      ${days.map((d) => `
        <div class="week-col">
          <div class="week-bar-track"><div class="week-bar${d.xp ? "" : " empty"}${d.isToday ? " today" : ""}"
            style="height:${d.xp ? Math.max(10, Math.round((d.xp / maxXP) * 100)) : 4}%" title="${d.xp} XP"></div></div>
          <span class="week-day-label${d.isToday ? " today" : ""}">${d.label}</span>
        </div>`).join("")}
    </div>`;
}

/* hero terminal typing animation */
function heroAnimation() {
  const seq = [
    { cls: "prompt", text: "$ ", instant: true },
    { cls: "", text: 'python -c "print(\'hello, future dev\')"', type: true },
    { cls: "out", text: "\nhello, future dev\n", instant: true, delay: 400 },
    { cls: "prompt", text: "$ ", instant: true, delay: 500 },
  ];
  const el = $("#term-body");
  el.innerHTML = "";
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  el.appendChild(cursor);
  let idx = 0;
  function next() {
    if (idx >= seq.length) return;
    const step = seq[idx++];
    const span = document.createElement("span");
    if (step.cls) span.className = step.cls;
    el.insertBefore(span, cursor);
    if (step.type) {
      let i = 0;
      const tick = setInterval(() => {
        span.textContent += step.text[i++];
        if (i >= step.text.length) { clearInterval(tick); setTimeout(next, step.delay || 120); }
      }, 42);
    } else {
      setTimeout(() => { span.textContent = step.text; setTimeout(next, step.delay || 80); }, step.delay || 60);
    }
  }
  setTimeout(next, 500);
}

/* ================= sidebar ================= */
function renderSidebar(course) {
  const p = courseProgress(course);
  $("#sidebar-head").innerHTML = `
    <div class="course-name-row">${courseLogo(course)}<div class="course-name">${course.title}</div></div>
    <div class="course-progress">${p.done} of ${p.total} lessons complete</div>
    <div class="progress-bar"><div style="width:${p.pct}%;background:${course.accent}"></div></div>`;
  const ul = $("#day-list");
  ul.innerHTML = "";

  const liOverview = document.createElement("li");
  liOverview.dataset.day = "";
  const bo = document.createElement("button");
  bo.innerHTML = `<span class="day-num">☰</span><span>Course overview</span>`;
  bo.onclick = () => openDay(course, null);
  liOverview.appendChild(bo);
  ul.appendChild(liOverview);

  for (const d of course.days) {
    const li = document.createElement("li");
    li.dataset.day = d.id;
    const b = document.createElement("button");
    const done = isDone(course.id, d.id);
    b.innerHTML =
      `<span class="day-num">${d.num ?? ""}</span><span>${escapeHtml(d.title)}</span>` +
      (done ? `<span class="day-done">✓</span>` : "");
    b.onclick = () => openDay(course, d.id);
    li.appendChild(b);
    ul.appendChild(li);
  }
  highlightDay();
}

function highlightDay() {
  document.querySelectorAll("#day-list li").forEach((li) =>
    li.classList.toggle("active", (li.dataset.day || "") === (state.activeDay || "")));
}

/* ================= lesson pane ================= */
async function openDay(course, dayId) {
  state.activeDay = dayId;
  if (dayId) localStorage.setItem(`hub-lastday:${course.id}`, dayId);
  highlightDay();

  const toolbar = $("#lesson-toolbar");
  toolbar.innerHTML = "";

  if (!dayId) {
    $("#lesson-body").innerHTML = renderMarkdown(course.readme || "*No README found.*");
    $("#lesson-body").scrollTop = 0;
    wireTryButtons();
    return;
  }

  const day = course.days.find((d) => d.id === dayId);
  const ordered = [...day.files].sort((a, b) => {
    const rank = (f) => (f.name === "lesson.md" ? 0 : /solution/i.test(f.name) ? 2 : 1);
    return rank(a) - rank(b) || a.name.localeCompare(b.name);
  });

  for (const f of ordered) {
    const btn = document.createElement("button");
    btn.className = "file-btn";
    btn.textContent = f.name;
    btn.dataset.path = f.path;
    btn.onclick = () => openFile(course, day, f, btn);
    toolbar.appendChild(btn);
  }

  const doneBtn = document.createElement("button");
  const done = isDone(course.id, day.id);
  doneBtn.className = "done-toggle" + (done ? " done" : "");
  doneBtn.textContent = done ? "✓ Completed" : "Mark complete";
  doneBtn.onclick = () => {
    const nowDone = !isDone(course.id, day.id);
    setDone(course.id, day.id, nowDone);
    if (nowDone) { addXP(50, `finished ${day.title}`); confetti(); }
    renderSidebar(course);
    openDay(course, day.id);
  };
  toolbar.appendChild(doneBtn);

  const lesson = ordered.find((f) => f.name === "lesson.md") || ordered[0];
  openFile(course, day, lesson, toolbar.querySelector(`[data-path="${CSS.escape(lesson.path)}"]`));
}

async function openFile(course, day, f, btn) {
  // Soft gate on solutions: first click arms the button, second click opens.
  if (/solution/i.test(f.name) && btn && btn.dataset.armed !== "1") {
    btn.dataset.armed = "1";
    const original = btn.textContent;
    btn.textContent = "Sure? Try 10–15 min first — click again to peek";
    toast("Struggling a bit first is where the learning happens");
    setTimeout(() => { btn.dataset.armed = ""; btn.textContent = original; }, 6000);
    return;
  }
  state.activeFile = f.path;
  document.querySelectorAll("#lesson-toolbar .file-btn").forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const body = $("#lesson-body");
  body.innerHTML = `<p class="sys">Loading…</p>`;
  const res = await api.file(f.path);
  if (res.error) { body.innerHTML = `<p>⚠ Could not load ${escapeHtml(f.path)}</p>`; return; }

  const isExercise = /exercise|starter/i.test(f.name);
  const isSolution = /solution/i.test(f.name);
  const rawBlock = (lang) =>
    `<h2>${escapeHtml(f.name)}</h2>
     <div class="codeblock"><pre><code>${highlightCode(res.content, lang)}</code></pre></div>`;

  if (f.name.endsWith(".md")) {
    body.innerHTML = renderMarkdown(res.content);
  } else if (isExercise && /\.(py|js|ts)$/i.test(f.name)) {
    const lang = extLang(f.name);
    const cards = parseCodeGuide(res.content, lang);
    body.innerHTML = cards
      ? renderAssignmentGuide(cards) +
        `<p><button class="file-btn" id="load-into-editor">View raw source →</button></p>`
      : rawBlock(lang);
    if (cards) $("#load-into-editor").onclick = () => { body.innerHTML = rawBlock(lang); body.scrollTop = 0; };
    loadEditor(res.content, lang, f.path);
  } else if (isExercise && /\.html$/i.test(f.name)) {
    const lang = extLang(f.name);
    const checklist = day.files.find((x) => /^checklist\.md$/i.test(x.name));
    if (checklist) {
      const cres = await api.file(checklist.path);
      body.innerHTML =
        `<div class="assignment-guide-head">Assignment guide — build this in the editor on the right, check off each item below →</div>
         ${renderMarkdown(cres.content)}
         <p><button class="file-btn" id="load-into-editor">View raw source →</button></p>`;
      $("#load-into-editor").onclick = () => { body.innerHTML = rawBlock(lang); body.scrollTop = 0; };
    } else {
      body.innerHTML = rawBlock(lang);
    }
    loadEditor(res.content, lang, f.path);
  } else {
    const lang = extLang(f.name);
    body.innerHTML =
      `${isSolution ? '<div class="solution-note">Example — read only, not your assignment</div>' : ""}
       <h2>${escapeHtml(f.name)}</h2>
       <p><button class="file-btn" id="load-into-editor">Open in editor →</button></p>
       <div class="codeblock"><pre><code>${highlightCode(res.content, lang)}</code></pre></div>`;
    $("#load-into-editor").onclick = () => loadEditor(res.content, lang, f.path);
  }
  body.scrollTop = 0;
  wireTryButtons();
}

/* ================= assignment guide (exercise-file → numbered spec cards) ================= */
function parseCodeGuide(content, lang) {
  const isPy = lang === "python";
  return parseTopLevelDefs(content, isPy) || parseClassBased(content, isPy);
}

function parseTopLevelDefs(content, isPy) {
  const defRe = isPy
    ? /^def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:\s*\n/gm
    : /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*(?::\s*[^{]+)?\{\s*\n/gm;
  const matches = [...content.matchAll(defRe)];
  if (!matches.length) return null;

  const cards = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const name = m[1];
    if (/^(check|main)$/i.test(name)) continue;
    const params = m[2].trim();
    const bodyStart = m.index + m[0].length;
    const bodyEnd = i + 1 < matches.length ? matches[i + 1].index : content.length;
    let body = content.slice(bodyStart, bodyEnd);
    body = body.split(/\n[ \t]*#[ \t]*-{5,}/)[0]
               .split(/\nif __name__/)[0]
               .split(/\n[ \t]*\/\/[ \t]*-{5,}/)[0];

    let spec = "";
    if (isPy) {
      const docMatch = body.match(/^\s*("""|''')([\s\S]*?)\1/);
      if (docMatch) {
        spec = docMatch[2].trim().replace(/[ \t]*\n[ \t]*/g, " ");
      } else {
        spec = leadingComments(body, "#");
      }
    } else {
      spec = leadingComments(body, "//");
    }
    if (!spec) spec = "(no description found in comments — read the source)";
    cards.push({ name, params, spec });
  }
  return cards.length ? cards : null;
}

/* class-based exercises (methods inside a class, no top-level def/function) */
function parseClassBased(content, isPy) {
  const classRe = isPy
    ? /^class\s+([A-Za-z_]\w*)\s*(?:\([^)]*\))?\s*:\s*\n/gm
    : /^class\s+([A-Za-z_$][\w$]*)(?:\s+extends\s+[\w$.]+)?\s*\{\s*\n/gm;
  const classMatches = [...content.matchAll(classRe)];
  if (!classMatches.length) return null;

  const cards = [];
  for (let i = 0; i < classMatches.length; i++) {
    const cm = classMatches[i];
    const className = cm[1];
    const bodyStart = cm.index + cm[0].length;
    const bodyEnd = i + 1 < classMatches.length ? classMatches[i + 1].index : content.length;
    const body = content.slice(bodyStart, bodyEnd);

    if (isPy) {
      const docMatch = body.match(/^\s*("""|''')([\s\S]*?)\1/);
      if (docMatch) {
        cards.push({ name: className, params: "", spec: docMatch[2].trim().replace(/[ \t]*\n[ \t]*/g, " ") });
        continue;
      }
      const methodRe = /^[ \t]+def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:\s*\n/gm;
      const mms = [...body.matchAll(methodRe)];
      for (let j = 0; j < mms.length; j++) {
        const mm = mms[j];
        const mStart = mm.index + mm[0].length;
        const mEnd = j + 1 < mms.length ? mms[j + 1].index : body.length;
        const mBody = body.slice(mStart, mEnd);
        const mDoc = mBody.match(/^\s*("""|''')([\s\S]*?)\1/);
        const spec = mDoc ? mDoc[2].trim().replace(/[ \t]*\n[ \t]*/g, " ") : leadingComments(mBody, "#");
        cards.push({
          name: `${className}.${mm[1]}`, params: mm[2].trim(),
          spec: spec || "(no description found in comments — read the source)",
        });
      }
    } else {
      const methodRe = /^[ \t]+(?:(get|set)\s+)?(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*(?::\s*[^{]+)?\{\s*\n/gm;
      const mms = [...body.matchAll(methodRe)];
      for (let j = 0; j < mms.length; j++) {
        const mm = mms[j];
        const mName = mm[2];
        if (["if", "for", "while", "switch", "catch", "function"].includes(mName)) continue;
        const mStart = mm.index + mm[0].length;
        const mEnd = j + 1 < mms.length ? mms[j + 1].index : body.length;
        const mBody = body.slice(mStart, mEnd);
        const spec = leadingComments(mBody, "//");
        cards.push({
          name: `${className}.${mm[1] ? mm[1] + " " : ""}${mName}`, params: mm[3].trim(),
          spec: spec || "(no description found in comments — read the source)",
        });
      }
    }
  }
  return cards.length ? cards : null;
}

function leadingComments(body, marker) {
  const lines = body.split("\n");
  const out = [];
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith(marker)) {
      const text = t.slice(marker.length).trim();
      if (!/^TODO\b/i.test(text)) out.push(text);
    } else if (t === "") continue;
    else break;
  }
  return out.join(" ");
}

function renderAssignmentGuide(cards) {
  const cardsHtml = cards.map((c, i) => `
    <div class="ex-card">
      <div class="ex-card-head"><span class="ex-card-num">${i + 1}</span><code class="ex-card-title">${escapeHtml(c.name)}(${escapeHtml(c.params)})</code></div>
      <div class="ex-card-spec"><p>${escapeHtml(c.spec)}</p></div>
    </div>`).join("");
  return `<div class="assignment-guide">
    <div class="assignment-guide-head">Assignment guide — write the code for each item below in the editor on the right →</div>
    ${cardsHtml}
  </div>`;
}

function extLang(name) {
  if (name.endsWith(".py")) return "python";
  if (name.endsWith(".ts")) return "ts";
  if (name.endsWith(".js") || name.endsWith(".cjs") || name.endsWith(".mjs")) return "js";
  if (name.endsWith(".html") || name.endsWith(".css") || name.endsWith(".ui")) return "html";
  return DEFAULT_LANG[state.activeTab] || "python";
}

function wireTryButtons() {
  document.querySelectorAll("#lesson-body .tryit").forEach((btn) => {
    btn.onclick = () => {
      const codeEl = document.getElementById(btn.dataset.codeId);
      loadEditor(codeEl.getAttribute("data-raw"), btn.dataset.lang, null);
      toast("Loaded into the editor — press ▶ Run!");
    };
  });
}

/* ================= editor & runner ================= */
function loadEditor(code, lang, fileLabel) {
  $("#editor").value = code;
  if (lang) $("#run-lang").value = lang;
  state.editorFile = fileLabel;
  $("#editor-file-label").textContent = fileLabel || "(scratchpad)";
  refreshEditorHighlight();
}

function showPane(which) {
  // which: "output" | "preview" | "feedback" | "compare"
  $("#output").hidden = which !== "output";
  $("#preview-wrap").hidden = which !== "preview";
  $("#feedback").hidden = which !== "feedback";
  $("#compare").hidden = which !== "compare";
  $("#course-width-btns").hidden = which !== "preview";
  $("#output-title").textContent =
    which === "feedback" ? "Feedback" : which === "compare" ? "Compare" : "Output";
}

function setOutputHTML(html) {
  $("#output").innerHTML = html;
  showPane("output");
}

/* Injects a hover-tracking script into an HTML doc's srcdoc so the preview
   iframe shows a live content/padding/border/margin readout -- the "Box Model
   Inspector" tool. Self-contained, no external deps. */
const INSPECTOR_SCRIPT = `<script>(function(){
  var badge = document.createElement('div');
  badge.style.cssText = 'position:fixed;z-index:999999;background:#0b0e1f;color:#3ee08c;font:11px Consolas,monospace;padding:6px 10px;border-radius:6px;pointer-events:none;white-space:pre;box-shadow:0 4px 12px rgba(0,0,0,.5);border:1px solid #3ee08c;display:none';
  document.documentElement.appendChild(badge);
  var lastEl = null;
  document.addEventListener('mouseover', function(e){
    var el = e.target;
    if (el === document.documentElement || el === document.body || el === badge) return;
    lastEl = el;
    var cs = getComputedStyle(el);
    badge.textContent = '<' + el.tagName.toLowerCase() + '>\\n' +
      'content: ' + el.clientWidth + ' x ' + el.clientHeight + '\\n' +
      'padding: ' + cs.paddingTop + ' ' + cs.paddingRight + ' ' + cs.paddingBottom + ' ' + cs.paddingLeft + '\\n' +
      'border: ' + cs.borderTopWidth + ' ' + cs.borderRightWidth + ' ' + cs.borderBottomWidth + ' ' + cs.borderLeftWidth + '\\n' +
      'margin: ' + cs.marginTop + ' ' + cs.marginRight + ' ' + cs.marginBottom + ' ' + cs.marginLeft;
    badge.style.display = 'block';
    el.style.outline = '2px dashed #38bdf8';
    el.style.outlineOffset = '-1px';
  });
  document.addEventListener('mousemove', function(e){
    badge.style.left = Math.min(e.clientX + 16, innerWidth - 220) + 'px';
    badge.style.top = Math.min(e.clientY + 16, innerHeight - 90) + 'px';
  });
  document.addEventListener('mouseout', function(e){
    if (lastEl) { lastEl.style.outline = ''; lastEl = null; }
    badge.style.display = 'none';
  });
})();<\/script>`;

function withInspector(code, enabled) {
  if (!enabled) return code;
  return /<\/body>/i.test(code)
    ? code.replace(/<\/body>/i, INSPECTOR_SCRIPT + "</body>")
    : code + INSPECTOR_SCRIPT;
}

function colorizeRunOutput(res) {
  let html = "";
  if (res.stdout) {
    html += escapeHtml(res.stdout)
      .replace(/^PASS: .*$/gm, (m) => `<span class="pass-line">✓ ${m.slice(6)}</span>`)
      .replace(/^FAIL: .*$/gm, (m) => `<span class="fail-line">✗ ${m.slice(6)}</span>`);
  }
  if (res.stderr) html += `<span class="err">${escapeHtml(res.stderr)}</span>`;
  if (res.timedOut) html += `<span class="err">\n⏱ Timed out after 15s (infinite loop? waiting for input?)</span>`;
  if (!html) html = `<span class="sys">(program finished with no output — exit code ${res.exit})</span>`;
  return html;
}

async function execEditor() {
  const code = $("#editor").value;
  const lang = $("#run-lang").value;
  const res = await api.run(lang, code, $("#stdin-box").value);
  touchStreak(); renderStats();
  return res;
}

async function runCode() {
  const code = $("#editor").value;
  const lang = $("#run-lang").value;
  if (!code.trim()) { setOutputHTML(`<span class="sys">Nothing to run — the editor is empty.</span>`); return; }

  if (lang === "html") {
    $("#preview").srcdoc = withInspector(code, $("#inspector-toggle").checked);
    showPane("preview");
    touchStreak(); renderStats();
    return;
  }

  const btn = $("#btn-run");
  btn.disabled = true;
  setOutputHTML(`<span class="sys">Running…</span>`);
  try {
    const res = await execEditor();
    if (res.error) { setOutputHTML(`<span class="err">${escapeHtml(res.error)}</span>`); return; }
    setOutputHTML(colorizeRunOutput(res));
  } catch (e) {
    setOutputHTML(`<span class="err">Could not reach the local server: ${escapeHtml(String(e))}</span>`);
  } finally {
    btn.disabled = false;
  }
}

/* ================= answer checking ================= */

/* Friendly explanations for common errors. Each entry: [regex, explain(match) -> html] */
const PY_ERRORS = [
  [/IndentationError: (.*)/, (m) => `<b>Indentation problem.</b> Python uses spaces at the start of a line to know what belongs to what. ${escapeHtml(m[1])}. Make sure every line inside a function/if/loop is indented by 4 spaces, consistently.`],
  [/SyntaxError: invalid syntax/, () => `<b>Python couldn't understand this line.</b> Usual suspects: a missing colon <code>:</code> at the end of a <code>def</code>/<code>if</code>/<code>for</code> line, unbalanced parentheses, or a typo in a keyword.`],
  [/SyntaxError: (.*)/, (m) => `<b>Syntax error:</b> ${escapeHtml(m[1])}. Python couldn't even start running — check the line indicated for typos, missing quotes, colons, or brackets.`],
  [/NameError: name '(\w+)' is not defined/, (m) => `<b>You used <code>${m[1]}</code>, but it doesn't exist yet.</b> Either it's a typo (check spelling and capitalization), or you're using it before creating it.`],
  [/AttributeError: 'NoneType' object has no attribute '(\w+)'/, (m) => `<b>Something is <code>None</code> when you expected a real value.</b> You called <code>.${m[1]}</code> on it. A common cause: a function that forgot to <code>return</code> (it returns <code>None</code> by default).`],
  [/AttributeError: '(\w+)' object has no attribute '(\w+)'/, (m) => `<b>A <code>${m[1]}</code> doesn't have <code>.${m[2]}</code>.</b> Check the spelling, or check that the value is the type you think it is.`],
  [/TypeError: can only concatenate str/, () => `<b>You tried to glue a string to a number with <code>+</code>.</b> Convert first: <code>str(number)</code>, or use an f-string: <code>f"age: {age}"</code>.`],
  [/TypeError: '(\w+)' object is not callable/, (m) => `<b>You put <code>()</code> after something that isn't a function</b> (it's a <code>${m[1]}</code>). Did you accidentally reuse a function's name for a variable?`],
  [/TypeError: (.*)/, (m) => `<b>Type mismatch:</b> ${escapeHtml(m[1])}. A value is the wrong type for what you're doing with it — print it with <code>print(type(x))</code> to investigate.`],
  [/IndexError: (.*)/, (m) => `<b>You reached past the end of a list.</b> ${escapeHtml(m[1])}. Remember indexes start at 0, so a list of 3 items has indexes 0, 1, 2.`],
  [/KeyError: (.*)/, (m) => `<b>That key isn't in the dictionary:</b> <code>${escapeHtml(m[1])}</code>. Check spelling, or use <code>.get(key)</code> which returns <code>None</code> instead of crashing.`],
  [/ValueError: (.*)/, (m) => `<b>Right type, wrong value:</b> ${escapeHtml(m[1])}. E.g. <code>int("hello")</code> — the function can't do anything sensible with that particular value.`],
  [/ZeroDivisionError/, () => `<b>You divided by zero.</b> Somewhere a denominator is 0 — guard it with an <code>if</code> first.`],
  [/RecursionError/, () => `<b>A function kept calling itself forever.</b> Make sure your recursion has a base case that stops it.`],
  [/ModuleNotFoundError: No module named '(\w+)'/, (m) => `<b>The module <code>${m[1]}</code> isn't installed</b> (or the name is misspelled). The lesson will say if you need to <code>pip install</code> something.`],
];

const JS_ERRORS = [
  [/ReferenceError: (\w+) is not defined/, (m) => `<b>You used <code>${m[1]}</code>, but it doesn't exist.</b> Check the spelling and capitalization (JS is case-sensitive), or declare it first with <code>const</code>/<code>let</code>.`],
  [/TypeError: Cannot read propert(?:y|ies) of undefined \(reading '(\w+)'\)/, (m) => `<b>Something is <code>undefined</code> when you expected a real value</b> — you asked for <code>.${m[1]}</code> on it. Common cause: a function with no <code>return</code>, or a misspelled variable/property before this point.`],
  [/TypeError: Cannot read propert(?:y|ies) of null \(reading '(\w+)'\)/, (m) => `<b>Something is <code>null</code></b> — you asked for <code>.${m[1]}</code> on it. Trace back to where that value was created.`],
  [/TypeError: (\w+(?:\.\w+)*) is not a function/, (m) => `<b><code>${m[1]}</code> isn't a function.</b> Either it's a typo, or the value isn't what you think — <code>console.log(typeof ${m[1].split(".")[0]})</code> to check.`],
  [/SyntaxError: Unexpected token (.*)/, (m) => `<b>JavaScript hit something it didn't expect:</b> <code>${escapeHtml(m[1])}</code>. Usually an unbalanced bracket <code>{ } ( )</code> or a missing comma/quote just before that spot.`],
  [/SyntaxError: (.*)/, (m) => `<b>Syntax error:</b> ${escapeHtml(m[1])}. The code couldn't even start — check brackets, quotes, and commas near the line shown.`],
  [/error TS(\d+): (.*)/, (m) => `<b>TypeScript check failed (TS${m[1]}):</b> ${escapeHtml(m[2])}. The types don't line up — read what it expected vs. what it got.`],
];

function explainError(stderr, lang) {
  const table = lang === "python" ? PY_ERRORS : JS_ERRORS;
  for (const [re, fn] of table) {
    const m = stderr.match(re);
    if (m) return fn(m);
  }
  return null;
}

function errorLineInfo(stderr, lang) {
  let m;
  if (lang === "python") m = stderr.match(/line (\d+)/);
  else m = stderr.match(/main\.(?:js|ts|compiled\.cjs):(\d+)/) || stderr.match(/\((\d+),\d+\)/);
  return m ? parseInt(m[1], 10) : null;
}

/* Pull the hint/docstring for the function a failing check refers to. */
function extractHint(source, label) {
  const fnName = (label.trim().split(/\s+/)[0] || "").replace(/[^\w]/g, "");
  if (!fnName) return null;
  const lines = source.split("\n");
  const defRe = new RegExp(`^\\s*(def\\s+${fnName}\\s*\\(|function\\s+${fnName}\\s*\\(|(?:const|let)\\s+${fnName}\\s*=)`);
  let start = lines.findIndex((l) => defRe.test(l));
  if (start === -1) return null;
  const body = [];
  for (let i = start + 1; i < Math.min(start + 15, lines.length); i++) {
    if (/^\s*(def |function |const |let )/.test(lines[i]) && body.length) break;
    body.push(lines[i]);
  }
  const bodyText = body.join("\n");
  const notImplemented = /TODO/.test(bodyText) &&
    (/^\s*(pass\s*)?$/m.test(bodyText) || !/return/.test(bodyText));
  const hintLine = body.find((l) => /hint:/i.test(l));
  const hint = hintLine ? hintLine.replace(/^[\s#/*"']+/, "").trim() : null;
  return { fnName, notImplemented, hint };
}

const PRAISE = [
  "Flawless run — every check passed!",
  "All green! You crushed it.",
  "Perfect score — on to the next one!",
  "Every single check passed. Nicely done.",
];
const ENCOURAGE = [
  "Almost there — debugging is where real devs are made.",
  "Good progress! Read the reasons below and try again.",
  "Not yet — but every failed check tells you exactly what to fix.",
  "Keep going — you're closer than it feels.",
];
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

async function checkAnswer() {
  const code = $("#editor").value;
  const lang = $("#run-lang").value;
  if (!code.trim()) { setOutputHTML(`<span class="sys">Nothing to check — the editor is empty.</span>`); return; }

  if (lang === "html") { await checkHtml(code); return; }

  const btn = $("#btn-check");
  btn.disabled = true;
  const fb = $("#feedback");
  fb.innerHTML = `<div class="fb-banner info"><span class="fb-emoji">⏳</span>Running your code and grading it…</div>`;
  showPane("feedback");

  try {
    const res = await execEditor();
    if (res.error) {
      fb.innerHTML = `<div class="fb-banner bad"><span class="fb-emoji">⚠</span>${escapeHtml(res.error)}</div>`;
      return;
    }
    renderFeedback(res, code, lang);
  } catch (e) {
    fb.innerHTML = `<div class="fb-banner bad"><span class="fb-emoji">⚠</span>Could not reach the local server: ${escapeHtml(String(e))}</div>`;
  } finally {
    btn.disabled = false;
  }
}

function renderFeedback(res, code, lang) {
  const fb = $("#feedback");
  const out = res.stdout || "";
  const results = [];
  for (const line of out.split("\n")) {
    const m = line.match(/^(PASS|FAIL): (.*)$/);
    if (m) results.push({ ok: m[1] === "PASS", label: m[2] });
  }

  // Case 1: the program crashed
  if (res.timedOut || (res.stderr && res.exit !== 0)) {
    const lineNo = res.stderr ? errorLineInfo(res.stderr, lang) : null;
    const srcLine = lineNo ? (code.split("\n")[lineNo - 1] || "").trim() : null;
    const why = res.timedOut
      ? `<b>Your program never finished</b> — it ran for 15 seconds and had to be stopped. Usual causes: a <code>while</code> loop whose condition never becomes false, or code waiting for input (use the stdin box below the editor).`
      : (explainError(res.stderr, lang) || `The program stopped with an error — read the message below from the bottom up; the last line names the problem.`);
    fb.innerHTML = `
      <div class="fb-banner bad"><span class="fb-emoji">✗</span>
        <div>Your code didn't finish — let's fix that first.
        <small>${results.length ? `${results.filter(r=>r.ok).length} check(s) passed before it crashed.` : `Fix the error, then check again.`}</small></div>
      </div>
      <div class="fb-item fail">
        <div class="fb-why">${why}</div>
        ${lineNo ? `<div class="fb-why" style="margin-top:6px">It happened around <b>line ${lineNo}</b>${srcLine ? `: &nbsp;<code>${escapeHtml(srcLine)}</code>` : ""}</div>` : ""}
      </div>
      ${res.stderr ? `<div class="fb-errbox">${escapeHtml(res.stderr.trim())}</div>` : ""}`;
    return;
  }

  // Case 2: no PASS/FAIL lines — not an exercise file
  if (!results.length) {
    fb.innerHTML = `
      <div class="fb-banner info"><span class="fb-emoji">i</span>
        <div>This code ran fine, but it has no checks to grade.
        <small>“Check answer” grades the <code>exercises</code> files, which contain built-in PASS/FAIL tests. Open one from the lesson toolbar — or just use ▶ Run to see your output.</small></div>
      </div>
      ${res.stdout ? `<div class="fb-item"><div class="fb-label">Your output</div><div class="fb-why"><code style="white-space:pre-wrap;display:block;padding:8px">${escapeHtml(res.stdout.trim())}</code></div></div>` : ""}`;
    return;
  }

  const passed = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  if (!failed.length) {
    fb.innerHTML = `
      <div class="fb-banner ok"><span class="fb-emoji">✓</span>
        <div>${pick(PRAISE)}<small>${passed.length} / ${results.length} checks passed.</small></div>
      </div>
      ${passed.map((r) => `<div class="fb-item pass"><span class="fb-label">✓ ${escapeHtml(r.label)}</span></div>`).join("")}`;
    confetti();
    const xpKey = `hub-passed:${state.activeTab}/${state.activeDay || "scratch"}/${state.editorFile || "scratch"}`;
    if (!localStorage.getItem(xpKey)) {
      localStorage.setItem(xpKey, "1");
      addXP(25, "all checks passed!");
    }
    return;
  }

  const items = failed.map((r) => {
    const info = extractHint(code, r.label);
    let why;
    if (info && info.notImplemented) {
      why = `Looks like <code>${info.fnName}</code> <b>hasn't been written yet</b> — it still has the TODO placeholder. Replace it with your own code.`;
    } else if (info) {
      why = `Your <code>${info.fnName}</code> ran, but returned the wrong answer for this case. Common cause: returning the wrong thing, or forgetting a <code>return</code> entirely (which returns <code>None</code>/<code>undefined</code>).`;
    } else {
      why = `This check didn't get the value it expected — re-read what the instructions ask for in this exact case.`;
    }
    const hint = info && info.hint ? `<div class="fb-why"><b>Hint from the exercise:</b> ${escapeHtml(info.hint)}</div>` : "";
    return `<div class="fb-item fail">
      <span class="fb-label">✗ ${escapeHtml(r.label)}</span>
      <div class="fb-why">${why}</div>${hint}
    </div>`;
  }).join("");

  fb.innerHTML = `
    <div class="fb-banner bad"><span class="fb-emoji">!</span>
      <div>${pick(ENCOURAGE)}<small>${passed.length} of ${results.length} checks passing — ${failed.length} to go.</small></div>
    </div>
    ${items}
    ${passed.length ? `<div class="fb-pass-summary">Already passing: ${passed.map((r) => `✓ ${escapeHtml(r.label)}`).join(" · ")}</div>` : ""}`;
}

/* HTML/CSS check: side-by-side with the day's solution */
async function checkHtml(code) {
  const course = state.courses.find((c) => c.id === state.activeTab);
  const day = course && course.days.find((d) => d.id === state.activeDay);
  const solution = day && day.files.find((f) => /^solution\.html$/i.test(f.name));
  if (!solution) {
    $("#feedback").innerHTML = `
      <div class="fb-banner info"><span class="fb-emoji">i</span>
      <div>No solution file for this page.<small>Open a day that has a <code>solution.html</code> to compare against, or just use ▶ Run to preview your page.</small></div></div>`;
    showPane("feedback");
    return;
  }
  const res = await api.file(solution.path);
  if (res.error) { setOutputHTML(`<span class="err">Could not load the solution file.</span>`); return; }
  $("#cmp-you").srcdoc = withInspector(code, $("#inspector-toggle").checked);
  $("#cmp-goal").srcdoc = withInspector(res.content, $("#inspector-toggle").checked);
  showPane("compare");
  toast("Compare your page (left) with the goal (right)");
  touchStreak(); renderStats();
}

/* ================= workshop ================= */
const WS_TIPS = {
  python: [
    `Compare values with <code>==</code>, identity with <code>is</code> — use <code>is None</code>, not <code>== None</code>.`,
    `Never use a mutable default argument: <code>def f(items=[])</code> shares that SAME list across every call. Use <code>None</code> and create it inside instead.`,
    `Prefer f-strings (<code>f"{x}"</code>) over string concatenation for building text with variables in it.`,
    `A bare <code>except:</code> catches everything, including typos and Ctrl+C. Catch the specific exception type instead.`,
    `Run with <code>python -X utf8 file.py</code> style habits aside, remember: indentation IS syntax here — mixing tabs and spaces will break things confusingly.`,
  ],
  js: [
    `Use <code>===</code>/<code>!==</code>, not <code>==</code>/<code>!=</code> — the loose versions silently convert types in surprising ways.`,
    `Prefer <code>const</code> by default, <code>let</code> only when you'll reassign. Avoid <code>var</code> — its scoping rules are the classic source of bugs.`,
    `A function with no <code>return</code> gives back <code>undefined</code> — a common cause of "cannot read property of undefined" one line later.`,
    `Leftover <code>console.log</code> debugging statements are fine while building, but sweep them out before calling something "done."`,
    `Async functions that forget <code>await</code> return a pending Promise, not the value — a frequent async bug.`,
  ],
  ts: [
    `Avoid reaching for <code>any</code> to silence an error — it turns off type-checking for that value entirely. Model the real shape instead.`,
    `Prefer an explicit <code>interface</code>/<code>type</code> for function parameters over inferring — it documents intent and catches mismatched calls immediately.`,
    `<code>strictNullChecks</code>-style thinking: handle the <code>null</code>/<code>undefined</code> case explicitly rather than asserting with <code>!</code> to make the error disappear.`,
  ],
  html: [
    `Every <code>&lt;img&gt;</code> needs a meaningful <code>alt</code> — it's not optional decoration, it's what a screen reader announces.`,
    `Use semantic tags (<code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;button&gt;</code>) instead of a <code>&lt;div&gt;</code> for everything — you get built-in accessibility and browser behavior for free.`,
    `Inline <code>style="..."</code> attributes work but don't scale — prefer a <code>&lt;style&gt;</code> block or stylesheet with classes as soon as a page has more than a couple of rules.`,
    `A form's inputs need an associated <code>&lt;label&gt;</code> (via <code>for</code>/<code>id</code>) — clicking the label should focus the input.`,
  ],
};

function wsKey(lang) { return `hub-workshop:${lang}`; }

function renderWsTips() {
  const lang = $("#ws-lang").value;
  $("#ws-tips").innerHTML = WS_TIPS[lang].map((t) => `<div class="ws-tip">${t}</div>`).join("");
}

function wsRefreshHighlight() {
  const code = $("#ws-editor").value;
  const lang = $("#ws-lang").value;
  $("#ws-highlight-code").innerHTML = highlightCode(code, lang) + "\n";
  const lineCount = code.split("\n").length;
  $("#ws-gutter").textContent = Array.from({ length: lineCount }, (_, i) => i + 1).join("\n");
  const ed = $("#ws-editor"), hl = ed.previousElementSibling;
  hl.scrollTop = ed.scrollTop; hl.scrollLeft = ed.scrollLeft;
}

function initWorkshop() {
  const lang = localStorage.getItem("hub-workshop-lang") || "python";
  $("#ws-lang").value = lang;
  $("#ws-editor").value = localStorage.getItem(wsKey(lang)) || "";
  $("#ws-project-notes").value = localStorage.getItem("hub-workshop-notes") || "";
  wsRefreshHighlight();
  renderWsTips();
  renderWsSaves();
}

/* -------- workshop named saves -------- */
function wsSavesList() {
  try { return JSON.parse(localStorage.getItem("hub-ws-saves") || "[]"); }
  catch { return []; }
}
function wsSaveAs(name) {
  const id = `s${Date.now()}`;
  const list = wsSavesList();
  list.push({ id, name, lang: $("#ws-lang").value, notes: $("#ws-project-notes").value, savedAt: Date.now() });
  localStorage.setItem("hub-ws-saves", JSON.stringify(list));
  localStorage.setItem(`hub-ws-save:${id}`, $("#ws-editor").value);
  renderWsSaves();
}
function wsLoadSave(id) {
  const item = wsSavesList().find((s) => s.id === id);
  if (!item) return;
  $("#ws-lang").value = item.lang;
  localStorage.setItem("hub-workshop-lang", item.lang);
  const code = localStorage.getItem(`hub-ws-save:${id}`) || "";
  $("#ws-editor").value = code;
  localStorage.setItem(wsKey(item.lang), code);
  if (item.notes) {
    $("#ws-project-notes").value = item.notes;
    localStorage.setItem("hub-workshop-notes", item.notes);
  }
  wsRefreshHighlight();
  renderWsTips();
  toast(`Loaded "${item.name}"`);
}
function wsDeleteSave(id, name) {
  localStorage.setItem("hub-ws-saves", JSON.stringify(wsSavesList().filter((s) => s.id !== id)));
  localStorage.removeItem(`hub-ws-save:${id}`);
  renderWsSaves();
  toast(`Deleted "${name}"`);
}
function renderWsSaves() {
  const wrap = $("#ws-saves-list");
  const list = wsSavesList();
  wrap.innerHTML = "";
  if (!list.length) { wrap.innerHTML = `<p class="ws-tool-desc">No saved files yet.</p>`; return; }
  for (const s of list) {
    const row = document.createElement("div");
    row.className = "saved-item";
    row.innerHTML = `
      <div class="saved-item-head">
        <span class="saved-item-name" title="${escapeHtml(s.name)}">${escapeHtml(s.name)}</span>
        <span class="saved-item-lang">${escapeHtml(s.lang)}</span>
      </div>
      <div class="saved-item-date">${s.savedAt ? new Date(s.savedAt).toLocaleString() : ""}</div>
      ${s.notes ? `<div class="saved-item-notes">${escapeHtml(s.notes)}</div>` : ""}
      <div class="saved-item-actions"><button class="btn-ghost">Load</button><button class="btn-ghost">✕</button></div>`;
    const [loadBtn, delBtn] = row.querySelectorAll("button");
    loadBtn.onclick = () => wsLoadSave(s.id);
    delBtn.onclick = async () => {
      const ok = await confirmModal({
        title: "Delete this saved file?",
        message: `"${s.name}" will be gone forever — this can't be undone.`,
        okText: "Delete forever",
      });
      if (ok) wsDeleteSave(s.id, s.name);
    };
    wrap.appendChild(row);
  }
}
$("#ws-btn-save-as").onclick = () => {
  const name = $("#ws-save-name").value.trim();
  if (!name) { toast("Type a name first"); return; }
  wsSaveAs(name);
  $("#ws-save-name").value = "";
  toast(`Saved "${name}"`);
};

async function wsExec() {
  const code = $("#ws-editor").value;
  const lang = $("#ws-lang").value;
  const res = await api.run(lang, code, $("#ws-stdin-box").value);
  touchStreak(); renderStats();
  return res;
}

async function runWorkshop() {
  const code = $("#ws-editor").value;
  const lang = $("#ws-lang").value;
  if (!code.trim()) { $("#ws-output").innerHTML = `<span class="sys">Nothing to run — the editor is empty.</span>`; return; }
  if (lang === "html") {
    $("#ws-preview").srcdoc = withInspector(code, $("#ws-inspector-toggle").checked);
    $("#ws-preview").hidden = false; $("#ws-output").hidden = true;
    touchStreak(); renderStats();
    return;
  }
  $("#ws-preview").hidden = true; $("#ws-output").hidden = false;
  const btn = $("#ws-btn-run");
  btn.disabled = true;
  $("#ws-output").innerHTML = `<span class="sys">Running…</span>`;
  try {
    const res = await wsExec();
    if (res.error) { $("#ws-output").innerHTML = `<span class="err">${escapeHtml(res.error)}</span>`; return; }
    $("#ws-output").innerHTML = colorizeRunOutput(res);
  } catch (e) {
    $("#ws-output").innerHTML = `<span class="err">Could not reach the local server: ${escapeHtml(String(e))}</span>`;
  } finally {
    btn.disabled = false;
  }
}

/* Lightweight, regex-based static analysis -- not a real linter, but catches the
   handful of mistakes that trip up beginners most often, per language. */
/* Rough per-function line-length check, language-agnostic: finds blocks that start
   with a function-like header and measures lines until the next same-or-lower-indent
   function header (or end of file). Approximate on purpose -- no real parser here. */
function longestFunctionLines(code, headerRe) {
  const lines = code.split("\n");
  let longest = 0, name = null;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(headerRe);
    if (!m) continue;
    const indent = lines[i].match(/^\s*/)[0].length;
    let j = i + 1, count = 0;
    while (j < lines.length) {
      const nextM = lines[j].match(headerRe);
      if (nextM && lines[j].match(/^\s*/)[0].length <= indent) break;
      if (lines[j].trim()) count++;
      j++;
    }
    if (count > longest) { longest = count; name = m[1] || m[0].trim(); }
  }
  return { longest, name };
}

function maxIndentDepth(code, tabWidth) {
  let max = 0;
  for (const line of code.split("\n")) {
    if (!line.trim()) continue;
    const leading = line.match(/^[ \t]*/)[0];
    const spaces = leading.replace(/\t/g, " ".repeat(tabWidth)).length;
    max = Math.max(max, Math.floor(spaces / tabWidth));
  }
  return max;
}

/* WCAG contrast checking -- real luminance math, hex/rgb() colors only
   (named colors like "red" aren't resolved, a known, stated limitation). */
function parseColor(str) {
  str = str.trim();
  let m = str.match(/^#([0-9a-f]{3})$/i);
  if (m) { const [r, g, b] = m[1].split("").map((c) => parseInt(c + c, 16)); return [r, g, b]; }
  m = str.match(/^#([0-9a-f]{6})$/i);
  if (m) { const h = m[1]; return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
  m = str.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) return [+m[1], +m[2], +m[3]];
  return null;
}
function relLuminance([r, g, b]) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrastRatio(c1, c2) {
  const L1 = relLuminance(c1), L2 = relLuminance(c2);
  const lighter = Math.max(L1, L2), darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}
function findContrastIssues(code) {
  const hits = [];
  const blocks = [];
  for (const m of code.matchAll(/style="([^"]*)"/gi)) blocks.push(m[1]);
  for (const m of code.matchAll(/\{([^{}]*)\}/g)) blocks.push(m[1]);
  const seen = new Set();
  for (const block of blocks) {
    const colorM = block.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
    const bgM = block.match(/(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/i);
    if (!colorM || !bgM) continue;
    const fg = parseColor(colorM[1]), bg = parseColor(bgM[1]);
    if (!fg || !bg) continue;
    const ratio = contrastRatio(fg, bg);
    if (ratio < 4.5) {
      const key = colorM[1].trim() + "|" + bgM[1].trim();
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({
        sev: "warn", title: `Low contrast: ${ratio.toFixed(2)}:1`,
        detail: `Text color <code>${escapeHtml(colorM[1].trim())}</code> on background <code>${escapeHtml(bgM[1].trim())}</code> has a contrast ratio of only ${ratio.toFixed(2)}:1 — WCAG AA requires at least <b>4.5:1</b> for normal text (3:1 for large/bold text). Low-vision readers may not be able to read this.`,
      });
    }
  }
  return hits;
}

function analyzeStyle(code, lang) {
  const hits = [];
  const add = (sev, title, detail) => hits.push({ sev, title, detail });
  const lines = code.split("\n");

  if (/\b(TODO|FIXME|XXX)\b/.test(code))
    add("info", "Leftover TODO/FIXME", `Found a <code>TODO</code>/<code>FIXME</code> marker still in the code — a fine reminder while building, just don't forget to circle back before calling it "done."`);

  if (lang === "python") {
    if (/def\s+\w+\([^)]*=\s*(\[\]|\{\})/.test(code))
      add("warn", "Mutable default argument", `A parameter defaults to <code>[]</code> or <code>{}</code> — that same object is reused across every call. Default to <code>None</code> and create the list/dict inside the function instead.`);
    if (/[^=!<>]==\s*None|None\s*==[^=]/.test(code))
      add("warn", "Comparing to None with ==", `Use <code>is None</code> / <code>is not None</code> instead of <code>== None</code> — it's the correct idiom and avoids edge cases with custom <code>__eq__</code>.`);
    if (/except\s*:/.test(code))
      add("warn", "Bare except", `<code>except:</code> with no type catches everything, including typos and Ctrl+C. Catch a specific exception, e.g. <code>except ValueError:</code>.`);
    if (/type\(\s*\w+\s*\)\s*==/.test(code))
      add("info", "type(x) == Y instead of isinstance", `<code>isinstance(x, Y)</code> is the idiomatic check — it also correctly handles subclasses, which <code>type(x) == Y</code> silently gets wrong.`);
    if (/%\s*\(.*\)\s*$/m.test(code) || /"\s*%\s*\w/.test(code))
      add("info", "Old-style % string formatting", `Consider an f-string instead: <code>f"{value}"</code> reads more clearly than <code>"%s" % value</code> and is the modern idiom.`);
    const imports = [...code.matchAll(/^import (\w+)|^from \w+ import (\w+)/gm)].map((m) => m[1] || m[2]);
    for (const name of imports) {
      const usesElsewhere = code.split("\n").filter((l) => !/^\s*(import|from)\s/.test(l) && new RegExp(`\\b${name}\\b`).test(l)).length;
      if (usesElsewhere === 0) add("info", `Possibly unused import: ${name}`, `<code>${name}</code> is imported but doesn't appear to be used anywhere else in the code — worth double-checking and removing if so.`);
    }
    const fn = longestFunctionLines(code, /^\s*def\s+(\w+)/);
    if (fn.longest > 40)
      add("info", `Long function: ${fn.name} (~${fn.longest} lines)`, `Functions this long are harder to test and reason about in one glance — consider splitting it into smaller helper functions, each with one clear job.`);
    const depth = maxIndentDepth(code, 4);
    if (depth >= 5)
      add("info", "Deep nesting", `Found code nested ${depth} levels deep. Deeply nested <code>if</code>/<code>for</code> blocks are a common readability smell — consider an early <code>return</code> to "flatten" the logic, or extracting the inner block into its own function.`);
    if (/\bprint\(/.test(code) && lines.filter((l) => /\bprint\(/.test(l)).length >= 4)
      add("info", "Several print() calls", `Fine while exploring — once this works, consider whether some of these were debugging scaffolding you can remove.`);
  }

  if (lang === "js" || lang === "ts") {
    if (/[^=!]==[^=]|[^!]!=[^=]/.test(code))
      add("warn", "Loose equality", `Found <code>==</code> or <code>!=</code> — prefer <code>===</code>/<code>!==</code> so JavaScript doesn't silently convert types for you.`);
    if (/\bvar\s+\w/.test(code))
      add("warn", "var usage", `<code>var</code> is function-scoped and can lead to confusing bugs. Use <code>const</code> (default) or <code>let</code> (when reassigning) instead.`);
    if (/async\s+function[^{]*\{[^}]*\.then\(/.test(code) || /await[\s\S]*\.then\(/.test(code))
      add("info", "Mixing await and .then()", `Pick one style — mixing <code>await</code> and <code>.then()</code> in the same function usually means a leftover from converting between the two. Async/await alone is easier to read.`);
    const declared = [...code.matchAll(/\b(?:const|let)\s+(\w+)\s*=/g)].map((m) => m[1]);
    for (const name of declared) {
      const uses = (code.match(new RegExp(`\\b${name}\\b`, "g")) || []).length;
      if (uses <= 1) add("info", `Possibly unused variable: ${name}`, `<code>${name}</code> is declared but doesn't seem to be referenced again — worth double-checking and removing if so.`);
    }
    const fn = longestFunctionLines(code, /^\s*(?:function\s+(\w+)|(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\()/);
    if (fn.longest > 40)
      add("info", `Long function: ${fn.name} (~${fn.longest} lines)`, `Functions this long are harder to test and reason about in one glance — consider splitting it into smaller helper functions, each with one clear job.`);
    if (/\bconsole\.log\(/.test(code) && lines.filter((l) => /console\.log\(/.test(l)).length >= 4)
      add("info", "Several console.log() calls", `Fine while exploring — sweep leftover debug logging out once things work.`);
    if (lang === "ts" && /:\s*any\b/.test(code))
      add("info", "Use of 'any'", `<code>any</code> turns off type-checking for that value. If you know the real shape, write it out — that's most of the point of using TypeScript.`);
  }

  if (lang === "html") {
    for (const hit of findContrastIssues(code)) add(hit.sev, hit.title, hit.detail);
    if (/<img(?![^>]*\balt=)[^>]*>/i.test(code))
      add("warn", "Image missing alt", `Every <code>&lt;img&gt;</code> needs an <code>alt</code> attribute describing it — required for accessibility, not optional.`);
    if (!/<!doctype html>/i.test(code) && /<html/i.test(code))
      add("info", "Missing <!DOCTYPE html>", `Add <code>&lt;!DOCTYPE html&gt;</code> as the very first line — without it, browsers can fall back to quirks mode with inconsistent rendering.`);
    if (/<input(?![^>]*\btype="hidden")[^>]*>/i.test(code) && !/<label/i.test(code))
      add("info", "Inputs without a <label>", `Every meaningful form input should have an associated <code>&lt;label for="...">&lt;/label&gt;</code> — improves accessibility and click-to-focus behavior.`);
    if (/<html(?![^>]*\bhtml)[^>]*>/i.test(code) && !/<title>/i.test(code))
      add("info", "Missing <title>", `Every page needs a <code>&lt;title&gt;</code> in the <code>&lt;head&gt;</code> — it's what shows in the browser tab and search results.`);
    if (/\son\w+="/i.test(code))
      add("info", "Inline event handler attribute", `Found an inline <code>onclick="..."</code>-style attribute. Prefer <code>addEventListener</code> in a <code>&lt;script&gt;</code> — it keeps behavior separate from markup and scales better once a page has several handlers.`);
    const ids = [...code.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length)
      add("warn", "Duplicate id attribute", `The id <code>"${dupes[0]}"</code> is used more than once. <code>id</code> must be unique per page — <code>document.getElementById</code> and CSS <code>#id</code> selectors only ever find the first match, silently ignoring the rest.`);
  }

  return hits;
}

async function reviewWorkshop() {
  const code = $("#ws-editor").value;
  const lang = $("#ws-lang").value;
  const panel = $("#ws-review-panel");
  if (!code.trim()) { panel.innerHTML = `<div class="ws-lint info">Write some code first — the editor is empty.</div>`; return; }
  if (lang === "html") {
    const hits = analyzeStyle(code, lang);
    panel.innerHTML = (hits.length
      ? hits.map((h) => `<div class="ws-lint ${h.sev}"><span>${h.sev === "warn" ? "!" : "i"}</span><div><b>${h.title}</b><br>${h.detail}</div></div>`).join("")
      : `<div class="fb-banner ok"><span class="fb-emoji">✓</span><div>No issues spotted — nice, clean markup.</div></div>`);
    $("#ws-preview").srcdoc = withInspector(code, $("#ws-inspector-toggle").checked);
    $("#ws-preview").hidden = false; $("#ws-output").hidden = true;
    return;
  }

  const btn = $("#ws-btn-review");
  btn.disabled = true;
  panel.innerHTML = `<div class="ws-lint info">Running your code…</div>`;
  try {
    const res = await wsExec();
    if (res.error) { panel.innerHTML = `<div class="ws-lint warn">${escapeHtml(res.error)}</div>`; return; }
    $("#ws-output").hidden = false; $("#ws-output").innerHTML = colorizeRunOutput(res);

    if (res.timedOut || (res.stderr && res.exit !== 0)) {
      const lineNo = res.stderr ? errorLineInfo(res.stderr, lang) : null;
      const srcLine = lineNo ? (code.split("\n")[lineNo - 1] || "").trim() : null;
      const why = res.timedOut
        ? `Your program never finished — it ran for 15 seconds and had to be stopped. Usual causes: a loop whose condition never becomes false, or code waiting for input (use the stdin box).`
        : (explainError(res.stderr, lang) || `The program crashed — read the error below from the bottom up; the last line names the problem.`);
      panel.innerHTML = `
        <div class="fb-banner bad"><span class="fb-emoji">✗</span><div>Your code crashed — let's fix that first.</div></div>
        <div class="fb-item fail"><div class="fb-why">${why}</div>
        ${lineNo ? `<div class="fb-why" style="margin-top:6px">Around <b>line ${lineNo}</b>${srcLine ? `: <code>${escapeHtml(srcLine)}</code>` : ""}</div>` : ""}</div>`;
      return;
    }

    const hits = analyzeStyle(code, lang);
    const lintHtml = hits.length
      ? hits.map((h) => `<div class="ws-lint ${h.sev}"><span>${h.sev === "warn" ? "!" : "i"}</span><div><b>${h.title}</b><br>${h.detail}</div></div>`).join("")
      : "";
    panel.innerHTML = `
      <div class="fb-banner ok"><span class="fb-emoji">✓</span><div>Ran successfully with no errors.
      <small>${hits.length ? `${hits.length} thing${hits.length > 1 ? "s" : ""} worth a look below.` : "No common pitfalls spotted either — nicely done."}</small></div></div>
      ${lintHtml}`;
  } catch (e) {
    panel.innerHTML = `<div class="ws-lint warn">Could not reach the local server: ${escapeHtml(String(e))}</div>`;
  } finally {
    btn.disabled = false;
  }
}

/* ================= project workspace ================= */
const PW_DEFAULTS = {
  html: `<h1>Hello!</h1>\n<button id="btn">Click me</button>\n<p id="count">Clicked 0 times</p>`,
  css: `body { font-family: sans-serif; padding: 24px; }\nbutton { padding: 8px 16px; cursor: pointer; }`,
  js: `let count = 0;\nconst btn = document.getElementById("btn");\nconst out = document.getElementById("count");\nbtn.addEventListener("click", () => {\n  count++;\n  out.textContent = \`Clicked \${count} times\`;\n});`,
};
const PW_KEY = (f) => `hub-project:${f}`;
let pwWidth = "0";

function pwFile(f) { return { editor: $(`#pw-${f}-editor`), gutter: $(`#pw-${f}-gutter`), hl: $(`#pw-${f}-highlight`), lang: f === "html" ? "html" : f === "css" ? "html" : "js" }; }

function pwRefreshHighlight(f) {
  const { editor, gutter, hl, lang } = pwFile(f);
  const code = editor.value;
  hl.innerHTML = highlightCode(code, lang) + "\n";
  const lineCount = code.split("\n").length;
  gutter.textContent = Array.from({ length: lineCount }, (_, i) => i + 1).join("\n");
  const pre = editor.previousElementSibling;
  pre.scrollTop = editor.scrollTop; pre.scrollLeft = editor.scrollLeft;
}

function pwUpdatePreview() {
  const html = $("#pw-html-editor").value;
  const css = $("#pw-css-editor").value;
  const js = $("#pw-js-editor").value;
  const doc = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
  $("#pw-preview").srcdoc = withInspector(doc, $("#pw-inspector-toggle").checked);
}

function initProjectWorkspace() {
  for (const f of ["html", "css", "js"]) {
    const saved = localStorage.getItem(PW_KEY(f));
    $(`#pw-${f}-editor`).value = saved !== null ? saved : PW_DEFAULTS[f];
    pwRefreshHighlight(f);
  }
  pwUpdatePreview();
  renderPwSaves();
}

/* -------- project workspace named saves -------- */
function pwSavesList() {
  try { return JSON.parse(localStorage.getItem("hub-proj-saves") || "[]"); }
  catch { return []; }
}
function pwSaveAs(name) {
  const id = `p${Date.now()}`;
  const list = pwSavesList();
  list.push({ id, name, savedAt: Date.now() });
  localStorage.setItem("hub-proj-saves", JSON.stringify(list));
  localStorage.setItem(`hub-proj-save:${id}`, JSON.stringify({
    html: $("#pw-html-editor").value, css: $("#pw-css-editor").value, js: $("#pw-js-editor").value,
  }));
  renderPwSaves();
}
function pwLoadSave(id) {
  const item = pwSavesList().find((s) => s.id === id);
  if (!item) return;
  let data = {};
  try { data = JSON.parse(localStorage.getItem(`hub-proj-save:${id}`) || "{}"); } catch { data = {}; }
  for (const f of ["html", "css", "js"]) {
    const code = data[f] || "";
    $(`#pw-${f}-editor`).value = code;
    localStorage.setItem(PW_KEY(f), code);
    pwRefreshHighlight(f);
  }
  pwUpdatePreview();
  toast(`Loaded "${item.name}"`);
}
function pwDeleteSave(id, name) {
  localStorage.setItem("hub-proj-saves", JSON.stringify(pwSavesList().filter((s) => s.id !== id)));
  localStorage.removeItem(`hub-proj-save:${id}`);
  renderPwSaves();
  toast(`Deleted "${name}"`);
}
function renderPwSaves() {
  const wrap = $("#pw-saves-list");
  const list = pwSavesList();
  wrap.innerHTML = "";
  if (!list.length) { wrap.innerHTML = `<p class="ws-tool-desc">No saved projects yet.</p>`; return; }
  for (const s of list) {
    const row = document.createElement("div");
    row.className = "saved-item";
    row.innerHTML = `
      <div class="saved-item-head">
        <span class="saved-item-name" title="${escapeHtml(s.name)}">${escapeHtml(s.name)}</span>
      </div>
      <div class="saved-item-date">${s.savedAt ? new Date(s.savedAt).toLocaleString() : ""}</div>
      <div class="saved-item-actions"><button class="btn-ghost">Load</button><button class="btn-ghost">✕</button></div>`;
    const [loadBtn, delBtn] = row.querySelectorAll("button");
    loadBtn.onclick = () => pwLoadSave(s.id);
    delBtn.onclick = async () => {
      const ok = await confirmModal({
        title: "Delete this saved project?",
        message: `"${s.name}" will be gone forever — this can't be undone.`,
        okText: "Delete forever",
      });
      if (ok) pwDeleteSave(s.id, s.name);
    };
    wrap.appendChild(row);
  }
}
$("#pw-btn-save-as").onclick = () => {
  const name = $("#pw-save-name").value.trim();
  if (!name) { toast("Type a name first"); return; }
  pwSaveAs(name);
  $("#pw-save-name").value = "";
  toast(`Saved "${name}"`);
};

$("#pw-btn-clear").onclick = () => {
  for (const f of ["html", "css", "js"]) {
    $(`#pw-${f}-editor`).value = "";
    localStorage.setItem(PW_KEY(f), "");
    pwRefreshHighlight(f);
  }
  pwUpdatePreview();
};

for (const f of ["html", "css", "js"]) {
  const ed = $(`#pw-${f}-editor`);
  ed.addEventListener("input", () => {
    pwRefreshHighlight(f);
    localStorage.setItem(PW_KEY(f), ed.value);
    pwUpdatePreview();
  });
  ed.addEventListener("scroll", () => {
    const pre = ed.previousElementSibling;
    pre.scrollTop = ed.scrollTop; pre.scrollLeft = ed.scrollLeft;
  });
  ed.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const t = e.target, s = t.selectionStart;
      t.value = t.value.slice(0, s) + "    " + t.value.slice(t.selectionEnd);
      t.selectionStart = t.selectionEnd = s + 4;
      pwRefreshHighlight(f);
      localStorage.setItem(PW_KEY(f), t.value);
      pwUpdatePreview();
    }
  });
}

document.querySelectorAll(".pw-width-btn").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".pw-width-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const w = btn.dataset.w;
    $("#pw-preview").style.width = w === "0" ? "100%" : w + "px";
  };
});
$("#pw-inspector-toggle").addEventListener("change", pwUpdatePreview);

/* ================= practice: shared track toggle ================= */
function practiceTracks() {
  return state.courses.map((c) => ({ id: c.id, label: c.title, accent: c.accent }));
}
function renderSideToggle(listEl, activeId, onSelect) {
  listEl.innerHTML = "";
  for (const t of practiceTracks()) {
    const b = document.createElement("button");
    b.className = "side-toggle-btn" + (t.id === activeId ? " active" : "");
    b.style.setProperty("--toggle-accent", t.accent);
    b.textContent = t.label;
    b.onclick = () => onSelect(t.id);
    listEl.appendChild(b);
  }
}

/* ================= flashcards ================= */
const FLASHCARDS = [
  { deck: "python", q: "What's the difference between == and is in Python?", a: "<code>==</code> checks value equality; <code>is</code> checks identity (are these the literal same object in memory)." },
  { deck: "python", q: "Why is a mutable default argument (def f(x=[])) dangerous?", a: "That SAME list object is reused across every call that doesn't pass its own — mutations from one call leak into the next." },
  { deck: "python", q: "What's the difference between a list and a tuple?", a: "A list is mutable (can change after creation); a tuple is immutable (fixed once created)." },
  { deck: "python", q: "What does a generator function do differently from a normal function?", a: "It uses <code>yield</code> to hand back one value at a time, pausing its state in between, instead of computing and returning everything at once." },
  { deck: "python", q: "What's a list comprehension, in one line, for squaring numbers 0-4?", a: "<code>[x**2 for x in range(5)]</code>" },
  { deck: "python", q: "What does *args and **kwargs let a function accept?", a: "<code>*args</code> collects extra positional arguments into a tuple; <code>**kwargs</code> collects extra keyword arguments into a dict." },
  { deck: "python", q: "What does a decorator do, conceptually?", a: "It wraps a function to add behavior before/after it runs, without changing the function's own code." },
  { deck: "python", q: "What's the difference between .remove(), .pop(), and del on a list?", a: "<code>.remove(value)</code> removes the first matching value; <code>.pop(index)</code> removes and returns an item by index; <code>del list[i]</code> deletes by index with no return value." },
  { deck: "python", q: "What does a with statement guarantee?", a: "That cleanup code (like closing a file) runs even if an exception happens inside the block — via the context manager's __exit__." },
  { deck: "python", q: "What's a dict comprehension, for squaring values 0-3 keyed by themselves?", a: "<code>{x: x**2 for x in range(4)}</code>" },
  { deck: "python", q: "What's the difference between copy.copy and copy.deepcopy?", a: "<code>copy()</code> copies one level (nested objects are still shared references); <code>deepcopy()</code> recursively copies everything, so nothing is shared." },
  { deck: "python", q: "What is 'duck typing'?", a: "Caring about whether an object supports the methods/behavior you need, not its actual class — \"if it quacks like a duck...\"." },
  { deck: "python", q: "What does __init__ do?", a: "It's the initializer that runs right after an object is created, setting up its instance attributes." },
  { deck: "python", q: "What's the difference between a classmethod and a staticmethod?", a: "A <code>@classmethod</code> receives the class itself as its first argument (<code>cls</code>); a <code>@staticmethod</code> receives neither instance nor class — it's just a regular function namespaced on the class." },
  { deck: "python", q: "What does except Exception NOT catch?", a: "<code>SystemExit</code> and <code>KeyboardInterrupt</code> — they inherit from BaseException, not Exception, so Ctrl+C still works." },
  { deck: "python", q: "What two dunder methods make an object usable in a with statement?", a: "<code>__enter__</code> and <code>__exit__</code>." },
  { deck: "python", q: "What's the difference between .append() and .extend() on a list?", a: "<code>.append(x)</code> adds x as a single new item; <code>.extend(iterable)</code> adds each item from the iterable individually." },
  { deck: "python", q: "What does enumerate(items) give you in a for loop?", a: "Pairs of (index, item) — so you get the position without manually tracking a counter." },
  { deck: "python", q: "What does the GIL (Global Interpreter Lock) mean for CPU-bound threads?", a: "Only one thread executes Python bytecode at a time, so CPU-bound work doesn't actually run in parallel across threads (use multiprocessing instead)." },
  { deck: "python", q: "How do you format a float to 2 decimal places with an f-string?", a: "<code>f\"{value:.2f}\"</code>" },
  { deck: "python", q: "What's the difference between sorted() and .sort()?", a: "<code>sorted()</code> returns a NEW sorted list (works on any iterable); <code>.sort()</code> sorts a list in place and returns None." },
  { deck: "python", q: "What's a set comprehension, e.g. for squares 0-3?", a: "<code>{x**2 for x in range(4)}</code> — builds a set instead of a list, automatically deduplicating." },
  { deck: "python", q: "What does ** do between two numbers?", a: "Exponentiation — <code>2 ** 3</code> is 8." },
  { deck: "python", q: "What does raise X from Y do differently from a plain raise X?", a: "Explicitly chains X as caused by Y, preserving both tracebacks for debugging." },
  { deck: "python", q: "What does __str__ control, vs __repr__?", a: "The human-readable string shown by <code>print()</code>/<code>str()</code>; __repr__ is the developer-facing, unambiguous form." },
  { deck: "python", q: "What's the purpose of a virtual environment?", a: "Isolating a project's installed packages from other projects and the system Python, avoiding version conflicts." },
  { deck: "python", q: "What does pip freeze do?", a: "Lists installed packages and their exact versions, usually redirected into a requirements.txt file." },
  { deck: "python", q: "What does None represent?", a: "The deliberate absence of a value — Python's null." },
  { deck: "python", q: "What's a lambda function?", a: "An anonymous, single-expression function: <code>lambda x: x * 2</code>." },
  { deck: "python", q: "What's the difference between / and // division?", a: "<code>/</code> always returns a float (true division); <code>//</code> returns the floored (rounded down) result." },
  { deck: "python", q: "What does string .strip() do?", a: "Removes leading and trailing whitespace (or specified characters) from a string." },
  { deck: "python", q: "What's an f-string's main advantage over .format()?", a: "You embed expressions directly inside the string with <code>{}</code>, which is more concise and readable." },
  { deck: "python", q: "What does isinstance(x, int) check?", a: "Whether x is an instance of int (or a subclass) — the recommended way to type-check instead of comparing type() directly." },
  { deck: "python", q: "What's the purpose of if __name__ == '__main__':?", a: "Runs code only when the file is executed directly, not when it's imported as a module elsewhere." },
  { deck: "python", q: "What does a set's .union() method do?", a: "Returns a new set containing all elements from both sets, with duplicates removed." },
  { deck: "python", q: "What's the difference between break and continue?", a: "<code>break</code> exits the loop entirely; <code>continue</code> skips to the next iteration." },
  { deck: "python", q: "What does json.dumps(obj) do?", a: "Serializes a Python object (dict/list/etc.) into a JSON-formatted string." },
  { deck: "python", q: "What's a @property decorator used for?", a: "Lets a method be accessed like an attribute (no parentheses), often used for computed or validated values." },
  { deck: "python", q: "What does sum([1, 2, 3]) return?", a: "6" },
  { deck: "python", q: "What's the difference between append and the += operator on a list?", a: "Both can add items, but <code>+=</code> with another list extends it element-by-element like .extend(), while .append() adds the whole other list as one nested item." },
  { deck: "python", q: "What's a namedtuple for?", a: "A lightweight, immutable tuple subclass where fields can be accessed by name (<code>p.x</code>) as well as by index, without writing a full class." },
  { deck: "python", q: "What does zip([1,2,3], ['a','b','c']) produce when iterated?", a: "Pairs from each iterable combined positionally: <code>(1,'a'), (2,'b'), (3,'c')</code> — it stops at the shortest input." },
  { deck: "python", q: "What does the in operator check when used on a dict?", a: "Whether the value is a KEY of the dict, not a value — <code>'x' in d</code> checks <code>d</code>'s keys." },
  { deck: "python", q: "What is a context manager, at a conceptual level?", a: "An object defining setup/teardown logic (via __enter__/__exit__, or @contextlib.contextmanager) so a <code>with</code> block always cleans up correctly." },
  { deck: "python", q: "What does __eq__ control on a class?", a: "How instances compare with <code>==</code> — without it, <code>==</code> falls back to identity comparison (same as <code>is</code>)." },
  { deck: "python", q: "What's the difference between is not and != ?", a: "<code>is not</code> checks that two names refer to different objects (identity); <code>!=</code> checks that their values are unequal." },
  { deck: "python", q: "What does list.sort(key=len) do?", a: "Sorts the list using the result of <code>len(item)</code> for comparison instead of the items themselves — e.g. sorting strings by length." },
  { deck: "python", q: "What's the purpose of __slots__ on a class?", a: "Restricts instances to a fixed set of attributes, saving memory and preventing typo'd attributes — by skipping the usual per-instance __dict__." },
  { deck: "python", q: "What does collections.Counter do?", a: "Builds a dict-like object that counts occurrences of each item in an iterable, e.g. <code>Counter('aab')</code> gives <code>{'a': 2, 'b': 1}</code>." },
  { deck: "python", q: "What is a metaclass, in one sentence?", a: "The 'class of a class' — it controls how classes themselves are created, letting you customize class construction (rarely needed day to day)." },
  { deck: "python", q: "What does @functools.lru_cache do?", a: "Caches a function's return values by its arguments, so repeated calls with the same inputs skip recomputation." },
  { deck: "python", q: "What does the global keyword do inside a function?", a: "Lets the function assign to a module-level variable instead of creating a new local one with the same name." },
  { deck: "python", q: "What does assert condition, 'message' do when condition is False?", a: "Raises an AssertionError with that message — meant for catching programmer errors/invariants, not for validating user input." },
  { deck: "python", q: "What does x := expression (the walrus operator) let you do?", a: "Assign to x AND use the value in the same expression, e.g. <code>if (n := len(data)) > 10:</code> avoids computing len(data) twice." },
  { deck: "python", q: "What does except (TypeError, ValueError): catch?", a: "Either exception type in one handler — a tuple of exception classes after except matches any of them." },
  { deck: "python", q: "Why is ''.join(parts) preferred over += in a loop for building a big string?", a: "Strings are immutable, so += in a loop creates a new string each time (O(n²) overall); .join() builds the result once, in O(n)." },
  { deck: "python", q: "What does f(*my_list) do when calling a function?", a: "Unpacks my_list's items as separate positional arguments to f, instead of passing the list itself as one argument." },
  { deck: "python", q: "What does async def define?", a: "A coroutine function — calling it returns a coroutine object that must be awaited or scheduled, rather than running immediately." },
  { deck: "python", q: "What does asyncio.gather(*tasks) do?", a: "Runs multiple coroutines concurrently and waits for all of them to complete, collecting their results in order." },
  { deck: "python", q: "Why doesn't the threading module speed up CPU-bound Python code?", a: "The GIL still only lets one thread run Python bytecode at a time; use multiprocessing (separate processes, separate GILs) for real CPU parallelism." },
  { deck: "python", q: "What does the @dataclass decorator generate for you?", a: "__init__, __repr__, and __eq__ automatically based on the class's annotated fields, cutting out common boilerplate." },
  { deck: "python", q: "What's the difference between __new__ and __init__?", a: "__new__ actually CREATES the instance (rarely overridden); __init__ then initializes the already-created instance's attributes." },
  { deck: "python", q: "What do all() and any() do on an iterable of booleans?", a: "<code>all()</code> is True only if every item is truthy; <code>any()</code> is True if at least one item is truthy." },
  { deck: "python", q: "What's the difference between an iterable and an iterator?", a: "An iterable can produce an iterator (via __iter__), e.g. a list; an iterator is the stateful object that actually yields items one at a time via __next__." },
  { deck: "python", q: "What does the nonlocal keyword do?", a: "Lets a nested function assign to a variable in its enclosing (but not global) function scope, instead of creating a new local one." },
  { deck: "python", q: "What do type hints like def f(x: int) -> str: actually enforce at runtime?", a: "Nothing by default — they're documentation/tooling hints for readers and type checkers (like mypy); Python itself doesn't check them when running." },
  { deck: "python", q: "What does defining __call__ on a class let you do?", a: "Call instances of that class directly like a function: <code>obj()</code> invokes <code>obj.__call__()</code>." },
  { deck: "python", q: "Why use os.path.join('a', 'b') instead of 'a' + '/' + 'b' for paths?", a: "It uses the correct path separator for the current OS (/ on Linux/Mac, \\ on Windows) automatically." },
  { deck: "python", q: "What does a bare except: (no exception type) catch?", a: "Every exception, including SystemExit and KeyboardInterrupt — generally discouraged since it can hide real bugs and block Ctrl+C." },
  { deck: "python", q: "What's the difference between a shallow list copy via list(x) and x itself?", a: "list(x) creates a new list object with the same element references — mutating the new list's structure doesn't affect x, but mutating a shared nested object still does." },
  { deck: "python", q: "Why must __hash__ stay consistent with __eq__ on a custom class?", a: "Objects that compare equal must have the same hash, or they'll break when used as dict keys/set members — Python assumes equal objects hash identically." },
  { deck: "python", q: "What does functools.reduce(lambda a,b: a+b, [1,2,3]) compute?", a: "6 — it repeatedly applies the function to an accumulator and the next item, collapsing the iterable to a single value." },
  { deck: "python", q: "What's itertools.chain(list1, list2) used for?", a: "Iterating over multiple iterables back-to-back as if they were one, without first copying them into a combined list." },
  { deck: "python", q: "What does defining __len__ on a class let you do?", a: "Call len(obj) on instances of that class, and lets them work anywhere a length is expected (like truthiness checks)." },
  { deck: "python", q: "What does defining __getitem__ enable?", a: "Indexing/subscript syntax on instances, e.g. obj[0] or obj['key'], and (if it supports it) iteration via repeated indexing." },
  { deck: "python", q: "What's the relationship between Exception and BaseException?", a: "Exception is a subclass of BaseException; almost everything you catch/raise is an Exception, while BaseException also covers SystemExit/KeyboardInterrupt/GeneratorExit." },
  { deck: "python", q: "When does a try/except/else block's else clause run?", a: "Only if the try block completed with NO exception raised — it's a place for code that should run on success but isn't part of the risky operation itself." },
  { deck: "python", q: "What's the memory advantage of a generator expression over a list comprehension?", a: "A generator expression produces values lazily, one at a time, instead of building the entire list in memory up front." },
  { deck: "python", q: "What does a lone * in a function signature, e.g. def f(a, *, b):, do?", a: "Forces every parameter after it (here, b) to be passed as a keyword argument — it can't be passed positionally." },
  { deck: "python", q: "What does functools.partial(func, x) create?", a: "A new callable with the argument x already 'baked in', so calling it later only requires the remaining arguments." },
  { deck: "python", q: "What does defining __bool__ on a class control?", a: "What bool(obj) (and truthiness in if obj:) evaluates to for instances of that class." },
  { deck: "python", q: "What do dict.keys(), .values(), and .items() each return?", a: "View objects over the dict's keys, values, and (key, value) pairs respectively — live views that reflect later changes to the dict." },
  { deck: "python", q: "What does sys.argv contain when running python script.py a b?", a: "A list of command-line arguments: ['script.py', 'a', 'b'] — index 0 is always the script name." },
  { deck: "python", q: "Why is pathlib.Path often preferred over os.path string functions?", a: "It represents paths as objects with convenient methods/operators (like / for joining) instead of manually gluing strings together." },
  { deck: "python", q: "What must a class's __iter__ method return?", a: "An iterator object — one that implements __next__ — often the object itself if it also defines __next__." },
  { deck: "python", q: "What's a 'sentinel value' pattern, e.g. _MISSING = object()?", a: "A unique placeholder used to detect 'no value was passed' when None itself is a valid, meaningful argument value." },
  { deck: "python", q: "What's the core difference between str and bytes in Python 3?", a: "str holds text (Unicode characters); bytes holds raw binary data — you must explicitly encode/decode to convert between them." },
  { deck: "python", q: "What do .encode() and .decode() do?", a: "str.encode() converts text into bytes (using an encoding like UTF-8); bytes.decode() converts bytes back into a str." },
  { deck: "python", q: "What's __post_init__ used for on a @dataclass?", a: "Runs extra initialization logic right after the auto-generated __init__ finishes, e.g. computing a derived field." },
  { deck: "python", q: "What does subclassing Enum give you over plain integer constants?", a: "Named, type-safe, self-documenting constants (Color.RED instead of a bare 1) that print meaningfully and can't be confused with unrelated ints." },
  { deck: "python", q: "What does typing.Optional[int] mean for a parameter's type hint?", a: "The value is expected to be either an int or None — shorthand for Union[int, None]." },
  { deck: "python", q: "What does {**d1, **d2} produce?", a: "A new dict merging both, with d2's values overwriting d1's on any duplicate keys." },
  { deck: "python", q: "What's 'monkey patching'?", a: "Modifying or replacing a class/module's attributes or methods at runtime, from outside its original definition — powerful but can make code harder to trace." },
  { deck: "python", q: "What's the weakref module used for?", a: "Creating references to an object that don't prevent it from being garbage collected, useful for caches that shouldn't keep dead objects alive." },
  { deck: "python", q: "What actually enforces that a subclass implements an @abstractmethod?", a: "Python raises a TypeError at INSTANTIATION time if a concrete subclass hasn't overridden every abstract method of its ABC base." },
  { deck: "python", q: "What does the traceback module help you do?", a: "Programmatically format/inspect exception tracebacks, e.g. to log a full stack trace instead of just the exception message." },
  { deck: "python", q: "Why prefer the logging module over print() for a real application?", a: "It supports severity levels, timestamps, configurable output destinations, and can be tuned/disabled without editing source code." },
  { deck: "python", q: "What does '{:>10}'.format('hi') produce?", a: "'hi' right-aligned and padded with spaces to a total width of 10 characters." },
  { deck: "python", q: "What's the difference between a class attribute and an instance attribute?", a: "A class attribute is shared by all instances (defined directly in the class body); an instance attribute belongs to one object (usually set in __init__ via self)." },
  { deck: "python", q: "What does list.copy() do differently from a slice like list[:]?", a: "Nothing — both produce an equivalent shallow copy; .copy() is just a more explicit/readable spelling." },
  { deck: "python", q: "What does csv.DictReader give you per row, instead of a plain csv.reader?", a: "An ordered dict-like mapping of column header to value, instead of a bare list of positional values." },
  { deck: "python", q: "What's the difference between json.dump and json.dumps?", a: "json.dump writes JSON directly to an open file object; json.dumps returns the JSON as a string in memory." },
  { deck: "python", q: "What does argparse.ArgumentParser help you build?", a: "A command-line interface with named/positional arguments, automatic --help text, and type validation, instead of manually parsing sys.argv." },
  { deck: "python", q: "How do you access a function's docstring at runtime?", a: "Via its __doc__ attribute, e.g. my_func.__doc__ — also what help(my_func) displays." },
  { deck: "python", q: "What does textwrap.dedent do?", a: "Removes common leading whitespace from every line of a multi-line string, useful for cleaning up indented triple-quoted strings." },
  { deck: "python", q: "What's the difference between 'a b  c'.split() and 'a b  c'.split(' ')?", a: "split() with no argument splits on any run of whitespace and ignores empty results; split(' ') splits on each literal space, producing empty strings for doubled spaces." },
  { deck: "python", q: "What does random.seed(42) do?", a: "Makes the random module's subsequent 'random' output deterministic/reproducible, given the same seed value." },
  { deck: "python", q: "What's unittest.mock.patch used for?", a: "Temporarily replacing an object/function with a mock during a test, so you can isolate the code under test from real dependencies (network, files, etc.)." },
  { deck: "python", q: "What does dict.setdefault('key', []) do if 'key' is missing?", a: "Inserts 'key' with the given default value AND returns it — a common one-liner for building dicts of lists." },
  { deck: "python", q: "Why use heapq over sorting a list repeatedly for a priority queue?", a: "heapq maintains a partial order in O(log n) per insert/pop, far cheaper than re-sorting the whole list each time." },
  { deck: "python", q: "What does bisect.insort(sorted_list, x) do?", a: "Inserts x into sorted_list at the correct position to keep it sorted, without re-sorting the whole list." },
  { deck: "python", q: "What's a 'descriptor' in Python, at a high level?", a: "An object defining __get__/__set__ that customizes attribute access on another class — it's the mechanism @property is built on top of." },
  { deck: "python", q: "What does __init_subclass__ let a base class do?", a: "Run custom logic automatically whenever a subclass of it is DEFINED, without needing a metaclass." },
  { deck: "python", q: "What's functools.wraps(func) used for inside a decorator?", a: "Copies the wrapped function's name/docstring/metadata onto the wrapper, so introspection tools and debugging don't show the generic wrapper's identity instead." },
  { deck: "python", q: "What's the difference between a @staticmethod and a plain module-level function?", a: "Functionally similar, but the staticmethod is namespaced under the class (accessed via ClassName.method or an instance), grouping it logically with related code." },
  { deck: "python", q: "What's an advantage of the array module over a plain list for large numeric data?", a: "It stores values in a compact, fixed-type C-like buffer, using far less memory than a list of individually boxed Python objects." },
  { deck: "python", q: "What's queue.Queue used for?", a: "A thread-safe FIFO queue for passing data safely between threads, unlike a plain list which isn't safe under concurrent access." },
  { deck: "python", q: "What does subprocess.run(['ls', '-l']) do?", a: "Runs an external command as a child process, waits for it to finish, and returns a result object with its output/exit code." },
  { deck: "python", q: "What's the difference between shutil.copy and shutil.copytree?", a: "shutil.copy copies a single file; shutil.copytree recursively copies an entire directory tree." },
  { deck: "python", q: "What's the difference between re.match and re.search?", a: "re.match only checks for a match at the very START of the string; re.search looks for a match anywhere within it." },
  { deck: "python", q: "Why use a raw string like r'\\d+' for regex patterns?", a: "It disables backslash escape processing, so backslashes are passed through literally to the regex engine instead of Python interpreting them first." },
  { deck: "python", q: "What does collections.defaultdict(list) do differently from a plain dict?", a: "Automatically creates a new empty list for any missing key the first time it's accessed, instead of raising a KeyError." },
  { deck: "python", q: "What's collections.deque optimized for, compared to a list?", a: "O(1) appends/pops from BOTH ends; a list is O(n) for operations at the front since every other element must shift." },
  { deck: "python", q: "What's the convention behind a well-written __repr__?", a: "Ideally it looks like valid Python code that could recreate the object, e.g. Point(x=1, y=2), even though this isn't strictly enforced." },
  { deck: "python", q: "What does enumerate(items, start=1) change compared to the default?", a: "The yielded index begins counting from 1 instead of the default 0, while the items themselves are unaffected." },

  { deck: "typescript-javascript", q: "What does === check that == doesn't?", a: "<code>===</code> checks type AND value (strict equality) — no implicit type coercion. <code>==</code> converts types first, which causes surprises like <code>0 == \"\"</code> being true." },
  { deck: "typescript-javascript", q: "What's a closure?", a: "A function that remembers the variables from the scope it was created in, even after that outer function has finished running." },
  { deck: "typescript-javascript", q: "What does a function with no return statement return?", a: "<code>undefined</code>." },
  { deck: "typescript-javascript", q: "What's the difference between let and var?", a: "<code>let</code> is block-scoped; <code>var</code> is function-scoped and can lead to confusing bugs when used inside loops/blocks." },
  { deck: "typescript-javascript", q: "What is the event loop, in one sentence?", a: "The mechanism that runs your synchronous code to completion first, then processes queued callbacks (timers, promises, I/O) one at a time." },
  { deck: "typescript-javascript", q: "What does Array.prototype.map return?", a: "A brand-new array, the same length as the original, with each element transformed by the callback — it never mutates the original array." },
  { deck: "typescript-javascript", q: "How do you check if a value is an array?", a: "<code>Array.isArray(value)</code> — <code>typeof</code> returns \"object\" for arrays too, so it can't distinguish them." },
  { deck: "typescript-javascript", q: "What is 'this' inside a regular function called as obj.method()?", a: "It refers to <code>obj</code> — the object the method was called on. Arrow functions do NOT get their own <code>this</code>; they inherit it from their enclosing scope." },
  { deck: "typescript-javascript", q: "What does TypeScript add at runtime that plain JS doesn't have?", a: "Nothing — types are erased entirely at compile time. TypeScript is purely a compile-time/tooling layer over JavaScript." },
  { deck: "typescript-javascript", q: "What's the practical difference between an interface and a type alias in TS?", a: "They're mostly interchangeable for object shapes; interfaces can be re-opened/merged by declaring them again, type aliases cannot." },
  { deck: "typescript-javascript", q: "What does an async function always return?", a: "A Promise — even if you write a plain <code>return value</code>, it gets wrapped in <code>Promise.resolve(value)</code>." },
  { deck: "typescript-javascript", q: "What does await do to a promise?", a: "Pauses the async function until that promise settles, then unwraps it to its resolved value (or throws if it rejected)." },
  { deck: "typescript-javascript", q: "What's the difference between null and undefined?", a: "<code>undefined</code> means a variable was declared but never assigned; <code>null</code> is an explicit, intentional \"no value\" assignment." },
  { deck: "typescript-javascript", q: "What is destructuring, e.g. const {a, b} = obj?", a: "A shorthand for pulling multiple properties out of an object (or items out of an array) into individual variables in one statement." },
  { deck: "typescript-javascript", q: "What does the spread operator do in [...arr]?", a: "Creates a shallow copy of the array (or merges arrays/objects when combined with other elements)." },
  { deck: "typescript-javascript", q: "What's Promise.all used for?", a: "Running multiple promises concurrently and waiting for ALL of them to resolve (or failing fast if any one rejects)." },
  { deck: "typescript-javascript", q: "What does 'blocking' mean for synchronous code?", a: "It occupies the single JS thread until it finishes — nothing else (renders, other callbacks) can run in the meantime." },
  { deck: "typescript-javascript", q: "What is hoisting?", a: "Variable and function declarations are conceptually moved to the top of their scope before code runs — <code>var</code> and function declarations are hoisted; <code>let</code>/<code>const</code> are hoisted but stay in a 'temporal dead zone'." },
  { deck: "typescript-javascript", q: "What does \"use strict\" change?", a: "Turns silent mistakes (like assigning to an undeclared variable) into thrown errors, and disables some confusing legacy behaviors." },
  { deck: "typescript-javascript", q: "What's a generic <T> for, e.g. function identity<T>(x: T): T?", a: "It lets a function/type work with whatever type is passed in, while still preserving and checking that type, instead of using <code>any</code>." },
  { deck: "typescript-javascript", q: "What does Array.prototype.forEach return?", a: "undefined — it's used purely for side effects, unlike map which returns a new array." },
  { deck: "typescript-javascript", q: "What does Object.entries(obj) return?", a: "An array of [key, value] pairs from the object's own enumerable properties." },
  { deck: "typescript-javascript", q: "What's a Map used for over a plain object?", a: "Storing key-value pairs where keys can be any type (not just strings), with guaranteed insertion order and easy size tracking." },
  { deck: "typescript-javascript", q: "In TS, what's a union type, e.g. string | number?", a: "A type that can be one of several specified types." },
  { deck: "typescript-javascript", q: "What does Array.prototype.includes check?", a: "Whether an array contains a given value, returning true/false (works with NaN, unlike indexOf)." },
  { deck: "typescript-javascript", q: "What's the difference between a regular function and an arrow function for `this` binding?", a: "A regular function gets its own <code>this</code> based on how it's called; an arrow function has no own <code>this</code> — it inherits from its enclosing scope." },
  { deck: "typescript-javascript", q: "What does Array.prototype.slice do vs .splice?", a: ".slice() returns a shallow copy of a portion without modifying the original; .splice() mutates the array in place, adding/removing elements." },
  { deck: "typescript-javascript", q: "What's a callback function?", a: "A function passed as an argument to another function, to be invoked later (e.g. after an async operation completes)." },
  { deck: "typescript-javascript", q: "What does Promise.allSettled do differently from Promise.all?", a: "It waits for every promise to settle (resolve OR reject) and reports each outcome, instead of rejecting immediately on the first failure." },
  { deck: "typescript-javascript", q: "What's TypeScript's unknown type for, vs any?", a: "<code>unknown</code> also accepts anything, but forces you to narrow/check the type before using it — safer than <code>any</code>, which disables checking entirely." },
  { deck: "typescript-javascript", q: "What does typeof return for an array?", a: "'object' — arrays are objects in JS; use Array.isArray() to detect arrays specifically." },
  { deck: "typescript-javascript", q: "What's a truthy value in JavaScript?", a: "Any value that coerces to true in a boolean context — everything except the falsy values (false, 0, '', null, undefined, NaN)." },
  { deck: "typescript-javascript", q: "What does Array.prototype.join('-') do?", a: "Concatenates all array elements into a string, separated by the given separator." },
  { deck: "typescript-javascript", q: "What's the difference between a function declaration and a function expression?", a: "Function declarations are hoisted (usable before their definition); function expressions are not." },
  { deck: "typescript-javascript", q: "What does structuredClone(obj) do?", a: "Creates a deep copy of an object/array, including nested structures, natively (no library needed)." },
  { deck: "typescript-javascript", q: "What's a generic constraint, e.g. <T extends { id: number }>?", a: "Restricts a generic type parameter to only types that satisfy the given shape/interface." },
  { deck: "typescript-javascript", q: "What does a catch block receive?", a: "The thrown error/value from the try block (or a rejected promise)." },
  { deck: "typescript-javascript", q: "What's the purpose of Array.prototype.every?", a: "Returns true only if ALL elements pass the given test function." },
  { deck: "typescript-javascript", q: "What does the void operator do in JS?", a: "Evaluates an expression and returns undefined — rarely needed today, historically used in href=\"javascript:void(0)\"." },
  { deck: "typescript-javascript", q: "What's the difference between synchronous and asynchronous errors in JS?", a: "Synchronous errors are caught with try/catch directly; asynchronous errors (in promises) need .catch() or try/catch with await." },
  { deck: "typescript-javascript", q: "What's the difference between localStorage and sessionStorage?", a: "localStorage persists until explicitly cleared; sessionStorage is cleared when the browser tab closes. Both are per-origin and store strings only." },
  { deck: "typescript-javascript", q: "What does event.preventDefault() do?", a: "Stops the browser's default action for that event, e.g. preventing a form's normal submit-and-reload behavior." },
  { deck: "typescript-javascript", q: "What does event.stopPropagation() do?", a: "Stops the event from continuing to bubble up (or capture down) to ancestor elements' handlers." },
  { deck: "typescript-javascript", q: "What's event delegation?", a: "Attaching one listener to a parent element and checking event.target, instead of attaching a listener to every child — fewer listeners, works for dynamically added children too." },
  { deck: "typescript-javascript", q: "What does Object.assign({}, a, b) do?", a: "Shallow-merges b's own enumerable properties into a copy of a, returning a new object (later sources overwrite earlier ones on conflicts)." },
  { deck: "typescript-javascript", q: "What's the difference between a shallow copy and a deep copy of an object?", a: "A shallow copy duplicates the top-level object but nested objects are still shared references; a deep copy recursively duplicates everything." },
  { deck: "typescript-javascript", q: "What does Array.prototype.indexOf return if the value isn't found?", a: "-1." },
  { deck: "typescript-javascript", q: "What's a WeakMap, and why 'weak'?", a: "A Map-like structure whose keys must be objects; if a key object has no other references, it can be garbage collected — the WeakMap doesn't keep it alive." },
  { deck: "typescript-javascript", q: "What does the debounce pattern do for an input handler?", a: "Delays running the handler until a burst of events (e.g. keystrokes) has paused for a set time, avoiding running it on every single event." },
  { deck: "typescript-javascript", q: "What's the difference between debounce and throttle?", a: "Debounce waits for a pause in events before firing once; throttle fires at most once per fixed time interval regardless of how many events occur." },
  { deck: "typescript-javascript", q: "What does export default do in a module, vs a named export?", a: "Marks one value as the module's primary export, importable under any name without braces; named exports must be imported by their exact name (optionally aliased)." },
  { deck: "typescript-javascript", q: "What's a Symbol used for in JS?", a: "Creating a guaranteed-unique value, often used as a non-colliding object property key." },
  { deck: "typescript-javascript", q: "In TS, what does a tuple type like [string, number] enforce?", a: "A fixed-length array where each position has a specific, checked type — unlike a regular array type of mixed-length same-typed elements." },
  { deck: "typescript-javascript", q: "What does Array.prototype.at(-1) return?", a: "The last element of the array — negative indices count from the end, unlike bracket indexing." },
  { deck: "typescript-javascript", q: "What's the purpose of a TypeScript type guard, e.g. typeof x === 'string'?", a: "Narrows a broader type (like a union) down to a specific type within a conditional block, so TypeScript lets you use type-specific operations safely." },
  { deck: "typescript-javascript", q: "What does new Promise((resolve, reject) => {...}) let you do?", a: "Wrap callback-based or manual async logic in a Promise, calling resolve(value) on success or reject(error) on failure." },
  { deck: "typescript-javascript", q: "What's the difference between call, apply, and bind?", a: "call/apply invoke a function immediately with a given `this` (call takes args individually, apply takes an array); bind returns a NEW function permanently bound to that `this`, without calling it." },
  { deck: "typescript-javascript", q: "What does Number.isInteger(x) check that typeof x === 'number' doesn't?", a: "Whether x is specifically a whole number, not just any number (e.g. 4.5 is a number but not an integer)." },
  { deck: "typescript-javascript", q: "What's the module scope guarantee ES modules give you that classic <script> tags don't?", a: "Variables/functions declared in a module aren't automatically added to the global scope — each module has its own top-level scope." },
  { deck: "typescript-javascript", q: "What does Array.prototype.flatMap do?", a: "Maps each element then flattens the result by one level — equivalent to .map(fn).flat()." },
  { deck: "typescript-javascript", q: "What's the difference between a Set and an array for membership checks?", a: "Set.has() is O(1) average; Array.includes() is O(n) since it scans linearly — Set is far faster for large repeated lookups." },
  { deck: "typescript-javascript", q: "What does the ! non-null assertion operator do in TypeScript, e.g. value!?", a: "Tells the compiler 'trust me, this isn't null/undefined here' without an actual runtime check — it can still crash if you're wrong." },
  { deck: "typescript-javascript", q: "What's the difference between a Promise and an async/await function under the hood?", a: "async/await is syntax sugar over Promises — it makes chained .then() logic read like synchronous code, but still resolves to a Promise." },
  { deck: "typescript-javascript", q: "What does Array.prototype.reverse() do to the original array?", a: "Reverses it IN PLACE (mutates it) and also returns the same reversed array." },
  { deck: "typescript-javascript", q: "What's the purpose of a discriminated union in TypeScript, e.g. using a shared 'type' field?", a: "Lets TypeScript narrow which variant of a union you have by checking one common literal field, enabling exhaustive, type-safe branching." },
  { deck: "typescript-javascript", q: "What does queueMicrotask / a resolved Promise's .then callback run relative to setTimeout(fn, 0)?", a: "Microtasks (promise callbacks) always run before the next macrotask (like a setTimeout callback), even one scheduled for 0ms." },
  { deck: "typescript-javascript", q: "What's the difference between an abstract class and an interface in TypeScript?", a: "An abstract class can include actual implementation and be extended (single inheritance); an interface only describes shape and can be implemented by many unrelated classes." },
  { deck: "typescript-javascript", q: "What does Array.prototype.fill(0, 1, 3) do?", a: "Sets elements from index 1 up to (not including) 3 to 0, mutating the array in place." },
  { deck: "typescript-javascript", q: "What's the point of the never type in TypeScript?", a: "Represents a value that can never occur — e.g. a function that always throws, or an exhaustively-checked switch's unreachable default case." },
  { deck: "typescript-javascript", q: "What's the difference between a for...of loop and Array.prototype.forEach?", a: "for...of works over any iterable and supports break/continue/return; forEach only works on arrays (and array-likes) and can't be stopped early." },
  { deck: "typescript-javascript", q: "What's the difference between Array.prototype.find and .filter?", a: "find() returns the FIRST matching element (or undefined); filter() returns a new array of ALL matching elements." },
  { deck: "typescript-javascript", q: "What does Object.freeze(obj) prevent?", a: "Adding, removing, or reassigning obj's own top-level properties — attempts silently fail (or throw in strict mode); nested objects are still mutable." },
  { deck: "typescript-javascript", q: "What does Array.prototype.some do?", a: "Returns true if AT LEAST ONE element passes the given test function, short-circuiting as soon as one does." },
  { deck: "typescript-javascript", q: "What's a JS Proxy used for?", a: "Wrapping an object to intercept and customize fundamental operations on it (get, set, has, etc.) via trap functions." },
  { deck: "typescript-javascript", q: "How does iterating a WeakMap differ from iterating a Map?", a: "You can't — WeakMap isn't iterable and has no .keys()/.size, since its entries can vanish via garbage collection at any time." },
  { deck: "typescript-javascript", q: "What does Array.from({length: 5}, (_, i) => i) produce?", a: "[0, 1, 2, 3, 4] — it builds an array of the given length, using the callback to compute each element from its index." },
  { deck: "typescript-javascript", q: "What does TypeScript's keyof operator produce, e.g. keyof {a: 1, b: 2}?", a: "A union of that type's property names as string literal types: 'a' | 'b'." },
  { deck: "typescript-javascript", q: "What does TypeScript's Partial<T> utility type do?", a: "Produces a new type with all of T's properties marked optional." },
  { deck: "typescript-javascript", q: "What does TypeScript's Pick<T, 'a' | 'b'> do?", a: "Produces a new type containing only the specified properties from T." },
  { deck: "typescript-javascript", q: "What does TypeScript's Record<K, V> represent?", a: "An object type whose keys are of type K and whose values are all of type V — useful for typed dictionaries/lookup maps." },
  { deck: "typescript-javascript", q: "What does the in operator check on a plain JS object, e.g. 'x' in obj?", a: "Whether obj has an own OR inherited property named 'x' (not whether some value equals 'x')." },
  { deck: "typescript-javascript", q: "What does Object.defineProperty let you do that normal assignment doesn't?", a: "Precisely control a property's behavior — e.g. making it non-enumerable, read-only, or backed by a getter/setter." },
  { deck: "typescript-javascript", q: "What's a 'higher-order function'?", a: "A function that takes another function as an argument, returns a function, or both — e.g. map, filter, and debounce." },
  { deck: "typescript-javascript", q: "What's the key difference between for...in and for...of?", a: "for...in iterates an object's enumerable property KEYS (including inherited/array indices as strings); for...of iterates an iterable's VALUES directly." },
  { deck: "typescript-javascript", q: "What does TypeScript's satisfies operator do, e.g. const x = {...} satisfies Config?", a: "Checks the value matches a type WITHOUT widening/changing its inferred type, unlike an `as Config` assertion or an explicit type annotation." },
  { deck: "typescript-javascript", q: "What's an IIFE (Immediately Invoked Function Expression)?", a: "A function defined and called immediately, e.g. (function(){ ... })(), historically used to create an isolated scope." },
  { deck: "typescript-javascript", q: "What's the difference between Promise.any and Promise.race?", a: "Promise.any resolves with the first FULFILLED promise, ignoring rejections unless all reject; Promise.race settles on whichever promise finishes first, success or failure." },
  { deck: "typescript-javascript", q: "What does 'structural typing' mean in TypeScript?", a: "Compatibility is based on an object's actual shape (which properties/methods it has), not on its declared class/name — two unrelated types with the same shape are interchangeable." },
  { deck: "typescript-javascript", q: "What does a ??= b (logical nullish assignment) do?", a: "Assigns b to a only if a is currently null or undefined, leaving other falsy values (0, '', false) untouched." },
  { deck: "typescript-javascript", q: "What's the difference between Object.keys and Object.getOwnPropertyNames?", a: "Object.keys returns only ENUMERABLE own properties; getOwnPropertyNames returns ALL own properties, including non-enumerable ones." },
  { deck: "typescript-javascript", q: "What's 'currying' a function?", a: "Transforming a function that takes multiple arguments into a sequence of functions that each take one argument, e.g. add(a)(b) instead of add(a, b)." },
  { deck: "typescript-javascript", q: "What does Array.prototype.reduceRight do differently from reduce?", a: "Processes the array from right to left instead of left to right, otherwise working the same way." },
  { deck: "typescript-javascript", q: "What's the difference between String(null) and null.toString()?", a: "String(null) safely returns 'null'; calling null.toString() directly throws a TypeError since null has no methods." },
  { deck: "typescript-javascript", q: "What does TypeScript's Readonly<T> utility type do?", a: "Produces a new type where all of T's properties are marked readonly, preventing reassignment after creation." },
  { deck: "typescript-javascript", q: "What does TypeScript's Omit<T, 'a'> do?", a: "Produces a new type with all of T's properties except the specified one(s)." },
  { deck: "typescript-javascript", q: "How does Array.prototype.toSorted differ from .sort()?", a: "toSorted() returns a NEW sorted array, leaving the original untouched; .sort() mutates the array in place." },
  { deck: "typescript-javascript", q: "In TypeScript, what does function f(x?: number) mean for the x parameter?", a: "x is optional — callers may omit it, in which case its value is undefined inside the function." },
  { deck: "typescript-javascript", q: "What do default parameters look like, e.g. function f(x = 10)?", a: "If the caller omits x (or passes undefined), it defaults to 10 instead." },
  { deck: "typescript-javascript", q: "What does instanceof check, e.g. arr instanceof Array?", a: "Whether an object's prototype chain includes the given constructor's prototype — a runtime check, unlike TypeScript's compile-time type system." },
  { deck: "typescript-javascript", q: "What's the difference between array.concat(other) and [...array, ...other]?", a: "Functionally equivalent for combining arrays into a new one — concat is a method call, spread is newer syntax; neither mutates the originals." },
  { deck: "typescript-javascript", q: "What's the Fetch API used for?", a: "Making HTTP requests from JavaScript, returning a Promise that resolves to a Response object — the modern replacement for XMLHttpRequest." },
  { deck: "typescript-javascript", q: "What does an AbortController let you do with a fetch request?", a: "Cancel an in-flight request by calling .abort(), by passing its .signal into fetch's options." },
  { deck: "typescript-javascript", q: "What's a 'polyfill'?", a: "Code that implements a newer feature's behavior in older environments that don't support it natively." },
  { deck: "typescript-javascript", q: "What does Array.prototype.entries() return?", a: "An iterator of [index, value] pairs for the array, usable in a for...of loop." },
  { deck: "typescript-javascript", q: "How does Object.is differ from === for NaN and -0?", a: "Object.is(NaN, NaN) is true (unlike ===) and Object.is(0, -0) is false (unlike ===), correctly distinguishing those two edge cases." },
  { deck: "typescript-javascript", q: "What's a tagged template literal, e.g. tag`Hello ${name}`?", a: "Calls the function tag with the literal's string parts and interpolated values, letting it process/transform the output custom logic (e.g. escaping)." },
  { deck: "typescript-javascript", q: "What does the built-in Intl object provide?", a: "Locale-aware formatting for numbers, dates, currencies, and more, without needing an external library." },
  { deck: "typescript-javascript", q: "What's a WeakSet used for?", a: "Storing a collection of objects (not primitives) that can still be garbage collected if nothing else references them, unlike a regular Set." },
  { deck: "typescript-javascript", q: "What's a subtle difference between Array.of(7) and new Array(7)?", a: "Array.of(7) creates a one-element array [7]; new Array(7) creates an empty array with length 7 (no elements) — Array.of avoids that footgun." },
  { deck: "typescript-javascript", q: "What does Object.create(proto) do?", a: "Creates a new object whose prototype is directly set to the given proto object, without running any constructor." },
  { deck: "typescript-javascript", q: "What's the JavaScript 'prototype chain'?", a: "The link from an object to another object it delegates property/method lookups to when a property isn't found directly on itself." },
  { deck: "typescript-javascript", q: "What does class B extends A do under the hood?", a: "Sets up B.prototype's internal prototype link to A.prototype, so instances of B inherit A's methods via the prototype chain." },
  { deck: "typescript-javascript", q: "What's a 'mixin' pattern in JavaScript?", a: "Combining behavior from multiple sources into one class/object (since JS only supports single inheritance), often via Object.assign onto a prototype or functions that return extended classes." },
  { deck: "typescript-javascript", q: "What does Array.prototype.keys() return?", a: "An iterator over the array's indices (0, 1, 2, ...), not its values." },
  { deck: "typescript-javascript", q: "What extra argument does Map.prototype.forEach's callback get that Array.prototype.forEach's doesn't semantically differ in?", a: "Map's callback receives (value, key, map) where 'key' can be any type; Array's receives (value, index, array) where the index is always a number." },
  { deck: "typescript-javascript", q: "What does the Reflect object provide?", a: "A set of methods mirroring fundamental object operations (get, set, has, etc.) as regular functions, often used alongside Proxy traps." },
  { deck: "typescript-javascript", q: "What's 'tree shaking' in the context of a JS bundler?", a: "Eliminating unused exported code from the final bundle, based on static analysis of which imports are actually used." },
  { deck: "typescript-javascript", q: "What does the dynamic import() function return?", a: "A Promise that resolves to the imported module, letting you load code on demand instead of always bundling it upfront." },
  { deck: "typescript-javascript", q: "What's a service worker used for, at a high level?", a: "A background script that can intercept network requests, enabling offline support and caching for a web app." },
  { deck: "typescript-javascript", q: "What makes a function 'pure'?", a: "Given the same inputs it always returns the same output, and it causes no observable side effects (no mutating outside state, no I/O)." },
  { deck: "typescript-javascript", q: "How does Array.prototype.toReversed differ from .reverse()?", a: "toReversed() returns a new reversed array, leaving the original untouched; .reverse() mutates the array in place." },
  { deck: "typescript-javascript", q: "What does a get/set pair in a class body define?", a: "A property that runs custom code when read (get) or assigned (set), while still being accessed with plain property syntax like obj.value." },
  { deck: "typescript-javascript", q: "What does Object.hasOwn(obj, 'prop') check?", a: "Whether obj has 'prop' as its OWN property (not inherited) — a safer modern alternative to obj.hasOwnProperty('prop')." },
  { deck: "typescript-javascript", q: "Why do bundlers tree-shake named exports more reliably than a single export default object?", a: "Named exports are individually analyzable at the module level; a default export bundling everything into one object hides which parts are actually used." },
  { deck: "typescript-javascript", q: "What does Array.prototype.copyWithin(0, 3) do?", a: "Copies a slice of the array (starting at index 3) over the array's own elements starting at index 0, mutating it in place." },

  { deck: "html-css", q: "What are the four layers of the CSS box model, outside in?", a: "margin, border, padding, content." },
  { deck: "html-css", q: "What does box-sizing: border-box change?", a: "Width/height now include padding and border, instead of them being added on top — makes sizing far more predictable." },
  { deck: "html-css", q: "In flexbox, what does justify-content control vs align-items?", a: "<code>justify-content</code> aligns along the MAIN axis; <code>align-items</code> aligns along the CROSS axis (perpendicular to it)." },
  { deck: "html-css", q: "What's the difference between visibility: hidden and display: none?", a: "<code>display: none</code> removes the element from layout entirely (no space taken). <code>visibility: hidden</code> hides it but its space is still reserved." },
  { deck: "html-css", q: "What does specificity determine, and roughly how is it ranked?", a: "Which CSS rule wins when multiple rules target the same element. Roughly: inline styles > IDs > classes/attributes/pseudo-classes > element selectors." },
  { deck: "html-css", q: "What unit is relative to the root element's font size?", a: "<code>rem</code> (root em) — unlike <code>em</code>, which is relative to the CURRENT element's own font size, so it doesn't compound unpredictably when nested." },
  { deck: "html-css", q: "What does position: absolute position an element relative to?", a: "Its nearest ancestor with a position other than static (relative/absolute/fixed) — or the document if none exists." },
  { deck: "html-css", q: "What does 'semantic HTML' mean?", a: "Using tags that describe their meaning/role (<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>) instead of generic <code>&lt;div&gt;</code>s for everything." },
  { deck: "html-css", q: "Which attribute makes an image accessible to screen readers?", a: "<code>alt</code> — it should describe the image's content/purpose, not just repeat the filename." },
  { deck: "html-css", q: "What's the difference between <ol> and <ul>?", a: "<code>&lt;ol&gt;</code> is an ordered (numbered) list; <code>&lt;ul&gt;</code> is unordered (bulleted) — pick based on whether sequence/order matters." },
  { deck: "html-css", q: "Is CSS Grid 1-dimensional or 2-dimensional, vs Flexbox?", a: "Grid lays items out in rows AND columns at once (2D); Flexbox lays items out along a single axis at a time (1D)." },
  { deck: "html-css", q: "What is a media query for?", a: "Applying different CSS rules based on conditions like viewport width, enabling responsive design across screen sizes." },
  { deck: "html-css", q: "What does z-index require to have any effect?", a: "The element must have a position value other than static (relative/absolute/fixed/sticky) — z-index is ignored on static elements." },
  { deck: "html-css", q: "Can margins collapse the way padding does?", a: "Yes — adjacent vertical margins between block elements can collapse into a single margin; padding never collapses." },
  { deck: "html-css", q: "What's the viewport meta tag for?", a: "<code>&lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"&gt;</code> tells mobile browsers to render at the device's actual width instead of a zoomed-out desktop layout." },
  { deck: "html-css", q: "What does the :hover pseudo-class target?", a: "An element while the user's pointer is over it." },
  { deck: "html-css", q: "How do you declare and use a CSS custom property (variable)?", a: "Declare with <code>--name: value;</code> (often on <code>:root</code>), use with <code>var(--name)</code>." },
  { deck: "html-css", q: "What's the core layout difference between an inline and a block element?", a: "Block elements take the full available width and start on a new line; inline elements only take up as much width as their content and flow within a line." },
  { deck: "html-css", q: "What's the difference between the src and href attributes?", a: "<code>src</code> embeds/replaces content in place (images, scripts); <code>href</code> links to a related resource (stylesheets, anchors) without embedding it." },
  { deck: "html-css", q: "What's the difference between an img's alt and title attribute?", a: "<code>alt</code> is the accessible text shown/read if the image fails to load (required for accessibility); <code>title</code> is an optional tooltip shown on hover." },
  { deck: "html-css", q: "What does the form action attribute specify?", a: "The URL the form's data is submitted to." },
  { deck: "html-css", q: "What's the difference between GET and POST form methods?", a: "GET appends data to the URL (visible, limited length, cacheable); POST sends it in the request body (hidden, no size limit, not cached by default)." },
  { deck: "html-css", q: "What does aria-label do?", a: "Provides an accessible name for an element for screen readers, when there's no visible text to use." },
  { deck: "html-css", q: "What's the CSS cascade, briefly?", a: "The algorithm that decides which of multiple conflicting rules applies, based on origin, specificity, and source order." },
  { deck: "html-css", q: "What does !important do in CSS?", a: "Forces that declaration to override normal specificity rules — best used sparingly, as it makes styles harder to reason about." },
  { deck: "html-css", q: "What's the difference between min-width and width?", a: "<code>width</code> sets a fixed target size; <code>min-width</code> sets a floor the element won't shrink below, while still allowing it to grow." },
  { deck: "html-css", q: "What does <nav> semantically indicate?", a: "A section containing primary navigation links for the site/page." },
  { deck: "html-css", q: "What's a CSS combinator, e.g. the space in `div p`?", a: "A symbol describing the relationship between two selectors — descendant, child (>), adjacent sibling (+), or general sibling (~)." },
  { deck: "html-css", q: "What does object-fit: cover do on an img?", a: "Scales the image to fill its box while preserving aspect ratio, cropping any overflow." },
  { deck: "html-css", q: "What's the purpose of the meta name=\"description\" tag?", a: "Provides a short summary of the page, often shown in search engine results." },
  { deck: "html-css", q: "What does white-space: nowrap do?", a: "Prevents text from wrapping to a new line, letting it overflow instead." },
  { deck: "html-css", q: "What's a CSS pseudo-element, e.g. ::before?", a: "Lets you insert generated content or style a specific sub-part of an element that isn't a real DOM node." },
  { deck: "html-css", q: "What does a <button> default to if you don't set its type?", a: "type=\"submit\" — which will submit its enclosing form, a common source of accidental form submissions." },
  { deck: "html-css", q: "What's the difference between <strong> and <b>?", a: "<code>&lt;strong&gt;</code> conveys semantic importance (read differently by assistive tech); <code>&lt;b&gt;</code> is purely visual bold styling with no added meaning." },
  { deck: "html-css", q: "What does line-height control?", a: "The vertical space allotted for each line of text, affecting readability and spacing between wrapped lines." },
  { deck: "html-css", q: "What's the purpose of the lang attribute on <html>?", a: "Declares the page's language, helping screen readers use correct pronunciation and search engines with localization." },
  { deck: "html-css", q: "What does grid-column: span 2 do?", a: "Makes a grid item occupy 2 columns instead of 1." },
  { deck: "html-css", q: "What's the difference between <section> and <div>?", a: "<code>&lt;section&gt;</code> implies a thematic grouping of content (semantic); <code>&lt;div&gt;</code> carries no meaning, purely a generic container." },
  { deck: "html-css", q: "What's the purpose of tabindex=\"0\" on a non-interactive element?", a: "Makes it focusable via keyboard tab navigation, important for custom interactive components' accessibility." },
  { deck: "html-css", q: "What does resize: vertical on a textarea do?", a: "Lets the user drag to resize the textarea's height only, not its width." },
  { deck: "html-css", q: "What's the difference between em and rem units?", a: "<code>em</code> is relative to the CURRENT element's font-size (compounds when nested); <code>rem</code> is always relative to the root element's font-size." },
  { deck: "html-css", q: "What does the CSS gap property do in a grid or flex container?", a: "Sets consistent spacing between items/rows/columns without needing margins on the items themselves." },
  { deck: "html-css", q: "What's the purpose of a CSS reset or normalize stylesheet?", a: "Removes/evens out inconsistent default browser styling (margins, list bullets, etc.) so layouts start from a predictable baseline." },
  { deck: "html-css", q: "What does :nth-child(2n) select?", a: "Every even-numbered child element (2nd, 4th, 6th, ...) among its siblings." },
  { deck: "html-css", q: "What's the difference between relative and absolute positioning?", a: "<code>relative</code> shifts an element from its normal position while still occupying its original space; <code>absolute</code> removes it from flow and positions it against its nearest positioned ancestor." },
  { deck: "html-css", q: "What does the CSS clamp(min, preferred, max) function do?", a: "Picks the preferred value but constrains it between a minimum and maximum — commonly used for fluid, responsive font sizes." },
  { deck: "html-css", q: "What's the purpose of the <fieldset> and <legend> tags?", a: "<code>&lt;fieldset&gt;</code> visually/semantically groups related form controls; <code>&lt;legend&gt;</code> gives that group an accessible caption." },
  { deck: "html-css", q: "What does aspect-ratio: 16 / 9 do on an element?", a: "Forces the element to maintain that width-to-height ratio as it resizes, without needing padding-hack tricks." },
  { deck: "html-css", q: "What's the difference between inline, block, and inline-block display values?", a: "Block takes full width and starts a new line; inline flows with text and ignores width/height; inline-block flows like inline but respects width/height/margin like block." },
  { deck: "html-css", q: "What does the CSS :focus-visible pseudo-class target, vs :focus?", a: "<code>:focus-visible</code> only matches when the browser thinks focus should be visibly indicated (e.g. keyboard nav), avoiding the focus ring on mouse clicks that :focus alone would show." },
  { deck: "html-css", q: "What's the purpose of the <picture> element?", a: "Lets the browser choose the best image source among multiple options based on screen size/resolution/format support." },
  { deck: "html-css", q: "What does min() and max() do in CSS, e.g. width: min(90%, 600px)?", a: "Picks the smallest (min) or largest (max) of the given values, letting a size respond to whichever constraint is tighter." },
  { deck: "html-css", q: "What's the difference between the <script> attributes async and defer?", a: "Both download the script without blocking parsing; <code>async</code> runs it as soon as it's ready (order not guaranteed); <code>defer</code> runs it after parsing finishes, in document order." },
  { deck: "html-css", q: "What does the CSS :not() pseudo-class do, e.g. li:not(:last-child)?", a: "Selects elements that DON'T match the selector inside the parentheses." },
  { deck: "html-css", q: "What's the difference between max-width and width for a responsive image?", a: "<code>width: 100%</code> always fills its container, even upscaling a small image; <code>max-width: 100%</code> shrinks to fit but never grows past the image's natural size." },
  { deck: "html-css", q: "What does the CSS inherit keyword do, e.g. color: inherit?", a: "Explicitly takes the computed value from the parent element, useful for properties that don't naturally inherit (like color does, but border doesn't)." },
  { deck: "html-css", q: "What's the purpose of role=\"button\" on a non-<button> element?", a: "Tells assistive technology to treat it as a button semantically — but you still need to add keyboard support (tabindex, Enter/Space handling) yourself." },
  { deck: "html-css", q: "What does grid-auto-flow: row vs column control?", a: "Whether items that aren't explicitly placed are automatically laid into new rows or new columns as the grid fills up." },
  { deck: "html-css", q: "What's the difference between <iframe> and directly embedding content?", a: "An <iframe> embeds an entirely separate document/browsing context (its own DOM, styles, scripts) inline within the page." },
  { deck: "html-css", q: "What does the CSS :is() function let you do, e.g. :is(h1, h2, h3)?", a: "Groups multiple selectors into one, matching any of them — shortens repetitive selector lists." },
  { deck: "html-css", q: "What's the purpose of content-visibility: auto?", a: "Lets the browser skip rendering work for off-screen content until it's about to become visible, improving initial render performance on long pages." },
  { deck: "html-css", q: "What does the CSS currentColor keyword refer to?", a: "The element's own computed 'color' value — useful for making borders/fills match text color without repeating the value." },
  { deck: "html-css", q: "What's the difference between a <table>'s <thead>, <tbody>, and <tfoot>?", a: "They semantically group header rows, body rows, and footer rows respectively, aiding accessibility, styling, and (for large tables) independent scrolling." },
  { deck: "html-css", q: "What does the CSS writing-mode property control?", a: "The direction text and blocks flow — e.g. horizontal-tb (default) vs vertical-rl for vertical text layouts." },
  { deck: "html-css", q: "What's the purpose of the download attribute on an <a> tag?", a: "Tells the browser to download the linked resource as a file instead of navigating to/displaying it." },
  { deck: "html-css", q: "What does the :checked pseudo-class match?", a: "A checked checkbox, radio button, or selected <option> — often paired with a sibling selector to build CSS-only toggle UI." },
  { deck: "html-css", q: "What's the difference between vw units and percentage width?", a: "<code>vw</code> is always relative to the VIEWPORT width; percentage is relative to the element's CONTAINING BLOCK, which may be smaller than the viewport." },
  { deck: "html-css", q: "What does the CSS order property do to a flex/grid item?", a: "Changes its visual order among siblings without changing its position in the actual HTML/DOM." },
  { deck: "html-css", q: "What's the accessibility purpose of a 'skip to content' link?", a: "Lets keyboard/screen-reader users jump past repeated navigation straight to the main content, instead of tabbing through the whole header every page." },
  { deck: "html-css", q: "What's the difference between the <link> tag and the <style> tag?", a: "<code>&lt;link&gt;</code> references an external stylesheet file; <code>&lt;style&gt;</code> embeds CSS rules directly inline in the HTML document." },
  { deck: "html-css", q: "What does overflow-wrap: break-word do?", a: "Allows long, unbreakable words (like a URL) to break and wrap onto a new line instead of overflowing their container." },
  { deck: "html-css", q: "What does the controls attribute on <video>/<audio> add?", a: "The browser's built-in play/pause/volume/seek UI, so you don't have to build custom playback controls." },
  { deck: "html-css", q: "What does text-transform: uppercase do?", a: "Visually displays text in all caps without changing the actual underlying text content/case." },
  { deck: "html-css", q: "What does the :root pseudo-class typically target, and why use it for variables?", a: "The document's root element (<html>) — declaring CSS custom properties there makes them globally available to every element on the page." },
  { deck: "html-css", q: "What does <details>/<summary> provide without any JavaScript?", a: "A native, built-in collapsible disclosure widget — <summary> is the always-visible toggle, <details>'s other content shows/hides on click." },
  { deck: "html-css", q: "What's the key behavioral difference between fixed and absolute positioning when the page scrolls?", a: "fixed stays pinned to the viewport regardless of scrolling; absolute scrolls away with its positioned ancestor like normal content." },
  { deck: "html-css", q: "What does the CSS will-change property hint to the browser?", a: "That a property is about to change (e.g. transform), letting the browser optimize/prepare in advance — best used sparingly, not on everything." },
  { deck: "html-css", q: "Why is it generally discouraged to style based on #id selectors heavily?", a: "IDs have very high specificity, making later overrides hard and often forcing !important — classes are easier to reuse and override predictably." },
  { deck: "html-css", q: "What does text-indent do?", a: "Indents only the FIRST line of a text block, leaving wrapped subsequent lines at the normal margin." },
  { deck: "html-css", q: "What does pointer-events: none do to an element?", a: "Makes it invisible to mouse/pointer interaction — clicks pass through to whatever is beneath it." },
  { deck: "html-css", q: "What does the ::selection pseudo-element let you style?", a: "The appearance (e.g. background/color) of text a user has highlighted/selected on the page." },
  { deck: "html-css", q: "What's the semantic difference between <em> and <i>?", a: "<code>&lt;em&gt;</code> conveys actual stressed emphasis (read differently by assistive tech); <code>&lt;i&gt;</code> is for text in an alternate voice/mood (like a term or thought) with no added emphasis." },
  { deck: "html-css", q: "What does scroll-behavior: smooth do?", a: "Makes programmatic or anchor-link scrolling animate smoothly instead of jumping instantly to the target position." },
  { deck: "html-css", q: "What's the purpose of the srcset attribute on <img>?", a: "Lets the browser pick the most appropriate image file from several resolutions/sizes, based on the device's screen and viewport." },
  { deck: "html-css", q: "What does backdrop-filter: blur(10px) do?", a: "Applies a visual effect (here, blur) to whatever is BEHIND an element, commonly used for frosted-glass style overlays." },
  { deck: "html-css", q: "What's a CSS 'containing block', in simple terms?", a: "The ancestor box that determines a positioned element's size/position percentages — usually the nearest positioned ancestor for absolute elements." },
  { deck: "html-css", q: "What's the difference between justify-items and justify-content in CSS Grid?", a: "justify-items aligns each item WITHIN its own grid cell; justify-content aligns the whole grid track/set of cells within the container." },
  { deck: "html-css", q: "What does the hidden HTML attribute do to an element?", a: "Hides it from rendering entirely (like display: none), usable directly in HTML without CSS." },
  { deck: "html-css", q: "What's the purpose of the <noscript> tag?", a: "Shows fallback content only when JavaScript is disabled or unsupported in the browser." },
  { deck: "html-css", q: "What does the place-items: center shorthand set in a grid/flex container?", a: "Both align-items and justify-items to center in one declaration, centering items both vertically and horizontally." },
  { deck: "html-css", q: "What does 'mobile-first' responsive design mean?", a: "Writing base CSS for small screens first, then using min-width media queries to progressively add complexity for larger screens." },
  { deck: "html-css", q: "What's the difference between overflow: auto and overflow: scroll?", a: "auto shows scrollbars only when content actually overflows; scroll always shows them, even if there's nothing to scroll." },
  { deck: "html-css", q: "What's the purpose of a <caption> element inside a <table>?", a: "Provides an accessible, visible title/description for the table, announced by screen readers before the table's content." },
  { deck: "html-css", q: "What does vertical-align: middle actually affect?", a: "Only inline, inline-block, or table-cell elements' vertical alignment relative to their line/row — it has no effect on block-level or flex/grid items." },
  { deck: "html-css", q: "How does an attribute selector's specificity, e.g. [type=\"text\"], compare to a class selector's?", a: "They're equal — attribute selectors and class selectors have the same specificity weight." },
  { deck: "html-css", q: "What's the difference between the <q> and <blockquote> tags?", a: "<code>&lt;q&gt;</code> is for a short inline quotation; <code>&lt;blockquote&gt;</code> is for a longer, block-level quoted section." },
  { deck: "html-css", q: "What does the CSS all: unset shorthand do?", a: "Resets every property on an element back to its inherited value (or initial value if not inherited), a strong reset in one declaration." },
  { deck: "html-css", q: "What's the purpose of rel=\"noopener\" on a target=\"_blank\" link?", a: "Prevents the newly opened page from getting a reference back to the originating window (window.opener), closing a security/performance loophole." },
  { deck: "html-css", q: "What does the CSS float property do, historically?", a: "Takes an element out of normal flow and shifts it to one side, letting inline content wrap around it — mostly superseded by flexbox/grid for layout today." },
  { deck: "html-css", q: "What's the difference between em and px for font-size in terms of user accessibility?", a: "em (and rem) scale with the user's browser font-size zoom/preference settings; px stays a fixed size regardless, which can hurt accessibility for low-vision users." },
  { deck: "html-css", q: "What does <link rel=\"preload\"> do?", a: "Tells the browser to fetch a critical resource (font, image, script) early, before it's discovered normally, so it's ready sooner when actually needed." },
  { deck: "html-css", q: "What's the difference between rel=\"preconnect\" and rel=\"preload\"?", a: "preconnect just establishes an early connection (DNS/TLS) to a domain; preload fetches a specific resource itself." },
  { deck: "html-css", q: "What does object-position do, paired with object-fit?", a: "Controls which part of the content is visible/anchored within its box, e.g. object-position: top focuses the top of a cropped image." },
  { deck: "html-css", q: "What's the <canvas> element used for?", a: "Drawing raster graphics imperatively via JavaScript (pixels, shapes, animations) — nothing renders until script draws to it." },
  { deck: "html-css", q: "What's a key difference between <svg> and <canvas>?", a: "SVG content is made of scalable, inspectable DOM elements (vector); canvas is an immediate-mode pixel bitmap with no per-shape DOM nodes." },
  { deck: "html-css", q: "What does mix-blend-mode do?", a: "Controls how an element's content visually blends with the content behind it, similar to blend modes in image editors." },
  { deck: "html-css", q: "What's the purpose of the classic 'CSS sprite' technique?", a: "Combining many small images into one file and showing only a piece via background-position, reducing the number of HTTP requests." },
  { deck: "html-css", q: "What's the <time> element for?", a: "Marking up a human-readable date/time while providing a machine-readable datetime attribute for tools/search engines." },
  { deck: "html-css", q: "What does <abbr title=\"...\"> provide?", a: "A tooltip expansion for an abbreviation/acronym, helping both sighted users (on hover) and assistive tech." },
  { deck: "html-css", q: "What's the difference between <sub> and <sup>?", a: "<code>&lt;sub&gt;</code> renders subscript text (lowered); <code>&lt;sup&gt;</code> renders superscript text (raised), e.g. for footnotes or exponents." },
  { deck: "html-css", q: "What does text-shadow: 2px 2px 4px black do?", a: "Adds a shadow behind text, offset 2px right/down with a 4px blur, in black." },
  { deck: "html-css", q: "What does the inset keyword do in box-shadow: inset 0 0 5px black?", a: "Draws the shadow INSIDE the element's border instead of projecting outward from it." },
  { deck: "html-css", q: "What does filter: grayscale(100%) do to an element?", a: "Renders it in full grayscale, removing color saturation, purely visually (the underlying image/content is unchanged)." },
  { deck: "html-css", q: "What's the core difference between a CSS transition and a CSS animation?", a: "A transition animates a property change between two states (triggered by something like :hover); an animation uses @keyframes to define multiple steps and can run independently, repeat, or loop." },
  { deck: "html-css", q: "What does an @keyframes rule define?", a: "A named sequence of style states at different percentages of an animation's duration, used by the animation property." },
  { deck: "html-css", q: "What does transform-origin control?", a: "The point around which a transform (like rotate or scale) is applied — by default the element's center." },
  { deck: "html-css", q: "Why use transform: translate3d(x,y,0) instead of translate(x,y) for animations?", a: "It hints the browser to use GPU-accelerated compositing, often resulting in smoother performance for the same visual move." },
  { deck: "html-css", q: "What does object-fit: none do on an image inside a sized box?", a: "Renders it at its natural size, ignoring the box's dimensions — it may overflow or leave empty space." },
  { deck: "html-css", q: "What does the <mark> tag semantically represent?", a: "Text highlighted/marked as relevant in the current context, rendered with a highlight background by default." },
  { deck: "html-css", q: "What's the purpose of the <wbr> tag?", a: "Suggests an optional line-break opportunity inside a long word, without inserting a visible hyphen or space." },
  { deck: "html-css", q: "What does direction: rtl do?", a: "Flips the text flow and default layout direction to right-to-left, for languages like Arabic or Hebrew." },
  { deck: "html-css", q: "What does the <base href=\"...\"> tag do?", a: "Sets the base URL that all relative URLs on the page (links, images, etc.) resolve against." },
  { deck: "html-css", q: "What does scroll-snap-type: x mandatory do on a scroll container?", a: "Forces horizontal scrolling to snap to defined stop points (via scroll-snap-align on children) instead of settling anywhere." },
  { deck: "html-css", q: "What's the advantage of the native <progress> element over a CSS-only progress bar?", a: "Built-in accessibility semantics and keyboard/assistive-tech support for free, without needing ARIA roles manually added." },
  { deck: "html-css", q: "What does appearance: none do to a form control like a <select>?", a: "Strips the browser's default native styling, letting you fully customize its appearance with CSS (at the cost of rebuilding some native behavior)." },

  { deck: "qt", q: "What is a signal/slot connection for in Qt?", a: "It lets one widget's event (a signal, like a button's clicked) trigger a function (a slot) elsewhere, without the two objects needing to know much about each other." },
  { deck: "qt", q: "What does QApplication represent?", a: "The one required application object that owns the event loop and app-wide settings — every Qt Widgets app creates exactly one." },
  { deck: "qt", q: "Which layout stacks widgets vertically vs horizontally?", a: "<code>QVBoxLayout</code> stacks vertically (top to bottom); <code>QHBoxLayout</code> stacks horizontally (left to right)." },
  { deck: "qt", q: "What does app.exec() do?", a: "Starts the Qt event loop and blocks there, processing events (clicks, timers, paints) until the app quits." },
  { deck: "qt", q: "What is QWidget the base class of?", a: "Nearly every visible Qt UI element — buttons, labels, windows, and custom widgets all inherit from QWidget." },
  { deck: "qt", q: "How do you respond to a button click in Qt?", a: "Connect its <code>clicked</code> signal to a slot: <code>button.clicked.connect(my_function)</code>." },
  { deck: "qt", q: "What is QSS?", a: "Qt Style Sheets — a CSS-like syntax for styling Qt widgets (colors, borders, fonts) instead of doing it all in code." },
  { deck: "qt", q: "What's a QThread used for?", a: "Running long/blocking work off the main (GUI) thread so the UI doesn't freeze while it runs." },
  { deck: "qt", q: "What two calls actually get a window on screen and running?", a: "<code>window.show()</code> to make it visible, then <code>app.exec()</code> to start the event loop that keeps it responsive." },
  { deck: "qt", q: "What's the difference between QDialog and QMainWindow?", a: "QDialog is for modal/secondary popup windows (forms, confirmations); QMainWindow provides a full app shell with menu bar, toolbars, status bar, and a central widget." },
  { deck: "qt", q: "What does setWindowTitle do?", a: "Sets the text shown in the window's title bar / taskbar entry." },
  { deck: "qt", q: "What's a QTimer used for?", a: "Running code repeatedly (or once, after a delay) without blocking the event loop — e.g. polling or animations." },
  { deck: "qt", q: "What's the point of Qt's model/view pattern?", a: "It separates your data (a model, e.g. QAbstractListModel) from how it's displayed (a view, e.g. QListView), so the same data can back multiple views." },
  { deck: "qt", q: "What does layout.addWidget(w) do?", a: "Adds widget w into that layout, so the layout manages its position and size relative to its siblings." },
  { deck: "qt", q: "How do you declare a custom signal on your own QObject subclass?", a: "As a class attribute: <code>my_signal = Signal(int)</code> (or the argument types your signal will emit)." },
  { deck: "qt", q: "What's QSettings used for?", a: "Persisting small app settings (window size, preferences) across runs, backed by the OS's native settings storage." },
  { deck: "qt", q: "What do a widget's custom paintEvent drawing calls require?", a: "A QPainter instance, typically created at the top of paintEvent(self, event) and used for the drawX() calls." },
  { deck: "qt", q: "What's a QAction used for?", a: "Representing a single user action (like \"Save\") that can be shared across a menu item, toolbar button, and keyboard shortcut at once." },
  { deck: "qt", q: "Why must GUI updates happen on the main thread?", a: "Qt's widget/rendering code isn't thread-safe — updating widgets from a worker thread can crash or corrupt the UI, so workers should signal the main thread instead." },
  { deck: "qt", q: "What Python distribution of Qt does this track use?", a: "PySide6 — the official Qt-for-Python bindings maintained by the Qt Company." },
  { deck: "qt", q: "What's the difference between a widget's sizeHint() and its actual size?", a: "sizeHint() is the widget's PREFERRED size; layouts use it as a suggestion but the actual size can differ based on available space and stretch factors." },
  { deck: "qt", q: "What does QApplication.instance() return?", a: "The single running QApplication instance, useful for accessing it from code that doesn't have a direct reference." },
  { deck: "qt", q: "What's a QGroupBox used for?", a: "Visually grouping related widgets together under a titled frame/border." },
  { deck: "qt", q: "What does self.statusBar().showMessage(text) do on a QMainWindow?", a: "Shows a temporary message in the window's status bar." },
  { deck: "qt", q: "What's the purpose of QButtonGroup?", a: "Grouping radio buttons (or checkboxes) so only one in the group can be checked at a time, and tracking which one." },
  { deck: "qt", q: "What does layout.setContentsMargins(0,0,0,0) do?", a: "Removes the padding/margin space around the layout's edges, useful for flush/edge-to-edge UIs." },
  { deck: "qt", q: "What's QPixmap used for?", a: "Representing an image optimized for on-screen display (as opposed to QImage, which is optimized for pixel manipulation)." },
  { deck: "qt", q: "What does a slot function's signature need to match?", a: "Its parameters must be compatible with (a subset of) the signal's emitted arguments." },
  { deck: "qt", q: "What's the purpose of Qt.AlignCenter when adding a widget to a layout?", a: "Aligns that widget to the center of its allotted cell/space instead of stretching to fill it." },
  { deck: "qt", q: "What does QApplication.processEvents() do?", a: "Manually forces pending events to be processed immediately — sometimes used to keep a UI responsive during a long synchronous operation (though a QThread is usually the better fix)." },
  { deck: "qt", q: "What's the difference between a modal and modeless dialog?", a: "A modal dialog blocks interaction with the rest of the app until closed; a modeless dialog lets you interact with other windows while it's open." },
  { deck: "qt", q: "What does self.resize(800, 600) do?", a: "Sets the widget/window's size to 800x600 pixels." },
  { deck: "qt", q: "What's QFileDialog used for?", a: "Showing the OS's native file/folder picker dialog for opening or saving files." },
  { deck: "qt", q: "What does a signal with no listeners connected do when emitted?", a: "Nothing observable — emitting a signal with zero connections is a harmless no-op." },
  { deck: "qt", q: "What's the purpose of QMessageBox?", a: "Showing simple standard dialogs — info, warning, error, or yes/no confirmation prompts." },
  { deck: "qt", q: "What does widget.setFixedSize(w, h) do?", a: "Locks the widget to exactly that size, preventing the user or layout from resizing it." },
  { deck: "qt", q: "What's the difference between QListWidget and QListView?", a: "QListWidget is a simpler, item-based convenience class; QListView is the model/view version that displays data from a separate model object." },
  { deck: "qt", q: "What does Signal(str, int) declare?", a: "A custom signal that, when emitted, must carry a string argument followed by an integer argument." },
  { deck: "qt", q: "What's the purpose of deleteLater() on a QObject?", a: "Safely schedules an object for deletion once control returns to the event loop, avoiding crashes from deleting it while it's still in use." },
  { deck: "qt", q: "What does self.setWindowIcon(QIcon('path.png')) do?", a: "Sets the icon shown in the window's title bar and taskbar entry." },
  { deck: "qt", q: "What's the purpose of QSpacerItem inside a manual layout?", a: "Adds invisible, adjustable empty space that expands to push/separate widgets, similar to what addStretch() adds conveniently on box layouts." },
  { deck: "qt", q: "What does QCheckBox.stateChanged emit?", a: "A signal carrying the new check state whenever the checkbox is toggled, so you can react to it via a connected slot." },
  { deck: "qt", q: "What's the difference between QWidget.show() and QWidget.setVisible(True)?", a: "They're functionally equivalent for showing a widget — show() is just a convenience wrapper around setVisible(True)." },
  { deck: "qt", q: "What does layout.removeWidget(w) do by itself?", a: "Removes the widget from the layout's management, but does NOT delete or hide it — you typically also call w.setParent(None) or w.deleteLater()." },
  { deck: "qt", q: "What's QToolBar used for?", a: "A dockable bar of quick-access actions/buttons, typically added to a QMainWindow via addToolBar()." },
  { deck: "qt", q: "What does self.centralWidget() return on a QMainWindow?", a: "The single widget currently set as the main content area via setCentralWidget()." },
  { deck: "qt", q: "What's the purpose of Qt's parent-child ownership model for widgets?", a: "When a parent widget/object is deleted, Qt automatically deletes its children too, preventing manual cleanup and memory leaks." },
  { deck: "qt", q: "What does QPushButton.setDefault(True) do inside a dialog?", a: "Makes that button the one triggered when the user presses Enter, and usually highlights it visually." },
  { deck: "qt", q: "What's the difference between exec() and open() on a QDialog?", a: "exec() shows it modally and blocks until closed, returning a result code; open() shows it modally but doesn't block — it returns immediately and uses a signal (finished) for the result." },
  { deck: "qt", q: "What does QObject.blockSignals(True) do?", a: "Temporarily prevents that object from emitting any signals, useful when updating a widget programmatically without triggering its own change handlers." },
  { deck: "qt", q: "What's the purpose of a QSplitter?", a: "Lets the user drag a divider to resize two or more widgets placed side-by-side (or stacked) relative to each other." },
  { deck: "qt", q: "What does self.raise_() do on a widget?", a: "Raises it to the top of the stacking order among sibling widgets, so it's drawn above overlapping ones." },
  { deck: "qt", q: "What's the difference between QAbstractListModel and QStandardItemModel?", a: "QAbstractListModel is a base class you subclass to expose your OWN data source; QStandardItemModel is a ready-made, generic model you populate directly with items." },
  { deck: "qt", q: "What does connect(signal, slot, Qt.QueuedConnection) change vs the default?", a: "Forces the slot to run asynchronously via the event loop (useful across threads) instead of being called immediately/synchronously in the emitting thread." },
  { deck: "qt", q: "What's the purpose of QSizePolicy on a widget?", a: "Describes how a widget should grow or shrink relative to its siblings when there's extra or insufficient space in a layout." },
  { deck: "qt", q: "What does self.close() return, and what can prevent it?", a: "Returns whether the widget was successfully closed; overriding closeEvent() and calling event.ignore() can cancel the close." },
  { deck: "qt", q: "What's a QVariant conceptually used for in Qt (esp. in models)?", a: "A generic container that can hold a value of (almost) any type, used where Qt APIs need to be type-agnostic, like model data roles." },
  { deck: "qt", q: "What does Qt.UserRole let you do in a custom model's data()?", a: "Store and retrieve arbitrary custom data on an item, beyond the standard display/decoration/tooltip roles." },
  { deck: "qt", q: "What's the difference between a widget's minimumSize and sizeHint?", a: "minimumSize is a hard floor the widget will never shrink below; sizeHint is just a preferred size layouts may or may not honor exactly." },
  { deck: "qt", q: "What does QApplication.setStyle('Fusion') do?", a: "Switches the widget rendering style to a specific cross-platform look, overriding the OS's native default style." },
  { deck: "qt", q: "What's the purpose of a worker-object-plus-moveToThread pattern instead of subclassing QThread?", a: "It's the recommended pattern: create a plain QObject worker, move IT to a QThread, and communicate via signals/slots — keeping thread and work logic cleanly separated." },
  { deck: "qt", q: "What does self.adjustSize() do?", a: "Resizes the widget to fit its current contents/sizeHint, rather than leaving it at a previously set size." },
  { deck: "qt", q: "What's the purpose of QShortcut?", a: "Binds a keyboard shortcut (e.g. Ctrl+S) to trigger a slot, independent of any specific menu/toolbar action." },
  { deck: "qt", q: "What does widget.setToolTip('text') do?", a: "Shows a small popup with that text when the mouse hovers over the widget for a moment." },
  { deck: "qt", q: "What's the effect of setting a layout's setAlignment on the whole layout vs a single widget?", a: "It controls how the ENTIRE layout's content is positioned within extra space, separate from per-widget alignment flags passed to addWidget." },
  { deck: "qt", q: "What does QApplication.aboutToQuit signal fire for?", a: "Right before the application actually exits — a good place to run cleanup/save-state logic." },
  { deck: "qt", q: "What's the purpose of Qt Designer / .ui files?", a: "Lets you visually build layouts and widget hierarchies, saved as XML, which can be loaded at runtime or compiled into Python code." },
  { deck: "qt", q: "What does self.setFocus() do?", a: "Gives that widget keyboard input focus, so key presses go to it." },
  { deck: "qt", q: "What's the difference between a QWidget-based app and a QML/Qt Quick app?", a: "QWidget apps are built imperatively in Python/C++ with widget objects; QML apps are declared in a JS-like markup language, often better suited to fluid, animated, mobile-style UIs." },
  { deck: "qt", q: "What does self.setMinimumSize(w, h) do compared to setFixedSize?", a: "Sets a floor the widget won't shrink below while still allowing it to grow; setFixedSize locks it to an exact size in both directions." },
  { deck: "qt", q: "What's QComboBox used for?", a: "A dropdown widget letting the user pick one option from a list, optionally editable." },
  { deck: "qt", q: "What's the purpose of QStackedWidget?", a: "Showing one widget/'page' from a stack at a time and switching between them, e.g. for wizard-style or tabbed-without-tabs UIs." },
  { deck: "qt", q: "What's QScrollArea for?", a: "Making any widget scrollable when its content is larger than the visible area, adding scrollbars automatically as needed." },
  { deck: "qt", q: "What does QGridLayout arrange widgets into?", a: "A table-like grid of rows and columns, with widgets placed at specific (row, column) coordinates." },
  { deck: "qt", q: "Why connect a signal with a lambda instead of the slot function directly?", a: "To pass extra fixed arguments or adapt the signal's emitted arguments to what the target function actually needs." },
  { deck: "qt", q: "What does widget.setEnabled(False) do?", a: "Greys the widget out and disables user interaction with it, without hiding it." },
  { deck: "qt", q: "What's a validator class like QIntValidator used for?", a: "Restricting what a user is allowed to type into an input field, e.g. only valid integers within a range." },
  { deck: "qt", q: "What does app.quit() do?", a: "Cleanly ends the Qt event loop, causing app.exec() to return and the application to exit." },
  { deck: "qt", q: "What does calling event.accept() in an event handler typically signal?", a: "That the event was handled here and shouldn't propagate further/be treated as unhandled." },
  { deck: "qt", q: "What's the difference between QWidget.show() and QDialog.exec()?", a: "show() displays a widget without blocking, letting code continue immediately; exec() displays a dialog modally and blocks until it's closed." },
  { deck: "qt", q: "What does passing parent=self establish for a child widget?", a: "Ownership — Qt automatically deletes the child when the parent is deleted, and the parent influences the child's window grouping." },
  { deck: "qt", q: "What's the difference between QRadioButton and QCheckBox behavior in a group?", a: "Radio buttons in the same parent/group are mutually exclusive (only one checked); checkboxes are independent — any number can be checked at once." },
  { deck: "qt", q: "What's QProgressBar used for?", a: "Visually showing the completion percentage of a long-running task." },
  { deck: "qt", q: "What's QSlider used for?", a: "Letting the user pick a numeric value by dragging a handle along a track, within a set min/max range." },
  { deck: "qt", q: "Can multiple slots be connected to the same signal?", a: "Yes — every connected slot runs (in connection order) each time the signal is emitted." },
  { deck: "qt", q: "How do you disconnect a previously connected signal/slot?", a: "Call .disconnect() on the signal, optionally passing the specific slot to remove just that one connection." },
  { deck: "qt", q: "What does self.menuBar() give access to on a QMainWindow?", a: "The window's menu bar, where you add top-level menus (File, Edit, etc.) populated with QActions." },
  { deck: "qt", q: "What does setWindowModality control on a window?", a: "Whether and how it blocks interaction with other windows — e.g. application-modal blocks the whole app, window-modal blocks only its parent." },
  { deck: "qt", q: "What does self.hide() do differently from self.close()?", a: "hide() just makes the widget invisible without destroying anything; close() may also trigger closeEvent and, for top-level windows, can end the app if it's the last one open." },
  { deck: "qt", q: "What does app.exec()'s return value typically represent?", a: "The application's exit code, conventionally passed to sys.exit() so the OS/shell sees the correct status." },
  { deck: "qt", q: "What does widget.parent() return?", a: "The widget's current parent object (or None if it has no parent), as set via the constructor or setParent()." },
  { deck: "qt", q: "What does self.isVisible() tell you?", a: "Whether the widget is currently shown on screen (not hidden and not merely constructed but never shown)." },
  { deck: "qt", q: "What's QTabWidget used for?", a: "Organizing several widgets/pages behind a row of clickable tabs, showing one page at a time." },
  { deck: "qt", q: "What's a QDockWidget for?", a: "A panel that can be docked to a QMainWindow's edges, floated as its own window, or closed by the user — common for tool palettes." },
  { deck: "qt", q: "How do QSS selectors target a specific widget instance, e.g. QPushButton#saveBtn?", a: "By matching that widget's objectName (set via setObjectName), similar to an ID selector in CSS." },
  { deck: "qt", q: "What's the difference between QLabel and QLineEdit?", a: "QLabel displays static, non-editable text/images; QLineEdit is an editable single-line text input." },
  { deck: "qt", q: "What does the finished signal on a QDialog carry?", a: "The dialog's result code, letting code connected via open() react once the (non-blocking) dialog is eventually closed." },
  { deck: "qt", q: "What's the effect of nesting layouts, e.g. adding a QHBoxLayout inside a QVBoxLayout?", a: "Lets you build complex 2D arrangements by combining simple 1D layouts, since each layout only manages one row or column axis." },
  { deck: "qt", q: "What does self.setStyleSheet('...') on a single widget vs QApplication.setStyleSheet do?", a: "Setting it on a widget styles just that widget (and its children); setting it on the QApplication applies those rules app-wide." },
  { deck: "qt", q: "What's the purpose of QAbstractItemModel's rowCount()/columnCount() methods when subclassing?", a: "They tell views how many rows/columns of data exist, so the view knows how much content it needs to render/scroll through." },
  { deck: "qt", q: "What's the difference between a QMenuBar and a QMenu?", a: "QMenuBar is the horizontal bar at the top of a window holding top-level menu titles; each QMenu is the dropdown list of actions shown under one of those titles." },
  { deck: "qt", q: "What does connecting to a widget's customContextMenuRequested signal let you do?", a: "Show a custom right-click context menu at the clicked position, after first enabling it via setContextMenuPolicy." },
  { deck: "qt", q: "What's a QKeySequence used for?", a: "Representing a keyboard shortcut (like Ctrl+S) in a platform-appropriate way, typically assigned to a QAction or QShortcut." },
  { deck: "qt", q: "What does QApplication.clipboard() give you access to?", a: "The system clipboard, letting you read or set copied text/data programmatically." },
  { deck: "qt", q: "What starts a drag-and-drop operation in Qt?", a: "Creating a QDrag object (usually in mousePressEvent/mouseMoveEvent), giving it QMimeData, and calling .exec() on it." },
  { deck: "qt", q: "What's QMimeData used for?", a: "Packaging the actual data (text, URLs, custom formats) being transferred during a drag-and-drop or clipboard operation." },
  { deck: "qt", q: "What's a QSystemTrayIcon for?", a: "Showing an icon in the OS system tray/notification area, often with its own context menu, for background-running apps." },
  { deck: "qt", q: "What does a QFont object represent?", a: "A font family, size, weight, and style to apply to text in widgets, via widget.setFont(font)." },
  { deck: "qt", q: "What's QFontMetrics used for?", a: "Measuring text dimensions (pixel width/height) for a given font, useful for laying out custom-drawn text precisely." },
  { deck: "qt", q: "What does a QColor object represent?", a: "A color value (RGB/RGBA/HSV etc.), used for setting fills, text color, and other color properties, often via a QPalette or QSS." },
  { deck: "qt", q: "What's the difference between QPen and QBrush in custom painting?", a: "QPen controls how OUTLINES/strokes are drawn (color, width, style); QBrush controls how shapes are FILLED (color, pattern, gradient)." },
  { deck: "qt", q: "What does a QRect represent?", a: "A rectangle defined by position and size, used constantly for widget geometry, painting regions, and hit-testing." },
  { deck: "qt", q: "What's the purpose of overriding eventFilter on an object?", a: "Intercepting and optionally consuming events meant for ANOTHER object, after installing yourself as its event filter via installEventFilter." },
  { deck: "qt", q: "What's QSpinBox used for?", a: "Letting the user pick an integer value by typing it or clicking up/down arrow buttons, within a defined range." },
  { deck: "qt", q: "What's QDateEdit used for?", a: "A widget for entering/editing a date, typically with a dropdown calendar popup for picking it visually." },
  { deck: "qt", q: "What's QCalendarWidget used for?", a: "Displaying a full interactive calendar grid for date selection." },
  { deck: "qt", q: "How does a QToolButton typically differ from a QPushButton?", a: "QToolButton is designed for compact toolbar use (often icon-only, associated with a QAction), while QPushButton is the general-purpose labeled button." },
  { deck: "qt", q: "What's QWizard used for?", a: "Building a multi-step, page-by-page guided dialog flow (like an installation wizard) with Back/Next/Finish navigation built in." },
  { deck: "qt", q: "What do QUndoStack and QUndoCommand provide together?", a: "A ready-made undo/redo system — each QUndoCommand knows how to apply and reverse one action, and the stack tracks history." },
  { deck: "qt", q: "What's QNetworkAccessManager used for?", a: "Making HTTP requests (GET/POST/etc.) from a Qt application and handling their asynchronous responses via signals." },
  { deck: "qt", q: "What's QSqlDatabase part of, and what's it for?", a: "Qt's SQL module — it manages a connection to a relational database, used alongside QSqlQuery to run SQL statements." },
  { deck: "qt", q: "What's the QTest module used for?", a: "Writing automated unit tests for Qt applications, including simulating widget interactions like clicks and key presses." },
  { deck: "qt", q: "What's PyInstaller used for with a PySide6 app?", a: "Packaging the Python app and its dependencies (including Qt libraries) into a standalone executable that doesn't require a separate Python install to run." },
  { deck: "qt", q: "What do QThreadPool and QRunnable provide together?", a: "A way to run many short background tasks (QRunnables) across a managed pool of reusable threads, instead of manually creating a QThread per task." },
  { deck: "qt", q: "What's the difference between QAbstractTableModel and QAbstractListModel?", a: "QAbstractTableModel exposes a full 2D grid of rows AND columns; QAbstractListModel exposes a single 1D list of items." },

  { deck: "career", q: "What does the STAR method structure in an interview answer?", a: "Situation, Task, Action, Result — a structure for telling a concrete story instead of a vague generality." },
  { deck: "career", q: "What's the core difference between git rebase and git merge?", a: "Merge preserves both histories and adds a merge commit; rebase replays your commits on top of the other branch, producing a linear history (but rewrites commit hashes)." },
  { deck: "career", q: "What's the average lookup time complexity of a hash map?", a: "O(1) — constant time, on average." },
  { deck: "career", q: "What's the time complexity of binary search on a sorted array?", a: "O(log n) — it halves the search space each step." },
  { deck: "career", q: "Why does a portfolio project need a good README?", a: "It's often the first (and sometimes only) thing a reviewer reads — it should explain what it does, how to run it, and why you built it, fast." },
  { deck: "career", q: "What's the one-line difference between REST and GraphQL?", a: "REST exposes fixed endpoints/resources; GraphQL exposes one endpoint where the client specifies exactly which fields it wants." },
  { deck: "career", q: "What does an ATS (applicant tracking system) do with a resume?", a: "Parses/scans it for keywords matching the job description before a human ever sees it — plain formatting and matching terminology helps it parse cleanly." },
  { deck: "career", q: "What's the point of a code review before merging?", a: "A second set of eyes catches bugs, design issues, and knowledge silos before they reach main — and spreads context across the team." },
  { deck: "career", q: "What's the difference between authentication and authorization?", a: "Authentication confirms WHO you are (login); authorization determines WHAT you're allowed to do once logged in (permissions)." },
  { deck: "career", q: "What's a common first project to demonstrate full-stack skill?", a: "A small CRUD app with real authentication and a database — it touches frontend, backend, auth, and data modeling at once." },
  { deck: "career", q: "What does CI/CD stand for and do?", a: "Continuous Integration / Continuous Deployment — automatically testing (and often deploying) code on every push, catching problems early." },
  { deck: "career", q: "What's the core difference between SQL and NoSQL databases?", a: "SQL databases use fixed tables/schemas and relationships (joins); NoSQL databases (document/key-value/etc.) use flexible, often schema-less structures." },
  { deck: "career", q: "What's a .env file used for?", a: "Storing environment-specific secrets/config (API keys, DB URLs) outside of source code, so they aren't committed to git." },
  { deck: "career", q: "What does 'idempotent' mean for an API endpoint?", a: "Calling it multiple times with the same input has the same effect as calling it once — e.g. a DELETE or a PUT, unlike most POSTs." },
  { deck: "career", q: "What's a strong way to answer 'what's your biggest weakness'?", a: "Name something real, show what you're actively doing about it, and give a concrete example of improvement — not a fake humble-brag." },
  { deck: "career", q: "What's the difference between a bug and a regression?", a: "A bug is any incorrect behavior; a regression is specifically something that USED to work correctly and broke after a later change." },
  { deck: "career", q: "Why write tests before/alongside shipping a feature, not just after?", a: "They catch breakage immediately as you build, document expected behavior, and make future refactors far safer." },
  { deck: "career", q: "What's a monorepo?", a: "A single repository containing multiple projects/packages (e.g. frontend + backend + shared libs), managed and versioned together." },
  { deck: "career", q: "What's a common, avoidable reason take-home projects get rejected?", a: "It simply doesn't run for the reviewer (missing setup steps, unclear README) — technical quality never even gets evaluated." },
  { deck: "career", q: "What's the point of pinning exact dependency versions in a project?", a: "Reproducible builds — everyone (and CI, and production) installs the exact same versions instead of whatever happens to be newest that day." },
  { deck: "career", q: "What's the point of a personal project vs a tutorial-following project on a resume?", a: "It shows independent decision-making and problem-solving, not just the ability to follow instructions." },
  { deck: "career", q: "What does 'greenfield' vs 'brownfield' project mean?", a: "Greenfield is building something new from scratch; brownfield means working within/extending an existing codebase with its constraints and history." },
  { deck: "career", q: "What's the purpose of an issue tracker (e.g. Jira, GitHub Issues)?", a: "Recording, prioritizing, and tracking the status of bugs and feature work so nothing gets lost or forgotten." },
  { deck: "career", q: "What does 'load balancing' mean at a high level?", a: "Distributing incoming requests across multiple servers so no single one gets overwhelmed." },
  { deck: "career", q: "What's the difference between vertical and horizontal scaling?", a: "Vertical scaling means making one server bigger/more powerful; horizontal scaling means adding more servers to share the load." },
  { deck: "career", q: "What's a 'race condition'?", a: "A bug where the outcome depends on the unpredictable timing/order of concurrent operations, producing inconsistent results." },
  { deck: "career", q: "What does 'caching' generally trade off?", a: "Speed for potential staleness — serving a stored result faster, at the risk it doesn't reflect the very latest data." },
  { deck: "career", q: "What's the purpose of a load/stress test?", a: "Verifying how a system behaves under heavy traffic or extreme conditions, before it happens for real." },
  { deck: "career", q: "What does 'backwards compatible' mean for an API change?", a: "Existing clients/callers keep working without modification after the change ships." },
  { deck: "career", q: "What's a common trait employers look for in a take-home project beyond correctness?", a: "Clean, readable code and clear reasoning/tradeoffs — not just a working answer, but why you built it that way." },
  { deck: "career", q: "What's the purpose of a design doc / RFC before building a large feature?", a: "Getting alignment and catching issues on the approach BEFORE investing time writing the code." },
  { deck: "career", q: "What does 'single source of truth' mean for data?", a: "One authoritative place data lives and is updated, so different parts of a system don't disagree about its current value." },
  { deck: "career", q: "What's a common early red flag for a job posting/company in an interview?", a: "Vague or evasive answers about the actual day-to-day work, team structure, or why the role is open." },
  { deck: "career", q: "What does 'context switching' cost a developer?", a: "Time and mental effort lost re-establishing focus after being interrupted or jumping between unrelated tasks." },
  { deck: "career", q: "What's the point of writing acceptance criteria on a ticket?", a: "Defining concretely what 'done' means before work starts, so there's no ambiguity when reviewing the result." },
  { deck: "career", q: "What does 'graceful degradation' mean for a feature?", a: "The system keeps working in a reduced but still-usable way when something (a dependency, a network call) fails, instead of crashing entirely." },
  { deck: "career", q: "What's a common reason to timebox a task or spike?", a: "Preventing open-ended exploration from consuming unlimited time — forcing a decision or checkpoint after a fixed period." },
  { deck: "career", q: "What does 'single responsibility' mean for a function or module?", a: "It should do one well-defined thing, making it easier to test, reuse, and reason about." },
  { deck: "career", q: "What's the value of writing down 'why' a decision was made, not just 'what'?", a: "Future readers (including you) can judge whether the reasoning still holds before changing or reverting the decision." },
  { deck: "career", q: "What's a good habit before asking for help when stuck?", a: "Write down exactly what you tried and what happened — it often surfaces the answer yourself, and makes the ask much easier to help with." },
  { deck: "career", q: "What's the point of a whiteboard/live coding interview beyond getting the right answer?", a: "Showing HOW you think — clarifying requirements, talking through tradeoffs, and handling being stuck — matters as much as the final code." },
  { deck: "career", q: "What's the time complexity of sorting a list with a typical comparison sort (e.g. merge sort)?", a: "O(n log n)." },
  { deck: "career", q: "What's the difference between an array/list and a linked list for random access?", a: "Arrays give O(1) index access; linked lists require O(n) traversal from the head to reach an arbitrary element." },
  { deck: "career", q: "What does 'DRY' stand for and mean?", a: "Don't Repeat Yourself — avoid duplicating logic/knowledge so a change only needs to happen in one place." },
  { deck: "career", q: "What's the difference between a unit test and an integration test?", a: "A unit test checks one small piece in isolation (often with mocks); an integration test checks multiple real pieces working together." },
  { deck: "career", q: "What's a 'sprint' in agile/scrum terminology?", a: "A fixed, short time period (often 1-2 weeks) in which a team commits to completing a set amount of planned work." },
  { deck: "career", q: "What does 'backlog' refer to in project management?", a: "The full list of prioritized but not-yet-started work — features, bugs, and tasks waiting to be scheduled." },
  { deck: "career", q: "What's the purpose of a .gitignore file?", a: "Tells git which files/folders to never track (build artifacts, secrets, dependencies), keeping the repo clean." },
  { deck: "career", q: "What does 'single point of failure' mean for a system's design?", a: "One component whose failure would bring down the whole system, since nothing else can take over for it." },
  { deck: "career", q: "What's the main benefit of containerization (e.g. Docker) for deployment?", a: "Packaging an app with its exact dependencies/environment so it runs identically across dev, staging, and production." },
  { deck: "career", q: "What does 'latency' measure, vs 'throughput'?", a: "Latency is how long a single request/operation takes; throughput is how many requests/operations complete per unit of time." },
  { deck: "career", q: "What's a 'feature flag' used for?", a: "Turning a feature on/off (often per user or gradually) without deploying new code, enabling safer rollouts and quick rollback." },
  { deck: "career", q: "What does 'N+1 query problem' refer to?", a: "Running one query to fetch a list, then a separate query per item to fetch related data — N+1 total queries instead of a single efficient join/batch." },
  { deck: "career", q: "What's the purpose of an API rate limit?", a: "Capping how many requests a client can make in a time window, protecting the service from abuse or accidental overload." },
  { deck: "career", q: "What does 'eventual consistency' mean in a distributed system?", a: "After an update, different nodes may briefly disagree, but they're guaranteed to converge to the same state given enough time." },
  { deck: "career", q: "What's the point of writing a postmortem after an incident?", a: "Documenting what happened, why, and what will change to prevent recurrence — focused on the system, not blaming individuals." },
  { deck: "career", q: "What does 'YAGNI' stand for and mean?", a: "You Aren't Gonna Need It — avoid building speculative functionality for requirements that don't exist yet." },
  { deck: "career", q: "What's a good reason to ask questions during a take-home or interview task?", a: "Clarifying ambiguous requirements shows good judgment — guessing silently and building the wrong thing looks worse than asking." },
  { deck: "career", q: "What does 'observability' mean for a production system?", a: "Being able to understand a system's internal state from its external outputs — logs, metrics, and traces — especially when debugging issues you didn't anticipate." },
  { deck: "career", q: "What's the difference between a hotfix and a regular release?", a: "A hotfix is an urgent, narrowly-scoped fix pushed outside the normal release cycle, usually for a critical production bug." },
  { deck: "career", q: "What does 'rollback' mean after a bad deploy?", a: "Reverting to the previous known-good version of the code/deployment to stop an ongoing issue quickly." },
  { deck: "career", q: "What's the benefit of small, frequent pull requests over large, infrequent ones?", a: "Easier and faster to review thoroughly, less likely to conflict with others' work, and easier to bisect if something breaks." },
  { deck: "career", q: "What does 'stakeholder' mean in a project context?", a: "Anyone with an interest in or influence over the project's outcome — not just engineers, but product, design, support, leadership, etc." },
  { deck: "career", q: "What's a reasonable way to estimate how long a task will take?", a: "Break it into smaller known pieces, account for unknowns/testing/review time, and compare to similar past work rather than guessing a single number." },
  { deck: "career", q: "What does 'bikeshedding' mean in a team discussion?", a: "Spending disproportionate time debating a trivial, easy-to-have-an-opinion-on detail while ignoring more important, harder decisions." },
  { deck: "career", q: "What's the value of writing your own resume bullet points around impact/results, not just duties?", a: "It answers 'so what?' — showing the outcome of your work (faster, fewer bugs, more users) is far more convincing than a list of tasks performed." },
  { deck: "career", q: "What does 'p99 latency' mean in a metrics dashboard?", a: "The response time that 99% of requests are faster than — used to catch slow outliers that an average would hide." },
  { deck: "career", q: "What's the purpose of a runbook?", a: "Step-by-step documented instructions for handling a specific known operational task or incident, so anyone on-call can follow it under pressure." },
  { deck: "career", q: "What does 'don't repeat the interview question back verbatim, restate it in your own words' accomplish?", a: "Confirms you actually understood what's being asked before you start solving it, catching misunderstandings early." },
  { deck: "career", q: "What's the difference between a hash map's key collisions being handled well or poorly?", a: "Well-handled collisions (chaining/open addressing) keep average lookup near O(1); poor handling degrades toward O(n) as more keys hash to the same bucket." },
  { deck: "career", q: "What's a 'smoke test'?", a: "A quick check that the basic, critical functionality works at all — run before investing time in a fuller test pass." },
  { deck: "career", q: "What's 'technical debt'?", a: "Shortcuts or quick fixes taken now that make future changes harder or riskier — sometimes a reasonable tradeoff, but it accrues 'interest' if ignored." },
  { deck: "career", q: "What's the main point of pair programming?", a: "Two people working on the same code together in real time, for shared understanding, fewer mistakes, and faster onboarding/knowledge transfer." },
  { deck: "career", q: "What does semantic versioning (e.g. 2.4.1) communicate?", a: "The type of change via major.minor.patch — major breaks compatibility, minor adds features safely, patch fixes bugs — so consumers know what to expect from an upgrade." },
  { deck: "career", q: "What's a 'blocker' in ticket/project terminology?", a: "Something that prevents further progress on a task until it's resolved, often flagged for priority attention." },
  { deck: "career", q: "What's the purpose of a staging environment?", a: "A production-like environment for testing changes with realistic conditions before they go live to real users." },
  { deck: "career", q: "What does 'refactoring' mean?", a: "Restructuring existing code's internal structure to improve it (readability, design) WITHOUT changing its external behavior." },
  { deck: "career", q: "Why squash commits before merging a feature branch?", a: "Presents a clean, single logical change in the main history instead of noisy work-in-progress commits." },
  { deck: "career", q: "What does 'MVP' mean in a product context?", a: "Minimum Viable Product — the smallest version of something that still delivers real value, used to test an idea before over-investing." },
  { deck: "career", q: "What's a 'flaky test'?", a: "A test that passes or fails inconsistently without any code changes, which erodes trust in the whole test suite/CI signal." },
  { deck: "career", q: "What's a reasonable approach to salary negotiation?", a: "Research market rates first, let the employer name a number if possible, and justify your ask with concrete data/evidence." },
  { deck: "career", q: "What's the purpose of a regular 1:1 meeting with a manager?", a: "Dedicated time for individual feedback, surfacing blockers, and career growth discussion — distinct from team status updates." },
  { deck: "career", q: "What does 'dogfooding' mean?", a: "Using your own product internally, as a real user would, before or while shipping it to customers." },
  { deck: "career", q: "What's a good first response to critical code review feedback?", a: "Read it fully, ask clarifying questions if needed, and address the substance — rather than reacting defensively." },
  { deck: "career", q: "What's 'cognitive load' in the context of reading code?", a: "How much a reader has to hold in their head at once to understand it — simpler, well-named, well-structured code reduces it." },
  { deck: "career", q: "What's a team's 'bus factor'?", a: "The number of people who could disappear (get hit by a bus) before critical knowledge is lost — a low bus factor is a risk to fix via documentation/cross-training." },
  { deck: "career", q: "What's the core difference between waterfall and agile methodology?", a: "Waterfall plans and executes sequential phases fully upfront; agile works in short, iterative cycles with continuous feedback and re-prioritization." },
  { deck: "career", q: "What's a Kanban board used for?", a: "Visualizing work as cards moving through columns (like To Do / In Progress / Done), limiting work-in-progress to expose bottlenecks." },
  { deck: "career", q: "What's the purpose of a sprint retrospective?", a: "A regular meeting to reflect on what went well, what didn't, and what the team will change going forward." },
  { deck: "career", q: "What's a 'definition of done' for a ticket?", a: "The agreed, explicit checklist (tested, reviewed, documented, etc.) that must be true before work counts as actually complete." },
  { deck: "career", q: "What are 'story points' used for?", a: "A relative, unitless measure of effort/complexity for a task, used for planning capacity instead of guessing hours directly." },
  { deck: "career", q: "What's a 'spike' in agile terminology?", a: "A short, timeboxed research/exploration task meant to answer a question or reduce uncertainty before committing to real implementation." },
  { deck: "career", q: "What's the point of a pre-commit lint hook?", a: "Catching style issues and common mistakes automatically before code is even committed, rather than relying solely on review." },
  { deck: "career", q: "What's 'trunk-based development'?", a: "A workflow where developers integrate small changes into the main branch very frequently, avoiding long-lived feature branches and painful merges." },
  { deck: "career", q: "What's a 'canary release'?", a: "Rolling out a change to a small subset of users/servers first, watching for problems, before releasing it to everyone." },
  { deck: "career", q: "What's 'blue-green deployment'?", a: "Running two identical production environments and switching traffic from the old (blue) to the new (green) instantly, enabling a fast rollback if needed." },
  { deck: "career", q: "What's a 'circuit breaker' pattern used for?", a: "Stopping repeated calls to a failing dependency for a cooldown period, preventing cascading failures across a distributed system." },
  { deck: "career", q: "What's the value of quantifying impact in a resume bullet, e.g. 'reduced load time by 40%'?", a: "Concrete numbers are far more convincing and memorable to a reviewer than vague claims like 'improved performance'." },
  { deck: "career", q: "What's a good reason to keep a personal engineering journal/notes of decisions made?", a: "Makes writing status updates, retros, and resume bullets far easier later, and helps you learn from past tradeoffs." },
  { deck: "career", q: "What's the difference between mentoring and managing?", a: "Mentoring focuses on someone's growth/skills, often informally; managing includes formal responsibility for their performance, direction, and outcomes." },
  { deck: "career", q: "What's the 'iron triangle' of project management?", a: "Scope, time, and cost — the idea that you can't change one without affecting at least one of the others (fast + cheap + big scope rarely coexist)." },
  { deck: "career", q: "What does 'scope' mean on a project?", a: "The defined boundary of what work is (and isn't) included — the basis for judging 'scope creep' if it quietly expands." },
  { deck: "career", q: "What does it mean for one ticket to 'depend on' another?", a: "It can't be started or finished until the other ticket is completed, which affects scheduling and highlights bottlenecks." },
  { deck: "career", q: "What does 'velocity' measure in Scrum?", a: "How many story points a team typically completes per sprint, used to forecast how much future work they can commit to." },
  { deck: "career", q: "What does a burndown chart show?", a: "Remaining work over time within a sprint/project, letting a team see at a glance if they're on pace to finish." },
  { deck: "career", q: "What's the difference between an epic and a story in agile terminology?", a: "An epic is a large body of work broken down into multiple smaller, independently completable stories." },
  { deck: "career", q: "What's a PRD (Product Requirements Document)?", a: "A document describing what a feature/product should do and why, used to align engineering, design, and stakeholders before building." },
  { deck: "career", q: "What's the point of A/B testing a feature?", a: "Comparing two versions with real users to measure which one performs better on a chosen metric, instead of guessing." },
  { deck: "career", q: "What does 'churn' mean for a product?", a: "The rate at which customers/users stop using or paying for it over a given period." },
  { deck: "career", q: "What does NPS (Net Promoter Score) measure?", a: "How likely customers are to recommend a product to others, based on a simple 0-10 survey question." },
  { deck: "career", q: "What's 'onboarding' in a product context, distinct from employee onboarding?", a: "The experience that guides a new USER through learning/setting up a product for the first time." },
  { deck: "career", q: "What's an SLA (Service Level Agreement)?", a: "A formal commitment about a service's expected performance (e.g. uptime, response time), often with consequences if it's missed." },
  { deck: "career", q: "What's the difference between an SLA and an SLO?", a: "An SLO (objective) is an internal target a team aims for; an SLA is the external, often contractual, commitment made to customers — SLAs are usually looser than internal SLOs." },
  { deck: "career", q: "What's a key tradeoff of on-premises hosting vs cloud hosting?", a: "On-prem gives more control/predictable long-term cost but requires managing physical infrastructure; cloud offers elasticity and less upfront cost at the price of ongoing usage-based billing." },
  { deck: "career", q: "What's 'vendor lock-in'?", a: "Becoming so dependent on one provider's specific tools/APIs that switching away later becomes costly or difficult." },
  { deck: "career", q: "What's a 'proof of concept' (POC)?", a: "A small, quick implementation built to test whether an idea/approach is technically feasible, before committing to full development." },
  { deck: "career", q: "What's the purpose of a behavioral interview question (e.g. 'tell me about a conflict')?", a: "Assessing how a candidate has actually handled real past situations, as a predictor of future behavior — often answered using STAR." },
  { deck: "career", q: "What's the difference between 'culture fit' and 'culture add'?", a: "Culture fit asks if someone matches the existing team's style; culture add asks what new perspective/strength they'd bring that the team currently lacks." },
  { deck: "career", q: "What's a 'reference check' in the hiring process?", a: "Contacting a candidate's past colleagues/managers to verify their experience and get an outside perspective on their work." },
  { deck: "career", q: "What does 'equity' typically mean in a compensation package?", a: "Ownership stake in the company (often stock options or RSUs), whose eventual value depends on the company's future performance." },
  { deck: "career", q: "What's a 'vesting schedule' for equity?", a: "The timeline over which granted equity is actually earned/owned, e.g. 25% after one year then monthly over the following three." },
  { deck: "career", q: "What does 'at-will employment' mean?", a: "Either the employer or employee can end the employment relationship at any time, without needing a specific cause (subject to legal exceptions)." },
  { deck: "career", q: "What's a 'non-compete clause'?", a: "A contract term restricting an employee from working for a competitor (or starting a competing business) for a period after leaving." },
  { deck: "career", q: "What's the difference between 'remote-first' and 'remote-friendly'?", a: "Remote-first designs all processes/communication around remote work by default; remote-friendly permits remote work but often still centers on an office-based default." },
  { deck: "career", q: "What's an 'async communication' culture?", a: "Defaulting to written, non-real-time updates (docs, tickets, recorded messages) over live meetings, so people across time zones/schedules aren't blocked waiting on each other." },
];

function fcKey(track, i) { return `hub-fc:${track}:${i}`; }
function fcState(track, i) {
  try { return JSON.parse(localStorage.getItem(fcKey(track, i)) || '{"streak":0,"due":0}'); }
  catch { return { streak: 0, due: 0 }; }
}
let fcCurrentIdx = null;
function fcTrack() { return localStorage.getItem("hub-fc-track") || (state.courses[0] && state.courses[0].id) || "python"; }
function fcDeck() { return FLASHCARDS.filter((c) => c.deck === fcTrack()); }

function fcPool() {
  const now = Date.now();
  return fcDeck().map((c, i) => ({ c, i })).filter(({ i }) => fcState(fcTrack(), i).due <= now);
}

function fcNextCard() {
  const pool = fcPool();
  const deck = fcDeck();
  const source = pool.length ? pool : deck.map((c, i) => ({ c, i }));
  const pick = source[(Math.random() * source.length) | 0];
  fcCurrentIdx = pick.i;
  $("#fc-question").textContent = pick.c.q;
  $("#fc-answer").innerHTML = pick.c.a;
  $("#fc-answer").hidden = true;
  $("#fc-grade-btns").hidden = true;
  $("#fc-btn-flip").hidden = false;
  $("#fc-progress").textContent = `${pool.length} of ${deck.length} due now in this deck`;
}

function initFlashcards() {
  renderSideToggle($("#fc-track-list"), fcTrack(), (id) => {
    localStorage.setItem("hub-fc-track", id);
    initFlashcards();
  });
  fcNextCard();
}
$("#fc-btn-flip").onclick = () => {
  $("#fc-answer").hidden = false;
  $("#fc-grade-btns").hidden = false;
  $("#fc-btn-flip").hidden = true;
};
function fcGrade(correct) {
  const st = fcState(fcTrack(), fcCurrentIdx);
  const streak = correct ? st.streak + 1 : 0;
  const hoursAhead = correct ? [1, 4, 24, 72, 168][Math.min(streak, 4)] : 0;
  localStorage.setItem(fcKey(fcTrack(), fcCurrentIdx), JSON.stringify({ streak, due: Date.now() + hoursAhead * 3600 * 1000 }));
  if (correct) addXP(2, "flashcard nailed");
  fcNextCard();
}
$("#fc-btn-right").onclick = () => fcGrade(true);
$("#fc-btn-wrong").onclick = () => fcGrade(false);

/* ================= quizzes ================= */
const QUIZZES = {
  python: [
    { q: "What is the output of len('hello')?", options: ["4", "5", "6", "Error"], correct: 1 },
    { q: "Which keyword defines a function in Python?", options: ["func", "def", "function", "lambda"], correct: 1 },
    { q: "What does range(5) produce when iterated?", options: ["0,1,2,3,4", "1,2,3,4,5", "0,1,2,3,4,5", "just 5"], correct: 0 },
    { q: "Which of these is immutable in Python?", options: ["list", "dict", "set", "tuple"], correct: 3 },
    { q: "What does the `is` operator compare?", options: ["Value equality", "Type only", "Object identity", "String length"], correct: 2 },
    { q: "What's printed by print(type(3.0))?", options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"], correct: 1 },
    { q: "What does [x for x in range(3)] produce?", options: ["[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]", "Error"], correct: 0 },
    { q: "Which method adds a single item to the end of a list?", options: [".extend()", ".append()", ".insert(0, x)", ".add()"], correct: 1 },
    { q: "What exception is raised by dividing by zero?", options: ["ValueError", "ZeroDivisionError", "TypeError", "ArithmeticError only"], correct: 1 },
    { q: "What does *args collect in a function signature?", options: ["Keyword args into a dict", "Positional args into a tuple", "Nothing extra", "A single default value"], correct: 1 },
    { q: "Which safely opens a file and auto-closes it?", options: ["open('f.txt')", "with open('f.txt') as f:", "file.read('f.txt')", "import file"], correct: 1 },
    { q: "What does dict.get('key', 'default') do if 'key' is missing?", options: ["Raises KeyError", "Returns None always", "Returns 'default'", "Adds 'key' to the dict"], correct: 2 },
    { q: "Which construct pairs (index, value) while looping?", options: ["zip()", "enumerate()", "range()", "map()"], correct: 1 },
    { q: "What's the result of 3 // 2 in Python?", options: ["1.5", "1", "2", "1.0"], correct: 1 },
    { q: "What does @staticmethod mean for a method?", options: ["It receives self", "It receives cls", "It receives neither self nor cls", "It's abstract"], correct: 2 },
    { q: "What does class Dog(Animal): express?", options: ["Dog imports Animal", "Dog inherits from Animal", "Animal inherits from Dog", "Dog implements Animal"], correct: 1 },
    { q: "Which keyword pauses a generator function and yields a value?", options: ["return", "yield", "pause", "break"], correct: 1 },
    { q: "Which built-in converts the string '5' to an integer?", options: ["str(5)", "int('5')", "float('5')", "5.to_int()"], correct: 1 },
    { q: "What does try/except/finally's finally block do?", options: ["Runs only if no exception", "Runs only if an exception occurs", "Always runs, exception or not", "Suppresses all exceptions"], correct: 2 },
    { q: "What's the correct way to check if 'x' is a key in dict d?", options: ["x in d", "d.has('x')", "d.contains(x)", "x.key in d"], correct: 0 },
    { q: "What does sorted([3, 1, 2]) return?", options: ["[3, 1, 2]", "[1, 2, 3]", "[2, 1, 3]", "Error"], correct: 1 },
    { q: "Which of these creates an empty set (not a dict)?", options: ["{}", "set()", "[]", "()"], correct: 1 },
    { q: "What does 'abc'[::-1] produce?", options: ["'abc'", "'cba'", "'a'", "Error"], correct: 1 },
    { q: "What does None == False evaluate to?", options: ["True", "False", "Error", "None"], correct: 1 },
    { q: "Which module provides command-line argument parsing?", options: ["sys", "argparse", "os", "re"], correct: 1 },
    { q: "What's the output of bool([])?", options: ["True", "False", "Error", "None"], correct: 1 },
    { q: "What does super().__init__() typically do in a subclass?", options: ["Skips the parent constructor", "Calls the parent class's constructor", "Deletes the parent class", "Creates a new class"], correct: 1 },
    { q: "Which decorator marks a method as required for subclasses in an ABC?", options: ["@abstractmethod", "@override", "@required", "@interface"], correct: 0 },
    { q: "What does f\"{3.14159:.2f}\" evaluate to?", options: ["'3.14159'", "'3.14'", "'3.1'", "Error"], correct: 1 },
    { q: "What's the result of 'a' in 'abc'?", options: ["True", "False", "Error", "'a'"], correct: 0 },
    { q: "What does list(zip([1,2],[3,4])) produce?", options: ["[1, 2, 3, 4]", "[(1, 3), (2, 4)]", "[(1, 2), (3, 4)]", "Error"], correct: 1 },
    { q: "What's the correct way to raise a custom exception?", options: ["raise ValueError('msg')", "throw ValueError('msg')", "except ValueError('msg')", "error ValueError('msg')"], correct: 0 },
    { q: "What does import module as m do?", options: ["Copies module's code into m.py", "Imports module under a local alias m", "Deletes module", "Nothing, invalid syntax"], correct: 1 },
    { q: "What's the difference between a module and a package?", options: ["No difference", "A package is a directory of modules with an __init__.py", "A module is always larger", "Packages can't contain modules"], correct: 1 },
    { q: "In x, *rest = [1, 2, 3, 4], what is rest?", options: ["1", "[2, 3, 4]", "[1, 2, 3, 4]", "4"], correct: 1 },
    { q: "What's the purpose of __repr__?", options: ["Defines how print() shows an object informally", "Defines an unambiguous developer-facing string representation", "Deletes an object", "Compares two objects"], correct: 1 },
    { q: "What does the walrus operator := do?", options: ["Assigns and returns a value in the same expression", "Compares two values", "Creates a lambda", "Only works in loops"], correct: 0 },
    { q: "What's the time complexity of appending to the end of a Python list?", options: ["O(n)", "O(1) amortized", "O(log n)", "O(n^2)"], correct: 1 },
    { q: "What does assert x > 0, \"must be positive\" do if x is -1?", options: ["Prints a warning", "Raises an AssertionError with that message", "Silently continues", "Returns False"], correct: 1 },
    { q: "What's the output of type(True)?", options: ["<class 'bool'>", "<class 'int'>", "<class 'str'>", "<class 'NoneType'>"], correct: 0 },
    { q: "What does collections.namedtuple create?", options: ["A mutable dict", "An immutable tuple subclass with named fields", "A new class hierarchy", "A JSON object"], correct: 1 },
    { q: "What's the result of list(zip([1,2,3], ['a','b']))?", options: ["[(1,'a'),(2,'b'),(3,None)]", "[(1,'a'),(2,'b')]", "Error", "[1,2,3,'a','b']"], correct: 1 },
    { q: "What does 'x' in {'x': 1, 'y': 2} check?", options: ["If 'x' is a value", "If 'x' is a key", "If the dict has 2 items", "Nothing, invalid syntax"], correct: 1 },
    { q: "What's the purpose of the @contextlib.contextmanager decorator?", options: ["Speeds up a function", "Turns a generator function into a context manager usable with `with`", "Caches results", "Marks a function abstract"], correct: 1 },
    { q: "Without a custom __eq__, what does == compare for two instances of a plain class?", options: ["Their attribute values", "Object identity (same as `is`)", "Their string representation", "Always False"], correct: 1 },
    { q: "What does [3, 1, 2].sort(key=lambda x: -x) result in?", options: ["[1, 2, 3]", "[3, 2, 1]", "[3, 1, 2]", "Error"], correct: 1 },
    { q: "What's the main benefit of defining __slots__ on a class?", options: ["Faster method calls", "Reduced memory use and restricted attribute names", "Automatic serialization", "Multiple inheritance support"], correct: 1 },
    { q: "What does Counter('mississippi').most_common(1) return?", options: ["[('s', 4)]", "[('i', 4)]", "[('m', 1)]", "[('p', 2)]"], correct: 1 },
    { q: "What does @lru_cache primarily optimize?", options: ["Memory usage always", "Repeated calls with the same arguments", "String formatting", "File I/O"], correct: 1 },
    { q: "Inside a function, what does `global count` allow?", options: ["Creating a new local variable", "Assigning to the module-level `count` instead of shadowing it locally", "Deleting the variable", "Nothing different"], correct: 1 },
    { q: "What happens when assert 1 == 2, 'oops' runs?", options: ["Nothing, 1 is truthy", "Raises AssertionError('oops')", "Prints 'oops'", "Returns False silently"], correct: 1 },
    { q: "What does `if (n := len(data)) > 5:` do?", options: ["Syntax error", "Assigns len(data) to n and checks n > 5 in one expression", "Compares n to 5 without assignment", "Only valid in Python 2"], correct: 1 },
    { q: "What does except (TypeError, ValueError) as e: catch?", options: ["Only TypeError", "Only ValueError", "Either TypeError or ValueError", "All exceptions"], correct: 2 },
    { q: "Why is ''.join(list_of_strs) generally preferred over repeated += in a loop?", options: ["It's shorter to type only", "It avoids O(n^2) behavior from repeated string copies", "+= doesn't work on strings", "join() mutates in place"], correct: 1 },
    { q: "What does f(*[1, 2, 3]) pass to f?", options: ["A single list argument", "Three separate positional arguments: 1, 2, 3", "A tuple (1, 2, 3)", "SyntaxError"], correct: 1 },
    { q: "Calling an async def function directly (without await) returns what?", options: ["Its final result immediately", "A coroutine object that hasn't run yet", "None", "A thread"], correct: 1 },
    { q: "What does asyncio.gather(coro1(), coro2()) do?", options: ["Runs them one after another", "Runs them concurrently and waits for both", "Only runs the first one", "Raises an error if used together"], correct: 1 },
    { q: "For CPU-bound parallelism in Python, which module actually uses multiple CPU cores?", options: ["threading", "multiprocessing", "asyncio", "queue"], correct: 1 },
    { q: "What does the @dataclass decorator auto-generate?", options: ["Only __init__", "__init__, __repr__, and __eq__ from annotated fields", "A database table", "Only getters/setters"], correct: 1 },
    { q: "What does all([True, True, False]) return?", options: ["True", "False", "None", "Error"], correct: 1 },
    { q: "What does any([]) (an empty list) return?", options: ["True", "False", "None", "Error"], correct: 1 },
    { q: "What does the nonlocal keyword target?", options: ["A global variable", "A variable in the nearest enclosing (non-global) function scope", "An instance attribute", "A class variable"], correct: 1 },
    { q: "Do Python type hints like def f(x: int) get enforced at runtime by default?", options: ["Yes, always", "No, they're purely documentation/tooling hints", "Only in Python 3.12+", "Only for return types"], correct: 1 },
    { q: "What does defining __call__ on a class enable?", options: ["Comparing two instances", "Calling instances like functions: obj()", "Iterating over instances", "Hashing instances"], correct: 1 },
    { q: "Why prefer os.path.join('a', 'b') over 'a' + '/' + 'b'?", options: ["It's faster", "It uses the correct separator per OS automatically", "It validates the path exists", "There's no real difference"], correct: 1 },
    { q: "What does a bare `except:` with no exception type catch?", options: ["Only standard exceptions", "Everything, including SystemExit and KeyboardInterrupt", "Nothing, it's invalid", "Only exceptions you define"], correct: 1 },
    { q: "What best describes the difference between an iterable and an iterator?", options: ["No difference", "An iterable can produce an iterator; an iterator tracks progress via __next__", "Iterators are always faster", "Only lists are iterables"], correct: 1 },
    { q: "What's the output of ', '.join(['a', 'b', 'c'])?", options: ["'a, b, c'", "['a', 'b', 'c']", "'abc'", "Error"], correct: 0 },
    { q: "What does isinstance(True, int) evaluate to in Python?", options: ["False", "True — bool is a subclass of int", "Error", "None"], correct: 1 },
    { q: "What does dict(zip(['a','b'], [1,2])) produce?", options: ["{'a': 1, 'b': 2}", "[('a',1),('b',2)]", "{1: 'a', 2: 'b'}", "Error"], correct: 0 },
    { q: "Why must __hash__ stay consistent with __eq__ on a custom class?", options: ["It's optional, no consequence", "Objects that compare equal must hash the same, or dict/set lookups break", "__hash__ is called automatically by __eq__", "Only relevant for lists"], correct: 1 },
    { q: "What does functools.reduce(lambda a,b: a+b, [1,2,3]) return?", options: ["[1,2,3]", "6", "1", "Error"], correct: 1 },
    { q: "What does itertools.chain([1,2], [3,4]) let you do?", options: ["Merge into a new list immediately", "Iterate over both sequences back-to-back without copying them together", "Zip them together", "Sort the combined values"], correct: 1 },
    { q: "What does defining __len__ on a class enable?", options: ["Comparing instances", "Calling len(obj) on instances of that class", "Hashing instances", "Iterating over instances"], correct: 1 },
    { q: "What does defining __getitem__ on a class enable?", options: ["Calling len() on it", "Using obj[i] indexing syntax on instances", "Comparing two instances", "Making it callable like a function"], correct: 1 },
    { q: "What's the relationship between Exception and BaseException?", options: ["They're unrelated", "Exception is a subclass of BaseException", "BaseException is a subclass of Exception", "They're the same class"], correct: 1 },
    { q: "When does a try/except/else block's else clause execute?", options: ["Only when an exception occurs", "Only when the try block succeeds with no exception", "Always, like finally", "Never in Python 3"], correct: 1 },
    { q: "What's the main memory advantage of (x**2 for x in range(1000000)) over a list comprehension?", options: ["No difference", "Values are produced lazily instead of building the whole list in memory", "It's always faster to compute", "It can be indexed like a list"], correct: 1 },
    { q: "In def f(a, *, b):, what does the bare * force?", options: ["a must be a keyword argument", "b must be passed as a keyword argument, not positionally", "The function accepts unlimited arguments", "Nothing, it's just documentation"], correct: 1 },
    { q: "What does functools.partial(pow, exp=2) create?", options: ["A number", "A new callable with exp already fixed to 2", "An error, partial needs positional args", "A decorator"], correct: 1 },
    { q: "What does defining __bool__ on a class control?", options: ["Its string representation", "What bool(obj) and truthiness checks evaluate to", "Its hash value", "Its length"], correct: 1 },
    { q: "What do dict.keys() and dict.values() return?", options: ["Plain lists, disconnected from the dict", "Live view objects that reflect later changes to the dict", "Tuples", "Sets, always deduplicated"], correct: 1 },
    { q: "Running python app.py one two, what is sys.argv?", options: ["['one', 'two']", "['app.py', 'one', 'two']", "['app.py']", "2"], correct: 1 },
    { q: "What's a key advantage of pathlib.Path over manual os.path string joins?", options: ["It's the only way to open files", "Paths become objects with convenient methods/operators like /", "It's faster at runtime", "It only works on Windows"], correct: 1 },
    { q: "What must a class's __iter__ method return?", options: ["A list", "An iterator object implementing __next__", "A generator function, not object", "None"], correct: 1 },
    { q: "In Python 3, what's the core difference between str and bytes?", options: ["No difference", "str holds text; bytes holds raw binary data", "bytes is faster for all text processing", "str is deprecated"], correct: 1 },
    { q: "What does 'hello'.encode('utf-8') return?", options: ["A str", "A bytes object", "An int", "None"], correct: 1 },
    { q: "What's __post_init__ used for on a @dataclass?", options: ["Deleting the instance", "Running extra setup logic right after the generated __init__ finishes", "Replacing __init__ entirely", "Comparing instances"], correct: 1 },
    { q: "What does subclassing Enum give you over plain integers?", options: ["Faster arithmetic", "Named, type-safe, self-documenting constants", "Automatic serialization to JSON", "Nothing extra"], correct: 1 },
    { q: "What does typing.Optional[int] mean?", options: ["Must always be an int", "Either an int or None", "Any type at all", "A required parameter"], correct: 1 },
    { q: "What does {**{'a':1}, **{'a':2, 'b':3}} evaluate to?", options: ["{'a': 1, 'b': 3}", "{'a': 2, 'b': 3}", "Error, duplicate key", "{'a': [1,2], 'b': 3}"], correct: 1 },
    { q: "What's 'monkey patching'?", options: ["A debugging tool", "Modifying a class/module's attributes at runtime from outside its definition", "A type of unit test", "A memory leak pattern"], correct: 1 },
    { q: "What's the weakref module used for?", options: ["Faster references", "References that don't prevent garbage collection of the referenced object", "Thread-safe references", "Circular imports"], correct: 1 },
    { q: "When is a TypeError raised for a missing @abstractmethod implementation?", options: ["At class definition time", "At instantiation time of a concrete subclass", "Never, it's just a convention", "At import time"], correct: 1 },
    { q: "What does the traceback module help with?", options: ["Formatting/inspecting exception stack traces programmatically", "Automatically fixing exceptions", "Profiling performance", "Managing threads"], correct: 0 },
    { q: "Why prefer the logging module over print() in a real application?", options: ["print() is slower", "It supports severity levels, timestamps, and configurable output without code changes", "logging is built into the language, print isn't", "There's no real reason"], correct: 1 },
    { q: "What does '{:>10}'.format('hi') produce?", options: ["'hi' left-aligned in 10 chars", "'hi' right-aligned, padded to width 10", "'hihihihihi'", "Error"], correct: 1 },
    { q: "Where does a class attribute live compared to an instance attribute?", options: ["No difference, they're identical", "Shared on the class itself vs owned by one specific instance (usually set via self in __init__)", "Instance attributes are always faster", "Class attributes can't be changed"], correct: 1 },
    { q: "How does list.copy() compare to list[:]?", options: ["copy() is deep, slicing is shallow", "Both produce an equivalent shallow copy", "list[:] mutates the original", "copy() is invalid syntax"], correct: 1 },
    { q: "What does Path('a') / 'b' produce using pathlib?", options: ["A TypeError", "A new Path object representing 'a/b'", "The string 'a/b'", "A tuple ('a', 'b')"], correct: 1 },
    { q: "What does csv.DictReader yield per row compared to csv.reader?", options: ["The same plain list", "A dict mapping column headers to values", "A tuple of headers only", "A single joined string"], correct: 1 },
    { q: "What's the difference between json.dump and json.dumps?", options: ["No difference", "dump writes to a file object; dumps returns a string", "dumps writes to a file; dump returns a string", "dump only works with lists"], correct: 1 },
    { q: "What does argparse.ArgumentParser primarily help you build?", options: ["A GUI", "A command-line interface with typed arguments and auto-generated --help", "A web server", "A test suite"], correct: 1 },
    { q: "How do you access a function's docstring at runtime?", options: ["func.docstring", "func.__doc__", "help.func()", "func.doc()"], correct: 1 },
    { q: "What does textwrap.dedent do?", options: ["Adds indentation to every line", "Removes common leading whitespace from every line", "Wraps long lines", "Removes trailing whitespace only"], correct: 1 },
    { q: "What does 'a  b'.split() (no argument) do differently from 'a  b'.split(' ')?", options: ["They're identical", "split() collapses runs of whitespace; split(' ') produces an empty string between the two spaces", "split(' ') is invalid", "split() only works on tabs"], correct: 1 },
    { q: "What does random.seed(42) accomplish?", options: ["Speeds up random number generation", "Makes subsequent random calls deterministic/reproducible", "Disables randomness entirely", "Only affects random.choice"], correct: 1 },
    { q: "What's unittest.mock.patch typically used for in a test?", options: ["Fixing bugs automatically", "Temporarily replacing a dependency with a mock to isolate the code under test", "Formatting test output", "Running tests in parallel"], correct: 1 },
    { q: "What does d.setdefault('k', []) do if 'k' is already a key in d?", options: ["Overwrites it with []", "Returns the EXISTING value, leaving it unchanged", "Raises a KeyError", "Deletes the key"], correct: 1 },
    { q: "Why is heapq preferred over repeatedly sorting a list for a priority queue?", options: ["heapq is simpler syntax only", "heapq gives O(log n) insert/pop instead of re-sorting the whole list each time", "heapq keeps items in insertion order", "There's no real performance difference"], correct: 1 },
    { q: "What does bisect.insort(sorted_list, x) do?", options: ["Sorts the whole list from scratch", "Inserts x at the correct position to keep the list sorted", "Removes x from the list", "Returns the index of x without inserting"], correct: 1 },
    { q: "What Python feature is @property built on top of?", options: ["Metaclasses", "Descriptors (__get__/__set__)", "Decorators only, no deeper mechanism", "Context managers"], correct: 1 },
    { q: "What does __init_subclass__ let a base class do?", options: ["Delete subclasses", "Run custom logic automatically whenever a subclass is defined", "Prevent all subclassing", "Change its own class name"], correct: 1 },
    { q: "What does functools.wraps(func) do inside a decorator?", options: ["Makes the function run faster", "Copies func's name/docstring onto the wrapper function", "Wraps the function in a try/except", "Nothing, it's optional syntax sugar with no effect"], correct: 1 },
    { q: "What's the main practical difference between @staticmethod and a plain module-level function?", options: ["staticmethod is always faster", "staticmethod is just namespaced under the class for organization", "staticmethod can access self", "Module functions can't take arguments"], correct: 1 },
    { q: "What's the memory advantage of the array module over a list for numeric data?", options: ["No advantage", "It stores values compactly in a fixed-type buffer instead of boxed objects", "It's automatically sorted", "It supports more data types than a list"], correct: 1 },
    { q: "What's queue.Queue used for that a plain list isn't safe for?", options: ["Storing more items", "Thread-safe FIFO access between multiple threads", "Faster indexing", "Storing key-value pairs"], correct: 1 },
    { q: "What does subprocess.run(['ls']) do?", options: ["Imports the ls module", "Runs 'ls' as a child process and waits for it to finish", "Only works on Windows", "Raises an error, ls isn't a Python function"], correct: 1 },
    { q: "What's the difference between shutil.copy and shutil.copytree?", options: ["No difference", "copy handles a single file; copytree recursively copies a whole directory", "copytree is for a single file only", "copy is deprecated"], correct: 1 },
    { q: "What's the key difference between re.match and re.search?", options: ["No difference", "match only checks the start of the string; search scans the whole string", "search only checks the start", "match is faster only"], correct: 1 },
    { q: "Why use a raw string r'\\d+' for a regex pattern?", options: ["It's required by the re module", "It disables backslash escape processing so \\d reaches the regex engine literally", "It makes the pattern case-insensitive", "It compiles the regex early"], correct: 1 },
    { q: "What does collections.defaultdict(list)['missing_key'] do?", options: ["Raises a KeyError", "Creates and returns a new empty list automatically", "Returns None", "Raises a TypeError"], correct: 1 },
    { q: "Why is collections.deque preferred over a list for queue-like front insertions?", options: ["deque is always sorted", "deque gives O(1) appends/pops at both ends vs O(n) at the front for a list", "list can't have items removed", "deque uses less total memory always"], correct: 1 },
    { q: "What's the convention for a well-written __repr__?", options: ["It should be identical to __str__", "It should ideally look like valid code that could recreate the object", "It must always return None", "It's only used internally, never customized"], correct: 1 },
    { q: "What does enumerate(items, start=1) change vs enumerate(items)?", options: ["It reverses the items", "The yielded index starts at 1 instead of 0", "It skips the first item", "It sorts the items first"], correct: 1 },
  ],
  "typescript-javascript": [
    { q: "What does typeof null return?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], correct: 2 },
    { q: "Which operator checks strict equality?", options: ["==", "===", "=", "!=="], correct: 1 },
    { q: "What does let provide that var doesn't?", options: ["Function scope", "Block scope", "Global scope", "Immunity from hoisting"], correct: 1 },
    { q: "What does Array.prototype.filter return?", options: ["A boolean", "The first match", "A new array of matching items", "The original array, mutated"], correct: 2 },
    { q: "Which keyword declares a constant binding?", options: ["let", "const", "final", "static"], correct: 1 },
    { q: "What does an arrow function NOT have its own?", options: ["Return value", "Parameters", "this", "Name, if anonymous"], correct: 2 },
    { q: "What does JSON.stringify do?", options: ["Parses a JSON string into an object", "Converts a JS value into a JSON string", "Validates JSON syntax", "Removes whitespace from a string"], correct: 1 },
    { q: "What does an async function return when called?", options: ["undefined", "The literal return value", "A Promise", "A generator"], correct: 2 },
    { q: "Where can await be used?", options: ["Anywhere in any function", "Inside an async function (or top-level module)", "Only inside a callback", "Only inside a try block"], correct: 1 },
    { q: "In TypeScript, what does `: string` after a parameter name do?", options: ["Assigns a default value", "Declares its type", "Converts it to a string", "It's just a comment"], correct: 1 },
    { q: "What does the ?? (nullish coalescing) operator do?", options: ["Returns the right side if the left is falsy", "Returns the right side only if the left is null/undefined", "Behaves exactly like ||", "Throws if the left is null"], correct: 1 },
    { q: "What's the result of [1, 2, 3].length?", options: ["2", "3", "4", "undefined"], correct: 1 },
    { q: "Which turns an array into a comma-joined string?", options: [".toString() or .join()", ".concat()", ".map()", ".flat()"], correct: 0 },
    { q: "What does const {a} = obj do?", options: ["Creates a new object", "Destructures property a from obj into variable a", "Deletes property a", "Clones obj"], correct: 1 },
    { q: "Which Promise state means it succeeded?", options: ["pending", "fulfilled", "rejected", "settled only"], correct: 1 },
    { q: "In TypeScript, what does an interface primarily describe?", options: ["Runtime behavior", "The shape of an object", "A class implementation", "Only a function's return value"], correct: 1 },
    { q: "What does Array.prototype.reduce do?", options: ["Filters an array", "Accumulates array values into a single result", "Sorts an array", "Reverses an array"], correct: 1 },
    { q: "What does the spread operator do in f(...args)?", options: ["Wraps args in an array", "Expands an iterable into individual arguments", "Combines args into a string", "Nothing without TypeScript"], correct: 1 },
    { q: "What does null == undefined evaluate to?", options: ["true", "false", "TypeError", "NaN"], correct: 0 },
    { q: "What's the main effect of TypeScript's any type?", options: ["Guarantees type safety", "Opts out of type checking for that value", "Marks a value as required", "Makes a variable immutable"], correct: 1 },
    { q: "What does Object.keys(obj) return?", options: ["Values of obj", "An array of obj's own enumerable keys", "A new object", "undefined"], correct: 1 },
    { q: "What's the result of typeof function(){}?", options: ["'object'", "'function'", "'undefined'", "'method'"], correct: 1 },
    { q: "What does Array.prototype.find return?", options: ["An array of matches", "The first matching element, or undefined", "The index of the match", "A boolean"], correct: 1 },
    { q: "In TS, what does readonly on a property do?", options: ["Makes it private", "Prevents reassignment after initialization", "Makes it optional", "Makes it a getter"], correct: 1 },
    { q: "What does String(123) return?", options: ["123", "'123'", "NaN", "Error"], correct: 1 },
    { q: "What's a template literal, e.g. `Hi ${name}`?", options: ["A regex", "A string with embedded expressions", "A function", "A comment"], correct: 1 },
    { q: "What does Array.prototype.some return?", options: ["True if ALL elements pass the test", "True if AT LEAST ONE element passes the test", "The first passing element", "A new array"], correct: 1 },
    { q: "What's the output of [1,2] + [3,4]?", options: ["[1,2,3,4]", "'1,23,4'", "Error", "[[1,2],[3,4]]"], correct: 1 },
    { q: "What does a TS enum let you define?", options: ["A named set of related constants", "A generic type", "An interface", "A decorator"], correct: 0 },
    { q: "What does Object.freeze(obj) do?", options: ["Deep clones obj", "Prevents adding/removing/changing obj's own properties", "Deletes obj", "Converts obj to JSON"], correct: 1 },
    { q: "In JS, when does try/catch/finally's finally block run?", options: ["Only on success", "Only on error", "Always, regardless of outcome", "Never"], correct: 2 },
    { q: "What does Array.prototype.sort() do by default (no comparator) with numbers?", options: ["Sorts numerically ascending", "Sorts as strings, which can misorder numbers", "Sorts descending", "Throws an error"], correct: 1 },
    { q: "What does the in operator check on an object?", options: ["If a value exists anywhere", "If a property name exists on the object (own or inherited)", "If the object is an array", "If two objects are equal"], correct: 1 },
    { q: "What's a Set used for in JS?", options: ["Storing unique values", "Storing key-value pairs", "Ordered numeric ranges", "Async iteration only"], correct: 0 },
    { q: "What does Number('abc') evaluate to?", options: ["0", "NaN", "undefined", "Error thrown"], correct: 1 },
    { q: "In TS, what does the as keyword do, e.g. value as string?", options: ["Converts the value at runtime", "Asserts the type to the compiler without changing runtime behavior", "Creates an alias import", "Defines a new type"], correct: 1 },
    { q: "What does Array.prototype.flat() do?", options: ["Reverses an array", "Flattens nested arrays by one level (by default)", "Sorts an array", "Removes duplicates"], correct: 1 },
    { q: "What's the output of [...\"abc\"]?", options: ["'abc'", "['a','b','c']", "['abc']", "Error"], correct: 1 },
    { q: "What does Promise.race do?", options: ["Waits for all promises", "Resolves/rejects as soon as the first settles", "Runs promises sequentially", "Cancels all but one promise"], correct: 1 },
    { q: "What does optional chaining ?. do, e.g. obj?.prop?", options: ["Throws if obj is null/undefined", "Returns undefined instead of throwing if obj is null/undefined", "Always returns null", "Only works on arrays"], correct: 1 },
    { q: "What's the difference between localStorage and sessionStorage?", options: ["No difference", "localStorage persists until cleared; sessionStorage clears when the tab closes", "sessionStorage is larger", "localStorage is per-tab only"], correct: 1 },
    { q: "What does event.preventDefault() stop?", options: ["Event bubbling", "The browser's default action for that event", "All future events", "Nothing by itself"], correct: 1 },
    { q: "What does event.stopPropagation() do?", options: ["Cancels the default action", "Stops the event from bubbling/capturing to other elements", "Removes the event listener", "Prevents re-rendering"], correct: 1 },
    { q: "What's the main benefit of event delegation?", options: ["Faster CSS parsing", "One listener on a parent handles events for many (including future) children", "It replaces the need for addEventListener", "It only works with React"], correct: 1 },
    { q: "What does Object.assign({}, a, b) return?", options: ["a mutated in place", "A new object with a and b shallow-merged", "An array", "undefined"], correct: 1 },
    { q: "A shallow copy of a nested object means what?", options: ["Everything is fully duplicated", "The top level is duplicated, but nested objects are still shared references", "Nothing is copied", "Only primitives are copied"], correct: 1 },
    { q: "What does [1,2,3].indexOf(9) return?", options: ["undefined", "-1", "null", "Error"], correct: 1 },
    { q: "What makes a WeakMap 'weak'?", options: ["It's slower than Map", "Its keys can be garbage collected if there are no other references to them", "It can only hold 10 items", "Values must be primitives"], correct: 1 },
    { q: "What does debouncing an input handler accomplish?", options: ["Runs the handler more often", "Delays running until a pause in events, avoiding running on every keystroke", "Blocks all future input", "Only affects mouse events"], correct: 1 },
    { q: "How does throttling differ from debouncing?", options: ["They're identical", "Throttling fires at most once per fixed interval; debouncing waits for a pause", "Throttling only works on scroll", "Debouncing runs more frequently"], correct: 1 },
    { q: "What's true about export default vs a named export?", options: ["Both must match the file name", "default is imported under any name without braces; named exports need the exact name", "Named exports can't be aliased", "default exports can't be functions"], correct: 1 },
    { q: "What's a common use for a Symbol in JS?", options: ["Formatting numbers", "Creating a guaranteed-unique property key", "Declaring a constant", "Type-checking"], correct: 1 },
    { q: "In TypeScript, what does the tuple type [string, number] enforce?", options: ["Any array of strings and numbers", "Exactly two elements: a string then a number, in that order", "A union of string or number", "Nothing at runtime or compile time"], correct: 1 },
    { q: "What does [10, 20, 30].at(-1) return?", options: ["10", "20", "30", "undefined"], correct: 2 },
    { q: "What's the purpose of a TypeScript type guard like typeof x === 'string'?", options: ["Converts x to a string", "Narrows x's type within that code branch so type-specific operations are allowed", "Deletes x if it's not a string", "Only works on classes"], correct: 1 },
    { q: "What does Function.prototype.bind(obj) return?", options: ["The function's result", "A new function permanently bound to `this = obj`", "undefined", "A copy of obj"], correct: 1 },
    { q: "What's the difference between call and apply?", options: ["No difference", "call takes arguments individually; apply takes them as an array", "apply is faster", "call can't set `this`"], correct: 1 },
    { q: "What does Number.isInteger(4.0) return?", options: ["false", "true", "undefined", "Throws an error"], correct: 1 },
    { q: "Do variables declared at the top level of an ES module leak into the global scope?", options: ["Yes, always", "No, each module has its own top-level scope", "Only var declarations do", "Only in strict mode"], correct: 1 },
    { q: "What does [[1,2],[3,4]].flatMap(x => x) produce?", options: ["[[1,2],[3,4]]", "[1, 2, 3, 4]", "[1, [2, 3], 4]", "Error"], correct: 1 },
    { q: "Why is a Set generally faster than an array for membership checks?", options: ["Sets store fewer items", "Set.has() is O(1) average vs O(n) for Array.includes()", "Sets are always smaller in memory", "There's no real difference"], correct: 1 },
    { q: "What does the TypeScript non-null assertion value! do?", options: ["Checks at runtime that value isn't null", "Tells the compiler to treat value as non-null without a runtime check", "Throws if value is null", "Converts value to a boolean"], correct: 1 },
    { q: "async/await is best described as what?", options: ["A replacement that has nothing to do with Promises", "Syntax sugar over Promises for more readable async code", "A synchronous blocking mechanism", "Only usable in Node.js"], correct: 1 },
    { q: "What does [1,2,3].reverse() do to the original array?", options: ["Returns a reversed copy, leaving the original unchanged", "Mutates the original array in place and returns it", "Throws an error", "Returns undefined"], correct: 1 },
    { q: "What's the point of a discriminated union with a shared 'type' field?", options: ["It's purely stylistic", "Lets TypeScript narrow which variant you have and check branches exhaustively", "It disables type checking", "It only works with classes"], correct: 1 },
    { q: "Which runs first: a resolved Promise's .then callback, or a setTimeout(fn, 0) callback?", options: ["setTimeout always runs first", "The Promise's .then (microtask) runs first", "They run simultaneously", "It's random"], correct: 1 },
    { q: "What can an abstract class do that a TypeScript interface can't?", options: ["Describe an object's shape", "Contain actual method implementations to be inherited", "Be used in a union type", "Be exported"], correct: 1 },
    { q: "What does [1,2,3,4].fill(0, 1, 3) produce?", options: ["[0,0,0,0]", "[1,0,0,4]", "[1,2,3,4]", "Error"], correct: 1 },
    { q: "What does the TypeScript never type typically represent?", options: ["A value that is always undefined", "A value that can never actually occur, e.g. from a function that always throws", "The same as void", "Any type at all"], correct: 1 },
    { q: "What does Array.prototype.findIndex return if nothing matches?", options: ["null", "-1", "undefined", "0"], correct: 1 },
    { q: "What's the key difference between Array.prototype.find and .filter?", options: ["No difference", "find returns the first match only; filter returns all matches as a new array", "filter mutates the array", "find always returns an array"], correct: 1 },
    { q: "What's a JS Proxy primarily used for?", options: ["Formatting strings", "Intercepting/customizing fundamental operations (get, set, etc.) on an object", "Networking requests", "Type checking at compile time"], correct: 1 },
    { q: "Can you iterate over a WeakMap's entries with a for...of loop?", options: ["Yes, just like Map", "No, WeakMap isn't iterable", "Only its keys", "Only if it has fewer than 100 entries"], correct: 1 },
    { q: "What does Array.from({length: 3}, (_, i) => i * 2) produce?", options: ["[0, 2, 4]", "[1, 2, 3]", "[0, 1, 2]", "Error"], correct: 0 },
    { q: "What does TypeScript's keyof {a: 1, b: 2} produce?", options: ["number", "'a' | 'b'", "string[]", "any"], correct: 1 },
    { q: "What does TypeScript's Partial<T> utility type do?", options: ["Removes half the properties", "Makes all of T's properties optional", "Makes all properties readonly", "Picks one property"], correct: 1 },
    { q: "What does TypeScript's Pick<T, 'a'> produce?", options: ["T without property 'a'", "A type with only property 'a' from T", "An error", "The same as T"], correct: 1 },
    { q: "What does TypeScript's Record<string, number> describe?", options: ["An array of numbers", "An object type with string keys and number values", "A tuple", "A function type"], correct: 1 },
    { q: "What does Object.defineProperty let you configure that plain assignment can't?", options: ["Nothing extra", "Whether a property is enumerable, writable, or backed by a getter/setter", "The property's type", "The object's prototype only"], correct: 1 },
    { q: "What's a 'higher-order function'?", options: ["A function with many parameters", "A function that takes and/or returns another function", "A function defined inside a class", "An async function"], correct: 1 },
    { q: "What's the key difference between for...in and for...of?", options: ["They're identical", "for...in iterates enumerable keys; for...of iterates an iterable's values", "for...of only works on strings", "for...in only works on arrays"], correct: 1 },
    { q: "What does TypeScript's satisfies operator do?", options: ["Converts a value's type", "Checks a value matches a type without widening its inferred type", "Throws at runtime on mismatch", "Only works on interfaces"], correct: 1 },
    { q: "What's an IIFE?", options: ["A type of loop", "A function defined and invoked immediately to create an isolated scope", "An async function", "A TypeScript-only feature"], correct: 1 },
    { q: "What's the difference between Promise.any and Promise.race?", options: ["They're identical", "any resolves on the first FULFILLED promise (ignoring rejections); race settles on whichever finishes first, success or failure", "any always fails first", "race waits for all promises"], correct: 1 },
    { q: "What does 'structural typing' mean in TypeScript?", options: ["Types are compared by declared class name", "Compatibility is based on an object's actual shape, not its name", "Only classes can be typed", "Types must be identical objects"], correct: 1 },
    { q: "What does a ??= b do if a is 0?", options: ["Assigns b to a, since 0 is falsy", "Leaves a as 0, since 0 is not null/undefined", "Throws an error", "Always assigns b"], correct: 1 },
    { q: "What's the difference between Object.keys and Object.getOwnPropertyNames?", options: ["No difference", "keys returns only enumerable properties; getOwnPropertyNames returns all own properties", "getOwnPropertyNames is deprecated", "keys includes inherited properties"], correct: 1 },
    { q: "What does 'currying' a function mean?", options: ["Making it run faster", "Transforming add(a, b) into add(a)(b), one argument at a time", "Caching its results", "Making it async"], correct: 1 },
    { q: "How does Array.prototype.reduceRight differ from reduce?", options: ["It reduces to a smaller array", "It processes the array right-to-left instead of left-to-right", "It can't take an initial value", "It only works on numbers"], correct: 1 },
    { q: "What happens when you call null.toString()?", options: ["Returns 'null'", "Throws a TypeError", "Returns undefined", "Returns an empty string"], correct: 1 },
    { q: "What does TypeScript's Readonly<T> utility type do?", options: ["Deletes T's methods", "Makes all of T's properties readonly", "Makes T optional", "Converts T to a string"], correct: 1 },
    { q: "What does TypeScript's Omit<T, 'a'> produce?", options: ["Only property 'a'", "T with property 'a' removed", "The same as T", "An error"], correct: 1 },
    { q: "How does Array.prototype.toSorted differ from .sort()?", options: ["No difference", "toSorted returns a new array, leaving the original unchanged; sort mutates in place", "toSorted is slower", "sort() doesn't exist"], correct: 1 },
    { q: "In TypeScript, what does function f(x?: number) mean?", options: ["x defaults to 0", "x is optional; it may be omitted by the caller", "x must be a string", "Invalid syntax"], correct: 1 },
    { q: "What happens if you call function f(x = 10) {} with f()?", options: ["Throws an error", "x is set to 10 inside the function", "x is undefined", "x is null"], correct: 1 },
    { q: "What does arr instanceof Array check?", options: ["The array's length", "Whether arr's prototype chain includes Array.prototype", "If arr is empty", "Nothing at runtime"], correct: 1 },
    { q: "What's the practical difference between arr.concat(other) and [...arr, ...other]?", options: ["concat mutates arr", "Both produce an equivalent new combined array without mutating originals", "Spread is much slower always", "concat can't combine two arrays"], correct: 1 },
    { q: "What does Array.prototype.every check?", options: ["If at least one element passes a test", "If ALL elements pass a test", "The array's length", "If the array is sorted"], correct: 1 },
    { q: "What does [1,2,3,2,1].lastIndexOf(2) return?", options: ["1", "3", "-1", "2"], correct: 1 },
    { q: "What does JSON.parse('{\"a\":1}') return?", options: ["The original string", "A JS object: {a: 1}", "undefined", "An error, always"], correct: 1 },
    { q: "What does the Fetch API's fetch() function return?", options: ["The response body directly", "A Promise resolving to a Response object", "A synchronous XHR object", "undefined"], correct: 1 },
    { q: "What does an AbortController's signal let you do with fetch?", options: ["Speed up the request", "Cancel the request mid-flight", "Retry it automatically", "Cache the response"], correct: 1 },
    { q: "What's a 'polyfill'?", options: ["A CSS framework", "Code implementing a newer feature's behavior for environments that lack it natively", "A build tool", "A type of test"], correct: 1 },
    { q: "What does [1,2,3].entries() produce when iterated?", options: ["Just the values", "[index, value] pairs", "Just the indices", "A single combined string"], correct: 1 },
    { q: "How does Object.is(NaN, NaN) differ from NaN === NaN?", options: ["They're identical", "Object.is returns true; === returns false", "Object.is returns false; === returns true", "Both always return false"], correct: 1 },
    { q: "What does a tagged template literal like tag`Hi ${name}` do?", options: ["Nothing special without tag being called", "Calls tag with the literal's string parts and interpolated values", "Throws a syntax error", "Only works with template strings, not functions"], correct: 1 },
    { q: "What does the built-in Intl object help with?", options: ["Networking", "Locale-aware formatting of numbers, dates, and currencies", "Type checking", "DOM manipulation"], correct: 1 },
    { q: "What's the key feature of a WeakSet compared to a Set?", options: ["It can store primitives", "Its object entries can be garbage collected if unreferenced elsewhere", "It's always faster", "It supports duplicate values"], correct: 1 },
    { q: "What's the difference between Array.of(7) and new Array(7)?", options: ["They're identical", "Array.of(7) makes [7]; new Array(7) makes an empty array with length 7", "Array.of(7) makes an empty array; new Array(7) makes [7]", "Array.of doesn't exist"], correct: 1 },
    { q: "What does Object.create(proto) do?", options: ["Clones proto deeply", "Creates a new object with proto set as its prototype", "Freezes proto", "Deletes proto"], correct: 1 },
    { q: "What is the JavaScript 'prototype chain'?", options: ["A list of class names", "The chain of objects used to resolve property lookups that aren't found directly", "A debugging tool", "A type of loop"], correct: 1 },
    { q: "What does class B extends A set up internally?", options: ["Copies all of A's code into B", "Links B.prototype's internal prototype to A.prototype", "Nothing at runtime, it's compile-time only", "Merges A and B into one class"], correct: 1 },
    { q: "What's a common way to implement a 'mixin' pattern in JS?", options: ["JS has native multiple inheritance, no pattern needed", "Copying methods onto a prototype via Object.assign, since classes support single inheritance", "Using only interfaces", "It's impossible in JavaScript"], correct: 1 },
    { q: "What does [1,2,3].keys() return when iterated?", options: ["The values 1, 2, 3", "The indices 0, 1, 2", "Key-value pairs", "undefined"], correct: 1 },
    { q: "In a Map's forEach callback (value, key, map), what can 'key' be that an Array's index can't?", options: ["Nothing, they're the same type", "Any type — objects, strings, etc., not just a number", "Only a string", "Only a symbol"], correct: 1 },
    { q: "What does the Reflect object provide?", options: ["A new type system", "Functions mirroring fundamental object operations, often paired with Proxy", "A replacement for classes", "Networking utilities"], correct: 1 },
    { q: "What's 'tree shaking' in a JS bundler?", options: ["Randomizing module load order", "Removing unused exported code from the final bundle", "Compressing images", "Minifying variable names only"], correct: 1 },
    { q: "What does import('./module.js') (dynamic import) return?", options: ["The module directly, synchronously", "A Promise resolving to the module", "undefined", "A string path"], correct: 1 },
    { q: "What's a service worker primarily used for?", options: ["Styling pages", "Intercepting network requests to enable offline support and caching", "Compiling TypeScript", "Managing databases"], correct: 1 },
    { q: "What makes a function 'pure'?", options: ["It's fast", "Same inputs always produce the same output with no side effects", "It uses arrow syntax", "It has no parameters"], correct: 1 },
    { q: "How does Array.prototype.toReversed differ from .reverse()?", options: ["No difference", "toReversed returns a new array; reverse mutates in place", "reverse returns a new array; toReversed mutates", "toReversed only works on strings"], correct: 1 },
    { q: "What does a get/set pair in a class body create?", options: ["A regular method", "A property with custom read/write behavior accessed via plain property syntax", "A private field", "A static method"], correct: 1 },
    { q: "What does Object.hasOwn(obj, 'x') check?", options: ["If obj has 'x' anywhere in its prototype chain", "If obj has 'x' as its OWN property", "If 'x' is a valid identifier", "If obj is frozen"], correct: 1 },
    { q: "Why do named exports tree-shake more reliably than one export default object bundling everything?", options: ["Named exports are slower but safer", "Bundlers can statically analyze which individual named exports are actually used", "Default exports are always removed", "There's no difference for bundlers"], correct: 1 },
    { q: "What does [1,2,3,4,5].copyWithin(0, 3) do?", options: ["Returns a new array", "Copies elements starting at index 3 over the array starting at index 0, mutating it", "Deletes elements from index 3 onward", "Reverses the array"], correct: 1 },
  ],
  "html-css": [
    { q: "Which tag defines the main heading of a page?", options: ["<head>", "<h1>", "<title>", "<header>"], correct: 1 },
    { q: "Which property changes text color?", options: ["background-color", "color", "font-color", "text-color"], correct: 1 },
    { q: "What does display: flex turn an element into?", options: ["A grid container", "A flex container", "An inline element", "A table"], correct: 1 },
    { q: "Which unit scales relative to the root font-size?", options: ["em", "rem", "px", "vh"], correct: 1 },
    { q: "Which attribute provides alternative text for an image?", options: ["title", "alt", "src", "longdesc only"], correct: 1 },
    { q: "What does box-sizing: border-box include in the declared width?", options: ["Only content", "Content + padding + border", "Only margin", "Content + margin"], correct: 1 },
    { q: "Which selector targets an element with id 'main'?", options: [".main", "#main", "*main", "main{}"], correct: 1 },
    { q: "What does position: fixed do?", options: ["Positions relative to nearest positioned ancestor", "Positions relative to the viewport, stays put on scroll", "Keeps normal document flow", "Removes the element from the page"], correct: 1 },
    { q: "Which tag is used for a hyperlink?", options: ["<link>", "<a>", "<href>", "<nav>"], correct: 1 },
    { q: "What does justify-content: center do in a flex row?", options: ["Centers items vertically", "Centers items horizontally along the main axis", "Stretches items", "Wraps items"], correct: 1 },
    { q: "Which CSS property creates space inside an element's border?", options: ["margin", "padding", "border-spacing", "gap"], correct: 1 },
    { q: "What's the box model order, content outward?", options: ["content, padding, border, margin", "content, border, padding, margin", "margin, border, padding, content", "padding, content, border, margin"], correct: 0 },
    { q: "Which tag semantically represents independent, self-contained content?", options: ["<section>", "<article>", "<div>", "<span>"], correct: 1 },
    { q: "What does grid-template-columns: 1fr 1fr create?", options: ["One column", "Two equal-width columns", "Two fixed 1px columns", "A single row"], correct: 1 },
    { q: "Which pseudo-class targets the first child of its parent?", options: [":first", ":first-child", ":nth(1)", ":before"], correct: 1 },
    { q: "What does overflow: hidden do to content that doesn't fit?", options: ["Adds a scrollbar", "Clips it, hiding the overflow", "Shrinks the font", "Always wraps to a new line"], correct: 1 },
    { q: "Which fully removes an element from the layout?", options: ["visibility: hidden", "display: none", "opacity: 0", "display: inline"], correct: 1 },
    { q: "What does @media (max-width: 600px) do?", options: ["Applies styles only above 600px", "Applies styles at or below 600px width", "Sets the page width to 600px", "Only affects print"], correct: 1 },
    { q: "Which attribute specifies an input field's kind?", options: ["kind", "type", "input-type", "format"], correct: 1 },
    { q: "What does flex: 1 on a flex item roughly mean?", options: ["Fixed width of 1px", "Grow to fill space, sharing equally with other flex:1 items", "Don't grow or shrink", "Only affects height"], correct: 1 },
    { q: "Which tag embeds a video?", options: ["<video>", "<media>", "<embed>", "<film>"], correct: 0 },
    { q: "What does text-align: center affect?", options: ["Block positioning", "Horizontal alignment of inline/text content within its container", "Vertical alignment", "Element width"], correct: 1 },
    { q: "Which property controls the space between flex items?", options: ["margin", "gap", "spacing", "padding"], correct: 1 },
    { q: "What does <label for=\"id\"> do?", options: ["Styles text bold", "Associates descriptive text with a form control for accessibility/click-to-focus", "Creates a tooltip", "Validates input"], correct: 1 },
    { q: "What's the default position value of an element?", options: ["relative", "static", "absolute", "fixed"], correct: 1 },
    { q: "What does <meta charset=\"utf-8\"> specify?", options: ["The page language", "The character encoding", "The viewport size", "The page title"], correct: 1 },
    { q: "Which CSS property makes text bold?", options: ["font-style", "font-weight", "text-decoration", "font-size"], correct: 1 },
    { q: "What's the purpose of the required attribute on a form input?", options: ["Hides the field", "Prevents form submission until the field is filled", "Auto-fills the field", "Makes the field read-only"], correct: 1 },
    { q: "What does border-radius: 50% on a square element produce?", options: ["A square with rounded corners", "A perfect circle", "An oval", "No effect"], correct: 1 },
    { q: "Which selector picks all direct <li> children of a <ul>?", options: ["ul li", "ul > li", "ul + li", "ul ~ li"], correct: 1 },
    { q: "What does align-items: stretch do in flexbox (its default value)?", options: ["Items shrink to content size", "Items stretch to fill the cross-axis unless a size is set", "Items center", "Items wrap"], correct: 1 },
    { q: "What's the purpose of <button type=\"submit\"> inside a form?", options: ["Resets the form", "Submits the form's data", "Does nothing special", "Opens a link"], correct: 1 },
    { q: "What does background-size: cover do?", options: ["Repeats the image", "Scales the image to fully cover the element, cropping if needed", "Shrinks the image to fit without cropping", "Disables the background"], correct: 1 },
    { q: "Which unit is a percentage of the viewport height?", options: ["%", "vh", "em", "pt"], correct: 1 },
    { q: "What does the <template> tag do?", options: ["Renders immediately", "Holds HTML that isn't rendered until activated by JS", "Creates a form template", "Imports another page"], correct: 1 },
    { q: "What's the effect of cursor: pointer?", options: ["Hides the cursor", "Shows a hand/pointer cursor on hover, signaling clickability", "Disables clicking", "Changes the cursor color"], correct: 1 },
    { q: "What does text-overflow: ellipsis require to actually show \"...\"?", options: ["Nothing else", "overflow: hidden and white-space: nowrap also set", "Only white-space: nowrap", "Only a fixed height"], correct: 1 },
    { q: "What's the difference between class and id attributes?", options: ["No difference", "class can repeat on many elements; id should be unique per page", "id is for styling only", "class is for JS only"], correct: 1 },
    { q: "What does <input type=\"checkbox\"> represent?", options: ["A single-line text field", "A toggle for a boolean/yes-no choice", "A dropdown", "A slider"], correct: 1 },
    { q: "What does flex-wrap: wrap allow?", options: ["Items to shrink only", "Items to move onto multiple lines instead of forcing one line", "Items to overlap", "Items to reverse order"], correct: 1 },
    { q: "What's the difference between em and rem units?", options: ["No difference", "em is relative to the current element's font-size; rem is relative to the root's", "rem only works on text", "em is a fixed pixel value"], correct: 1 },
    { q: "What does the CSS gap property do in a flex/grid container?", options: ["Adds a border", "Adds consistent spacing between items without extra margins", "Removes spacing", "Only works in tables"], correct: 1 },
    { q: "Why use a CSS reset/normalize stylesheet?", options: ["To speed up page load", "To remove/even out inconsistent default browser styling before building on top", "It's required by HTML5", "To add animations"], correct: 1 },
    { q: "What does :nth-child(2n) select?", options: ["Odd-numbered children", "Even-numbered children", "Only the 2nd child", "All children"], correct: 1 },
    { q: "How does position: relative differ from position: absolute?", options: ["They're identical", "relative shifts an element but keeps its original space; absolute removes it from flow entirely", "absolute can't use top/left", "relative removes the element from flow"], correct: 1 },
    { q: "What does clamp(1rem, 4vw, 2rem) do?", options: ["Always uses 4vw", "Uses 4vw but constrained between 1rem minimum and 2rem maximum", "Picks a random value", "Ignores the min/max"], correct: 1 },
    { q: "What's the purpose of <fieldset> and <legend> in a form?", options: ["Styling only, no semantic meaning", "Grouping related controls with an accessible caption", "Validating input", "Submitting the form"], correct: 1 },
    { q: "What does aspect-ratio: 16 / 9 do on an element?", options: ["Sets a fixed pixel size", "Maintains that width-to-height ratio as the element resizes", "Only affects images", "Rotates the element"], correct: 1 },
    { q: "Which display value flows inline with text but still respects width/height?", options: ["inline", "block", "inline-block", "flex"], correct: 2 },
    { q: "What's the advantage of :focus-visible over :focus?", options: ["No real difference", "It skips showing the focus ring for mouse clicks, showing it mainly for keyboard nav", "It only works on links", "It's faster to compute"], correct: 1 },
    { q: "What does the <picture> element let the browser do?", options: ["Add a caption automatically", "Choose the best image source based on screen size/format support", "Compress images automatically", "Nothing different from <img>"], correct: 1 },
    { q: "What does width: min(90%, 600px) do?", options: ["Always uses 600px", "Uses whichever of 90% or 600px is smaller", "Uses whichever is larger", "Invalid syntax"], correct: 1 },
    { q: "What's the difference between the async and defer script attributes?", options: ["They're identical", "async runs as soon as ready (order not guaranteed); defer runs after parsing, in order", "defer blocks parsing", "async only works with modules"], correct: 1 },
    { q: "What does li:not(:last-child) select?", options: ["Only the last li", "All li elements except the last one", "No elements", "Only the first li"], correct: 1 },
    { q: "What's the difference between width: 100% and max-width: 100% on a responsive image?", options: ["No difference", "width:100% always fills the container (can upscale); max-width:100% shrinks but never grows past natural size", "max-width breaks aspect ratio", "width:100% only works on divs"], correct: 1 },
    { q: "What does role=\"button\" on a <div> provide by itself?", options: ["Full button behavior including keyboard support", "Just the semantic announcement to assistive tech — keyboard support must be added manually", "Automatic styling as a button", "Form submission behavior"], correct: 1 },
    { q: "What does grid-auto-flow: column change?", options: ["Nothing", "Auto-placed items fill new columns instead of new rows", "Removes the grid", "Forces a single row"], correct: 1 },
    { q: "What does an <iframe> embed?", options: ["A copy of the current page's styles only", "An entirely separate document/browsing context inline in the page", "A CSS file", "A JavaScript module"], correct: 1 },
    { q: "What does :is(h1, h2, h3) do?", options: ["Selects only h1", "Matches any of h1, h2, or h3, shortening the selector list", "Requires all three to be present", "Is invalid CSS"], correct: 1 },
    { q: "What's the benefit of content-visibility: auto on long pages?", options: ["Hides content permanently", "Skips rendering work for off-screen content until it's about to be visible", "Improves SEO directly", "Disables scrolling"], correct: 1 },
    { q: "What does the CSS currentColor keyword reference?", options: ["Always black", "The element's own computed color value", "The page's background color", "A random color"], correct: 1 },
    { q: "What's the purpose of a table's <thead> and <tbody>?", options: ["Purely visual, no semantic value", "Semantically group header rows vs body rows for accessibility/styling", "Required for any table to render", "They control column width"], correct: 1 },
    { q: "What does the download attribute on an <a> tag do?", options: ["Opens the link in a new tab", "Downloads the linked resource instead of navigating to it", "Compresses the file", "Nothing without JavaScript"], correct: 1 },
    { q: "What does the :checked pseudo-class match?", options: ["Any input element", "A checked checkbox/radio or selected option", "A disabled input", "A required input"], correct: 1 },
    { q: "What's the key difference between vw units and percentage width?", options: ["No difference", "vw is relative to the viewport; percentage is relative to the containing block", "vw only works on text", "Percentage is always larger"], correct: 1 },
    { q: "What does the CSS order property change on a flex item?", options: ["Its size", "Its visual order among siblings, without changing the HTML", "Its color", "Its position attribute"], correct: 1 },
    { q: "What's the purpose of a 'skip to content' link?", options: ["SEO only", "Lets keyboard/screen-reader users bypass repeated navigation to reach main content", "Speeds up page load", "Required by HTML validators"], correct: 1 },
    { q: "What's the difference between <link> and <style> tags?", options: ["No difference", "<link> references an external stylesheet; <style> embeds CSS inline", "<style> can't be used in <head>", "<link> is JavaScript-only"], correct: 1 },
    { q: "What does background-size: contain do differently from cover?", options: ["Crops the image to fill", "Scales the image to fit entirely within the box, possibly leaving empty space", "Stretches the image, ignoring aspect ratio", "Tiles the image"], correct: 1 },
    { q: "What does the CSS outline property do differently from border?", options: ["Nothing, they're identical", "Outline doesn't affect layout/box size and can sit outside the border edge", "Outline is only for text", "Border can't be removed"], correct: 1 },
    { q: "What does overflow-wrap: break-word do?", options: ["Hides overflowing text", "Lets long unbreakable words break and wrap instead of overflowing", "Adds a scrollbar", "Justifies text"], correct: 1 },
    { q: "What does the controls attribute add to a <video> tag?", options: ["Nothing visible", "The browser's built-in play/pause/volume/seek UI", "Autoplay behavior", "Subtitles"], correct: 1 },
    { q: "What does text-transform: uppercase do to the underlying text content?", options: ["Permanently changes it to uppercase", "Nothing — it's a purely visual display change", "Deletes lowercase letters", "Only affects headings"], correct: 1 },
    { q: "What element does the :root pseudo-class target in a typical HTML document?", options: ["The <body> tag", "The <html> element", "The first child of body", "Nothing, it's invalid"], correct: 1 },
    { q: "What do <details> and <summary> provide without any JavaScript?", options: ["A native collapsible disclosure widget", "A tooltip", "A modal dialog", "A form validation message"], correct: 0 },
    { q: "How does position: fixed behave differently from position: absolute when the page scrolls?", options: ["They behave identically", "fixed stays pinned to the viewport; absolute scrolls with its positioned ancestor", "absolute stays pinned instead", "Neither can be affected by scrolling"], correct: 1 },
    { q: "What does the CSS will-change property do?", options: ["Immediately changes the property", "Hints to the browser that a property is about to change, for optimization", "Disables transitions", "Deletes an element"], correct: 1 },
    { q: "Why is heavy use of #id selectors for styling generally discouraged?", options: ["IDs don't work in CSS", "Their high specificity makes later overrides difficult", "IDs are deprecated in HTML5", "They only work with JavaScript"], correct: 1 },
    { q: "What does text-indent: 2em do?", options: ["Indents every line of a paragraph", "Indents only the first line of a text block", "Adds a 2em margin around the block", "Changes font size"], correct: 1 },
    { q: "What does pointer-events: none do to an element?", options: ["Hides it visually", "Makes it invisible to mouse/pointer interaction, so clicks pass through", "Disables scrolling", "Removes it from the DOM"], correct: 1 },
    { q: "What does the ::selection pseudo-element style?", options: ["A dropdown's options", "The appearance of user-highlighted/selected text", "A form's placeholder text", "Focused elements"], correct: 1 },
    { q: "What's the semantic difference between <em> and <i>?", options: ["No difference", "<em> conveys actual emphasis/stress; <i> is for an alternate voice/tone with no added emphasis", "<i> is deprecated", "<em> is only for headings"], correct: 1 },
    { q: "What does scroll-behavior: smooth do?", options: ["Disables scrolling", "Animates scrolling smoothly instead of jumping instantly", "Only affects touch devices", "Hides the scrollbar"], correct: 1 },
    { q: "What's the purpose of the srcset attribute on <img>?", options: ["Sets a fallback image only", "Lets the browser choose the best image source for the device's screen/resolution", "Required for all images", "Compresses the image"], correct: 1 },
    { q: "What does backdrop-filter: blur(10px) apply the effect to?", options: ["The element's own content", "Whatever is visually BEHIND the element", "The whole page", "Nothing without a background-image"], correct: 1 },
    { q: "What's a CSS 'containing block' used for?", options: ["Nothing meaningful", "Determining a positioned element's size/position percentages, usually its nearest positioned ancestor", "Only relevant to flexbox", "The browser's viewport only, always"], correct: 1 },
    { q: "What's the difference between justify-items and justify-content in CSS Grid?", options: ["No difference", "justify-items aligns items within their own cells; justify-content aligns the whole grid within the container", "justify-content only works in flexbox", "justify-items affects rows, not columns"], correct: 1 },
    { q: "What does the HTML hidden attribute do?", options: ["Makes text transparent", "Hides the element from rendering entirely, without CSS", "Only hides it from screen readers", "Removes it permanently from the page"], correct: 1 },
    { q: "When is the content inside <noscript> shown?", options: ["Always", "Only when JavaScript is disabled or unsupported", "Only on mobile", "Never, it's for documentation"], correct: 1 },
    { q: "What does place-items: center set in one declaration?", options: ["Only horizontal centering", "Both align-items and justify-items to center", "Only text-align", "Padding on all sides"], correct: 1 },
    { q: "What does 'mobile-first' responsive design mean?", options: ["Only building for mobile", "Writing base styles for small screens first, then adding complexity via min-width media queries", "Detecting device type with JavaScript", "Disabling desktop layouts"], correct: 1 },
    { q: "What's the difference between overflow: auto and overflow: scroll?", options: ["No difference", "auto shows scrollbars only if needed; scroll always shows them", "scroll is deprecated", "auto disables scrolling"], correct: 1 },
    { q: "What's the purpose of a <caption> inside a <table>?", options: ["Styling only", "Providing an accessible title/description announced before the table's content", "Setting column widths", "Required for sorting"], correct: 1 },
    { q: "What does vertical-align: middle actually affect?", options: ["All block-level elements", "Only inline, inline-block, or table-cell elements' alignment relative to their line/row", "Flex item alignment", "The whole page's vertical centering"], correct: 1 },
    { q: "How does an attribute selector's specificity compare to a class selector's?", options: ["Attribute selectors always win", "They're equal in specificity weight", "Class selectors always win", "Attribute selectors have no specificity"], correct: 1 },
    { q: "What's the difference between <q> and <blockquote>?", options: ["No difference", "<q> is for a short inline quotation; <blockquote> is for a longer block-level quoted section", "<blockquote> is deprecated", "<q> requires JavaScript"], correct: 1 },
    { q: "What does the CSS declaration all: unset do?", options: ["Deletes the element", "Resets every property to its inherited or initial value in one line", "Only resets colors", "Removes all event listeners"], correct: 1 },
    { q: "What does rel=\"noopener\" on a target=\"_blank\" link prevent?", options: ["The link from opening at all", "The new page from getting a reference back to the opening window", "Search engines from following it", "Right-click context menus"], correct: 1 },
    { q: "What does the CSS float property historically do?", options: ["Adds a shadow", "Takes an element out of normal flow and lets inline content wrap around it", "Centers an element", "Creates a grid"], correct: 1 },
    { q: "Why do rem/em units generally serve accessibility better than px for font-size?", options: ["They render faster", "They scale with the user's browser font-size/zoom preferences; px stays fixed", "px isn't supported in modern CSS", "rem is required by HTML5"], correct: 1 },
    { q: "What does <link rel=\"preload\"> do?", options: ["Blocks rendering until loaded", "Fetches a critical resource early so it's ready sooner when needed", "Prevents a resource from loading", "Only works for stylesheets"], correct: 1 },
    { q: "What's the difference between rel=\"preconnect\" and rel=\"preload\"?", options: ["No difference", "preconnect opens an early connection to a domain; preload fetches a specific resource", "preload only works for fonts", "preconnect fetches the whole page"], correct: 1 },
    { q: "What does object-position: top do when paired with object-fit: cover?", options: ["Crops from the bottom instead", "Anchors the visible crop toward the top of the image", "Has no effect without object-fit", "Rotates the image"], correct: 1 },
    { q: "What's the <canvas> element used for?", options: ["Vector graphics that stay inspectable in the DOM", "Imperative pixel-based drawing via JavaScript", "Embedding videos", "Styling forms"], correct: 1 },
    { q: "What's a key difference between <svg> and <canvas>?", options: ["No real difference", "SVG content is made of inspectable vector DOM elements; canvas is an immediate-mode pixel bitmap", "Canvas scales better than SVG", "SVG can't be animated"], correct: 1 },
    { q: "What does mix-blend-mode control?", options: ["Font weight blending", "How an element visually blends with content behind it", "Color contrast for accessibility", "Image compression"], correct: 1 },
    { q: "What's the point of the classic CSS sprite technique?", options: ["Improving SEO", "Combining many small images into one file to reduce HTTP requests", "Making images higher resolution", "Adding animation to images"], correct: 1 },
    { q: "What does the <time datetime=\"2024-01-01\"> element provide?", options: ["Nothing beyond plain text", "A machine-readable date alongside human-readable text", "Automatic timezone conversion", "A countdown timer"], correct: 1 },
    { q: "What does <abbr title=\"...\"> provide?", options: ["Bold styling", "A tooltip expansion for an abbreviation, useful for accessibility", "Automatic translation", "A link to a definition page"], correct: 1 },
    { q: "What's the difference between <sub> and <sup>?", options: ["No difference", "<sub> renders subscript; <sup> renders superscript", "<sup> is deprecated", "<sub> is only for math"], correct: 1 },
    { q: "What does box-shadow: inset 0 0 5px black do differently from a normal box-shadow?", options: ["Nothing different", "Draws the shadow inside the element instead of projecting outward", "Makes the shadow transparent", "Only works on borders"], correct: 1 },
    { q: "What's the core difference between a CSS transition and a CSS animation?", options: ["They're identical", "A transition animates between two states on a trigger; an animation uses @keyframes for multi-step sequences that can run independently", "Animations can't be triggered by hover", "Transitions require JavaScript"], correct: 1 },
    { q: "What does an @keyframes rule define?", options: ["A single color value", "A named sequence of style states at percentages of an animation's duration", "A media query breakpoint", "A font-face declaration"], correct: 1 },
    { q: "What does transform-origin control?", options: ["The element's final position", "The point around which transforms like rotate/scale are applied", "The animation's duration", "The element's z-index"], correct: 1 },
    { q: "Why might translate3d(x,y,0) perform better than translate(x,y) for an animation?", options: ["It's shorter to type", "It hints the browser to use GPU-accelerated compositing", "It's the only way to animate position", "translate() is deprecated"], correct: 1 },
    { q: "What does the <mark> tag semantically represent?", options: ["Bold text", "Text highlighted as relevant in the current context", "A footnote reference", "A broken link"], correct: 1 },
    { q: "What does <wbr> suggest to the browser?", options: ["A hard line break", "An optional break point inside a long word if needed", "A hidden element", "A horizontal rule"], correct: 1 },
    { q: "What does direction: rtl do to a page?", options: ["Rotates the page 180 degrees", "Flips text flow and default layout to right-to-left", "Reverses only image order", "Mirrors colors"], correct: 1 },
    { q: "What does <base href=\"https://example.com/\"> do?", options: ["Redirects the page immediately", "Sets the base URL that relative links/resources resolve against", "Only affects the <title>", "Loads an external stylesheet"], correct: 1 },
    { q: "What does scroll-snap-type: x mandatory do?", options: ["Disables scrolling", "Forces horizontal scroll to snap to defined stop points", "Only works vertically despite the name", "Adds scrollbar styling"], correct: 1 },
    { q: "What's an accessibility advantage of the native <progress> element over a custom CSS-only bar?", options: ["It looks identical everywhere", "It comes with built-in accessible semantics for assistive tech, no ARIA needed", "It's faster to render", "It supports more colors"], correct: 1 },
    { q: "What does appearance: none do to a <select> element?", options: ["Hides it completely", "Strips the browser's default native styling for full custom styling", "Disables it", "Converts it to a text input"], correct: 1 },
    { q: "What does filter: grayscale(100%) do?", options: ["Deletes color data permanently", "Renders the element fully grayscale, purely visually", "Only affects text color", "Requires a background-image"], correct: 1 },
    { q: "What's the purpose of the <base href=\"...\"> tag's target attribute, e.g. target=\"_blank\"?", options: ["Nothing, base has no target attribute", "Sets the default target (e.g. new tab) for every link on the page unless overridden", "Only affects forms", "Sets the page's title"], correct: 1 },
    { q: "What does the :target pseudo-class match?", options: ["The currently focused input", "The element whose id matches the URL's current fragment (#id)", "The last clicked element", "The page's <title>"], correct: 1 },
  ],
  qt: [
    { q: "Which Qt class must every Widgets app instantiate exactly once?", options: ["QWidget", "QApplication", "QMainWindow", "QObject"], correct: 1 },
    { q: "What starts the Qt event loop?", options: ["app.run()", "app.start()", "app.exec()", "app.loop()"], correct: 2 },
    { q: "Which layout arranges widgets top-to-bottom?", options: ["QHBoxLayout", "QVBoxLayout", "QGridLayout", "QStackedLayout"], correct: 1 },
    { q: "How do you connect a button's click to a function?", options: ["button.onClick(fn)", "button.clicked.connect(fn)", "button.bind('click', fn)", "connect(button, fn)"], correct: 1 },
    { q: "What does QMainWindow provide out of the box?", options: ["A menu bar/toolbar/status bar shell", "Automatic styling", "Built-in animations", "Networking"], correct: 0 },
    { q: "What is QSS most similar to?", options: ["JSON", "CSS", "XML", "SQL"], correct: 1 },
    { q: "Why use a QThread for long-running work?", options: ["It's required for any loop", "So the GUI doesn't freeze while it runs", "It makes the code shorter", "It's the only way to use signals"], correct: 1 },
    { q: "What is emitted when a widget's state changes, e.g. a checkbox toggling?", options: ["An event only, never a signal", "A signal", "An exception", "A slot"], correct: 1 },
    { q: "What connects a signal to code that should run in response?", options: ["A slot", "A layout", "A widget", "A stylesheet"], correct: 0 },
    { q: "Which call actually displays a widget after creating it?", options: [".render()", ".show()", ".display()", ".paint()"], correct: 1 },
    { q: "What is QDialog typically used for?", options: ["The app's main window shell", "Modal or secondary popup windows", "Styling widgets", "Storing settings"], correct: 1 },
    { q: "What's a QTimer good for?", options: ["Only measuring elapsed time", "Running code repeatedly or after a delay without blocking", "Blocking the thread until done", "Replacing QThread entirely"], correct: 1 },
    { q: "In the model/view pattern, what does the model hold?", options: ["Only widget styling", "The data, separate from how it's displayed", "The event loop", "The layout"], correct: 1 },
    { q: "How do you add a widget to a layout?", options: ["layout.append(widget)", "layout.addWidget(widget)", "layout.insert(widget)", "widget.addTo(layout)"], correct: 1 },
    { q: "How is a custom signal declared on a QObject subclass?", options: ["def signal(self): pass", "my_signal = Signal(int)", "A @signal decorator", "signals.append('my_signal')"], correct: 1 },
    { q: "What does QSettings persist across runs?", options: ["The event loop state", "Small app settings/preferences", "Widget pixel data", "Thread state"], correct: 1 },
    { q: "What object do you use to draw custom graphics in paintEvent?", options: ["QDrawer", "QPainter", "QCanvas", "QGraphics"], correct: 1 },
    { q: "What does a QAction let you share across a menu, toolbar, and shortcut?", options: ["A single widget instance", "One action definition (icon, text, trigger)", "A layout", "A stylesheet"], correct: 1 },
    { q: "Why shouldn't a worker thread update widgets directly?", options: ["It's slower", "Qt widget code isn't thread-safe and can crash/corrupt the UI", "It's disallowed by Python itself", "It uses more memory"], correct: 1 },
    { q: "What Python bindings for Qt does this track teach?", options: ["PyQt6", "PySide6", "Qt for Python 5 only", "Tkinter"], correct: 1 },
    { q: "What's the purpose of self.setLayout(layout) on a widget?", options: ["Deletes the layout", "Assigns that layout to manage the widget's children", "Creates a new widget", "Starts the event loop"], correct: 1 },
    { q: "What does QLabel display?", options: ["Only images", "Text and/or images", "Only buttons", "Only input fields"], correct: 1 },
    { q: "What's required for a class to emit custom Qt signals?", options: ["It must subclass QObject (or a QObject-derived class)", "It must be a plain Python class", "It must import QApplication", "Nothing special is required"], correct: 0 },
    { q: "What does QLineEdit provide?", options: ["A single-line text input widget", "A multi-line text area", "A dropdown list", "A checkbox"], correct: 0 },
    { q: "What's the purpose of QVBoxLayout's addStretch()?", options: ["Adds a widget", "Adds flexible empty space that expands to fill room", "Removes a widget", "Resizes the window"], correct: 1 },
    { q: "What does connecting a signal with a lambda let you do?", options: ["Nothing extra", "Pass extra arguments or adapt the signal's args to the slot's needs", "Disconnect automatically", "Avoid using slots entirely"], correct: 1 },
    { q: "What's QComboBox used for?", options: ["A dropdown selection widget", "A slider", "A progress bar", "A text label"], correct: 0 },
    { q: "What does widget.setEnabled(False) do?", options: ["Hides the widget", "Greys it out and disables user interaction with it", "Deletes the widget", "Makes it always on top"], correct: 1 },
    { q: "What's the purpose of QStackedWidget?", options: ["Shows multiple widgets at once", "Shows one widget from a stack at a time, switching between 'pages'", "Stacks buttons vertically only", "A type of layout only"], correct: 1 },
    { q: "What does event.accept() typically do in an event handler?", options: ["Rejects the event", "Marks the event as handled so it doesn't propagate further", "Deletes the widget", "Restarts the app"], correct: 1 },
    { q: "What's the purpose of a spacer item in a layout?", options: ["Adds a visible border", "Adds empty adjustable space between widgets", "Adds a scrollbar", "Adds a new window"], correct: 1 },
    { q: "What does QIcon represent?", options: ["A window", "An image used for buttons, actions, and window icons", "A font", "A color palette"], correct: 1 },
    { q: "What's the difference between .show() and .exec() on a QDialog?", options: ["No difference", "show() is non-modal (non-blocking); exec() is modal (blocks until closed)", "exec() is non-blocking", "show() blocks the app"], correct: 1 },
    { q: "What does self.close() do on a QMainWindow?", options: ["Minimizes it", "Closes the window (triggering closeEvent)", "Deletes the whole app", "Pauses the event loop"], correct: 1 },
    { q: "What's QScrollArea for?", options: ["Making any widget scrollable if its content is too large", "Adding a scrollbar to text only", "Only used with tables", "Zooming the window"], correct: 0 },
    { q: "What does layout.setSpacing(10) control?", options: ["Widget size", "The pixel gap between widgets in the layout", "Window size", "Font size"], correct: 1 },
    { q: "What's the purpose of validator classes like QIntValidator?", options: ["Restricting what a user can type into an input field", "Validating network requests", "Compiling code", "Styling widgets"], correct: 0 },
    { q: "What does app.quit() do?", options: ["Pauses the event loop", "Cleanly ends the event loop and exits the application", "Closes only the current window", "Restarts the app"], correct: 1 },
    { q: "What's the purpose of a QGridLayout?", options: ["Arranges widgets in a single row", "Arranges widgets in a table-like grid of rows and columns", "Only for images", "A type of QDialog"], correct: 1 },
    { q: "What does parent=self in a widget's constructor typically establish?", options: ["Nothing meaningful", "Ownership/parenting, so Qt manages the child widget's lifetime and placement", "Only affects color", "Makes it a top-level window"], correct: 1 },
    { q: "What does layout.removeWidget(w) do by itself?", options: ["Deletes the widget entirely", "Removes it from layout management but doesn't delete or hide it", "Hides the widget", "Nothing, it's invalid"], correct: 1 },
    { q: "What's QToolBar typically used for?", options: ["A status message area", "A dockable bar of quick-access actions/buttons", "A popup dialog", "A layout type"], correct: 1 },
    { q: "What does self.centralWidget() return on a QMainWindow?", options: ["The menu bar", "The single widget currently set as the main content area", "A list of all widgets", "The window title"], correct: 1 },
    { q: "What happens to child widgets when their parent widget is deleted?", options: ["They remain and must be manually deleted", "Qt automatically deletes them too via the ownership model", "The app crashes", "They become top-level windows"], correct: 1 },
    { q: "What does QPushButton.setDefault(True) affect in a dialog?", options: ["Its color", "Makes it the button triggered by pressing Enter", "Disables it", "Makes it hidden by default"], correct: 1 },
    { q: "What's the difference between QDialog.exec() and QDialog.open()?", options: ["No difference", "exec() blocks until closed; open() shows modally without blocking, using a signal for the result", "open() is deprecated", "exec() never returns a result"], correct: 1 },
    { q: "What does QObject.blockSignals(True) do?", options: ["Deletes all signal connections", "Temporarily stops that object from emitting any signals", "Pauses the event loop", "Disconnects all slots"], correct: 1 },
    { q: "What's a QSplitter used for?", options: ["Splitting text strings", "Letting the user drag a divider to resize adjacent widgets", "Dividing the app into processes", "A type of dialog"], correct: 1 },
    { q: "What's the main difference between QAbstractListModel and QStandardItemModel?", options: ["They're identical", "QAbstractListModel is a base you subclass for custom data; QStandardItemModel is ready-made and populated directly", "QStandardItemModel requires no data", "QAbstractListModel is for images only"], correct: 1 },
    { q: "What does Qt.QueuedConnection force a connected slot to do?", options: ["Run immediately and synchronously", "Run asynchronously via the event loop, useful across threads", "Never run", "Run twice"], correct: 1 },
    { q: "What does QSizePolicy describe?", options: ["A widget's color scheme", "How a widget should grow/shrink relative to siblings when space changes", "The window's icon", "A layout's spacing"], correct: 1 },
    { q: "What can prevent self.close() from actually closing a widget?", options: ["Nothing can prevent it", "Overriding closeEvent() and calling event.ignore()", "Setting a window title", "Disabling the widget"], correct: 1 },
    { q: "What's QVariant conceptually used for in Qt?", options: ["Formatting text", "A generic container that can hold nearly any type, used where APIs must be type-agnostic", "A special widget", "An error type"], correct: 1 },
    { q: "What does a widget's minimumSize guarantee, unlike sizeHint?", options: ["Nothing, they're the same", "It's a hard floor the widget won't shrink below; sizeHint is just a suggestion", "It fixes the widget's exact size", "It only applies to windows"], correct: 1 },
    { q: "What's the benefit of a worker-QObject + moveToThread pattern over subclassing QThread?", options: ["No real benefit", "Recommended pattern that cleanly separates thread management from work logic via signals/slots", "It's faster", "It avoids needing signals"], correct: 1 },
    { q: "What does self.adjustSize() do?", options: ["Locks the widget's size", "Resizes the widget to fit its current contents/sizeHint", "Centers the widget on screen", "Hides the widget"], correct: 1 },
    { q: "What's QShortcut used for?", options: ["Styling widgets", "Binding a keyboard shortcut to trigger a slot, independent of menus/toolbars", "Creating custom widgets", "Managing threads"], correct: 1 },
    { q: "What does widget.setToolTip('text') do?", options: ["Sets the window title", "Shows a popup with that text on hover", "Changes the widget's label permanently", "Disables the widget"], correct: 1 },
    { q: "When does the QApplication.aboutToQuit signal fire?", options: ["When the app starts", "Right before the application actually exits", "On every window resize", "When a widget is clicked"], correct: 1 },
    { q: "What's the purpose of Qt Designer .ui files?", options: ["Storing application data", "Visually building layouts/widget hierarchies, saved as XML for loading or compiling", "Running unit tests", "Configuring the build system"], correct: 1 },
    { q: "What does self.setFocus() do?", options: ["Hides other widgets", "Gives that widget keyboard input focus", "Closes the window", "Resizes the widget"], correct: 1 },
    { q: "How does a QML/Qt Quick app typically differ from a QWidget app?", options: ["No real difference", "QML is declared in a JS-like markup, often suited to fluid/animated UIs; QWidget apps are built imperatively", "QML can't use Python at all", "QWidget apps can't be resized"], correct: 1 },
    { q: "What's the difference between setMinimumSize and setFixedSize?", options: ["They're the same", "setMinimumSize sets a floor but allows growth; setFixedSize locks an exact size", "setFixedSize only affects width", "setMinimumSize disables resizing"], correct: 1 },
    { q: "What does QCheckBox.stateChanged emit?", options: ["Nothing useful", "A signal carrying the new check state when toggled", "An exception", "A slot"], correct: 1 },
    { q: "What's the effect of deleteLater() compared to directly deleting a QObject?", options: ["Identical, immediate deletion", "Safely schedules deletion for when control returns to the event loop, avoiding use-after-free crashes", "It never actually deletes the object", "It only works on widgets, not QObjects"], correct: 1 },
    { q: "What does QApplication.setStyle('Fusion') change?", options: ["The app's icon", "The widget rendering style, overriding the OS's native default look", "The event loop", "The window size"], correct: 1 },
    { q: "What's the purpose of a QGroupBox?", options: ["Running background tasks", "Visually grouping related widgets under a titled frame", "Storing settings", "A type of dialog"], correct: 1 },
    { q: "What does QButtonGroup manage?", options: ["Button colors", "Ensures only one radio button/checkbox in the group is checked, and tracks which", "Button click sounds", "Button layout spacing"], correct: 1 },
    { q: "What does self.raise_() do to a widget?", options: ["Increases its size", "Raises it to the top of the stacking order among overlapping siblings", "Moves it to a new window", "Enables it"], correct: 1 },
    { q: "What's the risk of updating a widget directly from a worker thread?", options: ["No risk, it's fully supported", "Qt widget code isn't thread-safe and can crash or corrupt the UI", "It's just slower, nothing else", "It only affects QLabel"], correct: 1 },
    { q: "How does QRadioButton behavior differ from QCheckBox in the same parent?", options: ["No difference", "Radio buttons in the same parent are mutually exclusive; checkboxes are independent", "Checkboxes are mutually exclusive instead", "Radio buttons can't be unchecked"], correct: 1 },
    { q: "What's QProgressBar used for?", options: ["Selecting a value", "Visually showing completion percentage of a task", "Displaying an image", "Navigation between pages"], correct: 1 },
    { q: "What's QSlider used for?", options: ["Displaying static text", "Letting the user pick a numeric value by dragging a handle", "Playing audio", "Grouping widgets"], correct: 1 },
    { q: "Can multiple slots be connected to a single signal?", options: ["No, only one", "Yes, all connected slots run when the signal is emitted", "Only in PyQt, not PySide", "Only for built-in signals"], correct: 1 },
    { q: "How do you disconnect a specific slot from a signal?", options: ["Set the signal to None", "Call .disconnect(slot) on the signal", "Delete the QObject", "It disconnects automatically after one emit"], correct: 1 },
    { q: "What does self.menuBar() give you access to on a QMainWindow?", options: ["The status bar", "The window's menu bar for adding top-level menus", "The central widget", "The toolbar"], correct: 1 },
    { q: "What does setWindowModality control?", options: ["The window's color", "Whether/how the window blocks interaction with other windows", "The window's size", "The window's icon"], correct: 1 },
    { q: "What's the key difference between self.hide() and self.close()?", options: ["No difference", "hide() just makes it invisible; close() may trigger closeEvent and can end the app if it's the last window", "close() only hides child widgets", "hide() deletes the widget"], correct: 1 },
    { q: "What does app.exec()'s return value typically represent?", options: ["The number of open windows", "The application's exit code", "Elapsed runtime", "Nothing, it never returns"], correct: 1 },
    { q: "What does widget.parent() return if the widget has no parent?", options: ["An error", "None", "The QApplication instance", "Itself"], correct: 1 },
    { q: "What does self.isVisible() tell you?", options: ["If the widget has been created", "Whether the widget is currently shown on screen", "If the widget is enabled", "If the widget has focus"], correct: 1 },
    { q: "What's QTabWidget used for?", options: ["A single-page layout", "Organizing multiple widgets/pages behind clickable tabs", "A type of button", "A dialog with a title bar only"], correct: 1 },
    { q: "What's a QDockWidget for?", options: ["A fixed, undockable panel", "A panel that can be docked, floated, or closed, common for tool palettes", "A type of chart", "A modal dialog"], correct: 1 },
    { q: "How do QSS selectors target one specific widget instance, e.g. QPushButton#saveBtn?", options: ["By its class only", "By matching its objectName, similar to a CSS ID selector", "By its text content", "By its position in the layout"], correct: 1 },
    { q: "What's the main difference between QLabel and QLineEdit?", options: ["They're interchangeable", "QLabel is static/non-editable; QLineEdit is an editable single-line input", "QLineEdit can't display text", "QLabel accepts user input"], correct: 1 },
    { q: "What does a QDialog's finished signal carry when opened via .open()?", options: ["Nothing", "The dialog's result code", "The dialog's title", "A reference to the parent window"], correct: 1 },
    { q: "Why nest a QHBoxLayout inside a QVBoxLayout?", options: ["It's not allowed", "To build 2D arrangements, since each box layout only manages one axis", "To make widgets bigger", "It's required for any layout"], correct: 1 },
    { q: "What's the difference between calling setStyleSheet on a single widget vs on QApplication?", options: ["No difference", "A widget's stylesheet styles just it (and children); QApplication's applies app-wide", "QApplication's stylesheet is ignored", "Widget stylesheets override QApplication always regardless of selectors"], correct: 1 },
    { q: "What do rowCount() and columnCount() tell a view when subclassing QAbstractItemModel?", options: ["The widget's pixel size", "How much data exists, so the view knows how much to render/scroll", "The window title", "Nothing important"], correct: 1 },
    { q: "What's QMenu typically used for?", options: ["A single button", "A dropdown list of selectable actions, e.g. under a menu bar item or right-click context menu", "A progress indicator", "A text input"], correct: 1 },
    { q: "What does overriding keyPressEvent on a widget let you do?", options: ["Change its color", "React to specific key presses while that widget has focus", "Disable the widget", "Resize the window"], correct: 1 },
    { q: "How do you add a new row to a QListWidget?", options: ["list_widget.append(text)", "list_widget.addItem(text)", "list_widget.push(text)", "list_widget.insert(text)"], correct: 1 },
    { q: "What happens if you call self.show() but never call app.exec()?", options: ["The window displays normally and stays responsive", "The window may flash or not process events properly since the event loop never runs", "Nothing, show() starts its own loop", "An exception is raised immediately"], correct: 1 },
    { q: "What's QPalette used for?", options: ["Choosing fonts", "Defining the set of colors a widget/app uses for different roles (background, text, etc.)", "Managing layouts", "Storing settings"], correct: 1 },
    { q: "What does combo_box.currentText() return?", options: ["The index of the selected item", "The text of the currently selected item", "All items as a list", "The widget's object name"], correct: 1 },
    { q: "What's the common base class shared by QPushButton, QCheckBox, and QRadioButton?", options: ["QWidget only", "QAbstractButton", "QLabel", "QFrame"], correct: 1 },
    { q: "Why call thread.start() instead of calling a QThread's run() method directly?", options: ["They're identical", "start() actually launches a new thread; calling run() directly just executes it on the current thread", "run() doesn't exist by default", "start() is deprecated"], correct: 1 },
    { q: "What does calling self.update() on a widget do?", options: ["Immediately redraws it", "Schedules a repaint (paintEvent) for the near future", "Changes its data model", "Resizes it"], correct: 1 },
    { q: "What's the relationship between QApplication and QCoreApplication?", options: ["Unrelated classes", "QApplication extends QCoreApplication, adding GUI-specific functionality", "QCoreApplication is only for widgets", "They're the same class"], correct: 1 },
    { q: "What does 'promoting a widget' in Qt Designer let you do?", options: ["Make it larger", "Use a custom subclass in place of the plain widget placed in the .ui file", "Delete the widget", "Change its z-order only"], correct: 1 },
    { q: "What's the relationship between QMenuBar and QMenu?", options: ["They're the same class", "QMenuBar holds top-level menu titles; each QMenu is the dropdown shown under one", "QMenu is the bar; QMenuBar is the dropdown", "QMenuBar only works in dialogs"], correct: 1 },
    { q: "What does connecting to customContextMenuRequested let you build?", options: ["A toolbar", "A custom right-click context menu at the clicked position", "A status bar message", "A tooltip"], correct: 1 },
    { q: "What's a QKeySequence used for?", options: ["Encrypting data", "Representing a keyboard shortcut like Ctrl+S", "Storing a list of widgets", "A type of animation"], correct: 1 },
    { q: "What does QApplication.clipboard() give access to?", options: ["The undo stack", "The system clipboard for reading/writing copied data", "A settings file", "The event loop"], correct: 1 },
    { q: "What object starts a drag-and-drop operation in Qt?", options: ["QDropEvent", "QDrag, given a QMimeData payload", "QClipboard", "QAction"], correct: 1 },
    { q: "What does QMimeData package during a drag-and-drop operation?", options: ["The widget's stylesheet", "The actual data being transferred, like text or URLs", "The window's icon", "Nothing, it's just a marker"], correct: 1 },
    { q: "What's QSystemTrayIcon used for?", options: ["A widget inside the main window", "Showing an icon in the OS system tray/notification area", "A type of dialog", "A progress indicator"], correct: 1 },
    { q: "What does a QFont object represent?", options: ["A color scheme", "A font family, size, weight, and style for text", "A layout type", "An image format"], correct: 1 },
    { q: "What's QFontMetrics used for?", options: ["Changing font color", "Measuring pixel width/height of text for a given font", "Loading custom fonts from disk", "Setting the app's default font"], correct: 1 },
    { q: "In custom painting, what's the difference between QPen and QBrush?", options: ["They're interchangeable", "QPen controls outlines/strokes; QBrush controls fills", "QBrush is for text only", "QPen is deprecated"], correct: 1 },
    { q: "What does a QRect represent?", options: ["A single point", "A rectangle defined by position and size", "A color gradient", "A widget's parent"], correct: 1 },
    { q: "What's the purpose of overriding eventFilter on an object?", options: ["Styling that object only", "Intercepting events meant for another object after installing yourself as its filter", "Blocking all signals", "Deleting the object safely"], correct: 1 },
    { q: "What's QSpinBox used for?", options: ["Selecting a color", "Letting the user pick an integer via typing or up/down arrows", "Displaying a progress percentage", "Picking a date"], correct: 1 },
    { q: "What's QCalendarWidget used for?", options: ["Scheduling background tasks", "Displaying an interactive calendar grid for date selection", "Formatting timestamps", "Setting a QTimer interval"], correct: 1 },
    { q: "How does a QToolButton typically differ from a QPushButton?", options: ["No real difference", "It's designed for compact, often icon-only, toolbar use tied to a QAction", "QToolButton can't be clicked", "QPushButton is always larger"], correct: 1 },
    { q: "What's QWizard used for?", options: ["A single popup alert", "A multi-step guided dialog flow with Back/Next/Finish navigation", "A type of layout", "A custom widget style"], correct: 1 },
    { q: "What do QUndoStack and QUndoCommand provide together?", options: ["Multithreading support", "A ready-made undo/redo system for tracking reversible actions", "Network requests", "Custom painting"], correct: 1 },
    { q: "What's QNetworkAccessManager used for?", options: ["Managing local files", "Making HTTP requests and handling responses asynchronously via signals", "Managing widget layouts", "Database connections"], correct: 1 },
    { q: "What's QSqlDatabase part of?", options: ["The painting system", "Qt's SQL module, for managing a database connection", "The undo/redo framework", "The threading module"], correct: 1 },
    { q: "What's the QTest module used for?", options: ["Styling widgets", "Writing automated tests, including simulated widget interactions", "Networking", "Packaging the app"], correct: 1 },
    { q: "What does PyInstaller do for a PySide6 app?", options: ["Compiles it to C++", "Packages it and its dependencies into a standalone executable", "Runs its unit tests", "Formats its code"], correct: 1 },
    { q: "What do QThreadPool and QRunnable let you do?", options: ["Create one thread per widget", "Run many short tasks across a managed pool of reusable threads", "Replace signals and slots", "Disable multithreading"], correct: 1 },
    { q: "What's the main difference between QAbstractTableModel and QAbstractListModel?", options: ["No difference", "TableModel exposes a full 2D grid; ListModel exposes a single 1D list", "ListModel is for images only", "TableModel can't be subclassed"], correct: 1 },
    { q: "What does app.clipboard().setText('hi') do?", options: ["Types 'hi' into the focused widget", "Sets the system clipboard's text content to 'hi'", "Displays a tooltip saying 'hi'", "Nothing without a signal connection"], correct: 1 },
    { q: "What's a typical reason to use QColor over a plain string like '#ff0000' in Qt code?", options: ["Strings don't work at all in Qt", "QColor provides structured methods (lighter(), alpha channel, etc.) beyond a raw string", "QColor is required for QSS", "There's no difference"], correct: 1 },
  ],
  career: [
    { q: "What does the 'R' in STAR stand for?", options: ["Reason", "Result", "Requirement", "Recommendation"], correct: 1 },
    { q: "What's the average time complexity of a hash map lookup?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correct: 2 },
    { q: "What's the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correct: 1 },
    { q: "What does git merge do that git rebase doesn't?", options: ["Rewrites commit history", "Preserves both branch histories with a merge commit", "Deletes the feature branch", "Requires a remote"], correct: 1 },
    { q: "What's the main purpose of a project README?", options: ["List all dependencies only", "Explain what it does and how to run it, fast", "Store license text only", "Replace documentation entirely"], correct: 1 },
    { q: "Which exposes one endpoint the client can shape queries against?", options: ["REST", "GraphQL", "Both equally", "Neither"], correct: 1 },
    { q: "What does authentication answer?", options: ["What are you allowed to do", "Who are you", "What did you do", "Where are you"], correct: 1 },
    { q: "What does authorization answer?", options: ["Who are you", "What are you allowed to do", "When did you log in", "How fast is the request"], correct: 1 },
    { q: "What does CI/CD automate?", options: ["Only deployment", "Only testing", "Testing and often deployment on every change", "Writing code"], correct: 2 },
    { q: "What's a defining trait of SQL databases vs NoSQL?", options: ["No schema at all", "Fixed tables/schemas with relational joins", "No support for queries", "Always faster"], correct: 1 },
    { q: "Why keep secrets in a .env file instead of source code?", options: ["It's faster to load", "So secrets aren't committed to version control", "It's required by Python", "It improves performance"], correct: 1 },
    { q: "What does 'idempotent' mean for an endpoint?", options: ["It always returns the same data", "Calling it repeatedly has the same effect as once", "It never fails", "It requires authentication"], correct: 1 },
    { q: "What's a strong way to discuss a weakness in an interview?", options: ["Claim you have none", "Name a real one and show active improvement", "Blame a past team", "Deflect to a strength only"], correct: 1 },
    { q: "What distinguishes a regression from a bug?", options: ["Regressions are always security issues", "A regression used to work and broke after a change", "Bugs are always regressions", "There's no difference"], correct: 1 },
    { q: "What's a benefit of writing tests alongside a feature?", options: ["It slows delivery with no benefit", "It catches breakage early and documents behavior", "It replaces code review", "It guarantees zero bugs"], correct: 1 },
    { q: "What's a monorepo?", options: ["A repo with only one file", "Multiple projects managed together in one repository", "A backup repository", "A repo with no history"], correct: 1 },
    { q: "What's a common, avoidable reason take-homes get rejected?", options: ["Using the 'wrong' language", "It doesn't run for the reviewer (setup/README issues)", "Using too many comments", "Being too short"], correct: 1 },
    { q: "Why pin exact dependency versions?", options: ["It's required by npm", "Reproducible builds across machines/CI/production", "It makes installs faster", "It's only for security patches"], correct: 1 },
    { q: "What's a common structure for a first full-stack portfolio project?", options: ["A static HTML page only", "A CRUD app with real authentication and a database", "A CLI script", "A design mockup"], correct: 1 },
    { q: "What's the point of a code review before merging?", options: ["Slowing down releases", "Catching issues early and spreading team knowledge", "Blocking junior devs", "Replacing tests"], correct: 1 },
    { q: "What's the purpose of a cover letter beyond the resume?", options: ["Repeats the resume verbatim", "Explains motivation/fit and connects your experience to this specific role", "Lists your salary requirements only", "Nothing, it's not read"], correct: 1 },
    { q: "What does 'shipping' typically mean on a dev team?", options: ["Writing code that never gets used", "Releasing a feature/change to real users", "Packaging software into a box", "Only used for hardware"], correct: 1 },
    { q: "What's a common purpose of a linter in a project?", options: ["Running tests", "Catching style issues and common bugs automatically before review", "Deploying code", "Compiling code"], correct: 1 },
    { q: "What does 'technical debt' refer to?", options: ["Money owed for software licenses", "Shortcuts/quick fixes that make future changes harder or riskier", "A type of bug only", "Unused dependencies"], correct: 1 },
    { q: "What's the main point of pair programming?", options: ["Splitting work in half to go faster", "Two people working on the same code together for shared understanding and fewer mistakes", "Only for onboarding", "Replacing code review"], correct: 1 },
    { q: "What's a 'smoke test'?", options: ["A full test suite", "A quick check that the basic, critical functionality works at all", "A test for memory leaks only", "A load test"], correct: 1 },
    { q: "What does 'scope creep' mean on a project?", options: ["The project finishing early", "The requirements quietly expanding beyond the original plan", "A security vulnerability", "A type of database"], correct: 1 },
    { q: "What's the point of semantic versioning (e.g. 2.4.1)?", options: ["Random numbering", "Communicating the type of change (major.minor.patch) so consumers know what to expect", "Tracking file size", "Naming convention only, no meaning"], correct: 1 },
    { q: "What's a 'blocker' in project/ticket terminology?", options: ["A minor nice-to-have", "Something that prevents further progress until it's resolved", "A finished task", "A type of test"], correct: 1 },
    { q: "What does 'on-call' mean for an engineer?", options: ["Working extra unpaid hours always", "Being responsible for responding to production incidents during a set period", "Attending meetings only", "A junior-only responsibility"], correct: 1 },
    { q: "What's the purpose of a staging environment?", options: ["It's the same as production", "A production-like environment for testing changes before they go live", "Only for local development", "A backup server only"], correct: 1 },
    { q: "What does 'refactoring' mean?", options: ["Adding new features", "Restructuring existing code without changing its external behavior", "Deleting all code", "Rewriting from scratch always"], correct: 1 },
    { q: "What's a common reason to squash commits before merging?", options: ["It's required by git", "To present a clean, single logical change instead of noisy WIP commits", "It deletes the branch", "It speeds up CI always"], correct: 1 },
    { q: "What does 'MVP' stand for in a product/dev context?", options: ["Most Valuable Player", "Minimum Viable Product — the smallest version that delivers real value", "Multi-Version Protocol", "Managed Virtual Platform"], correct: 1 },
    { q: "What's the point of writing commit messages well?", options: ["No real point, just convention", "Future readers (including you) can understand why a change was made, not just what", "Required by GitHub", "Only affects blame speed"], correct: 1 },
    { q: "What does a 'flaky test' mean?", options: ["A test that always fails", "A test that passes/fails inconsistently without code changes, undermining trust in CI", "A slow test", "A deleted test"], correct: 1 },
    { q: "What's a reasonable structure for salary negotiation?", options: ["Never negotiate, just accept", "Research first, let them name a number if possible, and justify your ask with data", "Always demand the highest number immediately", "Only negotiate after accepting"], correct: 1 },
    { q: "What's the point of a 1:1 meeting with a manager?", options: ["Team status updates only", "Regular dedicated time for individual feedback, blockers, and career discussion", "Performance review only, once a year", "Only for new hires"], correct: 1 },
    { q: "What does 'dogfooding' mean?", options: ["Testing on animals", "Using your own product internally before/while shipping it to customers", "A type of code review", "A deployment strategy"], correct: 1 },
    { q: "What's a reasonable first response to critical code review feedback?", options: ["Argue immediately", "Read it fully, ask clarifying questions if needed, and address the substance", "Ignore it if you disagree", "Escalate to a manager immediately"], correct: 1 },
    { q: "What's the main point of a live coding interview beyond the final answer?", options: ["Only the correct output matters", "Showing how you think — clarifying requirements, tradeoffs, and handling being stuck", "Typing speed", "Memorized syntax"], correct: 1 },
    { q: "What's the typical time complexity of a good comparison sort like merge sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], correct: 1 },
    { q: "For random access to an arbitrary element, which is faster: an array or a linked list?", options: ["Linked list, always O(1)", "Array, O(1) index access vs O(n) traversal for a linked list", "They're equal", "Neither supports random access"], correct: 1 },
    { q: "What does 'DRY' stand for?", options: ["Do Repeat Yourself", "Don't Repeat Yourself", "Define, Run, Yield", "Deploy Rapidly, Yearly"], correct: 1 },
    { q: "What's the key difference between a unit test and an integration test?", options: ["No difference", "A unit test isolates one small piece; an integration test checks multiple real pieces together", "Integration tests are always faster", "Unit tests can't use assertions"], correct: 1 },
    { q: "What is a 'sprint' in Scrum?", options: ["An unplanned emergency fix", "A fixed, short time period for completing a committed set of work", "The final release", "A daily standup meeting"], correct: 1 },
    { q: "What does a project 'backlog' contain?", options: ["Only completed work", "The prioritized list of not-yet-started work", "Bug reports only", "Meeting notes"], correct: 1 },
    { q: "What's the purpose of a .gitignore file?", options: ["Lists required dependencies", "Tells git which files/folders to never track", "Stores commit messages", "Configures CI/CD"], correct: 1 },
    { q: "What's a 'single point of failure' in system design?", options: ["A well-tested component", "One component whose failure would bring down the whole system", "A redundant backup server", "A load balancer"], correct: 1 },
    { q: "What's the main benefit of containerization (e.g. Docker) for deployment?", options: ["Makes code run faster", "Packages an app with its exact environment so it runs identically everywhere", "Replaces the need for testing", "Only useful for databases"], correct: 1 },
    { q: "What's the difference between latency and throughput?", options: ["They're the same metric", "Latency is time per operation; throughput is operations completed per unit time", "Throughput measures errors", "Latency only applies to databases"], correct: 1 },
    { q: "What's a 'feature flag' used for?", options: ["Marking deprecated code", "Turning a feature on/off without a new deploy, enabling safer rollouts", "Naming a git branch", "Flagging a security vulnerability"], correct: 1 },
    { q: "What's the 'N+1 query problem'?", options: ["Running exactly N+1 total queries efficiently", "Running one query for a list plus one more per item instead of a single batch/join", "A database connection limit", "A caching strategy"], correct: 1 },
    { q: "What does an API rate limit protect against?", options: ["Slow internet connections", "A client overwhelming the service with too many requests", "SQL injection", "Expired credentials"], correct: 1 },
    { q: "What does 'eventual consistency' mean in a distributed system?", options: ["Data is never consistent", "Nodes may briefly disagree after an update but converge to the same state over time", "All nodes update instantly and always agree", "Only applies to SQL databases"], correct: 1 },
    { q: "What's the purpose of a blameless postmortem after an incident?", options: ["Identifying who to blame", "Documenting what happened and what will change, focused on the system not individuals", "Filing a legal report", "Only for security breaches"], correct: 1 },
    { q: "What does 'YAGNI' mean?", options: ["You Always Get New Ideas", "You Aren't Gonna Need It — avoid building speculative features", "Yield And Get Notified Immediately", "A testing framework"], correct: 1 },
    { q: "What's 'observability' in a production system?", options: ["Watching the CI dashboard", "Being able to understand internal state from logs, metrics, and traces", "Code review coverage", "UI test coverage"], correct: 1 },
    { q: "What's a 'hotfix'?", options: ["A regularly scheduled release", "An urgent, narrowly-scoped fix pushed outside the normal release cycle", "A performance optimization", "A new feature branch"], correct: 1 },
    { q: "What does 'rollback' mean after a bad deploy?", options: ["Adding more servers", "Reverting to the previous known-good version quickly", "Rewriting the feature from scratch", "Notifying customers only"], correct: 1 },
    { q: "What's a benefit of small, frequent pull requests over large ones?", options: ["They take longer to review", "Easier/faster to review thoroughly and less likely to conflict", "They skip code review", "They're harder to test"], correct: 1 },
    { q: "Who counts as a 'stakeholder' in a project?", options: ["Only the engineering team", "Anyone with an interest in or influence over the project's outcome", "Only paying customers", "Only company executives"], correct: 1 },
    { q: "What's a sound way to estimate task duration?", options: ["Always guess a round number", "Break it into known pieces and compare to similar past work, accounting for unknowns", "Always double whatever feels right", "Ask for infinite time"], correct: 1 },
    { q: "What does 'bikeshedding' describe?", options: ["Efficient decision-making", "Spending disproportionate time on a trivial detail while ignoring harder decisions", "Building a prototype quickly", "A type of code smell"], correct: 1 },
    { q: "What's a stronger resume bullet: listing duties, or describing impact/results?", options: ["Duties, since they show responsibility", "Impact/results, since they answer 'so what?' with concrete outcomes", "Neither matters", "Only certifications matter"], correct: 1 },
    { q: "What does 'p99 latency' represent?", options: ["The average response time", "The response time that 99% of requests are faster than", "The slowest possible response", "A 99% uptime guarantee"], correct: 1 },
    { q: "What's the purpose of a runbook?", options: ["A code style guide", "Step-by-step documented instructions for handling a known operational task/incident", "A list of team members", "A sprint retrospective template"], correct: 1 },
    { q: "Why restate an interview question in your own words before answering?", options: ["To waste time", "To confirm you understood it correctly before solving it, catching misunderstandings early", "It's required by convention only", "To sound more confident"], correct: 1 },
    { q: "What does 'graceful degradation' mean for a feature?", options: ["The feature crashes cleanly", "The system keeps working in a reduced but usable way when something fails", "The feature is removed automatically", "Performance always degrades over time"], correct: 1 },
    { q: "What's a common trait of a well-written commit message's first line?", options: ["As long as possible", "A short, clear summary of the change (often imperative mood, e.g. 'Fix login bug')", "The developer's name", "A full changelog"], correct: 1 },
    { q: "What's 'cognitive load' in the context of reading code?", options: ["CPU usage while running it", "How much a reader must hold in mind at once to understand it", "The number of files in a project", "Compile time"], correct: 1 },
    { q: "What does a low 'bus factor' on a team indicate?", options: ["Great documentation coverage", "Risk — too much critical knowledge held by too few people", "A fast release cadence", "Low headcount by design"], correct: 1 },
    { q: "What's the core difference between waterfall and agile methodology?", options: ["No real difference", "Waterfall plans phases sequentially upfront; agile works in short, iterative cycles with feedback", "Agile has no planning at all", "Waterfall is always faster"], correct: 1 },
    { q: "What's a Kanban board primarily used for?", options: ["Tracking billing", "Visualizing work moving through columns, limiting work-in-progress", "Managing servers", "Writing documentation"], correct: 1 },
    { q: "What's the main purpose of a sprint retrospective?", options: ["Assigning blame for missed deadlines", "Reflecting on what went well/didn't and what to change going forward", "Estimating the next sprint's work", "Demoing finished features to stakeholders"], correct: 1 },
    { q: "What does a 'definition of done' establish for a ticket?", options: ["Who wrote the code", "The explicit checklist that must be true before work counts as complete", "The estimated time to complete it", "The priority level"], correct: 1 },
    { q: "What are 'story points' used for?", options: ["Exact hour estimates", "A relative, unitless measure of effort/complexity for planning capacity", "Tracking bugs", "Measuring code quality"], correct: 1 },
    { q: "What's a 'spike' in agile terminology?", options: ["A production outage", "A short, timeboxed research task to reduce uncertainty before real implementation", "A sudden traffic increase", "A large feature release"], correct: 1 },
    { q: "What's the benefit of a pre-commit lint hook?", options: ["It deploys code automatically", "Catches style issues/common mistakes before code is even committed", "It writes tests for you", "It merges branches automatically"], correct: 1 },
    { q: "What's 'trunk-based development'?", options: ["Never merging code", "Integrating small changes into the main branch very frequently, avoiding long-lived branches", "Only one developer commits per week", "A branching strategy with 10+ long-lived branches"], correct: 1 },
    { q: "What's a 'canary release'?", options: ["Releasing to 100% of users immediately", "Rolling a change out to a small subset of users/servers first to watch for problems", "A rollback strategy only", "A type of automated test"], correct: 1 },
    { q: "What's 'blue-green deployment'?", options: ["Running one environment with two color themes", "Running two identical environments and switching traffic instantly for fast rollback", "A UI design pattern", "A type of database replication"], correct: 1 },
    { q: "What's a 'circuit breaker' pattern used for?", options: ["Cutting power to a server", "Stopping repeated calls to a failing dependency to prevent cascading failures", "Encrypting network traffic", "Load balancing requests"], correct: 1 },
    { q: "What's a benefit of keeping notes/a journal of engineering decisions made?", options: ["No real benefit", "Makes writing status updates, retros, and resume bullets much easier later", "It's required by most companies", "It replaces code comments"], correct: 1 },
    { q: "What's the key difference between mentoring and managing someone?", options: ["They're identical roles", "Mentoring focuses on growth/skills informally; managing includes formal responsibility for performance/direction", "Managers can't mentor", "Mentoring is always a paid role"], correct: 1 },
    { q: "What's 'dependency injection'?", options: ["Installing npm packages", "Supplying a component's dependencies from outside rather than having it construct them itself", "A security vulnerability", "A database migration technique"], correct: 1 },
    { q: "What's a 'code smell'?", options: ["A syntax error", "A surface indicator that code MIGHT have a deeper design problem, without being a bug itself", "A type of comment", "A compiler warning"], correct: 1 },
    { q: "What does 'test coverage' measure?", options: ["How many bugs exist", "The proportion of code exercised by the test suite", "How fast tests run", "The number of test files"], correct: 1 },
    { q: "What's the purpose of a changelog?", options: ["Storing source code", "A running record of notable changes between versions/releases", "A backup of the database", "A list of open bugs"], correct: 1 },
    { q: "What does 'dev/prod parity' aim for?", options: ["Identical hardware always", "Keeping development, staging, and production environments as similar as possible to avoid 'works on my machine' bugs", "Only matching version numbers", "Running dev and prod on the same server"], correct: 1 },
    { q: "What's a 'war room' during a major incident?", options: ["A scheduled weekly meeting", "A dedicated space (physical or virtual) where responders coordinate in real time to resolve it", "A place to file paperwork afterward", "A training exercise only"], correct: 1 },
    { q: "What's the goal of chaos engineering (e.g. deliberately killing servers in production)?", options: ["Causing outages for fun", "Proactively discovering weaknesses by injecting controlled failures before they happen for real", "Testing UI responsiveness", "Reducing cloud costs"], correct: 1 },
    { q: "What's the 'boy scout rule' in coding practice?", options: ["Always rewrite the whole file", "Leave the code a little cleaner than you found it", "Never touch code you didn't write", "Add extensive comments everywhere"], correct: 1 },
    { q: "What's a 'walking skeleton' in project terms?", options: ["A finished, polished product", "A minimal end-to-end implementation connecting all major pieces, before fleshing out details", "A UI wireframe only", "A deprecated codebase"], correct: 1 },
    { q: "What's the point of a 'runway' in an engineering roadmap discussion?", options: ["A literal runway for testing hardware", "How much time/budget is available before something must ship or funding runs out", "A type of deployment pipeline", "A design system term"], correct: 1 },
    { q: "What's a 'shadow deployment'?", options: ["A fully hidden, unreleased feature", "Sending real production traffic to a new version without its results affecting real users, to validate behavior", "A backup deployment strategy only", "Deploying at night"], correct: 1 },
    { q: "Why is a GET request expected to be idempotent while a typical POST isn't?", options: ["GET requests can't fail", "GET is meant to only read data with no side effects; POST often creates new resources with each call", "POST always fails on retry", "There's no real distinction"], correct: 1 },
    { q: "What's the purpose of a requirements/spec document before starting a large feature?", options: ["It's purely bureaucratic", "Getting clarity and alignment on WHAT should be built before investing time building it", "Replacing the need for testing", "Only needed for legal compliance"], correct: 1 },
    { q: "What's 'gold plating' in software delivery?", options: ["Using premium cloud infrastructure", "Adding unnecessary extra polish/features beyond what was actually requested or needed", "A code review process", "A security certification"], correct: 1 },
    { q: "What's the main tradeoff of 'mob programming' (a whole team coding together at once)?", options: ["No tradeoff, strictly better", "Slower raw output per person, in exchange for shared context and fewer downstream mistakes", "It replaces version control", "It only works remotely"], correct: 1 },
    { q: "What's the 'iron triangle' of project management?", options: ["Design, code, test", "Scope, time, and cost — changing one affects the others", "Frontend, backend, database", "Plan, build, ship"], correct: 1 },
    { q: "What does it mean for one ticket to 'depend on' another?", options: ["They're duplicates", "It can't start/finish until the other is completed", "They're assigned to the same person", "They share the same title"], correct: 1 },
    { q: "What does 'velocity' measure in Scrum?", options: ["Code execution speed", "Story points a team typically completes per sprint", "Number of bugs found", "Meeting frequency"], correct: 1 },
    { q: "What does a burndown chart show?", options: ["Team headcount over time", "Remaining work over time within a sprint/project", "Server CPU usage", "Code coverage percentage"], correct: 1 },
    { q: "What's the relationship between an epic and a story in agile terms?", options: ["They're the same thing", "An epic is a large body of work broken into smaller stories", "A story contains many epics", "Epics are always bugs"], correct: 1 },
    { q: "What's the purpose of a PRD (Product Requirements Document)?", options: ["Tracking billing", "Describing what a feature should do and why, to align stakeholders before building", "Listing all past bugs", "A legal contract only"], correct: 1 },
    { q: "What's the point of A/B testing a feature?", options: ["Testing on two different operating systems", "Comparing two versions with real users to measure which performs better", "Running tests twice for reliability", "Testing with two developers"], correct: 1 },
    { q: "What does 'churn' mean for a product?", options: ["Code refactoring rate", "The rate users stop using/paying for it over time", "Server restart frequency", "Bug report volume"], correct: 1 },
    { q: "What does NPS (Net Promoter Score) measure?", options: ["Server performance", "How likely customers are to recommend a product", "Number of pull requests", "Code quality"], correct: 1 },
    { q: "What's an SLA (Service Level Agreement)?", options: ["An internal team goal", "A formal, often external, commitment about a service's expected performance", "A type of database index", "A code review checklist"], correct: 1 },
    { q: "How does an SLO typically differ from an SLA?", options: ["No difference", "An SLO is an internal target; an SLA is an external, often contractual, commitment", "SLA is internal, SLO is external", "SLOs apply only to hardware"], correct: 1 },
    { q: "What's 'vendor lock-in'?", options: ["A security vulnerability", "Becoming so dependent on one provider's tools/APIs that switching is costly", "A pricing discount", "A type of contract termination"], correct: 1 },
    { q: "What's a 'proof of concept' (POC)?", options: ["The final production release", "A small implementation testing whether an idea is technically feasible", "A legal document", "A marketing pitch"], correct: 1 },
    { q: "What's the purpose of a behavioral interview question?", options: ["Testing algorithm knowledge", "Assessing how a candidate handled real past situations as a predictor of future behavior", "Checking typing speed", "Verifying a degree"], correct: 1 },
    { q: "What's the difference between 'culture fit' and 'culture add'?", options: ["They're identical", "Fit asks if someone matches the team; add asks what new strength they'd bring", "Culture add is only for executives", "Fit is illegal to assess"], correct: 1 },
    { q: "What's a 'reference check' in hiring?", options: ["Checking a candidate's code style", "Contacting past colleagues/managers to verify experience and get outside perspective", "A background credit check", "A personality test"], correct: 1 },
    { q: "What does 'equity' typically mean in a compensation package?", options: ["Extra vacation days", "Ownership stake in the company, often stock options or RSUs", "A signing bonus", "Health insurance"], correct: 1 },
    { q: "What's a 'vesting schedule' for equity?", options: ["The tax filing deadline", "The timeline over which granted equity is actually earned/owned", "A stock price chart", "A hiring timeline"], correct: 1 },
    { q: "What does 'at-will employment' mean?", options: ["Employment lasting a fixed contract term only", "Either party can end employment at any time without needing specific cause", "Mandatory unionization", "Guaranteed lifetime employment"], correct: 1 },
    { q: "What's a 'non-compete clause'?", options: ["A performance bonus structure", "A restriction on working for a competitor for a period after leaving", "A remote work policy", "A code of conduct"], correct: 1 },
    { q: "What's the key difference between 'remote-first' and 'remote-friendly'?", options: ["No real difference", "Remote-first designs processes around remote work by default; remote-friendly still often centers on an office default", "Remote-friendly means fully remote only", "Remote-first requires no meetings"], correct: 1 },
    { q: "What's an 'async communication' culture built around?", options: ["Requiring instant replies always", "Defaulting to written, non-real-time updates so people aren't blocked waiting on each other", "Banning all meetings", "Only communicating via email"], correct: 1 },
    { q: "What's the purpose of documenting acceptance criteria before starting a ticket?", options: ["Slowing down the team", "Defining concretely what 'done' means, avoiding ambiguity later", "Satisfying a legal requirement", "Replacing the need for QA"], correct: 1 },
    { q: "What's a common purpose of a 'kickoff meeting' at the start of a project?", options: ["Assigning blame for past delays", "Aligning the team on goals, scope, and roles before work begins", "Reviewing the final deliverable", "Negotiating salaries"], correct: 1 },
    { q: "What's the benefit of documenting 'lessons learned' at the end of a project, beyond an incident postmortem?", options: ["No benefit, it's just paperwork", "Captures what worked/didn't for future projects, not just for failures", "Only useful for legal records", "Replaces the need for retrospectives"], correct: 1 },
  ],
};

let quizSession = null; // { track, questions: [...10], idx, score, answered }
function quizTrack() { return localStorage.getItem("hub-quiz-track") || (state.courses[0] && state.courses[0].id) || "python"; }

function sampleN(arr, n) {
  const pool = arr.map((x, i) => ({ x, i }));
  const picked = [];
  for (let k = 0; k < n && pool.length; k++) {
    const j = (Math.random() * pool.length) | 0;
    picked.push(pool.splice(j, 1)[0].x);
  }
  return picked;
}

function initQuizzes() {
  renderSideToggle($("#quiz-track-list"), quizTrack(), (id) => {
    localStorage.setItem("hub-quiz-track", id);
    quizSession = null;
    initQuizzes();
  });
  quizRenderIntro();
}

function quizTrackLabel() {
  const c = state.courses.find((c) => c.id === quizTrack());
  return c ? c.title : quizTrack();
}

function quizRenderIntro() {
  const bank = QUIZZES[quizTrack()] || [];
  $("#quiz-body").innerHTML = `
    <div class="quiz-intro">
      <h2>${escapeHtml(quizTrackLabel())} quiz</h2>
      <p>10 random multiple-choice questions, pulled fresh each time from a pool of ${bank.length}.</p>
      <button id="quiz-start-btn" class="btn-yellow big">Start quiz →</button>
    </div>`;
  $("#quiz-start-btn").onclick = quizStart;
}

function quizStart() {
  const bank = QUIZZES[quizTrack()] || [];
  quizSession = { track: quizTrack(), questions: sampleN(bank, Math.min(10, bank.length)), idx: 0, score: 0, answered: false };
  quizRenderQuestion();
}

function quizRenderQuestion() {
  const s = quizSession;
  const q = s.questions[s.idx];
  $("#quiz-body").innerHTML = `
    <div class="quiz-progress">Question ${s.idx + 1} of ${s.questions.length} — score ${s.score}</div>
    <div class="quiz-question">${escapeHtml(q.q)}</div>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `<button class="quiz-option" data-i="${i}">${escapeHtml(opt)}</button>`).join("")}
    </div>
    <div class="quiz-next-wrap"></div>`;
  $("#quiz-body").querySelectorAll(".quiz-option").forEach((btn) => {
    btn.onclick = () => quizAnswer(Number(btn.dataset.i));
  });
}

function quizAnswer(i) {
  const s = quizSession;
  if (s.answered) return;
  s.answered = true;
  const q = s.questions[s.idx];
  const correct = i === q.correct;
  if (correct) { s.score++; addXP(5, "quiz question correct"); }
  $("#quiz-body").querySelectorAll(".quiz-option").forEach((btn) => {
    const bi = Number(btn.dataset.i);
    btn.disabled = true;
    if (bi === q.correct) btn.classList.add("correct");
    else if (bi === i) btn.classList.add("wrong");
  });
  const isLast = s.idx === s.questions.length - 1;
  $("#quiz-body .quiz-next-wrap").innerHTML =
    `<button id="quiz-next-btn" class="btn-yellow">${isLast ? "See results →" : "Next question →"}</button>`;
  $("#quiz-next-btn").onclick = () => {
    if (isLast) { quizShowResults(); return; }
    s.idx++; s.answered = false;
    quizRenderQuestion();
  };
}

function quizShowResults() {
  const s = quizSession;
  const pct = Math.round((s.score / s.questions.length) * 100);
  if (pct === 100) confetti();
  $("#quiz-body").innerHTML = `
    <div class="quiz-intro">
      <h2>${pct}% — ${s.score}/${s.questions.length} correct</h2>
      <p>${pct >= 80 ? "Nice work — that's a solid grasp of this track." : pct >= 50 ? "Decent — worth reviewing the ones you missed." : "Worth revisiting the lessons for this track before trying again."}</p>
      <button id="quiz-retake-btn" class="btn-yellow big">Take another quiz →</button>
    </div>`;
  $("#quiz-retake-btn").onclick = quizStart;
}

/* ================= wiring ================= */
$("#btn-run").onclick = runCode;
$("#btn-check").onclick = checkAnswer;
$("#btn-clear-editor").onclick = () => loadEditor("", null, null);
$("#btn-clear-output").onclick = () => {
  $("#output").innerHTML = ""; $("#preview").srcdoc = "";
  showPane("output");
};

$("#editor").addEventListener("input", refreshEditorHighlight);
$("#editor").addEventListener("scroll", syncEditorScroll);
$("#editor").addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const t = e.target, s = t.selectionStart;
    t.value = t.value.slice(0, s) + "    " + t.value.slice(t.selectionEnd);
    t.selectionStart = t.selectionEnd = s + 4;
    refreshEditorHighlight();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runCode(); }
});

$("#run-lang").addEventListener("change", refreshEditorHighlight);

$("#brand").onclick = () => switchTab("home");

$("#cta-start").onclick = () => {
  // jump to the first course with unfinished work, else python
  const next = state.courses.find((c) => courseProgress(c).done < c.days.length) || state.courses[0];
  switchTab(next.id);
};
$("#welcome-go").onclick = () => {
  const py = state.courses.find((c) => c.id === "python") || state.courses[0];
  switchTab(py.id);
  const day0 = py.days.find((d) => d.num === 0) || py.days[0];
  openDay(py, day0.id);
};
$("#welcome-close").onclick = () => {
  localStorage.setItem("hub-welcome-dismissed", "1");
  $("#welcome-callout").hidden = true;
};
$("#btn-reset-progress").onclick = async () => {
  const ok = await confirmModal({
    title: "Reset your progress?",
    message: "All XP, streaks, and completed-lesson progress will be gone forever — this can't be undone.",
    okText: "Reset forever",
  });
  if (!ok) return;
  const wipePrefixes = ["hub-done:", "hub-passed:", "hub-lastday:", "hub-fc:"];
  const wipeExact = ["hub-xp", "hub-xp-daily", "hub-days", "hub-welcome-dismissed"];
  for (const key of Object.keys(localStorage)) {
    if (wipeExact.includes(key) || wipePrefixes.some((p) => key.startsWith(p))) localStorage.removeItem(key);
  }
  renderStats();
  renderHome();
  toast("Progress reset");
};

addEventListener("resize", () => { const cv = $("#confetti"); cv.width = innerWidth; cv.height = innerHeight; });

/* ================= live update ================= */
async function checkForUpdate() {
  try {
    const data = await api.version();
    if (data.updateAvailable) {
      $("#update-btn-label").textContent = `Update to v${data.latest} →`;
      $("#update-btn").hidden = false;
    }
  } catch { /* offline or dev server without update support — silently skip */ }
}
checkForUpdate();

$("#update-btn").onclick = async () => {
  const btn = $("#update-btn");
  const ok = await confirmModal({
    title: "Install the update?",
    message: "The app will close and reopen automatically on the new version.",
    okText: "Update & restart",
    danger: false,
  });
  if (!ok) return;
  btn.disabled = true;
  $("#update-btn-label").textContent = "Updating…";
  try {
    const res = await api.applyUpdate();
    if (res.ok) {
      $("#update-btn-label").textContent = "Restarting…";
    } else {
      toast(`Update failed: ${res.message}`);
      btn.disabled = false;
      $("#update-btn-label").textContent = "Update available";
    }
  } catch {
    toast("Couldn't reach the local server to update.");
    btn.disabled = false;
    $("#update-btn-label").textContent = "Update available";
  }
};

/* workshop wiring */
$("#ws-btn-run").onclick = runWorkshop;
$("#ws-btn-review").onclick = reviewWorkshop;
$("#ws-btn-clear").onclick = () => {
  $("#ws-editor").value = "";
  localStorage.setItem(wsKey($("#ws-lang").value), "");
  wsRefreshHighlight();
  $("#ws-output").innerHTML = "";
  $("#ws-review-panel").innerHTML = `<div class="ws-lint info">Write some code, then click <b>Review my code</b>.</div>`;
};
$("#ws-editor").addEventListener("input", () => {
  wsRefreshHighlight();
  localStorage.setItem(wsKey($("#ws-lang").value), $("#ws-editor").value);
});
$("#ws-editor").addEventListener("scroll", () => {
  const ed = $("#ws-editor"), hl = ed.previousElementSibling;
  hl.scrollTop = ed.scrollTop; hl.scrollLeft = ed.scrollLeft;
});
$("#ws-editor").addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const t = e.target, s = t.selectionStart;
    t.value = t.value.slice(0, s) + "    " + t.value.slice(t.selectionEnd);
    t.selectionStart = t.selectionEnd = s + 4;
    wsRefreshHighlight();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runWorkshop(); }
});
$("#ws-lang").addEventListener("change", () => {
  localStorage.setItem("hub-workshop-lang", $("#ws-lang").value);
  $("#ws-editor").value = localStorage.getItem(wsKey($("#ws-lang").value)) || "";
  wsRefreshHighlight();
  renderWsTips();
  $("#ws-output").innerHTML = "";
  $("#ws-review-panel").innerHTML = `<div class="ws-lint info">Write some code, then click <b>Review my code</b>.</div>`;
});
$("#ws-project-notes").addEventListener("input", () => {
  localStorage.setItem("hub-workshop-notes", $("#ws-project-notes").value);
});

document.querySelectorAll("#course-width-btns .pw-width-btn").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll("#course-width-btns .pw-width-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const w = btn.dataset.w;
    $("#preview").style.width = w === "0" ? "100%" : w + "px";
  };
});

/* regex tester */
function runRegexTester() {
  const pat = $("#ws-regex-pattern").value;
  const text = $("#ws-regex-text").value;
  const out = $("#ws-regex-result");
  if (!pat) { out.innerHTML = ""; return; }
  let re;
  try {
    re = new RegExp(pat, "g");
  } catch (e) {
    out.innerHTML = `<span style="color:var(--red)">Invalid pattern: ${escapeHtml(String(e.message))}</span>`;
    return;
  }
  const matches = [...text.matchAll(re)];
  if (!text) { out.innerHTML = `<span>${matches ? "" : ""}Type a test string above.</span>`; return; }
  const highlighted = escapeHtml(text).replace(
    new RegExp(re.source, re.flags),
    (m) => `<span class="regex-match">${escapeHtml(m)}</span>`
  );
  out.innerHTML = `<div style="white-space:pre-wrap">${highlighted}</div><div style="margin-top:6px">${matches.length} match${matches.length === 1 ? "" : "es"}</div>`;
}
$("#ws-regex-pattern").addEventListener("input", runRegexTester);
$("#ws-regex-text").addEventListener("input", runRegexTester);

/* ================= course view layout: collapsible sidebar + resizable split ================= */
function initCourseLayout() {
  const viewCourse = $("#view-course");
  const sidebarToggle = $("#sidebar-toggle");
  const collapsed = localStorage.getItem("hub-sidebar-collapsed") === "1";
  viewCourse.classList.toggle("sidebar-collapsed", collapsed);
  sidebarToggle.onclick = () => {
    const nowCollapsed = !viewCourse.classList.contains("sidebar-collapsed");
    viewCourse.classList.toggle("sidebar-collapsed", nowCollapsed);
    localStorage.setItem("hub-sidebar-collapsed", nowCollapsed ? "1" : "0");
  };

  const lessonPane = $("#lesson-pane");
  const savedWidth = localStorage.getItem("hub-lesson-pane-width");
  if (savedWidth) lessonPane.style.width = savedWidth;

  const handle = $("#split-handle");
  let dragging = false;
  handle.addEventListener("mousedown", (e) => {
    dragging = true;
    handle.classList.add("dragging");
    document.body.style.userSelect = "none";
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const rect = $("#content-split").getBoundingClientRect();
    let px = e.clientX - rect.left;
    const min = 280, max = rect.width - 280;
    px = Math.max(min, Math.min(max, px));
    lessonPane.style.width = px + "px";
  });
  window.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove("dragging");
    document.body.style.userSelect = "";
    localStorage.setItem("hub-lesson-pane-width", lessonPane.style.width);
  });
}

/* ================= boot ================= */
(async function boot() {
  try {
    state.courses = await api.courses();
  } catch {
    document.body.innerHTML = "<p style='padding:40px;font-family:sans-serif;color:#fff'>Could not load courses — is server.py running?</p>";
    return;
  }
  renderTabs();
  renderHome();
  renderStats();
  heroAnimation();
  refreshEditorHighlight();
  initCourseLayout();
})();
