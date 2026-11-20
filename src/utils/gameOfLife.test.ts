import { describe, expect, it } from "vitest";

import { createEmptyGrid, nextGeneration } from "./gameOfLife";

describe("nextGeneration", () => {
  it("fait disparaître une cellule isolée", () => {
    const grid = createEmptyGrid(3, 3);
    grid[1][1] = true;

    expect(nextGeneration(grid)).toEqual(createEmptyGrid(3, 3));
  });

  it("fait mourir le centre d'un bloc 3 × 3 par surpopulation", () => {
    const grid = Array.from({ length: 3 }, () => Array(3).fill(true));

    expect(nextGeneration(grid)[1][1]).toBe(false);
  });

  it("conserve un carré 2 × 2 stable", () => {
    const grid = createEmptyGrid(4, 4);
    grid[1][1] = true;
    grid[1][2] = true;
    grid[2][1] = true;
    grid[2][2] = true;

    expect(nextGeneration(grid)).toEqual(grid);
  });

  it("fait osciller trois cellules alignées", () => {
    const vertical = createEmptyGrid(5, 5);
    vertical[1][2] = true;
    vertical[2][2] = true;
    vertical[3][2] = true;

    const horizontal = createEmptyGrid(5, 5);
    horizontal[2][1] = true;
    horizontal[2][2] = true;
    horizontal[2][3] = true;

    expect(nextGeneration(vertical)).toEqual(horizontal);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
});
