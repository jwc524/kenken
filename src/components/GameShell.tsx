// src/components/GameShell.tsx
'use client';

import { useState } from 'react';
import type { Puzzle } from '../types/puzzle';
import { generatePuzzle } from '../lib/generator';
import KenkenGame from './KenkenGame';

type Props = {
  initialPuzzle: Puzzle;
};

const AVAILABLE_SIZES = [4, 5, 6];

export default function GameShell({ initialPuzzle }: Props) {
  const [gridSize, setGridSize] = useState<number>(initialPuzzle.size);
  const [puzzle, setPuzzle] = useState<Puzzle>(initialPuzzle);

  const handleChangeSize = (size: number) => {
    setGridSize(size);
    setPuzzle(generatePuzzle(size));
  };

  const handleNewPuzzle = () => {
    setPuzzle(generatePuzzle(gridSize));
  };

  return (
    <main className="game-shell page-fade">
      <header className="top-header">
        <div className="top-header-left">
          <h1 className="game-title">Kenken-ish</h1>
          <p className="game-subtitle">A tiny daily-ish number puzzle</p>
        </div>

        <div className="top-header-right">
          <div className="size-toggle">
            {AVAILABLE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className={
                  size === gridSize
                    ? 'size-toggle-button size-toggle-button-active'
                    : 'size-toggle-button'
                }
                onClick={() => handleChangeSize(size)}
              >
                {size}×{size}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="game-button new-puzzle-button"
            onClick={handleNewPuzzle}
          >
            New puzzle
          </button>
        </div>
      </header>

      {/* Key on puzzle.id so KenkenGame fully resets when we change puzzles */}
      <KenkenGame key={puzzle.id} puzzle={puzzle} />
    </main>
  );
}