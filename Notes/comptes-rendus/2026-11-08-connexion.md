# 08/11/2026 — Section « Connexion » refaite : téléphone + Apple TV

**Pour Yoann, en 10 lignes**
1. ✅ Grand titre à gauche : « Se connecter n'a jamais été aussi simple. » / « Getting connected has never been easier. ».
2. Ton idée « la connexion la plus simple du monde » est gardée dans l'esprit, sans affirmer un record qu'on ne peut
   pas prouver (règle : ne rien promettre d'invérifiable).
3. Dessous, deux appareils côte à côte : à gauche le téléphone animé (copier-coller), à droite l'Apple TV.
4. Sous le téléphone : « Collez. C'est tout. » et sa phrase. Sous la télé : « Scannez. C'est tout. » et une phrase
   sur l'appairage par QR code (rien à taper à la télécommande, chiffré, par le réseau local).
5. L'écran de la télé est dessiné d'après le vrai écran « Avec mon iPhone » de l'app, avec ses mots dans les 12 langues.
6. Le QR code est un simple motif : il ne contient rien et ne se scanne pas.
7. Les 3 étapes et « Moins d'une minute, montre en main. » restent en bas de la section.
8. Sur iPhone : titre, téléphone + texte, puis télé + texte, l'un sous l'autre.
9. Nouvelles phrases (titre, « Scannez », phrase télé) traduites par Claude : **à faire relire**.
10. À décider : la section « Apple TV » plus bas redit l'appairage par QR code (« Sur la télé, vous ne tapez rien. »).

## Ce qui a changé
- `Collez.astro` : nouvelle mise en page (titre, grille téléphone / Apple TV, textes dessous) ; sans JavaScript, les
  4 tableaux du téléphone en 2 × 2 dans sa colonne.
- `CollezTv.astro` (nouveau) : écran d'appairage de l'Apple TV dessiné en HTML.
- Textes (12 langues) : `collez.titre` (nouveau grand titre), `collez.collerTitre`, `collez.scannerTitre`,
  `collez.scannerPhrase`, `collez.tv.*` (mots de l'app). Espaces insécables dans « {bouton} » en français.

## Vérifications
- `npm run build`, `verifier-textes` (392 clés par langue), `verifier-liens` (11 182 liens) : OK.
- Lighthouse fr-fr, mobile et ordinateur : Performance, Accessibilité, Bonnes pratiques 100.
- Aucun « M3U » ni « Xtream » dans la section.
- Captures fr-fr et en-gb, 1440 et 393 px : dossier `2026-11-08-connexion/`.
