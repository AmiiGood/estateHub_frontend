import { useAuth } from "../contexts/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import ContContext from "../contexts/Contrato/ContContext";
import PropContext from "../contexts/Propiedad/PropContext";
import { useNavigate, useParams } from "react-router-dom";
import { Collapse, Ripple, initTWE } from "tw-elements";
import axios from "axios";

const FormCont = () => {
  const { user, getIdUsuario } = useAuth();
  initTWE({ Collapse, Ripple });
  const { postCont, putCont, getCont, selectedCont } = useContext(ContContext);
  const { getProp, selectedProp } = useContext(PropContext);
  const { id, idPropiedad } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false);
  const [propiedad, setPropiedad] = useState(null);
  const [contratoActivo, setContratoActivo] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const [formDataState, setFormDataState] = useState({
    idPropiedad: idPropiedad || "",
    fechaInicio: "",
    fechaFin: "",
    montoMensual: "",
    deposito: "",
  });

  const [documento, setDocumento] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState({
      ...formDataState,
      [name]: value,
    });
  };

  const handleDocumentoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setMensajeError("Solo se permiten archivos PDF, DOC o DOCX");
        setMostrarError(true);
        e.target.value = null;
        return;
      }

      // Validar tamaño (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMensajeError("El archivo no debe superar los 10MB");
        setMostrarError(true);
        e.target.value = null;
        return;
      }

      setDocumento(file);
    }
  };

  // Verificar si hay un contrato activo
  useEffect(() => {
    const verificarContratoActivo = async () => {
      const propId = idPropiedad || formDataState.idPropiedad;
      if (propId && !isEditing) {
        try {
          const storedUser = localStorage.getItem("user");
          const userData = storedUser ? JSON.parse(storedUser) : null;
          const token = userData?.token;

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/contratos/getContratosByPropiedad/${propId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const contratos = data.data || [];
            const activo = contratos.find((c) => c.estatus === true);

            if (activo) {
              const fechaFin = new Date(activo.fechaFin);
              const hoy = new Date();

              // Verificar si el contrato sigue vigente
              if (fechaFin > hoy) {
                setContratoActivo(activo);
              }
            }
          }
        } catch (error) {
          console.error("Error al verificar contrato activo:", error);
        }
      }
    };

    verificarContratoActivo();
  }, [idPropiedad, formDataState.idPropiedad, isEditing]);

  // Cargar información de la propiedad
  useEffect(() => {
    const loadPropiedadData = async () => {
      const propId = idPropiedad || formDataState.idPropiedad;
      if (propId) {
        try {
          const res = await getProp(propId);
          if (selectedProp) {
            setPropiedad(selectedProp);
          }
        } catch (error) {
          console.error("Error al cargar propiedad:", error);
        }
      }
    };

    loadPropiedadData();
  }, [idPropiedad, getProp, selectedProp, formDataState.idPropiedad]);

  // Cargar datos del contrato cuando es edición
  useEffect(() => {
    const loadContratoData = async () => {
      if (id && !hasLoaded.current) {
        try {
          setLoading(true);
          setIsEditing(true);
          hasLoaded.current = true;
          await getCont(id);
        } catch (error) {
          console.error("Error al cargar contrato:", error);
          setMensajeError("Error al cargar los datos del contrato");
          setMostrarError(true);
        } finally {
          setLoading(false);
        }
      }
    };

    loadContratoData();
  }, [id, getCont]);

  // Actualizar formDataState cuando selectedCont cambie
  useEffect(() => {
    if (selectedCont && isEditing && hasLoaded.current) {
      const newFormDataState = {
        idPropiedad: selectedCont.idPropiedad || "",
        fechaInicio: selectedCont.fechaInicio
          ? selectedCont.fechaInicio.split("T")[0]
          : "",
        fechaFin: selectedCont.fechaFin
          ? selectedCont.fechaFin.split("T")[0]
          : "",
        montoMensual: selectedCont.montoMensual || "",
        deposito: selectedCont.deposito || "",
      };

      setFormDataState((prevFormDataState) => {
        if (
          JSON.stringify(prevFormDataState) !== JSON.stringify(newFormDataState)
        ) {
          return newFormDataState;
        }
        return prevFormDataState;
      });
    }
  }, [selectedCont, isEditing]);

  useEffect(() => {
    return () => {
      hasLoaded.current = false;
    };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar si hay un contrato activo vigente (solo al crear)
    if (!isEditing && contratoActivo) {
      const fechaFinActivo = new Date(contratoActivo.fechaFin);
      const hoy = new Date();

      if (fechaFinActivo > hoy) {
        setMensajeError(
          `Ya existe un contrato activo para esta propiedad que vence el ${fechaFinActivo.toLocaleDateString()}. Debes esperar a que finalice o desactivarlo antes de crear uno nuevo.`
        );
        setMostrarError(true);
        return;
      }
    }

    // Validar fechas
    const fechaInicio = new Date(formDataState.fechaInicio);
    const fechaFin = new Date(formDataState.fechaFin);

    if (fechaFin <= fechaInicio) {
      setMensajeError(
        "La fecha de fin debe ser posterior a la fecha de inicio"
      );
      setMostrarError(true);
      return;
    }

    // Validar montos
    if (parseFloat(formDataState.montoMensual) <= 0) {
      setMensajeError("El monto mensual debe ser mayor a 0");
      setMostrarError(true);
      return;
    }

    if (parseFloat(formDataState.deposito) < 0) {
      setMensajeError("El depósito no puede ser negativo");
      setMostrarError(true);
      return;
    }

    // Validar documento en modo creación
    if (!isEditing && !documento) {
      setMensajeError("Debes subir un documento del contrato");
      setMostrarError(true);
      return;
    }

    setMostrarConfirmacion(true);
  };

  const confirmarGuardado = async () => {
    setMostrarConfirmacion(false);
    setLoading(true);

    const idUsuario = getIdUsuario();

    try {
      let response;

      if (isEditing) {
        // Si hay un documento nuevo, usar FormData, si no, usar JSON
        if (documento) {
          const formData = new FormData();

          const contratoData = {
            idContrato: parseInt(id),
            idUsuario: parseInt(idUsuario),
            idPropiedad: parseInt(formDataState.idPropiedad),
            fechaInicio: formDataState.fechaInicio,
            fechaFin: formDataState.fechaFin,
            montoMensual: parseFloat(formDataState.montoMensual),
            deposito: parseFloat(formDataState.deposito),
            estatus: true,
          };

          formData.append("contrato", JSON.stringify(contratoData));
          formData.append("documento", documento);

          const storedUser = localStorage.getItem("user");
          const userData = storedUser ? JSON.parse(storedUser) : null;
          const token = userData?.token;

          response = await axios.put(
            `${import.meta.env.VITE_API_URL}/contratos/putContrato`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          // Sin documento nuevo, solo actualizar datos
          const contratoData = {
            idContrato: parseInt(id),
            idUsuario: parseInt(idUsuario),
            idPropiedad: parseInt(formDataState.idPropiedad),
            fechaInicio: formDataState.fechaInicio,
            fechaFin: formDataState.fechaFin,
            montoMensual: parseFloat(formDataState.montoMensual),
            deposito: parseFloat(formDataState.deposito),
            estatus: true,
          };

          response = await putCont(contratoData);
        }

        setMostrarExito(true);
        setTimeout(() => {
          navigate("/contratos");
        }, 2000);
      } else {
        // Modo creación
        const formData = new FormData();

        const contratoData = {
          idUsuario: parseInt(idUsuario),
          idPropiedad: parseInt(formDataState.idPropiedad),
          fechaInicio: formDataState.fechaInicio,
          fechaFin: formDataState.fechaFin,
          montoMensual: parseFloat(formDataState.montoMensual),
          deposito: parseFloat(formDataState.deposito),
          estatus: true,
        };

        formData.append("contrato", JSON.stringify(contratoData));
        formData.append("documento", documento);

        const storedUser = localStorage.getItem("user");
        const userData = storedUser ? JSON.parse(storedUser) : null;
        const token = userData?.token;

        if (!token) {
          throw new Error("No autorizado");
        }

        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/contratos/postContrato`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setMostrarExito(true);
        setTimeout(() => {
          navigate("/contratos");
        }, 2000);
      }
    } catch (error) {
      console.error(
        `Error al ${isEditing ? "actualizar" : "registrar"} contrato:`,
        error
      );
      let errorMessage = `Hubo un error al ${isEditing ? "actualizar" : "registrar"
        } el contrato.`;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMensajeError(errorMessage);
      setMostrarError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
          <p className="mt-4">Cargando...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {isEditing ? "Editar" : "Registro de"}{" "}
            <span className="text-[#D0D5DD]">Contrato</span>
          </h2>
          <p className="text-[#98A2B3] text-lg">
            {isEditing
              ? "Actualiza la información del contrato"
              : "Completa la información para registrar un nuevo contrato"}
          </p>

          {/* Alerta de contrato activo */}
          {!isEditing && contratoActivo && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg inline-block">
              <p className="text-sm text-yellow-300">
                <strong>⚠️ Atención:</strong> Esta propiedad tiene un contrato
                activo hasta el{" "}
                {new Date(contratoActivo.fechaFin).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Información de la propiedad */}
          {(propiedad || selectedProp) && (
            <div className="mt-6 p-4 bg-white/10 rounded-lg inline-block">
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Propiedad:</span>{" "}
                {(propiedad || selectedProp)?.titulo}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {(propiedad || selectedProp)?.direccion},{" "}
                {(propiedad || selectedProp)?.ciudad}
              </p>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white text-[#101828] rounded-2xl shadow-2xl p-10 space-y-8"
        >
          {/* Datos del Contrato */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
              Información del Contrato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monto Mensual <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="montoMensual"
                  placeholder="Monto Mensual"
                  value={formDataState.montoMensual}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Depósito <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="deposito"
                  placeholder="Depósito"
                  value={formDataState.deposito}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formDataState.fechaInicio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formDataState.fechaFin}
                  onChange={handleChange}
                  required
                  min={formDataState.fechaInicio}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Documento */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
              Documento del Contrato
            </h3>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isEditing
                  ? "Actualizar Documento (Opcional)"
                  : "Cargar Documento *"}
              </label>
              <input
                type="file"
                name="documento"
                accept=".pdf,.doc,.docx"
                onChange={handleDocumentoChange}
                required={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
              />
              {documento && (
                <p className="text-sm text-green-600">
                  Documento seleccionado: {documento.name}
                </p>
              )}
              <p className="text-sm text-gray-600">
                Formatos aceptados: PDF, DOC, DOCX (Máximo 10MB)
              </p>
              {isEditing && !documento && (
                <p className="text-sm text-blue-600">
                  Si no seleccionas un nuevo documento, se mantendrá el actual
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-center pt-8">
            <button
              type="button"
              onClick={() => navigate("/contratos")}
              className="px-10 py-4 bg-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-400 transition-all duration-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-[#101828] to-[#182230] text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Procesando..."
                : isEditing
                  ? "Actualizar Contrato"
                  : "Guardar Contrato"}
            </button>
          </div>

          {/* Información adicional */}
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>* Campos obligatorios</p>
          </div>
        </form>
      </div>

      {/* Modal de Confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white text-[#101828] rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Confirmar Acción</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas{" "}
              {isEditing ? "actualizar" : "registrar"} este contrato?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarGuardado}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Confirmar
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
                  ¡Operación exitosa!
                </h3>
                <p className="text-sm text-gray-700">
                  El contrato se ha {isEditing ? "actualizado" : "registrado"}{" "}
                  correctamente. Redirigiendo...
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
    </section>
  );
};

export default FormCont;
