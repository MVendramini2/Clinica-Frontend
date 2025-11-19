import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MoveLeft, Calendar } from "lucide-react";
import { Button } from "../components/Button";
import { Banner } from "../components/Banner";

// ===== Constantes de calendario =====
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekDay(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type SlotBackend = {
  fechaHora: string; // ISO
};

export default function ReservaPaso2() {
  const navigate = useNavigate();
  const location = useLocation();

  // 📌 viene del Paso 1 (ReservaForm)
  const pacienteId = (location.state as { pacienteId?: number } | null)
    ?.pacienteId;

  useEffect(() => {
    if (!pacienteId) {
      navigate("/reservar-cita");
    }
  }, [pacienteId, navigate]);

  
  const minSelectableDate = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  
  const maxSelectableDate = (() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    d.setDate(d.getDate() + 14);
    return d;
  })();

  const today = new Date();
  const [view, setView] = useState<{ month: number; year: number }>(() => ({
    month: today.getMonth(),
    year: today.getFullYear(),
  }));

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const totalDays = daysInMonth(view.year, view.month);
  const padStart = firstWeekDay(view.year, view.month);

  const cells: (number | null)[] = [
    ...Array(padStart).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isDisabledDay = (day: number) => {
    const d = new Date(view.year, view.month, day);
    // a mitad de día para evitar problemas de zona horaria
    d.setHours(12, 0, 0, 0);
    return d < minSelectableDate || d > maxSelectableDate;
  };

  const goPrevMonth = () => {
    setSelectedDate(null);
    setSelectedTime("");
    setAvailableTimes([]);
    setView((v) =>
      v.month === 0 ? { month: 11, year: v.year - 1 } : { month: v.month - 1, year: v.year }
    );
  };

  const goNextMonth = () => {
    setSelectedDate(null);
    setSelectedTime("");
    setAvailableTimes([]);
    setView((v) =>
      v.month === 11 ? { month: 0, year: v.year + 1 } : { month: v.month + 1, year: v.year }
    );
  };

  const onSelectDay = (day: number | null) => {
    if (!day || isDisabledDay(day)) return;

    const d = new Date(view.year, view.month, day);
    d.setHours(0, 0, 0, 0);

    setSelectedDate(d);
    setSelectedTime("");
    setAvailableTimes([]);
    setError(null);
  };

  
  useEffect(() => {
    const fetchDisponibilidad = async (fechaISO: string) => {
      try {
        setLoadingTimes(true);
        setError(null);

        
        const res = await fetch(
          `http://localhost:3001/api/disponibilidad?desde=${fechaISO}&hasta=${fechaISO}`
        );
        const data = await res.json();

        if (!res.ok) {
          console.error("Error al obtener disponibilidad:", data);
          setError("No se pudo cargar la disponibilidad");
          return;
        }

       
        

        
        const slots: SlotBackend[] = data.slots || [];

        // Convertimos cada ISO a hora LOCAL "HH:MM"
        const horas = Array.from(
          new Set(
            slots.map((s) => {
              const d = new Date(s.fechaHora);
              return d.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
            })
          )
        ).sort();

        setAvailableTimes(horas);
      } catch (err) {
        console.error(err);
        setError("Error de conexión al cargar horarios");
      } finally {
        setLoadingTimes(false);
      }
    };

    if (selectedDate) {
      const fechaISO = selectedDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
      fetchDisponibilidad(fechaISO);
    }
  }, [selectedDate]);

  const confirmDisabled = !selectedDate || !selectedTime;

 const handleConfirm = async () => {
  if (!selectedDate || !selectedTime || !pacienteId) return;

  // Fecha LOCAL "YYYY-MM-DD"
  const y = selectedDate.getFullYear();
  const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const d = String(selectedDate.getDate()).padStart(2, "0");
  const fechaLocal = `${y}-${m}-${d}`;          // ej. "2025-11-19"

  // Hora seleccionada "HH:MM"
  const fechaHora = `${fechaLocal}T${selectedTime}:00`; // ej. "2025-11-19T10:00:00"

  try {
    const res = await fetch("http://localhost:3001/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pacienteId,
        fechaHora,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error al crear cita:", data);
      alert(data.message || "No se pudo registrar la cita");
      return;
    }

    // Quitamos el horario recién reservado de la lista en pantalla
    setAvailableTimes((prev) => prev.filter((h) => h !== selectedTime));

    alert("¡Cita solicitada con éxito! Recibirá un email de confirmación.");
    navigate("/");
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor");
  }
};

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header superior */}
      <div className="max-w-xl mx-auto px-3 pt-3">
        <Button
          icon={<MoveLeft className="w-3 h-3" />}
          label="Volver al inicio"
          parentMethod={() => navigate("/")}
          variant="small"
        />
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reservar Cita Médica</h1>
          <p className="mt-1 text-gray-600 text-xs sm:text-sm">
            Complete el formulario para solicitar su cita con la Dra. Ana Martínez
          </p>
        </div>

        {/* Stepper */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-blue-200 text-gray-700">
            1
          </div>
          <div className="h-0.5 w-10 bg-blue-200 rounded" />
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-blue-600 text-white">
            2
          </div>
        </div>
      </div>

      {/* Card principal */}
      <div className="max-w-xl mx-auto px-3 pb-10 mt-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
          {/* Header card */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Seleccionar Fecha y Horario
            </h2>
          </div>
          <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">
            Elija la fecha y horario que mejor le convenga
          </p>

          {/* Calendario */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Seleccionar Fecha
            </label>

            <div className="rounded-xl border border-gray-200">
              {/* Header mes */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                <button
                  onClick={goPrevMonth}
                  className="h-7 w-7 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  aria-label="Mes anterior"
                >
                  ‹
                </button>
                <div className="text-sm font-semibold text-gray-900">
                  {MONTHS[view.month]} {view.year}
                </div>
                <button
                  onClick={goNextMonth}
                  className="h-7 w-7 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  aria-label="Mes siguiente"
                >
                  ›
                </button>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 text-center text-[11px] text-gray-500 py-2">
                {WEEK.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Grilla de días */}
              <div className="grid grid-cols-7 gap-1 p-2">
                {cells.map((day, idx) => {
                  if (day === null) return <div key={idx} />;

                  const disabled = isDisabledDay(day);
                  const isSelected =
                    !!selectedDate &&
                    selectedDate.getFullYear() === view.year &&
                    selectedDate.getMonth() === view.month &&
                    selectedDate.getDate() === day;

                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectDay(day)}
                      disabled={disabled}
                      className={[
                        "h-9 rounded-md text-sm",
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
                        disabled && "opacity-40 cursor-not-allowed",
                      ].join(" ")}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Leyenda */}
            <p className="mt-2 text-[11px] text-gray-500">
              Los turnos están disponibles desde hoy hasta el{" "}
              {maxSelectableDate.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          </div>

          {/* Horarios (desde backend) */}
          {selectedDate && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Horarios Disponibles
              </label>

              {loadingTimes && (
                <p className="text-sm text-gray-500 mb-2">Cargando horarios...</p>
              )}

              {error && (
                <p className="text-sm text-red-600 mb-2">{error}</p>
              )}

              {!loadingTimes && !error && availableTimes.length === 0 && (
                <p className="text-sm text-gray-500 mb-2">
                  No hay horarios disponibles para esta fecha.
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableTimes.map((t) => {
                  const active = t === selectedTime;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={[
                        "px-3 py-2 rounded-md text-sm border transition",
                        active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/reservar-cita")}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
            >
              Volver
            </button>

            <button
              onClick={handleConfirm}
              disabled={confirmDisabled}
              className={[
                "w-full rounded-lg font-semibold text-white py-2.5",
                confirmDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700",
              ].join(" ")}
            >
              Confirmar Reserva
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Banner
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
            title="Información importante"
            items={[
              "Recibirá un email de confirmación una vez enviada la solicitud",
              "La cita será confirmada por nuestro personal médico",
              "Puede cancelar o reprogramar con 24hs de anticipación",
              "Traiga documento de identidad y credencial de obra social",
            ]}
          />
        </div>
      </div>
    </section>
  );
}


