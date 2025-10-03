import { Heart, Stethoscope, Shield, Clock, User, Award } from "lucide-react"
import { Card } from "../../components/Card"

export default function Servicios() {
    return (
      <section id="servicios" className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
    {/* Título */}
    <h2 className="text-3xl font-bold text-gray-900 mb-4">
      Servicios Médicos
    </h2>
    <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
      Ofrezco una amplia gama de servicios cardiológicos con tecnología de
      vanguardia y un enfoque personalizado para cada paciente.
    </p>

     {/* Grid de 6 cards */}
     <div className="grid md:grid-cols-3 gap-8">
      <Card
        icon={<Heart className="w-10 h-10 text-blue-600" />}
        title="Consulta Cardiológica"
        description="Evaluación completa del sistema cardiovascular con diagnóstico preciso."
        centered
      />
      <Card
        icon={<Stethoscope className="w-10 h-10 text-blue-600" />}
        title="Ecocardiografía"
        description="Estudios de ECG para detectar arritmias y problemas cardíacos."
        centered
      />
      <Card
        icon={<Shield className="w-10 h-10 text-blue-600" />}
        title="Ecocardiograma"
        description="Imágenes detalladas del corazón mediante ultrasonido."
        centered
      />  
      <Card
        icon={<Clock className="w-10 h-10 text-blue-600" />}
        title="Holter 24hs"
        description="Monitoreo continuo del ritmo cardíaco durante 24 horas."
        centered
      />
      <Card 
        icon={<User className="w-10 h-10 text-blue-600" />}
        title="Medicina Preventiva"
        description="Programas de prevención cardiovascular personalizados."
        centered
      />
      <Card
        icon={<Award className="w-10 h-10 text-blue-600" />}
        title="Rehabilitación"
        description="Programas de rehabilitación cardíaca post-operatoria."
        centered
      />
    </div>
  </div>
</section>
)
}
