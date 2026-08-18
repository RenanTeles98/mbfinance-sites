[CmdletBinding()]
param([switch]$Apply)

$ErrorActionPreference = 'Stop'
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$sourceRoot = Join-Path $repositoryRoot 'public'
$destinationRoot = Join-Path $repositoryRoot 'cpanel-upload\public_html'

if (-not (Test-Path -LiteralPath $sourceRoot)) { throw "Source directory not found: $sourceRoot" }
if (-not (Test-Path -LiteralPath $destinationRoot)) { throw "CPanel package directory not found: $destinationRoot" }

$sourceFiles = Get-ChildItem -LiteralPath $sourceRoot -File -Recurse
$missing = [System.Collections.Generic.List[string]]::new()
$different = [System.Collections.Generic.List[string]]::new()

foreach ($sourceFile in $sourceFiles) {
  $relativePath = $sourceFile.FullName.Substring($sourceRoot.Length + 1)
  $destinationFile = Join-Path $destinationRoot $relativePath
  if (-not (Test-Path -LiteralPath $destinationFile)) { $missing.Add($relativePath); continue }
  if ((Get-FileHash -LiteralPath $sourceFile.FullName -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $destinationFile -Algorithm SHA256).Hash) { $different.Add($relativePath) }
}

$cpanelOnly = Get-ChildItem -LiteralPath $destinationRoot -File -Recurse | Where-Object {
  $relativePath = $_.FullName.Substring($destinationRoot.Length + 1)
  -not (Test-Path -LiteralPath (Join-Path $sourceRoot $relativePath))
} | ForEach-Object { $_.FullName.Substring($destinationRoot.Length + 1) }

Write-Output "Source files: $($sourceFiles.Count)"
Write-Output "Missing in CPanel package: $($missing.Count)"
Write-Output "Different in CPanel package: $($different.Count)"
Write-Output "CPanel-only files preserved: $($cpanelOnly.Count)"
if ($missing.Count -gt 0) { $missing | ForEach-Object { "MISSING  $_" } }
if ($different.Count -gt 0) { $different | ForEach-Object { "DIFF     $_" } }
if ($cpanelOnly.Count -gt 0) { $cpanelOnly | ForEach-Object { "PRESERVE $_" } }

if (-not $Apply) {
  Write-Output 'Check completed. Run with -Apply to copy only missing or different files from public/ to cpanel-upload/public_html/.'
  exit 0
}

foreach ($relativePath in @($missing) + @($different)) {
  $sourceFile = Join-Path $sourceRoot $relativePath
  $destinationFile = Join-Path $destinationRoot $relativePath
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destinationFile) | Out-Null
  Copy-Item -LiteralPath $sourceFile -Destination $destinationFile -Force
  Write-Output "COPIED    $relativePath"
}

Write-Output 'Synchronization completed. CPanel-only files were not changed or deleted.'
