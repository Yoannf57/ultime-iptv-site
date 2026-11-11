# CLAUDE.md — Site de présentation d'Ulti

Ce dépôt (`Yoannf57/ultime-iptv-site`, dossier `~/Developer/ultime-iptv-site`) contient **le site web de présentation**
d'Ulti, un lecteur IPTV payant pour iPhone et Apple TV. L'app elle-même est dans un autre dépôt
(`~/Developer/ultime-iptv`) et ne se touche jamais depuis ici. Les noms de dépôts et de dossiers gardent « ultime » :
ce sont des noms techniques, invisibles pour les visiteurs.

Dernière mise à jour : 11/11/2026 (**Ulti publié sur l'App Store** : `disponible: true`, `indexable: true`, `robots.txt` sans plan du site ; avant : section « Connexion » refaite : téléphone + Apple TV par QR code ; avant : section « Collez. C'est tout. » après le grand visuel ; badges d'Apple importés, 12 langues, badge noir validé ; publication préparée : badge officiel, liens App Store calculés, Smart App Banner,
« Bientôt sur Android », `appleTvDisponible` ; avant : informations légales définitives ; page Conditions d'utilisation ; confidentialité avec le relais TMDB ; grand
visuel Apple TV + iPhone et visite automatique sur iPad, dans les cadres officiels d'Apple ; « Ulti Premium » ; captures
des 12 langues ; textes à faire relire).

## Nom de l'app (décidé par Yoann le 03/11/2026)

« Ultime IPTV » est aussi le nom d'un revendeur d'abonnements IPTV (ultimeiptv.com). L'app s'appelle désormais **Ulti**.
- **Nom** : « Ulti » dans tous les textes, jamais « Ultime » ni « Ultime IPTV » comme nom. « ultime » reste permis comme
  adjectif.
- **Logo** : « Ulti » en gras, « IPTV » plus léger et en gris, avec l'anneau d'avancement.
- **Accroche principale** : « L'expérience IPTV ultime. » / « The ultimate IPTV experience. » (c'est aussi le
  sous-titre App Store).
- **Phrase de neutralité** : « Ulti ne fournit aucune chaîne ni aucun contenu. Vous devez disposer de vos propres
  sources, et avoir le droit de les regarder. » (et sa version anglaise).
- **Adresse de contact** (page Support, mentions légales, pied de page) : contact@ultitv.com.
- **Domaine** : ultitv.com, acheté chez Cloudflare le 03/11/2026, avec ultitv.app, ultiptv.app et ulti-iptv.com, qui
  seront redirigés vers ultitv.com.

Yoann débute en développement : réponds en français, simplement, et tutoie-le. Explique ce que tu fais en une ou deux
phrases, sans jargon.

## 1. Règles absolues

