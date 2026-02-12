import type { Log } from "@/lib/types";

export function RecentLogs(props: { logs: Log[]; onDelete: (id: number) => void }) {
  const { logs, onDelete } = props;

  return (
    <div className="mt-8">
      <label className="text-[0.7rem] font-bold uppercase text-slate-500 mb-2 block">Registros recientes</label>
      <div className="divide-y divide-slate-200">
        {logs.map((log) => (
          <div key={log.id} className="flex justify-between items-center py-4">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">{log.cat}</span>
              <span className="text-[0.7rem] font-medium text-slate-500">{log.date}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-extrabold text-blue-700 text-sm">{log.hrs.toFixed(2)} hs</span>
              <button
                onClick={() => onDelete(log.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

