import React, { useContext, useState } from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";
import GastosMContext from "../contexts/GastosM/GastosMContext";
import {
    Collapse,
    Ripple,
    initTWE,
} from "tw-elements";

const GastosMantenimiento = () => {
    const { gastos } = useLoaderData(); // VIENE DEL LOADER
    initTWE({ Collapse, Ripple });

    const { deleteGasto } = useContext(GastosMContext);

    // ALERTAS Y CONFIRMACIONES
    const [alert, setAlert] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const askDelete = (id) => setConfirmDelete(id);

    const handleDelete = async () => {
        try {
            const res = await deleteGasto(confirmDelete);

            if (res?.status === 200) {
                setAlert({
                    type: "success",
                    title: "Gasto eliminado",
                    message: "El gasto se eliminó correctamente.",
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white py-16 px-6">

            {/* ALERTA ÉXITO */}
            {alert?.type === "success" && (
                <div class="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30">
                    <div class="flex">
                        <span class="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800">
                            ✔
                        </span>
                        <div class="ms-3">
                            <h3 class="text-gray-800 font-semibold">Gasto eliminado</h3>
                            <p class="text-sm text-gray-700">Se eliminó correctamente.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ALERTA ERROR */}
            {alert?.type === "error" && (
                <div class="bg-red-50 border-s-4 border-red-500 p-4 dark:bg-red-800/30">
                    <div class="flex">
                        <span class="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800">
                            X
                        </span>
                        <div class="ms-3">
                            <h3 class="text-gray-800 font-semibold">Error</h3>
                            <p class="text-sm text-gray-700">No se pudo eliminar el gasto.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white text-gray-900 rounded-xl p-6 max-w-sm w-full shadow-xl">
                        <h2 className="text-xl font-bold mb-2">¿Eliminar gasto?</h2>
                        <p className="text-sm mb-5 text-gray-700">
                            Esta acción no se puede deshacer.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">


                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Gastos de <span className="text-[#D0D5DD]">Mantenimiento</span>
                    </h1>
                </div>

                {/* TABLA */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#344054]">
                    <table className="w-full text-sm text-left text-[#101828]">
                        <thead className="bg-[#F2F4F7] text-[#344054] uppercase text-xs tracking-wide border-b border-gray-300">
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
                                        className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            } hover:bg-gray-100 transition`}
                                    >
                                        <td className="px-6 py-4 font-medium">{gasto.idGasto}</td>
                                        <td className="px-6 py-4">{gasto.categoria}</td>
                                        <td className="px-6 py-4">{gasto.concepto}</td>
                                        <td className="px-6 py-4">${gasto.monto}</td>
                                        <td className="px-6 py-4">{gasto.proveedor}</td>
                                        <td className="px-6 py-4">
                                            {new Date(gasto.fechaGasto).toLocaleDateString()}
                                        </td>

                                        <td className="px-6 py-4 text-center flex gap-3 justify-center">

                                            <Link
                                                to={`/editarGasto/${gasto.idGasto}`}
                                                className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow"
                                            >
                                                Editar
                                            </Link>

                                            <button
                                                className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition shadow"
                                                onClick={() => askDelete(gasto.idGasto)}
                                            >
                                                Eliminar
                                            </button>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        No se encontraron gastos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
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
        throw new Error("No hay usuario autenticado");
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Obtener TODOS los gastos
    const resGastos = await fetch(
        "http://localhost:3000/api/gastosMantenimiento/getGastosMantenimiento",
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
        `http://localhost:3000/api/propiedades/getPropiedadesByUsuario/${idUsuario}`,
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
