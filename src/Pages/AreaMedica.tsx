import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/Button";
import { MoveLeft, Lock, User, Eye, EyeOff } from "lucide-react";

export default function AreaMedica() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [iniciosesion, setIniciosesion] = useState({
    usuario: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReturnInicio = () => {
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIniciosesion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(iniciosesion),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem("token", data.token);

      // Ir al panel administrativo
      navigate("/panel-administrativo");
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-xl mx-auto pt-3">
        <div className="max-w-md mx-auto">
          <div className="-ml-1">
            <Button
              icon={<MoveLeft className="w-3 h-3" />}
              label="Volver al inicio"
              parentMethod={handleReturnInicio}
              variant="small"
            />
          </div>
        </div>

        {/* Card de login */}
        <div className="flex justify-center mt-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-md w-full max-w-md border border-gray-200"
          >
            
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            {/* Título */}
            <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1 text-center">
              Iniciar Sesión
            </p>

            {/* Usuario */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Usuario
              </label>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-gray-50 focus-within:bg-white border-gray-300 focus-within:border-blue-400">
                <User className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="usuario"
                  placeholder="Ingrese su usuario"
                  value={iniciosesion.usuario}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Contraseña
              </label>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-gray-50 focus-within:bg-white border-gray-300 focus-within:border-blue-400">
                <Lock className="w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Ingrese su contraseña"
                  value={iniciosesion.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="ml-1 p-1 rounded hover:bg-gray-100"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="mt-3 text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-lg font-semibold text-white py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        {/* Banner de credenciales */}
        <div className="max-w-md mx-auto text-center mb-10">
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <h3 className="font-semibold mb-2">Credenciales de Demostración</h3>
            <ul className="list-inside space-y-1">
              <li>
                <span className="font-semibold">Usuario:</span> admin
              </li>
              <li>
                <span className="font-semibold">Contraseña:</span> admin123
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}







