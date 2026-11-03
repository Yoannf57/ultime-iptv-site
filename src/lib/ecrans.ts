// Données des écrans dessinés (src/donnees/ecrans.json) + petits calculs d'affichage.
import donnees from "../donnees/ecrans.json";
import { t } from "./textes";

export const ecrans = donnees;
export type IdChaine = keyof typeof donnees.chaines;

export function chaine(id: string) {
  const c = (donnees.chaines as Record<string, { logo: string; nom: string; fond: string; police: string; info: boolean }>)[id];
  if (!c) throw new Error(`Chaîne inconnue dans ecrans.json : ${id}`);
  return c;
}

// Titre d'un élément : nom propre (film Blender) ou émission inventée à traduire.
export function titre(element: { titre?: string; cle?: string }, langue: string): string {
  if (element.cle) return t(langue, `ecrans.programmes.${element.cle}`);
  if (element.titre) return element.titre;
  throw new Error("Élément sans titre ni clé dans ecrans.json");
}

// Anneau d'avancement : rouge seulement pour les chaînes d'info (CLAUDE.md, section 5).
export const ROUGE = "#FF3B30";
export function couleurAnneau(info: boolean) {
  return info ? ROUGE : "#F5F5F7";
}
export function anneau(avance: number, info: boolean, fondVide = "#3A3A3E") {
  return `conic-gradient(${couleurAnneau(info)} 0 ${avance}%, ${fondVide} ${avance}% 100%)`;
}

// Code QR décoratif de la maquette (21 × 21), dessiné en SVG : [ligne, colonne] des cases pleines.
export function codeQR(): [number, number][] {
  const n = 21;
  const cases: [number, number][] = [];
  const reperes: [number, number][] = [[0, 0], [0, n - 7], [n - 7, 0]];
  const repere = (r: number, c: number) => {
    for (const [r0, c0] of reperes) {
      if (r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7) {
        const dr = r - r0, dc = c - c0;
        const bord = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const centre = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        return bord || centre ? 1 : 0;
      }
      if (r >= r0 - 1 && r <= r0 + 7 && c >= c0 - 1 && c <= c0 + 7) return 0;
    }
    return -1;
  };
  let graine = 7;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const f = repere(r, c);
      let plein: boolean;
      if (f >= 0) plein = f === 1;
      else { graine = (graine * 1103515245 + 12345) % 2147483648; plein = (graine >> 16) % 2 === 0; }
      if (plein) cases.push([r, c]);
    }
  }
  return cases;
}
