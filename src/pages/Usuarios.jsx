import FormUser from '../components/FormUser';
import React from 'react'
import { Link, redirect, useLoaderData } from "react-router-dom";
import {
    Collapse,
    Ripple,
    initTWE,
} from "tw-elements";


const Usuarios = () => {
    const { usuarios } = useLoaderData();
    initTWE({ Collapse, Ripple });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white py-16 px-6">
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
                        Agregar propiedad
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

                                            {/* Botón Editar */}
                                            <Link
                                                to={`/usuarios/editar/${usuario.idUsuario}`}
                                                className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow"
                                            >
                                                Editar
                                            </Link>

                                            {/* Botón Eliminar */}
                                            <button
                                                onClick={() => console.log("Eliminar", usuario.idUsuario)}
                                                className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition shadow"
                                            >
                                                Eliminar
                                            </button>

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
