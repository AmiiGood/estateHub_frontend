import React from "react";
import { useLoaderData, Link } from "react-router-dom";

const Propiedad = () => {
  const { propiedad } = useLoaderData();

 
  const imagenPrincipal =
    propiedad?.imagenes?.[0]?.urlImagen ||
    "https://placehold.co/800x400?text=Sin+Imagen";


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Botón regresar */}
        <Link
          to="/propiedades"
          className="inline-block mb-6 px-4 py-2 bg-[#182230] hover:bg-[#101828] rounded-lg transition"
        >
          ← Regresar
        </Link>

        {/* Imagen principal */}
        <div className="w-full h-80 overflow-hidden rounded-2xl shadow-lg mb-8">
          <img
            src={imagenPrincipal}
            alt={propiedad.titulo}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Información general */}
        <h1 className="text-3xl font-bold mb-2">{propiedad.titulo}</h1>

        <p className="text-gray-300 text-lg mb-4">
          {propiedad.ciudad || "Ubicación no disponible"}
        </p>

        <p className="text-gray-400 mb-6 leading-relaxed">
          {propiedad.descripcion || "Sin descripción disponible."}
        </p>

        <div className="text-2xl font-bold text-[#F2F4F7] mb-6">
          ${propiedad.precioVenta || propiedad.precioRenta || "0.00"}
        </div>

        {/* Detalles extra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#182230] p-4 rounded-xl shadow">
            <p className="text-gray-400 text-sm">Tipo de propiedad</p>
            <p className="text-white font-semibold">
              {propiedad.tipo || "No especificado"}
            </p>
          </div>

          <div className="bg-[#182230] p-4 rounded-xl shadow">
            <p className="text-gray-400 text-sm">Estado</p>
            <p className="text-white font-semibold">
              {propiedad.estado || "No especificado"}
            </p>
          </div>

          <div className="bg-[#182230] p-4 rounded-xl shadow">
            <p className="text-gray-400 text-sm">Superficie</p>
            <p className="text-white font-semibold">
              {propiedad.superficie ? propiedad.superficie + " m²" : "No especificado"}
            </p>
          </div>

          <div className="bg-[#182230] p-4 rounded-xl shadow">
            <p className="text-gray-400 text-sm">Habitaciones</p>
            <p className="text-white font-semibold">
              {propiedad.habitaciones || "No especificado"}
            </p>
          </div>
        </div>

        {/* Galería de imágenes extra */}
        {propiedad?.imagenes?.length > 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Galería</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {propiedad.imagenes.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img.urlImagen}
                  alt={`Imagen ${idx + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Propiedad;


export const loaderPropiedad = async ({ params, request }) => {
  const API = `http://localhost:3000/api/propiedades`;

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token;

  if (!token) {
    throw new Error("No hay usuario autenticado");
  }

  const headers = {
    "Authorization": `Bearer ${token}`,
  };

  const res = await fetch(`${API}/getPropiedad/${params.id}`, { headers });
  const data = await res.json();

  return { propiedad: data.data };
};
