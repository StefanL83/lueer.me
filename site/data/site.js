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
     KOMPETENZEN – Quelle: Kollektiv-Kompetenzprofil (Stand 04.11.2026),
     von Stefan Lüer am 05.11.2026 bestätigt und für das Web freigegeben.
     Optional live aus Google Sheets: Tabelle über „Datei › Freigeben ›
     Im Web veröffentlichen“ als CSV veröffentlichen und die URL bei
     sheetCsvUrl eintragen. Dann werden nur Zeilen dieser Person
     (Personen-ID) mit „Freigabe Web? = Ja“ angezeigt; die Liste unten
     dient als Fallback, falls das Sheet nicht erreichbar ist.
     Stufen: "Kern" | "Ergänzung" | "Im Aufbau"  (Grenze/Nicht angegeben werden nicht gezeigt)
     ------------------------------------------------------------------------ */
  kompetenzen: {
    sheetCsvUrl: null,
    personenId: "stefan_l",
    liste: [
      { id: "f3",  gruppe: "Strategie und Markt", name: "B2B-Vertrieb, Kundenentwicklung", stufe: "Kern", beleg: "Internationale Key Accounts, Vertriebssteuerung und Rahmenverträge" },
      { id: "f1",  gruppe: "Strategie und Markt", name: "Strategie und Positionierung", stufe: "Ergänzung", beleg: "Strategische Kundenentwicklung, Positionierung und Transformationsprioritäten" },
      { id: "f26", gruppe: "Strategie und Markt", name: "Markt- und Branchenexpertise", stufe: "Ergänzung", beleg: "B2B-Technikbranchen, Service- und Aftermarketgeschäft" },
      { id: "f28", gruppe: "Strategie und Markt", name: "Internationale Geschäftsentwicklung", stufe: "Ergänzung", beleg: "Internationale Kunden- und Konzernstrukturen" },
      { id: "f2",  gruppe: "Strategie und Markt", name: "Produktkonzeption, Marktreife", stufe: "Im Aufbau", beleg: "MVP-Anforderungen, UX-Konzepte und Produktbewertung" },

      { id: "f4",  gruppe: "Transformation und Prozesse", name: "Führung und Teamaufbau", stufe: "Kern", beleg: "Fachliche und disziplinarische Vertriebsführung" },
      { id: "f5",  gruppe: "Transformation und Prozesse", name: "Organisation und Change", stufe: "Ergänzung", beleg: "Change, Restrukturierung und Organisationsentwicklung" },
      { id: "f6",  gruppe: "Transformation und Prozesse", name: "Prozessanalyse, Optimierung", stufe: "Ergänzung", beleg: "Sales Operations, Prozessoptimierung und Problemanalyse" },
      { id: "f7",  gruppe: "Transformation und Prozesse", name: "Stakeholder und Zusammenarbeit", stufe: "Ergänzung", beleg: "Stakeholder- und Erwartungsmanagement" },
      { id: "f8",  gruppe: "Transformation und Prozesse", name: "Strukturierte Dokumentation", stufe: "Ergänzung", beleg: "PRDs, Wissensübergaben, strukturierte Dokumentation" },
      { id: "f32", gruppe: "Transformation und Prozesse", name: "Audits, Prüfprozesse und Governance", stufe: "Ergänzung", beleg: "QA, Quellenprüfung, Human-in-the-Loop und Freigabegates" },
      { id: "f21", gruppe: "Transformation und Prozesse", name: "Training und Wissenstransfer", stufe: "Im Aufbau", beleg: "Lerninhalte und Wissenstransfer konzeptionell" },
      { id: "f22", gruppe: "Transformation und Prozesse", name: "Projekt- und Programmsteuerung (PMO, Agile)", stufe: "Im Aufbau", beleg: "Iterative Projektsteuerung, Tests, Übergaben und Freigaben" },
      { id: "f29", gruppe: "Transformation und Prozesse", name: "Requirements Engineering und Prozessmodellierung", stufe: "Im Aufbau", beleg: "Business Requirements, Akzeptanzkriterien und Prozesslogik" },

      { id: "f9",  gruppe: "KI und Digitalisierung", name: "KI-Anwendungsfälle, Enablement", stufe: "Ergänzung", beleg: "Business-Problem in KI-Use-Cases übersetzen" },
      { id: "f10", gruppe: "KI und Digitalisierung", name: "Prompting und LLM-Praxis", stufe: "Ergänzung", beleg: "Superprompts, iterative Verbesserung und Gegenprüfung" },
      { id: "f11", gruppe: "KI und Digitalisierung", name: "KI-Qualität und Evaluation", stufe: "Ergänzung", beleg: "LLM-Evaluation, Testmatrizen, Qualitätssicherung und Evidenzprüfung" },
      { id: "f12", gruppe: "KI und Digitalisierung", name: "Wissensmanagement", stufe: "Ergänzung", beleg: "Notion-Wissensarchitektur, Quellenregister, Versionierung" },
      { id: "f13", gruppe: "KI und Digitalisierung", name: "Agenten und Automatisierung", stufe: "Im Aufbau", beleg: "n8n-/GitHub-Workflows und Automatisierung" },
      { id: "f33", gruppe: "KI und Digitalisierung", name: "KI-gestützte Prototypen und Vibe Coding", stufe: "Im Aufbau", beleg: "KI-gestütztes HTML-/App-Prototyping" },
      { id: "f34", gruppe: "KI und Digitalisierung", name: "Cloud, APIs und Tool-Integration", stufe: "Im Aufbau", beleg: "GitHub, Railway, Schnittstellen und Integrationskonzepte" },

      { id: "f23", gruppe: "Zahlen und Wirtschaft", name: "KPIs und Controlling", stufe: "Kern", beleg: "Sales KPI, Forecast und Management-Reporting" },
      { id: "f19", gruppe: "Zahlen und Wirtschaft", name: "Pricing und Preisgestaltung", stufe: "Kern", beleg: "Preis- und Vertragsverhandlung" },
      { id: "f18", gruppe: "Zahlen und Wirtschaft", name: "Analysen: Markt, Daten", stufe: "Ergänzung", beleg: "Markt-, Wettbewerbs- und Datenanalysen" },
      { id: "f38", gruppe: "Zahlen und Wirtschaft", name: "Budgetplanung, Forecasting und Kostensteuerung", stufe: "Ergänzung", beleg: "Kostenbewertung, KPI, Reporting und Budgetlogik" },
      { id: "f24", gruppe: "Zahlen und Wirtschaft", name: "Business Case und ROI", stufe: "Im Aufbau", beleg: "KI-Kosten, Business Cases, Monetarisierungsmodelle" },
      { id: "f39", gruppe: "Zahlen und Wirtschaft", name: "Finanzanalysen und Szenariomodelle", stufe: "Im Aufbau", beleg: "Benchmark-Auswertungen und Szenarien" },

      { id: "f14", gruppe: "Kommunikation", name: "Visualisierung, Content", stufe: "Ergänzung", beleg: "Präsentation, Informationsdesign, Prototyp-UI" },
      { id: "f35", gruppe: "Kommunikation", name: "PR, Presse und redaktionelle Inhalte", stufe: "Im Aufbau", beleg: "Kommunikations- und Präsentationskonzepte" },

      { id: "f45", gruppe: "Fachdisziplinen", name: "Produktion, Lager und Materialwirtschaft", stufe: "Ergänzung", beleg: "Operations- und Angebots-/Auftragsprozesse" }
    ]
  },

  /* ------------------------------------------------------------------------
     PROJEKTE / ARBEITSNACHWEISE – neue Projekte einfach als weiteres Objekt
     anhängen. Felder: titel, untertitel, status, bild, bildAlt, rolle,
     ausgangslage, vorgehen[], ergebnis[], tags[], links[{label,url,typ}]
     typ: "primaer" | "sekundaer"
     ------------------------------------------------------------------------ */
  projekte: [
    {
      titel: "CHECK! – KI-gestützte Faktencheck-Plattform",
      untertitel: "Vom Produktkonzept zum evaluierten Prototyp",
      status: "Prototyp · Pilotphase",
      zeitraum: "2026",
      bild: "assets/check-preview.webp",
      bildAlt: "CHECK!-App-Ansicht: geprüfte Aussage mit Bewertung „Irreführend“, Evidenzstärke und Anzahl geprüfter Quellen",
      rolle: "Produktverantwortung, Anforderungen, Prüflogik, Qualitätssicherung und KI-gestützte Umsetzung",
      ausgangslage:
        "Behauptungen aus Politik und Alltag sollen schnell, nachvollziehbar und mit belastbaren Quellen geprüft werden – ohne dass ein Sprachmodell ungeprüft „Wahrheit“ verkündet.",
      vorgehen: [
        "Produktkonzept, Markenauftritt und UX für eine verständliche Ergebnisdarstellung mit fünf Bewertungsstufen (Belegt, Falsch, Irreführend, Unklar, Nicht prüfbar)",
        "Evidence- & Verdict-Gate: Urteile nur bei ausreichender Evidenz, sonst Fail-closed",
        "Quellen-Registry mit Default-deny, Zitatprüfung und Human-in-the-Loop-Freigaben",
        "Unabhängiges Architektur-Review durch eine Zweit-KI"
      ],
      ergebnis: [
        "Benchmark mit 50 label-freien Testaussagen",
        "44 deterministische Unit-Tests für Prüf- und Sicherheitslogik",
        "Klickbarer Demonstrator mit vorbereiteten Beispielaussagen"
      ],
      tags: ["Produktmanagement", "LLM-Evaluation", "Qualitätssicherung", "Prompt Engineering", "Prototyping"],
      /* Eingebetteter Demonstrator (Offline-Demo, direkt auf der Homepage) */
      demo: {
        src: "projects/check/index.html",
        titel: "CHECK! Demonstrator – Offline-Demo mit vorbereiteten Beispielaussagen",
        hinweis: "Offline-Demo: Wählen Sie eine der vorbereiteten Beispielaussagen, um den Prüfablauf und die Ergebnisdarstellung zu erleben."
      },
      links: [
        { label: "Demonstrator im Vollbild", url: "projects/check/index.html", typ: "sekundaer" }
      ]
    }
  ]
};
