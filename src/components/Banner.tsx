import type { ReactNode } from "react";

interface BannerProps {
  icon?: ReactNode;
  title: string;
  items: string[];            
  className?: string;
}

export function Banner({ icon, title, items, className }: BannerProps) {
  return (
    <div
      className={`rounded-2xl border border-blue-200 bg-blue-50/60 p-5 sm:p-6 ${className ?? ""}`}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-blue-800">
            {title}
          </h3>
          <ul className="mt-2 space-y-1.5 text-blue-700 text-sm">
            {items.map((t, i) => (
              <li key={i} className="list-disc list-inside">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}