"use client";

import { AddCategoryForm } from "@/components/AddCategoryForm";
import { CategorySelect } from "@/components/CategorySelect";
import { PrimaryTimerButton } from "@/components/PrimaryTimerButton";
import { RecentLogs } from "@/components/RecentLogs";
import { TimerDisplay } from "@/components/TimerDisplay";
import { TotalsSummary } from "@/components/TotalsSummary";
import { useHubTracker } from "@/hooks/useHubTracker";
import { formatTime } from "@/lib/time";

export default function HubTracker() {
  const {
    categories,
    currentCategory,
    setCurrentCategory,
    newCatInput,
    setNewCatInput,
    logs,
    isTracking,
    elapsedTime,
    totals,
    handleToggleTimer,
    addCategory,
    deleteEntry,
    editCategoryName,
  } = useHubTracker();

  const selectValue = currentCategory || (categories.length > 0 ? categories[0] : "");

  return (
    <main className="min-h-screen bg-[#f8fafc] p-5 flex justify-center items-start">
      <div className="w-full max-w-md bg-white p-8 rounded-[20px] shadow-sm border border-slate-100">
        
        {/* Timer Display */}
        <TimerDisplay timeText={formatTime(elapsedTime)} />

        {/* Formulario */}
        <div className="space-y-4 mb-6">
          <CategorySelect
            disabled={isTracking}
            value={selectValue}
            categories={categories}
            onChange={setCurrentCategory}
          />

          <AddCategoryForm
            disabled={isTracking}
            value={newCatInput}
            onChange={setNewCatInput}
            onAdd={addCategory}
          />
        </div>

        {/* Botón Principal */}
        <PrimaryTimerButton isTracking={isTracking} onToggle={handleToggleTimer} />

        {/* Resumen Acumulado */}
        <TotalsSummary totals={totals} onEditCategoryName={editCategoryName} />

{/* Historial */}
        <RecentLogs logs={logs} onDelete={deleteEntry} />

      </div>
    </main>
  );
}