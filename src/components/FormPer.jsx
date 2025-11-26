import { useAuth } from "../contexts/AuthContext";
import { useContext, useState, useEffect } from "react";
import PerContext from "../contexts/Perfil/PerContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const FormPer = ({ usuarioActual, onClose }) => {
  const { logout } = useAuth();
  const { putPer } = useContext(PerContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idUsuario: "",
    email: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (usuarioActual) {
      const userData = {
        idUsuario: usuarioActual.idUsuario || "",
        email: usuarioActual.email || "",
        nombre: usuarioActual.nombre || "",
        apellidoPaterno: usuarioActual.apellidoPaterno || "",
        apellidoMaterno: usuarioActual.apellidoMaterno || "",
        telefono: usuarioActual.telefono || "",
        password: "",
        confirmarPassword: "",
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [usuarioActual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return requirements;
  };

  const validateForm = (dataToValidate) => {
    const newErrors = {};

    if (dataToValidate.nombre !== undefined) {
      if (!dataToValidate.nombre.trim()) {
        newErrors.nombre = "El nombre no puede estar vacío";
      } else if (dataToValidate.nombre.trim().length < 2) {
        newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
      }
    }

    if (dataToValidate.apellidoPaterno !== undefined) {
      if (!dataToValidate.apellidoPaterno.trim()) {
        newErrors.apellidoPaterno = "El apellido paterno no puede estar vacío";
      } else if (dataToValidate.apellidoPaterno.trim().length < 2) {
        newErrors.apellidoPaterno =
          "El apellido paterno debe tener al menos 2 caracteres";
      }
    }

    if (dataToValidate.apellidoMaterno !== undefined) {
      if (!dataToValidate.apellidoMaterno.trim()) {
        newErrors.apellidoMaterno = "El apellido materno no puede estar vacío";
      } else if (dataToValidate.apellidoMaterno.trim().length < 2) {
        newErrors.apellidoMaterno =
          "El apellido materno debe tener al menos 2 caracteres";
      }
    }

    if (dataToValidate.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!dataToValidate.email.trim()) {
        newErrors.email = "El correo electrónico no puede estar vacío";
      } else if (!emailRegex.test(dataToValidate.email)) {
        newErrors.email = "El formato del correo electrónico no es válido";
      }
    }

    if (
      dataToValidate.telefono !== undefined &&
      dataToValidate.telefono.trim()
    ) {
      const telefonoRegex = /^[0-9]{10}$/;
      if (!telefonoRegex.test(dataToValidate.telefono)) {
        newErrors.telefono = "El teléfono debe tener 10 dígitos";
      }
    }

    if (dataToValidate.password !== undefined && formData.password.trim()) {
      const requirements = validatePassword(formData.password);
      if (!requirements.length) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres";
      } else if (!requirements.uppercase) {
        newErrors.password =
          "La contraseña debe contener al menos una letra mayúscula";
      } else if (!requirements.lowercase) {
        newErrors.password =
          "La contraseña debe contener al menos una letra minúscula";
      } else if (!requirements.number) {
        newErrors.password = "La contraseña debe contener al menos un número";
      } else if (!requirements.special) {
        newErrors.password =
          "La contraseña debe contener al menos un carácter especial";
      }

      if (formData.password !== formData.confirmarPassword) {
        newErrors.confirmarPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getChangedFields = () => {
    const changedFields = {
      idUsuario: formData.idUsuario,
    };

    if (formData.nombre !== originalData.nombre) {
      changedFields.nombre = formData.nombre.trim();
    }
    if (formData.apellidoPaterno !== originalData.apellidoPaterno) {
      changedFields.apellidoPaterno = formData.apellidoPaterno.trim();
    }
    if (formData.apellidoMaterno !== originalData.apellidoMaterno) {
      changedFields.apellidoMaterno = formData.apellidoMaterno.trim();
    }
    if (formData.email !== originalData.email) {
      changedFields.email = formData.email.trim();
    }
    if (formData.telefono !== originalData.telefono) {
      changedFields.telefono = formData.telefono.trim();
    }
    if (formData.password && formData.password.trim()) {
      changedFields.password = formData.password;
    }

    return changedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const changedFields = getChangedFields();

    if (Object.keys(changedFields).length === 1) {
      alert("No se han realizado cambios");
      return;
    }

    if (!validateForm(changedFields)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await putPer(changedFields);

      if (response.status === 200) {
        alert("Perfil actualizado correctamente");

        if (changedFields.password) {
          alert(
            "Tu contraseña ha sido actualizada. Por seguridad, debes iniciar sesión nuevamente."
          );
          logout();
          navigate("/");
        } else {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            userData.usuario = {
              ...userData.usuario,
              ...changedFields,
            };
            localStorage.setItem("user", JSON.stringify(userData));
          }

          if (onClose) {
            onClose();
          }

          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);

      if (error.response?.status === 409) {
        setErrors({
          ...errors,
          email: "Este correo electrónico ya está registrado",
        });
      } else if (error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        logout();
        navigate("/");
      } else {
        alert(
          "Hubo un error al actualizar el perfil. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...originalData,
      password: "",
      confirmarPassword: "",
    });
    setErrors({});
    if (onClose) {
      onClose();
    }
  };

  const passwordRequirements = formData.password
    ? validatePassword(formData.password)
    : null;

  return (
    <div className="mt-8">
      <div className="bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Editar Perfil
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#182230] focus:border-transparent transition ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Paterno
                </label>
                <input
                  type="text"
                  name="apellidoPaterno"
                  placeholder="Apellido Paterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#182230] focus:border-transparent transition ${
                    errors.apellidoPaterno
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.apellidoPaterno && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.apellidoPaterno}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  name="apellidoMaterno"
                  placeholder="Apellido Materno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#182230] focus:border-transparent transition ${
                    errors.apellidoMaterno
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.apellidoMaterno && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.apellidoMaterno}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo Electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#182230] focus:border-transparent transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono (10 dígitos)"
                  value={formData.telefono}
                  onChange={handleChange}
                  maxLength="10"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#182230] focus:border-transparent transition ${
                    errors.telefono ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.telefono && (
                  <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                )}
              </div>
            </div>
            {/* Cambiar Contraseña */}

            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Cambiar Contraseña (Opcional)
            </h3>
            <p className="text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              Solo completa estos campos si deseas cambiar tu contraseña.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    name="password"
                    placeholder="Nueva Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#182230] focus:border-transparent transition ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPasswords ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}

                {passwordRequirements && (
                  <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Requisitos de contraseña:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div
                        className={`flex items-center text-xs ${
                          passwordRequirements.length
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <span className="mr-2 text-base">
                          {passwordRequirements.length ? "✓" : "○"}
                        </span>
                        Mínimo 8 caracteres
                      </div>
                      <div
                        className={`flex items-center text-xs ${
                          passwordRequirements.uppercase
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <span className="mr-2 text-base">
                          {passwordRequirements.uppercase ? "✓" : "○"}
                        </span>
                        Una letra mayúscula (A-Z)
                      </div>
                      <div
                        className={`flex items-center text-xs ${
                          passwordRequirements.lowercase
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <span className="mr-2 text-base">
                          {passwordRequirements.lowercase ? "✓" : "○"}
                        </span>
                        Una letra minúscula (a-z)
                      </div>
                      <div
                        className={`flex items-center text-xs ${
                          passwordRequirements.number
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <span className="mr-2 text-base">
                          {passwordRequirements.number ? "✓" : "○"}
                        </span>
                        Un número (0-9)
                      </div>
                      <div
                        className={`flex items-center text-xs md:col-span-2 ${
                          passwordRequirements.special
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <span className="mr-2 text-base">
                          {passwordRequirements.special ? "✓" : "○"}
                        </span>
                        Un carácter especial (!@#$%^&*...)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    name="confirmarPassword"
                    placeholder="Confirmar Nueva Contraseña"
                    value={formData.confirmarPassword}
                    onChange={handleChange}
                    className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#182230] focus:border-transparent transition ${
                      errors.confirmarPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.confirmarPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmarPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-gradient-to-r from-[#101828] to-[#182230] text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPer;
