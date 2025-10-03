import type { ReactNode } from "react";

interface Props {
  label: string;
  parentMethod: () => void;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "small" | "danger";
}

export const Button = ({
  label,
  parentMethod,
  icon,
  variant = "primary",
}: Props) => {
  const base =
    "rounded-lg font-medium flex items-center gap-2 transition-colors";

  let styles = "";

  switch (variant) {
    case "primary":
      styles = "px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm";
      break;
    case "secondary":
      styles =
        "px-4 py-2 bg-white text-black border border-gray-300 hover:bg-gray-100 text-sm";
      break;
    case "small":
      styles =
        "px-4 py-2 text-black hover:bg-gray-200 text-sm";
      break;
    case "danger":
      styles =
        "px-4 py-2 bg-white text-red-600 border border-red-300 hover:bg-red-50 text-sm";
      break;
  }

  return (
    <button onClick={parentMethod} className={`${base} ${styles}`}>
      {icon && <span className="inline-block">{icon}</span>}
      {label}
    </button>
  );
};