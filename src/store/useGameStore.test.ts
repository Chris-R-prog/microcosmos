import { beforeEach, describe, expect, it } from "vitest";

import { createEmptyGrid } from "../utils/gameOfLife";
import { STORAGE_KEY, useGameStore } from "./useGameStore";

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({
    grid: createEmptyGrid(30, 30),
    generation: 0,
    isRunning: false,
    savedDrawings: [],
  });
});

describe("useGameStore", () => {
  it("refuse les dimensions invalides", () => {
    expect(useGameStore.getState().resizeGrid(0, 20)).toBe(false);
    expect(useGameStore.getState().resizeGrid(20, 81)).toBe(false);
    expect(useGameStore.getState().grid).toHaveLength(30);
    expect(useGameStore.getState().grid[0]).toHaveLength(30);
  });

  it("verrouille les cellules en lecture et réinitialise la simulation", () => {
    useGameStore.getState().toggleCell(4, 4);
    useGameStore.getState().toggleSimulation();
    useGameStore.getState().toggleCell(4, 4);

    expect(useGameStore.getState().grid[4][4]).toBe(true);

    useGameStore.getState().advanceGeneration();
    useGameStore.getState().clearGrid();

    const state = useGameStore.getState();
    expect(state.grid.flat().some(Boolean)).toBe(false);
    expect(state.generation).toBe(0);
    expect(state.isRunning).toBe(false);
  });

  it("restaure une colonie 10 × 20 après réhydratation", async () => {
    const store = useGameStore.getState();

    expect(store.resizeGrid(10, 20)).toBe(true);
    useGameStore.getState().toggleCell(2, 3);
    useGameStore.getState().toggleCell(9, 19);
    expect(useGameStore.getState().saveDrawing("Test 10 × 20")).toBe(true);

    const persistedValue = localStorage.getItem(STORAGE_KEY);
    expect(persistedValue).not.toBeNull();
    if (!persistedValue) throw new Error("La sauvegarde locale est absente");

    const persistedState = JSON.parse(persistedValue) as {
      state: Record<string, unknown>;
    };
    expect(Object.keys(persistedState.state)).toEqual(["savedDrawings"]);

    useGameStore.setState({
      grid: createEmptyGrid(30, 30),
      generation: 0,
      isRunning: false,
      savedDrawings: [],
    });
    localStorage.setItem(STORAGE_KEY, persistedValue);
    await useGameStore.persist.rehydrate();

    const drawing = useGameStore.getState().savedDrawings[0];
    expect(drawing.rows).toBe(10);
    expect(drawing.cols).toBe(20);

    useGameStore.setState({ generation: 7, isRunning: true });
    expect(useGameStore.getState().loadDrawing(drawing.id)).toBe(true);

    const loadedState = useGameStore.getState();
    expect(loadedState.grid).toHaveLength(10);
    expect(loadedState.grid[0]).toHaveLength(20);
    expect(loadedState.grid[2][3]).toBe(true);
    expect(loadedState.grid[9][19]).toBe(true);
    expect(loadedState.generation).toBe(0);
    expect(loadedState.isRunning).toBe(false);

    useGameStore.getState().toggleCell(2, 3);
    expect(useGameStore.getState().grid[2][3]).toBe(false);
    expect(useGameStore.getState().savedDrawings[0].grid[2][3]).toBe(true);

    useGameStore.getState().deleteDrawing(drawing.id);
    expect(useGameStore.getState().savedDrawings).toHaveLength(0);
  });
});
