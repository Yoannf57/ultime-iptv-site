# 24/11/2026 — Black Friday (étape 1) et changements durables (étape 2)

Premium à vie est à prix réduit dans l'App Store depuis le 24/11 au soir, jusqu'au lundi 30/11/2026 inclus.
**Étape 1** : l'offre sur les pages d'accueil, avec retour automatique au site normal le 01/12 (en ligne le 24/11 au
soir, après « OK en ligne »). **Étape 2** : ce qui change pour de bon (phrase du grand visuel, dernière section,
fiches des films et séries gratuites, pied de page du sélecteur de pays). Branche `black-friday`.

## Pour Yoann, en 10 lignes

1. Étape 1 en ligne : tes 22 prix normaux « à vie » étaient identiques à `src/pays.json`, et « le prix d'un an, payé
   une fois » est vrai dans les 11 monnaies.
2. Un seul réglage : `blackFriday` dans `site.config.mjs`. L'offre disparaît toute seule le 01/12 (date du visiteur).
   **Début décembre, repasser `actif` à `false`** pour retirer les prix réduits du code des pages.
3. Étape 2, a : la nouvelle phrase du grand visuel est en place dans les 12 langues (tes mots en français et en
   anglais).
4. Étape 2, b : dernière section « Vous avez déjà l'abonnement. Il vous manque l'app. », bouton texte « Télécharger
   Ulti ». **« Sans publicité » est vrai** : aucune régie publicitaire dans le code de l'app, suivi déclaré à `false`.
5. Étape 2, c : fiches des films et séries gratuites (N33) sur la carte Gratuit, la section Premium, la question
   « Puis-je essayer avant de payer ? » et le Support. La mention devient « Lecture avec Premium ».
6. **Apple TV** : l'App Store annonce la 1.1 sur iPhone et iPad, encore la 1.0 sur Apple TV. La FAQ et le Support
   disent donc « sur Apple TV, avec la prochaine mise à jour ». **À retirer quand la 1.1 Apple TV sort.**
7. Étape 2, d : sur « Choisissez votre pays », les liens du pied de page suivent maintenant le visiteur (un Français
   arrive sur `/fr-fr/support/`, un Sénégalais sur `/fr/support/`). Sans JavaScript : `/en/` comme avant.
8. Vérifications : textes, construction, liens, 37 pages à 320 et 393 px, Lighthouse à 100 partout.
9. Agents : feu vert de `ulti-gardien-stores` et « bon pour commit » de `ulti-relecteur` aux deux étapes ; avis
   d'`ulti-ergonome` appliqué.
10. Tes trois réglages du second « OK en ligne » sont faits : « guide TV » insécable dans les 12 langues, carte
    Gratuit « (lecture avec Premium) », apostrophes typographiques sur tout le site (commit à part). Reste pour toi :
    les traductions à faire relire (liste en bas).

# Étape 1 : l'offre

## Ce qui a changé

- `site.config.mjs` : bloc `blackFriday`.
- `src/lib/offre.ts` (nouveau) : prix normal (`pays.json`), prix réduit (réglage), pourcentage arrondi vers le bas
  (calcul en centimes), test « prix réduit = prix annuel », dates par `Intl.DateTimeFormat`. La construction échoue si
  une monnaie n'a pas de prix réduit ou si le prix réduit n'est pas plus bas que le prix normal.
- `src/pages/[pays]/index.astro` : petit script en tête de page qui pose la classe `bf` sur `<html>` jusqu'à la date
  de fin. `?date=AAAA-MM-JJ` sert à essayer une date à venir ; une date passée est ignorée, pour qu'un lien ne puisse
  pas rallumer l'offre en décembre.
- `src/styles/accueil.css` : `.bf-offre` (montré pendant l'offre) et `.bf-normal` (caché pendant l'offre).
- `BandeauOffre.astro` (nouveau) : bandeau fin blanc, texte noir, lien « Voir l'offre ». Ne suit pas le défilement,
  se place sous le bandeau du pays.
- `Heros.astro` : pastille au-dessus du surtitre, vers `#offre`. Titre inchangé.
- `Offre.astro` (nouveau) : section `#offre` avant les tarifs. Bouton texte « Télécharger Ulti » (pas de second
  badge).
