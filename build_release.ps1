<#
.SYNOPSIS
  Builds a fully standalone CodeLearningHub.exe (all course content + static
  assets embedded) and uploads it to a GitHub Release as a plain, one-click
  download — no zip, no folder for the user to navigate.

.DESCRIPTION
  Run this after committing/pushing the version you want to ship. It:
    1. Exports a clean snapshot of the committed tree via `git archive`
       (this automatically excludes node_modules/, __pycache__/, .git/, etc.
       via .gitignore — nothing extra needs to be listed here).
    2. Builds a PyInstaller --onefile exe from app/server.py with every course
       folder and app/static/ embedded as bundled data, so the resulting
       .exe needs zero sibling files to run.
    3. Optionally uploads the exe to an existing GitHub Release tag with
       `gh release upload`.

.PARAMETER Tag
  The existing GitHub Release tag to attach the built exe to (e.g. v1.0.0).
  If omitted, the exe is built and left in .\pyi_dist\ without uploading.

.EXAMPLE
  ./build_release.ps1 -Tag v1.0.0
#>
param(
    [string]$Tag
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
Set-Location $Root

$Stage = Join-Path $Root "stage_tmp"
$BuildDir = Join-Path $Root "pyi_build"
$DistDir = Join-Path $Root "pyi_dist"

Write-Host "Cleaning previous build artifacts..."
Remove-Item -Recurse -Force $Stage, $BuildDir, $DistDir -ErrorAction SilentlyContinue

Write-Host "Exporting a clean snapshot of the committed tree..."
New-Item -ItemType Directory -Force -Path $Stage | Out-Null
git archive --format=zip HEAD -o (Join-Path $Stage "src.zip")
Expand-Archive -Path (Join-Path $Stage "src.zip") -DestinationPath (Join-Path $Stage "src") -Force
$S = Join-Path $Stage "src"

Write-Host "Building standalone CodeLearningHub.exe with PyInstaller..."
python -m PyInstaller --onefile --noconsole --name CodeLearningHub `
  --icon "$S\app\icon.ico" `
  --add-data "$S\app\static;app/static" `
  --add-data "$S\app\run_ts.js;app" `
  --add-data "$S\app\icon.ico;app" `
  --add-data "$S\app\icon.png;app" `
  --add-data "$S\python;python" `
  --add-data "$S\career;career" `
  --add-data "$S\html-css;html-css" `
  --add-data "$S\qt;qt" `
  --add-data "$S\typescript-javascript;typescript-javascript" `
  "$Root\app\server.py" --distpath $DistDir --workpath $BuildDir --specpath $BuildDir

$exe = Join-Path $DistDir "CodeLearningHub.exe"
if (-not (Test-Path $exe)) {
    throw "Build did not produce $exe"
}
Write-Host ("Built {0} ({1:N1} MB)" -f $exe, ((Get-Item $exe).Length / 1MB))

if ($Tag) {
    Write-Host "Uploading to GitHub Release $Tag ..."
    gh release upload $Tag $exe --clobber
    Write-Host "Done — attached to https://github.com/Gomby711/code-learning-hub/releases/tag/$Tag"
} else {
    Write-Host "No -Tag given; exe left at $exe (upload manually with: gh release upload <tag> `"$exe`")"
}

Write-Host "Cleaning up staging directory..."
Remove-Item -Recurse -Force $Stage -ErrorAction SilentlyContinue
