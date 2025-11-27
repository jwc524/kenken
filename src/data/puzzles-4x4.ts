// src/data/puzzles-4x4.ts
import type { Puzzle } from '../types/puzzle';

export const puzzles4x4: Puzzle[] = [
  {
    id: '4x4-001',
    size: 4,
    // Solution:
    // 1 2 3 4
    // 3 4 1 2
    // 4 3 2 1
    // 2 1 4 3
    solution: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [4, 3, 2, 1],
      [2, 1, 4, 3],
    ],
    cages: [
      {
        id: 'A',
        target: 3,
        op: '+',
        cells: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
        ],
      },
      {
        id: 'B',
        target: 9,
        op: '+',
        cells: [
          { row: 0, col: 2 },
          { row: 0, col: 3 },
          { row: 1, col: 3 },
        ],
      },
      {
        id: 'C',
        target: 12,
        op: '×',
        cells: [
          { row: 1, col: 0 },
          { row: 2, col: 0 },
        ],
      },
      {
        id: 'D',
        target: 3,
        op: '-',
        cells: [
          { row: 1, col: 1 },
          { row: 1, col: 2 },
        ],
      },
      {
        id: 'E',
        target: 6,
        op: '+',
        cells: [
          { row: 2, col: 1 },
          { row: 2, col: 2 },
          { row: 2, col: 3 },
        ],
      },
      {
        id: 'F',
        target: 10,
        op: '+',
        cells: [
          { row: 3, col: 0 },
          { row: 3, col: 1 },
          { row: 3, col: 2 },
          { row: 3, col: 3 },
        ],
      },
    ],
  },
];