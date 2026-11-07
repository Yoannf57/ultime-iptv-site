// npm run importer-badges — copie les badges officiels « Download on the App Store » d'Apple, déposés par Yoann dans
// Notes/badges/ (non versionné, licence acceptée par lui), vers src/assets/badges/<langue>.svg, pour les langues du
// site seulement, en SVG NOIR. Copie à l'identique (octet pour octet) : Apple interdit toute modification du badge.
// Les versions blanches vont dans captures/badges-blancs/ (non versionné), uniquement pour comparer en capture.
// Affiche à la fin les langues pour lesquelles Apple n'a pas de badge : le site prend alors l'anglais.
import { readdirSync, statSync, copyFileSync, chmodSync, mkdirSync, existsSync } from "node:fs";
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
