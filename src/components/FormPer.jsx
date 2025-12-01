import { useAuth } from "../contexts/AuthContext";
import { useContext, useState, useEffect } from "react";
import PerContext from "../contexts/Perfil/PerContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";

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
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [confirmacionData, setConfirmacionData] = useState(null);

  useEffect(() => {
    if (usuarioActual) {
      const userData = {
        idUsuario: usuarioActual.idUsuario || "",
        email: usuarioActual.email || "",
        nombre: usuarioActual.nombre || "",
        apellidoPaterno: usuarioActual.apellidoPaterno || "",
        apellidoMaterno: usuarioActual.apellidoMaterno || "",
        telefono: usuarioActual.telefono || "",
        password: "", // Siempre vacío al cargar
        confirmarPassword: "", // Siempre vacío al cargar
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

    // Solo validar contraseña si el usuario la está cambiando (campo no vacío)
    if (
      dataToValidate.password !== undefined &&
      dataToValidate.password.trim()
    ) {
      const requirements = validatePassword(dataToValidate.password);
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

      // Solo validar confirmación si se está cambiando la contraseña
      if (
        dataToValidate.password &&
        (!formData.confirmarPassword ||
          formData.password !== formData.confirmarPassword)
      ) {
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
    // Solo incluir password si el usuario la está cambiando (campo no vacío)
    if (formData.password && formData.password.trim()) {
      changedFields.password = formData.password;
    }

    return changedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const changedFields = getChangedFields();

    if (Object.keys(changedFields).length === 1) {
      setMensajeError("No se han realizado cambios");
      setMostrarError(true);
      return;
    }

    if (!validateForm(changedFields)) {
      return;
    }

    setConfirmacionData(changedFields);
    setMostrarConfirmacion(true);
  };

  const confirmarGuardado = async () => {
    setMostrarConfirmacion(false);
    setIsSubmitting(true);

    try {
      const response = await putPer(confirmacionData);

      if (response.status === 200) {
        setMostrarExito(true);

        if (confirmacionData.password) {
          setTimeout(() => {
            alert(
              "Tu contraseña ha sido actualizada. Por seguridad, debes iniciar sesión nuevamente."
            );
            logout();
            navigate("/");
          }, 2000);
        } else {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            userData.usuario = {
              ...userData.usuario,
              ...confirmacionData,
            };
            localStorage.setItem("user", JSON.stringify(userData));
          }

          setTimeout(() => {
            if (onClose) {
              onClose();
            }
            window.location.reload();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);

      if (error.response?.status === 409) {
        setErrors({
          ...errors,
          email: "Este correo electrónico ya está registrado",
        });
        setMensajeError("Este correo electrónico ya está registrado");
        setMostrarError(true);
      } else if (error.response?.status === 401) {
        setMensajeError(
          "Sesión expirada. Por favor, inicia sesión nuevamente."
        );
        setMostrarError(true);
        setTimeout(() => {
          logout();
          navigate("/");
        }, 3000);
      } else {
        setMensajeError(
          "Hubo un error al actualizar el perfil. Por favor, intenta nuevamente."
        );
        setMostrarError(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...originalData,
      password: "", // Mantener vacío
      confirmarPassword: "", // Mantener vacío
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
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white text-[#101828] rounded-2xl shadow-2xl p-8 space-y-8 mt-8"
      >
        {/* Información Personal */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
            Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido Paterno <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition ${
                  errors.apellidoPaterno ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.apellidoPaterno && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.apellidoPaterno}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido Materno <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition ${
                  errors.apellidoMaterno ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.apellidoMaterno && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.apellidoMaterno}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono (10 dígitos)"
                value={formData.telefono}
                onChange={handleChange}
                maxLength="10"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition ${
                  errors.telefono ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.telefono && (
                <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
              )}
            </div>
          </div>
        </div>

        {/* Cambiar Contraseña (Opcional) */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
            Cambiar Contraseña{" "}
            <span className="text-sm font-normal text-gray-500">
              (Opcional)
            </span>
          </h3>
          <p className="text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            Solo completa estos campos si deseas cambiar tu contraseña. Si no
            deseas cambiarla, déjalos vacíos.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  name="password"
                  placeholder="Dejar vacío para no cambiar"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition ${
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

              {formData.password && passwordRequirements && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Requisitos de contraseña:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      className={`flex items-center text-sm ${
                        passwordRequirements.length
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="mr-2 text-base">
                        {passwordRequirements.length ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </span>
                      Mínimo 8 caracteres
                    </div>
                    <div
                      className={`flex items-center text-sm ${
                        passwordRequirements.uppercase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="mr-2 text-base">
                        {passwordRequirements.uppercase ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </span>
                      Una letra mayúscula (A-Z)
                    </div>
                    <div
                      className={`flex items-center text-sm ${
                        passwordRequirements.lowercase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="mr-2 text-base">
                        {passwordRequirements.lowercase ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </span>
                      Una letra minúscula (a-z)
                    </div>
                    <div
                      className={`flex items-center text-sm ${
                        passwordRequirements.number
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="mr-2 text-base">
                        {passwordRequirements.number ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </span>
                      Un número (0-9)
                    </div>
                    <div
                      className={`flex items-center text-sm md:col-span-2 ${
                        passwordRequirements.special
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="mr-2 text-base">
                        {passwordRequirements.special ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </span>
                      Un carácter especial (!@#$%^&*...)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  name="confirmarPassword"
                  placeholder="Confirmar solo si cambias la contraseña"
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition ${
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
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-center pt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-10 py-4 bg-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-400 transition-all duration-300"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-4 bg-gradient-to-r from-[#101828] to-[#182230] text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

        {/* Información adicional */}
        <div className="text-center text-sm text-gray-500">
          <p>* Campos obligatorios</p>
        </div>
      </form>

      {/* Modal de Confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white text-[#101828] rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Confirmar Cambios</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas actualizar tu perfil?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarGuardado}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de Éxito */}
      {mostrarExito && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div
            className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4"
            role="alert"
          >
            <div className="flex">
              <div className="shrink-0">
                <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800">
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </span>
              </div>
              <div className="ms-3">
                <h3 className="text-gray-800 font-semibold">
                  ¡Perfil actualizado!
                </h3>
                <p className="text-sm text-gray-700">
                  {confirmacionData?.password
                    ? "Tu perfil ha sido actualizado. Por seguridad, serás redirigido para iniciar sesión nuevamente."
                    : "Los cambios se han guardado correctamente. La página se recargará en unos segundos."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de Error */}
      {mostrarError && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-red-50 border-s-4 border-red-500 p-4" role="alert">
            <div className="flex">
              <div className="shrink-0">
                <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800">
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </span>
              </div>
              <div className="ms-3 flex-1">
                <h3 className="text-gray-800 font-semibold">Error!</h3>
                <p className="text-sm text-gray-700">{mensajeError}</p>
              </div>
              <button
                onClick={() => setMostrarError(false)}
                className="ml-2 text-gray-400 hover:text-gray-600 self-start"
                disabled={isSubmitting}
              >
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormPer;
