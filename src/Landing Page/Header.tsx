import { Stethoscope } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';


export default function Header() {
  const navigate = useNavigate();
  const handleAreaMedica = () => {
    navigate('/inicio-sesion-area-medica');
  };
  return (
  <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
    <div className="max-w-7xl mx-auto flex items-center px-6 py-3">
      
      {/* Logo */}
      <div className="flex items-center gap-2 flex-1">
        <Stethoscope className="text-blue-600 text-2xl" />
        <span className="font-semibold text-lg">Dra. Ana Martinez </span>
      </div>

      {/* Nav Links centrados */}
      <nav className="hidden md:flex gap-8 justify-center flex-1">
        <a href="#inicio" className="text-gray-500 hover:text-gray-600">Inicio</a>
        <a href="#servicios" className="text-gray-500 hover:text-gray-600">Servicios</a>
        <a href="#formacion" className="text-gray-500 hover:text-gray-600">Formación</a>
        <a href="#contacto" className="text-gray-500 hover:text-gray-600">Contacto</a>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        <Button 
          label="Área Médica" 
          parentMethod={handleAreaMedica}
          variant="secondary" 
        />
      </div>
    </div>
  </header>
);
}
