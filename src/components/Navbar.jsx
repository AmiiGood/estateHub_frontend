import { useAuth } from "../contexts/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import estateHubLogo from "../assets/estateHubLogoFullWhite.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const isLogged = isAuthenticated();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const email = storedUser?.usuario?.email;
  const isAdmin = email === "alexis@gmail.com";
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const adminRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileDropdownOpen(false);
    setIsOpen(false);
  };

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setAdminDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cerrar todos los dropdowns al cambiar de ruta
  useEffect(() => {
    setProfileDropdownOpen(false);
    setAdminDropdownOpen(false);
  }, [navigate]);

  return (
    <nav className="bg-gradient-to-r from-[#101828] to-[#182230] shadow-xl border-b border-[#2D3748] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo y marca */}
          <div className="flex items-center">
            <NavLink
              to="/home"
              className="flex-shrink-0 flex items-center group"
            >
              <img
                src={estateHubLogo}
                alt="EstateHubLogo"
                className="w-48 drop-shadow-lg transform transition-transform duration-300 group-hover:scale-105"
              />
            </NavLink>
          </div>

          {/* Menú para desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${isActive
                  ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-lg"
                  : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748] hover:shadow-md"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Inicio</span>
            </NavLink>

            <NavLink
              to="/propiedades"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${isActive
                  ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-lg"
                  : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748] hover:shadow-md"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Propiedades</span>
            </NavLink>

            <NavLink
              to="/citas"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${isActive
                  ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-lg"
                  : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748] hover:shadow-md"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Citas</span>
            </NavLink>

            <NavLink
              to="/contratos"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${isActive
                  ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-lg"
                  : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748] hover:shadow-md"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Contratos</span>
            </NavLink>

            <NavLink
              to="/pagos"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${isActive
                  ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-lg"
                  : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748] hover:shadow-md"
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Pagos</span>
            </NavLink>

            {/* Dropdown Admin */}
            {isAdmin && (
              <div className="relative" ref={adminRef}>
                <button
                  onClick={() => {
                    setAdminDropdownOpen(!adminDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${adminDropdownOpen
                    ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-lg"
                    : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748] hover:shadow-md"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${adminDropdownOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {adminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-[#1A202C] to-[#2D3748] rounded-xl shadow-2xl border border-[#4A5568] py-2 z-20 transform transition-all duration-300 origin-top">
                    <div className="px-4 py-3 border-b border-[#4A5568]">
                      <p className="text-sm text-[#CBD5E0]">Administración</p>
                      <p className="text-xs text-[#A0AEC0] mt-1">Panel de control</p>
                    </div>
                    <div className="py-1">
                      <NavLink
                        to="/Usuarios"
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-300 ${isActive
                            ? "bg-[#2D3748] text-white border-l-4 border-blue-500"
                            : "text-[#CBD5E0] hover:bg-[#2D3748] hover:text-white hover:pl-5"
                          }`
                        }
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10 10 0 01-1.343 2.177m-2.5-5.201a10 10 0 012.5 5.201" />
                        </svg>
                        <span>Gestión de Usuarios</span>
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dropdown Perfil */}
            {isLogged && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setAdminDropdownOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${profileDropdownOpen
                    ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-lg"
                    : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748] hover:shadow-md"
                    }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="hidden lg:inline">Mi cuenta</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${profileDropdownOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gradient-to-b from-[#1A202C] to-[#2D3748] rounded-xl shadow-2xl border border-[#4A5568] py-2 z-20 transform transition-all duration-300 origin-top">
                    <div className="px-4 py-3 border-b border-[#4A5568]">
                      <p className="text-sm font-medium text-white">{email || "Usuario"}</p>
                      <p className="text-xs text-[#A0AEC0] mt-1">Bienvenido a EstateHub</p>
                    </div>
                    <div className="py-1">
                      <NavLink
                        to="/perfil"
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-300 ${isActive
                            ? "bg-[#2D3748] text-white border-l-4 border-blue-500"
                            : "text-[#CBD5E0] hover:bg-[#2D3748] hover:text-white hover:pl-5"
                          }`
                        }
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Mi Perfil</span>
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-[#FEB2B2] hover:text-white hover:bg-gradient-to-r hover:from-red-900 hover:to-red-800 w-full text-left transition-all duration-300 hover:pl-5"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#CBD5E0] hover:text-white hover:bg-[#2D3748] focus:outline-none transition-all duration-300"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#1A202C] to-[#2D3748] border-t border-[#4A5568] shadow-2xl">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-4 rounded-lg font-medium transition-all duration-300 ${isActive
                  ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-inner"
                  : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Inicio</span>
            </NavLink>

            <NavLink
              to="/propiedades"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-4 rounded-lg font-medium transition-all duration-300 ${isActive
                  ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-inner"
                  : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Propiedades</span>
            </NavLink>

            <NavLink
              to="/citas"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-4 rounded-lg font-medium transition-all duration-300 ${isActive
                  ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-inner"
                  : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Citas</span>
            </NavLink>

            <NavLink
              to="/contratos"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-4 rounded-lg font-medium transition-all duration-300 ${isActive
                  ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-inner"
                  : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Contratos</span>
            </NavLink>

            <NavLink
              to="/pagos"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-4 rounded-lg font-medium transition-all duration-300 ${isActive
                  ? "bg-gradient-to-r from-[#2D3748] to-[#344054] text-white shadow-inner"
                  : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Pagos</span>
            </NavLink>

            {/* Admin en móvil */}
            {isAdmin && (
              <div className="space-y-1">
                <button
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  className="flex items-center justify-between w-full px-3 py-4 rounded-lg font-medium text-[#CBD5E0] hover:text-white hover:bg-[#2D3748] transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Admin</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${adminDropdownOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {adminDropdownOpen && (
                  <div className="ml-6 space-y-1 border-l-2 border-[#4A5568] pl-3">
                    <NavLink
                      to="/Usuarios"
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-300 ${isActive
                          ? "bg-[#2D3748] text-white"
                          : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748]"
                        }`
                      }
                      onClick={() => {
                        setIsOpen(false);
                        setAdminDropdownOpen(false);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10 10 0 01-1.343 2.177m-2.5-5.201a10 10 0 012.5 5.201" />
                      </svg>
                      <span>Usuarios</span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* Perfil en móvil */}
            {isLogged && (
              <div className="space-y-1">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center justify-between w-full px-3 py-4 rounded-lg font-medium text-[#CBD5E0] hover:text-white hover:bg-[#2D3748] transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {email?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span>Mi cuenta</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${profileDropdownOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <div className="ml-6 space-y-1 border-l-2 border-[#4A5568] pl-3">
                    <NavLink
                      to="/perfil"
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-300 ${isActive
                          ? "bg-[#2D3748] text-white"
                          : "text-[#CBD5E0] hover:text-white hover:bg-[#2D3748]"
                        }`
                      }
                      onClick={() => {
                        setIsOpen(false);
                        setProfileDropdownOpen(false);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Mi Perfil</span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-[#FEB2B2] hover:text-white hover:bg-gradient-to-r hover:from-red-900 hover:to-red-800 w-full text-left transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;