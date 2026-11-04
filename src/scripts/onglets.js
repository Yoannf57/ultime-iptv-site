// Écrans cliquables (aperçu Apple TV / iPhone) et choix « Pour moi / Pour la famille ».
// Tout bouton [data-cible][data-vue] affiche la vue correspondante dans l'élément [data-ecran] ou
// [data-groupe] du même nom, et met à jour aria-pressed sur tous les boutons de ce groupe.
document.documentElement.classList.add("js");

function choisir(cible, vue) {
  document.querySelectorAll('[data-cible="' + cible + '"]').forEach(function (b) {
    b.setAttribute("aria-pressed", b.getAttribute("data-vue") === vue ? "true" : "false");
  });
  document.querySelectorAll('[data-ecran="' + cible + '"] > [data-vue], [data-groupe="' + cible + '"] [data-panneau]').forEach(function (v) {
    var nom = v.getAttribute("data-vue") || v.getAttribute("data-panneau");
    var afficher = nom === vue;
    if (afficher && v.hidden) {
      v.hidden = false;
      v.classList.remove("entree");
      void v.offsetWidth;
      v.classList.add("entree");
    } else if (!afficher) {
      v.hidden = true;
    }
  });
  document.querySelectorAll('[data-groupe="' + cible + '-legende"] [data-legende]').forEach(function (p) {
    p.hidden = p.getAttribute("data-legende") !== vue;
  });
}

document.addEventListener("click", function (e) {
  var bouton = e.target.closest("button[data-cible][data-vue]");
  if (bouton) choisir(bouton.getAttribute("data-cible"), bouton.getAttribute("data-vue"));
});

// Au chargement : seuls les panneaux choisis restent visibles (sans JavaScript, tout est affiché).
document.querySelectorAll("[data-groupe]").forEach(function (groupe) {
  var nom = groupe.getAttribute("data-groupe");
  var actif = document.querySelector('[data-cible="' + nom + '"][aria-pressed="true"]');
  if (actif) choisir(nom, actif.getAttribute("data-vue"));
});

// Apparition douce des sections au défilement (désactivée si l'utilisateur réduit les animations).
var sections = document.querySelectorAll(".apparition");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  var observateur = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (entree) {
      if (entree.isIntersecting) { entree.target.classList.add("visible"); observateur.unobserve(entree.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  sections.forEach(function (s) { s.classList.add("a-venir"); observateur.observe(s); });
}
