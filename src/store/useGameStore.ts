import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  createEmptyGrid,
  nextGeneration,
  toggleCell as toggleGridCell,
} from "../utils/gameOfLife";

export const DEFAULT_ROWS = 30;
export const DEFAULT_COLS = 30;
export const MIN_GRID_SIZE = 1;
export const MAX_GRID_SIZE = 80;
export const STORAGE_KEY = "microcosmos-saved-drawings";

export type SavedDrawing = {
  id: string;
  name: string;
  rows: number;
  cols: number;
  grid: boolean[][];
};

type GameState = {
  grid: boolean[][];
  generation: number;
  isRunning: boolean;
  savedDrawings: SavedDrawing[];

  advanceGeneration: () => void;
  clearGrid: () => void;
  resizeGrid: (rows: number, cols: number) => boolean;
  toggleCell: (row: number, col: number) => void;
  toggleSimulation: () => void;
  saveDrawing: (name: string) => boolean;
  loadDrawing: (id: string) => boolean;
  deleteDrawing: (id: string) => void;
};

function cloneGrid(grid: boolean[][]): boolean[][] {
  return grid.map((row) => [...row]);
}

function isValidDimension(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= MIN_GRID_SIZE &&
    value <= MAX_GRID_SIZE
  );
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      grid: createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS),
      generation: 0,
      isRunning: false,
      savedDrawings: [],

      clearGrid: () => {
        const grid = get().grid;

        set({
          grid: createEmptyGrid(grid.length, grid[0].length),
          generation: 0,
          isRunning: false,
        });
      },

      resizeGrid: (rows, cols) => {
        if (!isValidDimension(rows) || !isValidDimension(cols)) {
          return false;
        }

        set({
          grid: createEmptyGrid(rows, cols),
          generation: 0,
          isRunning: false,
        });

        return true;
      },

      advanceGeneration: () => {
        const { grid, generation } = get();

        set({
          grid: nextGeneration(grid),
          generation: generation + 1,
        });
      },

      toggleCell: (row, col) => {
        const { grid, isRunning } = get();

        if (isRunning) return;

        set({
          grid: toggleGridCell(grid, row, col),
        });
      },

      toggleSimulation: () => {
        set((state) => ({
          isRunning: !state.isRunning,
        }));
      },

      saveDrawing: (name) => {
        const trimmedName = name.trim();

        if (!trimmedName || trimmedName.length > 40) {
          return false;
        }

        const { grid } = get();
        const drawing: SavedDrawing = {
          id: crypto.randomUUID(),
          name: trimmedName,
          rows: grid.length,
          cols: grid[0].length,
          grid: cloneGrid(grid),
        };

        set((state) => ({
          savedDrawings: [...state.savedDrawings, drawing],
        }));

        return true;
      },

      loadDrawing: (id) => {
        const drawing = get().savedDrawings.find((item) => item.id === id);

        if (!drawing) {
          return false;
        }

        set({
          grid: cloneGrid(drawing.grid),
          generation: 0,
          isRunning: false,
        });

        return true;
      },

      deleteDrawing: (id) => {
        set((state) => ({
          savedDrawings: state.savedDrawings.filter((item) => item.id !== id),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        savedDrawings: state.savedDrawings,
      }),
    },
  ),
);
