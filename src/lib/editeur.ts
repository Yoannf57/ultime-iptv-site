// Informations sur l'éditeur et les hébergeurs (site.config.mjs), mises en forme pour une langue :
// noms et adresses tels quels, seul le nom du pays est écrit dans la langue de la page.
import config from "../../site.config.mjs";

export type Editeur = {
  nom: string; nomCommercial: string; statut: string; adresse: string; pays: string; directeur: string;
  telephone: string | null; siren: string | null; rcs: string | null;
};
export type Hebergeur = { role: string; nom: string; service: string; adresse: string; pays: string; telephone: string | null };

export const editeur = config.editeur as Editeur;
export const hebergeurs = config.hebergeurs as Hebergeur[];

export function nomPays(langue: string, code: string): string {
  return new Intl.DisplayNames([langue], { type: "region" }).of(code) ?? code;
}

export function adresseComplete(langue: string, x: { adresse: string; pays: string }): string {
  return `${x.adresse}, ${nomPays(langue, x.pays)}`;
}
