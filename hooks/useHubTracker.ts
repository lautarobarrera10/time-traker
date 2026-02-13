import { useCallback, useEffect, useMemo, useState } from "react";
import type { CategoryWithTasks, TimeLogEntry } from "@/lib/types";
import { msToHours } from "@/lib/time";
import { useAlignedTimer } from "@/hooks/useAlignedTimer";

export function useHubTracker() {
  const [categories, setCategories] = useState<CategoryWithTasks[]>([]);
  const [logs, setLogs] = useState<TimeLogEntry[]>([]);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [newCatInput, setNewCatInput] = useState("");
  const [newTaskInput, setNewTaskInput] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { elapsedTime } = useAlignedTimer({ isTracking, startTime });

  // Cargar datos iniciales desde la API
  const fetchData = useCallback(async () => {
    try {
      const [catsRes, logsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/logs"),
      ]);
      if (catsRes.ok) {
        const cats: CategoryWithTasks[] = await catsRes.json();
        setCategories(cats);
        if (cats.length > 0 && currentCategoryId == null) {
          setCurrentCategoryId(cats[0].id);
          if (cats[0].tasks.length > 0) setCurrentTaskId(cats[0].tasks[0].id);
        }
      }
      if (logsRes.ok) {
        setLogs(await logsRes.json());
      }
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentCategory = categories.find((c) => c.id === currentCategoryId) ?? null;
  const tasksForCategory = currentCategory?.tasks ?? [];

  // Totales calculados
  const totals = useMemo(() => {
    return logs.reduce((acc: Record<string, number>, log) => {
      const cat = log.category.name;
      acc[cat] = (acc[cat] || 0) + log.hours;
      return acc;
    }, {});
  }, [logs]);

  const totalsByTask = useMemo(() => {
    const acc: Record<string, Record<string, number>> = {};
    for (const log of logs) {
      const cat = log.category.name;
      const task = log.task.name;
      if (!acc[cat]) acc[cat] = {};
      acc[cat][task] = (acc[cat][task] || 0) + log.hours;
    }
    return acc;
  }, [logs]);

  // --- Acciones ---

  const handleCategoryChange = (catId: number) => {
    setCurrentCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    setCurrentTaskId(cat?.tasks[0]?.id ?? null);
  };

  const handleToggleTimer = async () => {
    if (!isTracking) {
      const catId = currentCategoryId ?? categories[0]?.id;
      const taskId = currentTaskId ?? currentCategory?.tasks[0]?.id;
      if (!catId || !taskId) return;
      setStartTime(Date.now());
      setIsTracking(true);
      setCurrentCategoryId(catId);
      setCurrentTaskId(taskId);
    } else {
      const hours = msToHours(elapsedTime);
      setIsTracking(false);
      setStartTime(null);

      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours, categoryId: currentCategoryId, taskId: currentTaskId }),
      });
      if (res.ok) {
        const newLog: TimeLogEntry = await res.json();
        setLogs((prev) => [newLog, ...prev]);
      }
    }
  };

  const addCategory = async () => {
    const name = newCatInput.trim();
    if (!name) return;

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const cat: CategoryWithTasks = await res.json();
      setCategories((prev) => [...prev, cat]);
      setCurrentCategoryId(cat.id);
      setCurrentTaskId(null);
    }
    setNewCatInput("");
  };

  const addTask = async () => {
    const name = newTaskInput.trim();
    if (!name || !currentCategoryId) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, categoryId: currentCategoryId }),
    });
    if (res.ok) {
      const task = await res.json();
      setCategories((prev) =>
        prev.map((c) =>
          c.id === currentCategoryId ? { ...c, tasks: [...c.tasks, task] } : c
        )
      );
      setCurrentTaskId(task.id);
    }
    setNewTaskInput("");
  };

  const deleteEntry = async (id: number) => {
    const res = await fetch(`/api/logs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLogs((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const editCategoryName = async (catName: string) => {
    const newName = prompt(`Cambiar nombre de "${catName}" a:`, catName);
    if (!newName || newName.trim() === "" || newName === catName) return;

    const cat = categories.find((c) => c.name === catName);
    if (!cat) return;

    const res = await fetch(`/api/categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (res.ok) {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, name: newName.trim() } : c))
      );
      // Actualizar nombres en logs locales
      setLogs((prev) =>
        prev.map((l) =>
          l.categoryId === cat.id ? { ...l, category: { name: newName.trim() } } : l
        )
      );
    }
  };

  return {
    categories,
    currentCategoryId,
    currentTaskId,
    tasksForCategory,
    newCatInput,
    setNewCatInput,
    newTaskInput,
    setNewTaskInput,
    logs,
    isTracking,
    startTime,
    elapsedTime,
    totals,
    totalsByTask,
    loading,
    handleCategoryChange,
    setCurrentTaskId,
    handleToggleTimer,
    addCategory,
    addTask,
    deleteEntry,
    editCategoryName,
  } as const;
}
