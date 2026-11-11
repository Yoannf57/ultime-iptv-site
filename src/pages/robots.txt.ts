// robots.txt piloté par « indexable » dans site.config.mjs.
// Pas de ligne « Sitemap: » : le site n'a pas de plan du site (Google trouve les pages par les liens et hreflang).
import type { APIRoute } from "astro";
import config from "../../site.config.mjs";

export const GET: APIRoute = () => {
  const contenu = config.indexable ? "User-agent: *\nAllow: /\n" : "User-agent: *\nDisallow: /\n";
  return new Response(contenu, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
