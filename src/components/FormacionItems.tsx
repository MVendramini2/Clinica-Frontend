import type { ReactNode } from "react";

interface FormacionItemProps {
    icon: ReactNode;
    title: string;
    institucion: string;
    año: string;
}
export const FormacionItem = ({ icon, title, institucion, año }: FormacionItemProps) => {
    return (
        <div className="flex items-start gap-3">
      <div className="text-blue-600 mt-1">{icon}</div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-gray-600">
          {institucion} – {año}
        </p>
      </div>
    </div>
  );
};
