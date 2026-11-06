# Aktualisiert den Lebenslauf auf der Homepage aus dem Master-CV (PDF).
# Nutzung (PowerShell im Projektordner):  .\aktualisieren.ps1
# Optional andere Datei:                  .\aktualisieren.ps1 -Pdf "C:\...\cv.pdf"
param(
  [string]$Pdf = "$env:USERPROFILE\Downloads\Master_CV_Stefan_Lueer_DE.pdf"
)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

python tools/cv_sync.py "$Pdf"
if ($LASTEXITCODE -ne 0) { throw "CV-Sync fehlgeschlagen." }

python tools/check_site.py
if ($LASTEXITCODE -ne 0) { throw "Sicherheits-/Qualitätsprüfung fehlgeschlagen – nichts hochgeladen." }

# Falls die Homepage per Git (GitHub Pages) veröffentlicht ist: Änderungen hochladen
if (Test-Path ".git") {
  git add site/data/cv.js
  git diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    git commit -m "Lebenslauf automatisch aktualisiert ($(Get-Date -Format 'yyyy-MM-dd'))"
    git push
    Write-Host "Lebenslauf aktualisiert und veröffentlicht (online nach ca. 1 Minute)."
  } else {
    Write-Host "Keine Änderungen am Lebenslauf."
  }
} else {
  Write-Host "Lokal aktualisiert (noch kein Git-Repository verbunden)."
}
