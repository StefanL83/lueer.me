"""
CV-Sync: liest den Master-Lebenslauf (PDF) und erzeugt daraus data/cv.js fuer die Homepage.
Ausserdem wird das PDF als Download nach downloads/ kopiert.

Nutzung:
    python tools/cv_sync.py [PFAD_ZUR_PDF]

Ohne Argument: %USERPROFILE%/Downloads/Master_CV_Stefan_Lueer_DE.pdf
Benoetigt: pypdf  (einmalig: python -m pip install --user pypdf)

Erwartete PDF-Struktur (wie im aktuellen Master-CV):
  Abschnitte in GROSSBUCHSTABEN (PROFIL, KERNKOMPETENZEN, BERUFSERFAHRUNG, ...)
  Stationen:  "MM/JJJJ – MM/JJJJ | Titel | Organisation"
  Aufzaehlungen beginnen mit "·"
  Zwischenueberschriften: "Ausgewählte Erfolge" / "Ausgewählte Beiträge"
"""
import datetime as dt
import json
import re
import shutil
import sys
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    sys.exit("pypdf fehlt. Einmalig installieren mit:  python -m pip install --user pypdf")

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PDF = Path.home() / "Downloads" / "Master_CV_Stefan_Lueer_DE.pdf"
OUT_JS = ROOT / "site" / "data" / "cv.js"
OUT_PDF = ROOT / "site" / "downloads" / "Lebenslauf_Stefan_Lueer.pdf"

SECTIONS = {
    "PROFIL": "profil",
    "KERNKOMPETENZEN": "kernkompetenzen",
    "BERUFSERFAHRUNG": "berufserfahrung",
    "AUSBILDUNG & STUDIUM": "ausbildung",
    "AUSBILDUNG": "ausbildung",
    "WEITERBILDUNG": "ausbildung",
    "METHODEN, SYSTEME & SPRACHEN": "methoden",
    "PERSÖNLICHE STÄRKEN": "staerken",
}
ENTRY_RE = re.compile(r"^((?:\d{2}/)?\d{4}(?:\s*[–-]\s*(?:(?:\d{2}/)?\d{4}|heute))?)\s*\|\s*(.+)$")
SKIP_RE = re.compile(r"^(Seite \d+ von \d+|STEFAN LÜER \|.*)$")
HIGHLIGHT_RE = re.compile(r"^Ausgewählte (Erfolge|Beiträge|Projekte)$")


def lines_from_pdf(pdf: Path):
    text = "\n".join((p.extract_text() or "") for p in PdfReader(str(pdf)).pages)
    out = []
    for raw in text.splitlines():
        line = raw.strip()
        if line and not SKIP_RE.match(line):
            out.append(line)
    return out


def join(a: str, b: str) -> str:
    """Zeilenumbruch zusammenfuehren, Silbentrennung ('Pro-' + 'duktmix') aufloesen."""
    if re.search(r"[a-zäöüß]-$", a) and re.match(r"^[a-zäöüß]", b):
        return a[:-1] + b
    return a + " " + b


