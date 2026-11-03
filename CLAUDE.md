# CLAUDE.md — Site de présentation d'Ulti

Ce dépôt (`Yoannf57/ultime-iptv-site`, dossier `~/Developer/ultime-iptv-site`) contient **le site web de présentation**
d'Ulti, un lecteur IPTV payant pour iPhone et Apple TV. L'app elle-même est dans un autre dépôt
(`~/Developer/ultime-iptv`) et ne se touche jamais depuis ici. Les noms de dépôts et de dossiers gardent « ultime » :
ce sont des noms techniques, invisibles pour les visiteurs.

Dernière mise à jour : 03/11/2026 fin d'après-midi (formules Solo et Famille, films et séries en Premium, gratuit = le
direct seulement).

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
   Si une fonction n'est pas encore faite (multi-écran, grands écrans…), elle n'apparaît pas, ou avec « Bientôt ».
6. **Ne jamais proposer une langue que l'app n'a pas.** Aujourd'hui : français et anglais seulement.
7. Git : commits avec les fichiers nommés un par un (pas de `git add -A`), jamais d'envoi forcé, jamais de secret dans
   le dépôt. Push à la fin de chaque étape validée.

## 2. Objectif

Un site **très professionnel**, sobre et cinématographique, prêt le jour de la sortie sur l'App Store. Il sert à :
- présenter l'app et donner envie (captures iPhone et Apple TV) ;
- afficher les prix ;
- fournir les pages exigées par Apple : **support** (obligatoire dans App Store Connect) et **confidentialité** ;
- plus tard : le bouton officiel « Télécharger dans l'App Store » dans la langue du visiteur.

Tant que l'app n'est pas publiée, le bouton principal affiche « Bientôt sur l'App Store » (désactivé). Tout le site doit
pouvoir basculer en mode « disponible » en changeant **une seule valeur** dans la configuration (`site.config` :
`disponible: false`, plus le lien App Store par pays).

**Caché de Google jusqu'à l'étape S4** : balise `<meta name="robots" content="noindex">` sur toutes les pages et
`robots.txt` qui interdit tout, pilotés par une valeur `indexable: false` de la configuration. On passe à `true` à la fin
de S4, quand les textes et les captures sont définitifs.

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
`/en-ie/`, `/en-us/`, `/en-ca/`, et `/en/` pour « International (English) ».
- Chaque page a ses balises `hreflang` vers toutes les autres versions, plus `x-default` vers `/en/`.
- Les pays dont la langue n'est pas encore traduite (Allemagne, Pays-Bas, pays nordiques, Espagne, Italie, Portugal,
  Brésil…) **n'apparaissent pas** dans la liste : leurs visiteurs arrivent sur `/en/`.

