// npm run importer-captures — copie les captures App Store faites par la session de l'app (dépôt ultime-iptv, lu
// seulement) dans src/assets/captures/<langue>/<appareil>/<nom>.webp, réduites et compressées, pour les 12 langues
// du site. Astro produit ensuite les versions AVIF et WebP à la bonne taille pour chaque écran (<Picture>).
// Écartées : 04-fiche-film (fiche avec la distribution : photos de vraies personnes, interdit sur le site,
// CLAUDE.md section 5). 07-films-series sur iPad est reprise depuis le 04/11/2026 (refaite sans la distribution).
//
// Copie aussi les cadres officiels d'Apple (Apple Design Resources › Product Bezels), déposés par Yoann dans
// Notes/cadres/ (non versionné) : une version web réduite va dans src/assets/cadres/ ; l'original reste hors du dépôt.
import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { execFileSync } from "node:child_process";

const source = process.argv[2] || join(homedir(), "Developer/ultime-iptv/Notes/app-store/captures");
const cible = new URL("../src/assets/captures/", import.meta.url).pathname;
const largeurs = { appletv: 2560, ipad: 2048, iphone: 1000 };
const ecartees = ["*/04-fiche-film"];
// Dossier de l'app → langue du site (fichier src/textes/<langue>.json).
const langues = { fr: "fr", en: "en", nl: "nl", de: "de", sv: "sv", nb: "nb", da: "da", fi: "fi", es: "es", it: "it", "pt-BR": "pt-br", "pt-PT": "pt" };

if (!existsSync(source)) { console.error(`Dossier introuvable : ${source}`); process.exit(1); }
let n = 0;
for (const [dossierApp, langue] of Object.entries(langues)) {
  for (const [appareil, largeur] of Object.entries(largeurs)) {
    const dossier = join(source, dossierApp, appareil);
    if (!existsSync(dossier)) { console.warn(`  (absent : ${dossierApp}/${appareil})`); continue; }
    mkdirSync(join(cible, langue, appareil), { recursive: true });
    for (const fichier of readdirSync(dossier).filter((f) => f.endsWith(".png"))) {
      const nom = fichier.replace(/\.png$/, "");
      if (ecartees.includes(`*/${nom}`) || ecartees.includes(`${appareil}/${nom}`)) continue;
      const sortie = join(cible, langue, appareil, `${nom.replace(/^\d+-/, "")}.webp`);
      await sharp(join(dossier, fichier)).resize({ width: largeur, withoutEnlargement: true }).webp({ quality: 90 }).toFile(sortie);
      n++;
    }
  }
}
console.log(`✓ ${n} captures importées dans src/assets/captures/`);

// Cadres d'Apple : image non modifiée (seulement réduite pour le web, transparence gardée).
const cadres = [
  { fichier: "iPhone 18 Pro - Black - Portrait.png", nom: "iphone.webp", largeur: 900 },
  { fichier: 'iPad Pro (M5) 13" - Silver - Landscape.png', nom: "ipad.webp", largeur: 2400 },
];
const dossierCadres = new URL("../Notes/cadres/", import.meta.url).pathname;
const cibleCadres = new URL("../src/assets/cadres/", import.meta.url).pathname;
mkdirSync(cibleCadres, { recursive: true });
for (const c of cadres) {
  const chemin = join(dossierCadres, c.fichier);
  if (!existsSync(chemin)) { console.warn(`  (cadre absent : ${c.fichier})`); continue; }
  await sharp(chemin).resize({ width: c.largeur }).webp({ quality: 92, alphaQuality: 100 }).toFile(join(cibleCadres, c.nom));
  console.log(`✓ cadre ${c.nom}`);
}

// Positions des onglets dessinés dans les captures (pour les rendre cliquables sur le site).
execFileSync(process.execPath, [new URL("./mesurer-onglets.mjs", import.meta.url).pathname], { stdio: "inherit" });
