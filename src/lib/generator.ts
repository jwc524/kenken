import type { Puzzle, Cage, Operation } from "../types/puzzle";

/**
 * Utility: random int in [min, max] inclusive
 */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Utility: shuffle array in-place
 */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Step 1: build a Latin square of given size
 * Start with a simple cyclic square, then randomly permute rows, cols, and symbols.
 */
function makeLatinSquare(size: number): number[][] {
  const base: number[][] = [];
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      row.push(((r + c) % size) + 1);
    }
    base.push(row);
  }

  // permute rows
  const rowOrder = shuffle([...Array(size).keys()]);
  const colOrder = shuffle([...Array(size).keys()]);
  const symbolOrder = shuffle([...Array(size).keys()]); // mapping 1..size

  const permuted: number[][] = [];
  for (let r = 0; r < size; r++) {
    const sourceRow = base[rowOrder[r]];
    const newRow: number[] = [];
    for (let c = 0; c < size; c++) {
      const val = sourceRow[colOrder[c]];
      const mapped = symbolOrder[val - 1] + 1;
      newRow.push(mapped);
    }
    permuted.push(newRow);
  }

  return permuted;
}

/**
 * Step 2: carve the grid into contiguous cages of random size.
 * Medium-ish difficulty: cage sizes from 1–4, mostly 2–3.
 */
function carveCagesFromSolution(solution: number[][]): Cage[] {
  const size = solution.length;
  const assigned: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  const cages: Cage[] = [];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const inBounds = (r: number, c: number) =>
    r >= 0 && r < size && c >= 0 && c < size;

  let nextIdCharCode = "A".charCodeAt(0);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (assigned[r][c]) continue;

      const cells: { row: number; col: number }[] = [{ row: r, col: c }];
      assigned[r][c] = true;

      // decide desired cage size (1–4, but biased toward 2–3)
      const maxCageSize = Math.min(4, size * size); // clamp
      const randomSizeRoll = Math.random();
      let targetSize = 1;
      if (randomSizeRoll < 0.15) targetSize = 1;
      else if (randomSizeRoll < 0.7) targetSize = 2;
      else if (randomSizeRoll < 0.95) targetSize = 3;
      else targetSize = 4;

      targetSize = Math.min(
        targetSize,
        maxCageSize,
        size * size // safety
      );

      // grow cage by adding neighboring unassigned cells
      while (cells.length < targetSize) {
        const frontier: { row: number; col: number }[] = [];
        for (const cell of cells) {
          for (const [dr, dc] of dirs) {
            const nr = cell.row + dr;
            const nc = cell.col + dc;
            if (inBounds(nr, nc) && !assigned[nr][nc]) {
              frontier.push({ row: nr, col: nc });
            }
          }
        }
        if (frontier.length === 0) break;
        const choice = frontier[randInt(0, frontier.length - 1)];
        if (!assigned[choice.row][choice.col]) {
          cells.push(choice);
          assigned[choice.row][choice.col] = true;
        }
      }

      const values = cells.map((cell) => solution[cell.row][cell.col]);
      const { op, target } = chooseOperationAndTarget(values);

      const id = String.fromCharCode(nextIdCharCode);
      nextIdCharCode++;
      cages.push({
        id,
        target,
        op,
        cells,
      });
    }
  }

  return cages;
}

/**
 * Step 3: choose operation & target for a cage, NYT-ish style.
 */
function chooseOperationAndTarget(values: number[]): {
  op: Operation;
  target: number;
} {
  if (values.length === 1) {
    return { op: null, target: values[0] };
  }

  const nums = [...values];
  const sum = nums.reduce((a, b) => a + b, 0);
  const product = nums.reduce((a, b) => a * b, 1);

  const candidates: Operation[] = ["+", "×"];

  if (nums.length === 2) {
    const [a, b] = nums;
    const diff = Math.abs(a - b);
    const hi = Math.max(a, b);
    const lo = Math.min(a, b);
    if (diff > 0) {
      candidates.push("-");
    }
    if (hi % lo === 0 && hi / lo > 1) {
      candidates.push("÷");
    }
  }

  const op = candidates[randInt(0, candidates.length - 1)];

  switch (op) {
    case "+":
      return { op, target: sum };
    case "×":
      return { op, target: product };
    case "-": {
      const [a, b] = nums;
      return { op, target: Math.abs(a - b) };
    }
    case "÷": {
      const [a, b] = nums;
      const hi = Math.max(a, b);
      const lo = Math.min(a, b);
      return { op, target: hi / lo };
    }
    case null:
    default:
      return { op: null, target: nums[0] };
  }
}

/**
 * Public API: generate a KenKen-style puzzle.
 * For now: size 4, medium difficulty. Scales by changing `size`.
 */
export function generatePuzzle(size: number = 4): Puzzle {
  const solution = makeLatinSquare(size);
  const cages = carveCagesFromSolution(solution);

  return {
    id: `rand-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    size,
    cages,
    solution,
  };
}