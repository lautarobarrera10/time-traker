import type { CategoryWithTasks } from "@/lib/types";

export function CategorySelect(props: {
  disabled: boolean;
  value: number | null;
  categories: CategoryWithTasks[];
  onChange: (id: number) => void;
}) {
  const { disabled, value, categories, onChange } = props;

  return (
    <div>
      <label className="text-[0.7rem] font-bold uppercase text-slate-500 mb-1 block">
        Categoría Actual
      </label>
      <select
        disabled={disabled}
        value={value ?? ""}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full p-3 rounded-xl border border-slate-200 text-sm text-black outline-none bg-white disabled:bg-slate-50 cursor-pointer"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
