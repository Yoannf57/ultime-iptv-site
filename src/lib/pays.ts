import liste from "../pays.json";

export type Formule = { mensuel: number; annuel: number; vie: number; annuelParMois: number; remise: number };
export type Pays = {
  code: string;
  langue: string;
  locale: string;
  region: "europe" | "ameriques" | "international";
  nom: string;
  nomLangue: string;
  fuseaux: string[];
  devise: string | null;
  lienAppStore: string | null;
  prix: { solo: Formule; famille: Formule } | null;
};

export const pays = liste as Pays[];
export const regions = ["europe", "ameriques", "international"] as const;

export function trouverPays(code: string): Pays {
  const p = pays.find((x) => x.code === code);
  if (!p) throw new Error(`Pays inconnu : ${code}`);
  return p;
}

// Formate un prix tel qu'il est écrit dans pays.json (jamais de conversion de monnaie).
export function formaterPrix(montant: number, p: Pays): string {
  if (!p.devise) throw new Error(`Pas de monnaie pour ${p.code}`);
  const entier = Number.isInteger(montant);
  return new Intl.NumberFormat(p.locale, {
    style: "currency", currency: p.devise,
    minimumFractionDigits: entier ? 0 : 2, maximumFractionDigits: entier ? 0 : 2,
  }).format(montant);
}

// Données minimales envoyées au navigateur pour deviner le pays.
export const paysPourNavigateur = pays.map(({ code, langue, fuseaux }) => ({ code, langue, fuseaux }));
