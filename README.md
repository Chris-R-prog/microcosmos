# Microcosmos

Microcosmos est une version interactive du jeu de la vie de Conway, construite avec React et TypeScript.

## Fonctionnalites

- dessin libre des cellules sur une grille interactive ;
- lecture, pause et avance generation par generation ;
- compteur de generations et de cellules vivantes ;
- grille redimensionnable de 1 x 1 a 80 x 80 ;
- sauvegarde, chargement et suppression de colonies dans le navigateur ;
- interface responsive et accessible au clavier.

## Demarrage

Prerequis : Node.js et npm.

```bash
npm install
npm run dev
```

L'application est ensuite disponible a l'adresse indiquee par Vite.

## Commandes

```bash
npm run dev      # lance le serveur de developpement
npm run build    # produit la version de production
npm run preview  # previsualise la version de production
npm run test     # execute les tests
npm run lint     # analyse le code
```

## Technologies

- React
- TypeScript
- Vite
- Zustand
- Vitest

Les colonies sauvegardees sont conservees localement dans le navigateur avec `localStorage`.
