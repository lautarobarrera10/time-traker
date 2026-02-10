"use client";

import React, { useState, useEffect, useRef } from 'react';

// Tipos para TypeScript
interface Log {
  id: number;
  cat: string;
  hrs: number;
  date: string;
}

export default function HubTracker() {
  // --- Estado ---
  const [categories, setCategories] = useState<string[]>(["Trabajo"]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [newCatInput, setNewCatInput] = useState("");
  const [logs, setLogs] = useState<Log[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Refs para el timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Carga Inicial ---
  useEffect(() => {
    const savedCats = localStorage.getItem('hubCategories');
    const savedLogs = localStorage.getItem('hubLogs');
    const savedStart = localStorage.getItem('hubStart');

    if (savedCats) setCategories(JSON.parse(savedCats));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    
    if (savedStart) {
      const start = parseInt(savedStart);
      setStartTime(start);
      setIsTracking(true);
      setCurrentCategory(localStorage.getItem('hubCurrentCat') || "");
    }
  }, []);

  // --- Lógica del Cronómetro (Auto-corregido) ---
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
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTracking, startTime]);

  // --- Acciones ---
  const handleToggleTimer = () => {
    if (!isTracking) {
      const now = Date.now();
      const cat = currentCategory || categories[0];
      setStartTime(now);
      setIsTracking(true);
      setCurrentCategory(cat);
      localStorage.setItem('hubStart', now.toString());
      localStorage.setItem('hubCurrentCat', cat);
    } else {
      const diffHours = (elapsedTime / 3600000);
      saveEntry(currentCategory, diffHours);
      stopTracker();
    }
  };

  const stopTracker = () => {
    setIsTracking(false);
    setStartTime(null);
    localStorage.removeItem('hubStart');
    localStorage.removeItem('hubCurrentCat');
  };

  const saveEntry = (cat: string, hrs: number) => {
    const newLog: Log = {
      id: Date.now(),
      cat,
      hrs: parseFloat(hrs.toFixed(2)),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('hubLogs', JSON.stringify(updatedLogs));
  };

  const addCategory = () => {
    if (!newCatInput.trim()) return;
    if (!categories.includes(newCatInput)) {
      const updated = [...categories, newCatInput];
      setCategories(updated);
      localStorage.setItem('hubCategories', JSON.stringify(updated));
    }
    setNewCatInput("");
  };

  const deleteEntry = (id: number) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem('hubLogs', JSON.stringify(updated));
  };

  const editCategoryName = (oldName: string) => {
    const newName = prompt(`Cambiar nombre de "${oldName}" a:`, oldName);
    if (!newName || newName.trim() === "" || newName === oldName) return;

    const updatedCats = categories.map(c => c === oldName ? newName.trim() : c);
    const updatedLogs = logs.map(l => l.cat === oldName ? { ...l, cat: newName.trim() } : l);

    setCategories(updatedCats);
    setLogs(updatedLogs);
    localStorage.setItem('hubCategories', JSON.stringify(updatedCats));
    localStorage.setItem('hubLogs', JSON.stringify(updatedLogs));
  };

  // --- Helpers de Formateo ---
  const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const totals = logs.reduce((acc: Record<string, number>, curr) => {
    acc[curr.cat] = (acc[curr.cat] || 0) + curr.hrs;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#f8fafc] p-5 flex justify-center items-start">
      <div className="w-full max-w-md bg-white p-8 rounded-[20px] shadow-sm border border-slate-100">
        
        {/* Timer Display */}
        <div className="text-[3.5rem] font-extrabold text-center my-4 tracking-tighter tabular-nums text-slate-900">
          {formatTime(elapsedTime)}
        </div>

        {/* Formulario */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[0.7rem] font-bold uppercase text-slate-500 mb-1 block">Categoría Actual</label>
            <select 
              disabled={isTracking}
              value={currentCategory || (categories.length > 0 ? categories[0] : "")}
              onChange={(e) => setCurrentCategory(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm text-black outline-none bg-white disabled:bg-slate-50 cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nueva categoría..."
              disabled={isTracking}
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-slate-200 text-sm text-black outline-none"
            />
            <button 
              onClick={addCategory}
              disabled={isTracking}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Añadir
            </button>
          </div>
        </div>

        {/* Botón Principal */}
        <button 
          onClick={handleToggleTimer}
          className={`w-full p-4 rounded-xl text-lg font-bold transition-all cursor-pointer ${
            isTracking ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isTracking ? 'Parar' : 'Arrancar'}
        </button>

        {/* Resumen Acumulado */}
{/* Resumen Acumulado */}
<div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
  <label className="text-[0.7rem] font-bold uppercase text-slate-500 mb-2 block">
    Acumulado (✎ para editar)
  </label>
  {Object.entries(totals).length > 0 ? (
    Object.entries(totals).map(([cat, sum]) => (
      <div key={cat} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0 text-sm">
        <span className="font-semibold text-slate-800 flex items-center">
          {cat}
          <button 
            onClick={() => editCategoryName(cat)} 
            className="ml-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            title="Editar nombre"
          >
            ✎
          </button>
        </span>
        <span className="font-bold text-slate-900 bg-white px-2 py-1 rounded-md shadow-sm">
          {sum.toFixed(2)} hs
        </span>
      </div>
    ))
  ) : (
    <div className="text-xs text-slate-400 italic">Sin datos registrados</div>
  )}
</div>

{/* Historial */}
<div className="mt-8">
  <label className="text-[0.7rem] font-bold uppercase text-slate-500 mb-2 block">
    Registros recientes
  </label>
  <div className="divide-y divide-slate-200">
    {logs.map(log => (
      <div key={log.id} className="flex justify-between items-center py-4">
        <div className="flex flex-col">
          {/* Nombre de categoría en gris oscuro/negro */}
          <span className="text-sm font-bold text-slate-900">{log.cat}</span>
          <span className="text-[0.7rem] font-medium text-slate-500">{log.date}</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Horas en azul fuerte para resaltar */}
          <span className="font-extrabold text-blue-700 text-sm">{log.hrs.toFixed(2)} hs</span>
          <button 
            onClick={() => deleteEntry(log.id)} 
            className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

      </div>
    </main>
  );
}