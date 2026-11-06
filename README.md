# lueer.me – Homepage Stefan Lüer

Privates Online-Portfolio: Profil, Kompetenzen, Arbeitsnachweise (CHECK!-Demonstrator) und Werdegang.
Statische Website ohne Build-Schritt, veröffentlicht über GitHub Pages unter **https://lueer.me**.

## Ordnerstruktur

```
site/                     ← NUR dieser Ordner wird veröffentlicht
  index.html              Startseite
  datenschutz.html, 404.html, robots.txt, sitemap.xml, favicon.svg
  .well-known/security.txt  Kontakt für Sicherheitsmeldungen (jährlich verlängern)
  css/styles.css          Design-System (Farben, Typografie, Layout)
  js/app.js               rendert die Inhalte aus data/
  js/mail.js              E-Mail-Schutz (Adresse verschleiert)
  js/theme-init.js        Hell-/Dunkel-Modus
  data/cv.js              Lebenslauf – AUTOMATISCH aus dem PDF erzeugt
  data/site.js            Inhalte zum Pflegen (Texte, Kompetenzen, Projekte)
  assets/                 Portrait, Screenshots, Schriften
  projects/check/         CHECK!-Offline-Demo (eingebettet)
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
| Kompetenzen | `kompetenzen.liste` |
| Projekte / Arbeitsnachweise | `projekte` – neues Objekt nach dem Muster von CHECK! anhängen |

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

## Kompetenzen live aus Google Sheets (optional)

Sheet über *Datei › Freigeben › Im Web veröffentlichen* als **CSV** veröffentlichen und die URL in `kompetenzen.sheetCsvUrl` eintragen.
Angezeigt werden nur Zeilen mit Personen-ID `stefan_l` und **Freigabe Web? = Ja**. Achtung: „Im Web veröffentlichen“ macht das gesamte Tabellenblatt öffentlich.

Zusätzlich in `site/index.html` die Content-Security-Policy erweitern:
`connect-src 'self' https://docs.google.com https://*.googleusercontent.com`
(ohne diesen Eintrag blockiert der Browser die Abfrage; `tools/check_site.py` weist darauf hin).

## Sicherheit

Siehe [SECURITY.md](SECURITY.md). Vor jedem Hochladen läuft `tools/check_site.py` (lokal per Pre-Commit-Hook bzw. im Update-Skript und in GitHub Actions).

## Lizenz

Alle Rechte vorbehalten – siehe [LICENSE](LICENSE).
