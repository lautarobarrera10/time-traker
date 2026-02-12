const OTHER_OPTION_VALUE = "__other__";

export function TaskSelect(props: {
  disabled: boolean;
  tasksForCategory: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  const { disabled, tasksForCategory, value, onChange } = props;
  const tasks = tasksForCategory ?? [];
  const isOther = value === "" || !tasks.includes(value);

  return (
    <div>
      <label className="text-[0.7rem] font-bold uppercase text-slate-500 mb-1 block">
        Tarea
      </label>
      {tasks.length > 0 ? (
        <>
          <select
            disabled={disabled}
            value={isOther ? OTHER_OPTION_VALUE : value || tasks[0]}
            onChange={(e) => {
              const v = e.target.value;
              if (v === OTHER_OPTION_VALUE) onChange("");
              else onChange(v);
            }}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm text-black outline-none bg-white disabled:bg-slate-50 cursor-pointer"
          >
            {tasks.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
            <option value={OTHER_OPTION_VALUE}>Otra...</option>
          </select>
          {isOther && (
            <input
              type="text"
              placeholder="Nombre de la tarea..."
              disabled={disabled}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2 w-full p-3 rounded-xl border border-slate-200 text-sm text-black outline-none"
              autoFocus
            />
          )}
        </>
      ) : (
        <input
          type="text"
          placeholder="Nombre de la tarea..."
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 text-sm text-black outline-none"
        />
      )}
    </div>
  );
}
