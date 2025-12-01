import { Link, redirect, useLoaderData } from "react-router-dom";
import { useState } from "react";

const Citas = () => {
  const { citasCreadas, citasSolicitadas } = useLoaderData();

  // Combinar todas las citas para el calendario
  const todasLasCitas = [...citasCreadas, ...citasSolicitadas];

  // ---- Formatos ----
  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatearHora = (fecha) =>
    new Date(fecha).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Componente reutilizable para mostrar citas
  const ListaCitas = ({ citas, titulo, descripcion }) => (
    <div className="mb-8">
      <h3 className="font-manrope text-2xl leading-tight text-gray-900 mb-1.5">
        {titulo}
      </h3>
      <p className="text-lg font-normal text-gray-600 mb-4">
        {descripcion}
      </p>

      <div className="flex gap-5 flex-col">
        {citas?.length > 0 ? (
          citas.map((cit) => {
            const fecha = formatearFecha(cit.fecha);
            const hora = formatearHora(cit.fecha);

            return (
              <div key={cit.idCita} className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                    <p className="text-base font-medium text-gray-900">
                      {fecha} — {hora}
                    </p>
                  </div>
                </div>

                <h6 className="text-xl leading-8 font-semibold text-black mb-1">
                  Cita en: {cit.propiedad?.titulo || "Propiedad"}
                </h6>

                <p className="text-base font-normal text-gray-600">
                  Estatus:{" "}
                  <span className="capitalize">
                    {cit.estatus.replace("_", " ")}
                  </span>
                </p>
                <br />

                <Link
                  to={`/cita/${cit.idCita}`}
                  className="px-4 py-2 rounded-lg bg-[#1F2A37] hover:bg-[#273445] text-white text-sm shadow-md transition"
                >
                  Ver más
                </Link>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center py-4">
            No se encontraron citas.
          </p>
        )}
      </div>
    </div>
  );

  // ---- Año seleccionado ----
  const yearActual = new Date().getFullYear();
  const [year, setYear] = useState(yearActual);

  // ---- Agrupación por mes/día (usa todasLasCitas) ----
  const citasPorMesDia = todasLasCitas.reduce((acc, cita) => {
    const fecha = new Date(cita.fecha);
    const y = fecha.getFullYear();
    if (y !== year) return acc;

    const mes = fecha.getMonth();
    const dia = fecha.getDate();

    if (!acc[mes]) acc[mes] = {};
    if (!acc[mes][dia]) acc[mes][dia] = [];
    acc[mes][dia].push(cita);

    return acc;
  }, {});

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const generarDiasMes = (mes) => {
    const total = new Date(year, mes + 1, 0).getDate();
    const inicio = new Date(year, mes, 1).getDay();

    const arr = [];
    for (let i = 0; i < inicio; i++) arr.push(null);
    for (let d = 1; d <= total; d++) arr.push(d);
    return arr;
  };

  return (
    <section className="relative bg-stone-50">
      <div className="w-full py-24 relative z-10 backdrop-blur-3xl">
        <div className="w-full max-w-7xl mx-auto px-2 lg:px-8">
          <div className="grid grid-cols-12 gap-8 max-w-4xl mx-auto xl:max-w-full">

            {/* SECCIÓN DE CITAS */}
            <div className="col-span-12 xl:col-span-5">
              <h2 className="font-manrope text-3xl leading-tight text-gray-900 mb-1.5">
                Próximas Citas
              </h2>
              <p className="text-lg font-normal text-gray-600 mb-8">
                No pierdas tu agenda
              </p>

              {/* CITAS CREADAS */}
              <ListaCitas
                citas={citasCreadas}
                titulo="Citas Creadas"
                descripcion="Citas que has solicitado a otras propiedades"
              />

              {/* CITAS SOLICITADAS */}
              <ListaCitas
                citas={citasSolicitadas}
                titulo="Citas Solicitadas"
                descripcion="Citas que te han solicitado de tus propiedades"
              />
            </div>

            {/* CALENDARIO (se mantiene igual pero usando todasLasCitas) */}
            <div className="col-span-12 xl:col-span-7 px-2.5 py-5 sm:p-8 bg-white rounded-2xl">
              <div className="flex justify-between mb-6 items-center">
                <h5 className="text-xl font-semibold text-gray-900">Calendario</h5>
                <select
                  className="border px-3 py-2 rounded-lg"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {Array.from({ length: 5 }, (_, i) => yearActual - 2 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                {meses.map((nombreMes, indexMes) => {
                  const diasMes = generarDiasMes(indexMes);

                  return (
                    <div key={nombreMes} className="border rounded-xl bg-white shadow">
                      <h3 className="text-center py-3 font-semibold bg-indigo-100">
                        {nombreMes} {year}
                      </h3>

                      <div className="grid grid-cols-7 bg-indigo-50 text-xs font-semibold text-indigo-700">
                        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
                          <div key={d} className="py-1 text-center border-b">
                            {d}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 text-xs">
                        {diasMes.map((dia, idx) => (
                          <div
                            key={idx}
                            className={`min-h-[70px] border p-1 relative ${dia ? "bg-white" : "bg-gray-100"
                              }`}
                          >
                            {dia && (
                              <>
                                <span className="font-bold">{dia}</span>
                                {citasPorMesDia[indexMes]?.[dia] &&
                                  citasPorMesDia[indexMes][dia].map((cita) => (
                                    <div key={cita.idCita} className="mt-1 p-1 bg-purple-100 rounded">
                                      <p className="text-[10px] font-semibold text-purple-700">
                                        {formatearHora(cita.fecha)}
                                      </p>
                                      <p className="text-[10px] text-purple-700 truncate">
                                        {cita.propiedad?.titulo}
                                      </p>
                                    </div>
                                  ))}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Citas;

export const loaderCitas = async () => {
  const API = `http://localhost:3000/api/citas`;

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const idUsuario = user?.usuario?.idUsuario;
  const token = user?.token;

  if (!idUsuario || !token) {
    return redirect("/");
  }

  const headers = {
    "Authorization": `Bearer ${token}`,
  };

  const [resCreadas, resResponsable] = await Promise.all([
    fetch(`${import.meta.env.VITE_API_URL}/citas/getCitasByUsuario/${idUsuario}`, { headers }),
    fetch(`${import.meta.env.VITE_API_URL}/citas/getCitasByResponsable/${idUsuario}`, { headers })
  ]);

  const dataCreadas = await resCreadas.json();
  const dataResponsable = await resResponsable.json();

  return {
    citasCreadas: dataCreadas.data || [],
    citasSolicitadas: dataResponsable.data || [],
  };
};
