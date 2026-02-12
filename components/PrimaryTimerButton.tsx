export function PrimaryTimerButton(props: { isTracking: boolean; onToggle: () => void }) {
  const { isTracking, onToggle } = props;

  return (
    <button
      onClick={onToggle}
      className={`w-full p-4 rounded-xl text-lg font-bold transition-all cursor-pointer ${
        isTracking ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isTracking ? "Parar" : "Arrancar"}
    </button>
  );
}

