import { getDailyPuzzle } from '../lib/daily';
import KenkenGame from '../components/KenkenGame';

export default function Home() {
  const puzzle = getDailyPuzzle();

  return (
    <main className="game-shell page-fade">
      <header>
        <h1 className="game-title">Daily KenKen</h1>
      </header>
      <KenkenGame puzzle={puzzle} />
    </main>
  );
}