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
  const [currentTask, setCurrentTask] = useState("");
  const [newCatInput, setNewCatInput] = useState("");
  const [tasksByCategory, setTasksByCategory] = useState<Record<string, string[]>>({});
  const [logs, setLogs] = useState<Log[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Tras el montaje (solo en cliente), cargar desde localStorage.
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem(STORAGE_KEYS.categories);
      if (savedCats) setCategories(JSON.parse(savedCats) as string[]);

      const savedTasks = localStorage.getItem(STORAGE_KEYS.tasksByCategory);
      if (savedTasks) setTasksByCategory(JSON.parse(savedTasks) as Record<string, string[]>);

      const savedLogs = localStorage.getItem(STORAGE_KEYS.logs);
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs) as (Log & { task?: string })[];
        const migrated = parsed.map((l) => ({
          ...l,
          task: l.task != null && l.task !== "" ? l.task : "Sin tarea",
        }));
        const needsSave = parsed.some((l) => l.task == null || l.task === "");
        setLogs(migrated);
        if (needsSave) localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(migrated));
      }

      const savedStart = localStorage.getItem(STORAGE_KEYS.start);
      const start = savedStart ? parseInt(savedStart, 10) : null;
      setStartTime(start);
      setIsTracking(start != null);

      if (start != null) {
        const cat = localStorage.getItem(STORAGE_KEYS.currentCat) || "";
        const task = localStorage.getItem(STORAGE_KEYS.currentTask) || "";
        setCurrentCategory(cat);
        setCurrentTask(task);
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

  const totalsByTask = useMemo(() => {
    const acc: Record<string, Record<string, number>> = {};
    for (const log of logs) {
      if (!acc[log.cat]) acc[log.cat] = {};
      acc[log.cat][log.task] = (acc[log.cat][log.task] || 0) + log.hrs;
    }
    return acc;
  }, [logs]);

  // --- Acciones ---
  const stopTracker = () => {
    setIsTracking(false);
    setStartTime(null);
    localStorage.removeItem(STORAGE_KEYS.start);
    localStorage.removeItem(STORAGE_KEYS.currentCat);
    localStorage.removeItem(STORAGE_KEYS.currentTask);
  };

  const saveEntry = (cat: string, task: string, hrs: number) => {
    const taskTrimmed = task.trim() || "Sin tarea";
    const newLog: Log = {
      id: Date.now(),
      cat,
      task: taskTrimmed,
      hrs: parseFloat(hrs.toFixed(2)),
      date: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(updatedLogs));

    if (taskTrimmed !== "Sin tarea") {
      const tasksForCat = tasksByCategory[cat] ?? [];
      if (!tasksForCat.includes(taskTrimmed)) {
        const updated = { ...tasksByCategory, [cat]: [...tasksForCat, taskTrimmed] };
        setTasksByCategory(updated);
        localStorage.setItem(STORAGE_KEYS.tasksByCategory, JSON.stringify(updated));
      }
    }
  };

  const handleToggleTimer = () => {
    if (!isTracking) {
      const now = Date.now();
      const cat = currentCategory || categories[0];
      const task = currentTask.trim() || "Sin tarea";
      setStartTime(now);
      setIsTracking(true);
      setCurrentCategory(cat);
      setCurrentTask(task);
      localStorage.setItem(STORAGE_KEYS.start, now.toString());
      localStorage.setItem(STORAGE_KEYS.currentCat, cat);
      localStorage.setItem(STORAGE_KEYS.currentTask, task);
    } else {
      const diffHours = msToHours(elapsedTime);
      const task = currentTask.trim() || "Sin tarea";
      saveEntry(currentCategory, task, diffHours);
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

    const updatedTasks: Record<string, string[]> = {};
    for (const [cat, tasks] of Object.entries(tasksByCategory)) {
      updatedTasks[cat === oldName ? trimmed : cat] = tasks;
    }
    setCategories(updatedCats);
    setLogs(updatedLogs);
    setTasksByCategory(updatedTasks);
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(updatedCats));
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(updatedLogs));
    localStorage.setItem(STORAGE_KEYS.tasksByCategory, JSON.stringify(updatedTasks));
  };

  return {
    categories,
    setCategories,
    currentCategory,
    setCurrentCategory,
    currentTask,
    setCurrentTask,
    tasksByCategory,
    newCatInput,
    setNewCatInput,
    logs,
    setLogs,
    isTracking,
    startTime,
    elapsedTime,
    totals,
    totalsByTask,
    handleToggleTimer,
    stopTracker,
    addCategory,
    deleteEntry,
    editCategoryName,
  } as const;
}

