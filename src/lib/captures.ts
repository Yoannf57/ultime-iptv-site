// Vraies captures de l'app (src/assets/captures/<langue>/<appareil>/<nom>.webp, importées par
// « npm run importer-captures »), dans les 12 langues du site. Une langue sans captures montre les anglaises.
import type { ImageMetadata } from "astro";
import donnees from "../donnees/captures.json";
import mesures from "../donnees/onglets.json";

const images = import.meta.glob<{ default: ImageMetadata }>("../assets/captures/*/*/*.webp", { eager: true });

export type Appareil = "appletv" | "ipad" | "iphone";
export type Ecran = { appareil: Appareil; capture: string };
export const captures = donnees as {
  apercu: { vues: string[]; ecrans: Record<Appareil, Record<string, string>> };
  visite: { vue: string; capture: string; premium: boolean }[];
  appletv: Ecran;
  famille: Ecran;
};

const languesAvecCaptures = new Set(Object.keys(images).map((chemin) => chemin.split("/")[3]));
export function langueCaptures(langue: string): string {
  return languesAvecCaptures.has(langue) ? langue : "en";
}

export function image(langue: string, appareil: Appareil, nom: string): ImageMetadata {
  const chemin = `../assets/captures/${langueCaptures(langue)}/${appareil}/${nom}.webp`;
  const module = images[chemin];
  if (!module) throw new Error(`Capture introuvable : ${chemin} (lancer « npm run importer-captures »)`);
  return module.default;
}

// Largeurs produites pour chaque appareil (AVIF et WebP).
export const largeurs: Record<Appareil, number[]> = {
  appletv: [640, 960, 1280, 1920, 2560],
  ipad: [480, 768, 1024, 1536, 2048],
  iphone: [240, 360, 480, 720, 1000],
};

// Onglets dessinés dans les captures (src/donnees/onglets.json, mesuré par « npm run mesurer-onglets ») et l'écran
// du site que montre chacun. Apple TV : barre de l'Accueil (l'écran Guide a la même, au même endroit).
const onglets: Partial<Record<Appareil, { source: Record<string, string>; vues: string[] }>> = {
  appletv: { source: { accueil: "accueil", guide: "accueil" }, vues: ["accueil", "direct"] },
  ipad: { source: { accueil: "accueil", direct: "direct", guide: "guide", "films-series": "films-series" }, vues: ["accueil", "direct", "films"] },
};
export function zones(langue: string, appareil: Appareil, capture: string) {
  const o = onglets[appareil];
  const source = o?.source[capture];
  const mesure = (mesures as Record<string, Record<string, Record<string, number[][]>>>)[appareil]?.[langueCaptures(langue)]?.[source ?? ""];
  if (!o || !mesure) return [];
  return o.vues.map((vue, i) => ({ vue, x: mesure[i][0], y: mesure[i][1], l: mesure[i][2], h: mesure[i][3] }));
}
