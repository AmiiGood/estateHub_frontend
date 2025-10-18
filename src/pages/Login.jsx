import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import estateHubLogo from "../assets/estateHubLogoFullWhite.png";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Eye, EyeClosed } from "lucide-react";



const Login = ({ onToggleView }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [engineReady, setEngineReady] = useState(false);


  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
      return;
    }
    const result = await login(formData.email, formData.password);
    if (!result.success) setError(result.error || "Error al iniciar sesión");
  };

  return (
    <div className="min-h-screen flex">
      {/* PANEL IZQUIERDO */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-screen bg-[#0e1036]">
        {engineReady && (
          <Particles
            id="tsparticles"
            className="absolute inset-0"
            options={{
              background: {
                color: { value: "#0e1036" },
              },
              fullScreen: { enable: false },
              fpsLimit: 60,
              particles: {
                number: {
                  value: 70,
                  density: { enable: true, area: 800 },
                },
                color: { value: ["#ffffff", "#60a5fa", "#93c5fd"] },
                opacity: { value: 0.7 },
                size: { value: { min: 1, max: 3 } },
                move: {
                  enable: true,
                  speed: 0.6,
                  direction: "none",
                  random: true,
                  straight: false,
                  outModes: "out",
                },
                links: {
                  enable: true,
                },
                shape: { type: "circle" },
              },
              interactivity: {
                events: {
                  onHover: { enable: true, mode: "repulse" },
                  resize: true,
                },
                modes: {
                  repulse: { distance: 100, duration: 0.3 },
                },
              },
              detectRetina: true,
            }}
          />
        )}

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center mb-10">
            <img
              src={estateHubLogo}
              alt="EstateHubLogo"
              className="w-60 drop-shadow-lg animate-fadeIn"
            />
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-5xl font-bold leading-tight animate-slideUp">
              Gestiona tus propiedades de forma inteligente
            </h1>
            <p className="text-xl text-gray-300">
              La plataforma todo en uno para propietarios e inquilinos
            </p>

            <div className="space-y-4 pt-8">
              {[
                "Control total de tus propiedades",
                "Gestión de pagos automatizada",
                "Reportes y análisis en tiempo real",
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500 mt-12">
            © 2025 EstateHub. Todos los derechos reservados.
          </div>
        </div>
      </div>


      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src={estateHubLogo}
                alt="EstateHubLogo"
                className="w-20 drop-shadow-md"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">EstateHub</h2>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
            <p className="mt-2 text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <div className="flex border-b border-gray-200">
            <button className="flex-1 pb-3 text-center font-medium text-gray-900 border-b-2 border-gray-900">
              Iniciar Sesión
            </button>
            <button
              onClick={onToggleView}
              className="flex-1 pb-3 text-center font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
            >
              Crear Cuenta
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeClosed className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>


              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded cursor-pointer"
                />
                <span>Recordarme</span>
              </label>
              <a href="#" className="text-sm font-medium text-gray-900">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center group"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(20px, -20px) rotate(20deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease both;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 1s ease both;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
