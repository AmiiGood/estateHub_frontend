import React, { useContext, useEffect, useState } from "react";
import { Link, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PerContext from "../contexts/Perfil/PerContext";
import FormPer from "../components/FormPer";

const Perfil = () => {
  const { usuarioData } = useLoaderData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      logout();
      navigate("/");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  if (!usuarioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] flex items-center justify-center">
        <p className="text-white text-xl">
          No se pudo cargar la información del perfil
        </p>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Mi <span className="text-[#D0D5DD]">Perfil</span>
          </h2>
          <p className="text-[#98A2B3] text-lg">
            Gestiona tu información personal
          </p>
        </div>

        {/* Tarjeta de Información del Usuario */}
        <div className="bg-white text-[#101828] rounded-2xl shadow-2xl p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-[#101828] to-[#182230] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {usuarioData.nombre?.charAt(0).toUpperCase() || "U"}
                {usuarioData.apellidoPaterno?.charAt(0).toUpperCase() || "S"}
              </div>
            </div>

            {/* Información */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-3xl font-bold text-[#182230]">
                  {usuarioData.nombre} {usuarioData.apellidoPaterno}{" "}
                  {usuarioData.apellidoMaterno}
                </h3>
                <p className="text-[#475467] text-lg">{usuarioData.email}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="bg-[#F8F9FA] p-4 rounded-lg">
                  <p className="text-sm text-[#475467] mb-1">Teléfono</p>
                  <p className="text-lg font-semibold">
                    {usuarioData.telefono || "No especificado"}
                  </p>
                </div>

                <div className="bg-[#F8F9FA] p-4 rounded-lg">
                  <p className="text-sm text-[#475467] mb-1">
                    Fecha de Registro
                  </p>
                  <p className="text-lg font-semibold">
                    {new Date(usuarioData.fechaRegistro).toLocaleDateString(
                      "es-MX",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div className="bg-[#F8F9FA] p-4 rounded-lg">
                  <p className="text-sm text-[#475467] mb-1">
                    Estado de Cuenta
                  </p>
                  <p className="text-lg font-semibold">
                    {usuarioData.activo ? (
                      <span className="text-green-600">Activa</span>
                    ) : (
                      <span className="text-red-600">Inactiva</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-8 py-3 bg-gradient-to-r from-[#101828] to-[#182230] text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {showForm ? "Ocultar Formulario" : "Editar Perfil"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Edición - Aparece debajo */}
        {showForm && (
          <FormPer usuarioActual={usuarioData} onClose={handleCloseForm} />
        )}
      </div>
    </section>
  );
};

export default Perfil;

// Loader para obtener los datos del usuario
export const loaderPerfil = async () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !user.usuario || !user.token) {
    return redirect("/");
  }

  const idUsuario = user.usuario.idUsuario;
  const token = user.token;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/usuarios/getUsuario/${idUsuario}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener datos del usuario");
    }

    const data = await response.json();

    return {
      usuarioData: data.data,
    };
  } catch (error) {
    console.error("Error en loaderPerfil:", error);
    throw new Response("Error al cargar el perfil", { status: 500 });
  }
};
