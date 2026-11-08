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

## Plus tard le 08/11 : ordinateur et étiquettes
- Sur ordinateur, deux rangées en miroir : téléphone puis « Collez. C'est tout. », puis « Scannez. C'est tout. » et
  l'Apple TV (plus large). Sur iPhone, rien ne change (Yoann trouvait déjà ça très bien).
- Clic sur une étiquette (Message, Coller, Remplissage, Prêt) : le tableau se rejoue depuis le début, puis la suite
  s'enchaîne. Clic sur « Coller » : le doigt appuie, la carte « Coller le message reçu » s'éclaire, puis les champs
  se remplissent. Le survol n'arrête plus l'animation ; seul le bouton Pause l'arrête (testé : la pause tient).
- Captures du dossier `2026-11-08-connexion/` remplacées. Build, textes, liens OK ; Lighthouse fr-fr 100/100/100.

## Page stable sur téléphone (08/11)
- La page glissait de gauche à droite sur iPhone : les halos derrière les appareils dépassaient de l'écran (jusqu'à
  48 px). `main { overflow-x: clip }` dans `Base.astro` les coupe au bord, sans changement visible.
- À 320 px, la pastille de l'en-tête dépassait aussi (« Binnenkort beschikbaar » en néerlandais) : elle passe sur
  deux lignes sur ces très petits écrans.
- Vérifié : 38 accueils à 320 px, et les pages Support, Confidentialité, Conditions, Mentions légales (fr, de, fi,
  pt-br, en) à 320 et 393 px : aucune n'est plus large que l'écran.
