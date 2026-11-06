"""
Qualitäts- und Sicherheitsprüfung für den Ordner site/ (läuft lokal und in GitHub Actions vor jedem Deployment).

Prüft:
  1. Keine E-Mail-Adressen oder Telefonnummern im Klartext (Spam-/Datenschutz)
  2. Keine ausführbaren Inline-Skripte in den Hauptseiten (Voraussetzung für die strikte CSP)
  3. Jede Seite hat eine Content-Security-Policy
  4. Externe Links mit target="_blank" haben rel="noopener noreferrer"
  5. Alle lokalen Verweise (href/src) zeigen auf existierende Dateien
  6. Keine verdächtigen Geheimnisse (API-Keys, Tokens)
  7. Keine Dokumente/Archive/Schlüssel im Veröffentlichungsordner (z. B. Lebenslauf-PDF, .env)
  8. Hauptseiten: CSP ohne 'unsafe-inline'/'unsafe-eval', Referrer-Policy gesetzt
  9. security.txt vorhanden und nicht (bald) abgelaufen

Nutzung:  python tools/check_site.py      (Exit-Code 1 bei Fehlern)
"""
import datetime as dt
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

SITE = Path(__file__).resolve().parent.parent / "site"
TEXT_EXT = {".html", ".js", ".css", ".json", ".txt", ".xml", ".svg", ".md"}
DEMO_DIR = SITE / "projects"  # eingebettete Demos dürfen Inline-Code nutzen (eigene CSP)

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(?:\+49|0049)[\s\d/-]{7,}|\b01[5-7]\d[\s/-]?\d{3,}[\s/-]?\d{2,}")
SECRET_RE = re.compile(r"(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|api[_-]?key\s*[:=]\s*['\"][^'\"]{12,})", re.I)
ALLOWED_EMAIL_HINTS = ("example.", "users.noreply.github.com")

errors = []


def rel(p: Path) -> str:
    return str(p.relative_to(SITE.parent)).replace("\\", "/")


FORBIDDEN_EXT = {".pdf", ".doc", ".docx", ".odt", ".xls", ".xlsx", ".ods", ".csv", ".zip", ".7z", ".rar",
                 ".env", ".pem", ".key", ".p12", ".pfx", ".bak", ".sql", ".py", ".ps1", ".log"}

for f in sorted(SITE.rglob("*")):
    if f.is_file() and (f.suffix.lower() in FORBIDDEN_EXT or f.name.startswith(".env")):
        errors.append(f"{rel(f)}: Dateityp darf nicht veröffentlicht werden")
    if not f.is_file() or f.suffix.lower() not in TEXT_EXT:
        continue
    text = f.read_text(encoding="utf-8", errors="replace")

    for m in EMAIL_RE.finditer(text):
        addr = m.group(0)
        if not any(h in addr for h in ALLOWED_EMAIL_HINTS) and not re.search(r"\.(png|jpe?g|webp|svg|woff2?)$", addr):
            errors.append(f"{rel(f)}: E-Mail-Adresse im Klartext: {addr}")
    if PHONE_RE.search(text) and f.suffix != ".svg":
        errors.append(f"{rel(f)}: mögliche Telefonnummer im Klartext")
    if SECRET_RE.search(text):
        errors.append(f"{rel(f)}: mögliches Geheimnis (API-Key/Token) gefunden")

    if f.suffix == ".html":
        is_demo = DEMO_DIR in f.parents
        if 'http-equiv="Content-Security-Policy"' not in text:
            errors.append(f"{rel(f)}: keine Content-Security-Policy")
        if '<meta name="referrer"' not in text:
            errors.append(f"{rel(f)}: keine Referrer-Policy (meta name=\"referrer\")")
        if not is_demo:
            csp = re.search(r'http-equiv="Content-Security-Policy" content="([^"]*)"', text)
            if csp and re.search(r"'unsafe-(inline|eval)'", csp.group(1)):
                errors.append(f"{rel(f)}: CSP erlaubt 'unsafe-inline' oder 'unsafe-eval'")
            for m in re.finditer(r"<script(?![^>]*\bsrc=)([^>]*)>", text):
                if "application/ld+json" not in m.group(1):
                    errors.append(f"{rel(f)}: Inline-Skript gefunden (verstößt gegen CSP)")
            if re.search(r"\son[a-z]+\s*=\s*['\"]", text):
                errors.append(f"{rel(f)}: Inline-Eventhandler (onclick=…) gefunden")
        for m in re.finditer(r"<a\b[^>]*target=\"_blank\"[^>]*>", text):
            if not re.search(r'rel="[^"]*noopener[^"]*noreferrer|rel="[^"]*noreferrer[^"]*noopener', m.group(0)):
                errors.append(f"{rel(f)}: target=_blank ohne rel=\"noopener noreferrer\"")
        for m in re.finditer(r"(?:href|src|srcset)=\"([^\"]+)\"", text):
            url = m.group(1).split()[0]
            if url.startswith(("#", "mailto:", "data:", "javascript:")) or "${" in url or "://" in url:
                continue
            path = unquote(urlparse(url).path)
            if not path:
                continue
            target = (SITE / path.lstrip("/")) if path.startswith("/") else (f.parent / path)
            if path.endswith("/"):
                target = target / "index.html"
            if not target.exists():
                errors.append(f"{rel(f)}: Verweis ins Leere: {url}")

# security.txt (RFC 9116): muss existieren und darf nicht ablaufen
sec = SITE / ".well-known" / "security.txt"
if not sec.exists():
    errors.append("site/.well-known/security.txt fehlt")
else:
    m = re.search(r"^Expires:\s*(\d{4}-\d{2}-\d{2})", sec.read_text(encoding="utf-8"), re.M)
    if not m:
        errors.append("security.txt: Feld 'Expires' fehlt")
    elif dt.date.fromisoformat(m.group(1)) - dt.date.today() < dt.timedelta(days=30):
        errors.append(f"security.txt: läuft am {m.group(1)} ab – Datum um ein Jahr verlängern")

if errors:
    print("PRÜFUNG FEHLGESCHLAGEN:")
    for e in errors:
        print("  -", e)
    sys.exit(1)
print(f"Prüfung bestanden: {sum(1 for _ in SITE.rglob('*') if _.is_file())} Dateien in site/ geprüft.")
