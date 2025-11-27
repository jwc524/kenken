// src/lib/daily.ts
import type { Puzzle } from "../types/puzzle";
import { generatePuzzle } from "./generator";

export function getDailyPuzzle(): Puzzle {
  // 4x4 for now, but we can parameterize later (5x5, 6x6, etc.)
  return generatePuzzle(4);
}