def parse(lines):
    cv = {"profil": [], "kernkompetenzen": [], "berufserfahrung": [], "ausbildung": [], "methoden": [], "staerken": []}
    section = None
    blocks = []  # (section, kind, text)

    # 1) Zeilen zu logischen Bloecken zusammenfuegen
    for line in lines:
        if line.upper() == line and line in SECTIONS:
            section = SECTIONS[line]
            continue
        if section is None:
            continue
        if line.startswith("·"):
            blocks.append([section, "bullet", line.lstrip("· ").strip()])
        elif ENTRY_RE.match(line) and section in ("berufserfahrung", "ausbildung"):
            blocks.append([section, "entry", line])
        elif HIGHLIGHT_RE.match(line):
            blocks.append([section, "sub", line])
        elif blocks and blocks[-1][0] == section and blocks[-1][1] in ("bullet", "text", "entry") and not (
            blocks[-1][1] == "entry" and section == "ausbildung"
        ):
            # Fortsetzung des vorherigen Blocks (Umbruch)
            blocks[-1][2] = join(blocks[-1][2], line)
        else:
            blocks.append([section, "text", line])

    # 2) Bloecke strukturieren
    current = None
    for section, kind, text in blocks:
        if section == "profil":
            if cv["profil"] and kind == "text":
                cv["profil"][-1] = join(cv["profil"][-1], text)
            else:
                cv["profil"].append(text)
        elif section == "kernkompetenzen" and kind == "bullet":
            cv["kernkompetenzen"].append([x.strip() for x in text.split("|") if x.strip()])
        elif section == "berufserfahrung":
            if kind == "entry":
                zeitraum, rest = ENTRY_RE.match(text).groups()
                parts = [p.strip() for p in rest.split("|")]
                current = {"titel": parts[0], "organisation": " | ".join(parts[1:]), "zeitraum": zeitraum.strip(),
                           "zusatz": "", "aufgaben": [], "highlights": []}
                cv["berufserfahrung"].append(current)
            elif kind == "sub" and current:
                current["highlightTitel"] = text
            elif kind == "bullet" and current:
                (current["highlights"] if current.get("highlightTitel") else current["aufgaben"]).append(text)
        elif section == "ausbildung":
            if kind == "entry":
                zeitraum, rest = ENTRY_RE.match(text).groups()
                parts = [p.strip() for p in rest.split("|")]
                current = {"titel": parts[0], "organisation": " | ".join(parts[1:]), "zeitraum": zeitraum.strip(),
                           "zusatz": "", "beschreibung": ""}
                cv["ausbildung"].append(current)
            elif current:
                current["beschreibung"] = join(current["beschreibung"], text).strip()
        elif section == "methoden" and kind == "bullet":
            label, _, rest = text.partition(":")
            cv["methoden"].append({"label": label.strip(), "text": rest.strip()} if rest else {"label": "", "text": text})
        elif section == "staerken" and kind == "bullet":
            cv["staerken"].append(" · ".join(x.strip() for x in text.split("|")))
    return cv


def zusatz_status(cv, heute):
    """Kennzeichnet Weiterbildungen als 'laufend' bzw. 'abgeschlossen' anhand des Enddatums."""
    for a in cv["ausbildung"]:
        m = re.search(r"[–-]\s*(\d{2})/(\d{4})$", a["zeitraum"])
        if m and int(m.group(2)) >= heute.year - 1:
            ende = (int(m.group(2)), int(m.group(1)))
            a["zusatz"] = "laufend" if ende >= (heute.year, heute.month) else "abgeschlossen"


def main():
    pdf = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PDF
    if not pdf.exists():
        sys.exit(f"Master-CV (PDF) nicht gefunden: {pdf}")
    cv = parse(lines_from_pdf(pdf))
    if not cv["berufserfahrung"]:
        sys.exit("Keine Berufsstationen erkannt – PDF-Struktur prüfen. data/cv.js wurde NICHT verändert.")
    zusatz_status(cv, dt.date.today())
    cv["stand"] = dt.datetime.fromtimestamp(pdf.stat().st_mtime).strftime("%Y-%m-%d")
    cv["quelle"] = pdf.name

    OUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    if pdf.resolve() != OUT_PDF.resolve():
        shutil.copy2(pdf, OUT_PDF)
    cv["pdf"] = "downloads/" + OUT_PDF.name

    OUT_JS.parent.mkdir(parents=True, exist_ok=True)
    OUT_JS.write_text(
        "/* AUTOMATISCH ERZEUGT von tools/cv_sync.py – nicht von Hand bearbeiten.\n"
        f"   Quelle: {pdf.name} | Stand: {cv['stand']} */\n"
        "window.CV = " + json.dumps(cv, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"OK: {len(cv['berufserfahrung'])} Stationen, {len(cv['ausbildung'])} Ausbildungen, "
          f"{len(cv['kernkompetenzen'])} Kernkompetenzen -> {OUT_JS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
