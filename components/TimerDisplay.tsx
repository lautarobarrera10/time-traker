export function TimerDisplay(props: { timeText: string }) {
  return (
    <div className="text-[3.5rem] font-extrabold text-center my-4 tracking-tighter tabular-nums text-slate-900">
      {props.timeText}
    </div>
  );
}

