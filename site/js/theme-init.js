/* Setzt das gespeicherte Farbschema vor dem ersten Rendern (verhindert Aufblitzen).
   Als externe Datei, damit die Content-Security-Policy keine Inline-Skripte erlauben muss. */
try {
  var t = localStorage.getItem("theme");
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch (e) { /* Speicher nicht verfügbar – Systemeinstellung gilt */ }

/* Klickschutz (Clickjacking): GitHub Pages kann keinen frame-ancestors-Header senden.
   Bindet eine fremde Seite lueer.me in einen Rahmen ein, wird der Inhalt ausgeblendet
   und die Seite – sofern erlaubt – im Hauptfenster geöffnet. Eigene Rahmen sind erlaubt. */
(function () {
  if (window.self === window.top) return;
  var sameOrigin = false;
  try { sameOrigin = window.top.location.origin === window.location.origin; } catch (e) { /* fremde Herkunft */ }
  if (sameOrigin) return;
  document.documentElement.className += " is-framed";
  try { window.top.location.replace(window.location.href); } catch (e) { /* Navigation blockiert – Inhalt bleibt verborgen */ }
})();
