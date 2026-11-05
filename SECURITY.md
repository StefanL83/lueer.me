# Sicherheit

Sicherheitsprobleme bitte **nicht** als öffentliches Issue melden, sondern über
**Security › Report a vulnerability** (private Meldung) in diesem Repository.

## Umgesetzte Maßnahmen

- Statische Website ohne Server-Code, Datenbank, Formulare oder Cookies
- Content-Security-Policy auf jeder Seite (keine Inline-Skripte, nur eigene Quellen)
- Eingebettete Demo in einem `sandbox`-iframe mit eigener, restriktiver CSP
- Externe Links mit `rel="noopener noreferrer"`, restriktive Referrer-Policy
- Keine Drittanbieter (Schriften selbst gehostet, kein Tracking, keine CDNs)
- E-Mail-Adresse nicht im Klartext (Schutz vor Adress-Sammlern)
- Automatische Prüfung (`tools/check_site.py`) vor jedem Deployment
- GitHub Actions auf Commit-SHAs fixiert, minimale Berechtigungen, Dependabot
- Veröffentlicht wird ausschließlich der Ordner `site/`
- HTTPS erzwungen (GitHub Pages: „Enforce HTTPS“)
