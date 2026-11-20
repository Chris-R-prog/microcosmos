type GameGridProps = {
  grid: boolean[][];
  disabled: boolean;
  onCellClick: (row: number, col: number) => void;
};

export function GameGrid({ grid, disabled, onCellClick }: GameGridProps) {
  return (
    <div
      className="game-grid"
      aria-label={`Grille de ${grid.length} lignes et ${grid[0].length} colonnes`}
    >
      {grid.map((row, rowIndex) => (
        <div className="grid-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <button
              key={colIndex}
              type="button"
              className={cell ? "cell alive" : "cell dead"}
              aria-label={`Cellule ${rowIndex + 1}, ${colIndex + 1}`}
              aria-pressed={cell}
              disabled={disabled}
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
