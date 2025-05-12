interface ActionButtonProps {
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'red';
  onClick: () => void;
  tooltip: string;
}

export function ActionButton({ icon, color, onClick, tooltip }: ActionButtonProps) {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-400/50 dark:hover:shadow-blue-400/30",
    amber: "bg-amber-500 hover:bg-amber-600 hover:shadow-amber-400/50 dark:hover:shadow-amber-400/30",
    red: "bg-red-500 hover:bg-red-600 hover:shadow-red-400/50 dark:hover:shadow-red-400/30",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center text-white p-1.5 rounded-md text-xs shadow-sm
        transition-all duration-200 hover:shadow-md ${colorClasses[color]} group relative`}
      aria-label={tooltip}
    >
      {icon}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded
             opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {tooltip}
      </span>
    </button>
  );
}