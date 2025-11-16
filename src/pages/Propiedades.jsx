import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import FormProp from "../components/FormProp";

const Propiedades = () => {
  const { participantes, buscado } = useLoaderData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`?search=${search}`);
  };

  const propiedades = buscado || participantes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Propiedades</h1>

          <form onSubmit={handleSearch} className="flex items-center w-full md:w-1/2">
            <input
              type="text"
              placeholder="Buscar propiedad por título o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-3 rounded-l-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#475467]"
            />
            <button
              type="submit"
              className="bg-[#182230] text-white px-5 py-3 rounded-r-xl hover:bg-[#101828] transition"
            >
              Buscar
            </button>
          </form>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {propiedades?.length > 0 ? (
            propiedades.map((prop, index) => {
              const imagenPrincipal =
                prop.imagenes?.[0]?.urlImagen ||
                "https://via.placeholder.com/400x250?text=Sin+Imagen";

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >

                  <img
                    src={imagenPrincipal}
                    alt={prop.titulo}
                    className="w-full h-48 object-cover"
                  />


                  <div className="p-5 text-[#101828]">
                    <h3 className="text-xl font-semibold mb-2 truncate">
                      {prop.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 truncate">
                      {prop.ciudad || "Ubicación no disponible"}
                    </p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {prop.descripcion || "Sin descripción."}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#182230]">
                        ${prop.precioVenta || prop.precioRenta || "0.00"}
                      </span>
                      <button className="px-4 py-2 bg-[#182230] text-white rounded-lg text-sm hover:bg-[#101828] transition">
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-center col-span-full">
              No se encontraron propiedades.
            </p>
          )}
        </div>


        <FormProp />
      </div>
    </div>
  );
};

export default Propiedades;


export const loaderPropiedades = async ({ request }) => {
  const API = `http://localhost:3000/api/propiedades`;
  const url = new URL(request.url);
  const query = url.searchParams.get("search");

  const res1 = await fetch(`${API}/getPropiedadesByUsuario/${request.id}`);
  const data1 = await res1.json();

  let resultadoBusqueda = null;

  if (query) {
    const res2 = await fetch(`${API}/getPropiedad?q=${query}`);
    const data2 = await res2.json();
    resultadoBusqueda = data2.data;
  }

  return {
    participantes: data1.data || [],
    buscado: resultadoBusqueda || null,
  };
};