- `Tarifs.astro` : carte « Premium à vie » en deux versions (normale et offre : badge, prix réduit, prix normal
  barré, « Jusqu'au 30 novembre »). Pendant l'offre, le liseré blanc passe de la carte annuelle à la carte à vie.
- `Faq.astro` : 6ᵉ question pendant l'offre, « Abonnement ou à vie : que choisir ? ».
- `src/textes/*.json` : bloc `offre` (25 clés) dans les 12 langues.
- `scripts/captures-offre.mjs` (nouveau, `npm run captures-offre -- <dossier>`) : captures et contrôles.
- Titre, description et balises des pages : inchangés.

## Vérifications

| Contrôle | Résultat |
|---|---|
| `npm run verifier-textes` | ✓ 12 langues, 417 clés chacune |
| `npm run build` | ✓ |
| `npm run verifier-liens` | ✓ 11 256 liens internes valides |
| `actif: false` comparé à `main` | ✓ 191 fichiers identiques (hors nom du fichier de styles) |
| Offre visible au 25/11 et au 30/11, absente au 01/12 et sans JavaScript | ✓ 37 pages d'accueil |
| Rien ne dépasse à 320 et 393 px | ✓ 37 pages (12 langues) |
| Horloge simulée : 30/11 23 h 59 visible, 01/12 0 h 01 cachée (Paris, Los Angeles, Auckland) | ✓ |
| `?date=2026-11-25` ouvert le 05/12 | ✓ offre cachée |
| Lighthouse `/fr-fr/?date=2026-11-25` | mobile 100 / 100 / 100 / 100, LCP 1,3 s, CLS 0 ; ordinateur 100 partout, LCP 0,3 s |

Captures (fr-fr, en-gb, en-us, de-de, `/en/` ; 1440 et 393 px ; 25/11, 30/11, 01/12) : dossier
`2026-11-24-black-friday/`.

## Verdicts des agents

- **ulti-redacteur** : a écrit les 12 blocs `offre`. Français : le texte de Yoann, avec la typographie. Mots et
  signes interdits vérifiés dans les 12 langues. Les 10 langues traduites restent à faire relire par un natif
  (finnois le plus fragile : « Premium pysyvä » ne se décline pas bien).
- **ulti-gardien-stores** : **feu vert**, aucun point bloquant. Conseils : vérifier l'historique des prix (règle du
  prix le plus bas des 30 derniers jours, l'app n'étant en vente que depuis le 11/11) ; vérifier l'heure de fin dans
  App Store Connect ; ne pas enchaîner une autre promotion en décembre ; le bandeau et la pastille donnent les
  chiffres Solo sans le dire (exact, Famille est détaillée dans la section) ; repasser `actif` à `false` le 01/12.
- **ulti-ergonome** : rien de bloquant. Corrigé : liseré blanc sur la carte de l'offre, zones à toucher de 44 px
  (lien du bandeau, pastille), pastille plus courte sur les pages internationales, section sans prix centrée. Non
  retenu pour l'instant : écrire « inclus » en anglais et en allemand ; placer le grand prix sous le titre sur
  téléphone ; masquer la pastille sur téléphone.
- **ulti-relecteur** : **bon pour commit**, aucun point bloquant. Corrigé : `?date=` ne peut plus rallumer l'offre ;
  le bloc `blackFriday` peut être retiré sans casser la construction ; virgule allemande ; commande
  `captures-offre`. Gardé tel quel, à la demande de Yoann : `aussiGooglePlay` (lu par aucun texte) et les apostrophes
  typographiques des nouveaux textes.

## Ce que Yoann doit vérifier

1. **Heure de fin dans App Store Connect** : le site coupe l'offre à minuit, heure du visiteur, le 30/11. Si Apple
   remonte le prix plus tôt dans un pays, le site annoncerait quelques heures un prix qui n'est plus le bon.
2. **Historique des prix** : les deux « à vie » n'ont jamais été vendus moins cher que le prix normal depuis le
   11/11, dans aucune monnaie (le prix barré doit être le plus bas des 30 derniers jours).
3. **Écran Premium de l'app** : il affiche bien les prix réduits aujourd'hui.

## Reste

- Fait le 24/11 au soir, après « OK en ligne » : `actif: true`, fusion dans `main`, push. Contrôle en ligne : fr-fr,
  en-gb, en-us et `/en/` montrent l'offre ; `?date=2026-12-01` montre le site normal.
- Début décembre : `actif: false` (retire les prix réduits du code des pages).
- Défaut déjà présent avant l'offre, vu par l'ergonome : dans la FAQ sur téléphone, la croix d'une question ouverte
  sur deux lignes glisse d'environ 10 px à droite.

