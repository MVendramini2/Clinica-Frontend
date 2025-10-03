import { Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Card  } from "../../components/Card";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function Contacto() {
    const navigate = useNavigate();
    const handleReservarCita = () => {
      navigate("/reservar-cita");
    };
    return (
    <section id="contacto" className="bg-gray-50 py-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Información de Contacto</h2>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card            
            icon={<Phone className="w-10 h-10 text-blue-600" />}
            title="Teléfono"
            description="+54 11 4567-8900"
            subtitle="Lun - Vie: 8:00 - 18:00"
            centered
          />
          <Card            
            icon={<Mail className="w-10 h-10 text-blue-600" />}
            title="Email"
            description="dra.martinez@email.com"
            subtitle="Respuesta en 24hs"
            centered
          />
          <Card
            icon={<MapPin className="w-10 h-10 text-blue-600" />}
            title="Consultorio"
            description="Av. Corrientes 1234, Piso 8"
            subtitle="CABA, Argentina"
            centered
          />
        </div>

        <div className="mt-12 flex justify-center">
            <Button  
            icon={<Calendar className="w-4 h-4" />} 
            label="Reservar Cita" 
            parentMethod={handleReservarCita} 
            variant="primary" />

        </div>
      </div>
    </section>
  );
}
