/* E-Mail-Schutz gegen Adress-Sammler (Spam-Bots):
   - Die Adresse steht nirgends im Klartext im HTML oder JavaScript.
   - Sie wird erst nach einer echten Nutzeraktion (Klick/Tastatur) zusammengesetzt.
   - Ein mailto:-Link entsteht nur im Moment des Klicks und steht nie im Seitenquelltext. */
(function () {
  "use strict";
  var parts = ["dGthdG5vaw==", "ZW0ucmVldWw="]; // kodiert & umgedreht

  function decode(p) {
    try { return atob(p).split("").reverse().join(""); } catch (e) { return ""; }
  }
  function address() {
    return decode(parts[0]) + String.fromCharCode(64) + decode(parts[1]);
  }

  function init() {
    document.querySelectorAll('[data-mail="write"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var subject = encodeURIComponent("Kontakt über lueer.me");
        window.location.href = "mai" + "lto:" + address() + "?subject=" + subject;
      });
    });

    document.querySelectorAll('[data-mail="show"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var out = document.getElementById(btn.getAttribute("aria-controls"));
        if (!out) return;
        out.textContent = address();
        btn.setAttribute("aria-expanded", "true");
        btn.hidden = true;
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
