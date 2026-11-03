// npm run verifier-liens — après « npm run build » : chaque lien interne de dist/ doit commencer
// par la base du site et mener à un fichier qui existe.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import config from "../site.config.mjs";

const dist = new URL("../dist", import.meta.url).pathname;
const base = config.domaine.actif ? "/" : config.github.base;
const site = new URL(config.domaine.actif ? config.domaine.url : config.github.site);
if (!existsSync(dist)) { console.error("✗ dist/ n'existe pas : lance d'abord npm run build."); process.exit(1); }

function fichiers(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : [chemin];
  });
}
const pages = fichiers(dist).filter((f) => f.endsWith(".html"));
const problemes = [];
let total = 0;
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  for (const [, attribut, valeur] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (/^(mailto:|tel:|#|data:)/.test(valeur) || valeur === "") continue;
    let url;
    try { url = new URL(valeur, site); } catch { problemes.push(`${page.replace(dist, "")} : adresse illisible ${valeur}`); continue; }
    if (url.host !== site.host) continue; // lien externe
    total++;
    if (!url.pathname.startsWith(base)) { problemes.push(`${page.replace(dist, "")} : ${attribut}="${valeur}" ne passe pas par la base ${base}`); continue; }
    let cible = join(dist, decodeURIComponent(url.pathname.slice(base.length)));
    if (cible.endsWith("/")) cible = join(cible, "index.html");
    if (!existsSync(cible)) problemes.push(`${page.replace(dist, "")} : ${valeur} → fichier introuvable`);
  }
}
if (problemes.length) {
  console.error(`✗ ${problemes.length} lien(s) cassé(s) :`);
  for (const p of problemes) console.error("  - " + p);
  process.exit(1);
}
console.log(`✓ ${total} liens internes valides dans ${pages.length} pages.`);
