<#
.SYNOPSIS
  Builds a fully standalone CodeLearningHub.exe (all course content + static
  assets embedded) and uploads it to a GitHub Release as a plain, one-click
  download - no zip, no folder for the user to navigate.

.DESCRIPTION
  Run this after committing/pushing the version you want to ship. It:
    1. Exports a clean snapshot of the committed tree via `git archive`
       (this automatically excludes node_modules/, __pycache__/, .git/, etc.
       via .gitignore - nothing extra needs to be listed here).
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
if ($LASTEXITCODE -ne 0) { throw "git archive failed (exit $LASTEXITCODE)" }
Expand-Archive -Path (Join-Path $Stage "src.zip") -DestinationPath (Join-Path $Stage "src") -Force
$S = Join-Path $Stage "src"

# Version resource + --noupx: unsigned onefile PyInstaller exes with no
# embedded metadata and UPX-compressed sections are a classic Windows
# Defender heuristic false-positive (looks like a packed dropper). Neither
# fully eliminates AV flags without a real code-signing cert, but both
# meaningfully cut false-positive rates.
$VersionMatch = Select-String -Path "$S\app\server.py" -Pattern '^VERSION\s*=\s*"([\d.]+)"'
$AppVersion = if ($VersionMatch) { $VersionMatch.Matches[0].Groups[1].Value } else { "0.0.0" }
$VerParts = (($AppVersion -split '\.') + @('0','0','0','0'))[0..3] -join ', '
$VersionInfoPath = Join-Path $Stage "version_info.txt"
@"
VSVersionInfo(
  ffi=FixedFileInfo(
    filevers=($VerParts),
    prodvers=($VerParts),
    mask=0x3f,
    flags=0x0,
    OS=0x40004,
    fileType=0x1,
    subtype=0x0,
    date=(0, 0)
  ),
  kids=[
    StringFileInfo(
      [StringTable(
        u'040904B0',
        [StringStruct(u'CompanyName', u'Code Learning Hub'),
         StringStruct(u'FileDescription', u'Code Learning Hub - offline coding course app'),
         StringStruct(u'FileVersion', u'$AppVersion'),
         StringStruct(u'InternalName', u'CodeLearningHub'),
         StringStruct(u'LegalCopyright', u'Code Learning Hub'),
         StringStruct(u'OriginalFilename', u'CodeLearningHub.exe'),
         StringStruct(u'ProductName', u'Code Learning Hub'),
         StringStruct(u'ProductVersion', u'$AppVersion')])]),
    VarFileInfo([VarStruct(u'Translation', [1033, 1200])])
  ]
)
"@ | Set-Content -Path $VersionInfoPath -Encoding utf8

Write-Host "Building standalone CodeLearningHub.exe with PyInstaller..."
python -m PyInstaller --onefile --noconsole --noupx --name CodeLearningHub `
  --icon "$S\app\icon.ico" `
  --version-file "$VersionInfoPath" `
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
if ($LASTEXITCODE -ne 0) { throw "PyInstaller failed (exit $LASTEXITCODE)" }

$exe = Join-Path $DistDir "CodeLearningHub.exe"
if (-not (Test-Path $exe)) {
    throw "Build did not produce $exe"
}
Write-Host ("Built {0} ({1:N1} MB)" -f $exe, ((Get-Item $exe).Length / 1MB))
Write-Host ("SHA256: {0}" -f (Get-FileHash $exe -Algorithm SHA256).Hash)

if ($Tag) {
    Write-Host "Uploading to GitHub Release $Tag ..."
    gh release upload $Tag $exe --clobber
    if ($LASTEXITCODE -ne 0) { throw "gh release upload failed (exit $LASTEXITCODE)" }
    Write-Host "Done - attached to https://github.com/Gomby711/code-learning-hub/releases/tag/$Tag"
} else {
    Write-Host "No -Tag given; exe left at $exe"
    Write-Host "Upload manually with: gh release upload TAG_NAME `"$exe`""
}

Write-Host "Cleaning up staging directory..."
Remove-Item -Recurse -Force $Stage -ErrorAction SilentlyContinue
