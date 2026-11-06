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
Repository › Settings › Pages › Custom domain: `lueer.me` (ist eingetragen) ›
nach der DNS-Prüfung **Enforce HTTPS** aktivieren (das Zertifikat erstellt GitHub automatisch, kann bis zu 24 h dauern).

## 4. Domain verifizieren (Schutz vor Domain-Übernahme)
GitHub › persönliche Settings › Pages › **Add a domain** › `lueer.me` › den angezeigten TXT-Eintrag bei IONOS anlegen › „Verify“.

## 5. Zertifikate einschränken (CAA, empfohlen)
Legt fest, dass nur Let's Encrypt (wird von GitHub Pages genutzt) Zertifikate für lueer.me ausstellen darf.

| Typ | Hostname | Wert |
|---|---|---|
| CAA | @ | 0 issue "letsencrypt.org" |

Hinweis: Falls IONOS-Dienste (z. B. SSL-Zertifikat aus dem IONOS-Paket) für `lueer.me` genutzt werden,
zusätzlich deren Aussteller eintragen – sonst CAA weglassen.

## 6. E-Mail-Absender schützen (optional)
Aktuell ist `_dmarc.lueer.me` auf `p=none` (nur beobachten). Wenn alle legitimen Absender (IONOS) per SPF/DKIM
abgedeckt sind, schrittweise auf `p=quarantine` und später `p=reject` erhöhen – das erschwert E-Mail-Fälschungen im Namen von lueer.me.
