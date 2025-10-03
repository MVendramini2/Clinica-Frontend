import { Stethoscope } from "lucide-react";

export default function Footer() {
    return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left justify-items-center">
          
          {/* Columna 1 */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Stethoscope className="text-blue-500 w-6 h-6" />
              <h3 className="font-semibold text-lg text-white">
                Dra. Ana Martínez
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Especialista en cardiología comprometida con tu salud
              cardiovascular.
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <h3 className="font-semibold text-white mb-4">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li>Consulta Cardiológica</li>
              <li>Electrocardiograma</li>
              <li>Ecocardiografía</li>
              <li>Medicina Preventiva</li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h3 className="font-semibold text-white mb-4">Horarios de Atención</h3>
            <ul className="space-y-2 text-sm">
              <li>Lunes a Viernes: 8:00 - 18:00</li>
              <li>Sábados: 9:00 - 13:00</li>
              <li>Domingos: Cerrado</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
