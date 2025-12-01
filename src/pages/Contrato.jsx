import React from "react";
import { useLoaderData, Link } from "react-router-dom";

const Contrato = () => {
  const { contrato } = useLoaderData();

  const estatusTexto = contrato.estatus ? "Activo" : "Inactivo";
  const estatusColor = contrato.estatus
    ? "bg-green-500/20 text-green-400 border-green-500/30"
    : "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Botón regresar */}
        <Link
          to="/contratos"
          className="inline-block mb-6 px-4 py-2 bg-[#182230] hover:bg-[#101828] rounded-lg transition"
        >
          Regresar
        </Link>

        {/* Encabezado del contrato */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">
              Contrato #{contrato.idContrato}
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${estatusColor}`}
            >
              {estatusTexto}
            </span>
          </div>

          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Monto Mensual</p>
                <p className="text-white font-bold text-2xl">
                  ${contrato.montoMensual.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Depósito</p>
                <p className="text-white font-semibold text-lg">
                  ${contrato.deposito.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Fecha de Creación</p>
                <p className="text-white font-semibold text-lg">
                  {contrato.fechaCreacion
                    ? new Date(contrato.fechaCreacion).toLocaleDateString(
                        "es-MX",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "No disponible"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Fecha de Inicio</p>
                <p className="text-white font-semibold text-lg">
                  {new Date(contrato.fechaInicio).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Fecha de Fin</p>
                <p className="text-white font-semibold text-lg">
                  {new Date(contrato.fechaFin).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Duración</p>
                <p className="text-white font-semibold text-lg">
                  {Math.ceil(
                    (new Date(contrato.fechaFin) -
                      new Date(contrato.fechaInicio)) /
                      (1000 * 60 * 60 * 24 * 30)
                  )}{" "}
                  meses
                </p>
              </div>
            </div>
          </div>

          {/* Documento del contrato */}
          {contrato.urlDoc && (
            <div className="bg-[#182230] p-6 rounded-2xl border border-white/5">
              <h2 className="text-xl font-semibold mb-3">
                Documento del Contrato
              </h2>
              <a
                href={contrato.urlDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F2A37] hover:bg-[#273445] rounded-lg transition text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Ver documento
              </a>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#182230] p-6 rounded-2xl shadow border border-white/5">
            <p className="text-gray-400 text-sm mb-2">Monto Total</p>
            <p className="text-white font-bold text-2xl">
              $
              {(
                contrato.montoMensual *
                Math.ceil(
                  (new Date(contrato.fechaFin) -
                    new Date(contrato.fechaInicio)) /
                    (1000 * 60 * 60 * 24 * 30)
                )
              ).toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Durante todo el contrato
            </p>
          </div>

          <div className="bg-[#182230] p-6 rounded-2xl shadow border border-white/5">
            <p className="text-gray-400 text-sm mb-2">Días Restantes</p>
            <p className="text-white font-bold text-2xl">
              {Math.max(
                0,
                Math.ceil(
                  (new Date(contrato.fechaFin) - new Date()) /
                    (1000 * 60 * 60 * 24)
                )
              )}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Hasta el fin del contrato
            </p>
          </div>

          <div className="bg-[#182230] p-6 rounded-2xl shadow border border-white/5">
            <p className="text-gray-400 text-sm mb-2">Total con Depósito</p>
            <p className="text-white font-bold text-2xl">
              $
              {(
                contrato.montoMensual *
                  Math.ceil(
                    (new Date(contrato.fechaFin) -
                      new Date(contrato.fechaInicio)) /
                      (1000 * 60 * 60 * 24 * 30)
                  ) +
                contrato.deposito
              ).toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs mt-1">Incluyendo depósito</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to={`/editarContrato/${contrato.idContrato}`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-semibold"
          >
            Editar Contrato
          </Link>
          <Link
            to={`/propiedad/${contrato.idPropiedad}`}
            className="px-6 py-3 bg-[#1F2A37] hover:bg-[#273445] rounded-lg transition font-semibold"
          >
            Ver Propiedad
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contrato;

export const loaderContrato = async ({ params }) => {
  const API = `http://localhost:3000/api/contratos`;

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token;

  if (!token) {
    throw new Error("No hay usuario autenticado");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await fetch(`${API}/getContrato/${params.id}`, { headers });

    if (!res.ok) {
      throw new Error("Error al cargar el contrato");
    }

    const data = await res.json();

    return { contrato: data.data };
  } catch (error) {
    console.error("Error en loaderContrato:", error);
    throw error;
  }
};
