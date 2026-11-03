// Accès aux textes visibles. Aucun texte ne doit être écrit en dur dans les pages :
// tout passe par la fonction t (langue + clé, ex. accueil.accroche). Une clé absente fait échouer la construction.
const fichiers = import.meta.glob<{ default: Record<string, unknown> }>("../textes/*.json", { eager: true });

const textes: Record<string, Record<string, unknown>> = {};
for (const [chemin, module] of Object.entries(fichiers)) {
  const langue = chemin.split("/").pop()!.replace(".json", "");
  textes[langue] = module.default;
}

export function langues(): string[] {
  return Object.keys(textes);
}

export function t(langue: string, cle: string, valeurs: Record<string, string> = {}): string {
  const fichier = textes[langue];
  if (!fichier) throw new Error(`Aucun fichier de textes pour la langue « ${langue} » (src/textes/${langue}.json).`);
  let valeur: unknown = fichier;
  for (const morceau of cle.split(".")) {
    valeur = valeur && typeof valeur === "object" ? (valeur as Record<string, unknown>)[morceau] : undefined;
  }
  if (typeof valeur !== "string" || valeur === "") {
    throw new Error(`Texte manquant : « ${cle} » en « ${langue} ».`);
  }
  return valeur.replace(/\{(\w+)\}/g, (_, nom) => valeurs[nom] ?? `{${nom}}`);
}

// Texte avec liens : t() puis « [libellé](cible) » devient un lien. « cibles » donne l'adresse de chaque cible
// (ex. { contact: "mailto:…", privacy: "/fr-fr/privacy/" }). Le texte est échappé avant : à afficher avec set:html.
export function tHtml(langue: string, cle: string, cibles: Record<string, string> = {}, valeurs: Record<string, string> = {}): string {
  const echappe = t(langue, cle, valeurs).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return echappe.replace(/\[([^\]]+)\]\(([\w-]+)\)/g, (_, libelle, cible) => {
    const adresse = cibles[cible];
    if (!adresse) throw new Error(`Lien « ${cible} » inconnu dans « ${cle} » (${langue}).`);
    const externe = /^https?:/.test(adresse) ? ' rel="noopener"' : "";
    return `<a href="${adresse.replace(/"/g, "&quot;")}"${externe}>${libelle}</a>`;
  });
}
