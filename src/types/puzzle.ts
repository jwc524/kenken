// src/types/puzzle.ts
export type Operation = '+' | '-' | '×' | '÷' | null; // null = single-cell cage

export type Cage = {
  id: string;
  target: number;
  op: Operation;
  cells: { row: number; col: number }[];
};

export type Puzzle = {
  id: string;          // e.g. "4x4-001"
  size: number;        // e.g. 4
  cages: Cage[];
  solution: number[][]; // size x size
};