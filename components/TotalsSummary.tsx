export function TotalsSummary(props: {
  totals: Record<string, number>;
  totalsByTask: Record<string, Record<string, number>>;
  onEditCategoryName: (cat: string) => void;
}) {
  const { totals, totalsByTask, onEditCategoryName } = props;

  return (
    <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <label className="text-[0.7rem] font-bold uppercase text-slate-500 mb-2 block">
        Acumulado (✎ para editar)
      </label>
      {Object.entries(totals).length > 0 ? (
        Object.entries(totals).map(([cat, sum]) => {
          const taskBreakdown = totalsByTask[cat] ?? {};
          const taskEntries = Object.entries(taskBreakdown).filter(([, hrs]) => hrs > 0);
          return (
            <div
              key={cat}
              className="py-2 border-b border-slate-200 last:border-0 text-sm"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-800 flex items-center">
                  {cat}
                  <button
                    onClick={() => onEditCategoryName(cat)}
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
              {taskEntries.length > 0 && (
                <div className="ml-3 mt-1 space-y-0.5">
                  {taskEntries.map(([task, hrs]) => (
                    <div
                      key={task}
                      className="flex justify-between items-center text-xs text-slate-600"
                    >
                      <span>{task}</span>
                      <span>{hrs.toFixed(2)} hs</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-xs text-slate-400 italic">Sin datos registrados</div>
      )}
    </div>
  );
}

