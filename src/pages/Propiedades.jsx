import React, { useContext, useState } from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";
import FormProp from "../components/FormProp";
import {
  Collapse,
  Ripple,
  initTWE,
} from "tw-elements";
import PropContext from "../contexts/Propiedad/PropContext";

const Propiedades = () => {
  const { participantes, buscado } = useLoaderData();
  initTWE({ Collapse, Ripple });

  const { users, getUsers, getProp, deleteProp } = useContext(PropContext);

  // ESTADOS PARA ALERTAS Y CONFIRMACIÓN
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }
  const [confirmDelete, setConfirmDelete] = useState(null); // idPropiedad a eliminar

  const askDelete = (id) => {
    setConfirmDelete(id);
  };


  const propiedades = buscado || participantes;

  const handleDelete = async () => {
    try {
      const res = await deleteProp(confirmDelete);

      if (res?.status === 200) {
        setAlert({
          type: "success",
          title: "Propiedad eliminada",
          message: "La propiedad se eliminó correctamente.",
        });
        setConfirmDelete(null);

        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error al eliminar",
        message: "No se pudo eliminar la propiedad.",
      });
      setConfirmDelete(null);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white relative">
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
                Producto eliminado exitosamente
              </h3>
              <p class="text-sm text-gray-700 dark:text-neutral-400">
                Has eliminado el producto exitosamente
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
            <h2 className="text-xl font-bold mb-2">¿Eliminar propiedad?</h2>
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


      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Propiedades
          </h1>

          <a
            class="px-6 py-3 rounded-xl bg-[#1F2A37] text-sm font-semibold uppercase tracking-wide shadow-lg hover:bg-[#273445] transition-all duration-200 border border-white/10"
            data-twe-collapse-init
            data-twe-ripple-init
            data-twe-ripple-color="light"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            Agregar propiedad
          </a>
        </div>
        <div
          class="!visible hidden text-center"
          id="collapseExample"
          data-twe-collapse-item
        >
          <FormProp />
        </div>

        {/* Grid de propiedades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {propiedades?.length > 0 ? (
            propiedades.map((prop, index) => {
              const imagenPrincipal =
                prop.imagenes?.[0]?.urlImagen ||
                "";

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


                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xl font-extrabold text-white drop-shadow-sm">
                        ${prop.precioVenta || prop.precioRenta || "0.00"}
                      </span>
                    </div>
                    <br />



                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                      <Link
                        to={`/propiedad/${prop.idPropiedad}`}
                        className="flex-1 text-center px-4 py-2 rounded-lg bg-[#1F2A37] hover:bg-[#273445] text-white text-sm shadow-md transition"
                      >
                        Ver más
                      </Link>
                      <Link
                        to={`/editarProp/${prop.idPropiedad}`}
                        className="flex-1 text-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-md transition"
                      >
                        Editar
                      </Link>
                      <button
                        className="flex-1 text-center px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm shadow-md transition"
                        onClick={() => askDelete(prop.idPropiedad)}
                      >
                        Eliminar
                      </button>
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

export default Propiedades;

export const loaderPropiedades = async ({ request }) => {
  const API = `http://localhost:3000/api/propiedades`;

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const idUsuario = user?.usuario?.idUsuario;
  const token = user?.token;
  const email = user?.usuario?.email;

  if (!idUsuario || !token) {
    return redirect("/");
  }

  const url = new URL(request.url);
  const query = url.searchParams.get("search");

  const headers = {
    Authorization: `Bearer ${token}`,
  };


  let res1;
  if (email === "alexis@gmail.com") {
    // SUPER ADMIN
    res1 = await fetch(`${import.meta.env.VITE_API_URL}/propiedades/getPropiedades`, { headers });
  } else {
    // USUARIO NORMAL
    res1 = await fetch(`${import.meta.env.VITE_API_URL}/propiedades/getPropiedadesByUsuario/${idUsuario}`, {
      headers,
    });
  }

  const data1 = await res1.json();

  let resultadoBusqueda = null;

  if (query) {
    const res2 = await fetch(`${import.meta.env.VITE_API_URL}/propiedades/getPropiedad?q=${query}`, {
      headers,
    });
    const data2 = await res2.json();
    resultadoBusqueda = data2.data;
  }

  return {
    participantes: data1.data || [],
    buscado: resultadoBusqueda || null,
  };
};


