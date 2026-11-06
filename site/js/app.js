/* Rendert die Startseite aus
     data/cv.js     (Deutsch, automatisch aus dem Master-CV-PDF)
     data/cv.en.js  (Englisch, aus dem englischen Master-CV)
     data/site.js / data/site.en.js (von Hand gepflegt)
   und rendert bei jedem Sprachwechsel ("langchange") neu. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var I18N = window.I18N || { t: function (k, f) { return f; }, lang: "de" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  /* Nur relative Ziele zulassen (kein javascript:, data:, fremde Hosts) */
  function safeLocal(url) {
    return typeof url === "string" && !/^[a-z][a-z0-9+.-]*:/i.test(url) && url.indexOf("//") !== 0;
  }
  function textPunkte(arr, hervorheben) {
    return (arr || []).map(function (t) { return { text: t, hervorheben: !!hervorheben }; });
  }
  /* "A, B und C sowie D." → ["A", "B und C", "D"]; Listen bleiben Listen */
  function splitAufzaehlung(s) {
    if (Array.isArray(s)) return s.slice();
    return String(s || "").replace(/\.\s*$/, "").split(/,\s+|\s+sowie\s+/).map(function (x) { return x.trim(); }).filter(Boolean);
  }
  function startKey(z) {
    var m = /^(?:(\d{2})\/)?(\d{4})/.exec(z || "");
    return m ? Number(m[2]) * 100 + Number(m[1] || 1) : 0;
  }
  function data(lang) {
    var en = lang === "en";
    return {
      CV: (en ? window.CV_EN : window.CV) || window.CV || {},
      SITE: (en ? window.SITE_EN : window.SITE) || window.SITE || {}
    };
  }

  function render() {
    var d = data(I18N.lang), CV = d.CV, SITE = d.SITE, t = I18N.t;

    /* Kopfbereich */
    var binds = { rolle: SITE.rolle, schwerpunkt: SITE.schwerpunkt };
    $$("[data-bind]").forEach(function (n) {
      var v = binds[n.getAttribute("data-bind")];
      n.textContent = v || ""; n.hidden = !v;
    });
    var stats = $("#stats"); stats.innerHTML = "";
    (SITE.kennzahlen || []).forEach(function (k) {
      stats.appendChild(el("div", "stat", "<dt>" + esc(k.label) + "</dt><dd>" + esc(k.wert) + "</dd>"));
    });

    /* Profil */
    var profil = $("#profil-text"); profil.innerHTML = "";
    (SITE.profil || CV.profil || []).forEach(function (p) { profil.appendChild(el("p", null, esc(p))); });
    var branchen = $("#branchen"); branchen.innerHTML = "";
    (SITE.branchen || []).forEach(function (b) { branchen.appendChild(el("li", null, esc(b))); });

    /* Werdegang: je Station bis zu 2 Aufgaben + bis zu 2 Erfolge */
    var tl = $("#timeline"); tl.innerHTML = "";
    (CV.berufserfahrung || []).concat(SITE.zusatzStationen || [])
      .sort(function (a, b) { return startKey(b.zeitraum) - startKey(a.zeitraum); })
      .forEach(function (s) {
        var punkte = textPunkte((s.aufgaben || []).slice(0, 2)).concat(textPunkte((s.highlights || []).slice(0, 2), true));
        var li = el("li", "tl-item" + (punkte.length ? "" : " tl-muted"));
        li.appendChild(window.Fold.create({ meta: esc(s.zeitraum), titel: s.titel, sub: s.organisation, punkte: punkte }));
        tl.appendChild(li);
      });

    /* Kompetenzen (ohne Bewertung) */
    var komp = (SITE.kompetenzen || []).slice();
    var meth = {};
    (CV.methoden || []).forEach(function (m) { meth[m.key || m.label] = splitAufzaehlung(m.text); });
    var sysSpr = (meth.Systeme || []).concat(meth.Sprachen || []);
    if (sysSpr.length) komp.push({ gruppe: t("komp.systeme", "Systeme & Sprachen"), punkte: sysSpr });
    var staerken = [];
    (CV.staerken || []).forEach(function (s) { staerken = staerken.concat(String(s).split(/\s+[·|]\s+/)); });
    if (staerken.length) komp.push({ gruppe: t("komp.staerken", "Persönliche Stärken"), punkte: staerken });
    var kg = $("#komp-grid"); kg.innerHTML = "";
    komp.forEach(function (g) {
      kg.appendChild(window.Fold.create({ titel: g.gruppe, punkte: textPunkte(g.punkte) }));
    });

    /* Aus- und Weiterbildung: Weiterbildungen einzeln, Studium/Ausbildung gebündelt */
    var statusOverride = SITE.ausbildungStatus || {};
    var edu = $("#ausbildung"); edu.innerHTML = "";
    var basis = [];
    (CV.ausbildung || []).forEach(function (a) {
      if (!a.beschreibung || !a.beschreibung.length) {
        basis.push({ text: a.titel + " – " + a.organisation + " (" + a.zeitraum + ")" });
        return;
      }
      var zusatz = a.zusatz || "";
      Object.keys(statusOverride).forEach(function (prefix) { if (a.titel.indexOf(prefix) === 0) zusatz = statusOverride[prefix]; });
      var laufend = /lauf|ongoing/i.test(zusatz);
      var meta = esc(a.zeitraum) + (zusatz ? ' <span class="edu-badge' + (laufend ? " laufend" : "") + '">' + esc(zusatz) + "</span>" : "");
      var li = el("li");
      li.appendChild(window.Fold.create({ meta: meta, titel: a.titel, sub: a.organisation, punkte: textPunkte(splitAufzaehlung(a.beschreibung)) }));
      edu.appendChild(li);
    });
    if (basis.length) {
      var li = el("li");
      li.appendChild(window.Fold.create({ meta: esc(t("wb.basis.meta", "Grundlagen")), titel: t("wb.basis.titel", "Studium und Ausbildung"), punkte: basis }));
      edu.appendChild(li);
    }

    /* Projekte: nur Screenshots, verlinkt auf die Detailseite */
    var pl = $("#projekte-liste"); pl.innerHTML = "";
    (SITE.projekte || []).forEach(function (p) {
      if (!safeLocal(p.seite) || !safeLocal(p.bild)) return;
      pl.appendChild(el("li", "shot",
        '<a href="' + esc(p.seite) + '">' +
          '<img src="' + esc(p.bild) + '" alt="' + esc(p.bildAlt || "") + '" width="640" height="1139" loading="lazy" decoding="async">' +
          '<span class="shot-caption">' + esc(p.titel) + "</span>" +
        "</a>"));
    });
  }

  render();
  document.addEventListener("langchange", render);
  $("#jahr").textContent = new Date().getFullYear();

  /* ---------- Navigation (mobil) ---------- */
  var toggle = $(".nav-toggle"), navList = $("#nav-list");
  function closeNav() { navList.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", function () {
    var open = navList.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navList.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && navList.classList.contains("open")) { closeNav(); toggle.focus(); } });
  document.addEventListener("click", function (e) { if (!e.target.closest(".main-nav")) closeNav(); });

  /* Aktiver Abschnitt in der Navigation */
  if ("IntersectionObserver" in window) {
    var navLinks = $$(".nav-list a");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href") === "#" + en.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });
  }
})();
