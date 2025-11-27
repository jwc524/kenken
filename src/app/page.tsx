// src/app/page.tsx
import { getDailyPuzzle } from "../lib/daily";
import KenkenGame from "../components/KenkenGame";

export const dynamic = 'force-dynamic'; // 👈 force SSR on every request

export default function Home() {
  const puzzle = getDailyPuzzle();

  return (
    <main className="game-shell page-fade">
      <header>
        <h1 className="game-title">Daily Kenken</h1>
      </header>
      <KenkenGame puzzle={puzzle} />
    </main>
  );
}