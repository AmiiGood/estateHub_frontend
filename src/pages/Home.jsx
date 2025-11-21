import React, { useState } from 'react'
import { Link, useLoaderData, useNavigate } from "react-router-dom";


const Home = () => {
  const { participantes, buscado } = useLoaderData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const propiedades = buscado || participantes;
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#D0D5DD] rounded-full mix-blend-soft-light filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E4E7EC] rounded-full mix-blend-soft-light filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Encuentra tu
              <span className="block bg-gradient-to-r from-[#D0D5DD] to-[#E4E7EC] bg-clip-text text-transparent">
                hogar ideal
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-[#98A2B3] max-w-3xl mx-auto mb-12 leading-relaxed">
              Descubre propiedades exclusivas con tecnología avanzada. 
              Más de 10,000 propiedades premium listadas y actualizadas en tiempo real.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-gradient-to-r from-[#D0D5DD] to-[#E4E7EC] text-[#101828] font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                Explorar Propiedades
              </button>
              <button className="px-8 py-4 border-2 border-[#667085] text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                Ver Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-[#98A2B3] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#98A2B3] rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-[#101828] mb-6">
              Tecnología que transforma
              <span className="block text-[#667085]">tu búsqueda inmobiliaria</span>
            </h2>
            <p className="text-xl text-[#475467] max-w-2xl mx-auto">
              Herramientas inteligentes diseñadas para simplificar y acelerar tu proceso de búsqueda
            </p>
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
                  className="group p-8 rounded-2xl border border-[#E4E7EC] hover:border-[#D0D5DD] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
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
                      <Link 
                        to={`/propiedad/${prop.idPropiedad}`} 
                        className="px-4 py-2 bg-[#182230] text-white rounded-lg text-sm hover:bg-[#101828] transition"
                      >
                        Ver más
                      </Link>
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#101828] to-[#182230] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#D0D5DD] to-[#E4E7EC] bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-[#98A2B3] font-medium text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#101828] mb-8">
            Comienza tu búsqueda hoy
          </h2>
          <p className="text-xl text-[#475467] mb-12 max-w-2xl mx-auto">
            Únete a miles de personas que ya encontraron su hogar ideal con nuestra plataforma
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-[#101828] to-[#182230] text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Crear Cuenta Gratis
            </button>
            <button className="px-8 py-4 border-2 border-[#E4E7EC] text-[#101828] font-semibold rounded-xl hover:border-[#D0D5DD] hover:bg-[#F8F9FA] transition-all duration-300">
              Programar Demo
            </button>
          </div>
        </div>
      </section>

      
    </div>
  )
}



const stats = [
  {
    value: "10K+",
    label: "Propiedades Activas"
  },
  {
    value: "95%",
    label: "Clientes Satisfechos"
  },
  {
    value: "24/7",
    label: "Soporte Disponible"
  },
  {
    value: "50+",
    label: "Ciudades Cubiertas"
  }
];

export default Home

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


