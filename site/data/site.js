/* ==========================================================================
   SITE-INHALTE – hier von Hand pflegen.
   Der Lebenslauf (Werdegang, Ausbildung, Profiltext, Links) kommt automatisch
   aus data/cv.js (erzeugt von tools/cv_sync.py) – dort NICHTS von Hand ändern.
   ========================================================================== */
window.SITE = {
  rolle: "Business Transformation, B2B-Vertrieb und KI-Qualität",
  schwerpunkt:
    "Internationaler B2B-Vertrieb und Teamleitung, Key-Account-Management und verantwortungsvoller Einsatz von KI.",

  /* Kennzahlen im Hero (Quelle: Lebenslauf) */
  kennzahlen: [
    { wert: "20+", label: "Jahre internationaler technischer B2B-Vertrieb" },
    { wert: "≈ 200 Mio. €", label: "Umsatz- und Ergebnisverantwortung" }
  ],

  /* Profiltext der Homepage (hat Vorrang vor dem Profiltext aus dem PDF).
     Jeder Eintrag = ein Absatz. Auf null setzen, um wieder den PDF-Text zu nutzen. */
  profil: [
    "Vertriebs- und Prozessmanager mit über 20 Jahren Erfahrung im internationalen technischen B2B-Industrieumfeld. Erfahrung in Vertriebsinnendienst, Sales Support, Sales Operations, Key Account Management und Vertriebsleitung.",
    "Fachliche und disziplinarische Führung globaler Teams. Steuerung internationaler Kundenbeziehungen und eines Umsatz- und Ergebnisverantwortungsbereichs bis ca. 200 Mio. €. Erfolge in Margen- und Bestandsoptimierung, Prozessentwicklung und dem Ausbau strategischer Kundenbeziehungen. Branchenbezug: Großmotoren, Energieerzeugung, Bahn, Maschinenbau, Marine sowie Engineering, Defense und Aerospace. Zertifizierter KI Consultant."
  ],

  branchen: ["Großmotoren", "Energieerzeugung", "Bahn", "Maschinenbau", "Marine", "Engineering", "Defense", "Aerospace"],

  /* Profil-Links stehen direkt in index.html.
     Die E-Mail-Adresse ist bewusst NICHT hier, sondern verschleiert in js/mail.js. */

  /* Stationen, die im PDF fehlen, aber auf der Homepage erscheinen sollen.
     Werden automatisch chronologisch in den Werdegang einsortiert. */
  zusatzStationen: [
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
      "KI-Anwendungsfälle finden und einführen",
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
    }
  ]
};
