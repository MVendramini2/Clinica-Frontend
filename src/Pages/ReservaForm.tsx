import { Button } from "../components/Button";
import { MoveLeft, User, Phone, Mail, Shield, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Banner } from "../components/Banner";

export default function ReservaForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    obraSocial: "",
  });

  const errors = {
    nombre: form.nombre.trim().length < 2,
    apellido: form.apellido.trim().length < 2,
    telefono: !/^\+?\d[\d\s\-()]{8,}$/.test(form.telefono.trim()),
    email: !/^\S+@\S+\.\S+$/.test(form.email.trim()),
    obraSocial: form.obraSocial === "",
  };
  const isValid = Object.values(errors).every((e) => e === false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    navigate("/reservar-fecha");
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-3 pt-3">
        <Link to="/" className="inline-block mb-2">
          <Button
            icon={<MoveLeft className="w-3 h-3" />}
            label="Volver al inicio"
            parentMethod={() => {}}
            variant="small"
          />
        </Link>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Reservar Cita Médica
          </h1>
          <p className="mt-1 text-gray-600 text-xs sm:text-sm">
            Complete el formulario para solicitar su cita con la Dra. Ana Martínez
          </p>
        </div>

        {/* Stepper: paso 1 activo */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-blue-600 text-white">
            1
          </div>
          <div className="h-0.5 w-10 bg-gray-200 rounded" />
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-gray-200 text-gray-600">
            2
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-3 pb-10 mt-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5"
        >
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Datos del Paciente
            </h2>
          </div>
          <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">
            Ingrese sus datos personales y obra social
          </p>

          {/* Nombre / Apellido */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-0.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex items-center gap-2 rounded-md border px-2.5 py-2 bg-gray-50 focus-within:bg-white ${
                  errors.nombre
                    ? "border-red-300 focus-within:border-red-400"
                    : "border-gray-300 focus-within:border-blue-400"
                }`}
              >
                <User className="w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingrese su nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-0.5">
                Apellido <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex items-center gap-2 rounded-md border px-2.5 py-2 bg-gray-50 focus-within:bg-white ${
                  errors.apellido
                    ? "border-red-300 focus-within:border-red-400"
                    : "border-gray-300 focus-within:border-blue-400"
                }`}
              >
                <User className="w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  name="apellido"
                  placeholder="Ingrese su apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Teléfono */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-800 mb-0.5">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center gap-2 rounded-md border px-2.5 py-2 bg-gray-50 focus-within:bg-white ${
                errors.telefono
                  ? "border-red-300 focus-within:border-red-400"
                  : "border-gray-300 focus-within:border-blue-400"
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <input
                type="tel"
                name="telefono"
                placeholder="+54 11 1234-5678"
                value={form.telefono}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-800 mb-0.5">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center gap-2 rounded-md border px-2.5 py-2 bg-gray-50 focus-within:bg-white ${
                errors.email
                  ? "border-red-300 focus-within:border-red-400"
                  : "border-gray-300 focus-within:border-blue-400"
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="su.email@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Obra Social */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-800 mb-0.5">
              Obra Social <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center gap-2 rounded-md border px-2.5 py-2 bg-gray-50 focus-within:bg-white ${
                errors.obraSocial
                  ? "border-red-300 focus-within:border-red-400"
                  : "border-gray-300 focus-within:border-blue-400"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-gray-500" />
              <select
                name="obraSocial"
                value={form.obraSocial}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-900 text-xs sm:text-sm"
                required
              >
                <option value="">Seleccione su obra social</option>
                <option value="OSDE">OSDE</option>
                <option value="Swiss Medical">Swiss Medical</option>
                <option value="Galeno">Galeno</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`mt-4 w-full py-2 rounded-md font-medium text-white text-sm ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continuar
          </button>
        </form>
         <div className="mt-6">
          <Banner
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
            title="Información importante"
            items={[
              "Recibirá un email de confirmación una vez enviada la solicitud",
              "La cita será confirmada por nuestro personal médico",
              "Puede cancelar o reprogramar con 24hs de anticipación",
              "Traiga su documento de identidad y credencial de obra social",
            ]}
          />
        </div>
      </div>    
    </section>
  );
}
            
