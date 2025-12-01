import { CalendarDays, Clock, Home, ArrowLeft } from 'lucide-react';
import React from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";

const Cita = () => {
    const { cita } = useLoaderData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white py-10 px-6">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Botón Regresar */}
                <Link
                    to="/Citas"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#182230] hover:bg-[#101828] rounded-lg transition border border-white/10 text-gray-300 hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Regresar
                </Link>

                {/* Encabezado */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        {cita.propiedad?.titulo}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Detalles completos de tu cita programada
                    </p>
                </div>

                {/* Contenedor tipo card glass */}
                <div
                    className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 shadow-lg space-y-8"
                >

                    {/* Fecha */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <CalendarDays className="w-7 h-7 text-indigo-400" />
                            <span className="text-gray-400 uppercase tracking-wider text-sm">
                                Fecha de la cita
                            </span>
                        </div>

                        <p className="text-2xl font-semibold text-white">
                            {new Date(cita.fecha).toLocaleDateString("es-MX", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    {/* Hora */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Clock className="w-7 h-7 text-indigo-400" />
                            <span className="text-gray-400 uppercase tracking-wider text-sm">
                                Hora
                            </span>
                        </div>

                        <p className="text-2xl font-semibold text-indigo-300">
                            {new Date(cita.fecha).toLocaleTimeString("es-MX", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })}{" "}
                            hrs
                        </p>
                    </div>

                    {/* Estatus */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <CircleStatus status={cita.estatus} />
                            <span className="text-gray-400 uppercase tracking-wider text-sm">
                                Estatus
                            </span>
                        </div>

                        <p className="text-xl font-medium text-gray-300">
                            {cita.estatus || "Sin estatus definido."}
                        </p>
                    </div>

                    {/* Datos de Propiedad */}
                    <div className="pt-5 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <Home className="w-7 h-7 text-indigo-400" />
                            <span className="text-gray-400 uppercase tracking-wider text-sm">
                                Propiedad
                            </span>
                        </div>

                        <p className="text-xl font-semibold">
                            ID: {cita.idPropiedad || "No disponible"}
                        </p>

                        <p className="text-gray-300 mt-1">
                            {cita.propiedad?.descripcion || "Sin descripción disponible."}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cita;

/* --- Componente de estatus: círculo de color según estado --- */
const CircleStatus = ({ status }) => {
    const mapColor = {
        pendiente: "bg-yellow-400",
        aprobada: "bg-green-400",
        cancelada: "bg-red-400",
    };

    return (
        <span
            className={`w-3 h-3 rounded-full ${mapColor[status?.toLowerCase()] || "bg-gray-400"
                }`}
        ></span>
    );
};



export const loaderCita = async ({ params, request }) => {
    const API = `http://localhost:3000/api/citas`;

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.token;

    if (!token) {
        return redirect("/");
    }

    const headers = {
        "Authorization": `Bearer ${token}`,
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/citas/getCita/${params.id}`, { headers });
    const data = await res.json();

    return { cita: data.data };
};