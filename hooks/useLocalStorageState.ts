import { useEffect, useState } from "react";

type SetStateAction<T> = T | ((prev: T) => T);

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore corrupted JSON / access issues
    } finally {
      setHasLoaded(true);
    }
  }, [key]);

  const setAndStore = (next: SetStateAction<T>) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // ignore quota / access issues
      }
      return resolved;
    });
  };

  return { value, setValue: setAndStore, hasLoaded } as const;
}

