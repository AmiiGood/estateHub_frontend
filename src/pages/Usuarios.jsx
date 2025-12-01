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

    const { deleteUser, toggleUserStatus } = useContext(UsuarioContext);

    // ESTADOS PARA ALERTAS Y CONFIRMACIÓN
    const [alert, setAlert] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null); // { id, type: 'delete' | 'activate' | 'deactivate' }

    const askDelete = (id) => {
        setConfirmAction({ id, type: 'delete' });
    };

    const askDeactivate = (id) => {
        setConfirmAction({ id, type: 'deactivate' });
    };

    const askActivate = (id) => {
        setConfirmAction({ id, type: 'activate' });
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        try {
            let res;
            let alertConfig;

            switch (confirmAction.type) {
                case 'delete':
                    res = await deleteUser(confirmAction.id);
                    if (res?.status === 200) {
                        alertConfig = {
                            type: "success",
                            title: "Usuario eliminado",
                            message: "El usuario se eliminó correctamente.",
                        };
                    }
                    break;

                case 'deactivate':
                    res = await toggleUserStatus(confirmAction.id, 0);
                    if (res?.status === 200) {
                        alertConfig = {
                            type: "success",
                            title: "Usuario desactivado",
                            message: "El usuario se desactivó correctamente.",
                        };
                    }
                    break;

                case 'activate':
                    res = await toggleUserStatus(confirmAction.id, 1);
                    if (res?.status === 200) {
                        alertConfig = {
                            type: "success",
                            title: "Usuario activado",
                            message: "El usuario se activó correctamente.",
                        };
                    }
                    break;

                default:
                    return;
            }

            if (alertConfig) {
                setAlert(alertConfig);
                setConfirmAction(null);
                setTimeout(() => window.location.reload(), 1500);
            }

        } catch (error) {
            setAlert({
                type: "error",
                title: "Error",
                message: "No se pudo completar la acción.",
            });
            setConfirmAction(null);
        }
    };

    const getActionText = () => {
        if (!confirmAction) return '';
        switch (confirmAction.type) {
            case 'delete': return 'Eliminar';
            case 'deactivate': return 'Desactivar';
            case 'activate': return 'Activar';
            default: return '';
        }
    };

    const getActionMessage = () => {
        if (!confirmAction) return '';
        switch (confirmAction.type) {
            case 'delete': return 'Esta acción no se puede deshacer.';
            case 'deactivate': return 'El usuario no podrá acceder al sistema.';
            case 'activate': return 'El usuario podrá acceder al sistema nuevamente.';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white py-16 px-6">
            {/* ALERTAS */}
            {alert?.type === "success" && (
                <div className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30" role="alert">
                    <div className="flex">
                        <div className="shrink-0">
                            <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                    <path d="m9 12 2 2 4-4"></path>
                                </svg>
                            </span>
                        </div>
                        <div className="ms-3">
                            <h3 className="text-gray-800 font-semibold dark:text-white">
                                {alert.title}
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-neutral-400">
                                {alert.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {alert?.type === "error" && (
                <div className="bg-red-50 border-s-4 border-red-500 p-4 dark:bg-red-800/30" role="alert">
                    <div className="flex">
                        <div className="shrink-0">
                            <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg>
                            </span>
                        </div>
                        <div className="ms-3">
                            <h3 className="text-gray-800 font-semibold dark:text-white">
                                Error
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-neutral-400">
                                Tu acción no se ha completado.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white text-gray-900 rounded-xl p-6 max-w-sm w-full shadow-xl">
                        <h2 className="text-xl font-bold mb-2">¿{getActionText()} Usuario?</h2>
                        <p className="text-sm mb-5 text-gray-700">
                            {getActionMessage()}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleConfirmAction}
                                className={`px-4 py-2 rounded-lg text-white ${confirmAction.type === 'delete'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : confirmAction.type === 'deactivate'
                                        ? 'bg-orange-600 hover:bg-orange-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {getActionText()}
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
                        className="px-6 py-3 rounded-xl bg-[#1F2A37] text-sm font-semibold uppercase tracking-wide shadow-lg hover:bg-[#273445] transition-all duration-200 border border-white/10"
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
                    className="!visible hidden text-center"
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
                                            {usuario.activo ? (
                                                // Usuario ACTIVO - mostrar botón Desactivar
                                                <button
                                                    className="px-4 py-2 rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition shadow"
                                                    onClick={() => askDeactivate(usuario.idUsuario)}
                                                >
                                                    Desactivar
                                                </button>
                                            ) : (
                                                // Usuario INACTIVO - mostrar botón Activar
                                                <button
                                                    className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition shadow"
                                                    onClick={() => askActivate(usuario.idUsuario)}
                                                >
                                                    Activar
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

export default Usuarios;

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