// src/components/KenkenGame.tsx
'use client';

import { useEffect, useState } from 'react';
import type { Puzzle } from '../types/puzzle';
import KenkenGrid from './KenkenGrid';
import Timer from './Timer';
import { toast } from 'sonner';

type CellState = number | null;

type Props = {
  puzzle: Puzzle;
};

const makeEmptyGrid = (size: number): CellState[][] =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );

export default function KenkenGame({ puzzle }: Props) {
  const [grid, setGrid] = useState<CellState[][]>(() =>
    makeEmptyGrid(puzzle.size)
  );
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  // for forcing Timer to remount (reset its internal state)
  const [timerKey, setTimerKey] = useState(0);

  // for spinning the restart icon
  const [restartSpin, setRestartSpin] = useState(false);

  useEffect(() => {
    if (!restartSpin) return;
    const id = setTimeout(() => setRestartSpin(false), 400);
    return () => clearTimeout(id);
  }, [restartSpin]);

  const handleCellChange = (row: number, col: number, value: number | null) => {
    setGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = value;
      return next;
    });
    if (!started) setStarted(true);
  };

  const isSolved = () => {
    const n = puzzle.size;

    // rows
    for (let r = 0; r < n; r++) {
      const seen = new Set<number>();
      for (let c = 0; c < n; c++) {
        const v = grid[r][c];
        if (v == null) return false;
        seen.add(v);
      }
      if (seen.size !== n) return false;
    }

    // columns
    for (let c = 0; c < n; c++) {
      const seen = new Set<number>();
      for (let r = 0; r < n; r++) {
        const v = grid[r][c];
        if (v == null) return false;
        seen.add(v);
      }
      if (seen.size !== n) return false;
    }

    // cages
    for (const cage of puzzle.cages) {
      const values = cage.cells.map(cell => {
        const v = grid[cell.row][cell.col];
        return v ?? null;
      });

      if (values.some(v => v === null)) return false;
      const nums = values as number[];

      switch (cage.op) {
        case '+': {
          const sum = nums.reduce((a, b) => a + b, 0);
          if (sum !== cage.target) return false;
          break;
        }
        case '×': {
          const product = nums.reduce((a, b) => a * b, 1);
          if (product !== cage.target) return false;
          break;
        }
        case '-': {
          if (nums.length !== 2) return false;
          const [a, b] = nums;
          if (Math.abs(a - b) !== cage.target) return false;
          break;
        }
        case '÷': {
          if (nums.length !== 2) return false;
          const [a, b] = nums;
          const hi = Math.max(a, b);
          const lo = Math.min(a, b);
          const valid = hi % lo === 0 && hi / lo === cage.target;
          if (!valid) return false;
          break;
        }
        case null: {
          if (nums.length !== 1) return false;
          if (nums[0] !== cage.target) return false;
          break;
        }
        default:
          return false;
      }
    }

    return true;
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const ss = String(totalSeconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const handleCheck = () => {
    if (isSolved()) {
      if (!completed) {
        setCompleted(true);
        toast.success('Solved!', {
          description:
            elapsedMs != null
              ? `Time: ${formatTime(elapsedMs)}`
              : 'Nice work.',
        });
      }
    } else {
      toast.error('Not quite yet');
    }
  };

  const handleRestart = () => {
    setGrid(makeEmptyGrid(puzzle.size));
    setStarted(false);
    setCompleted(false);
    setElapsedMs(null);
    setTimerKey(k => k + 1);    // remount Timer -> resets to 00:00
    setRestartSpin(true);       // trigger spin animation
  };

  return (
    <div className="game-root">
      <div className="game-header-row">
        <h2 className="game-subtitle">Today&apos;s puzzle</h2>
        <Timer
          key={timerKey}
          running={started && !completed}
          stopTrigger={completed}
          onStop={ms => setElapsedMs(ms)}
        />
      </div>

      <KenkenGrid
        puzzle={puzzle}
        values={grid}
        onChange={handleCellChange}
        onSubmit={handleCheck}
      />

      <div className="game-footer">
        <div className="game-footer-left">
          <button
            type="button"
            className={`icon-button restart-button ${
              restartSpin ? 'restart-button-spinning' : ''
            }`}
            onClick={handleRestart}
            aria-label="Restart puzzle"
          >
            <span aria-hidden="true">↻</span>
          </button>
          <button type="button" className="game-button" onClick={handleCheck}>
            Check
          </button>
        </div>

        {completed && elapsedMs !== null && (
          <span className="game-result">
            Solved in {(elapsedMs / 1000).toFixed(1)}s 🎉
          </span>
        )}
      </div>
    </div>
  );
}