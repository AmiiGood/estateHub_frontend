import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import estateHubLogo from "../assets/estateHubLogoFullWhite.png";

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(10);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = "/home";
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E17] via-[#101828] to-[#182230] text-white overflow-hidden relative">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl"></div>

        {/* Patrón de puntos */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Líneas de conexión animadas */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navbar simplificado */}
      <nav className="relative z-20 bg-gradient-to-r from-[#101828]/80 to-[#182230]/80 backdrop-blur-md border-b border-[#344054]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/home" className="flex items-center group">
                <img
                  src={estateHubLogo}
                  alt="EstateHub Logo"
                  className="w-40 transition-transform duration-300 group-hover:scale-105"
                />
              </NavLink>
            </div>

            <div className="flex items-center">
              <NavLink
                to={isAuthenticated() ? "/home" : "/"}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isAuthenticated() ? "Volver al Inicio" : "Ir al Login"}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 lg:py-32">
        <div className="text-center">
          {/* Número 404 animado */}
          <div className="relative mb-8">
            <div className="text-[200px] sm:text-[250px] lg:text-[300px] font-bold tracking-tighter opacity-20 select-none">
              404
            </div>

            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isAnimating ? 'animate-pulse' : ''}`}>
              <div className="text-9xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                404
              </div>
            </div>

            {/* Icono de advertencia flotante */}
            <div className="absolute -top-4 -right-4 sm:right-20 animate-bounce">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mensaje principal */}
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ¡Oops! Página no encontrada
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Parece que has llegado a un lugar que no existe en nuestro mapa de propiedades.
              La página que buscas podría haber sido movida, eliminada o quizás nunca existió.
            </p>







            {/* Botón principal */}
            <NavLink
              to="/home"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a la Página Principal
            </NavLink>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#344054] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">© 2024 EstateHub. Todos los derechos reservados.</p>
              <p className="text-sm text-gray-500 mt-1">Error 404 - Página no encontrada</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Términos</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacidad</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Ayuda</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Animación de partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(20px) translateX(10px); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;