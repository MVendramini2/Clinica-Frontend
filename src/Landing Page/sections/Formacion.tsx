import { GraduationCap, Award, Shield, Heart } from "lucide-react"
import { FormacionItem } from "../../components/FormacionItems"

export default function Formacion() {

    return (
    <section id="formacion" className="bg-gray-100 py-16 px-8 md:px-16">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Columna izquierda */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Formación y Experiencia
          </h2>

          <div className="space-y-6">
            <FormacionItem
              icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
              title="Médica Especialista en Cardiología"
              institucion="UADE"
              año="2009"
            />
            <FormacionItem
              icon={<Award className="w-6 h-6 text-blue-600" />}
              title="Fellowship en Cardiología Intervencionista"
              institucion="Hospital Italiano"
              año="2015"
            />
            <FormacionItem
              icon={<Shield className="w-6 h-6 text-blue-600" />}
              title="Miembro del Colegio Argentino de Cardiólogos"
              institucion="Matrícula N° 12345"
              año=""
            />
            <FormacionItem
              icon={<Heart className="w-6 h-6 text-blue-600" />}
              title="Jefa del Servicio de Cardiología"
              institucion="Hospital de Clínicas"
              año="2020 - Presente"
            />
          </div>
        </div>

        {/* Columna derecha (imagen) */}
        <div className="mt-8 md:mt-0 flex justify-center">
          <img
            src="public/images/Fotoformacionyexperiencia.jpg"
            alt="Foto formación y experiencia"
            className="rounded-2xl shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </div>
    </section>
  );
}