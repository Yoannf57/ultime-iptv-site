// Réglages du site : c'est le SEUL endroit à modifier pour basculer le site.
export default {
  // false tant que l'app n'est pas sur l'App Store : bouton « Bientôt sur l'App Store » désactivé.
  // JOUR DE LA PUBLICATION : passer à true. Le badge officiel, les liens App Store de chaque pays et le Smart App
  // Banner de Safari s'activent tout seuls.
  disponible: true,

  // false tant qu'Apple n'a pas accepté la version Apple TV : sous le badge, « Apple TV : dans quelques jours. », et
  // la FAQ et le Support disent que l'Apple TV arrive dans les jours qui viennent. Sans effet si disponible vaut false.
  appleTvDisponible: true,

  // BLACK FRIDAY 2026 : Premium à vie à prix réduit dans l'App Store, jusqu'au 30/11/2026 inclus.
  // actif: false → le site est exactement le site normal (rien de l'offre n'est écrit dans les pages).
  // actif: true  → chaque page d'accueil contient les deux versions ; un petit script choisit selon la date du
  //   visiteur : l'offre jusqu'à « fin » inclus, le site normal à partir du lendemain, sans rien republier.
  //   Pour essayer une date à venir : ajouter ?date=2026-12-01 à l'adresse de la page (une date passée est ignorée).
  //   Une fois l'offre finie : repasser à false, pour retirer les prix réduits du code des pages.
  // prix : prix réduits de « Premium à vie », par monnaie, relevés dans App Store Connect le 24/11/2026 (jamais
  //   calculés ni convertis). Le prix normal barré et le pourcentage viennent de src/pays.json (src/lib/offre.ts).
  // aussiGooglePlay : true depuis le 27/11/2026 (demande de Yoann) : Premium à vie Solo est aussi en promo sur Google
  //   Play, aux mêmes prix (Famille n'existe pas sur Android). Ajoute une phrase à la section #offre et à la question
  //   de la FAQ (offre.googlePlay*) et un lien « Aussi sur Google Play ». À false : offre App Store seulement.
  blackFriday: {
    actif: true,
    fin: "2026-11-30",
    aussiGooglePlay: true,
    prix: {
      EUR: { solo: 19.99, famille: 29.99 },
      GBP: { solo: 17.99, famille: 24.99 },
      USD: { solo: 17.99, famille: 24.99 },
      CAD: { solo: 24.99, famille: 34.99 },
      CHF: { solo: 15.0, famille: 20.0 },
      SEK: { solo: 229, famille: 299 },
      NOK: { solo: 229, famille: 299 },
      DKK: { solo: 149, famille: 199 },
      BRL: { solo: 119.9, famille: 149.9 },
      MXN: { solo: 399, famille: 499 },
      AUD: { solo: 29.99, famille: 39.99 },
    },
  },

  // Fiche App Store : https://apps.apple.com/<pays>/app/<nom>/id<id> (adresse sans pays pour les pages
  // internationales). Calculée par src/lib/appstore.ts ; une seule valeur à changer si Apple change le format.
  appStore: { id: "6829902519", nom: "ulti-iptv-player" },

  // Fiche Google Play (app acceptée le 27/11/2026, téléphones et tablettes Android, formule Solo seulement).
  // disponible: true → badge officiel Google Play à côté de celui de l'App Store, liens « Aussi sur Google Play »,
  // phrase sous les tarifs. Adresse calculée par src/lib/googleplay.ts.
  googlePlay: { disponible: true, id: "com.yoannfebvre.ultimeiptv" },

  // false = caché de Google (balise noindex + robots.txt qui interdit tout).
  // Passer à true avec le branchement d'ultitv.com (ou le jour de la publication si le domaine n'est pas branché).
  indexable: true,

  // Domaine définitif. Inactif tant que les DNS ne sont pas prêts (étape « Branchement de ultitv.com »).
  // Quand actif : le site est servi à la racine de ultitv.com (base « / ») et il faut créer public/CNAME.
  domaine: { actif: false, url: "https://ultitv.com" },

  // Adresse actuelle sur GitHub Pages.
  github: { site: "https://yoannf57.github.io", base: "/ultime-iptv-site/" },

  contact: "contact@ultitv.com",

  // Éditeur du site et de l'app (informations données par Yoann le 04/11/2026 à 23 h 20). Utilisé par les mentions
  // légales, les conditions d'utilisation et la confidentialité, dans les 12 langues : noms et adresses tels quels,
  // seul le nom du pays est écrit dans la langue de la page (Intl.DisplayNames, à partir du code « pays »).
  // Une valeur à null s'affiche comme un emplacement bien visible (« [TÉLÉPHONE] ») : il suffit de remplacer null par la valeur, entre guillemets.
  editeur: {
    nom: "Yoann FEBVRE",
    nomCommercial: "Ulti",
    statut: "micro-entrepreneur", // texte affiché : mentions.statuts.micro-entrepreneur, traduit dans chaque langue
    adresse: "173 rue de Courcelles, 75017 Paris",
    pays: "FR",
    directeur: "Yoann FEBVRE",
    telephone: null, // ← à remplir, ex. "+33 6 12 34 56 78"
    siren: "132 608 365", // donné par Yoann le 14/11/2026
    rcs: "Paris",         // ville du registre : affiché « RCS Paris 132 608 365 »
  },

  // Hébergeurs (aucun numéro de téléphone donné : la ligne n'apparaît pas tant qu'il vaut null).
  hebergeurs: [
    { role: "site", nom: "GitHub, Inc.", service: "GitHub Pages", adresse: "88 Colin P. Kelly Jr. Street, San Francisco, CA 94107", pays: "US", telephone: null },
    { role: "relais", nom: "Cloudflare, Inc.", service: "api.ultitv.com", adresse: "101 Townsend Street, San Francisco, CA 94107", pays: "US", telephone: null },
  ],
};
