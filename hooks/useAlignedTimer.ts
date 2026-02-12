import { useEffect, useRef, useState } from "react";

export function useAlignedTimer(params: { isTracking: boolean; startTime: number | null }) {
  const { isTracking, startTime } = params;
  const [elapsedTime, setElapsedTime] = useState(() =>
    isTracking && startTime ? Date.now() - startTime : 0,
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isTracking && startTime) {
      const tick = () => {
        const now = Date.now();
        const diff = now - startTime;
        setElapsedTime(diff);

        const nextTick = 1000 - (diff % 1000);
        timerRef.current = setTimeout(tick, nextTick);
      };

      tick();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTracking, startTime]);

  return { elapsedTime } as const;
}

