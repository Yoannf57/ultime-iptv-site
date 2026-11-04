// npm run importer-captures — copie les captures App Store faites par la session de l'app (dépôt ultime-iptv, lu
// seulement) dans src/assets/captures/<fr|en>/<appareil>/<nom>.webp, réduites et compressées. Astro produit ensuite
// les versions AVIF et WebP à la bonne taille pour chaque écran (<Picture>).
// Écartées : celles qui montrent des photos de vraies personnes (distribution TMDB, rangée « Avec »), interdit sur
// le site (CLAUDE.md, section 5) : 04-fiche-film partout, et 07-films-series sur iPad (fiche ouverte à droite).
import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const source = process.argv[2] || join(homedir(), "Developer/ultime-iptv/Notes/app-store/captures");
const cible = new URL("../src/assets/captures/", import.meta.url).pathname;
const largeurs = { appletv: 2560, ipad: 2048, iphone: 1000 };
const ecartees = ["*/04-fiche-film", "ipad/07-films-series"];

if (!existsSync(source)) { console.error(`Dossier introuvable : ${source}`); process.exit(1); }
let n = 0;
for (const langue of ["fr", "en"]) {
  for (const [appareil, largeur] of Object.entries(largeurs)) {
    const dossier = join(source, langue, appareil);
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
