# 07/11/2026 — Publication préparée (« Au Lot 11 »)

**Pour Yoann, en 10 lignes**
1. ⚠️ **Les badges d'Apple ne sont toujours pas dans `Notes/badges/`** : dépose-les, puis lance `npm run importer-badges`
   (il dit quelles langues Apple n'a pas) ; on committe ensuite `src/assets/badges/` et je fais les captures du badge
   noir et du badge blanc. En attendant, le site affiche un bouton texte « Télécharger dans l'App Store » à la place.
2. **Le jour J, une ligne** : `disponible: true` dans `site.config.mjs` (+ `indexable: true` si ultitv.com n'est pas
   encore branché ; `appleTvDisponible: false` si l'Apple TV n'est pas encore acceptée). Liste complète : CLAUDE.md,
   section 10, « Jour de la publication ».
3. Prêt : liens App Store calculés pour les 37 pages (fr → /fr/, en-gb → /gb/…, pages internationales sans pays),
   Smart App Banner (sauf page de choix et 404), « Bientôt sur Android », mode « Apple TV dans quelques jours ».
4. Avant la publication, la ligne sous « Bientôt sur l'App Store » dit « Puis sur Android. » (deux « Bientôt » de suite
   se lisaient mal) ; après : « Bientôt sur Android. ».
5. Traductions des nouvelles phrases dans les 10 autres langues : faites par Claude, **à faire relire**.
6. Le site en ligne reste en « Bientôt sur l'App Store » et en noindex.

## Ce qui a changé
- `site.config.mjs` : `appStore: { id: "6829902519", nom: "ulti-iptv-player" }`, `appleTvDisponible: true`,
  commentaires du jour J. `indexable` reste `false` (décision : avec ultitv.com, ou le jour J au plus tard).
- `src/lib/appstore.ts` (nouveau) : `lienAppStore(p)`. Clé `lienAppStore` enlevée de `pays.json` (exception facultative).
- `BadgeAppStore.astro` (nouveau, règles d'Apple en commentaire) dans `Heros.astro` ; « Voir les tarifs » à la même
  hauteur (3 rem). En-tête : pastille texte vers la même adresse. Support « Comment installer Ulti ? » : « App Store »
  devient un lien (cible `appstore`).
- `Base.astro` : `apple-itunes-app` si `disponible`, seulement avec un pays et hors 404.
- Textes (12 langues) : `heros.badge`, `heros.android`, `heros.androidAvantPublication`, `heros.androidSansAppleTv`,
  phrase Android à la fin de `faq.r2` et `support.q.appareils.r`, variantes `faq.r2SansAppleTv`,
  `support.q.appareils.rSansAppleTv`, `support.q.installer.rSansAppleTv` (355 clés par langue).
- `scripts/importer-badges.mjs` + `npm run importer-badges` ; `/Notes/badges/` ignoré par Git.

## Vérifications
- Build sans erreur (avec `disponible` à false, puis à true, puis `appleTvDisponible` à false) ; `verifier-textes` ✓ ;
  `verifier-liens` ✓ (11 071 liens, 188 pages).
- Avec `disponible: true` : liens fr → `/fr/`, en-gb → `/gb/`, pt-br → `/br/`, es-mx → `/mx/`, `/es/` → sans pays ;
  meta Smart App Banner présente sur fr-fr, fr-fr/support et /es/, absente de `pays/` et `404.html`.
- Avec `disponible: false` : aucune meta `apple-itunes-app`, noindex toujours là.
- Captures (dossier `captures/`, non versionné) : `bientot-*`, `final-fr-fr-*` (« Puis sur Android. »), `dispo-*`
  (bouton de secours, faute de badge), `sanstv-fr-fr-*`.
- Pas fait : captures du badge noir/blanc (badges absents) ; Lighthouse (pas installé sur le Mac). Les pages de choix
  et 404 n'utilisent ni le grand visuel ni la FAQ ; leur seule différence possible (la meta) est vérifiée absente.
