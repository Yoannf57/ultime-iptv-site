// npm run importer-badges — copie les badges officiels « Download on the App Store » d'Apple (et, plus bas, ceux de Google Play), déposés par Yoann dans
// Notes/badges/ (non versionné, licence acceptée par lui), vers src/assets/badges/<langue>.svg, pour les langues du
// site seulement, en SVG NOIR. Copie à l'identique (octet pour octet) : Apple interdit toute modification du badge.
// Les versions blanches vont dans captures/badges-blancs/ (non versionné), uniquement pour comparer en capture.
// Affiche à la fin les langues pour lesquelles Apple n'a pas de badge : le site prend alors l'anglais.
import { readdirSync, statSync, copyFileSync, chmodSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join, basename, relative } from "node:path";

const racine = new URL("..", import.meta.url).pathname;
const source = process.argv[2] || join(racine, "Notes/badges");
const cible = join(racine, "src/assets/badges");
const cibleBlancs = join(racine, "captures/badges-blancs");

// Langue du site → codes possibles dans les noms de fichiers d'Apple (ex. « …_Badge_FR_RGB_blk_100517.svg »).
const langues = {
  fr: ["FR"],
  en: ["US-UK", "US", "UK", "EN", "GB"],
  nl: ["NL"],
  de: ["DE"],
  sv: ["SE", "SV"],
  nb: ["NO", "NB"],
  da: ["DK", "DA"],
  fi: ["FI"],
  es: ["ES"],
  "es-mx": ["ES-MX", "ESMX", "MX", "LATAM", "ES-LA", "ESLA", "LA"], // facultatif : sinon es-mx prend « es »
  it: ["IT"],
  "pt-br": ["PT-BR", "PTBR", "BR"],
  pt: ["PT-PT", "PTPT", "PT"],
};
const facultatives = new Set(["es-mx"]);

if (!existsSync(source)) {
  console.error(`✗ ${relative(racine, source)}/ n'existe pas : dépose-y le dossier des badges téléchargé chez Apple.`);
  process.exit(1);
}
function fichiers(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : [chemin];
  });
}
// Code de langue d'Apple et couleur, lus dans le nom du fichier.
const badges = fichiers(source)
  .filter((f) => f.toLowerCase().endsWith(".svg") && /app.?store/i.test(f))
  .map((f) => {
    const m = basename(f).match(/Badge_([A-Za-z-]+?)_(?:RGB|CMYK)_(blk|wht|black|white)/i);
    return m ? { chemin: f, code: m[1].toUpperCase(), couleur: /^b/i.test(m[2]) ? "noir" : "blanc", rvb: /RGB/i.test(basename(f)) } : null;
  })
  .filter(Boolean);

mkdirSync(cible, { recursive: true });
mkdirSync(cibleBlancs, { recursive: true });
const manquantes = [];
for (const [langue, codes] of Object.entries(langues)) {
  for (const couleur of ["noir", "blanc"]) {
    // Premier code connu qui a un badge de cette couleur ; on préfère la version RVB (écran) à CMJN (impression).
    const trouve = codes.map((c) => badges.filter((b) => b.code === c && b.couleur === couleur).sort((a, b) => b.rvb - a.rvb)[0]).find(Boolean);
    if (!trouve) { if (couleur === "noir" && !facultatives.has(langue)) manquantes.push(langue); continue; }
    const dossier = couleur === "noir" ? cible : cibleBlancs;
    copyFileSync(trouve.chemin, join(dossier, `${langue}.svg`));
    chmodSync(join(dossier, `${langue}.svg`), 0o644); // fichiers d'Apple marqués exécutables : droits normaux, contenu intact
    if (couleur === "noir") console.log(`✓ ${langue.padEnd(6)} ← ${relative(source, trouve.chemin)}`);
  }
}
const inconnus = [...new Set(badges.map((b) => b.code))].filter((c) => !Object.values(langues).flat().includes(c));
if (inconnus.length) console.log(`  (codes d'Apple non utilisés : ${inconnus.sort().join(", ")})`);
if (!badges.length) console.warn("⚠️ Aucun badge SVG reconnu dans le dossier (noms attendus : …_Badge_FR_RGB_blk_….svg).");
if (manquantes.length) console.warn(`⚠️ Pas de badge chez Apple pour : ${manquantes.join(", ")} — le site affichera le badge anglais.`);
else if (badges.length) console.log("✓ Toutes les langues du site ont leur badge.");

// ── Badges officiels « Disponible sur Google Play » (27/11/2026) ─────────────────────────────────────────────────
// Téléchargés sur https://play.google.com/intl/en_us/badges/ (fichiers « <code>_badge_web_generic.png ») et déposés
// dans Notes/badges/google-play/ (non versionné). Copie à l'identique vers src/assets/badges/google-play/<langue>.png :
// Google interdit de modifier le badge. Les PNG de Google ont une marge transparente qui n'est pas la même selon la
// langue : on la mesure (sharp) et on l'écrit dans mesures.json, pour que BadgeGooglePlay.astro donne au badge visible
// exactement la hauteur du badge App Store, sans toucher à l'image.
const sourceGoogle = join(source, "google-play");
const cibleGoogle = join(cible, "google-play");
const languesGoogle = {
  fr: "fr", en: "en", nl: "nl", de: "de", sv: "sv", nb: "no", da: "da", fi: "fi",
  es: "es", "es-mx": "es-419", it: "it", "pt-br": "pt-br", pt: "pt",
};
if (!existsSync(sourceGoogle)) {
  console.warn(`⚠️ ${relative(racine, sourceGoogle)}/ n'existe pas : badges Google Play non importés.`);
} else {
  // sharp : installé avec Astro (dépendance d'Astro, pas du site). Pas de nouvelle dépendance ajoutée.
  const { default: sharp } = await import("sharp");
  mkdirSync(cibleGoogle, { recursive: true });
  const mesures = {};
  const manquantesGoogle = [];
  for (const [langue, code] of Object.entries(languesGoogle)) {
    const fichier = join(sourceGoogle, `${code}_badge_web_generic.png`);
    if (!existsSync(fichier)) { if (!facultatives.has(langue)) manquantesGoogle.push(langue); continue; }
    copyFileSync(fichier, join(cibleGoogle, `${langue}.png`));
    chmodSync(join(cibleGoogle, `${langue}.png`), 0o644);
    // Rectangle visible (pixels non transparents) dans l'image d'origine.
    const { data, info } = await sharp(fichier).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let haut = info.height, bas = -1, gauche = info.width, droite = -1;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 8) { haut = Math.min(haut, y); bas = Math.max(bas, y); gauche = Math.min(gauche, x); droite = Math.max(droite, x); }
    }
    mesures[langue] = { largeur: info.width, hauteur: info.height, haut, bas: info.height - 1 - bas, gauche, droite: info.width - 1 - droite };
    console.log(`✓ google ${langue.padEnd(6)} ← ${code}_badge_web_generic.png`);
  }
  writeFileSync(join(cibleGoogle, "mesures.json"), JSON.stringify(mesures, null, 2) + "\n");
  if (manquantesGoogle.length) console.warn(`⚠️ Pas de badge Google Play pour : ${manquantesGoogle.join(", ")} — le site affichera le badge anglais.`);
  else console.log("✓ Toutes les langues du site ont leur badge Google Play.");
}
