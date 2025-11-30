import UsuarioContext from '../contexts/Usuario/UsuarioContext';
import FormUser from '../components/FormUser';
import React, { useContext, useState } from 'react'
import { Link, redirect, useLoaderData } from "react-router-dom";
import {
    Collapse,
    Ripple,
    initTWE,
} from "tw-elements";


const Usuarios = () => {
    const { usuarios } = useLoaderData();
    initTWE({ Collapse, Ripple });

    const { deleteUser, reactivateUser } = useContext(UsuarioContext);

    // ESTADOS PARA ALERTAS Y CONFIRMACIÓN
    const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }
    const [confirmDelete, setConfirmDelete] = useState(null); // idPropiedad a eliminar

    const askDelete = (id) => {
        setConfirmDelete(id);
    };


    const handleDelete = async () => {
        try {
            const res = await deleteUser(confirmDelete);

            if (res?.status === 200) {
                setAlert({
                    type: "success",
                    title: "Usuario eliminadp",
                    message: "El usuario se eliminó correctamente.",
                });
                setConfirmDelete(null);

                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (error) {
            setAlert({
                type: "error",
                title: "Error al eliminar",
                message: "No se pudo eliminar el usuario.",
            });
            setConfirmDelete(null);
        }
    };
    const handleReactivate = async (id) => {
        try {
            const res = await reactivateUser(id);
            if (res?.status === 200) {
                setAlert({
                    type: "success",
                    title: "Usuario reactivado",
                    message: "El usuario ha sido activado correctamente.",
                }); setTimeout(() => setAlert(null), 1500);
            }
        } catch (error) {
            setAlert({
                type: "error",
                title: "Error al reactivar",
                message: "No se pudo reactivar el usuario.",
            });
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white py-16 px-6">
            {/* ALERTA DE ÉXITO */}
            {alert?.type === "success" && (
                <div class="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30" role="alert" tabindex="-1" aria-labelledby="hs-bordered-success-style-label">
                    <div class="flex">
                        <div class="shrink-0">

                            <span class="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                    <path d="m9 12 2 2 4-4"></path>
                                </svg>
                            </span>

                        </div>
                        <div class="ms-3">
                            <h3 id="hs-bordered-success-style-label" class="text-gray-800 font-semibold dark:text-white">
                                Usuario eliminado exitosamente
                            </h3>
                            <p class="text-sm text-gray-700 dark:text-neutral-400">
                                Has eliminado el usuario exitosamente
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ALERTA DE ERROR */}
            {alert?.type === "error" && (
                <div class="bg-red-50 border-s-4 border-red-500 p-4 dark:bg-red-800/30" role="alert" tabindex="-1" aria-labelledby="hs-bordered-red-style-label">
                    <div class="flex">
                        <div class="shrink-0">

                            <span class="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg>
                            </span>

                        </div>
                        <div class="ms-3">
                            <h3 id="hs-bordered-red-style-label" class="text-gray-800 font-semibold dark:text-white">
                                Error
                            </h3>
                            <p class="text-sm text-gray-700 dark:text-neutral-400">
                                Tu eliminación no se ha completado.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white text-gray-900 rounded-xl p-6 max-w-sm w-full shadow-xl">
                        <h2 className="text-xl font-bold mb-2">¿Eliminar Usuario?</h2>
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

                {/* ENCABEZADO */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Gestión de <span className="text-[#D0D5DD]">Usuarios</span>
                    </h1>

                    <a
                        class="px-6 py-3 rounded-xl bg-[#1F2A37] text-sm font-semibold uppercase tracking-wide shadow-lg hover:bg-[#273445] transition-all duration-200 border border-white/10"
                        data-twe-collapse-init
                        data-twe-ripple-init
                        data-twe-ripple-color="light"
                        href="#collapseExample"
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseExample">
                        Agregar Usuario
                    </a>
                </div>
                <div
                    class="!visible hidden text-center"
                    id="collapseExample"
                    data-twe-collapse-item>
                    <FormUser />
                </div>

                {/* CONTENEDOR DE TABLA */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#344054]">
                    <table className="w-full text-sm text-left text-[#101828]">
                        <thead className="bg-[#F2F4F7] text-[#344054] uppercase text-xs tracking-wide border-b border-gray-300">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Apellidos</th>
                                <th className="px-6 py-4">Teléfono</th>
                                <th className="px-6 py-4">Estatus</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {usuarios?.length > 0 ? (
                                usuarios.map((usuario, index) => (
                                    <tr
                                        key={usuario.idUsuario}
                                        className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            } hover:bg-gray-100 transition`}
                                    >
                                        <td className="px-6 py-4 font-medium">{usuario.idUsuario}</td>
                                        <td className="px-6 py-4">{usuario.email}</td>
                                        <td className="px-6 py-4">{usuario.nombre}</td>
                                        <td className="px-6 py-4">
                                            {usuario.apellidoPaterno} {usuario.apellidoMaterno}
                                        </td>
                                        <td className="px-6 py-4">{usuario.telefono}</td>

                                        {/* Estatus */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${usuario.activo
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {usuario.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>

                                        {/* ACCIONES */}
                                        <td className="px-6 py-4 text-center flex gap-3 justify-center">

                                            {/* Botón dinámico */}
                                            {usuario.activo ? (
                                                // BOTÓN ELIMINAR
                                                <button
                                                    className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition shadow"
                                                    onClick={() => askDelete(usuario.idUsuario)}
                                                >
                                                    Eliminar
                                                </button>
                                            ) : (
                                                // BOTÓN REACTIVAR
                                                <button
                                                    className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition shadow"
                                                    onClick={() => handleReactivate(usuario.idUsuario)}
                                                >
                                                    Reactivar
                                                </button>
                                            )}

                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Usuarios


export const loaderUsuario = async ({ request }) => {
    const API = `http://localhost:3000/api/usuarios`;

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.token;
    const email = user?.usuario?.email;

    if (!token) {
        throw new Error("No hay usuario autenticado");
    }


    if (email !== "alexis@gmail.com") {
        return redirect("/");
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const res = await fetch(`${API}/getAllUsuarios`, { headers });
    const data = await res.json();

    return { usuarios: data.data };
};
