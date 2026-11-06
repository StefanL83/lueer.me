/* Rendert die Homepage aus data/cv.js (automatisch) und data/site.js (manuell). */
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
    var d = el("div", "stat");
    d.innerHTML = "<dt>" + esc(k.label) + "</dt><dd>" + esc(k.wert) + "</dd>";
    stats.appendChild(d);
  });

  /* ---------- Profil ---------- */
  var profil = $("#profil-text");
  (SITE.profil || CV.profil || []).forEach(function (t) { profil.appendChild(el("p", null, esc(t))); });

  var branchen = $("#branchen");
  (SITE.branchen || []).forEach(function (b) { branchen.appendChild(el("li", null, esc(b))); });

  var kk = $("#kernkompetenzen");
  (CV.kernkompetenzen || []).forEach(function (row) {
    kk.appendChild(el("li", null, esc(Array.isArray(row) ? row.join(" · ") : row)));
  });

  /* ---------- Kompetenzen ---------- */
  var STUFEN = [
    { key: "Kern", cls: "kern", dots: 3 },
    { key: "Ergänzung", cls: "ergaenzung", dots: 2 },
    { key: "Im Aufbau", cls: "aufbau", dots: 1 }
  ];
  var stufeInfo = {};
  STUFEN.forEach(function (s) { stufeInfo[s.key] = s; });

  function levelBadge(stufe) {
    var s = stufeInfo[stufe];
    var dots = "";
    for (var i = 0; i < 3; i++) dots += '<i class="' + (i < s.dots ? "on" : "") + '"></i>';
    return '<span class="level level-' + s.cls + '"><span class="dots" aria-hidden="true">' + dots + "</span>" + esc(stufe) + "</span>";
  }

  function renderKompetenzen(liste) {
    liste = liste.filter(function (k) { return stufeInfo[k.stufe]; });
    var grid = $("#komp-grid");
    var filterBar = $("#komp-filter");
    grid.innerHTML = ""; filterBar.innerHTML = "";

    var gruppen = [];
    var byGroup = {};
    liste.forEach(function (k) {
      if (!byGroup[k.gruppe]) { byGroup[k.gruppe] = []; gruppen.push(k.gruppe); }
      byGroup[k.gruppe].push(k);
    });
    var rank = { "Kern": 0, "Ergänzung": 1, "Im Aufbau": 2 };

    gruppen.forEach(function (g) {
      var items = byGroup[g].slice().sort(function (a, b) { return rank[a.stufe] - rank[b.stufe]; });
      var card = el("article", "card komp-group reveal");
      var h = el("h3", null, esc(g) + ' <small aria-hidden="true">' + items.length + "</small>");
      card.appendChild(h);
      var ul = el("ul", "komp-list");
      items.forEach(function (k) {
        var li = el("li", "komp-item");
        li.dataset.stufe = k.stufe;
        li.innerHTML =
          '<div class="komp-item-head"><span class="komp-name">' + esc(k.name) + "</span>" + levelBadge(k.stufe) + "</div>" +
          (k.beleg ? '<p class="komp-beleg">' + esc(k.beleg) + "</p>" : "");
        ul.appendChild(li);
      });
      card.appendChild(ul);
      grid.appendChild(card);
    });

    var filters = [{ key: "Alle", n: liste.length }].concat(STUFEN.map(function (s) {
      return { key: s.key, n: liste.filter(function (k) { return k.stufe === s.key; }).length };
    }));
    filters.forEach(function (f, i) {
      var b = el("button", "filter-btn", esc(f.key) + ' <span class="count">' + f.n + "</span>");
      b.type = "button";
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () { applyFilter(f.key, f.n); });
      filterBar.appendChild(b);
    });

    function applyFilter(key, n) {
      $$(".filter-btn", filterBar).forEach(function (b) {
        b.setAttribute("aria-pressed", b.firstChild.textContent.trim() === key ? "true" : "false");
      });
      $$(".komp-group", grid).forEach(function (card) {
        var visible = 0;
        $$(".komp-item", card).forEach(function (li) {
          var show = key === "Alle" || li.dataset.stufe === key;
          li.hidden = !show; if (show) visible++;
        });
        card.hidden = visible === 0;
        card.classList.add("visible");
      });
      $("#komp-status").textContent = n + " Kompetenzen angezeigt" + (key === "Alle" ? "" : " mit Stufe " + key);
    }
  }

  /* Optional: Live-Daten aus veröffentlichtem Google Sheet (CSV) */
  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') q = false;
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cur); rows.push(row); row = []; cur = "";
      } else cur += c;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }
  function fromSheet(rows) {
    var hIdx = rows.findIndex(function (r) { return r.some(function (c) { return /^Kompetenz-ID$/i.test(c.trim()); }); });
    if (hIdx < 0) return null;
    var head = rows[hIdx].map(function (c) { return c.trim().toLowerCase(); });
    var col = function (re) { return head.findIndex(function (h) { return re.test(h); }); };
    var c = {
      id: col(/^kompetenz-id/), gruppe: col(/^kompetenzgruppe/), name: col(/^kompetenz$/),
      stufe: col(/^einstufung/), beleg: col(/^kurzbeleg/), web: col(/^freigabe web/),
      person: col(/^personen-id/)
    };
    var pid = (komp.personenId || "").toLowerCase();
    return rows.slice(hIdx + 1).filter(function (r) {
      var personOk = c.person < 0 || !pid || (r[c.person] || "").trim().toLowerCase() === pid;
      return r[c.id] && personOk && (r[c.web] || "").trim().toLowerCase() === "ja";
    }).map(function (r) {
      return { id: r[c.id], gruppe: r[c.gruppe], name: r[c.name], stufe: (r[c.stufe] || "").trim(), beleg: r[c.beleg] };
    }).filter(function (k) {
      /* Externe Daten: nur bekannte Einstufungen übernehmen (sonst bricht die Darstellung) */
      return Object.prototype.hasOwnProperty.call(stufeInfo, k.stufe);
    });
  }

  var komp = SITE.kompetenzen || {};
  renderKompetenzen(komp.liste || []);
  if (komp.sheetCsvUrl && window.fetch) {
    fetch(komp.sheetCsvUrl, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) {
        var live = fromSheet(parseCSV(t));
        if (live && live.length) { renderKompetenzen(live); observeReveal(); }
      })
      .catch(function () { /* Fallback: lokale Liste bleibt sichtbar */ });
  }

  /* ---------- Projekte ---------- */
  var pl = $("#projekte-liste");
  var extIcon = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  (SITE.projekte || []).forEach(function (p) {
    var art = el("article", "card projekt reveal");
    var li = function (arr) { return (arr || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); };
    var linkHtml = (p.links || []).filter(function (l) {
      /* Nur https- oder relative Ziele zulassen (kein javascript:, data: usw.) */
      return typeof l.url === "string" && (/^https:\/\//i.test(l.url) || !/^[a-z][a-z0-9+.-]*:/i.test(l.url));
    }).map(function (l) {
      var external = /^https?:/.test(l.url);
      return '<a class="btn ' + (l.typ === "primaer" ? "btn-accent" : "btn-secondary") + '" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
        esc(l.label) + extIcon + '<span class="sr-only"> (öffnet in neuem Tab' + (external ? ", externe Seite" : "") + ")</span></a>";
    }).join("");
    art.innerHTML =
      (p.bild ? '<div class="projekt-media"><img src="' + esc(p.bild) + '" alt="' + esc(p.bildAlt || "") + '" width="640" height="1137" loading="lazy" decoding="async"></div>' : "") +
      '<div class="projekt-body">' +
        '<div class="projekt-meta">' + (p.status ? '<span class="badge badge-status">' + esc(p.status) + "</span>" : "") + (p.zeitraum ? '<span class="badge">' + esc(p.zeitraum) + "</span>" : "") + "</div>" +
        "<h3>" + esc(p.titel) + "</h3>" +
        (p.untertitel ? '<p class="projekt-sub">' + esc(p.untertitel) + "</p>" : "") +
        (p.rolle ? '<p class="projekt-rolle"><strong>Meine Rolle:</strong> ' + esc(p.rolle) + "</p>" : "") +
        (p.ausgangslage ? "<h4>Ausgangslage</h4><p>" + esc(p.ausgangslage) + "</p>" : "") +
        '<div class="projekt-cols">' +
          (p.vorgehen ? "<div><h4>Vorgehen</h4><ul>" + li(p.vorgehen) + "</ul></div>" : "") +
          (p.ergebnis ? "<div><h4>Ergebnis</h4><ul>" + li(p.ergebnis) + "</ul></div>" : "") +
        "</div>" +
        (p.tags ? '<ul class="tags" aria-label="Schlagworte">' + li(p.tags) + "</ul>" : "") +
        '<div class="projekt-links">' +
          (p.demo ? '<a class="btn btn-accent" href="#demo-' + pl.children.length + '">Demonstrator ausprobieren<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg></a>' : "") +
          linkHtml +
        "</div>" +
      "</div>" +
      (p.demo ?
        '<div class="projekt-demo" id="demo-' + pl.children.length + '">' +
          '<div class="demo-bar"><span class="demo-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
          '<p>' + esc(p.demo.hinweis || "Interaktiver Demonstrator") + "</p></div>" +
          '<iframe src="' + esc(p.demo.src) + '" title="' + esc(p.demo.titel || p.titel) + '" loading="lazy" referrerpolicy="no-referrer"' +
          ' sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"></iframe>' +
        "</div>" : "");
    pl.appendChild(art);
  });
  pl.appendChild(el("div", "projekt-placeholder reveal", "<strong>Weitere Arbeitsnachweise folgen</strong>Aktuelle Projekte aus der KI-Weiterbildung werden hier laufend ergänzt."));

  /* ---------- Werdegang ---------- */
  var tl = $("#timeline");
  function startKey(z) {
    var m = /^(?:(\d{2})\/)?(\d{4})/.exec(z || "");
    return m ? Number(m[2]) * 100 + Number(m[1] || 1) : 0;
  }
  var stationen = (CV.berufserfahrung || []).concat(SITE.zusatzStationen || [])
    .sort(function (a, b) { return startKey(b.zeitraum) - startKey(a.zeitraum); });
  stationen.forEach(function (s) {
    var leer = !(s.aufgaben && s.aufgaben.length) && !(s.highlights && s.highlights.length);
    var item = el("li", "tl-item reveal" + (leer ? " tl-muted" : ""));
    var list = function (arr) { return '<ul class="tl-list">' + arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; };
    item.innerHTML =
      '<article class="card tl-card">' +
        '<div><p class="tl-date">' + esc(s.zeitraum) + "</p></div>" +
        "<div>" +
          '<h3 class="tl-title">' + esc(s.titel) + "</h3>" +
          (s.organisation ? '<p class="tl-org">' + esc(s.organisation) + "</p>" : "") +
          (s.aufgaben && s.aufgaben.length ? list(s.aufgaben) : "") +
          (s.highlights && s.highlights.length ? '<div class="tl-highlights"><h4>' + esc(s.highlightTitel || "Ausgewählte Erfolge") + "</h4>" + list(s.highlights) + "</div>" : "") +
        "</div>" +
      "</article>";
    tl.appendChild(item);
  });

  /* ---------- Aus- und Weiterbildung ---------- */
  var edu = $("#ausbildung");
  (CV.ausbildung || []).forEach(function (a) {
    var status = (a.zusatz || "").toLowerCase();
    var item = el("li", "card edu-item reveal");
    item.innerHTML =
      '<div class="edu-top"><span class="edu-date">' + esc(a.zeitraum) + "</span>" +
      (a.zusatz ? '<span class="edu-badge ' + (status.indexOf("lauf") > -1 ? "laufend" : "") + '">' + esc(a.zusatz) + "</span>" : "") + "</div>" +
      "<h3>" + esc(a.titel) + "</h3>" +
      (a.organisation ? '<p class="edu-org">' + esc(a.organisation) + "</p>" : "") +
      (a.beschreibung ? '<p class="edu-desc">' + esc(a.beschreibung) + "</p>" : "");
    edu.appendChild(item);
  });

  var meth = $("#methoden");
  (CV.methoden || []).forEach(function (m) {
    meth.appendChild(el("dt", null, esc(m.label || "")));
    meth.appendChild(el("dd", null, esc(m.text)));
  });
  var st = $("#staerken");
  (CV.staerken || []).forEach(function (s) { st.appendChild(el("li", null, esc(s))); });

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

  /* ---------- Farbschema ---------- */
  $(".theme-toggle").addEventListener("click", function () {
    var root = document.documentElement;
    var dark = root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  /* ---------- Dezentes Scroll-Reveal ---------- */
  function observeReveal() {
    var items = $$(".reveal:not(.visible)");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (i) { i.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (i) { io.observe(i); });
  }
  observeReveal();
})();
