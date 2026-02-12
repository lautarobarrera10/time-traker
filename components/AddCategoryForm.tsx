export function AddCategoryForm(props: {
  disabled: boolean;
  value: string;
  onChange: (next: string) => void;
  onAdd: () => void;
}) {
  const { disabled, value, onChange, onAdd } = props;

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Nueva categoría..."
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-3 rounded-xl border border-slate-200 text-sm text-black outline-none"
      />
      <button
        onClick={onAdd}
        disabled={disabled}
        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
      >
        Añadir
      </button>
    </div>
  );
}

