'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  running: boolean;
  stopTrigger: boolean;
  onStop: (elapsedMs: number) => void;
};

export default function Timer({ running, stopTrigger, onStop }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (stopTrigger && !stoppedRef.current) {
      stoppedRef.current = true;
      onStop(elapsed);
    }
  }, [stopTrigger, elapsed, onStop]);

  useEffect(() => {
    if (!running) return;

    startRef.current = performance.now() - elapsed;
    let frameId: number;

    const tick = () => {
      if (startRef.current == null) return;
      const now = performance.now();
      setElapsed(now - startRef.current);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [running]);

  const totalSeconds = Math.floor(elapsed / 1000);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');

  return <span className="timer">{mm}:{ss}</span>;
}