// src/app/page.tsx
import { getDailyPuzzle } from '../lib/daily';
import GameShell from '../components/GameShell';

export const dynamic = 'force-dynamic';

export default function Home() {
  const puzzle = getDailyPuzzle(); // still returns a 4×4 for now

  return <GameShell initialPuzzle={puzzle} />;
}