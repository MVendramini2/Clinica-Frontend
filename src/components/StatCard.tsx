
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
};

export default function StatCard({
  title, value, icon, color = "text-gray-500",
}: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
      <div className={`${color} mb-2 [&>svg]:w-6 [&>svg]:h-6`}>
        {icon}
      </div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <span className="text-xs text-gray-600 mt-1">{title}</span>
    </div>
  );
}
