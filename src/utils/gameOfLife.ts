export function createEmptyGrid(rows: number, cols: number): boolean[][] {
  const grid: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false),
  );

  return grid;
}

export function toggleCell(
  grid: boolean[][],
  row: number,
  col: number,
): boolean[][] {
  const newGrid = grid.map((currentRow) => [...currentRow]);

  newGrid[row][col] = !newGrid[row][col];

  return newGrid;
}

export function countNeighbors(
  grid: boolean[][],
  row: number,
  col: number,
): number {
  let count = 0;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      // Ignorer la cellule centrale
      if (r === 0 && c === 0) {
        continue;
      }

      // Calculer la position de la voisine
      const newRow = row + r;
      const newCol = col + c;

      // Vérifier les limites de la grille
      if (
        newRow < 0 ||
        newCol < 0 ||
        newRow >= grid.length ||
        newCol >= grid[0].length
      ) {
        continue;
      }

      // Compter les voisines vivantes
      if (grid[newRow][newCol]) {
        count++;
      }
    }
  }

  return count;
}

export function nextGeneration(grid: boolean[][]): boolean[][] {
  const rows = grid.length;
  const cols = grid[0].length;

  const nextGrid = createEmptyGrid(rows, cols);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const neighbors = countNeighbors(grid, r, c);

      // Règle 1 : une cellule vivante survit avec 2 ou 3 voisines
      if (grid[r][c] && (neighbors === 2 || neighbors === 3)) {
        nextGrid[r][c] = true;
      }

      // Règle 2 : naissance d'une nouvelle cellule
      if (!grid[r][c] && neighbors === 3) {
        nextGrid[r][c] = true;
      }
    }
  }
  return nextGrid;
}
