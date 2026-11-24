# 24/11/2026 — Black Friday, étape 1 : l'offre

Premium à vie est à prix réduit dans l'App Store depuis le 24/11 au soir, jusqu'au lundi 30/11/2026 inclus. Le site
affichait encore les prix normaux. Cette étape ajoute l'offre sur les pages d'accueil, avec un retour automatique au
site normal le 01/12. Branche `black-friday`. L'étape 2 (nouvelle phrase du grand visuel, dernière section, décision
N33) n'est pas faite : le message de Yoann était coupé, il la recolle après la mise en ligne.

## Pour Yoann, en 8 lignes

1. Tes 22 prix normaux « à vie » sont identiques à `src/pays.json`. Aucun écart.
2. « Le prix d'un an, payé une fois » est vrai dans les 11 monnaies, Solo et Famille. Le site le revérifie à chaque
   construction et retire l'argument pour un pays où ce serait faux.
3. Un seul réglage : `blackFriday` dans `site.config.mjs` (`actif`, `fin`, prix réduits par monnaie,
   `aussiGooglePlay: false`).
4. Avec `actif: false`, les 191 fichiers du site sont identiques à ceux de `main` (seule la feuille de styles
   contient quelques règles en plus, inutilisées).
5. Avec `actif: true`, l'offre s'affiche jusqu'au 30/11 inclus (date du visiteur) et disparaît le 01/12, sans rien
   republier. Sans JavaScript : site normal.
6. Pages internationales (`/en/`, `/fr/`…) : offre sans montant, sans pourcentage et sans « le prix d'un an »
   (ta décision du 24/11).
7. Lighthouse `/fr-fr/` avec l'offre : 100 partout, mobile et ordinateur.
8. À faire par toi : voir « Ce que Yoann doit vérifier ». Et début décembre, repasser `actif` à `false`.

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

- « OK en ligne » de Yoann, puis : `actif: true`, fusion dans `main`, push, contrôle de la page en ligne.
- Début décembre : `actif: false` (retire les prix réduits du code des pages).
- Défaut déjà présent avant l'offre, vu par l'ergonome : dans la FAQ sur téléphone, la croix d'une question ouverte
  sur deux lignes glisse d'environ 10 px à droite.
- Étape 2.