1. **Ne jamais modifier `~/Developer/ultime-iptv`** (l'app) ni `~/Developer/ultime-iptv-demo` (dépôt de démonstration).
   Une autre session de Claude Code travaille sur l'app en même temps. Lecture seule autorisée, par exemple pour reprendre
   les mots exacts de l'app dans `App/Shared/Resources/Localizable.xcstrings`.
2. **Ne jamais lancer Xcode, `xcodebuild` ni un simulateur** depuis cette session (le Mac manque de ressources, et les
   simulateurs servent à l'autre session).
3. **Ne pas casser les adresses du dépôt de démonstration** : `https://yoannf57.github.io/ultime-iptv-demo/confidentialite.html`
   est déclarée dans App Store Connect pour TestFlight. On ne basculera vers la page de confidentialité de ce site qu'au
   Lot 11 (publication), sur décision de Yoann.
4. **L'app est un lecteur neutre.** Elle ne fournit aucune chaîne, aucune liste, aucun contenu. Sur tout le site :
   - jamais de foot ni de sport nommé, jamais de logo de chaîne réelle, jamais « chaînes gratuites », « 10 000 chaînes »,
     beIN, Canal+, DAZN, Netflix, etc. ;
   - jamais de lien vers un fournisseur IPTV, ni d'aide pour en trouver un ;
   - aucune ressemblance avec myCANAL ou Canal+ (nom, couleurs, mise en page reconnaissable) ;
   - la phrase de neutralité (section « Nom de l'app »), visible sur l'accueil et dans la FAQ ;
   - captures d'écran faites **uniquement avec la liste de démonstration** (films Blender, série *Caminandes*, chaînes de
     test d'Apple), jamais avec l'abonnement de Yoann.
5. **Ne jamais promettre ce que l'app ne fait pas.** Chaque fonction citée doit exister dans l'app (voir section 6).
   Si une fonction n'est pas encore faite, elle n'apparaît pas, ou avec « Bientôt ».
6. **Ne jamais proposer une langue que l'app n'a pas.** Depuis le 04/11/2026, sur demande de Yoann (l'app les ajoute
   le même jour) : français, anglais, néerlandais, allemand, suédois, norvégien (bokmål), danois, finnois, espagnol,
   italien, portugais du Brésil et du Portugal. Les 10 nouvelles langues sont **à faire relire** par une personne de
   langue maternelle (traduction faite par Claude).
7. Git : commits avec les fichiers nommés un par un (pas de `git add -A`), jamais d'envoi forcé, jamais de secret dans
   le dépôt. Push à la fin de chaque étape validée.

## 2. Objectif

Un site **très professionnel**, sobre et cinématographique, prêt le jour de la sortie sur l'App Store. Il sert à :
- présenter l'app et donner envie (captures iPhone et Apple TV) ;
- afficher les prix ;
- fournir les pages exigées par Apple : **support** (obligatoire dans App Store Connect) et **confidentialité** ;
- le badge officiel « Télécharger dans l'App Store » dans la langue du visiteur (prêt depuis le 07/11/2026, affiché
  quand `disponible: true`).

**Publiée le 11/11/2026** (`disponible: true`) : badge officiel, liens App Store et Smart App Banner actifs.
Avant la publication, le bouton principal affiche « Bientôt sur l'App Store » (désactivé). Tout le site doit
pouvoir basculer en mode « disponible » en changeant **une seule valeur** dans la configuration (`site.config` :
`disponible: false`). Les liens App Store de chaque pays sont calculés (`src/lib/appstore.ts`, depuis `appStore: { id,
nom }` de `site.config.mjs`).

**Visible par Google depuis le 11/11/2026** (`indexable: true`, jour de la publication, ultitv.com pas encore
branché). À `false`, balise `<meta name="robots" content="noindex">` sur toutes les pages et `robots.txt` qui
interdit tout. La 404 garde toujours `noindex`. `robots.txt` n'annonce pas de plan du site (aucun n'est généré) ;
un plan du site éventuel est à faire avec ultitv.com. Au branchement d'ultitv.com, Google passera des adresses
github.io aux nouvelles (prévoir Google Search Console à ce moment-là).

## 3. Pays et langues

### Principe (décidé le 03/11/2026)
- Le visiteur choisit un **pays** (pas seulement une langue) : le pays donne la langue, le prix, et plus tard le lien
  App Store.
- **Pas d'écran de choix obligatoire** avant d'entrer sur le site. À la première visite, la page racine `/` envoie
  directement vers le pays deviné :
  1. choix déjà enregistré (`localStorage`, clé `ultime-pays`) → ce pays ;
  2. sinon, langue du navigateur (`navigator.languages`) + fuseau horaire (`Intl.DateTimeFormat().resolvedOptions().timeZone`)
     pour deviner le pays (ex. `fr` + `Europe/Brussels` → Belgique) ;
  3. sinon (ou JavaScript coupé) : la page racine **est** la belle page « Choisissez votre pays ou votre région ».
- Si le pays deviné est incertain, un **bandeau discret** en haut de page : « Vous êtes en Belgique ? Voir le site pour la
  Belgique » [Continuer] [×]. Il ne réapparaît pas après un choix.
- Une icône **globe** + nom du pays en bas de chaque page ouvre la page « Choisissez votre pays » (style Apple :
  pays regroupés par région, nom de chaque pays écrit dans sa propre langue).
- Pas de redirection côté serveur (GitHub Pages n'en fait pas) : tout se fait par un petit script sur `/`, et chaque
  page de pays est une vraie page statique, indexable par Google.

### Adresses
Une adresse par pays et langue, en minuscules : `/fr-fr/`, `/fr-be/`, `/fr-lu/`, `/fr-ch/`, `/fr-ca/`, `/en-gb/`,
`/en-ie/`, `/en-us/`, `/en-ca/`, `/nl-nl/`, `/nl-be/`, `/de-de/`, `/de-at/`, `/de-ch/`, `/sv-se/`, `/nb-no/`, `/da-dk/`,
`/fi-fi/`, `/es-es/`, `/it-it/`, `/pt-br/`, `/pt-pt/`, et depuis le 04/11/2026 au soir `/de-lu/` (euros), `/it-ch/`,
`/es-mx/`, `/en-au/` (région « Asie-Pacifique »).
**Pages internationales, une par langue** (04/11/2026) : `/en/`, `/fr/`, `/nl/`, `/de/`, `/sv/`, `/nb/`, `/da/`, `/fi/`,
`/es/`, `/it/`, `/pt/` (portugais d'Europe, pour l'Angola, le Mozambique…) : `region: "international"` dans
`pays.json`, sans prix (« Prix affiché dans l'App Store ») ni bandeau ; dans la page de choix, région
« International », une ligne par langue (« Español (Latinoamérica e internacional) »…).
Fichiers de textes : `fr`, `en`, `nl`, `de`, `sv`, `nb`, `da`, `fi`, `es`, `it`, `pt-br`, `pt` (Portugal). La devinette
du pays essaie l'étiquette complète du navigateur (`pt-br`) puis la langue seule (`pt`), et `no`/`nn` → `nb`.
- Chaque page a ses balises `hreflang` vers toutes les autres versions (langue seule pour une page internationale :
  `es`, `fr`…), plus `x-default` vers `/en/`.
- Les pays dont la langue n'est pas encore traduite **n'apparaissent pas** dans la liste : leurs visiteurs arrivent
  sur `/en/`. Un pays absent mais dont la langue existe mène à la page internationale de la langue, sans bandeau :
  Argentine → `/es/`, Sénégal → `/fr/`, Angola → `/pt/` (`deviner-pays.js`, testé par `npm run captures --
  --sans-captures`). Les pays déjà présents ne changent pas (fr-FR → `/fr-fr/`, es-MX → `/es-mx/`…).
- Aide d'Apple (support.apple.com/<pays>) : une page internationale prend le premier pays de sa langue (`es` →
  `es-es`, `en` → `en-us`) ; `de-lu` prend `de-de`.
- Page de choix et 404 : titres en français et en anglais seulement (12 langues seraient illisibles) ; chaque pays reste
  écrit dans sa langue ; sur la 404, la langue du visiteur s'ajoute en premier.

### Langues suivantes
- Faites le 04/11/2026 : I2a (nl, de), I2b (sv, nb, da, fi), I2c (es, it, pt-br, pt) ; le soir, pays `de-lu`, `it-ch`,
  `es-mx`, `en-au` et pages internationales par langue.
- Plus tard : turc, polonais, arabe (mise en page de droite à gauche : prévoir `dir="rtl"` dès maintenant dans la
  structure, sans le tester tout de suite).

Ajouter une langue doit se résumer à : un fichier de textes `textes/<langue>.json` + les pays dans `pays.json`.
Aucun texte visible écrit en dur dans les pages. Un script `npm run verifier-textes` signale toute clé manquante dans
une langue.

## 4. Pages

1. **Accueil** (une longue page qui défile) — maquette : https://claude.ai/artifact/Pf8FgEQ7eR9gFKviLe9dhv
   (artboards « Accueil » et « Choisissez votre pays »). Tu ne peux pas l'ouvrir depuis le terminal : avant S2, Yoann
   l'exporte en PDF ou en images dans `Notes/maquette/`. **Attention** : la section Tarifs de la maquette est périmée
   (une seule formule, films et séries gratuits) ; c'est la section 6 ci-dessous qui fait foi.
   **Vocabulaire (décidé le 03/11/2026)** : parler d'« abonnement IPTV », jamais de « M3U » ni d'« Xtream » dans les
   titres et les accroches (trop technique). Ces mots n'apparaissent que dans la FAQ et la page Support, pour dire
   quels formats sont pris en charge.
   **Nom et logo** : voir la section « Nom de l'app ».
   **Accroche principale** : « L'expérience IPTV ultime. » ; en anglais « The ultimate IPTV experience. ». Phrase
   dessous : « Direct, guide TV, films et séries : votre
   abonnement IPTV devient une app de télé intuitive. Vous l'ouvrez, vous regardez. » — en anglais : « Live TV, guide,
   movies and series: your IPTV subscription becomes an intuitive TV app. Just open it and watch. » Idée à garder :
   une app simple, prête à l'emploi, sans réglages compliqués.
   Sections, dans l'ordre :
   1. Grand visuel : petite ligne « Pour iPhone, iPad, Mac et Apple TV », l'accroche, une phrase, bouton App Store (ou
      « Bientôt »), puis **l'Apple TV au centre (écran flottant) et l'iPhone devant à droite, dans son cadre officiel**
      (décidé le 04/11/2026 : plus d'iPad ici). Pastilles Accueil · Direct · Guide TV · Profils qui changent les deux
      écrans, **au-dessus des appareils**, juste sous la phrase de neutralité, puis « Choisissez un écran pour découvrir l'app. » entre la barre et les appareils (demande de Yoann, 08/11/2026). **Depuis le 04/11 à 22 h (demande de Yoann)** : les écrans défilent aussi tout seuls, comme la visite
      iPad (même script `visite.js`, bouton Pause, arrêt au survol ou au clic), et les onglets dessinés dans la capture
      de l'Apple TV sont cliquables (Accueil, Direct). Sur téléphone, l'iPhone ferait moins de 200 px de haut (règle
      d'Apple pour le cadre) : il est masqué.
      **Onglets cliquables dans les captures** : `npm run mesurer-onglets` (relancé par `importer-captures`) repère
      les onglets dessinés dans les captures des 12 langues et écrit leurs positions (en %) dans
      `src/donnees/onglets.json` ; `Zones.astro` y pose des boutons invisibles (souris et toucher ; au clavier, les
      onglets sous l'écran font la même chose). Seulement les onglets qui ont une capture : Apple TV Accueil et
      Direct (barres des écrans Accueil et Guide) ; iPad Accueil, Direct et Films et séries. L'iPhone n'est pas
      cliquable.
      **Écrans cliquables** (demande de Yoann, 03/11/2026) : sur l'Apple TV, la barre Accueil · Direct · Replay ·
      Films · Séries change l'écran ; sur l'iPhone, la barre du bas (Accueil · Direct · Films · Séries). Petite phrase
      dessous : « Cliquez sur les écrans pour essayer l'app. » Dans le site final : une vraie capture par onglet (FR et
      EN), avec des `<button>` transparents posés exactement sur les onglets de la capture (positions en %, pour
      suivre la taille de l'écran), `aria-label` = nom de l'onglet, changement d'image en fondu court. Les captures
      sont chargées seulement au premier clic (sauf celle de l'accueil). Sur téléphone, l'iPhone est masqué et seule
      l'Apple TV reste cliquable.
   1 bis. **« Connexion »** (07/11/2026, remplace « Prêt en une minute » ; refaite le 08/11/2026 à la demande de
      Yoann) : surtitre « Connexion », grand titre à gauche « Se connecter n'a jamais été aussi simple. » (idée de
      Yoann : « la connexion la plus simple du monde », adoucie pour ne pas affirmer un record invérifiable), puis
      deux appareils, chacun avec son texte : **sur ordinateur, deux rangées en miroir** (téléphone puis son texte ;
      texte puis l'Apple TV, plus large ; demande de Yoann, 08/11/2026 : « sur l'ordi un peu moins bien ») ; **sur
      téléphone, chaque appareil puis son texte dessous** :
      - à gauche, le téléphone dessiné (écran flottant, liseré fin, halo, pas de cadre d'Apple) qui montre 4 tableaux
        en boucle : message du fournisseur → « Ajouter un abonnement », doigt sur « Coller » → champs remplis
        (« Trouvé : … ») → vraie capture iPhone de l'accueil ; dessous « Collez. C'est tout. » et sa phrase ;
      - à droite, l'Apple TV (écran 16:9 flottant) avec l'écran « Avec mon iPhone » dessiné d'après
        `TVPairingView.swift` (QR code décoratif qui ne se scanne pas, 3 étapes, code « 482 913 », mots de l'app :
        `collez.tv.*`) ; dessous « Scannez. C'est tout. » et sa phrase.
      Puis les 3 étapes (`etapes.e1…e3`) et « Moins d'une minute, montre en main. ». Seule adresse :
      `fournisseur.example` ; jamais « M3U » ni « Xtream » ; mots de l'app repris de `Localizable.xcstrings`
      (`collez.app.*`, `collez.tv.*`). Téléphone animé par `visite.js` (`data-enchainer` : un clic sur une étiquette
      rejoue ce tableau puis enchaîne la suite, « Coller » → « Remplissage » ; le survol n'arrête rien, seul le
      bouton Pause arrête ; `data-durees` : une durée par tableau ;
      `?tableau=<vue>` fige un tableau pour les captures, `npm run captures-sections -- --collez`). Sans JavaScript ou
      avec `prefers-reduced-motion` : les 4 tableaux du téléphone en 2 × 2. Code : `Collez.astro`, `CollezEcran.astro`,
      `CollezTv.astro`.
   2. « Votre abonnement, enfin bien présenté » : direct avec anneaux d'avancement, guide TV, films et séries avec
      affiches et résumés. La carte « Films et séries » porte une mention discrète « Avec Premium » (gris, sans
      majuscules ni pastille).
   2 bis. **« Faites le tour. »** (refait le 04/11/2026) : **démo automatique sur un seul iPad**, grand, de face, dans le
      cadre officiel de l'iPad Pro 13" (immobile ; seul l'écran change, en fondu). Captures iPad dans l'ordre :
      Accueil → Direct → Guide TV → Pause du direct → Films et séries → Profils (Multi-écran : pas de capture iPad,
      étape sautée ; à ajouter si la session de l'app en fait une). Un écran toutes les 4,5 s ; dessous : onglets
      (`<button aria-pressed>`, fine barre de progression), bouton Pause/Lecture, légende, « Avec Premium » sur les
      écrans Premium, puis « Aussi sur Mac avec puce Apple. » et les crédits Blender. Clic, clavier ou survol arrêtent
      la visite (reprise après 10 s sans action) ; un toucher l'arrête sans reprise ; un clic sur un onglet dessiné
      dans l'écran de l'iPad (Accueil, Direct, Films et séries) montre cet écran ; pause hors écran ou onglet
      caché ; rien ne bouge avec `prefers-reduced-motion`. Sans JavaScript : les écrans l'un sous l'autre.
      Code : `src/components/accueil/Visite.astro`, `src/scripts/visite.js`.
   3. Apple TV : « Zappez, tout simplement. » — zapping à la télécommande, image dans l'image, grandes affiches
      (recentrée le 08/11/2026 à la demande de Yoann : l'appairage par QR code est dans la section « Connexion »).
   4. Famille : profils, profil Enfant avec code parental.
   5. Ulti Premium (surtitre « Ulti Premium ») : **films et séries** (affiches, résumés, reprises), pause du direct, replay, téléchargements, synchro
      iCloud, plusieurs abonnements et profils, thèmes, et le multi-écran comme les autres fonctions (« jusqu'à 4
      directs à la fois (2 sur iPhone) »).
   6. Tarifs (section 6).
   7. Confidentialité en une phrase : « Aucune donnée collectée. Vos identifiants restent dans le trousseau de votre
      appareil. »
   8. Questions fréquentes, 5 questions : « Ulti fournit-il des chaînes ? Non. » ; « Sur quels appareils ? » ;
      « Mes identifiants sont-ils en sécurité ? » ; « Quels abonnements sont compatibles ? » (le seul endroit de
      l'accueil où « lien M3U » et « identifiants Xtream Codes » sont écrits, utile aussi pour Google) ; « Puis-je
      essayer avant de payer ? » (réponse : le direct est gratuit, Premium s'essaie 7 jours avec les abonnements
      mensuels et annuels, Solo ou Famille).
2. **Support** : FAQ complète + adresse e-mail de contact : contact@ultitv.com.
3. **Confidentialité** : reprendre le texte du dépôt de démonstration et de `Notes/confidentialite-app-store.md` (lecture
   seule), dans chaque langue.
3 bis. **Conditions d'utilisation** (`/<pays>/terms/`, ajoutée le 04/11/2026) : le contrat de licence (EULA) d'Ulti,
   repris de `~/Developer/ultime-iptv/Notes/app-store/contrat-licence.md` (à faire relire par un juriste), dans
   `src/donnees/conditions/fr.json` et `en.json` : version française pour les pages en français, anglaise ailleurs
   (avec « Ce contrat est proposé en anglais. » traduit). Nom et adresse de l'éditeur pris dans `site.config.mjs`
   (informations définitives du 04/11/2026). Adresses données à la session de l'app pour `PremiumView.termsURL` :
   `https://yoannf57.github.io/ultime-iptv-site/fr-fr/terms/` et `…/en/terms/`.
4. **Mentions légales** : informations définitives données par Yoann le 04/11/2026 (23 h 20), rangées dans
   `site.config.mjs` (`editeur`, `hebergeurs`) et reprises par les mentions légales, les conditions et la
   confidentialité (`src/lib/editeur.ts`) : Yoann FEBVRE, entrepreneur individuel (micro-entrepreneur), nom commercial
   Ulti, adresse de Paris ; hébergeurs GitHub (site) et Cloudflare (relais api.ultitv.com). Noms et adresses tels quels
   dans les 12 langues, seul le nom du pays est traduit (`Intl.DisplayNames`). **Téléphone et SIREN** : `null` dans
   `site.config.mjs` (`editeur.telephone`, `editeur.siren`) → emplacements bien visibles ; une ligne à changer pour
   chacun. **Ne jamais écrire sur le site une autre adresse que celle de Paris, ni le nom du service de
   domiciliation.** Ne rien inventer d'autre sur l'identité ou le statut de Yoann.
5. **Choisissez votre pays ou votre région**.
6. Page 404 traduite.

## 5. Direction artistique

- Reprendre le thème **Noir** de l'app : fond `#000000`, surfaces `#141416` / `#242428`, texte `#F5F5F7`, texte
  secondaire gris, accent blanc. Boutons principaux blancs, texte noir.
- **Rouge `#FF3B30`** : comme dans l'app, seulement pour les chaînes d'info ou de sport (anneau rouge, badge « EN
  DIRECT ») ; les autres chaînes ont un anneau blanc et pas de badge. Jamais de rouge ailleurs sur le site.
- **Écrans dessinés ou captures : tout doit tenir dans le cadre 16:9**, rien de coupé en bas. Dans la maquette :
  Direct = 2 rangées de 4 vignettes, Replay = 2 rangées de 4, Films = 2 rangées de 7 affiches, Guide = 6 chaînes sur
  2 heures. Si une capture réelle est plus haute, on la recadre, on n'écrase pas.
- Police : **la police système uniquement** (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif`). Pas de police téléchargée (SF Pro ne peut pas être embarquée sur un site).
  Titres très gras, très grands, interlignage serré ; chiffres tabulaires pour les heures et les prix.
- Style : sobre, grands visuels, beaucoup de noir, animations discrètes à l'apparition (désactivées si
  `prefers-reduced-motion`).
- **Faire ressortir les appareils sur le noir** (demande de Yoann, 03/11/2026) : léger halo de lumière blanche derrière
  les appareils (dégradé radial, 10 à 15 % d'opacité au centre), écrans lumineux (captures avec des affiches colorées
  en haut d'écran). Rien n'est ajouté sur les cadres officiels d'Apple (ni contour, ni ombre, ni reflet ; le halo reste
  derrière). Le fond de page reste noir, le texte reste blanc.
- **Pas de cadre dessiné à la main** (Yoann trouve le cadre de la première maquette « pas très beau ») : soit des
  écrans qui flottent, aux coins arrondis, avec un liseré blanc très fin (comme la maquette actuelle), soit les cadres
  officiels des ressources marketing d'Apple, en respectant leurs règles. En S2, montrer les deux en captures et
  laisser Yoann choisir.
  **Constat de S2 (03/11/2026)** : les cadres d'Apple (Design Resources, « Product Bezels ») sont livrés avec un
  contrat de licence (« App Store Marketing Artwork License ») réservé aux apps **déjà disponibles sur l'App Store**,
  à accepter par Yoann lui-même (titulaire du compte développeur) ; ne jamais l'accepter à sa place. Règles d'usage :
  image non modifiée, rien de caché (l'iPhone ne peut pas passer devant l'Apple TV), pas d'ombre ni de halo sur le
  cadre, pas de cadre transformé en bouton, et uniquement de vraies captures de l'app.
  **Depuis le 04/11/2026** : Yoann a téléchargé lui-même les cadres « iPhone 18 Pro - Black - Portrait » et
  « iPad Pro (M5) 13" - Silver - Landscape » dans `Notes/cadres/` (ignoré par Git : les originaux ne vont pas dans le
  dépôt public). `npm run importer-captures` en fait une version web réduite dans `src/assets/cadres/`.
  `Cadre.astro` pose la capture sous la zone de l'écran (mesurée sur la transparence du cadre : iPhone 72, 69,
  1206 × 2622 sur 1350 × 2760 ; iPad 124, 118, 2752 × 2064 sur 3000 × 2300), puis le cadre par-dessus, tel quel.
  Cadre immobile (pas d'inclinaison, de zoom ni de glissé ; la section Visite apparaît par simple fondu), textes et
  boutons à côté, jamais dessus, au moins 200 px de haut. Ne pas utiliser le cadre iPad 11" (écran au rapport 1,45,
  pas celui des captures 4:3). L'Apple TV reste un écran flottant. Badge App Store : uniquement le badge officiel d'Apple, dans la langue de la page, une fois
  l'app publiée.
- **Chaînes montrées sur le site : des marques inventées**, jamais une vraie chaîne (même gratuite ou publique : ce
  sont des marques déposées, et le site doit rester neutre). Celles de la maquette : Pellicule (cinéma), Le Fil et
  Le Fil 24 (info), Animo (animation), Orbite (sciences), Petit Pois (jeunesse), Rétro (classiques), Atelier. Chacune
  a sa couleur et son style de logo. Avant S4, vérifier rapidement qu'aucun de ces noms n'est une vraie chaîne connue.
- **Films et séries montrés : les vrais films libres du Blender Studio** (Sintel, Big Buck Bunny, Elephants Dream,
  Tears of Steel, Cosmos Laundromat, Spring, Coffee Run, Sprite Fright, Charge, Hero, Glass Half, Wing It!, Agent 327,
  la série *Caminandes* : Llama Drama, Gran Dillama, Llamigos), avec leurs
  vraies affiches dans les captures et le crédit demandé par leur licence (voir `CREDITS.md` du dépôt de démo ;
  *Agent 327* est en CC BY-ND : affiche montrée telle quelle, jamais modifiée). Pas d'image d'une personne réelle,
  pas d'affiche de film sous droits.
- Accessibilité : contraste ≥ 4,5:1, navigation au clavier, textes alternatifs traduits, tailles en `rem`.

## 6. Contenu qui fait foi (au 03/11/2026, après-midi)

**Formules et prix** (nouveaux prix décidés par Yoann le 04/11/2026 au matin ; France en pays de référence, TTC ;
à revérifier dans App Store Connect). Deux formules Premium :
- **Solo** (pour soi, sans Partage familial) : **1,99 €/mois, 19,99 €/an, 29,99 € à vie**. Carte Annuel : badge
  « −16 % » et « soit 1,67 € par mois ».
- **Famille** (jusqu'à 6 personnes avec le Partage familial d'Apple) : **2,99 €/mois, 29,99 €/an, 39,99 € à vie**.
  Carte Annuel : badge « −16 % » et « soit 2,50 € par mois ».
- Essai gratuit de 7 jours sur les quatre abonnements (mensuels et annuels), rien sur les achats à vie.
- **Nom du produit : « Ulti Premium »**, comme l'écran Premium de l'app : à la première mention d'une section (surtitre,
  groupe et question du Support, confidentialité…), puis « Premium ». Jamais en majuscules, jamais « Tout Premium ».
  Sur les fonctions et la visite : mention discrète « Avec Premium ».
- Section Tarifs (04/11/2026) : quatre cartes **Gratuit · Premium mensuel · Premium annuel · Premium à vie** (ordre
  naturel de chaque langue, mots de l'app : Monthly, Monatlich…). Textes : Gratuit « Le direct, le guide TV et ses
  rappels, l'image dans l'image, l'Apple TV par QR code et un profil Enfant. » ; mensuel « Essai gratuit de 7 jours.
  Résiliable à tout moment. » ; annuel « Soit {prix} par mois. Essai gratuit de 7 jours. » ; à vie « Un seul paiement,
  sans abonnement. » ; sous les cartes « Les trois formules Premium donnent accès aux mêmes fonctions. ». Un choix sobre **« Pour moi » / « Pour la famille »**
  au-dessus des trois cartes payantes (« Pour moi » par défaut, vrais `<button>` avec `aria-pressed`, sans JavaScript : les
  deux formules l'une sous l'autre). Ne plus écrire « Partage familial inclus » de façon générale : seulement pour la
  formule Famille.
- Prix rangés dans `pays.json`, par pays et par formule (`mensuel`, `annuel`, `vie`, `annuelParMois`, `remise`, chacun
  facultatif : un montant absent s'affiche « Prix affiché dans l'App Store » ; badge et prix par mois seulement s'ils
  sont écrits). Pays en euros : les prix ci-dessus, à revérifier dans App Store Connect au Lot 11.
  **Autres monnaies, relevées dans App Store Connect le 04/11/2026** (Solo mensuel / annuel / à vie — Famille) :
  GBP et USD 1.99 / 17.99 / 24.99 — 2.99 / 24.99 / 34.99 ; CAD 2.99 / 24.99 / 34.99 — 3.99 / 34.99 / 49.99 ;
  CHF 2.00 / 15.00 / 20.00 — 3.00 / 20.00 / 30.00 ; SEK 29 / 229 / 299 — 39 / 299 / 499 ; NOK 29 / 229 / 299 —
  39 / 299 / 449 ; DKK 19 / 149 / 199 — 29 / 199 / 299 ; BRL 12.90 / 119.90 / 149.90 — 19.90 / 149.90 / 229.90 ;
  MXN 39 / 399 / 499 — 69 / 499 / 799 ; AUD 2.99 / 29.99 / 39.99 — 4.99 / 39.99 / 59.99. Remise = 1 − annuel /
  (12 × mensuel) arrondie vers le bas, prix par mois = annuel / 12, calculés depuis ces vrais prix.
  Format de la langue de la page (`Intl.NumberFormat`) : 2 décimales pour GBP, USD, CAD, CHF, BRL, AUD ; aucune pour
  SEK, NOK, DKK, MXN (et l'euro) quand le montant est rond. « Prix TTC. » partout, sauf `en-us`, `en-ca`, `fr-ca`
  (`taxesEnSus: true`) : « Taxes applicables en sus. ».
- Ne jamais calculer un prix par conversion de monnaie.

**Gratuit = le direct** (confirmé par Yoann le 03/11 en fin d'après-midi) : direct, guide TV et rappels, Mes contenus
(catégories de chaînes), regroupement des doublons de chaînes, coller le message du fournisseur, image dans l'image,
appairage Apple TV par QR code, un profil Enfant avec code parental, thème Noir.

**Premium** : **films et séries** (catalogue, fiches, lecture, reprises, toutes les versions d'un film, affiches et
résumés TMDB), replay, pause du direct, multi-écran (dans la V1, décidé par Yoann le 03/11/2026 : jusqu'à 4 directs à la fois sur Apple TV, iPad et Mac,
2 sur iPhone, dans la limite des connexions de l'abonnement), synchro
iCloud, profils adultes supplémentaires, plusieurs abonnements, téléchargements, rangées « Pour vous » et
« Populaires », thèmes Halo et Programme, icônes alternatives. En version gratuite, l'app laisse parcourir les films et
séries mais la lecture demande Premium : sur le site, on peut dire « parcourez le catalogue, regardez avec Premium »
sans jamais laisser croire que les films sont gratuits.

**Appareils** (décidé par Yoann le 03/11/2026) : iPhone, iPad, Mac et Apple TV dès la V1. Écrire « iPhone, iPad, Mac
et Apple TV » partout où on liste les appareils. Mac = Mac avec puce Apple, qui utilise l'app iPad. Vision Pro : pas
avant que Yoann le dise.

**Mention TMDB obligatoire** dans le pied de page : « Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié
par TMDB », avec le logo TMDB selon leurs règles.

Si l'un de ces points change, Yoann le dira ; en cas de doute, demande-lui plutôt que de deviner.

## 7. Technique

- **Astro** (site statique), avec son routage par langue. Aucun serveur, aucune base de données.
- **Hébergement** : GitHub Pages, déployé par GitHub Actions à chaque push sur `main`, à l'adresse
  `https://yoannf57.github.io/ultime-iptv-site/` pour l'instant. Dépôt **public** (GitHub Pages gratuit ; le dépôt ne
  contient que le site, aucun secret).
- **Domaine : ultitv.com** (acheté le 03/11/2026 chez Cloudflare ; ultitv.app, ultiptv.app et ulti-iptv.com seront
  redirigés vers lui). La valeur est prête dans `site.config` mais **inactive** : pas de fichier `CNAME`, adresse de
  base inchangée, tant que Yoann n'a pas dit que les DNS sont prêts (étape séparée).
- **Page stable sur téléphone** (08/11/2026, demande de Yoann) : rien ne doit dépasser la largeur de l'écran, sinon la
  page glisse sur le côté. `main` a `overflow-x: clip` (les halos débordent) ; la pastille de l'en-tête passe sur deux
  lignes sous 22 rem. Vérifié sur toutes les pages à 320 et 393 px (`scrollWidth` = largeur de l'écran).
- **Aucun traceur** (pas de Google Analytics, pas de pixel, pas de police Google), donc **pas de bandeau cookies**. Le
  seul stockage est le choix du pays dans `localStorage` (fonctionnel).
- Images en AVIF/WebP avec repli, tailles adaptées à l'écran ; page d'accueil légère (objectif Lighthouse ≥ 95 partout).
- Balises de partage (Open Graph, Twitter) traduites, avec une image de partage par langue.
- **App Store (prêt le 07/11/2026)** : identifiant `6829902519`, nom court `ulti-iptv-player`, dans `site.config.mjs`
  (`appStore`). `src/lib/appstore.ts` calcule `https://apps.apple.com/<pays>/app/ulti-iptv-player/id6829902519`
  (pays = 2ᵉ partie du code : `en-gb` → `gb`) ; page internationale → adresse sans pays. Un `lienAppStore` écrit
  dans `pays.json` gagne (exception facultative ; aucun pour l'instant). Cible `appstore` utilisable dans les textes.
- **Badge officiel** (`src/components/accueil/BadgeAppStore.astro`, règles d'Apple en commentaire) : noir, jamais
  modifié, 48 px de haut (44 px sur téléphone), marge libre ≥ ¼ de la hauteur, un seul par page (dans le grand
  visuel ; l'en-tête et le Support gardent un lien texte). Lien avec `aria-label` traduit (`heros.badge`), image
  `alt=""`. Fichiers : `npm run importer-badges` copie à l'identique les SVG d'Apple de `Notes/badges/` (ignoré par
  Git) vers `src/assets/badges/<langue>.svg` (`es-mx` facultatif) ; langue sans badge → anglais ; aucun badge → bouton
  texte de secours (avertissement au build). **Importés le 07/11/2026 au soir** : badges noirs des 12 langues + `es-mx`
  (aucune langue ne manque), droits 644, versionnés. Badge **noir** validé par Yoann ; les blancs ne vont que dans
  `captures/badges-blancs/` (non versionné), pour comparer, jamais sur le site.
- **Smart App Banner** (`Base.astro`) : `<meta name="apple-itunes-app" content="app-id=…">` si `disponible`, sur les
  pages d'un pays ou d'une langue et leurs sous-pages, jamais sur la page de choix ni la 404.
- **Android** (sans date, téléphone, tablette et télé) : seulement une ligne grise sous le badge (`heros.android`
  « Bientôt sur Android. » ; avant la publication `heros.androidAvantPublication` « Puis sur Android. », pour éviter
  deux « Bientôt » de suite) et une phrase à la fin de « Sur quels appareils ? » (FAQ et Support). Jamais de badge
  Google Play, de Fire TV, de date ni de formulaire.
- **`appleTvDisponible`** (`site.config.mjs`, `true` par défaut) : à `false` (et `disponible: true`), la ligne devient
  « Apple TV : dans quelques jours. Bientôt sur Android. » et la FAQ (`faq.r2SansAppleTv`) et le Support
  (`appareils`, `installer` : `rSansAppleTv`) disent que l'Apple TV arrive dans les jours qui viennent.

## 8. Façon de travailler

- Une étape par session : mode plan, plan validé par Yoann, puis code.
- Après chaque changement visible : lancer le site en local (`npm run dev`), **faire des captures** avec Playwright
  (ordinateur 1440 px, iPhone 393 px) en français et en anglais, les regarder, puis les montrer à Yoann.
- Vérifier avant chaque commit : `npm run build` sans erreur, `npm run verifier-textes`, liens internes valides.
- Compte rendu court à la fin de chaque session dans `Notes/comptes-rendus/AAAA-MM-JJ-<étape>.md`.

## 9. Étapes prévues

1. **S1 — Socle** : projet Astro, pays et langues, page racine qui devine le pays, page « Choisissez votre pays »,
   bandeau, pied de page avec globe, `noindex` + `robots.txt`, déploiement GitHub Pages
   (`https://yoannf57.github.io/ultime-iptv-site/` ; prévoir que le site marche aussi à la racine d'un domaine, donc
   jamais de chemin absolu écrit en dur). Textes provisoires.
2. **S2 — Accueil** d'après la maquette validée, en français et en anglais, avec des captures provisoires.
3. **S3 — Support, confidentialité, mentions légales, 404.**
4. **S4 — Vraies captures** (faites par la session de l'app avec la liste de démo, en FR et en EN), image de partage,
   finitions, Lighthouse (`indexable: true` : voir section 2, avec ultitv.com). Pour que les captures montrent les chaînes inventées ci-dessus, la liste de démo devra
   d'abord leur donner ces noms et logos (travail de la session de l'app dans `ultime-iptv-demo`, sur demande de
   Yoann ; jamais depuis ici).
5. **Branchement de ultitv.com** (étape séparée, quand Yoann le demande ; le domaine est déjà acheté) : d'abord
   « Custom domain » dans les réglages Pages de GitHub, **ensuite** les enregistrements DNS chez Cloudflare, puis
   « Enforce HTTPS » ; activer la valeur de `site.config` et créer le `CNAME` à ce moment-là ; guider Yoann clic par clic.
6. **Au Lot 11** : **préparé le 07/11/2026** (liens App Store calculés, badge officiel et badges d'Apple importés,
   Smart App Banner, Android, `appleTvDisponible`). Le jour J : voir section 10, « Jour de la publication ». Reste aussi, hors site : bascule de
   l'URL de confidentialité dans App Store Connect (décision de Yoann).
7. **Avec le Lot I2** : une langue de plus = un fichier de textes + les pays.

## 10. Avancement

- [x] S1 — Socle
- [x] S2 — Accueil
- [x] S3 — Pages obligatoires
- [ ] S4 — Captures et finitions : **vraies captures faites le 04/11/2026** (`npm run importer-captures` copie et
  réduit celles de `~/Developer/ultime-iptv/Notes/app-store/captures/`, **dans les 12 langues** depuis le 04/11 au
  soir ; `04-fiche-film` écartée car elle montre des photos de vraies personnes ; `ipad/07-films-series` reprise,
  refaite sans la distribution). Une langue sans captures prend les anglaises. Cadres officiels d'Apple pour l'iPhone
  et l'iPad. Reste : image de partage par langue, relecture des traductions.
- [x] Lot 11 préparé (07/11/2026, badges importés le soir : il ne reste que le jour J) — compte rendu
  `Notes/comptes-rendus/2026-11-07-publication.md`. Traductions des
  nouvelles phrases (Android, Apple TV, badge) faites par Claude : à faire relire avec le reste.
- [x] Section « Collez. C'est tout. » (07/11/2026 au soir) — compte rendu
  `Notes/comptes-rendus/2026-11-07-section-collez.md`. Nouvelles phrases traduites par Claude : à faire relire ;
  à harmoniser : « Liitä » / « Sijoita » (fi), « einfügen » / « einsetzen » (de).
- [x] Section « Connexion » refaite (08/11/2026 : téléphone + Apple TV par QR code) — compte rendu
  `Notes/comptes-rendus/2026-11-08-connexion.md`. À décider : la section Apple TV redit l'appairage par QR code.
- [x] **Jour de la publication (11/11/2026)** : `disponible: true`, `appleTvDisponible: true`, `indexable: true` ;
  build, textes et liens vérifiés ; liens App Store de fr-fr, en-gb, pt-br et `/es/` vers `id6829902519`. Fait depuis
  le cloud, livré par pull request vers `main` — compte rendu `Notes/comptes-rendus/2026-11-11-jour-de-la-publication.md`.
  Reste à vérifier après la fusion : le site en ligne et le Smart App Banner sur un vrai iPhone.

### Jour de la publication (fait le 11/11/2026 ; gardé pour mémoire)
1. `site.config.mjs` : **la ligne `disponible: false,` devient `disponible: true,`** ; `indexable: true` si ultitv.com n'est pas encore branché (sinon c'est déjà
   fait) ; `appleTvDisponible: false` seulement si Apple n'a pas encore accepté la version Apple TV (à remettre à
   `true` dès qu'elle l'est).
2. Badges : déjà faits (07/11/2026). À refaire seulement si Apple publie de nouveaux badges : les déposer dans
   `Notes/badges/`, `npm run importer-badges`, committer `src/assets/badges/`.
3. `npm run build`, `npm run verifier-textes`, `npm run verifier-liens`, commit, push.
4. En ligne : le badge ; les liens App Store de fr-fr, en-gb, pt-br et de `/es/` ; le bandeau Smart App Banner sur un
   vrai iPhone dans Safari.
