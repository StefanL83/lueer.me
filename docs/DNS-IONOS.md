# Domain lueer.me (IONOS) auf GitHub Pages umstellen

Die E-Mail-Einträge (MX) bleiben unverändert – E-Mail über IONOS funktioniert weiter.

## 1. Weiterleitung entfernen
IONOS › Domains & SSL › lueer.me › **Weiterleitung** (aktuell auf LinkedIn) entfernen bzw. auf „Keine“ setzen.

## 2. DNS-Einträge setzen
IONOS › Domains & SSL › lueer.me › **DNS**

| Typ | Hostname | Wert |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | stefanl83.github.io |

Vorhandene A-/AAAA-Einträge für `@` und `www` (z. B. 217.160.0.56) vorher löschen. **MX-, TXT- und SPF-Einträge nicht anfassen.**

## 3. GitHub
Repository › Settings › Pages › Custom domain: `lueer.me` (ist bereits eingetragen) ›
nach der DNS-Prüfung **Enforce HTTPS** aktivieren (das Zertifikat erstellt GitHub automatisch, kann bis zu 24 h dauern).

## 4. Domain verifizieren (Schutz vor Domain-Übernahme)
GitHub › persönliche Settings › Pages › **Add a domain** › `lueer.me` › den angezeigten TXT-Eintrag bei IONOS anlegen › „Verify“.
