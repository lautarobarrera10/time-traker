"use client";

import { useState } from "react";
import { AddCategoryForm } from "@/components/AddCategoryForm";
import { AddTaskForm } from "@/components/AddTaskForm";
import { CategorySelect } from "@/components/CategorySelect";
import { PrimaryTimerButton } from "@/components/PrimaryTimerButton";
import { RecentLogs } from "@/components/RecentLogs";
import { TaskSelect } from "@/components/TaskSelect";
import { TimerDisplay } from "@/components/TimerDisplay";
import { TotalsSummary } from "@/components/TotalsSummary";
import { useHubTracker } from "@/hooks/useHubTracker";
import { formatTime } from "@/lib/time";

export default function HubTracker() {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const {
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
  } = useHubTracker();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] p-5 flex justify-center items-center">
        <p className="text-slate-500">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] p-5 flex justify-center items-start">
      <div className="w-full max-w-md bg-white p-8 rounded-[20px] shadow-sm border border-slate-100">

        {/* Timer Display */}
        <TimerDisplay timeText={formatTime(elapsedTime)} />

        {/* Formulario */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <CategorySelect
                disabled={isTracking}
                value={currentCategoryId}
                categories={categories}
                onChange={handleCategoryChange}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAddCategory(true)}
              disabled={isTracking}
              className="shrink-0 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Categoría
            </button>
          </div>

          {showAddCategory && (
            <AddCategoryForm
              disabled={isTracking}
              value={newCatInput}
              onChange={setNewCatInput}
              onAdd={() => {
                addCategory();
                setShowAddCategory(false);
              }}
              onCancel={() => {
                setShowAddCategory(false);
                setNewCatInput("");
              }}
            />
          )}

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <TaskSelect
                disabled={isTracking}
                tasksForCategory={tasksForCategory}
                value={currentTaskId}
                onChange={setCurrentTaskId}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAddTask(true)}
              disabled={isTracking || !currentCategoryId}
              className="shrink-0 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Tarea
            </button>
          </div>

          {showAddTask && (
            <AddTaskForm
              disabled={isTracking}
              value={newTaskInput}
              onChange={setNewTaskInput}
              onAdd={() => {
                addTask();
                setShowAddTask(false);
              }}
              onCancel={() => {
                setShowAddTask(false);
                setNewTaskInput("");
              }}
            />
          )}
        </div>

        {/* Botón Principal */}
        <PrimaryTimerButton isTracking={isTracking} onToggle={handleToggleTimer} />

        {/* Resumen Acumulado */}
        <TotalsSummary totals={totals} totalsByTask={totalsByTask} onEditCategoryName={editCategoryName} />

        {/* Historial */}
        <RecentLogs logs={logs} onDelete={deleteEntry} />

      </div>
    </main>
  );
}
