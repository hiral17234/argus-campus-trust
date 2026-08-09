import { useEffect, useState } from "react";

/** Shared countdown used by attendance windows and verification timers. */
export function useCountdown(initial: number) {
  const [left, setLeft] = useState(initial);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const m = Math.floor(left / 60)
    .toString()
    .padStart(2, "0");
  const s = (left % 60).toString().padStart(2, "0");

  return { left, label: `${m}:${s}`, percent: (left / initial) * 100, reset: () => setLeft(initial) };
}
