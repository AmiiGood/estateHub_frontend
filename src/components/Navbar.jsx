import { useAuth } from "../contexts/AuthContext";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import estateHubLogo from "../assets/estateHubLogoFullWhite.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const isLogged = isAuthenticated();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const email = storedUser?.usuario?.email;
  const isAdmin = email === "alexis@gmail.com";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-[#101828] shadow-lg border-b border-[#344054] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="w-50 drop-shadow-lg animate-fadeIn"
              />
            </NavLink>
          </div>

          {/* Menú para desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#182230] text-white shadow-md"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
            >
              Inicio
            </NavLink>

            <NavLink
              to="/propiedades"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#182230] text-white shadow-md"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
            >
              Propiedades
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/Usuarios"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-[#182230] text-white shadow-md"
                      : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                  }`
                }
              >
                Usuarios
              </NavLink>
            )}

            <NavLink
              to="/citas"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#182230] text-white shadow-md"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
            >
              Citas
            </NavLink>

            <NavLink
              to="/contratos"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-lg font-medium transition-colors duration-300 ${
                  isActive
                    ? "bg-[#344054] text-white"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Contratos
            </NavLink>

            <NavLink
              to="/pagos"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#182230] text-white shadow-md"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
            >
              Pagos
            </NavLink>

            <NavLink
              to="/perfil"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-lg font-medium transition-colors duration-300 ${
                  isActive
                    ? "bg-[#344054] text-white"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Perfil
            </NavLink>

            {isLogged && (
              <button
                className="w-full px-4 py-3 bg-gradient-to-r from-[#D0D5DD] to-[#E4E7EC] text-[#101828] font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#98A2B3] hover:text-white hover:bg-[#344054] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#E4E7EC] transition-colors duration-300"
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
        <div className="md:hidden bg-[#182230] border-t border-[#344054] shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-lg font-medium transition-colors duration-300 ${
                  isActive
                    ? "bg-[#344054] text-white"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </NavLink>

            <NavLink
              to="/propiedades"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-lg font-medium transition-colors duration-300 ${
                  isActive
                    ? "bg-[#344054] text-white"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Propiedades
            </NavLink>

            <NavLink
              to="/citas"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#182230] text-white shadow-md"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
            >
              Citas
            </NavLink>

            <NavLink
              to="/pagos"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#182230] text-white shadow-md"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
            >
              Pagos
            </NavLink>

            <NavLink
              to="/contratos"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-lg font-medium transition-colors duration-300 ${
                  isActive
                    ? "bg-[#344054] text-white"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Contratos
            </NavLink>

            <NavLink
              to="/perfil"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-lg font-medium transition-colors duration-300 ${
                  isActive
                    ? "bg-[#344054] text-white"
                    : "text-[#98A2B3] hover:text-white hover:bg-[#344054]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Perfil
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
