// Offre Black Friday (site.config.mjs, « blackFriday ») : Premium à vie à prix réduit jusqu'à une date de fin.
// Rien n'est calculé par conversion : le prix normal vient de src/pays.json (« vie »), le prix réduit de
// site.config.mjs (par monnaie). Seul le pourcentage est calculé, à partir de ces deux prix, arrondi vers le bas.
import config from "../../site.config.mjs";
import { t } from "./textes";
import { formaterPrix, type Pays } from "./pays";

// Le bloc peut être retiré de site.config.mjs une fois l'offre finie : le site reste alors le site normal.
const reglage = (config as { blackFriday?: { actif: boolean; fin: string; prix: Record<string, { solo: number; famille: number }> } }).blackFriday
  ?? { actif: false, fin: "", prix: {} };
export const offreActive: boolean = reglage.actif === true;
export const finOffre: string = reglage.fin; // « 2026-11-30 », dernier jour inclus

export type PrixOffre = {
  normal: string;      // prix normal formaté (barré)
  reduit: string;      // prix Black Friday formaté
  remise: string;      // « −33 % », dans la langue de la page
  prixDunAn: boolean;  // vrai si le prix réduit est égal au prix de l'abonnement annuel de la même formule
};
export type Offre = {
  date: string;        // « 30 novembre »
  jourDate: string;    // « lundi 30 novembre »
  // null sur une page internationale (sans prix) : l'offre est annoncée sans montant ni pourcentage.
  prix: { solo: PrixOffre; famille: PrixOffre } | null;
  prixDunAn: boolean;  // vrai seulement si c'est vrai pour Solo ET pour Famille
};

// Pourcentage arrondi vers le bas, calculé en centimes entiers (pas d'erreur d'arrondi sur les décimales).
function pourcentage(normal: number, reduit: number): number {
  const n = Math.round(normal * 100);
  const r = Math.round(reduit * 100);
  return Math.floor(((n - r) * 100) / n);
}

function prixOffre(p: Pays, langue: string, formule: "solo" | "famille"): PrixOffre {
  const normal = p.prix?.[formule].vie;
  const reduit = reglage.prix[p.devise ?? ""]?.[formule];
  if (normal === undefined) throw new Error(`Black Friday : pas de prix « vie » ${formule} pour ${p.code} dans pays.json.`);
  if (reduit === undefined) throw new Error(`Black Friday : pas de prix réduit ${formule} en ${p.devise} (site.config.mjs) pour ${p.code}.`);
  if (!(reduit < normal)) throw new Error(`Black Friday : le prix réduit ${formule} de ${p.code} n'est pas inférieur au prix normal.`);
  return {
    normal: formaterPrix(normal, p),
    reduit: formaterPrix(reduit, p),
    remise: t(langue, "tarifs.remise", { remise: String(pourcentage(normal, reduit)) }),
    prixDunAn: reduit === p.prix?.[formule].annuel,
  };
}

// L'offre pour une page, ou null si le réglage est à false (le site reste alors exactement le site normal).
export function offrePour(p: Pays): Offre | null {
  if (!offreActive) return null;
  const jour = new Date(`${finOffre}T12:00:00Z`);
  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(p.locale, { ...options, timeZone: "UTC" }).format(jour);
  const prix = p.prix ? { solo: prixOffre(p, p.langue, "solo"), famille: prixOffre(p, p.langue, "famille") } : null;
  return {
    date: format({ day: "numeric", month: "long" }),
    jourDate: format({ weekday: "long", day: "numeric", month: "long" }),
    prix,
    prixDunAn: prix !== null && prix.solo.prixDunAn && prix.famille.prixDunAn,
  };
}
