/* Sprachumschaltung Deutsch/Englisch.
   - Deutsche Texte stehen im HTML (funktioniert auch ohne JavaScript) und werden beim Start eingelesen.
   - Englische Texte stehen unten in EN. Elemente werden markiert mit
       data-i18n="schlüssel"            → Textinhalt
       data-i18n-html="schlüssel"       → HTML-Inhalt (nur eigene, feste Texte)
       data-i18n-attr="attr:schlüssel;attr2:schlüssel2" → Attribute (aria-label, alt, content …)
   - Wahl wird im Browser gespeichert; ?lang=en / ?lang=de in der Adresse hat Vorrang.
   - Andere Skripte hören auf das Ereignis "langchange" und nutzen I18N.t(schlüssel). */
(function () {
  "use strict";

  var EN = {
    /* Allgemein */
    "skip": "Skip to content",
    "brand.top": "Stefan Lüer – back to top",
    "brand.home": "Stefan Lüer – to the home page",
    "nav.label": "Main navigation",
    "nav.menu": "Menu",
    "nav.profil": "Profile",
    "nav.werdegang": "Career",
    "nav.kompetenzen": "Skills",
    "nav.weiterbildung": "Education",
    "nav.projekte": "Projects",
    "nav.kontakt": "Contact",
    "theme": "Toggle color scheme",
    "newtab": " (opens in a new tab)",
    "footer.private": "Private online portfolio",
    "footer.privacy": "Privacy policy (German)",

    /* Startseite */
    "meta.title": "Stefan Lüer – International B2B Sales, Key Account Management & AI",
    "meta.desc": "Stefan Lüer: more than 20 years of international technical B2B sales, team leadership and key account management – combined with sound AI expertise. Career, skills, education and projects.",
    "hero.cta": "View career",
    "social": "Profiles",
    "portrait": "Portrait of Stefan Lüer",
    "profil.title": "Sales, operations and AI – with an eye for quality",
    "profil.branchen": "Industry experience",
    "wd.title": "Professional experience",
    "fold.hint": "Click or hover to expand.",
    "komp.title": "What I bring",
    "komp.systeme": "Systems & languages",
    "komp.staerken": "Personal strengths",
    "wb.kicker": "Education & training",
    "wb.title": "AI training, degree and vocational training",
    "wb.basis.meta": "Foundation",
    "wb.basis.titel": "Degree and vocational training",
    "proj.title": "Work samples",
    "proj.intro": "Click the image for details and demo.",
    "kontakt.title": "Let’s talk",
    "kontakt.intro": "Whether sales organization, key account management or the responsible use of AI – I look forward to hearing from you.",
    "kontakt.mail": "Send an e-mail",
    "kontakt.show": "Show e-mail address",
    "kontakt.subject": "Contact via lueer.me",

    /* Bildergalerie */
    "lb.open": "Enlarge image",
    "lb.close": "Close",
    "lb.prev": "Previous image",
    "lb.next": "Next image",
    "lb.label": "Image viewer",
    "lb.of": "of",

    /* CHECK!-Seite */
    "check.meta.title": "CHECK! – AI-assisted fact checking · Project by Stefan Lüer",
    "check.meta.desc": "CHECK!: AI-assisted fact checking with source matching, second review and gold-set measurement. Product ownership, verification logic and quality assurance: Stefan Lüer.",
    "check.back": "All projects",
    "check.status": "Prototype · pilot operation",
    "check.since": "since 2026",
    "check.stand": "As of 5 Nov 2026",
    "check.title": "CHECK! – AI-assisted fact checking",
    "check.sub": "From product concept to measured prototype: claims from politics, media and everyday life are researched, matched against sources and classified transparently.",
    "check.rolle": "<strong>My role:</strong> product ownership, requirements, verification logic, quality assurance and AI-assisted implementation.",
    "check.ausgangslage": "Starting point",
    "check.ausgangslage.text": "Claims should be checked quickly, transparently and with reliable sources – without a language model proclaiming “truth” unchecked. When in doubt, an honest “Unclear” is better than a wrong “Confirmed”.",
    "check.vorgehen": "Approach",
    "check.v1": "Product concept, branding and UX with five verdicts: Confirmed, False, Misleading, Unclear, Not verifiable",
    "check.v2": "Verification chain: web research, verbatim matching of every passage against its source, independent second review that looks for meaning traps",
    "check.v3": "Verdicts only with sufficient evidence, otherwise “Unclear” (fail-closed); “Strong” only for sources from a vetted registry",
    "check.v4": "Official statistics straight from GENESIS-Online (Federal Statistical Office) instead of older press releases",
    "check.v5": "Source archiving via archive.org, daily spending cap, feedback function and chat assistant",
    "check.v6": "Independent architecture review by a second AI",
    "check.ergebnis": "Outcome",
    "check.e1": "Gold set of 100 test claims with defined target verdicts; every development step is measured against it in paid test runs",
    "check.e2": "Next step: fewer overly cautious verdicts without increasing the error rate",
    "check.e3": "New user interface in React and TypeScript, pilot operation in the cloud",
    "check.einblicke": "Insights",
    "check.cap1": "Input: claim, text or link",
    "check.cap2": "Verdict “False” with explanation and source",
    "check.cap3": "Verdict “Misleading”: the core is true, the overall impression is not",
    "check.alt1": "CHECK! start page: input field for a claim, a text or a link",
    "check.alt2": "CHECK! result: “Mount Everest is in Europe” is classified as “False”, with explanation and source reference",
    "check.alt3": "CHECK! result: a claim about the unemployment rate is classified as “Misleading”",
    "check.shots.note": "Screenshots from the offline demo with test data (German user interface).",
    "check.demo": "Try the demo",
    "check.demo.text": "The demo shows the current user interface with prepared test data (in German). No real check takes place and no data is transmitted.",
    "check.demo.title": "CHECK! offline demo with test data",
    "check.demo.full": "Demo in full screen",
    "check.tags": "Keywords",
    "check.tag1": "Product management",
    "check.tag3": "Quality assurance"
  };

  var root = document.documentElement;
  var DE = {};          /* wird aus dem HTML eingelesen */
  var lang = "de";

  function initial() {
    var m = /[?&]lang=(de|en)\b/.exec(window.location.search);
    if (m) return m[1];
    try { var s = localStorage.getItem("lang"); if (s === "de" || s === "en") return s; } catch (e) { /* kein Speicher */ }
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "de";
    return /^de\b/i.test(nav) ? "de" : "en";
  }

  function capture() {
    document.querySelectorAll("[data-i18n]").forEach(function (n) {
      var k = n.getAttribute("data-i18n"); if (!(k in DE)) DE[k] = n.textContent;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (n) {
      var k = n.getAttribute("data-i18n-html"); if (!(k in DE)) DE[k] = n.innerHTML;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (n) {
      n.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"); if (p.length === 2 && !(p[1] in DE)) DE[p[1]] = n.getAttribute(p[0]) || "";
      });
    });
  }

  function t(key, fallback) {
    var dict = lang === "en" ? EN : DE;
    if (key in dict) return dict[key];
    return fallback != null ? fallback : (DE[key] || key);
  }

  function apply() {
    root.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (n) { n.textContent = t(n.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-html]").forEach(function (n) { n.innerHTML = t(n.getAttribute("data-i18n-html")); });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (n) {
      n.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"); if (p.length === 2) n.setAttribute(p[0], t(p[1]));
      });
    });
    var title = document.querySelector("title[data-i18n]");
    if (title) document.title = title.textContent;
    document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
      var other = lang === "en" ? "de" : "en";
      b.textContent = other.toUpperCase();
      b.setAttribute("lang", other);
      b.setAttribute("aria-label", other === "en" ? "Switch to English" : "Auf Deutsch umschalten");
    });
  }

  function set(l, announce) {
    lang = l === "en" ? "en" : "de";
    try { localStorage.setItem("lang", lang); } catch (e) { /* kein Speicher */ }
    apply();
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
    if (announce) {
      var live = document.getElementById("lang-live");
      if (!live) {
        live = document.createElement("p");
        live.id = "lang-live"; live.className = "sr-only"; live.setAttribute("aria-live", "polite");
        document.body.appendChild(live);
      }
      live.textContent = lang === "en" ? "Page switched to English" : "Seite auf Deutsch umgestellt";
    }
  }

  capture();
  lang = initial();
  apply();

  document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { set(lang === "en" ? "de" : "en", true); });
  });

  window.I18N = { t: t, get lang() { return lang; }, set: set };
})();
