interface AddCategoryFormProps {
  disabled: boolean;
  value: string;
  onChange: (next: string) => void;
  onAdd: () => void;
  onCancel?: () => void;
}

export function AddCategoryForm(props: AddCategoryFormProps) {
  const { disabled, value, onChange, onAdd, onCancel } = props;

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
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="px-4 py-2 text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}

