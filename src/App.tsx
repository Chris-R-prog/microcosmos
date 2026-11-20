import { useEffect, useState, type FormEvent } from "react";

import { GameGrid } from "./components/GameGrid";
import {
  MAX_GRID_SIZE,
  MIN_GRID_SIZE,
  useGameStore,
} from "./store/useGameStore";

import "./App.css";

function App() {
  const grid = useGameStore((state) => state.grid);
  const isRunning = useGameStore((state) => state.isRunning);
  const generation = useGameStore((state) => state.generation);
  const savedDrawings = useGameStore((state) => state.savedDrawings);

  const toggleCell = useGameStore((state) => state.toggleCell);
  const advanceGeneration = useGameStore((state) => state.advanceGeneration);
  const clearGrid = useGameStore((state) => state.clearGrid);
  const resizeGrid = useGameStore((state) => state.resizeGrid);
  const toggleSimulation = useGameStore((state) => state.toggleSimulation);
  const saveDrawing = useGameStore((state) => state.saveDrawing);
  const loadDrawing = useGameStore((state) => state.loadDrawing);
  const deleteDrawing = useGameStore((state) => state.deleteDrawing);

  const rows = grid.length;
  const cols = grid[0].length;
  const livingCells = grid.reduce(
    (total, row) => total + row.filter(Boolean).length,
    0,
  );

  const [rowInput, setRowInput] = useState(String(rows));
  const [colInput, setColInput] = useState(String(cols));
  const [resizeError, setResizeError] = useState("");
  const [drawingName, setDrawingName] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      advanceGeneration();
    }, 500);

    return () => window.clearInterval(timer);
  }, [isRunning, advanceGeneration]);

  function handleResize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newRows = Number(rowInput);
    const newCols = Number(colInput);
    const isValid =
      Number.isInteger(newRows) &&
      Number.isInteger(newCols) &&
      newRows >= MIN_GRID_SIZE &&
      newRows <= MAX_GRID_SIZE &&
      newCols >= MIN_GRID_SIZE &&
      newCols <= MAX_GRID_SIZE;

    if (!isValid) {
      setResizeError(
        `Choisis des nombres entiers entre ${MIN_GRID_SIZE} et ${MAX_GRID_SIZE}.`,
      );
      return;
    }

    resizeGrid(newRows, newCols);
    setResizeError("");
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!saveDrawing(drawingName)) {
      setSaveError("Donne un nom à la colonie (40 caractères maximum).");
      return;
    }

    setDrawingName("");
    setSaveError("");
  }

  function handleLoad(id: string, drawingRows: number, drawingCols: number) {
    if (!loadDrawing(id)) return;

    setRowInput(String(drawingRows));
    setColInput(String(drawingCols));
    setResizeError("");
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">Laboratoire de vie artificielle</p>
        <h1>🧬 Microcosmos</h1>
        <p className="subtitle">
          Dessine une colonie, puis observe les règles de Conway la transformer.
        </p>
      </header>

      <section className="panel simulation-panel" aria-labelledby="simulation-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Expérience en cours</p>
            <h2 id="simulation-title">Simulation</h2>
          </div>
          <p className={`status ${isRunning ? "running" : "paused"}`}>
            <span aria-hidden="true" />
            {isRunning ? "En cours" : "En pause"}
          </p>
        </div>

        <div className="metrics" aria-live="polite">
          <div>
            <span>Génération</span>
            <strong>{generation}</strong>
          </div>
          <div>
            <span>Cellules vivantes</span>
            <strong>{livingCells}</strong>
          </div>
          <div>
            <span>Dimensions</span>
            <strong>
              {rows} × {cols}
            </strong>
          </div>
        </div>

        <div className="controls">
          <button
            type="button"
            className="action-button primary"
            disabled={isRunning}
            onClick={advanceGeneration}
          >
            ⏭ Génération suivante
          </button>
          <button
            type="button"
            className="action-button"
            onClick={clearGrid}
          >
            🗑️ Vider la grille
          </button>
          <button
            type="button"
            className={`action-button ${isRunning ? "danger" : "start"}`}
            onClick={toggleSimulation}
          >
            {isRunning ? "⏸ Pause" : "▶ Démarrer"}
          </button>
        </div>

        <form className="resize-form" onSubmit={handleResize}>
          <div className="field-group">
            <label htmlFor="rows">Lignes</label>
            <input
              id="rows"
              type="number"
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              step="1"
              value={rowInput}
              onChange={(event) => setRowInput(event.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="cols">Colonnes</label>
            <input
              id="cols"
              type="number"
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              step="1"
              value={colInput}
              onChange={(event) => setColInput(event.target.value)}
            />
          </div>
          <button type="submit" className="action-button compact">
            Appliquer
          </button>
          {resizeError && <p className="form-error">{resizeError}</p>}
        </form>

        <div className="grid-wrapper">
          <GameGrid
            grid={grid}
            disabled={isRunning}
            onCellClick={toggleCell}
          />
        </div>
        <p className="grid-hint">
          {isRunning
            ? "Mets la simulation en pause pour modifier les cellules."
            : "Clique sur les cellules pour dessiner ta colonie."}
        </p>
      </section>

      <section className="panel saved-panel" aria-labelledby="saved-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Collection</p>
            <h2 id="saved-title">Colonies sauvegardées</h2>
          </div>
          <span className="saved-count">{savedDrawings.length}</span>
        </div>

        <form className="save-form" onSubmit={handleSave}>
          <div className="field-group grow">
            <label htmlFor="drawing-name">Nom de la colonie</label>
            <input
              id="drawing-name"
              type="text"
              maxLength={40}
              placeholder="Ex. Oscillateur"
              value={drawingName}
              onChange={(event) => setDrawingName(event.target.value)}
            />
          </div>
          <button type="submit" className="action-button primary compact">
            Sauvegarder
          </button>
          {saveError && <p className="form-error">{saveError}</p>}
        </form>

        {savedDrawings.length === 0 ? (
          <p className="empty-state">
            Aucune colonie enregistrée. Dessine quelques cellules puis sauvegarde
            ton premier modèle.
          </p>
        ) : (
          <ul className="saved-list">
            {savedDrawings.map((drawing) => (
              <li key={drawing.id}>
                <div>
                  <strong>{drawing.name}</strong>
                  <span>
                    {drawing.rows} × {drawing.cols}
                  </span>
                </div>
                <div className="saved-actions">
                  <button
                    type="button"
                    className="action-button compact"
                    onClick={() =>
                      handleLoad(drawing.id, drawing.rows, drawing.cols)
                    }
                  >
                    Charger
                  </button>
                  <button
                    type="button"
                    className="action-button compact delete"
                    onClick={() => deleteDrawing(drawing.id)}
                    aria-label={`Supprimer ${drawing.name}`}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
