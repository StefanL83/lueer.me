# lueer.me – Homepage Stefan Lüer

Privates Online-Portfolio: Profil, Werdegang, Kompetenzen, Weiterbildung, Projekte und Kontakt.
Statische Website ohne Build-Schritt, veröffentlicht über GitHub Pages unter **https://lueer.me**.

## Ordnerstruktur

```
site/                     ← NUR dieser Ordner wird veröffentlicht
  index.html              Startseite
  projekte/check.html     Projekt-Detailseite CHECK! (Startseite zeigt nur den Screenshot)
  datenschutz.html, 404.html, robots.txt, sitemap.xml, favicon.svg
  .well-known/security.txt  Kontakt für Sicherheitsmeldungen (jährlich verlängern)
  css/styles.css          Design-System (Farben, Typografie, Layout)
  js/app.js               rendert die Inhalte aus data/
  js/theme-toggle.js      Hell-/Dunkel-Umschalter (alle Seiten)
  js/mail.js              E-Mail-Schutz (Adresse verschleiert)
  js/theme-init.js        Hell-/Dunkel-Modus
  data/cv.js              Lebenslauf – AUTOMATISCH aus dem PDF erzeugt
  data/site.js            Inhalte zum Pflegen (Texte, Kompetenzen, Projekte)
  assets/                 Portrait, Schriften, assets/projekte/ = Projekt-Screenshots
  projects/check/         CHECK!-Offline-Demo (Build des CHECK!-Frontends mit Testdaten)
tools/
  cv_sync.py              PDF-Lebenslauf → site/data/cv.js
  check_site.py           Qualitäts- & Sicherheitsprüfung
docs/DNS-IONOS.md         Domain-Einrichtung
.github/workflows/        Prüfung + automatisches Veröffentlichen
.githooks/pre-commit      Prüfung vor jedem lokalen Commit
aktualisieren.ps1         Lebenslauf aktualisieren & hochladen (ein Befehl)
```

## Lokal ansehen

```powershell
python -m http.server 8000 --directory site
```
Dann http://localhost:8000 im Browser öffnen.

## Lebenslauf aktualisieren

1. Neues `Master_CV_Stefan_Lueer_DE.pdf` in `Downloads` speichern.
2. Im Projektordner: `.\aktualisieren.ps1`

Das Skript liest das PDF aus, prüft die Website und lädt die Änderung hoch – nach ca. 1 Minute ist sie online.
Einmalige Voraussetzung: `python -m pip install --user pypdf`.

Erwartete PDF-Struktur: Abschnitte in GROSSBUCHSTABEN, Stationen als `MM/JJJJ – MM/JJJJ | Titel | Firma`, Aufzählungen mit `·`.

## Inhalte ändern (`site/data/site.js`)

| Was | Wo |
|---|---|
| Untertitel im Kopfbereich | `schwerpunkt` |
| Kennzahlen | `kennzahlen` |
| Profiltext (hat Vorrang vor dem PDF) | `profil` – ein Eintrag pro Absatz |
| Zusätzliche Stationen (z. B. Berufliche Neuorientierung) | `zusatzStationen` |
| Kompetenzen (aufklappbare Gruppen, ohne Bewertung) | `kompetenzen` – „Systeme & Sprachen“ und „Persönliche Stärken“ kommen automatisch aus dem PDF |
| Projekte | `projekte` – Screenshot nach `assets/projekte/`, Detailseite nach Muster `projekte/check.html` anlegen, Eintrag anhängen |

Werdegang und Weiterbildung werden aufklappbar dargestellt. Je Station erscheinen die ersten zwei Aufgaben und
die ersten zwei Erfolge aus dem PDF – die wichtigsten Punkte daher im Master-CV zuerst nennen.

## CHECK!-Demo aktualisieren

Die Demo ist ein Build des CHECK!-Frontends im Testdaten-Modus (keine Netzwerkaufrufe):
```powershell
cd <check-faktencheck>\frontend
$env:VITE_USE_MOCK_API="true"; npx vite build --base=./ --outDir <tmp>
```
Inhalt nach `site/projects/check/` kopieren und in `index.html` die CSP-, Referrer- und noindex-Zeilen
aus der bisherigen Datei übernehmen (die Prüfung verlangt CSP und Referrer-Policy).

Änderungen hochladen:
```powershell
git add -A
git commit -m "Beschreibung der Änderung"   # Prüfung läuft automatisch (Pre-Commit-Hook)
git push
```

Einmalig nach einem frischen `git clone` den Prüf-Hook aktivieren:
```powershell
git config core.hooksPath .githooks
```

Jeder Stand ist in der Git-Historie auf GitHub gesichert. Ältere Stände ansehen: `git log`,
eine Änderung rückgängig machen: `git revert <commit>` und `git push` (die Seite wird automatisch neu veröffentlicht).
