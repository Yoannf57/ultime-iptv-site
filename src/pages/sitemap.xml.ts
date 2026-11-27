// Plan du site pour Google et Bing (sitemap.xml), annoncé dans robots.txt.
// Toutes les pages indexables : accueil et sous-pages de chaque pays ou langue, plus la page de choix du pays.
// Chaque adresse porte ses versions dans les autres langues (xhtml:link hreflang, comme dans <head>), plus x-default
// vers /en/. La page racine (qui redirige vers le pays deviné) et la 404 n'y sont pas.
import type { APIRoute } from "astro";
import config from "../../site.config.mjs";
import { pays, hreflang } from "../lib/pays";
import { lienAbsolu, sousPages } from "../lib/liens";

export const GET: APIRoute = ({ site }) => {
  const absolu = (chemin: string) => lienAbsolu(chemin, site);
  // Date de construction : les pages sont toutes régénérées à chaque publication.
  const date = new Date().toISOString().slice(0, 10);
  const groupes = ["", ...sousPages.map((s) => `${s}/`)];
  const entrees: string[] = [];
  for (const sous of groupes) {
    const alternatives = [
      ...pays.map((p) => `    <xhtml:link rel="alternate" hreflang="${hreflang(p)}" href="${absolu(`${p.code}/${sous}`)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolu(`en/${sous}`)}"/>`,
    ].join("\n");
    for (const p of pays) {
      entrees.push(`  <url>\n    <loc>${absolu(`${p.code}/${sous}`)}</loc>\n    <lastmod>${date}</lastmod>\n${alternatives}\n  </url>`);
    }
  }
  entrees.push(`  <url>\n    <loc>${absolu("pays/")}</loc>\n    <lastmod>${date}</lastmod>\n  </url>`);
  const xml = config.indexable
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entrees.join("\n")}\n</urlset>\n`
    : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
