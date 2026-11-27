# 27/11/2026 — Android sur Google Play (et préparation d'ultitv.com)

## Vérifié avant de commencer
- Fiche Google Play en ligne : « Ulti - Lecteur IPTV », `com.yoannfebvre.ultimeiptv`. Site déclaré dans la fiche :
  l'adresse github.io.
- App Store : les prix intégrés (fiches fr et gb) sont ceux du site, Black Friday compris.
- Prix Solo de Google Play donnés par Yoann (alignés ce soir dans la Play Console) : **identiques** à `pays.json` et
  à `blackFriday.prix.*.solo`, dans les 11 monnaies et pour tous les pays. Aucun prix n'a été recopié ni calculé.
- ultitv.com : aucun DNS, aucun domaine déclaré chez GitHub.

## Ce qui a changé (branche `android-et-domaine`)
- `site.config.mjs` : `googlePlay: { disponible: true, id }` et `blackFriday.aussiGooglePlay: true`.
- `src/lib/googleplay.ts` : `lienGooglePlay` (`hl` = langue, `gl` = pays) et `googlePlayAffiche`.
- **Badge officiel Google Play** à côté de celui de l'App Store (`BadgeGooglePlay.astro`, `Heros.astro`). PNG de
  Google téléchargés sur play.google.com/intl/en_us/badges/ et rangés dans `Notes/badges/google-play/` (non versionné),
  puis copiés tels quels par `npm run importer-badges`. Celui-ci mesure aussi leur marge transparente
  (`mesures.json`) pour donner aux deux badges la même hauteur visible.
- Textes, 12 langues :
  - question Support « Ulti existe-t-il sur Android ? » ;
  - `faq.r2`, `appareils` et `installer` ;
  - phrase sous les tarifs (« Premium Solo coûte le même prix… ») ;
  - lien « Aussi sur Google Play » dans la dernière section ;
  - Black Friday : à vie Solo aussi en promo sur Google Play, Famille seulement sur Apple, avec un lien ;
  - mention de marque de Google dans le pied de page ;
  - variantes `…SansGooglePlay` si le réglage repasse à `false`.
- « Android TV » retiré de la confidentialité (titre du paragraphe Android, 12 langues) et des conditions (fr, en).
  L'app n'est publiée que pour les téléphones et les tablettes.
- `CLAUDE.md` mis à jour (section 7 Android, Black Friday, avancement).

## Contrôles
- `verifier-textes` (437 clés par langue), `build`, `verifier-liens` (11 293 liens, 188 pages) : verts.
- Essai avec `googlePlay.disponible: false` : plus aucune mention de Google Play, et les anciennes réponses
  reviennent.
- Captures à 1440 et 393 px (fr-fr, en-gb) : les deux badges ont la même hauteur, l'offre et les tarifs sont justes.
  Aucun débordement à 320 et 393 px sur les 37 pages d'accueil.
- **ulti-relecteur** : 7 remarques, toutes corrigées :
  - variantes sans Google Play ;
  - question masquée ;
  - `heros.sansAppleTv` ;
  - valeur unique `googlePlayAffiche` ;
  - CLAUDE.md ;
  - commentaire sur sharp, déjà installé avec Astro (aucune dépendance ajoutée).
- **ulti-gardien-stores** : feu rouge pour « Android TV » dans la confidentialité et les conditions. C'est corrigé.
  Le reste est conforme : badges, mention de marque, promesses.

## À faire par Yoann
- Play Console : vérifier que l'offre d'essai de 7 jours est active sur le mensuel ET l'annuel Solo, et que la
  promo de l'achat à vie finit le 30/11, comme sur le site.
- Sur un vrai téléphone Android : le badge ouvre la fiche Ulti.
- Début décembre : `blackFriday.actif: false` (retire aussi les phrases Google Play de l'offre).
- Traductions des nouvelles phrases (10 langues) : à faire relire.

## ultitv.com (pas encore fait, pull request séparée)
Le site n'est pas basculé : si le réglage partait avant les DNS, le site serait coupé. Ordre prévu :
1. Yoann vérifie ultitv.com dans GitHub (Settings › Pages › Add a domain, enregistrement TXT).
2. Yoann ajoute chez Cloudflare, nuage gris : le TXT, 4 A, 4 AAAA et `CNAME www` → `yoannf57.github.io`.
3. Claude contrôle avec `dig`, passe `domaine.actif: true`, crée `public/CNAME`, ouvre la pull request. Après la
   fusion, il déclare le domaine (`cname`) puis active « Enforce HTTPS ».
4. Contrôle des anciennes adresses github.io (`/fr-fr/terms/`, `/en/terms/`, `/fr/privacy/`), qui servent à l'app
   et à App Store Connect.
5. Ensuite, par Yoann : URL dans App Store Connect et la Play Console, Google Search Console, redirection des trois
   autres domaines.
