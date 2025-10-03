// src/Pages/AdminPanel.tsx
import { useState } from "react";
import {
  LogOut, CalendarDays, Clock3, CheckCircle2, UsersRound,
  Search, SlidersHorizontal, Shield, Calendar, Mail, Phone, User2, Edit, Trash2, Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

/* ========================= Tipos ========================= */
type Estado = "SOLICITADA" | "CONFIRMADA";
type Cita = {
  id: string;
  paciente: string;
  email: string;
  telefono: string;
  fechaISO: string;     // Ej: "2025-01-09T09:00:00"
  obraSocial: string;
  estado: Estado;
};
type ObraSocial = { id: string; nombre: string };

/* ======================== Mock data ======================= */
const MOCK_CITAS: Cita[] = [
  {
    id: "c1",
    paciente: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "+54 11 1234-5678",
    fechaISO: "2025-01-09T09:00:00",
    obraSocial: "OSDE",
    estado: "CONFIRMADA",
  },
  {
    id: "c2",
    paciente: "María López",
    email: "maria.lopez@email.com",
    telefono: "+54 11 2222-3333",
    fechaISO: "2025-01-15T10:30:00",
    obraSocial: "Swiss Medical",
    estado: "SOLICITADA",
  },
  {
    id: "c3",
    paciente: "Carlos Gómez",
    email: "carlos.gomez@email.com",
    telefono: "+54 11 3333-4444",
    fechaISO: new Date().toISOString().slice(0, 10) + "T16:00:00", // hoy 16:00
    obraSocial: "OSDE",
    estado: "CONFIRMADA",
  },
];

const MOCK_OBRAS: ObraSocial[] = [
  { id: "o1", nombre: "OSDE" },
  { id: "o2", nombre: "Swiss Medical" },
  { id: "o3", nombre: "Galeno" },
];

/* ======================= Helpers fecha ===================== */
const fmtFecha = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
};
const fmtHora = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
const esHoy = (iso: string) => {
  const d = new Date(iso);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() &&
         d.getMonth() === t.getMonth() &&
         d.getDate() === t.getDate();
};

/* ==================== UI internos compactos =================== */
function StatCard({
  title, value, icon, color = "text-gray-500",
}: { title: string; value: number | string; icon: React.ReactNode; color?: string; }) {
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
  children, tone = "gray",
}: { children: React.ReactNode; tone?: "gray" | "green" | "orange"; }) {
  const map: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-100 text-emerald-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[tone]}`}>
      {children}
    </span>
  );
}

/* ========================== Página ========================== */
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"citas" | "obras">("citas");
  const [citas, setCitas] = useState<Cita[]>(MOCK_CITAS);
  const [obras, setObras] = useState<ObraSocial[]>(MOCK_OBRAS);
  const navigate = useNavigate();

  const handleCerrarSesion = () => {    
    navigate("/");
  };

  // Filtros
  const [q, setQ] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODAS" | Estado | "HOY">("TODAS");

  // Métricas (sin useMemo)
  const total = citas.length;
  const solicitadas = citas.filter(c => c.estado === "SOLICITADA").length;
  const confirmadas = citas.filter(c => c.estado === "CONFIRMADA").length;
  const hoy = citas.filter(c => esHoy(c.fechaISO)).length;

  // Lista filtrada (sin useMemo)
  let citasFiltradas = [...citas];
  if (filtroEstado === "SOLICITADA" || filtroEstado === "CONFIRMADA") {
    citasFiltradas = citasFiltradas.filter(c => c.estado === filtroEstado);
  } else if (filtroEstado === "HOY") {
    citasFiltradas = citasFiltradas.filter(c => esHoy(c.fechaISO));
  }
  if (q.trim()) {
    const s = q.toLowerCase();
    citasFiltradas = citasFiltradas.filter(c =>
      c.paciente.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s)
    );
  }
  citasFiltradas.sort((a, b) => +new Date(a.fechaISO) - +new Date(b.fechaISO));

  // Acciones
  const confirmarCita = (id: string) =>
    setCitas(prev => prev.map(c => (c.id === id ? { ...c, estado: "CONFIRMADA" } : c)));

  // Obras Sociales (front-only)
  const [formObra, setFormObra] = useState<{ id?: string; nombre: string }>({ nombre: "" });
  const guardarObra = () => {
    const nombre = formObra.nombre.trim();
    if (!nombre) return;
    if (formObra.id) {
      setObras(prev => prev.map(o => (o.id === formObra.id ? { ...o, nombre } : o)));
    } else {
      setObras(prev => [...prev, { id: crypto.randomUUID(), nombre }]);
    }
    setFormObra({ nombre: "" });
  };
  const editarObra = (o: ObraSocial) => setFormObra(o);
  const eliminarObra = (id: string) => setObras(prev => prev.filter(o => o.id !== id));

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header compacto */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-3 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Panel Administrativo</h1>
            <p className="text-xs text-gray-500 -mt-0.5">Gestión de citas y configuración</p>
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
          <StatCard title="Solicitadas" value={solicitadas} icon={<Clock3 />} color="text-orange-500" />
          <StatCard title="Confirmadas" value={confirmadas} icon={<CheckCircle2 />} color="text-emerald-600" />
          <StatCard title="Hoy" value={hoy} icon={<UsersRound />} color="text-blue-600" />
        </div>

        {/* Tabs pildora */}
        <div className="bg-white border border-gray-200 rounded-full p-0.5 shadow-sm flex items-center">
          <button
            onClick={() => setActiveTab("citas")}
            className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition
            ${activeTab === "citas" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Gestión de Citas
            </span>
          </button>
          <button
            onClick={() => setActiveTab("obras")}
            className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition
            ${activeTab === "obras" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
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
              <h2 className="text-base font-semibold text-gray-900">Citas Médicas</h2>
              <p className="text-sm text-gray-600">Visualice y gestione todas las solicitudes</p>

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
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
                </div>
              </div>
            </div>

            {/* Lista de citas */}
            <div className="space-y-3">
              {citasFiltradas.map((cita) => (
                <div key={cita.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <User2 className="w-4 h-4 text-gray-500" />
                        <h3 className="text-base font-semibold text-gray-900">{cita.paciente}</h3>
                        {cita.estado === "CONFIRMADA"
                          ? <Tag tone="green">Confirmada</Tag>
                          : <Tag tone="orange">Solicitada</Tag>}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-gray-700">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4 text-gray-500" />
                          {fmtFecha(cita.fechaISO)} - {fmtHora(cita.fechaISO)} hs
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-gray-500" /> {cita.telefono}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-gray-500" /> {cita.email}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-gray-500" /> {cita.obraSocial}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {cita.estado === "SOLICITADA" && (
                        <button
                          onClick={() => confirmarCita(cita.id)}
                          className="px-3 py-1.5 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 text-sm"
                        >
                          Confirmar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {citasFiltradas.length === 0 && (
                <div className="text-center text-gray-500 py-8 text-sm">
                  No hay resultados para el filtro actual.
                </div>
              )}
            </div>
          </>
        ) : (
        
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Obras Sociales</h2>
            <p className="text-sm text-gray-600">Administre las obras disponibles.</p>

            {/* Alta / edición */}
            <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
              <input
                value={formObra.nombre}
                onChange={(e) => setFormObra(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre de la obra social"
                className="flex-1 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-400 text-sm"
              />
              <button
                onClick={guardarObra}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" /> {formObra.id ? "Guardar cambios" : "Agregar"}
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
              {obras.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-3 py-2.5 bg-white">
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

              {obras.length === 0 && (
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

