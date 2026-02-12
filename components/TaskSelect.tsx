export function TaskSelect(props: {
  disabled: boolean;
  tasksForCategory: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  const { disabled, tasksForCategory, value, onChange } = props;
  const tasks = tasksForCategory ?? [];
  const displayValue = tasks.length > 0 ? (value || tasks[0]) : "";

  return (
    <div>
      <label className="text-[0.7rem] font-bold uppercase text-slate-500 mb-1 block">
        Tarea
      </label>
      <select
        disabled={disabled}
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-200 text-sm text-black outline-none bg-white disabled:bg-slate-50 cursor-pointer"
      >
        {tasks.length > 0 ? (
          tasks.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))
        ) : (
          <option value="">Sin tarea</option>
        )}
      </select>
    </div>
  );
}
