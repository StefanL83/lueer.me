/* Setzt das gespeicherte Farbschema vor dem ersten Rendern (verhindert Aufblitzen).
   Als externe Datei, damit die Content-Security-Policy keine Inline-Skripte erlauben muss. */
try {
  var t = localStorage.getItem("theme");
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch (e) { /* Speicher nicht verfügbar – Systemeinstellung gilt */ }
