import { Button } from "../../components/Button";
import { Calendar, Phone, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Inicio() {
  
  const handleContactar = () => {
    const section = document.getElementById("contacto");
    section?.scrollIntoView({ behavior: "smooth" });
  };
  const navigate = useNavigate();
  const handleToReservarCita = () => {
    navigate("/reservar-cita");
  };

  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center bg-gray-100 px-12 md:px-24 py-20"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Parte Izquierda */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Dra. Ana Martinez
          </h1>
          <div className="text-xl text-blue-600 font-semibold mb-6">
            Cardiología
          </div>
          <p className="text-gray-600 mb-6">
            Especialista en cardiología con más de 15 años de experiencia.
            Comprometida con brindar atención médica de excelencia y cuidado
            personalizado para cada paciente.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              label="Reservar Cita"
              parentMethod={handleToReservarCita}
              icon={<Calendar className="w-4 h-4" />}
              variant="primary"
            />
            <Button
              label="Contactar"
              parentMethod={handleContactar}
              icon={<Phone className="w-4 h-4" />}
              variant="secondary"
            />
          </div>
        </div>

        {/* Parte Derecha */}
        <div className="relative flex justify-center">
          <img
            src="public/images/Dra. Ana Martinez.jpg"
            alt="Dra. Ana Martinez"
            className="w-full max-w-sm rounded-2xl shadow-lg object-cover"
          />

          {/* Badge flotante */}
          <div className="absolute bottom-4 left-4 bg-white shadow-md rounded-xl px-4 py-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700">
              15+ años de experiencia
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
