import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, Calendar } from "lucide-react";
import { Button } from "../components/Button";
import { Banner } from "../components/Banner";


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

const handleReturnInicio = () => {
  const navigate = useNavigate();
  navigate("/");
}

export default function ReservaPaso2() {
  const navigate = useNavigate();

  const minSelectableDate = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
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

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  const totalDays = daysInMonth(view.year, view.month);
  const padStart = firstWeekDay(view.year, view.month);
  const cells: (number | null)[] = [
    ...Array(padStart).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const goPrevMonth = () => {
    setSelectedDate(null);
    setSelectedTime("");
    setView((v) =>
      v.month === 0 ? { month: 11, year: v.year - 1 } : { month: v.month - 1, year: v.year }
    );
  };

  const goNextMonth = () => {
    setSelectedDate(null);
    setSelectedTime("");
    setView((v) =>
      v.month === 11 ? { month: 0, year: v.year + 1 } : { month: v.month + 1, year: v.year }
    );
  };

  const isBeforeMinDay = (day: number) => {
    const d = new Date(view.year, view.month, day);
    d.setHours(23, 59, 59, 999);
    return d < minSelectableDate;
  };

  const onSelectDay = (day: number | null) => {
    if (!day || isBeforeMinDay(day)) return;
    setSelectedDate(new Date(view.year, view.month, day));
    setSelectedTime("");
  };

  const confirmDisabled = !selectedDate || !selectedTime;

  const handleConfirm = () => {
    if (confirmDisabled) return;
    console.log("Reserva:", {
      fecha: selectedDate?.toISOString().slice(0, 10),
      hora: selectedTime,
    });
    alert("¡Cita solicitada con éxito! Recibirá un email de confirmación.");
    navigate("/");
  };

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header superior */}
      <div className="max-w-xl mx-auto px-3 pt-3">
        <Button
          icon={<MoveLeft className="w-3 h-3" />}
          label="Volver al inicio"
          parentMethod={handleReturnInicio}
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
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-blue-200 text-white-600">
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
            <label className="block text-sm font-medium text-gray-800 mb-2">Seleccionar Fecha</label>

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
                  const disabled = isBeforeMinDay(day);
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
              Los turnos están disponibles a partir del{" "}
              {minSelectableDate.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          </div>

          {/* Horarios */}
          {selectedDate && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Horarios Disponibles
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeSlots.map((t) => {
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
                    "Traiga su documento de identidad y credencial de obra social",
                    ]}
                  />
            </div>
      </div>
    </section>
  );
}

