// src/Pages/AdminPanel.tsx
import { useState, useEffect } from "react";
import {
  LogOut,
  CalendarDays,
  Clock3,
  CheckCircle2,
  UsersRound,
  Search,
  SlidersHorizontal,
  Shield,
  Calendar,
  Mail,
  Phone,
  User2,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

type Estado = "SOLICITADA" | "CONFIRMADA";

type Cita = {
  id: number; 
  paciente: string;
  email: string;
  telefono: string;
  fechaISO: string; 
  obraSocial: string;
  estado: Estado;
};

type ObraSocial = { id: number; nombre: string };


const fmtFecha = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const esFutura = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  return d.getTime() >= now.getTime(); 
};

const fmtHora = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const esHoy = (iso: string) => {
  const d = new Date(iso);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
};


function StatCard({
  title,
  value,
  icon,
  color = "text-gray-500",
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-gray-700 font-medium">{title}</span>
        <span className={`${color} [&>svg]:w-4 [&>svg]:h-4`}>{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function Tag({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "green" | "orange";
}) {
  const map: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-100 text-emerald-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[tone]}`}
    >
      {children}
    </span>
  );
}


export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"citas" | "obras">("citas");
  const [citas, setCitas] = useState<Cita[]>([]);
  const [obras, setObras] = useState<ObraSocial[]>([]);
  const [q, setQ] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODAS" | Estado | "HOY">(
    "TODAS"
  );
  const [loadingCitas, setLoadingCitas] = useState(false);
  const [loadingObras, setLoadingObras] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const [formObra, setFormObra] = useState<{ id?: number; nombre: string }>({
    nombre: "",
  });

  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  

  const fetchCitas = async () => {
    try {
      setLoadingCitas(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/citas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error al obtener citas:", data);
        return;
      }

      setCitas(data);
    } catch (err) {
      console.error("Fallo al conectar con el backend (citas):", err);
    } finally {
      setLoadingCitas(false);
    }
  };

  const fetchObras = async () => {
    try {
      setLoadingObras(true);
      const res = await fetch("http://localhost:3001/api/obras-sociales");
      const data = await res.json();

      if (!res.ok) {
        console.error("Error al obtener obras sociales:", data);
        return;
      }

      setObras(data);
    } catch (err) {
      console.error("Fallo al conectar con el backend (obras):", err);
    } finally {
      setLoadingObras(false);
    }
  };

  useEffect(() => {
    fetchCitas();
    fetchObras();
  }, []);

  
  const total = citas.length;
  const solicitadas = citas.filter((c) => c.estado === "SOLICITADA").length;
  const confirmadas = citas.filter((c) => c.estado === "CONFIRMADA").length;
  const hoy = citas.filter((c) => esHoy(c.fechaISO)).length;

  let citasFiltradas = [...citas];

  if (filtroEstado === "SOLICITADA" || filtroEstado === "CONFIRMADA") {
    citasFiltradas = citasFiltradas.filter(
      (c) => c.estado === filtroEstado
    );
  } else if (filtroEstado === "HOY") {
    citasFiltradas = citasFiltradas.filter((c) => esHoy(c.fechaISO));
  }

  if (q.trim()) {
    const s = q.toLowerCase();
    citasFiltradas = citasFiltradas.filter(
      (c) =>
        c.paciente.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s)
    );
  }

  citasFiltradas.sort(
    (a, b) => +new Date(b.fechaISO) - +new Date(a.fechaISO)
  );

  const totalPages = Math.max(1, Math.ceil(citasFiltradas.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const citasPagina = citasFiltradas.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [q, filtroEstado, citas]);

  

  const confirmarCita = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/citas/${id}/confirmar`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        console.error("Error al confirmar la cita:", data);
        return;
      }

      // Actualizamos en el front
      setCitas((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, estado: "CONFIRMADA" } : c
        )
      );
    } catch (err) {
      console.error("Fallo al confirmar cita:", err);
    }
  };

  const eliminarCita = async (id: number | string) => {
    const ok = window.confirm("¿Seguro que desea eliminar esta reserva?");
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token, no se puede eliminar cita.");
        return;
      }

      const res = await fetch(`http://localhost:3001/api/citas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // por si viene HTML en caso de error
      }

      if (!res.ok) {
        console.error("Error al eliminar cita:", data || res.statusText);
        alert(
          (data && data.message) ||
          `No se pudo eliminar la cita (código ${res.status})`
        );
        return;
      }

      setCitas((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Fallo al eliminar cita (front):", err);
      alert("Error de conexión al eliminar la cita");
    }
  };

  

  const guardarObra = async () => {
    const nombre = formObra.nombre.trim();
    if (!nombre) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token, no se puede gestionar obras.");
      return;
    }

    try {
      if (formObra.id) {
        // Editar
        const res = await fetch(
          `http://localhost:3001/api/obras-sociales/${formObra.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nombre }),
          }
        );

        const actualizada = await res.json();

        if (!res.ok) {
          console.error("Error al actualizar obra social:", actualizada);
          return;
        }

        setObras((prev) =>
          prev.map((o) => (o.id === actualizada.id ? actualizada : o))
        );
      } else {
        // Crear
        const res = await fetch("http://localhost:3001/api/obras-sociales", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre }),
        });

        const nueva = await res.json();

        if (!res.ok) {
          console.error("Error al crear obra social:", nueva);
          return;
        }

        setObras((prev) => [...prev, nueva]);
      }

      setFormObra({ nombre: "" });
    } catch (err) {
      console.error("Error en guardarObra:", err);
    }
  };

  const editarObra = (o: ObraSocial) => {
    setFormObra({ id: o.id, nombre: o.nombre });
  };

  const eliminarObra = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token, no se puede eliminar obra.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/obras-sociales/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        console.error("Error al eliminar obra social:", data);
        return;
      }

      setObras((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error al eliminar obra social:", err);
    }
  };

  

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header compacto */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-3 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Panel Administrativo
            </h1>
            <p className="text-xs text-gray-500 -mt-0.5">
              Gestión de citas y configuración
            </p>
          </div>
          <Button
            label="Cerrar Sesión"
            parentMethod={handleCerrarSesion}
            icon={<LogOut className="w-4 h-4" />}
            variant="danger"
          />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-3 py-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Citas" value={total} icon={<CalendarDays />} />
          <StatCard
            title="Solicitadas"
            value={solicitadas}
            icon={<Clock3 />}
            color="text-orange-500"
          />
          <StatCard
            title="Confirmadas"
            value={confirmadas}
            icon={<CheckCircle2 />}
            color="text-emerald-600"
          />
          <StatCard
            title="Hoy"
            value={hoy}
            icon={<UsersRound />}
            color="text-blue-600"
          />
        </div>

        
        <div className="bg-white border border-gray-200 rounded-full p-0.5 shadow-sm flex items-center">
          <button
            onClick={() => setActiveTab("citas")}
            className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition
            ${activeTab === "citas"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Gestión de Citas
            </span>
          </button>
          <button
            onClick={() => setActiveTab("obras")}
            className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition
            ${activeTab === "obras"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Obras Sociales
            </span>
          </button>
        </div>

        {activeTab === "citas" ? (
          <>
            {/* Encabezado sección citas */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h2 className="text;base font-semibold text-gray-900">
                Citas Médicas
              </h2>
              <p className="text-sm text-gray-600">
                Visualice y gestione todas las solicitudes
              </p>

              <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-400 text-sm"
                  />
                </div>
                <div className="relative">
                  <SlidersHorizontal className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value as any)}
                    className="appearance-none pl-9 pr-7 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-blue-400 text-sm"
                  >
                    <option value="TODAS">Todas las citas</option>
                    <option value="SOLICITADA">Solicitadas</option>
                    <option value="CONFIRMADA">Confirmadas</option>
                    <option value="HOY">Hoy</option>
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ▾
                  </span>
                </div>
              </div>
            </div>

            {/* Lista de citas */}
            <div className="space-y-3">
              {loadingCitas && (
                <div className="text-center text-gray-500 py-4 text-sm">
                  Cargando citas...
                </div>
              )}

              {!loadingCitas &&
                citasPagina.map((cita) => (
                  <div
                    key={cita.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <User2 className="w-4 h-4 text-gray-500" />
                          <h3 className="text-base font-semibold text-gray-900">
                            {cita.paciente}
                          </h3>
                          {cita.estado === "CONFIRMADA" ? (
                            <Tag tone="green">Confirmada</Tag>
                          ) : (
                            <Tag tone="orange">Solicitada</Tag>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-gray-700">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4 text-gray-500" />
                            {fmtFecha(cita.fechaISO)} - {fmtHora(cita.fechaISO)}{" "}
                            hs
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-gray-500" />{" "}
                            {cita.telefono}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-gray-500" />{" "}
                            {cita.email}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-gray-500" />{" "}
                            {cita.obraSocial}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col gap-2">
                        {cita.estado === "SOLICITADA" && (
                          <button
                            onClick={() => confirmarCita(cita.id)}
                            className="px-3 py-1.5 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 text-sm"
                          >
                            Confirmar
                          </button>
                        )}

                        {esFutura(cita.fechaISO) && (
                          <button
                            onClick={() => eliminarCita(cita.id)}
                            className="px-3 py-1.5 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 text-sm"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              {!loadingCitas && citasFiltradas.length === 0 && (
                <div className="text-center text-gray-500 py-8 text-sm">
                  No hay resultados para el filtro actual.
                </div>
              )}
              {!loadingCitas && citasFiltradas.length > 0 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-md border text-sm ${currentPage === 1
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Anterior
                  </button>

                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-md border text-sm ${currentPage === totalPages
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Obras Sociales
            </h2>
            <p className="text-sm text-gray-600">
              Administre las obras disponibles.
            </p>

            {/* Alta / edición */}
            <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
              <input
                value={formObra.nombre}
                onChange={(e) =>
                  setFormObra((prev) => ({ ...prev, nombre: e.target.value }))
                }
                placeholder="Nombre de la obra social"
                className="flex-1 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-400 text-sm"
              />
              <button
                onClick={guardarObra}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />{" "}
                {formObra.id ? "Guardar cambios" : "Agregar"}
              </button>
              {formObra.id && (
                <button
                  onClick={() => setFormObra({ nombre: "" })}
                  className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancelar
                </button>
              )}
            </div>

            {/* Lista */}
            <div className="mt-4 divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {loadingObras && (
                <div className="p-4 text-center text-gray-500 text-sm bg-white">
                  Cargando obras sociales...
                </div>
              )}

              {!loadingObras &&
                obras.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between px-3 py-2.5 bg-white"
                  >
                    <div className="inline-flex items-center gap-2 text-gray-900 text-sm">
                      <Shield className="w-4 h-4 text-gray-500" />
                      {o.nombre}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editarObra(o)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        <Edit className="w-4 h-4" /> Editar
                      </button>
                      <button
                        onClick={() => eliminarObra(o.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}

              {!loadingObras && obras.length === 0 && (
                <div className="p-6 text-center text-gray-500 bg-white text-sm">
                  No hay obras sociales cargadas.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


