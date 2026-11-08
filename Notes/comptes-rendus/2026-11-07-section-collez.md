# 07/11/2026 (soir) — Section « Collez. C'est tout. »

**Pour Yoann, en 10 lignes**
1. ✅ Nouvelle section juste après le grand visuel : surtitre « Connexion », titre « Collez. C'est tout. » /
   « Paste. That's it. », une phrase, et une petite animation de téléphone (écran flottant, liseré fin, halo).
2. 4 tableaux en boucle : le message du fournisseur → « Ajouter un abonnement », le doigt sur « Coller » → les champs
   se remplissent (« ✓ Trouvé : … Vérifiez puis continuez. », « Continuer » s'allume) → vraie capture « Vos chaînes ».
3. Dessous : les 3 étapes sur une ligne et « Moins d'une minute, montre en main. ». « Prêt en une minute » est supprimé.
4. Pause au survol, bouton Pause/Lecture, étiquettes cliquables. Sans JavaScript ou « réduire les animations » : les
   4 tableaux côte à côte (2 × 2 sur iPhone).
5. Aucun « M3U » ni « Xtream » dans la section ; seule adresse montrée : `fournisseur.example` (domaine réservé).
6. Écran de l'app comme le vrai : 3 champs (Serveur, Nom d'utilisateur, Mot de passe), pas de sélecteur de type.
7. Les mots de l'écran de l'app viennent des traductions de l'app ; **les autres phrases sont traduites par Claude,
   à faire relire** (11 langues).
8. Finnois : le titre dit « Sijoita » (mot de l'app et d'iOS), l'étape 1 dit encore « Liitä » : à harmoniser.
9. Allemand : ailleurs sur le site, « Erhaltene Nachricht einfügen » ; l'app dit maintenant « einsetzen » : à harmoniser.
10. Lighthouse fr-fr 100/100/100 (mobile et ordinateur), contraste ≥ 5,4:1 ; le site reste « Bientôt » et noindex.

## Ce qui a changé
- `src/components/accueil/Collez.astro` (nouveau) : la section, ses styles et ses animations CSS.
- `src/components/accueil/CollezEcran.astro` (nouveau) : un tableau dessiné en HTML (message, écran de l'app) ou la
  vraie capture iPhone `accueil` (4ᵉ tableau).
- `src/components/accueil/Etapes.astro` supprimé ; `src/pages/[pays]/index.astro` : `<Collez>` après `<Heros>`.
- `src/scripts/visite.js` : `data-durees` (une durée par tableau), `?tableau=<vue>` fige un tableau (pour les
  captures), animations CSS relancées à chaque tableau. Visite iPad et grand visuel inchangés.
- Textes (12 langues) : bloc `collez` (dont `collez.app.*` repris de `Localizable.xcstrings`), `etapes.titre` retiré
  (383 clés par langue).
- `scripts/captures-sections.mjs` : option `--collez` (4 tableaux + version sans animation).

## Vérifications
- `npm run build` (188 pages), `npm run verifier-textes`, `npm run verifier-liens` (11 182 liens) : OK.
- Contraste le plus faible : « Continuer » grisé #a1a1a6 sur #2c2c2e = 5,42:1.
- Lighthouse fr-fr : Performance, Accessibilité, Bonnes pratiques 100 (mobile et ordinateur) ; SEO 66 à cause du
  noindex voulu. LCP mobile 1,3 s, CLS 0.
- Testé : avance automatique, clic sur une étiquette, Pause, reprise, sans JavaScript.
- Captures fr-fr et en-gb, 1440 et 393 px : dossier `2026-11-07-section-collez/`. Vu aussi : de-de, fi-fi, pt-br.
- Le bouton Pause garde le texte de la visite (« Mettre la visite en pause »).
