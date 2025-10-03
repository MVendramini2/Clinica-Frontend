import type { ReactNode } from 'react';

interface CardProps {
  icon: ReactNode;
  title: string;
  description: string;
  subtitle?: string;
  centered?: boolean;
}   

export const Card = ({ icon, title, description, subtitle, centered }: CardProps) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition 
      ${centered ? "flex flex-col items-center text-center" : ""}`}
    >
      {/* Icono centrado */}
      <div className={`mb-4 ${centered ? "flex justify-center" : ""}`}>
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
  );
};