# 11/11/2026 — Jour de la publication

Ulti est sur l'App Store (iPhone, iPad, Mac et Apple TV). Travail fait depuis le cloud (pas sur le Mac de Yoann),
livré dans une pull request vers `main`.

**Pour Yoann, en 8 lignes**
1. ✅ `site.config.mjs` : `disponible: true`, `appleTvDisponible: true` (inchangé), `indexable: true` (ultitv.com
   n'est pas encore branché).
2. ✅ `npm run verifier-textes` (392 clés × 12 langues), `npm run build` (188 pages), `npm run verifier-liens`
   (11 219 liens internes valides) : tout passe.
3. ✅ Liens App Store vérifiés dans les pages construites : tous vers `id6829902519` (détail plus bas).
4. ✅ Badge officiel noir dans la langue de la page, « Bientôt sur Android. » dessous, Smart App Banner sur les pages
   de pays et de langue (pas sur la page de choix ni la 404).
5. ✅ Google : plus de `noindex` (sauf la 404, volontairement), `robots.txt` autorise tout.
6. 🔧 Corrigé au passage : `robots.txt` annonçait un plan du site (`sitemap-index.xml`) qui n'existe pas. Ligne retirée.
7. **Le site en ligne ne change qu'après la fusion de la pull request** dans `main` (le déploiement part tout seul).
8. Reste à vérifier sur un vrai iPhone : le bandeau Smart App Banner dans Safari.

## Ce qui a changé
- `site.config.mjs` : `disponible` et `indexable` passent à `true`.
- `src/pages/robots.txt.ts` : sans ligne `Sitemap:` (aucun plan du site n'est généré ; Google trouve les pages par
  les liens et les balises `hreflang`). Si on veut un plan du site plus tard : à faire avec ultitv.com, pour qu'il
  donne directement les bonnes adresses.

## Vérifications (dans `dist/`, après le build)
| Page      | Lien App Store                                                 | Smart App Banner         |
|-----------|----------------------------------------------------------------|--------------------------|
| `/fr-fr/` | `https://apps.apple.com/fr/app/ulti-iptv-player/id6829902519`  | `app-id=6829902519`      |
| `/en-gb/` | `https://apps.apple.com/gb/app/ulti-iptv-player/id6829902519`  | `app-id=6829902519`      |
| `/pt-br/` | `https://apps.apple.com/br/app/ulti-iptv-player/id6829902519`  | `app-id=6829902519`      |
| `/es/`    | `https://apps.apple.com/app/ulti-iptv-player/id6829902519`     | `app-id=6829902519`      |

Chaque page contient le lien deux fois : le badge du grand visuel et le bouton « Télécharger » de l'en-tête.
Page de choix (`/`) et 404 : pas de Smart App Banner. Seule la 404 garde `noindex`.

Captures (navigateur de test, 1440 et 393 px, fr-fr et en-gb) : badge officiel affiché, pas de débordement sur le
côté (`scrollWidth` = largeur de l'écran). Le bandeau « Vous êtes aux États-Unis ? » des captures vient du fuseau
horaire du navigateur de test, pas du site.

## Ce que Yoann doit faire pour mettre en ligne
1. Ouvrir la pull request sur GitHub, onglet « Files changed » : vérifier les deux lignes de `site.config.mjs`.
2. Bouton vert **« Merge pull request »**, puis **« Confirm merge »**.
3. Onglet **Actions** du dépôt : le déploiement « Déploiement GitHub Pages » démarre tout seul (2 à 10 minutes ; il
   refait verifier-textes, build et verifier-liens). Attendre la coche verte.
4. Ouvrir `https://yoannf57.github.io/ultime-iptv-site/fr-fr/` (recharger fort si l'ancienne version s'affiche) :
   le badge doit remplacer « Bientôt sur l'App Store ». Cliquer dessus → la fiche Ulti.
5. Sur l'iPhone, dans Safari : le bandeau « Ulti » en haut de la page.
6. Facultatif : Google Search Console, plus tard, avec ultitv.com.

## Reste
- Hors site : basculer l'URL de confidentialité dans App Store Connect (décision de Yoann).
- Branchement d'ultitv.com (étape séparée).
- Téléphone et SIREN toujours à `null` dans `site.config.mjs` (emplacements visibles sur les mentions légales).
- Relecture des traductions par des personnes de langue maternelle.
