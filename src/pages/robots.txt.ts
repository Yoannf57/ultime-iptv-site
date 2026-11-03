// robots.txt piloté par « indexable » dans site.config.mjs.
import type { APIRoute } from "astro";
import config from "../../site.config.mjs";
import { lienAbsolu } from "../lib/liens";

export const GET: APIRoute = ({ site }) => {
  const contenu = config.indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${lienAbsolu("sitemap-index.xml", site)}\n`
    : "User-agent: *\nDisallow: /\n";
  return new Response(contenu, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
