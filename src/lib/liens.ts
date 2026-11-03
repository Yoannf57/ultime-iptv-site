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
