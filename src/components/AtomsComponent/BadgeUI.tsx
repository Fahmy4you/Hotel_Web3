interface BadgeProps {
  variant?: "default" | "primary" | "error" | "success" | "warning";
  active?: boolean;
  size?: "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export default function BadgeUI({
  children,
  variant = "primary",
  active = true,
  size = "md",
  className
}: BadgeProps) {
  const darkModeStyles = {
    default: {
      bg: "bg-blue-500/20 dark:bg-blue-900/20",
      text: "text-blue-900 dark:text-blue-400",
      border: "border-blue-600 dark:border-blue-400",
      shadow: "shadow-[0_0_8px_rgba(96,165,250,0.5)]",
      dot: "bg-blue-800 dark:bg-blue-400"
    },
    primary: {
      bg: "bg-purple-600/20 dark:bg-purple-900/20",
      text: "dark:text-purple-400 text-purple-600",
      border: "dark:border-purple-400 border-purple-600",
      shadow: "dark:shadow-[0_0_8px_rgba(192,132,252,0.5)] shadow-[0_0_8px_rgba(192,132,252,0.8)]",
      dot: "dark:bg-purple-400 bg-purple-600"
    },
    error: {
      bg: "bg-red-900/20",
      text: "text-red-400",
      border: "border-red-400",
      shadow: "shadow-[0_0_8px_rgba(248,113,113,0.5)]",
      dot: "bg-red-400"
    },
    success: {
      bg: "dark:bg-green-900/20 bg-green-600/20",
      text: "dark:text-green-400 text-green-500",
      border: "dark:border-green-400 border-green-500",
      shadow: "dark:shadow-[0_0_8px_rgba(74,222,128,0.5)] shadow-[0_0_8px_rgba(74,222,128,0.8)]",
      dot: "dark:bg-green-400 bg-green-600"
    },
    warning: {
      bg: "bg-yellow-900/20",
      text: "text-yellow-400",
      border: "border-yellow-400",
      shadow: "shadow-[0_0_8px_rgba(250,204,21,0.5)]",
      dot: "bg-yellow-400"
    }
  };

  const variantStyles = darkModeStyles;
  const selectedVariant = variantStyles[variant] || variantStyles.default;

  const sizeStyles = {
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };

  const selectedSize = sizeStyles[size] || sizeStyles.md;

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium ${selectedSize} backdrop-blur-sm
        ${selectedVariant.bg} ${selectedVariant.text} border ${selectedVariant.border} ${selectedVariant.shadow}
        transition-all duration-300 ${className ?? ""}`} // ← className opsional ditambahkan di akhir
    >
      <span
        className={`rounded-full mr-1.5 animate-pulse ${selectedVariant.dot} ${
          size === "lg" ? "w-2.5 h-2.5" : "w-2 h-2"
        }`}
      />
      {children}
    </div>
  );
}
