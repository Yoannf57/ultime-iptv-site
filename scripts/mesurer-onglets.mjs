// npm run mesurer-onglets — mesure où sont les onglets dessinés dans les vraies captures (barre Accueil · Direct ·
// Films… en haut de l'écran), pour y poser des boutons invisibles : un clic sur « Direct » dans l'image montre
// l'écran Direct. Écrit src/donnees/onglets.json : positions en % de la capture, par appareil, langue et écran.
// Relancé automatiquement par « npm run importer-captures ». Méthode : colonnes de pixels blancs (texte des onglets)
// dans la bande de la barre ; sur Apple TV, l'onglet actif est une pastille blanche, repérée à part.
import sharp from "sharp";
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const racine = new URL("../src/assets/captures/", import.meta.url).pathname;
const sortie = new URL("../src/donnees/onglets.json", import.meta.url).pathname;
// Écrans qui montrent la barre, nombre d'onglets attendus, bande verticale (texte, puis zone cliquable) et écart
// entre deux onglets, en pixels de la capture importée.
const reglages = {
  // Apple TV : seulement l'Accueil ; l'écran Guide a la même barre au même endroit (le site reprend ces positions).
  appletv: { ecrans: ["accueil"], onglets: 6, texte: [75, 140], zone: [67, 152], ecart: 60, xmin: 330, marge: 30, pastille: 74 },
  ipad: { ecrans: ["accueil", "direct", "guide", "films-series"], onglets: 4, texte: [55, 105], zone: [47, 112], ecart: 25, xmin: 300, marge: 22 },
};
const blanc = (d, i, seuil = 245) => d[i] > seuil && d[i + 1] > seuil && d[i + 2] > seuil;

async function mesurer(fichier, r) {
  const { data, info } = await sharp(fichier).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const col = new Array(W).fill(0);
  for (let y = r.texte[0]; y < r.texte[1]; y++) for (let x = 0; x < W; x++) if (blanc(data, (y * W + x) * 3)) col[x]++;
  let segs = []; let debut = -1, fin = -1;
  for (let x = r.xmin; x < W; x++) {
    if (col[x] > 1) { if (debut < 0) debut = x; else if (x - fin > r.ecart) { segs.push([debut, fin]); debut = x; } fin = x; }
  }
  if (debut >= 0) segs.push([debut, fin]);
  // Apple TV : la pastille blanche de l'onglet actif (ligne au-dessus du texte) peut se coller au mot suivant.
  if (r.pastille) {
    const y = r.pastille; let a = -1, b = -1;
    for (let x = r.xmin; x < W - 1; x++) {
      if (blanc(data, (y * W + x) * 3, 225)) { if (a < 0) a = x; b = x; } else if (a >= 0 && x - b > 3) { if (b - a > 100) break; a = -1; }
    }
    if (a >= 0 && b - a > 100) {
      const p = [a - 17, b + 17];
      const avant = segs.filter((s) => s[1] < p[0]);
      const apres = segs.filter((s) => s[1] > p[1]).map((s) => [Math.max(s[0], p[1] + r.ecart / 2), s[1]]);
      segs = [...avant, p, ...apres];
    }
  }
  if (segs.length < r.onglets) return null;
  return segs.slice(0, r.onglets).map(([x0, x1]) => {
    const x = Math.max(0, x0 - r.marge), w = x1 + r.marge - x;
    return [x / W, r.zone[0] / H, w / W, (r.zone[1] - r.zone[0]) / H].map((v) => Math.round(v * 100000) / 1000);
  });
}

const resultat = {};
const problemes = [];
for (const [appareil, r] of Object.entries(reglages)) {
  resultat[appareil] = {};
  for (const langue of readdirSync(racine).sort()) {
    for (const ecran of r.ecrans) {
      const fichier = join(racine, langue, appareil, `${ecran}.webp`);
      if (!existsSync(fichier)) continue;
      const zones = await mesurer(fichier, r);
      if (!zones) { problemes.push(`${langue}/${appareil}/${ecran}`); continue; }
      (resultat[appareil][langue] ??= {})[ecran] = zones;
    }
  }
}
writeFileSync(sortie, JSON.stringify(resultat, null, 1) + "\n");
console.log(`✓ onglets mesurés → src/donnees/onglets.json${problemes.length ? ` (non trouvés : ${problemes.join(", ")})` : ""}`);
