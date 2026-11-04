// Devine le pays du visiteur (CLAUDE.md, section 3). Ce fichier est injecté tel quel dans les pages
// (racine et bandeau), sans import : il doit rester du JavaScript simple.
// Renvoie { code, sur, enregistre } :
//   enregistre = le visiteur a déjà choisi (localStorage « ultime-pays ») ;
//   sur        = la devinette repose sur le fuseau horaire ou la région de la langue.
function devinerPays(liste) {
  var CLE = "ultime-pays";
  var codes = liste.map(function (p) { return p.code; });
  try {
    var choix = localStorage.getItem(CLE);
    if (choix && codes.indexOf(choix) !== -1) return { code: choix, sur: true, enregistre: true };
  } catch (e) {}

  // Langue du navigateur → langue du site : étiquette complète d'abord (« pt-br »), puis la langue seule (« pt »).
  // Le norvégien arrive en « nb », « no » ou « nn » : le site a le bokmål (« nb »).
  var ALIAS = { no: "nb", nn: "nb" };
  var languesSite = liste.map(function (p) { return p.langue; });
  var base = function (l) { return l.split("-")[0]; };
  var languesNav = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
  var langue = null, regionLangue = null;
  for (var i = 0; i < languesNav.length && !langue; i++) {
    var morceaux = String(languesNav[i]).toLowerCase().split("-");
    var b0 = ALIAS[morceaux[0]] || morceaux[0];
    var complete = morceaux[1] ? b0 + "-" + morceaux[1] : null;
    if (complete && languesSite.indexOf(complete) !== -1) langue = complete;
    else if (languesSite.indexOf(b0) !== -1) langue = b0;
    else {
      // Seule une variante existe (ex. « pt » demandé, « pt-br » seulement) : on la prend.
      for (var k = 0; k < languesSite.length; k++) if (base(languesSite[k]) === b0) { langue = languesSite[k]; break; }
    }
    if (langue) regionLangue = morceaux[1] || null;
  }
  // Langue non traduite : version internationale en anglais.
  if (!langue) return { code: "en", sur: true, enregistre: false };

  var fuseau = "";
  try { fuseau = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}

  // Pays de la même langue, variantes comprises (« pt » et « pt-br ») ; ceux de la langue exacte d'abord.
  var candidats = liste.filter(function (p) { return !p.international && p.langue === langue; })
    .concat(liste.filter(function (p) { return !p.international && p.langue !== langue && base(p.langue) === base(langue); }));
  var parFuseau = null, parRegion = null;
  for (var j = 0; j < candidats.length; j++) {
    if (!parFuseau && fuseau && candidats[j].fuseaux.indexOf(fuseau) !== -1) parFuseau = candidats[j];
    if (!parRegion && regionLangue && candidats[j].code === base(langue) + "-" + regionLangue) parRegion = candidats[j];
  }
  if (parFuseau) return { code: parFuseau.code, sur: true, enregistre: false };
  if (parRegion) return { code: parRegion.code, sur: true, enregistre: false };

  // Pays absent de la liste : page internationale de la langue (/fr/, /es/, /pt/…), sans prix ni bandeau.
  for (var m = 0; m < liste.length; m++) {
    if (liste[m].international && liste[m].langue === langue) return { code: liste[m].code, sur: true, enregistre: false };
  }
  // Sinon (ex. « pt-br » hors du Brésil) : le premier pays de la langue, sans certitude.
  return { code: candidats[0].code, sur: false, enregistre: false };
}
