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

## ultitv.com (fait le soir, à la demande de Yoann : « fais tout »)
Claude a tout fait depuis Chrome, Yoann s'étant connecté lui-même à GitHub et à Cloudflare :
1. GitHub, réglages du compte › Pages : ultitv.com **vérifié** (TXT `_github-pages-challenge-Yoannf57`).
2. Cloudflare, ultitv.com, « DNS only » : 4 A et 4 AAAA de GitHub Pages, `CNAME www` → `yoannf57.github.io`, plus
   le TXT. L'existant n'a pas été touché : MX, SPF et DKIM d'iCloud, vérification Google, `api.ultitv.com`.
3. Pull requests n° 3 (Android) et n° 4 (`domaine.actif: true`, `public/CNAME`) fusionnées par Claude, à la demande de
   Yoann. Déploiement vert, puis `cname=ultitv.com` déclaré dans le dépôt, certificat obtenu, « Enforce HTTPS »
   activé.
4. Contrôles en ligne :
   - `https://ultitv.com/fr-fr/`, `/en-gb/`, `/fr-fr/support/`, `/fr-fr/terms/`, `/en/terms/`, `/fr/privacy/` et
     `robots.txt` répondent 200 ;
   - `http://` renvoie vers `https://`, et `www` vers la racine ;
   - les anciennes adresses github.io renvoient en 301 vers ultitv.com, avec le même chemin. Aucune page de renvoi
     n'était donc nécessaire ;
   - canonique `https://ultitv.com/fr-fr/`, Smart App Banner, badge Google Play ;
   - confidentialité du dépôt de démo inchangée ;
   - courrier iCloud inchangé.
5. ultitv.app, ultiptv.app et ulti-iptv.com (DNS vides avant) : A `192.0.2.1` proxifié pour `@` et `www`, et une règle
   de redirection « Vers ultitv.com » (toutes les requêtes, 301, chemin et paramètres gardés). Vérifié pour chacun.

## Google (fait par Claude, compte ultitvplayer)
- **Search Console** : la propriété de domaine `ultitv.com` existait déjà, vérifiée par le TXT `google-site-verification`.
  Exploration demandée pour `https://ultitv.com/fr-fr/` et `https://ultitv.com/en/`.
- **Play Console** :
  - « Site Web » de la fiche passé à `https://ultitv.com/`, publié tout de suite ;
  - règles de confidentialité passées à `https://ultitv.com/en/privacy/`, envoyées à l'examen. La publication est
    gérée (« Managed publishing on ») : **une fois l'examen accepté, il faut cliquer sur Publier**.
- **À décider par Yoann** : la production Google Play est publiée pour les téléphones et tablettes, **Android TV,
  Android XR et les ordinateurs (ChromeOS)**. Le site dit encore « téléphones et tablettes » seulement.
- La session Android (`android-tv-frame-rate-plan`) a été prévenue des nouvelles adresses.

## Reste à faire par Yoann
- **App Store Connect** (connexion requise, Claude ne tape pas les mots de passe) : adresse de confidentialité
  (modifiable à tout moment), support et marketing (avec la prochaine version). Les anciennes adresses redirigent :
  rien ne presse.
- Play Console : cliquer sur **Publier** quand Google aura accepté la nouvelle adresse de confidentialité.
- **Session de l'app iOS** : `PremiumView.termsURL` vers `https://ultitv.com/…/terms/` à la prochaine version.
