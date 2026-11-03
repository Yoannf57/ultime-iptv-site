import { defineConfig } from "astro/config";
import config from "./site.config.mjs";
import pays from "./src/pays.json" with { type: "json" };

const site = config.domaine.actif ? config.domaine.url : config.github.site;
const base = config.domaine.actif ? "/" : config.github.base;

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  build: { format: "directory" },
  i18n: {
    locales: pays.map((p) => p.code),
    defaultLocale: "en",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
