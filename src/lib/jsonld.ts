// Données structurées communes (schema.org) : l'éditeur et le site, posés sur la page racine et sur chaque accueil.
// Le logo est l'icône de l'app (public/logo-ulti.png, 512 × 512). Jamais de note ni d'avis inventés.
import config from "../../site.config.mjs";
import { lienAbsolu } from "./liens";

export function editeurEtSite(site: URL) {
  const racine = lienAbsolu("", site);
  return {
    racine,
    graphe: [
      {
        "@type": "Organization",
        "@id": `${racine}#editeur`,
        name: "Ulti",
        url: racine,
        email: config.contact,
        logo: { "@type": "ImageObject", url: lienAbsolu("logo-ulti.png", site), width: 512, height: 512 },
      },
      {
        "@type": "WebSite",
        "@id": `${racine}#site`,
        name: "Ulti",
        alternateName: ["Ulti IPTV", "ultitv.com"],
        url: racine,
        publisher: { "@id": `${racine}#editeur` },
      },
    ],
  };
}

// Texte JSON sûr dans une balise <script> (aucun « </script> » possible).
export function jsonPourScript(donnees: unknown): string {
  return JSON.stringify(donnees).replace(/</g, "\\u003c");
}
