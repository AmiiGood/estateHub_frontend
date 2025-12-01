import React, { useState } from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";
import { Collapse, Ripple, initTWE } from "tw-elements";

const Pagos = () => {
  const { propiedadesConPagos, filtroActivo } = useLoaderData();
  initTWE({ Collapse, Ripple });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState({
    estatus: filtroActivo || "",
    fechaInicio: "",
    fechaFin: "",
  });

  const getEstatusColor = (estatus) => {
    switch (estatus?.toLowerCase()) {
      case "pago_pendiente":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "en_proceso":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "pago_recibido":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getNextEstatus = (estatusActual) => {
    switch (estatusActual?.toLowerCase()) {
      case "pago_pendiente":
        return "en_proceso";
      case "en_proceso":
        return "pago_recibido";
      case "pago_recibido":
        return "pago_recibido";
      default:
        return "pago_pendiente";
    }
  };

  const handleCambiarEstatus = async (idPago, estatusActual) => {
    if (estatusActual?.toLowerCase() === "pago_recibido") {
      return;
    }

    const nuevoEstatus = getNextEstatus(estatusActual);

    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/pagosRenta/patchPagoRenta/${idPago}/estatus`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estatus: nuevoEstatus }),
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Error al actualizar el estatus del pago");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar el estatus");
    }
  };

  const aplicarFiltros = () => {
    const params = new URLSearchParams();
    if (filtros.estatus) params.append("estatus", filtros.estatus);
    if (filtros.fechaInicio) params.append("inicio", filtros.fechaInicio);
    if (filtros.fechaFin) params.append("fin", filtros.fechaFin);

    window.location.href = `/pagos?${params.toString()}`;
  };

  const limpiarFiltros = () => {
    window.location.href = "/pagos";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white relative">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Gestión de Pagos
          </h1>
        </div>

        {/* Grid de Propiedades con Pagos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {propiedadesConPagos?.length > 0 ? (
            propiedadesConPagos.map((propiedad) => {
              const imagenPrincipal =
                propiedad.imagenes?.[0]?.urlImagen ||
                "https://placehold.co/500x300?text=Sin+Imagen";

              return (
                <div
                  key={propiedad.idPropiedad}
                  className="group bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {/* Imagen de la propiedad */}
                  <div className="relative">
                    <img
                      src={imagenPrincipal}
                      alt={propiedad.titulo}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    {/* Info de la Propiedad */}
                    <h3 className="text-2xl font-bold mb-2 truncate">
                      {propiedad.titulo}
                    </h3>
                    <p className="text-sm text-gray-300 mb-4 truncate">
                      {propiedad.ciudad || "Ciudad no disponible"}
                    </p>

                    {/* Info del Contrato */}
                    {propiedad.contrato ? (
                      <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">
                          Contrato Activo
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-400">
                            <span className="font-medium">Inicio:</span>{" "}
                            {new Date(
                              propiedad.contrato.fechaInicio
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-gray-400">
                            <span className="font-medium">Fin:</span>{" "}
                            {new Date(
                              propiedad.contrato.fechaFin
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-gray-400">
                            <span className="font-medium">Renta:</span> $
                            {propiedad.contrato.montoMensual}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                        <p className="text-red-300 text-sm">
                          Sin contrato activo
                        </p>
                      </div>
                    )}

                    {/* Lista de Pagos */}
                    {propiedad.pagos?.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        <h4 className="text-sm font-semibold text-gray-300">
                          Pagos Registrados ({propiedad.pagos.length})
                        </h4>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                          {propiedad.pagos.map((pago) => (
                            <div
                              key={pago.idPago}
                              className="bg-white/5 rounded-lg p-3 border border-white/10"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="text-lg font-bold text-white">
                                    ${pago.monto}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Vence:{" "}
                                    {new Date(
                                      pago.fechaVencimiento
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    handleCambiarEstatus(
                                      pago.idPago,
                                      pago.estatus
                                    )
                                  }
                                  disabled={
                                    pago.estatus?.toLowerCase() ===
                                    "pago_recibido"
                                  }
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${getEstatusColor(
                                    pago.estatus
                                  )} ${pago.estatus?.toLowerCase() !==
                                    "pago_recibido"
                                    ? "cursor-pointer hover:opacity-80"
                                    : "cursor-default"
                                    }`}
                                >
                                  {pago.estatus?.replace("_", " ")}
                                </button>
                              </div>
                              {pago.metodoPago && (
                                <p className="text-xs text-gray-400">
                                  Método: {pago.metodoPago}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                        <p className="text-yellow-300 text-sm">
                          Sin pagos registrados
                        </p>
                      </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="flex gap-2">
                      {propiedad.contrato && (
                        <Link
                          to={`/agregarPago/${propiedad.contrato.idContrato}`}
                          className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm text-center font-semibold shadow-md transition"
                        >
                          Agregar Pago
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-300 text-lg">
                No se encontraron propiedades con contratos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagos;

export const loaderPagos = async ({ request }) => {
  const API_BASE = `http://localhost:3000/api`;

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const idUsuario = user?.usuario?.idUsuario;
  const token = user?.token;

  if (!idUsuario || !token) {
    return redirect("/");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const url = new URL(request.url);
  const estatus = url.searchParams.get("estatus");
  const inicio = url.searchParams.get("inicio");
  const fin = url.searchParams.get("fin");

  try {
    // Obtener propiedades del usuario
    const resPropiedades = await fetch(
      `${import.meta.env.VITE_API_URL}/propiedades/getPropiedadesByUsuario/${idUsuario}`,
      { headers }
    );
    const dataPropiedades = await resPropiedades.json();
    const propiedades = dataPropiedades.data || [];

    // Obtener contratos activos (o por usuario si prefieres)
    const resContratos = await fetch(
      `${import.meta.env.VITE_API_URL}/contratos/getContratosByUsuario/${idUsuario}`,
      { headers }
    );
    const dataContratos = await resContratos.json();
    const contratos = dataContratos.data || [];

    // Obtener pagos según filtros
    let pagos = [];
    if (estatus) {
      const resPagos = await fetch(
        `${import.meta.env.VITE_API_URL}/pagosRenta/getPagosRentaByEstatus/${estatus}`,
        { headers }
      );
      const dataPagos = await resPagos.json();
      pagos = dataPagos.data || [];
    } else if (inicio && fin) {
      const resPagos = await fetch(
        `${import.meta.env.VITE_API_URL}/pagosRenta/getPagosRentaByRangoFechas?inicio=${inicio}&fin=${fin}`,
        { headers }
      );
      const dataPagos = await resPagos.json();
      pagos = dataPagos.data || [];
    } else {
      const resPagos = await fetch(`${import.meta.env.VITE_API_URL}/pagosRenta/getPagosRenta`, {
        headers,
      });
      const dataPagos = await resPagos.json();
      pagos = dataPagos.data || [];
    }

    // Combinar datos
    const propiedadesConPagos = propiedades.map((propiedad) => {
      const contrato = contratos.find(
        (c) => c.idPropiedad === propiedad.idPropiedad
      );
      const pagosProp = contrato
        ? pagos.filter((p) => p.idContrato === contrato.idContrato)
        : [];

      return {
        ...propiedad,
        contrato: contrato || null,
        pagos: pagosProp,
      };
    });

    return {
      propiedadesConPagos,
      filtroActivo: estatus || null,
    };
  } catch (error) {
    console.error("Error al cargar datos:", error);
    return {
      propiedadesConPagos: [],
      filtroActivo: null,
    };
  }
};