# Étape 2 : ce qui change pour de bon

## Ce qui a changé

- **a. Grand visuel** : `heros.phrase` dans les 12 langues. Titre, description et balises des pages inchangés.
- **b. Dernière section** : `src/components/accueil/Fin.astro` (clés `fin.*`), après les questions. Une phrase par
  ligne dans le titre. Bouton texte vers l'App Store du pays, pas de second badge.
- **c. N33** : `tarifs.gratuitTexte`, `premium.films`, `faq.r5`, `support.q.gratuit.r`, `support.q.inclus.r`, et la
  nouvelle clé `fonctions.premiumLecture` (« Lecture avec Premium ») sur la carte Films et séries et sur l'écran Films
  de la visite. Mots repris de l'aide de l'app (« Que comprend la version gratuite ? »).
- **d. Pied de page des pages sans pays** (`src/components/PiedDePage.astro`) : un script adapte les liens et leurs
  libellés au pays déjà choisi, sinon au pays deviné, sinon à la page internationale de la langue. Les pages d'un pays
  ne changent pas.
- `CLAUDE.md` : sections 3, 4 et 6, et avancement.

## Vérifié dans l'app (lecture seule)

- Aucune régie publicitaire dans le code ; `NSPrivacyTracking` à `false` dans les trois fichiers de confidentialité.
- N33 : « fiches TMDB gratuites depuis N33 » (CLAUDE.md de l'app), aide de l'app : « …et les fiches des films et des
  séries (affiches, résumés, distribution). La lecture des films et des séries, le replay et la pause du direct font
  partie d'Ulti Premium. »
- App Store (API publique, 24/11) : version 1.1 du 13/11 pour iPhone et iPad ; Apple TV en 1.0.

## Vérifications

| Contrôle | Résultat |
|---|---|
| `npm run verifier-textes` | ✓ 12 langues, 421 clés chacune |
| `npm run build`, `npm run verifier-liens` | ✓ 11 256 liens internes valides |
| Rien ne dépasse à 320 et 393 px, avec et sans l'offre | ✓ 37 pages d'accueil |
| Bouton de la dernière section visible | ✓ 37 pages |
| Pied de page de `pays/` : fr-FR Paris → `/fr-fr/`, fr-SN Dakar → `/fr/`, de-DE → `/de-de/`, en-US → `/en-us/`, ja-JP → `/en/`, choix enregistré fr-be → `/fr-be/`, sans JavaScript → `/en/` | ✓ liens ouverts un par un |
| Contrôles de l'offre (étape 1) relancés | ✓ |
| Lighthouse `/fr-fr/` | mobile et ordinateur : 100 partout, LCP 1,3 s et 0,3 s, CLS 0 |

Captures : même dossier, fichiers `etape2-*` (fr-fr, en-gb, de-de, `/en/` à 1440 et 393 px, à une date sans l'offre ;
Support ; pied de page du sélecteur de pays).

## Verdicts des agents

- **ulti-redacteur** : français et anglais = tes phrases, avec la typographie. « Fiches » est rendu par « pages »
  en nl, de, sv, nb, da, fi et pt-br, « distribution » par un mot nouveau dans chaque langue : à comparer avec l'app
  et à faire relire (danois et norvégien en priorité).
- **ulti-gardien-stores** : **feu vert**, aucun point bloquant. Appliqué : la réserve Apple TV dans `faq.r5`. À
  retenir : « prochaine mise à jour » est une promesse datée ; « sans publicité » est un engagement durable, qui
  vaudra aussi pour Android.
- **ulti-ergonome** : rien de bloquant. Appliqué : « Regardez‑le » ne se coupe plus, une phrase par ligne dans le
  titre de la dernière section, réserve Apple TV. Pas de doublon avec la section `#offre`. Retenu ensuite par Yoann :
  « (lecture avec Premium) » à la place de « (affiches, résumés, distribution) » sur la carte Gratuit. Non retenu :
  « acteurs » plutôt que « distribution » ; « Profitez-en » plutôt que « Regardez-le ».
- **ulti-relecteur** : **bon pour commit**, aucun point bloquant. Appliqué : `CLAUDE.md` mis à jour, protection du
  script du pied de page contre un texte contenant `<`, ménage des imports.

## Réglages demandés par Yoann avec le second « OK en ligne »

1. **« guide TV » ne se coupe plus en fin de ligne**, partout sur le site : espace insécable en français, anglais,
   espagnol, italien et portugais (12 endroits par langue) ; trait d'union insécable (U+2011) en néerlandais,
   allemand, suédois, norvégien, danois et finnois (« tv‑gids », « TV‑Guide », « TV‑opas »…). « XMLTV-gids » et ses
   équivalents ne sont pas touchés.
2. **Carte Gratuit** : « les fiches des films et séries (lecture avec Premium) » dans les 12 langues (mots de la
   mention `fonctions.premiumLecture` de chaque langue).
3. **Apostrophes typographiques** sur tout le site (`src/textes/`, `src/donnees/conditions/`), dans un commit à part.

Captures du haut de page et de la carte Gratuit refaites (`etape2-*-1-haut.jpg`, `etape2-*-4-tarifs.jpg`).

## Traductions à faire relire par une personne de langue maternelle

Dans cet ordre : **danois, norvégien**, puis finnois, allemand, néerlandais, suédois, espagnol, italien, portugais du
Brésil et du Portugal.

- **« Fiches » rendu par « pages »** en néerlandais (pagina’s), allemand (Seiten), suédois (sidor), norvégien (sider),
  danois (sider), finnois (sivut) et portugais du Brésil (páginas) ; « fiches » en espagnol (fichas), italien
  (schede) et portugais (fichas). À comparer avec le mot de l'app dans chaque langue.
- **Danois** : « og det er siderne for film og serier også på iPhone, iPad og Mac » (`faq.r5`) est lourd ; « yder det
  retfærdighed » (phrase du grand visuel) est soutenu ; « Familieløsningen », « sat ned i pris » (offre).
- **Norvégien** : « yter det rettferdighet » (grand visuel) ; « og det er også sidene for… » (`faq.r5`) ;
  « Alternativet Familie » (offre) ; `Intl` écrit « 30. november » et « mandag 30 november » sur la même page.
- **Finnois** : « Premium pysyvä » ne se décline pas bien ; « Perhe-vaihtoehto », « alennuksessa », « kumpi valita? » ;
  « liitä » ici, « Sijoita » dans la section Connexion (déjà noté).
- **Allemand** : « schau los » est familier ; `faq.r5` en trois phrases ; « Variante Familie » ; « Ulti herunterladen »
  alors que le badge d'Apple dit « Laden ».
- **Néerlandais, suédois, espagnol, portugais** : impératifs secs en fin de phrase (« en kijk », « och titta », « y
  mira », « e veja ») ; « lager geprijsd » (nl) ; « lo serán » (es, futur) ; « Opção Família » (pt).
- **Italien** : « Offerta Famiglia » à côté de « Offerta Black Friday ».
- **« Distribution »** n'apparaît plus sur l'accueil ; il reste dans le Support (cast, Besetzung, rollista,
  rollebesetning, medvirkende, näyttelijät, reparto, elenco).

## Mise en ligne de l'étape 2 et suite (24 et 25/11/2026)

- Étape 2 en ligne le 24/11 au soir, après le second « OK en ligne » et les trois réglages. Contrôle en ligne : fr-fr,
  en-gb, de-de et `/en/` montrent la nouvelle phrase, la carte Gratuit et la dernière section ; rien ne dépasse à
  393 px ; plus aucune apostrophe droite dans le texte visible ; le pied de page du sélecteur suit le visiteur.
- Question de Yoann le 25/11 : le site n'est **pas encore** sur les domaines achetés. Vérifié : ultitv.com,
  ultitv.app, ultiptv.app et ulti-iptv.com ne répondent pas (aucun DNS), et GitHub Pages n'a aucun domaine déclaré.
  Adresse publique : `https://yoannf57.github.io/ultime-iptv-site/`.
- Branchement d'ultitv.com (étape séparée, quand Yoann le demande) : 1. « Custom domain » dans les réglages Pages de
  GitHub ; 2. enregistrements DNS chez Cloudflare ; 3. « Enforce HTTPS », puis `domaine.actif: true` et le fichier
  `CNAME`. Ensuite, redirection des trois autres domaines. À prévoir : les adresses déclarées dans App Store Connect
  et Google Search Console.

## Reste

- Brancher ultitv.com.
- Retirer la réserve Apple TV (`faq.r5`, `support.q.gratuit.r`) quand la 1.1 Apple TV est publiée.
- Début décembre : `blackFriday.actif` à `false`.
