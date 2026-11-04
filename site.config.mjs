// Réglages du site : c'est le SEUL endroit à modifier pour basculer le site.
export default {
  // false tant que l'app n'est pas sur l'App Store : bouton « Bientôt sur l'App Store » désactivé.
  // Passer à true au Lot 11 (et remplir lienAppStore dans src/pays.json).
  disponible: false,

  // false = caché de Google (balise noindex + robots.txt qui interdit tout). Passer à true à la fin de S4.
  indexable: false,

  // Domaine définitif. Inactif tant que les DNS ne sont pas prêts (étape « Branchement de ultitv.com »).
  // Quand actif : le site est servi à la racine de ultitv.com (base « / ») et il faut créer public/CNAME.
  domaine: { actif: false, url: "https://ultitv.com" },

  // Adresse actuelle sur GitHub Pages.
  github: { site: "https://yoannf57.github.io", base: "/ultime-iptv-site/" },

  contact: "contact@ultitv.com",

  // Éditeur du site et de l'app (informations données par Yoann le 04/11/2026 à 23 h 20). Utilisé par les mentions
  // légales, les conditions d'utilisation et la confidentialité, dans les 12 langues : noms et adresses tels quels,
  // seul le nom du pays est écrit dans la langue de la page (Intl.DisplayNames, à partir du code « pays »).
  // Une valeur à null s'affiche comme un emplacement bien visible (« [TÉLÉPHONE] », « [SIREN — immatriculation en
  // cours] ») : il suffit de remplacer null par la valeur, entre guillemets.
  editeur: {
    nom: "Yoann FEBVRE",
    nomCommercial: "Ulti",
    statut: "micro-entrepreneur", // texte affiché : mentions.statuts.micro-entrepreneur, traduit dans chaque langue
    adresse: "173 rue de Courcelles, 75017 Paris",
    pays: "FR",
    directeur: "Yoann FEBVRE",
    telephone: null, // ← à remplir, ex. "+33 6 12 34 56 78"
    siren: null,     // ← à remplir, ex. "123 456 789"
  },

  // Hébergeurs (aucun numéro de téléphone donné : la ligne n'apparaît pas tant qu'il vaut null).
  hebergeurs: [
    { role: "site", nom: "GitHub, Inc.", service: "GitHub Pages", adresse: "88 Colin P. Kelly Jr. Street, San Francisco, CA 94107", pays: "US", telephone: null },
    { role: "relais", nom: "Cloudflare, Inc.", service: "api.ultitv.com", adresse: "101 Townsend Street, San Francisco, CA 94107", pays: "US", telephone: null },
  ],
};
