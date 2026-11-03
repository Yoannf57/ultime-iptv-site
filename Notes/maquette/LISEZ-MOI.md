# Maquette de l'accueil (S2)

Copie des fichiers sources de la maquette claude.ai (https://claude.ai/artifact/Pf8FgEQ7eR9gFKviLe9dhv), déposée par
claude.ai le 03/11/2026. Elle sert de référence visuelle pour l'étape S2 ; CLAUDE.md reste la règle.

- `Main.dc.html` : la page d'accueil complète (bandeau, en-tête, grand visuel, fonctions, « Faites le tour »,
  Apple TV, famille + Premium, « Prêt en une minute », tarifs, confidentialité, FAQ, pied de page).
- `Ecran.dc.html` : les écrans dessinés de l'app en 16:9 (accueil, direct, guide, replay, films, séries), réutilisés
  dans le grand visuel et dans « Faites le tour ».
- `Pays.dc.html` : la page « Choisissez votre pays ou votre région ».

## Comment lire ces fichiers

Ce sont des composants de l'outil de maquettes de claude.ai, pas des pages prêtes à ouvrir dans un navigateur
(le fichier `support.js` cité en tête n'existe pas ici). Tout le style est écrit en ligne (`style="…"`), donc les
couleurs, tailles, espacements et rayons sont lisibles directement.
- `{{nom}}` = une valeur calculée dans le script en bas du fichier (`renderVals()`), par exemple les listes de chaînes,
  d'affiches ou d'onglets.
- `<sc-if value="{{x}}">` = bloc affiché seulement si `x` est vrai ; `<sc-for list="{{liste}}" as="e">` = bloc répété
  pour chaque élément.
- `<dc-import name="Ecran" vue="…">` = insertion de `Ecran.dc.html` avec l'écran demandé.
- `cqw` = pourcentage de la largeur du cadre (unité de « container query ») : les écrans dessinés s'adaptent à leur
  cadre.

## Écarts connus avec CLAUDE.md (CLAUDE.md fait foi)

- **Section Tarifs périmée** : une seule formule et « Partage familial inclus ». À refaire d'après la section 6 :
  carte Gratuit (le direct), puis choix « Pour moi / Pour la famille » avec Solo et Famille.
- **Carte Gratuit** : la maquette dit « Direct, guide TV, films et séries… » ; les films et séries sont maintenant en
  Premium.
- **Liste Premium** : ajouter « Films et séries » en tête.
- **Carte « Films et séries, sans doublons »** : ajouter la petite mention « Premium ».
- **FAQ « Puis-je essayer avant de payer ? »** et **« Sur quels appareils ? »** : réponses à reformuler (le direct est
  gratuit ; Partage familial seulement avec la formule Famille).
- Liens du pied de page et de la confidentialité : provisoires (ils pointent vers `#questions`).
