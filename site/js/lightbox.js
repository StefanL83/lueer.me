/* Bildbetrachter für Galerien (<ul class="gallery" data-lightbox>).
   - Ohne JavaScript öffnen die Links einfach das Bild.
   - Natives <dialog> (Fokus bleibt im Dialog, Esc schließt, Fokus kehrt zum Auslöser zurück).
   - Blättern mit Pfeiltasten, Schaltflächen oder Wischen; Position wird angesagt („2 von 3“). */
(function () {
  "use strict";
  var gallery = document.querySelector("[data-lightbox]");
  if (!gallery || typeof HTMLDialogElement !== "function") return;

  var T = function (k, f) { return window.I18N ? window.I18N.t(k, f) : f; };
  var links = Array.prototype.slice.call(gallery.querySelectorAll("a"));
  var index = 0, trigger = null, startX = null;

  var ico = {
    close: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    prev: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>'
  };

  var dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.innerHTML =
    '<div class="lb-stage">' +
      '<div class="lb-top"><p class="lb-count" aria-live="polite"></p>' +
        '<button type="button" class="lb-btn lb-close">' + ico.close + "</button></div>" +
      '<figure class="lb-figure">' +
        '<button type="button" class="lb-btn lb-prev">' + ico.prev + "</button>" +
        '<div class="lb-scroll" tabindex="0"><img alt=""></div>' +
        '<button type="button" class="lb-btn lb-next">' + ico.next + "</button>" +
      "</figure>" +
      '<p class="lb-caption"></p>' +
      '<div class="lb-nav-mobile">' +
        '<button type="button" class="lb-btn lb-prev">' + ico.prev + "</button>" +
        '<button type="button" class="lb-btn lb-next">' + ico.next + "</button>" +
      "</div>" +
    "</div>";
  document.body.appendChild(dlg);

  var img = dlg.querySelector("img"), cap = dlg.querySelector(".lb-caption"), count = dlg.querySelector(".lb-count");

  function labels() {
    dlg.setAttribute("aria-label", T("lb.label", "Bildbetrachter"));
    dlg.querySelector(".lb-close").setAttribute("aria-label", T("lb.close", "Schließen"));
    dlg.querySelectorAll(".lb-prev").forEach(function (b) { b.setAttribute("aria-label", T("lb.prev", "Vorheriges Bild")); });
    dlg.querySelectorAll(".lb-next").forEach(function (b) { b.setAttribute("aria-label", T("lb.next", "Nächstes Bild")); });
    links.forEach(function (a) {
      var badge = a.querySelector(".zoom-label");
      if (badge) badge.textContent = T("lb.open", "Bild vergrößern");
    });
  }

  function show(i) {
    index = (i + links.length) % links.length;
    var a = links[index], thumb = a.querySelector("img"), fig = a.closest("figure");
    var c = fig && fig.querySelector("figcaption");
    var scroll = dlg.querySelector(".lb-scroll");
    scroll.classList.toggle("is-tall", a.hasAttribute("data-lb-scroll"));
    scroll.scrollTop = 0;
    img.src = a.getAttribute("href");
    img.alt = thumb ? thumb.alt : "";
    cap.textContent = c ? c.textContent : "";
    count.textContent = (index + 1) + " " + T("lb.of", "von") + " " + links.length;
    /* Animation neu starten */
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
  }

  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      trigger = a; labels(); show(i);
      dlg.showModal();
      dlg.querySelector(".lb-close").focus();
    });
  });

  dlg.querySelector(".lb-close").addEventListener("click", function () { dlg.close(); });
  dlg.querySelectorAll(".lb-prev").forEach(function (b) { b.addEventListener("click", function () { show(index - 1); }); });
  dlg.querySelectorAll(".lb-next").forEach(function (b) { b.addEventListener("click", function () { show(index + 1); }); });
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
  });
  /* Klick auf den dunklen Hintergrund schließt */
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg || e.target.classList.contains("lb-stage") || e.target.classList.contains("lb-figure") || e.target.classList.contains("lb-scroll")) dlg.close();
  });
  dlg.addEventListener("close", function () { if (trigger) trigger.focus(); });
  /* Wischen auf Touch-Geräten */
  dlg.addEventListener("pointerdown", function (e) { startX = e.pointerType === "mouse" ? null : e.clientX; });
  dlg.addEventListener("pointerup", function (e) {
    if (startX == null) return;
    var dx = e.clientX - startX; startX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });

  labels();
  document.addEventListener("langchange", labels);
})();
