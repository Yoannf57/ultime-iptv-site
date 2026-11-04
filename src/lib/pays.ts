import liste from "../pays.json";

// Prix relevés dans App Store Connect (jamais convertis d'une autre monnaie). Un montant absent s'affiche
// « Prix affiché dans l'App Store » ; remise et prix par mois ne s'affichent que s'ils sont écrits ici.
export type Formule = { mensuel?: number; annuel?: number; vie?: number; annuelParMois?: number; remise?: number };
export type Pays = {
  code: string;
  langue: string;
  locale: string;
  region: "europe" | "ameriques" | "asie-pacifique" | "international";
  nom: string;
  nomLangue: string;
  fuseaux: string[];
  devise: string | null;
  lienAppStore: string | null;
  prix: { solo: Formule; famille: Formule } | null;
  taxesEnSus?: boolean;  // prix hors taxe de vente (États-Unis, Canada) : « Taxes applicables en sus. »
};

export const pays = liste as Pays[];

// Page internationale d'une langue (/en/, /fr/, /es/…) : sans prix ni bandeau, pour les pays absents de la liste.
export function estInternational(p: Pays): boolean {
  return p.region === "international";
}
// Code hreflang : la langue seule pour une page internationale (« es »), sinon la locale (« es-ES »).
export function hreflang(p: Pays): string {
  return estInternational(p) ? p.langue : p.locale;
}
export const regions = ["europe", "ameriques", "asie-pacifique", "international"] as const;

export function trouverPays(code: string): Pays {
  const p = pays.find((x) => x.code === code);
  if (!p) throw new Error(`Pays inconnu : ${code}`);
  return p;
}

// Formate un prix tel qu'il est écrit dans pays.json (jamais de conversion de monnaie).
// Monnaies affichées toujours avec 2 décimales (comme l'App Store : £1.99, CHF 2.00) ; les autres (EUR, SEK, NOK,
// DKK, MXN) sans décimales quand le montant est rond (29 kr, 39 $).
const deuxDecimales = new Set(["GBP", "USD", "CAD", "CHF", "BRL", "AUD"]);
export function formaterPrix(montant: number, p: Pays): string {
  if (!p.devise) throw new Error(`Pas de monnaie pour ${p.code}`);
  // 0 (carte Gratuit) toujours sans décimales : « £0 », pas « £0.00 ».
  const decimales = montant !== 0 && (deuxDecimales.has(p.devise) || !Number.isInteger(montant)) ? 2 : 0;
  return new Intl.NumberFormat(p.locale, {
    style: "currency", currency: p.devise, minimumFractionDigits: decimales, maximumFractionDigits: decimales,
  }).format(montant);
}

// Données minimales envoyées au navigateur pour deviner le pays.
export const paysPourNavigateur = pays.map(({ code, langue, fuseaux, region }) => ({ code, langue, fuseaux, international: region === "international" }));
