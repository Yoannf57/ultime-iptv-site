# 07/11/2026 — Publication préparée (« Au Lot 11 »)

**Pour Yoann, en 10 lignes**
1. ✅ **Tout est prêt pour le jour J.** Badges d'Apple importés le soir : les 12 langues ont leur badge noir officiel
   (+ celui d'Amérique latine pour es-mx), aucune langue ne manque. Badge noir validé par Yoann.
2. **La ligne à changer le jour J**, dans `site.config.mjs` : `disponible: false,` → `disponible: true,`
   (+ `indexable: true` si ultitv.com n'est pas encore branché ; `appleTvDisponible: false` si Apple n'a pas encore
   accepté la version Apple TV). Puis build, vérifications, commit, push : CLAUDE.md, section 10, « Jour de la publication ».
3. Ce jour-là, le site affiche le badge officiel (48 px, 44 px sur iPhone) dans la langue de la page, avec le bon
   lien App Store par pays (fr → /fr/, en-gb → /gb/…, pages internationales sans pays).
4. Le bandeau App Store de Safari (Smart App Banner) apparaît aussi, sauf sur la page de choix et la 404.
5. Sous le badge : « Bientôt sur Android. » ; avant la publication : « Puis sur Android. ».
6. Si l'Apple TV est en retard : « Apple TV : dans quelques jours. Bientôt sur Android. » (vu en capture).
7. Traductions des nouvelles phrases dans les 10 autres langues : faites par Claude, **à faire relire**.
8. Le site en ligne reste en « Bientôt sur l'App Store » et en noindex (vérifié après le push).
9. Les badges blancs ne servent qu'à comparer : `captures/badges-blancs/` (non versionné), jamais sur le site.
10. Reste hors site : basculer l'URL de confidentialité dans App Store Connect (ta décision).

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
- **Le soir** : badges d'Apple déposés par Yoann dans `Notes/badges/` (dossier « Download-on-the-App-Store » d'Apple) ;
  import → `src/assets/badges/` : fr, en (US-UK), nl, de, sv (SE), nb (NO), da (DK), fi, es, es-mx (ESMX), it, pt-br,
  pt (PTPT), copies identiques octet pour octet (vérifié avec `cmp`). Le script remet des droits normaux (644) : les
  fichiers d'Apple étaient marqués exécutables.

## Vérifications
- Build sans erreur (avec `disponible` à false, puis à true, puis `appleTvDisponible` à false) ; `verifier-textes` ✓ ;
  `verifier-liens` ✓ (11 071 liens, 188 pages).
- Avec `disponible: true` : liens fr → `/fr/`, en-gb → `/gb/`, pt-br → `/br/`, es-mx → `/mx/`, `/es/` → sans pays ;
  meta Smart App Banner présente sur fr-fr, fr-fr/support et /es/, absente de `pays/` et `404.html`.
- Avec `disponible: false` : aucune meta `apple-itunes-app`, noindex toujours là.
- Captures (dossier `captures/`, non versionné) : `bientot-*`, `final-fr-fr-*` (« Puis sur Android. »), `dispo-*`
  (bouton de secours, faute de badge), `sanstv-fr-fr-*`.
- Le soir, avec `disponible: true` le temps des captures : `badge-noir-*`, `badge-blanc-*` (fr-fr et en-gb,
  ordinateur et iPhone), `sanstv-noir-*` (`appleTvDisponible: false`). Badge à 48 px (ordinateur) et 44 px (iPhone).
  Badge noir validé par Yoann. Puis `disponible` remis à `false` (`git diff site.config.mjs` vide), build,
  `verifier-textes` ✓, `verifier-liens` ✓ (11 071 liens, 188 pages).
- Pas fait : Lighthouse (pas installé sur le Mac). Les pages de choix
  et 404 n'utilisent ni le grand visuel ni la FAQ ; leur seule différence possible (la meta) est vérifiée absente.
