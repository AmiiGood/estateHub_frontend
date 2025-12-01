import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Collapse, Ripple, initTWE } from "tw-elements";

const Contratos = () => {
  const { propiedades } = useLoaderData();
  initTWE({ Collapse, Ripple });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white relative">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Gestión de Contratos
          </h1>
        </div>

        <p className="text-gray-300 text-center mb-10 text-lg">
          Selecciona una propiedad para gestionar sus contratos
        </p>

        {/* Grid de propiedades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {propiedades?.length > 0 ? (
            propiedades.map((prop, index) => {
              const imagenPrincipal =
                prop.imagenes?.[0]?.urlImagen ||
                "https://placehold.co/500x300?text=Sin+Imagen";

              // Verificar si tiene contratos
              const tieneContratos =
                prop.contratos && prop.contratos.length > 0;
              const contratoActivo = prop.contratos?.find((c) => c.estatus);

              return (
                <div
                  key={index}
                  className="group bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={imagenPrincipal}
                      alt={prop.titulo}
                      className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {contratoActivo && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-green-500/90 text-white text-xs font-semibold rounded-full">
                        Con Contrato Activo
                      </span>
                    )}
                  </div>

                  <div className="p-6 text-gray-100">
                    <h3 className="text-2xl font-bold mb-1 truncate drop-shadow-sm">
                      {prop.titulo}
                    </h3>
                    <p className="text-sm text-gray-300 mb-2 truncate">
                      {prop.ciudad || "Ubicación no disponible"}
                    </p>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {prop.descripcion || "Sin descripción."}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-extrabold text-white drop-shadow-sm">
                        ${prop.precioVenta || prop.precioRenta || "0.00"}
                      </span>
                    </div>

                    {/* Información de contratos */}
                    {tieneContratos && (
                      <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">
                          Contratos registrados: {prop.contratos.length}
                        </p>
                        {contratoActivo && (
                          <p className="text-xs text-green-400">
                            Activo hasta:{" "}
                            {new Date(
                              contratoActivo.fechaFin
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Link
                          to={`/agregarContrato/${prop.idPropiedad}`}
                          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm shadow-md transition flex-1 text-center font-semibold"
                        >
                          + Contrato
                        </Link>
                        <Link
                          to={`/propiedad/${prop.idPropiedad}`}
                          className="px-4 py-2 rounded-lg bg-[#1F2A37] hover:bg-[#273445] text-white text-sm shadow-md transition flex-1 text-center"
                        >
                          Ver Propiedad
                        </Link>
                      </div>

                      {tieneContratos && (
                        <div className="flex gap-2">
                          <Link
                            to={`/contrato/${
                              contratoActivo?.idContrato ||
                              prop.contratos[0].idContrato
                            }`}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-md transition flex-1 text-center"
                          >
                            Ver Contrato
                          </Link>
                          <Link
                            to={`/editarContrato/${
                              contratoActivo?.idContrato ||
                              prop.contratos[0].idContrato
                            }`}
                            className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm shadow-md transition flex-1 text-center"
                          >
                            Editar Contrato
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-300 text-center col-span-full text-lg">
              No se encontraron propiedades.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contratos;

export const loaderContratos = async ({ request }) => {
  const API = `http://localhost:3000/api/propiedades`;

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const idUsuario = user?.usuario?.idUsuario;
  const token = user?.token;

  if (!idUsuario || !token) {
    throw new Error("No hay usuario autenticado");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    // Obtener propiedades del usuario
    const res = await fetch(`${API}/getPropiedadesByUsuario/${idUsuario}`, {
      headers,
    });

    if (!res.ok) {
      throw new Error("Error al cargar propiedades");
    }

    const data = await res.json();
    const propiedades = data.data || [];

    // Para cada propiedad, obtener sus contratos
    const propiedadesConContratos = await Promise.all(
      propiedades.map(async (prop) => {
        try {
          const contratosRes = await fetch(
            `http://localhost:3000/api/contratos/getContratosByPropiedad/${prop.idPropiedad}`,
            { headers }
          );

          if (contratosRes.ok) {
            const contratosData = await contratosRes.json();
            return {
              ...prop,
              contratos: contratosData.data || [],
            };
          }

          return {
            ...prop,
            contratos: [],
          };
        } catch (error) {
          console.error(
            `Error al cargar contratos de propiedad ${prop.idPropiedad}:`,
            error
          );
          return {
            ...prop,
            contratos: [],
          };
        }
      })
    );

    return {
      propiedades: propiedadesConContratos,
    };
  } catch (error) {
    console.error("Error en loaderContratos:", error);
    return {
      propiedades: [],
    };
  }
};
