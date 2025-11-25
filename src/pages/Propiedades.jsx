import React, { } from "react";
import { Link, useLoaderData } from "react-router-dom";
import FormProp from "../components/FormProp";
import {
  Collapse,
  Ripple,
  initTWE,
} from "tw-elements";

const Propiedades = () => {
  const { participantes, buscado } = useLoaderData();
  initTWE({ Collapse, Ripple });



  const propiedades = buscado || participantes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white relative">
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
            aria-controls="collapseExample">
            Agregar propiedad
          </a>

        </div>
        <div
          class="!visible hidden text-center"
          id="collapseExample"
          data-twe-collapse-item>
          <FormProp />
        </div>


        {/* Grid de propiedades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {propiedades?.length > 0 ? (
            propiedades.map((prop, index) => {
              const imagenPrincipal =
                prop.imagenes?.[0]?.urlImagen ||
                "https://placehold.co/500x300?text=Sin+Imagen";


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


                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xl font-extrabold text-white drop-shadow-sm">
                        ${prop.precioVenta || prop.precioRenta || "0.00"}
                      </span>


                      <div className="flex gap-2">
                        <Link
                          to={`/propiedad/${prop.idPropiedad}`}
                          className="px-4 py-2 rounded-lg bg-[#1F2A37] hover:bg-[#273445] text-white text-sm shadow-md transition"
                        >
                          Ver más
                        </Link>
                        <Link
                          to={`/editarProp/${prop.idPropiedad}`}
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-md transition"
                        >
                          Editar
                        </Link>
                      </div>
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

  if (!idUsuario || !token) {
    throw new Error("No hay usuario autenticado");
  }

  const url = new URL(request.url);
  const query = url.searchParams.get("search");

  const headers = {
    "Authorization": `Bearer ${token}`,
  };


  const res1 = await fetch(`${API}/getPropiedadesByUsuario/${idUsuario}`, {
    headers,
  });
  const data1 = await res1.json();

  let resultadoBusqueda = null;


  if (query) {
    const res2 = await fetch(`${API}/getPropiedad?q=${query}`, {
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


