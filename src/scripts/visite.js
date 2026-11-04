// Écrans qui défilent seuls (CLAUDE.md, section 4) : grand visuel (Apple TV + iPhone) et « Faites le tour. » (iPad).
// Chaque bloc [data-visite] a ses écrans [data-diapo=<vue>] (un ou plusieurs par vue : Apple TV et iPhone changent
// ensemble), ses onglets [data-onglet], son bouton Pause/Lecture [data-lecture], et éventuellement des légendes
// [data-legende] et des onglets dessinés cliquables dans les captures ([data-aller], voir Zones.astro).
// - un écran toutes les 4,5 s, en fondu ; seuls l'écran affiché et le suivant sont dans la page (le suivant,
//   invisible, charge son image juste avant d'être montré) ;
// - le visiteur garde la main : clic, clavier, focus ou survol à la souris arrêtent la visite, qui reprend seule après
//   10 s sans action ; après un toucher (téléphone, tablette), elle ne reprend pas seule ;
// - bouton Pause / Lecture ; visite en pause hors de l'écran ou quand l'onglet du navigateur est caché ;
// - « réduire les animations » : rien ne bouge, les onglets restent cliquables.
var DUREE = 4500;
var REPRISE = 10000;
var FONDU = 650;
var calme = matchMedia("(prefers-reduced-motion: reduce)").matches;

function demarrer(racine) {
  var tous = function (sel) { return Array.prototype.slice.call(racine.querySelectorAll(sel)); };
  var onglets = tous("button[data-onglet]");
  var vues = onglets.map(function (b) { return b.getAttribute("data-onglet"); });
  var diapos = tous("[data-diapo]");
  var legendes = tous("[data-legende]");
  var zoneLegendes = racine.querySelector("[data-legendes]");
  var bouton = racine.querySelector("[data-lecture]");
  var n = vues.length;
  var actuel = 0;
  var minuteur = null;
  var minuteurReprise = null;
  var pauseVoulue = calme;   // bouton Pause (ou « réduire les animations »)
  var arretAction = false;   // arrêt après une action du visiteur (reprise seule après 10 s)
  var arretToucher = false;  // arrêt après un toucher : pas de reprise seule
  var aLEcran = false;
  var ongletVisible = !document.hidden;
  var dernierPointeur = "mouse";

  racine.style.setProperty("--duree", DUREE + "ms");
  if (calme && bouton) bouton.classList.add("cache");

  function montrer(i) {
    actuel = (i + n) % n;
    var suivant = (actuel + 1) % n;
    diapos.forEach(function (d) {
      var k = vues.indexOf(d.getAttribute("data-diapo"));
      var actif = k === actuel;
      if (actif || k === suivant) d.hidden = false;
      d.classList.toggle("active", actif);
      if (!actif && k !== suivant) {
        if (calme) d.hidden = true;
        else setTimeout(function () { if (actuel !== k && (actuel + 1) % n !== k) d.hidden = true; }, FONDU);
      }
    });
    onglets.forEach(function (b, k) { b.setAttribute("aria-pressed", k === actuel ? "true" : "false"); });
    legendes.forEach(function (p) { p.classList.toggle("active", p.getAttribute("data-legende") === vues[actuel]); });
  }

  function joue() { return !pauseVoulue && !arretAction && aLEcran && ongletVisible; }

  function planifier() {
    clearTimeout(minuteur);
    racine.classList.remove("joue");
    if (joue()) {
      void racine.offsetWidth; // relance la barre de progression depuis le début
      racine.classList.add("joue");
      minuteur = setTimeout(function () { montrer(actuel + 1); planifier(); }, DUREE);
    }
    if (!bouton) return;
    // Le bouton montre « Lecture » quand la visite ne repartira pas seule (Pause choisie, ou après un toucher).
    var enLecture = !pauseVoulue && !arretToucher;
    bouton.classList.toggle("arretee", !enLecture);
    var texte = bouton.getAttribute(enLecture ? "data-pause-texte" : "data-lecture-texte");
    bouton.setAttribute("aria-label", texte);
    bouton.setAttribute("title", texte);
    // La légende n'est annoncée par les lecteurs d'écran que quand le visiteur a la main.
    if (zoneLegendes) zoneLegendes.setAttribute("aria-live", pauseVoulue || arretAction ? "polite" : "off");
  }

  function action(toucher) {
    if (pauseVoulue) return;
    arretAction = true;
    if (toucher) arretToucher = true;
    clearTimeout(minuteurReprise);
    if (!toucher && !arretToucher) minuteurReprise = setTimeout(function () { arretAction = false; planifier(); }, REPRISE);
    planifier();
  }

  racine.addEventListener("pointerdown", function (e) {
    dernierPointeur = e.pointerType;
    if (e.target.closest("[data-lecture]")) return;
    action(e.pointerType === "touch");
  });
  racine.addEventListener("pointerover", function (e) { if (e.pointerType === "mouse") action(false); });
  racine.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse" && arretAction) action(false); });
  racine.addEventListener("keydown", function (e) { if (!e.target.closest("[data-lecture]")) action(false); });
  racine.addEventListener("focusin", function (e) { if (!e.target.closest("[data-lecture]")) action(false); });

  // Onglets sous l'écran, et onglets dessinés dans la capture.
  racine.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-onglet], button[data-aller]");
    if (!b) return;
    var k = vues.indexOf(b.getAttribute("data-onglet") || b.getAttribute("data-aller"));
    if (k < 0) return;
    montrer(k);
    action(dernierPointeur === "touch");
  });

  if (bouton) bouton.addEventListener("click", function () {
    clearTimeout(minuteurReprise);
    if (!pauseVoulue && !arretToucher) { pauseVoulue = true; }
    else { pauseVoulue = false; arretToucher = false; arretAction = false; montrer(actuel + 1); }
    planifier();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entrees) {
      aLEcran = entrees[0].isIntersecting;
      planifier();
    }, { threshold: Number(racine.getAttribute("data-seuil")) || 0.35 }).observe(racine);
  }
  document.addEventListener("visibilitychange", function () { ongletVisible = !document.hidden; planifier(); });

  montrer(0);
  planifier();
}

Array.prototype.forEach.call(document.querySelectorAll("[data-visite]"), demarrer);
