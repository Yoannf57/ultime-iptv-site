// Construit toutes les adresses internes à partir de la base du site
// (« /ultime-iptv-site/ » sur GitHub Pages, « / » sur ultitv.com).
// Ne jamais écrire href="/..." directement dans une page.
const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + "/";

export function lien(chemin = ""): string {
  return base + chemin.replace(/^\/+/, "");
}

export function lienPays(code: string): string {
  return lien(`${code}/`);
}

export function lienAbsolu(chemin: string, site: URL | undefined): string {
  if (!site) throw new Error("La valeur « site » manque dans astro.config.mjs.");
  return new URL(lien(chemin), site).href;
}

export { base };

// Sous-pages d'un pays (mêmes noms dans toutes les langues, comme apple.com).
export const sousPages = ["support", "privacy", "legal"] as const;
export type SousPage = (typeof sousPages)[number];
export function lienSousPage(code: string, page: SousPage): string {
  return lien(`${code}/${page}/`);
}

// Cibles des liens écrits dans les textes (« [libellé](cible) »), pour un pays donné.
export function ciblesTextes(code: string, contact: string): Record<string, string> {
  const apple = code === "en" ? "en-us" : code;
  return {
    contact: `mailto:${contact}`,
    support: lienSousPage(code, "support"),
    privacy: lienSousPage(code, "privacy"),
    legal: lienSousPage(code, "legal"),
    accueil: lien(`${code}/`),
    tarifs: lien(`${code}/#tarifs`),
    credits: lien(`${code}/legal/#s-credits`),
    pays: lien("pays/"),
    "apple-resilier": `https://support.apple.com/${apple}/118428`,
    "apple-partage": `https://support.apple.com/${apple}/108380`,
    "github-confidentialite": "https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement",
    "blender": "https://studio.blender.org/films/",
    "tmdb": "https://www.themoviedb.org/",
    "cc-by-25": "https://creativecommons.org/licenses/by/2.5/",
    "cc-by-3": "https://creativecommons.org/licenses/by/3.0/",
    "cc-by-4": "https://creativecommons.org/licenses/by/4.0/",
  };
}
