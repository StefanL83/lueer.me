/* ==========================================================================
   SITE-INHALTE – hier von Hand pflegen.
   Der Lebenslauf (Werdegang, Ausbildung, Profiltext, Links) kommt automatisch
   aus data/cv.js (erzeugt von tools/cv_sync.py) – dort NICHTS von Hand ändern.
   Englische Fassung: data/site.en.js (gleiche Struktur) – Änderungen dort mitpflegen.
   ========================================================================== */
window.SITE = {
  rolle: "Business Transformation, B2B-Vertrieb und KI-Qualität",
  schwerpunkt:
    "Internationaler B2B-Vertrieb und Teamleitung, Key-Account-Management und verantwortungsvoller Einsatz von KI.",

  /* Kennzahlen im Hero (Quelle: Lebenslauf) */
  kennzahlen: [
    { wert: "20+", label: "Jahre internationaler technischer B2B-Vertrieb" },
    { wert: "≈ 200 Mio. €", label: "Umsatz- und Ergebnis­verantwortung" },
    { wert: "10+", label: "Jahre Key-Account-Management" },
    { wert: "≈ 8", label: "Mitarbeitende fachlich und disziplinarisch geführt" }
  ],

  /* Profiltext der Homepage (hat Vorrang vor dem Profiltext aus dem PDF).
     Jeder Eintrag = ein Absatz. Auf null setzen, um wieder den PDF-Text zu nutzen. */
  profil: [
    "Ich verbinde über 20 Jahre internationalen technischen B2B-Vertrieb mit einem klaren Blick für Prozesse und mit fundierter KI-Kompetenz. Bei Tenneco / Federal-Mogul Burscheid GmbH habe ich jede Stufe des Vertriebs selbst durchlaufen: von der Ausbildung über Sales Support und Key Account Management bis in die Vertriebsleitung. Zuletzt habe ich den weltweiten Vertrieb von Ingenieurdienstleistungen für Maschinenbau, Bahn, Defense und Aerospace neu aufgestellt.",
    "Als Vertriebsleiter habe ich ein globales Team mit rund acht Mitarbeitenden geführt und einen Umsatz von 200 Mio. € verantwortet. Strategische Kundenbeziehungen in Europa, Asien und den USA habe ich gezielt ausgebaut.",
    "Als zertifizierter KI Consultant bringe ich beides zusammen: Ich finde KI-Anwendungsfälle mit echtem Geschäftsnutzen, führe sie strukturiert im Unternehmen ein und achte dabei auf Qualität, Datenschutz und den EU AI Act. Wie das in der Praxis aussieht, zeigen meine Projekte."
  ],

  branchen: ["Großmotoren", "Energieerzeugung", "Bahn", "Maschinenbau", "Marine", "Engineering", "Defense", "Aerospace"],

  /* Profil-Links stehen direkt in index.html.
     Die E-Mail-Adresse ist bewusst NICHT hier, sondern verschleiert in js/mail.js. */

  /* Stationen, die im PDF fehlen, aber auf der Homepage erscheinen sollen.
     Werden automatisch chronologisch in den Werdegang einsortiert. */
  /* Status einer Weiterbildung abweichend vom PDF (Schlüssel = Anfang des Titels).
     Kann entfallen, sobald das Master-CV-PDF den neuen Status enthält. */
  ausbildungStatus: { "KI in Unternehmen": "abgeschlossen" },

  zusatzStationen: [
    {
      titel: "KI-Weiterbildung",
      organisation: "Business Trends Academy BTA GmbH",
      zeitraum: "08/2026 – 11/2026",
      alle: true,
      aufgaben: [
        "KI-gestütztes Changemanagement (08/2026 – 09/2026)",
        "KI Consultant (09/2026 – 10/2026)",
        "KI in Unternehmen: Strategische Anwendung und Prozessintegration (10/2026 – 11/2026)"
      ],
      highlights: []
    },
    {
      titel: "Berufliche Neuorientierung",
      organisation: "",
      zeitraum: "02/2026 – 07/2026",
      aufgaben: [],
      highlights: []
    }
  ],

  /* ------------------------------------------------------------------------
     KOMPETENZEN – kompakt, ohne Bewertung. Jede Gruppe wird als aufklappbare
     Überschrift mit ihren Punkten gezeigt (mindestens 2 Punkte je Gruppe).
     Automatisch ergänzt: „Systeme & Sprachen“ und „Persönliche Stärken“
     aus dem Lebenslauf (data/cv.js).
     Quelle: Kompetenzprofil, bestätigt am 05.11.2026.
     ------------------------------------------------------------------------ */
  kompetenzen: [
    { gruppe: "Vertrieb & Markt", punkte: [
      "B2B-Vertrieb und Kundenentwicklung",
      "Strategisches Key- und Global-Account-Management",
      "Preis-, Vertrags- und Konditionsverhandlungen",
      "Internationale Geschäftsentwicklung",
      "Strategie und Positionierung"
    ] },
    { gruppe: "Führung & Transformation", punkte: [
      "Führung und Aufbau internationaler Teams",
      "Organisation und Change Management",
      "Prozessanalyse und -optimierung",
      "Stakeholder- und Schnittstellenmanagement",
      "Audits, Prüfprozesse und Governance"
    ] },
    { gruppe: "Zahlen & Steuerung", punkte: [
      "KPIs, Forecasting und Management-Reporting",
      "Umsatz-, Ergebnis- und Margensteuerung",
      "Budgetplanung und Kostensteuerung",
      "ABC/XYZ-Analyse und Bestandsoptimierung",
      "Markt- und Datenanalysen"
    ] },
    { gruppe: "KI & Digitalisierung", punkte: [
      "Einführung KI-gestützter Geschäftsprozesse",
      "KI-Anwendungsfälle mit Geschäftsnutzen finden",
      "Prompting und LLM-Praxis",
      "KI-Qualität und Evaluation",
      "Wissensmanagement",
      "Agenten, Automatisierung und KI-gestützte Prototypen"
    ] }
  ],

  /* ------------------------------------------------------------------------
     PROJEKTE – auf der Startseite erscheint nur der Screenshot, verlinkt auf
     die Detailseite. Neues Projekt: Screenshot nach assets/projekte/ legen,
     Detailseite nach dem Muster projekte/check.html anlegen, Eintrag anhängen.
     ------------------------------------------------------------------------ */
  projekte: [
    {
      titel: "CHECK! – KI-gestützte Faktenprüfung",
      bild: "assets/projekte/check-irrefuehrend.webp",
      bildAlt: "CHECK!-App: Die Aussage „Die Arbeitslosenquote in Deutschland ist 2025 auf einen historischen Tiefstand gefallen“ wird als „Irreführend“ eingeordnet",
      seite: "projekte/check.html"
    },
    {
      titel: "Vertriebs-CRM – Prototyp für den B2B-Vertrieb",
      bild: "assets/projekte/crm-mobil.webp",
      bildAlt: "Vertriebs-CRM auf dem Smartphone: KPI-Dashboard mit Umsatz, Plan, Erwartung und Wachstum",
      seite: "projekte/crm.html"
    },
    {
      titel: "Radwerk Mitte – Website vom PRD zum Prototyp",
      bild: "assets/projekte/radwerk-mobil.webp",
      bildAlt: "Website-Entwurf Radwerk Mitte auf dem Smartphone: „Räder für dein ganzes Team – mit einem Ansprechpartner vor Ort.“",
      seite: "projekte/radwerk.html"
    }
  ]
};
