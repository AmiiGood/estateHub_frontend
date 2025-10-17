import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import estateHubLogo from "../assets/estateHubLogoOscuro.png";

const Register = ({ onToggleView }) => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const result = await register(name, email, password);
    if (!result.success) setError(result.error || "Error al crear la cuenta");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white text-opacity-60 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
                transform: `scale(${0.6 + Math.random() * 0.8})`,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 11h8v2h-8v8h-2v-8H3v-2h8V3h2v8z" />
              </svg>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center mb-10">
            <img
              src={estateHubLogo}
              alt="EstateHubLogo"
              className="w-48 drop-shadow-lg animate-fadeIn"
            />
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-5xl font-bold leading-tight animate-slideUp">
              Únete a la revolución inmobiliaria
            </h1>
            <p className="text-xl text-gray-300">
              Regístrate y comienza a gestionar tus propiedades con facilidad
            </p>

            <div className="space-y-4 pt-8">
              {[
                "Registra tus propiedades en minutos",
                "Accede a herramientas inteligentes",
                "Conecta con tus inquilinos fácilmente",
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
                  <span className="text-gray-200">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-400 mt-12">
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
            <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
            <p className="mt-2 text-gray-600">
              Completa los campos para registrarte
            </p>
          </div>

          <div className="flex border-b border-gray-200">
            <button
              onClick={onToggleView}
              className="flex-1 pb-3 text-center font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
            >
              Iniciar Sesión
            </button>
            <button className="flex-1 pb-3 text-center font-medium text-gray-900 border-b-2 border-gray-900">
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
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
            </div>

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
                  placeholder="Crea una contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Confirmar contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center group"
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
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

export default Register;
