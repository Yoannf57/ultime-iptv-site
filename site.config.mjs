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
};
