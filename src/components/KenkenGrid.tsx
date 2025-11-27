// src/components/KenkenGrid.tsx
"use client";

import { useState } from "react";
import type { Puzzle } from "../types/puzzle";

type Props = {
  puzzle: Puzzle;
  values: (number | null)[][];
  onChange: (row: number, col: number, value: number | null) => void;
  onSubmit: () => void;
};

type ActiveCell = { row: number; col: number } | null;

export default function KenkenGrid({
  puzzle,
  values,
  onChange,
  onSubmit,
}: Props) {
  const { size, cages } = puzzle;
  const [active, setActive] = useState<ActiveCell>(null);

  const cageByCell = new Map<string, (typeof cages)[number]>();
  cages.forEach((cage) => {
    cage.cells.forEach((cell) => {
      cageByCell.set(`${cell.row},${cell.col}`, cage);
    });
  });

  const isTopLeftOfCage = (row: number, col: number) => {
    const cage = cageByCell.get(`${row},${col}`);
    if (!cage) return false;
    return cage.cells.every(
      (cell) => !(cell.row < row || (cell.row === row && cell.col < col))
    );
  };

  const handleInput = (
    row: number,
    col: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      onChange(row, col, null);
      return;
    }

    const val = Number(raw.slice(-1)); // last typed digit
    if (val >= 1 && val <= size) onChange(row, col, val);
  };

  const handleFocus = (row: number, col: number) =>
    setActive({ row, col });

  const handleBlur = (row: number, col: number) =>
    setActive((prev) =>
      prev && prev.row === row && prev.col === col ? null : prev
    );

  const handleMouseDown = (
    row: number,
    col: number,
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    if (active && active.row === row && active.col === col) {
      e.preventDefault();
      (e.currentTarget as HTMLInputElement).blur();
      setActive(null);
    }
  };

  const focusCell = (row: number, col: number) => {
    const el = document.querySelector<HTMLInputElement>(
      `input[data-cell="${row}-${col}"]`
    );
    if (el) el.focus();
  };

  const handleKeyDown = (
    row: number,
    col: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight": {
        e.preventDefault();
        let r = row;
        let c = col;
        if (e.key === "ArrowUp" && row > 0) r--;
        if (e.key === "ArrowDown" && row < size - 1) r++;
        if (e.key === "ArrowLeft" && col > 0) c--;
        if (e.key === "ArrowRight" && col < size - 1) c++;
        focusCell(r, c);
        return;
      }
      case "Enter": {
        e.preventDefault();
        onSubmit();
        return;
      }
    }
  };

  const sameCage = (r: number, c: number, cage: any) =>
    cageByCell.get(`${r},${c}`) === cage;

  return (
    <div
      className="kenken-grid"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
      }}
    >
      {Array.from({ length: size }).map((_, row) =>
        Array.from({ length: size }).map((_, col) => {
          const cage = cageByCell.get(`${row},${col}`);
          const showLabel = cage && isTopLeftOfCage(row, col);

          const top = row === 0 || !sameCage(row - 1, col, cage);
          const bottom = row === size - 1 || !sameCage(row + 1, col, cage);
          const left = col === 0 || !sameCage(row, col - 1, cage);
          const right = col === size - 1 || !sameCage(row, col + 1, cage);

          const isActive =
            active?.row === row && active?.col === col;

          const classes = [
            "kenken-cell",
            top && "kenken-border-top",
            bottom && "kenken-border-bottom",
            left && "kenken-border-left",
            right && "kenken-border-right",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={`${row},${col}`} className={classes}>
              {showLabel && (
                <div className="kenken-label">
                  {cage!.target}
                  {cage!.op}
                </div>
              )}

              {/* marching ants overlay */}
              <svg
                className={
                  isActive
                    ? "kenken-ants kenken-ants-active"
                    : "kenken-ants"
                }
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <rect
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  className="kenken-ants-rect"
                />
              </svg>

              <input
                className="kenken-input"
                value={values[row][col] ?? ""}
                onChange={(e) => handleInput(row, col, e)}
                onFocus={() => handleFocus(row, col)}
                onBlur={() => handleBlur(row, col)}
                onKeyDown={(e) => handleKeyDown(row, col, e)}
                onMouseDown={(e) => handleMouseDown(row, col, e)}
                inputMode="numeric"
                data-cell={`${row}-${col}`}
              />
            </div>
          );
        })
      )}
    </div>
  );
}