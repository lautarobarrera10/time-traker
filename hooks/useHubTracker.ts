import { useEffect, useMemo, useState } from "react";
import type { Log } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { msToHours } from "@/lib/time";
import { useAlignedTimer } from "@/hooks/useAlignedTimer";

const DEFAULT_CATEGORIES = ["Trabajo"];

export function useHubTracker() {
  // Estado inicial fijo: igual en servidor y en el primer render del cliente (evita hydration mismatch).
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [currentCategory, setCurrentCategory] = useState("");
  const [newCatInput, setNewCatInput] = useState("");
  const [logs, setLogs] = useState<Log[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Tras el montaje (solo en cliente), cargar desde localStorage.
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem(STORAGE_KEYS.categories);
      if (savedCats) setCategories(JSON.parse(savedCats) as string[]);

      const savedLogs = localStorage.getItem(STORAGE_KEYS.logs);
      if (savedLogs) setLogs(JSON.parse(savedLogs) as Log[]);

      const savedStart = localStorage.getItem(STORAGE_KEYS.start);
      const start = savedStart ? parseInt(savedStart, 10) : null;
      setStartTime(start);
      setIsTracking(start != null);

      if (start != null) {
        const cat = localStorage.getItem(STORAGE_KEYS.currentCat) || "";
        setCurrentCategory(cat);
      }
    } catch {
      // ignore
    }
  }, []);

  const { elapsedTime } = useAlignedTimer({ isTracking, startTime });

  const totals = useMemo(() => {
    return logs.reduce((acc: Record<string, number>, curr) => {
      acc[curr.cat] = (acc[curr.cat] || 0) + curr.hrs;
      return acc;
    }, {});
  }, [logs]);

  // --- Acciones ---
  const stopTracker = () => {
    setIsTracking(false);
    setStartTime(null);
    localStorage.removeItem(STORAGE_KEYS.start);
    localStorage.removeItem(STORAGE_KEYS.currentCat);
  };

  const saveEntry = (cat: string, hrs: number) => {
    const newLog: Log = {
      id: Date.now(),
      cat,
      hrs: parseFloat(hrs.toFixed(2)),
      date: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(updatedLogs));
  };

  const handleToggleTimer = () => {
    if (!isTracking) {
      const now = Date.now();
      const cat = currentCategory || categories[0];
      setStartTime(now);
      setIsTracking(true);
      setCurrentCategory(cat);
      localStorage.setItem(STORAGE_KEYS.start, now.toString());
      localStorage.setItem(STORAGE_KEYS.currentCat, cat);
    } else {
      const diffHours = msToHours(elapsedTime);
      saveEntry(currentCategory, diffHours);
      stopTracker();
    }
  };

  const addCategory = () => {
    if (!newCatInput.trim()) return;
    if (!categories.includes(newCatInput)) {
      const updated = [...categories, newCatInput];
      setCategories(updated);
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(updated));
    }
    setNewCatInput("");
  };

  const deleteEntry = (id: number) => {
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(updated));
  };

  const editCategoryName = (oldName: string) => {
    const newName = prompt(`Cambiar nombre de "${oldName}" a:`, oldName);
    if (!newName || newName.trim() === "" || newName === oldName) return;

    const trimmed = newName.trim();
    const updatedCats = categories.map((c) => (c === oldName ? trimmed : c));
    const updatedLogs = logs.map((l) => (l.cat === oldName ? { ...l, cat: trimmed } : l));

    setCategories(updatedCats);
    setLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(updatedCats));
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(updatedLogs));
  };

  return {
    categories,
    setCategories,
    currentCategory,
    setCurrentCategory,
    newCatInput,
    setNewCatInput,
    logs,
    setLogs,
    isTracking,
    startTime,
    elapsedTime,
    totals,
    handleToggleTimer,
    stopTracker,
    addCategory,
    deleteEntry,
    editCategoryName,
  } as const;
}

