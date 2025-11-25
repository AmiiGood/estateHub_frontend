import { useLoaderData } from "react-router-dom";

const Citas = () => {
  const { citas } = useLoaderData();

  // Funciones para formatear fecha/hora
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

  // Agrupar citas por día del mes
  const citasPorDia = citas.reduce((acc, cita) => {
    const dia = new Date(cita.fecha).getDate();
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(cita);
    return acc;
  }, {});
  

  return (

    <section className="relative bg-stone-50">
      <div className="bg-sky-400 w-full sm:w-40 h-40 rounded-full absolute top-1 opacity-20 max-sm:right-0 sm:left-56 z-0"></div>
      <div className="bg-emerald-500 w-full sm:w-40 h-24 absolute top-0 -left-0 opacity-20 z-0"></div>
      <div className="bg-purple-600 w-full sm:w-40 h-24 absolute top-40 -left-0 opacity-20 z-0"></div>

      <div className="w-full py-24 relative z-10 backdrop-blur-3xl">
        <div className="w-full max-w-7xl mx-auto px-2 lg:px-8">
          <div className="grid grid-cols-12 gap-8 max-w-4xl mx-auto xl:max-w-full">
            
            {/* ----------------------  CARDS ---------------------- */}
            <div className="col-span-12 xl:col-span-5">
              <h2 className="font-manrope text-3xl leading-tight text-gray-900 mb-1.5">
                Próximas Citas
              </h2>
              <p className="text-lg font-normal text-gray-600 mb-8">
                No pierdas tu agenda
              </p>

              <div className="flex gap-5 flex-col">
                {citas?.length > 0 ? (
                  citas.map((cit) => {
                    const fecha = formatearFecha(cit.fecha);
                    const hora = formatearHora(cit.fecha);

                    return (
                      <div key={cit.idCita} className="p-6 rounded-xl bg-white">
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
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-center col-span-full">
                    No se encontraron citas.
                  </p>
                )}
              </div>
            </div>

            {/* ----------------------  CALENDARIO ---------------------- */}
            <div className="col-span-12 xl:col-span-7 px-2.5 py-5 sm:p-8 bg-gradient-to-b from-white/25 to-white xl:bg-white rounded-2xl max-xl:row-start-1">

              {/* Encabezado */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <h5 className="text-xl leading-8 font-semibold text-gray-900">
                    Enero 2025
                  </h5>
                </div>
              </div>

              
              <div className="border border-indigo-200 rounded-xl">
                <div className="grid grid-cols-7 rounded-t-3xl border-b border-indigo-200">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
                    <div
                      key={d}
                      className="py-3.5 border-r border-indigo-200 bg-indigo-50 flex items-center justify-center text-sm font-medium text-indigo-600"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Días */}
                <div className="grid grid-cols-7 rounded-b-xl">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                    <div
                      key={dia}
                      className="relative flex xl:aspect-square max-xl:min-h-[60px] p-3 bg-white border-r border-b border-indigo-200 transition-all duration-300 hover:bg-indigo-50 cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-gray-900">
                        {dia}
                      </span>

                      {/* Si hay citas este día → se muestran */}
                      {citasPorDia[dia] &&
                        citasPorDia[dia].map((cita) => (
                          <div
                            key={cita.idCita}
                            className="absolute top-8 left-2 right-2 p-1.5 rounded bg-purple-50"
                          >
                            <p className="text-xs font-medium text-purple-600">
                              {formatearHora(cita.fecha)}
                            </p>
                            <p className="text-[10px] text-purple-600">
                              {cita.propiedad?.titulo}
                            </p>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FIN GRID */}
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
    throw new Error("No hay usuario autenticado");
  }

  const headers = {
    "Authorization": `Bearer ${token}`,
  };

  // --- Pedimos ambas citas en paralelo ---
  const [resCreadas, resResponsable] = await Promise.all([
    fetch(`${API}/getCitasByUsuario/${idUsuario}`, { headers }),
    fetch(`${API}/getCitasByResponsable/${idUsuario}`, { headers })
  ]);

  const dataCreadas = await resCreadas.json();
  const dataResponsable = await resResponsable.json();


  const citasUnificadas = [
    ...dataCreadas.data,
    ...dataResponsable.data
  ].reduce((acc, cita) => {
    acc[cita.idCita] = cita; 
    return acc;
  }, {});

  return {
    citas: Object.values(citasUnificadas),
  };
};
