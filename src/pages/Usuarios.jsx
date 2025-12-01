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

    // Función para mostrar alerta
    const showAlert = (type, title, message) => {
        setAlert({ type, title, message });
        setTimeout(() => setAlert(null), 3000); // Auto-ocultar después de 3 segundos
    };

    // Funciones para solicitar confirmación
    const askDelete = (id, nombre) => {
        setConfirmAction({ id, type: 'delete', nombre });
    };

    const askDeactivate = (id, nombre) => {
        setConfirmAction({ id, type: 'deactivate', nombre });
    };

    const askActivate = (id, nombre) => {
        setConfirmAction({ id, type: 'activate', nombre });
    };

    // Función para manejar la acción confirmada
    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        try {
            let res;
            const { id, type, nombre } = confirmAction;

            switch (type) {
                case 'delete':
                    res = await deleteUser(id);
                    if (res?.status === 200) {
                        showAlert('success', 'Usuario eliminado', `El usuario "${nombre}" se eliminó correctamente.`);
                    }
                    break;

                case 'deactivate':
                    res = await toggleUserStatus(id, 0);
                    if (res?.status === 200) {
                        showAlert('success', 'Usuario desactivado', `El usuario "${nombre}" se desactivó correctamente.`);
                    }
                    break;

                case 'activate':
                    res = await toggleUserStatus(id, 1);
                    if (res?.status === 200) {
                        showAlert('success', 'Usuario activado', `El usuario "${nombre}" se activó correctamente.`);
                    }
                    break;

                default:
                    return;
            }

            // Limpiar confirmación
            setConfirmAction(null);

            // Recargar después de éxito
            if (res?.status === 200) {
                setTimeout(() => window.location.reload(), 1500);
            }

        } catch (error) {
            showAlert('error', 'Error', 'No se pudo completar la acción.');
            setConfirmAction(null);
        }
    };

    // Funciones para texto del modal
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
        const nombre = confirmAction.nombre || 'este usuario';

        switch (confirmAction.type) {
            case 'delete':
                return `¿Estás seguro de eliminar a ${nombre}? Esta acción no se puede deshacer.`;
            case 'deactivate':
                return `¿Estás seguro de desactivar a ${nombre}? El usuario no podrá acceder al sistema.`;
            case 'activate':
                return `¿Estás seguro de activar a ${nombre}? El usuario podrá acceder al sistema nuevamente.`;
            default: return '';
        }
    };

    const getActionColor = () => {
        switch (confirmAction?.type) {
            case 'delete': return 'bg-red-600 hover:bg-red-700';
            case 'deactivate': return 'bg-orange-600 hover:bg-orange-700';
            case 'activate': return 'bg-green-600 hover:bg-green-700';
            default: return 'bg-gray-600 hover:bg-gray-700';
        }
    };

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
                                    {alert.message || 'Tu acción no se ha completado.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white text-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all">
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-full mr-3 ${confirmAction.type === 'delete' ? 'bg-red-100' :
                                confirmAction.type === 'deactivate' ? 'bg-orange-100' :
                                    'bg-green-100'
                                }`}>
                                <svg className={`w-6 h-6 ${confirmAction.type === 'delete' ? 'text-red-600' :
                                    confirmAction.type === 'deactivate' ? 'text-orange-600' :
                                        'text-green-600'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {confirmAction.type === 'delete' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    ) : confirmAction.type === 'deactivate' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    )}
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Confirmar acción
                            </h2>
                        </div>

                        <p className="text-gray-700 mb-6">
                            {getActionMessage()}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors duration-200"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleConfirmAction}
                                className={`px-5 py-2.5 rounded-lg text-white font-medium transition-colors duration-200 ${getActionColor()}`}
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
                        className="px-6 py-3 rounded-xl bg-[#1F2A37] text-sm font-semibold uppercase tracking-wide shadow-lg hover:bg-[#273445] transition-all duration-200 border border-white/10 cursor-pointer"
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
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                    <table className="w-full text-sm text-left text-white">
                        <thead className="bg-white/10 text-white uppercase text-xs tracking-wide border-b border-white/10">
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
                                        className={`border-b border-white/10 hover:bg-white/5 transition ${index % 2 === 0 ? "bg-white/5" : "bg-white/[0.02]"}`}
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
                                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                                                    }`}
                                            >
                                                {usuario.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>

                                        {/* ACCIONES */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex gap-2 justify-center">
                                                {usuario.activo ? (
                                                    <button
                                                        className="px-4 py-2 rounded-lg text-white bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-200 text-sm shadow"
                                                        onClick={() => askDeactivate(usuario.idUsuario, `${usuario.nombre} ${usuario.apellidoPaterno}`)}
                                                    >
                                                        Desactivar
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="px-4 py-2 rounded-lg text-white bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 transition-all duration-200 text-sm shadow"
                                                        onClick={() => askActivate(usuario.idUsuario, `${usuario.nombre} ${usuario.apellidoPaterno}`)}
                                                    >
                                                        Activar
                                                    </button>
                                                )}
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
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
        return redirect("/");
    }

    if (email !== "alexis@gmail.com") {
        return redirect("/");
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };


    const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/getAllUsuarios`, { headers });
    const data = await res.json();

    return { usuarios: data.data };
};