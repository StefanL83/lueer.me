/* Rendert die Startseite aus data/cv.js (automatisch) und data/site.js (manuell). */
(function () {
  "use strict";

  var CV = window.CV || {};
  var SITE = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

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

  var chevron = '<svg class="icon fold-chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';

  /* Aufklappbarer Eintrag: Überschrift (summary) + Punkte darunter.
     punkte: [{ text, hervorheben }] – ohne Punkte wird ein fester Eintrag ohne Aufklappen erzeugt. */
  function fold(opts) {
    var head =
      (opts.meta ? '<span class="fold-meta">' + opts.meta + "</span>" : "") +
      '<span class="fold-title">' + esc(opts.titel) + "</span>" +
      (opts.sub ? '<span class="fold-sub">' + esc(opts.sub) + "</span>" : "");
    var punkte = (opts.punkte || []).filter(function (p) { return p && p.text; });
    if (!punkte.length) return el("div", "fold fold-static", '<div class="fold-head">' + head + "</div>");

    var d = el("details", "fold");
    d.innerHTML =
      '<summary class="fold-head">' + head + chevron + "</summary>" +
      '<ul class="fold-points">' + punkte.map(function (p) {
        return "<li" + (p.hervorheben ? ' class="is-highlight"' : "") + ">" + esc(p.text) + "</li>";
      }).join("") + "</ul>";
    return d;
  }
  function textPunkte(arr, hervorheben) {
    return (arr || []).map(function (t) { return { text: t, hervorheben: !!hervorheben }; });
  }
  /* "A, B und C sowie D." → ["A", "B und C", "D"] */
  function splitAufzaehlung(s) {
    return String(s || "").replace(/\.\s*$/, "").split(/,\s+|\s+sowie\s+/).map(function (x) { return x.trim(); }).filter(Boolean);
  }

  /* ---------- Einfache Bindungen ---------- */
  var binds = { rolle: SITE.rolle, schwerpunkt: SITE.schwerpunkt };
  $$("[data-bind]").forEach(function (n) {
    var v = binds[n.getAttribute("data-bind")];
    if (v) n.textContent = v; else n.hidden = true;
  });
  $("#jahr").textContent = new Date().getFullYear();

  /* ---------- Kennzahlen ---------- */
  var stats = $("#stats");
  (SITE.kennzahlen || []).forEach(function (k) {
    stats.appendChild(el("div", "stat", "<dt>" + esc(k.label) + "</dt><dd>" + esc(k.wert) + "</dd>"));
  });

  /* ---------- Profil ---------- */
  var profil = $("#profil-text");
  (SITE.profil || CV.profil || []).forEach(function (t) { profil.appendChild(el("p", null, esc(t))); });
  var branchen = $("#branchen");
  (SITE.branchen || []).forEach(function (b) { branchen.appendChild(el("li", null, esc(b))); });

  /* ---------- Werdegang ----------
     Je Station die wichtigsten Punkte: bis zu 2 Aufgaben + bis zu 2 Erfolge. */
  var tl = $("#timeline");
  function startKey(z) {
    var m = /^(?:(\d{2})\/)?(\d{4})/.exec(z || "");
    return m ? Number(m[2]) * 100 + Number(m[1] || 1) : 0;
  }
  (CV.berufserfahrung || []).concat(SITE.zusatzStationen || [])
    .sort(function (a, b) { return startKey(b.zeitraum) - startKey(a.zeitraum); })
    .forEach(function (s) {
      var punkte = textPunkte((s.aufgaben || []).slice(0, 2)).concat(textPunkte((s.highlights || []).slice(0, 2), true));
      var li = el("li", "tl-item reveal" + (punkte.length ? "" : " tl-muted"));
      li.appendChild(fold({ meta: esc(s.zeitraum), titel: s.titel, sub: s.organisation, punkte: punkte }));
      tl.appendChild(li);
    });

  /* ---------- Kompetenzen (ohne Bewertung) ---------- */
  var komp = (SITE.kompetenzen || []).slice();
  var meth = {};
  (CV.methoden || []).forEach(function (m) { meth[m.label] = splitAufzaehlung(m.text); });
  var sysSpr = (meth.Systeme || []).concat(meth.Sprachen || []);
  if (sysSpr.length) komp.push({ gruppe: "Systeme & Sprachen", punkte: sysSpr });
  var staerken = [];
  (CV.staerken || []).forEach(function (s) { staerken = staerken.concat(String(s).split(/\s+·\s+/)); });
  if (staerken.length) komp.push({ gruppe: "Persönliche Stärken", punkte: staerken });

  var kg = $("#komp-grid");
  komp.forEach(function (g) {
    var f = fold({ titel: g.gruppe, punkte: textPunkte(g.punkte) });
    f.classList.add("card", "reveal");
    kg.appendChild(f);
  });

  /* ---------- Aus- und Weiterbildung ----------
     Weiterbildungen mit Beschreibung einzeln; Studium/Ausbildung ohne Beschreibung gebündelt. */
  var edu = $("#ausbildung");
  var basis = [];
  (CV.ausbildung || []).forEach(function (a) {
    if (!a.beschreibung) {
      basis.push({ text: a.titel + " – " + a.organisation + " (" + a.zeitraum + ")" });
      return;
    }
    var status = (a.zusatz || "").toLowerCase();
    var meta = esc(a.zeitraum) + (a.zusatz ? ' <span class="edu-badge' + (status.indexOf("lauf") > -1 ? " laufend" : "") + '">' + esc(a.zusatz) + "</span>" : "");
    var li = el("li", "reveal");
    li.appendChild(fold({ meta: meta, titel: a.titel, sub: a.organisation, punkte: textPunkte(splitAufzaehlung(a.beschreibung)) }));
    edu.appendChild(li);
  });
  if (basis.length) {
    var li = el("li", "reveal");
    li.appendChild(fold({ meta: "Grundlagen", titel: "Studium und Ausbildung", punkte: basis }));
    edu.appendChild(li);
  }

  /* ---------- Projekte: nur Screenshots, verlinkt auf die Detailseite ---------- */
  var pl = $("#projekte-liste");
  (SITE.projekte || []).forEach(function (p) {
    if (!safeLocal(p.seite) || !safeLocal(p.bild)) return;
    pl.appendChild(el("li", "shot reveal",
      '<a href="' + esc(p.seite) + '">' +
        '<img src="' + esc(p.bild) + '" alt="' + esc(p.bildAlt || "") + '" width="640" height="1139" loading="lazy" decoding="async">' +
        '<span class="shot-caption">' + esc(p.titel) + "</span>" +
      "</a>"));
  });

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

  /* ---------- Dezentes Scroll-Reveal ---------- */
  var items = $$(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(function (i) { i.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (i) { io.observe(i); });
  }
})();
