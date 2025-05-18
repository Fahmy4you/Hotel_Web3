import { Tooltip } from "@heroui/react";

interface ActionButtonProps {
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'red';
  onClick: () => void;
  tooltip: string;
  className? : string
}

export function ActionButton({ icon, color, onClick, tooltip, className }: ActionButtonProps) {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-400/50 dark:hover:shadow-blue-400/30",
    amber: "bg-amber-500 hover:bg-amber-600 hover:shadow-amber-400/50 dark:hover:shadow-amber-400/30",
    red: "bg-red-500 hover:bg-red-600 hover:shadow-red-400/50 dark:hover:shadow-red-400/30",
  };

  return (
    <Tooltip placement="top" showArrow content={tooltip}>
    <button
      onClick={onClick}
      className={`${className} flex items-center justify-center text-white p-1.5 rounded-md text-xs shadow-sm
        transition-all duration-200 hover:shadow-md ${colorClasses[color]} group relative`}
      aria-label={tooltip}
    >
      {icon}
    </button>
    </Tooltip>
  );
}