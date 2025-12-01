import React, { useContext, useState } from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";
import GastosMContext from "../contexts/GastosM/GastosMContext";
import {
    Collapse,
    Ripple,
    initTWE,
} from "tw-elements";

const GastosMantenimiento = () => {
    const { gastos } = useLoaderData();
    initTWE({ Collapse, Ripple });

    const { deleteGasto } = useContext(GastosMContext);

    // ESTADOS PARA ALERTAS Y CONFIRMACIÓN
    const [alert, setAlert] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null); // { id, concepto }

    const askDelete = (id, concepto) => {
        setConfirmDelete({ id, concepto });
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;

        try {
            const res = await deleteGasto(confirmDelete.id);

            if (res?.status === 200) {
                // Mostrar alerta de éxito
                setAlert({
                    type: "success",
                    title: "Gasto eliminado",
                    message: `El gasto "${confirmDelete.concepto}" se eliminó correctamente.`,
                });

                setConfirmDelete(null);
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (error) {
            setAlert({
                type: "error",
                title: "Error al eliminar",
                message: "No se pudo eliminar el gasto.",
            });
            setConfirmDelete(null);
        }
    };

    // Auto-ocultar alertas después de 3 segundos
    React.useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white py-16 px-6">

            {/* CONTENEDOR PRINCIPAL DE ALERTAS - Posicionado fijo */}
            <div className="fixed top-4 right-4 z-50 max-w-md w-full">
                {/* ALERTA DE ÉXITO */}
                {alert?.type === "success" && (
                    <div className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 mb-3 shadow-lg animate-fade-in">
                        <div className="flex items-start">
                            <div className="shrink-0">
                                <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800">
                                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                        <path d="m9 12 2 2 4-4"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="ms-3">
                                <h3 className="text-gray-800 font-semibold">
                                    {alert.title}
                                </h3>
                                <p className="text-sm text-gray-700">
                                    {alert.message}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ALERTA DE ERROR */}
                {alert?.type === "error" && (
                    <div className="bg-red-50 border-s-4 border-red-500 p-4 mb-3 shadow-lg animate-fade-in">
                        <div className="flex items-start">
                            <div className="shrink-0">
                                <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800">
                                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18"></path>
                                        <path d="m6 6 12 12"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="ms-3">
                                <h3 className="text-gray-800 font-semibold">
                                    Error
                                </h3>
                                <p className="text-sm text-gray-700">
                                    {alert.message || 'No se pudo completar la acción.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE CONFIRMACIÓN - IDÉNTICO AL DE USUARIOS */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white text-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full mr-3 bg-red-100">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Eliminar Gasto
                            </h2>
                        </div>

                        <p className="text-gray-700 mb-6">
                            ¿Estás seguro de eliminar el gasto "{confirmDelete.concepto}"?
                            <span className="block text-sm text-gray-500 mt-1">
                                Esta acción no se puede deshacer.
                            </span>
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors duration-200"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-5 py-2.5 rounded-lg text-white font-medium transition-colors duration-200 bg-red-600 hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* ENCABEZADO - IDÉNTICO AL DE USUARIOS */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Gastos de <span className="text-[#D0D5DD]">Mantenimiento</span>
                    </h1>

                </div>

                {/* CONTENEDOR DE TABLA - IDÉNTICO AL DE USUARIOS */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                    <table className="w-full text-sm text-left text-white">
                        <thead className="bg-white/10 text-white uppercase text-xs tracking-wide border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Concepto</th>
                                <th className="px-6 py-4">Monto</th>
                                <th className="px-6 py-4">Proveedor</th>
                                <th className="px-6 py-4">Fecha Gasto</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {gastos?.length > 0 ? (
                                gastos.map((gasto, index) => (
                                    <tr
                                        key={gasto.idGasto}
                                        className={`border-b border-white/10 hover:bg-white/5 transition ${index % 2 === 0 ? "bg-white/5" : "bg-white/[0.02]"
                                            }`}
                                    >
                                        <td className="px-6 py-4 font-medium">{gasto.idGasto}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                {gasto.categoria}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{gasto.concepto}</td>
                                        <td className="px-6 py-4 font-semibold">
                                            <span className="text-green-300">
                                                ${parseFloat(gasto.monto).toLocaleString('es-MX', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{gasto.proveedor || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            {new Date(gasto.fechaGasto).toLocaleDateString('es-MX', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>

                                        {/* ACCIONES - IDÉNTICAS A LAS DE USUARIOS */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Link
                                                    to={`/editarGasto/${gasto.idGasto}`}
                                                    className="px-4 py-2 rounded-lg text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200 text-sm shadow"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    className="px-4 py-2 rounded-lg text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 text-sm shadow"
                                                    onClick={() => askDelete(gasto.idGasto, gasto.concepto)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-8 text-gray-400"
                                    >
                                        No se encontraron gastos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PIE DE PÁGINA INFORMATIVO */}
                {gastos?.length > 0 && (
                    <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
                        <div>
                            Mostrando <span className="font-semibold text-white">{gastos.length}</span> gastos
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            <span>Total de gastos: </span>
                            <span className="font-bold text-white">
                                ${gastos.reduce((sum, gasto) => sum + parseFloat(gasto.monto), 0).toLocaleString('es-MX', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Estilos para animaciones */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default GastosMantenimiento;

export const loaderGastos = async () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const idUsuario = user?.usuario?.idUsuario;
    const email = user?.usuario?.email;
    const token = user?.token;

    if (!idUsuario || !token) {
        return redirect("/");
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Obtener TODOS los gastos
    const resGastos = await fetch(
        `${import.meta.env.VITE_API_URL}/gastosMantenimiento/getGastosMantenimiento`,
        { headers }
    );

    const dataGastos = await resGastos.json();
    const gastos = dataGastos.data || [];

    // SUPER ADMIN -> puede ver todos
    if (email === "alexis@gmail.com") {
        return { gastos };
    }

    // Obtener PROPIEDADES del usuario
    const resProps = await fetch(
        `${import.meta.env.VITE_API_URL}/propiedades/getPropiedadesByUsuario/${idUsuario}`,
        { headers }
    );

    const dataProps = await resProps.json();
    const propiedadesUsuario = dataProps.data || [];

    const idsPropiedades = propiedadesUsuario.map(p => p.idPropiedad);

    // Filtrar gastos por idPropiedad
    const gastosFiltrados = gastos.filter(g =>
        idsPropiedades.includes(g.idPropiedad)
    );

    return { gastos: gastosFiltrados };
};