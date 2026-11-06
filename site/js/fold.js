/* Aufklappbare Einträge (Werdegang, Kompetenzen, Weiterbildung).
   Barrierearm nach dem „Disclosure“-Muster: echte Schaltfläche in einer Überschrift,
   aria-expanded/aria-controls, bedienbar per Tastatur (Enter/Leertaste), Esc schließt.
   Maus: Beim Darüberfahren öffnet sich der Eintrag nach kurzer Verzögerung und schließt beim
   Verlassen wieder; ein Klick „pinnt“ ihn offen. Touch/Tastatur: Klick bzw. Taste schaltet um.
   Zugeklappte Inhalte sind per visibility:hidden auch für Screenreader ausgeblendet. */
(function () {
  "use strict";

  var uid = 0;
  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var HOVER_DELAY = 140;
  var chevron = '<svg class="icon fold-chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function setOpen(fold, open, viaHover) {
    var btn = fold.querySelector(".fold-head");
    fold.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && viaHover) fold.dataset.hover = "1"; else delete fold.dataset.hover;
  }

  /* opts: { meta (HTML), titel, sub, punkte: [{text, hervorheben}], level (2–6, Standard 3) } */
  function create(opts) {
    var level = opts.level || 3;
    var head =
      (opts.meta ? '<span class="fold-meta">' + opts.meta + "</span>" : "") +
      '<span class="fold-title">' + esc(opts.titel) + "</span>" +
      (opts.sub ? '<span class="fold-sub">' + esc(opts.sub) + "</span>" : "");
    var punkte = (opts.punkte || []).filter(function (p) { return p && p.text; });
    var fold = document.createElement("div");

    if (!punkte.length) {
      fold.className = "fold fold-static";
      fold.innerHTML = "<h" + level + ' class="fold-h"><span class="fold-head">' + head + "</span></h" + level + ">";
      return fold;
    }

    var id = "fold-" + (++uid);
    fold.className = "fold";
    fold.innerHTML =
      "<h" + level + ' class="fold-h"><button type="button" class="fold-head" id="' + id + '-h" aria-expanded="false" aria-controls="' + id + '-b">' +
        head + chevron + "</button></h" + level + ">" +
      '<div class="fold-body" id="' + id + '-b"><div class="fold-inner"><ul class="fold-points">' +
        punkte.map(function (p) {
          return "<li" + (p.hervorheben ? ' class="is-highlight"' : "") + ">" + esc(p.text) + "</li>";
        }).join("") +
      "</ul></div></div>";

    var btn = fold.querySelector(".fold-head");
    btn.addEventListener("click", function () {
      if (fold.dataset.hover) { setOpen(fold, true, false); return; }   /* per Maus geöffnet → festhalten */
      setOpen(fold, !fold.classList.contains("is-open"), false);
    });
    fold.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && fold.classList.contains("is-open")) { setOpen(fold, false); btn.focus(); }
    });

    if (canHover) {
      var timer = null;
      fold.addEventListener("mouseenter", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (!fold.classList.contains("is-open")) setOpen(fold, true, true);
        }, HOVER_DELAY);
      });
      fold.addEventListener("mouseleave", function () {
        clearTimeout(timer);
        if (fold.dataset.hover) setOpen(fold, false);
      });
    }
    return fold;
  }

  /* Esc schließt auch per Maus geöffnete Einträge, ohne dass der Fokus darin liegt */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll('.fold[data-hover="1"]').forEach(function (f) { setOpen(f, false); });
  });

  window.Fold = { create: create };
})();