### Langues suivantes (même rythme que l'app, Lot I2)
- I2a : néerlandais et allemand → ajouter `nl-nl`, `nl-be`, `de-de`, `de-at`, `de-ch`, `de-lu`.
- I2b : suédois, norvégien (bokmål), danois, finnois.
- I2c : espagnol, italien, portugais du Brésil puis du Portugal.
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
   1. Grand visuel : petite ligne « Pour iPhone et Apple TV », l'accroche, une phrase, bouton App Store (ou
      « Bientôt »), iPhone et Apple TV qui montrent l'app.
      **Écrans cliquables** (demande de Yoann, 03/11/2026) : sur l'Apple TV, la barre Accueil · Direct · Replay ·
      Films · Séries change l'écran ; sur l'iPhone, la barre du bas (Accueil · Direct · Films · Séries). Petite phrase
      dessous : « Cliquez sur les écrans pour essayer l'app. » Dans le site final : une vraie capture par onglet (FR et
      EN), avec des `<button>` transparents posés exactement sur les onglets de la capture (positions en %, pour
      suivre la taille de l'écran), `aria-label` = nom de l'onglet, changement d'image en fondu court. Les captures
      sont chargées seulement au premier clic (sauf celle de l'accueil). Sur téléphone, l'iPhone est masqué et seule
      l'Apple TV reste cliquable.
   2. « Votre abonnement, enfin bien présenté » : direct avec anneaux d'avancement, guide TV, films et séries avec
      affiches et résumés. La carte « Films et séries » porte une petite mention discrète « Premium ».
   2 bis. **« Faites le tour. »** (ajouté le 03/11/2026) : un seul grand écran avec des onglets Direct · Guide TV ·
      Replay · Films · Séries ; un clic change l'écran et la phrase dessous. Au clavier : vrais `<button>` avec
      `aria-pressed`. Dans le site final, chaque onglet montre une **vraie capture** de l'app (Apple TV, liste de démo),
      en français ou en anglais selon la page. Sans JavaScript : les cinq captures l'une sous l'autre.
   3. Apple TV : appairage par QR code depuis l'iPhone (on ne tape rien à la télécommande), zapping, image dans l'image.
   4. Famille : profils, profil Enfant avec code parental.
   5. Premium : **films et séries** (affiches, résumés, reprises), pause du direct, replay, téléchargements, synchro
      iCloud, plusieurs abonnements et profils, thèmes ; dernière ligne grisée « Multi-écran, jusqu'à 4 directs à la
      fois · BIENTÔT » (à activer quand le Lot 7c est publié).
   6. « Prêt en une minute », 3 étapes : « Ajoutez votre abonnement » (collez le message du fournisseur, ou saisissez
      ses identifiants) → « Ulti range tout » → « Regardez partout ».
   7. Tarifs (section 6).
   8. Confidentialité en une phrase : « Aucune donnée collectée. Vos identifiants restent dans le trousseau de votre
      appareil. »
   9. Questions fréquentes, 5 questions : « Ulti fournit-il des chaînes ? Non. » ; « Sur quels appareils ? » ;
      « Mes identifiants sont-ils en sécurité ? » ; « Quels abonnements sont compatibles ? » (le seul endroit de
      l'accueil où « lien M3U » et « identifiants Xtream Codes » sont écrits, utile aussi pour Google) ; « Puis-je
      essayer avant de payer ? » (réponse : le direct est gratuit, Premium s'essaie 7 jours avec les abonnements
      mensuels et annuels, Solo ou Famille).
2. **Support** : FAQ complète + adresse e-mail de contact : contact@ultitv.com.
3. **Confidentialité** : reprendre le texte du dépôt de démonstration et de `Notes/confidentialite-app-store.md` (lecture
   seule), dans chaque langue.
4. **Mentions légales** : modèle à compléter, **à valider par Yoann** (ne rien inventer sur son identité ni son statut).
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
  en haut d'écran), et un fin contour noir autour de l'iPhone quand il passe devant l'Apple TV. Le fond de page reste
  noir, le texte reste blanc.
- **Pas de cadre dessiné à la main** (Yoann trouve le cadre de la première maquette « pas très beau ») : soit des
  écrans qui flottent, aux coins arrondis, avec un liseré blanc très fin (comme la maquette actuelle), soit les cadres
  officiels des ressources marketing d'Apple, en respectant leurs règles. En S2, montrer les deux en captures et
  laisser Yoann choisir. Badge App Store : uniquement le badge officiel d'Apple, dans la langue de la page, une fois
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

**Formules et prix** (décidés par Yoann le 03/11/2026 vers 14 h, déjà en place dans App Store Connect ; France en pays
de référence, TTC). Deux formules Premium :
- **Solo** (pour soi, sans Partage familial) : **2,99 €/mois, 29,99 €/an, 49,99 € à vie**. Carte Annuel : badge
  « −16 % » et « soit 2,50 € par mois ».
- **Famille** (jusqu'à 6 personnes avec le Partage familial d'Apple) : **3,99 €/mois, 39,99 €/an, 59,99 € à vie**.
  Carte Annuel : badge « −16 % » et « soit 3,33 € par mois ».
- Essai gratuit de 7 jours sur les quatre abonnements (mensuels et annuels), rien sur les achats à vie.
- Section Tarifs : une carte « Gratuit » (0 €) à côté, puis un choix sobre **« Pour moi » / « Pour la famille »**
  au-dessus des offres payantes (« Pour moi » par défaut, vrais `<button>` avec `aria-pressed`, sans JavaScript : les
  deux formules l'une sous l'autre). Ne plus écrire « Partage familial inclus » de façon générale : seulement pour la
  formule Famille.
- Prix rangés dans `pays.json`, par pays et par formule. Pays en euros : les prix ci-dessus, à revérifier dans App Store
  Connect au Lot 11. Autres monnaies : « Prix affiché dans l'App Store » tant que Yoann n'a pas relevé les prix exacts.
- Ne jamais calculer un prix par conversion de monnaie.

**Gratuit = le direct seulement** (confirmé par Yoann le 03/11 en fin d'après-midi) : direct, guide TV et rappels, un
profil Enfant avec code parental, appairage Apple TV par QR code, thème Noir.

**À confirmer par Yoann avant S2** : Mes contenus (catégories de chaînes), regroupement des doublons de chaînes, coller
le message du fournisseur, image dans l'image. Ces fonctions ne figurent plus dans la liste du gratuit : ne pas les
présenter comme gratuites tant que Yoann n'a pas dit si elles sont gratuites ou Premium. Attention, l'étape « Prêt en
une minute » (section 4) et la section Apple TV citent « coller le message » et l'image dans l'image.

**Premium** : **films et séries** (catalogue, fiches, lecture, reprises, toutes les versions d'un film, affiches et
résumés TMDB), replay, pause du direct, multi-écran (**« Bientôt »** tant que le Lot 7c n'est pas publié), synchro
iCloud, profils adultes supplémentaires, plusieurs abonnements, téléchargements, rangées « Pour vous » et
« Populaires », thèmes Halo et Programme, icônes alternatives. En version gratuite, l'app laisse parcourir les films et
séries mais la lecture demande Premium : sur le site, on peut dire « parcourez le catalogue, regardez avec Premium »
sans jamais laisser croire que les films sont gratuits.

**Appareils** : iPhone et Apple TV. iPad (même app agrandie). Mac et Vision Pro : seulement quand le Lot 7b est fait.

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
- **Aucun traceur** (pas de Google Analytics, pas de pixel, pas de police Google), donc **pas de bandeau cookies**. Le
  seul stockage est le choix du pays dans `localStorage` (fonctionnel).
- Images en AVIF/WebP avec repli, tailles adaptées à l'écran ; page d'accueil légère (objectif Lighthouse ≥ 95 partout).
- Balises de partage (Open Graph, Twitter) traduites, avec une image de partage par langue.
- `Smart App Banner` d'Apple (`apple-itunes-app`) à ajouter quand l'app aura son identifiant App Store.

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
   finitions, Lighthouse, puis `indexable: true`. Pour que les captures montrent les chaînes inventées ci-dessus, la liste de démo devra
   d'abord leur donner ces noms et logos (travail de la session de l'app dans `ultime-iptv-demo`, sur demande de
   Yoann ; jamais depuis ici).
5. **Branchement de ultitv.com** (étape séparée, quand Yoann le demande ; le domaine est déjà acheté) : d'abord
   « Custom domain » dans les réglages Pages de GitHub, **ensuite** les enregistrements DNS chez Cloudflare, puis
   « Enforce HTTPS » ; activer la valeur de `site.config` et créer le `CNAME` à ce moment-là ; guider Yoann clic par clic.
6. **Au Lot 11** : `disponible: true`, liens App Store par pays, badge officiel, Smart App Banner, bascule de l'URL de
   confidentialité dans App Store Connect.
7. **Avec le Lot I2** : une langue de plus = un fichier de textes + les pays.

## 10. Avancement

- [x] S1 — Socle
- [ ] S2 — Accueil
- [ ] S3 — Pages obligatoires
- [ ] S4 — Captures et finitions
