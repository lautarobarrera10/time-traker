import type { TaskItem } from "@/lib/types";

export function TaskSelect(props: {
  disabled: boolean;
  tasksForCategory: TaskItem[];
  value: number | null;
  onChange: (id: number) => void;
}) {
  const { disabled, tasksForCategory, value, onChange } = props;
  const tasks = tasksForCategory ?? [];
  const displayValue = tasks.length > 0 ? (value ?? tasks[0].id) : "";

  return (
    <div>
      <label className="text-[0.7rem] font-bold uppercase text-slate-500 mb-1 block">
        Tarea
      </label>
      <select
        disabled={disabled}
        value={displayValue}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full p-3 rounded-xl border border-slate-200 text-sm text-black outline-none bg-white disabled:bg-slate-50 cursor-pointer"
      >
        {tasks.length > 0 ? (
          tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))
        ) : (
          <option value="">Sin tarea</option>
        )}
      </select>
    </div>
  );
}
