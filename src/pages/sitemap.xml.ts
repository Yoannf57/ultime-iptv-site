// Plan du site pour Google et Bing (sitemap.xml), annoncé dans robots.txt et soumis dans la Search Console.
// Seulement les pages indexées : accueil et sous-pages de chaque pays ou langue, sauf conditions et mentions légales
// (« noindex », src/lib/liens.ts : pagesHorsIndex). Pas la racine (redirection vers le pays deviné), ni la page de choix
// du pays (doublon de la racine, « noindex »), ni la 404.
// Chaque adresse porte ses versions dans les autres langues (xhtml:link hreflang, comme dans <head>), plus x-default
// vers /en/. Pas de « lastmod » : toutes les pages sont régénérées à chaque publication, une date de construction
// n'apprendrait rien à Google.
import type { APIRoute } from "astro";
import config from "../../site.config.mjs";
import { pays, hreflang } from "../lib/pays";
import { lienAbsolu, sousPages, pageIndexee } from "../lib/liens";

export const GET: APIRoute = ({ site }) => {
  const absolu = (chemin: string) => lienAbsolu(chemin, site);
  const groupes = ["", ...sousPages.filter(pageIndexee).map((s) => `${s}/`)];
  const entrees: string[] = [];
  for (const sous of groupes) {
    const alternatives = [
      ...pays.map((p) => `    <xhtml:link rel="alternate" hreflang="${hreflang(p)}" href="${absolu(`${p.code}/${sous}`)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolu(`en/${sous}`)}"/>`,
    ].join("\n");
    for (const p of pays) entrees.push(`  <url>\n    <loc>${absolu(`${p.code}/${sous}`)}</loc>\n${alternatives}\n  </url>`);
  }
  const xml = config.indexable
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entrees.join("\n")}\n</urlset>\n`
    : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
