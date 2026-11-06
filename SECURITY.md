# Sicherheit

Sicherheitsprobleme bitte **nicht** als öffentliches Issue melden, sondern über
**Security › Report a vulnerability** (private Meldung) in diesem Repository.
Maschinenlesbar auch unter https://lueer.me/.well-known/security.txt (RFC 9116).

## Umgesetzte Maßnahmen

**Website**
- Statische Website ohne Server-Code, Datenbank, Formulare oder Cookies
- Content-Security-Policy auf jeder Seite (keine Inline-Skripte, kein `unsafe-inline`/`unsafe-eval`, nur eigene Quellen)
- Eingebettete Demo in einem `sandbox`-iframe (ohne `allow-same-origin`) mit eigener, restriktiver CSP
- Externe Links mit `rel="noopener noreferrer"`, restriktive Referrer-Policy
- Keine Drittanbieter (Schriften selbst gehostet, kein Tracking, keine CDNs)
- E-Mail-Adresse nicht im Klartext (Schutz vor Adress-Sammlern)
- Alle dynamischen Inhalte werden HTML-escaped; Links nur `https:` oder relativ
- HTTPS erzwungen (GitHub Pages: „Enforce HTTPS“)

**Entwicklung & Veröffentlichung**
- Automatische Prüfung (`tools/check_site.py`) lokal per Pre-Commit-Hook und in GitHub Actions vor jedem Deployment
  (u. a. Klartext-Kontaktdaten, Geheimnisse, verbotene Dateitypen wie PDF/Office/Schlüssel, CSP-Regeln, tote Links)
- Veröffentlicht wird ausschließlich der Ordner `site/`
- GitHub Actions auf Commit-SHAs fixiert (vom Repository erzwungen), minimale Berechtigungen, Dependabot
- Branch `main`: kein Force-Push, kein Löschen (Ruleset) – die Versionshistorie bleibt vollständig erhalten
- Secret-Scanning mit Push-Schutz, Dependabot-Sicherheitswarnungen, CodeQL-Codeanalyse
- Deployment-Umgebung `github-pages` nur aus `main`

**Domain (IONOS)**
- DNSSEC aktiv, CAA beschränkt Zertifikate auf Let's Encrypt, DMARC `p=quarantine` (siehe `docs/DNS-IONOS.md`)

## Bekannte Grenzen

GitHub Pages erlaubt keine eigenen HTTP-Header. Daher fehlen `frame-ancestors`/`X-Frame-Options`,
`Permissions-Policy` und HSTS mit `includeSubDomains`/`preload`.
Ersatz: Klickschutz per Skript (`js/theme-init.js`) – blendet die Seite in fremden Rahmen aus.
Bewertung: geringes Risiko, da die Seite keine Aktionen, Logins oder Formulare anbietet.
Sollte sich das ändern, die Seite hinter einen Proxy mit Header-Unterstützung (z. B. Cloudflare) legen.

## Regelmäßige Pflege

- `site/.well-known/security.txt`: Feld `Expires` jährlich verlängern (die Prüfung schlägt 30 Tage vorher an)
- Dependabot-Pull-Requests für Actions zeitnah übernehmen
