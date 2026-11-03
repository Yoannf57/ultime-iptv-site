// npm run verifier-textes — signale toute clé manquante ou vide dans une langue (CLAUDE.md, section 3).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const racine = new URL("..", import.meta.url).pathname;
const dossierTextes = join(racine, "src/textes");
const pays = JSON.parse(readFileSync(join(racine, "src/pays.json"), "utf8"));
const problemes = [];

// 1. Lire chaque langue et aplatir ses clés (« bandeau.question.fr-be »).
function aplatir(objet, prefixe = "", sortie = {}) {
  for (const [cle, valeur] of Object.entries(objet)) {
    const chemin = prefixe ? `${prefixe}.${cle}` : cle;
    if (valeur && typeof valeur === "object") aplatir(valeur, chemin, sortie);
    else sortie[chemin] = valeur;
  }
  return sortie;
}
const langues = {};
for (const fichier of readdirSync(dossierTextes).filter((f) => f.endsWith(".json"))) {
  const langue = fichier.replace(".json", "");
  try {
    langues[langue] = aplatir(JSON.parse(readFileSync(join(dossierTextes, fichier), "utf8")));
  } catch (e) {
    problemes.push(`src/textes/${fichier} : JSON invalide (${e.message})`);
  }
}

// 2. Toutes les langues doivent avoir les mêmes clés, sans valeur vide.
const toutesLesCles = new Set(Object.values(langues).flatMap((c) => Object.keys(c)));
for (const [langue, cles] of Object.entries(langues)) {
  for (const cle of toutesLesCles) {
    if (!(cle in cles)) problemes.push(`[${langue}] clé manquante : ${cle}`);
    else if (typeof cles[cle] !== "string" || cles[cle].trim() === "") problemes.push(`[${langue}] texte vide : ${cle}`);
  }
  // Les {variables} doivent être les mêmes que dans les autres langues.
  for (const cle of Object.keys(cles)) {
    const vars = (s) => JSON.stringify((String(s).match(/\{\w+\}/g) || []).sort());
    for (const [autre, clesAutre] of Object.entries(langues)) {
      if (autre !== langue && cle in clesAutre && vars(cles[cle]) !== vars(clesAutre[cle]) && langue < autre) {
        problemes.push(`[${langue}/${autre}] variables différentes dans ${cle}`);
      }
    }
  }
}

// 3. Chaque langue de pays.json doit avoir son fichier, et les textes qui dépendent des pays doivent exister.
const cles = (langue) => langues[langue] || {};
for (const p of pays) {
  if (!langues[p.langue]) problemes.push(`pays.json : « ${p.code} » utilise la langue « ${p.langue} », mais src/textes/${p.langue}.json n'existe pas`);
}
for (const langue of Object.keys(langues)) {
  for (const p of pays.filter((x) => x.code !== "en")) {
    for (const cle of [`bandeau.question.${p.code}`, `bandeau.voir.${p.code}`]) {
      if (!(cle in cles(langue))) problemes.push(`[${langue}] clé manquante : ${cle}`);
    }
  }
  for (const region of new Set(pays.map((p) => p.region))) {
    if (!(`choix.regions.${region}` in cles(langue))) problemes.push(`[${langue}] clé manquante : choix.regions.${region}`);
  }
}

// 4. Chaque clé écrite dans le code, t(…, "cle"), doit exister.
function fichiers(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : [chemin];
  });
}
for (const fichier of fichiers(join(racine, "src")).filter((f) => [".astro", ".ts", ".js"].includes(extname(f)))) {
  const contenu = readFileSync(fichier, "utf8");
  for (const [, cle] of contenu.matchAll(/\bt\(\s*[^,()]+,\s*["']([^"'$]+)["']/g)) {
    if (!toutesLesCles.has(cle)) problemes.push(`${fichier.replace(racine, "")} : la clé « ${cle} » n'existe dans aucune langue`);
  }
}

const uniques = [...new Set(problemes)];
if (uniques.length) {
  console.error(`✗ ${uniques.length} problème(s) dans les textes :`);
  for (const p of uniques) console.error("  - " + p);
  process.exit(1);
}
console.log(`✓ Textes complets : ${Object.keys(langues).join(", ")} (${toutesLesCles.size} clés chacune).`);
