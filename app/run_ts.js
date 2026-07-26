// Transpiles a .ts file with the course's local TypeScript compiler, then runs it.
// Usage: node run_ts.js <file.ts>
const fs = require("fs");
const path = require("path");

const tsDir = path.join(__dirname, "..", "typescript-javascript", "node_modules", "typescript");
let ts;
try {
  ts = require(tsDir);
} catch {
  console.error("TypeScript compiler not found — run `npm install` inside typescript-javascript/");
  process.exit(1);
}

const srcPath = process.argv[2];
const source = fs.readFileSync(srcPath, "utf8");

const diagHost = {
  getCanonicalFileName: (f) => f,
  getCurrentDirectory: () => process.cwd(),
  getNewLine: () => "\n",
};

const result = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    strict: false,
  },
  reportDiagnostics: true,
});

const errors = (result.diagnostics || []).filter(
  (d) => d.category === ts.DiagnosticCategory.Error
);
if (errors.length) {
  console.error(ts.formatDiagnostics(errors, diagHost));
  process.exit(1);
}

const outPath = srcPath.replace(/\.ts$/, ".compiled.cjs");
fs.writeFileSync(outPath, result.outputText, "utf8");
require(outPath);
