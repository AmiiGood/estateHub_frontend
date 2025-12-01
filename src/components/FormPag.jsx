import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PagContext from "../contexts/Pago/PagContext";

const FormPag = () => {
  const { postPago, putPago, getPago, selectedPago } = useContext(PagContext);
  const { idContrato, idPago } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contratoInfo, setContratoInfo] = useState(null);
  const [pagosExistentes, setPagosExistentes] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const [formData, setFormData] = useState({
    idContrato: idContrato || "",
    monto: "",
    fechaVencimiento: "",
    fechaPago: "",
    metodoPago: "",
    referencia: "",
    notas: "",
  });

  // Cargar información del contrato y pagos existentes
  useEffect(() => {
    const cargarContrato = async () => {
      if (idContrato) {
        try {
          const storedUser = localStorage.getItem("user");
          const userData = storedUser ? JSON.parse(storedUser) : null;
          const token = userData?.token;

          // Cargar información del contrato
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/contratos/getContrato/${idContrato}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setContratoInfo(data.data);
            setFormData((prev) => ({
              ...prev,
              monto: data.data.montoMensual || "",
            }));
          }

          // Cargar pagos existentes del contrato
          const resPagos = await fetch(
            `${import.meta.env.VITE_API_URL}/pagosRenta/getPagosRentaByContrato/${idContrato}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (resPagos.ok) {
            const dataPagos = await resPagos.json();
            setPagosExistentes(dataPagos.data || []);
          }
        } catch (error) {
          console.error("Error al cargar contrato:", error);
        }
      }
    };

    cargarContrato();
  }, [idContrato]);

  // Cargar datos del pago si es edición
  useEffect(() => {
    const cargarPago = async () => {
      if (idPago) {
        try {
          setLoading(true);
          setIsEditing(true);
          await getPago(idPago);
        } catch (error) {
          console.error("Error al cargar pago:", error);
          setMensajeError("Error al cargar los datos del pago");
          setMostrarError(true);
        } finally {
          setLoading(false);
        }
      }
    };

    cargarPago();
  }, [idPago, getPago]);

  // Actualizar formData cuando selectedPago cambie
  useEffect(() => {
    if (selectedPago && isEditing) {
      setFormData({
        idContrato: selectedPago.idContrato || "",
        monto: selectedPago.monto || "",
        fechaVencimiento: selectedPago.fechaVencimiento
          ? selectedPago.fechaVencimiento.split("T")[0]
          : "",
        fechaPago: selectedPago.fechaPago
          ? selectedPago.fechaPago.split("T")[0]
          : "",
        metodoPago: selectedPago.metodoPago || "",
        referencia: selectedPago.referencia || "",
        notas: selectedPago.notas || "",
      });
    }
  }, [selectedPago, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.monto || !formData.fechaVencimiento) {
      setMensajeError("Por favor completa los campos obligatorios");
      setMostrarError(true);
      return;
    }

    // Validar que la fecha de vencimiento esté dentro del rango del contrato
    if (contratoInfo) {
      const fechaVencimiento = new Date(formData.fechaVencimiento);
      const fechaInicio = new Date(contratoInfo.fechaInicio);
      const fechaFin = new Date(contratoInfo.fechaFin);

      if (fechaVencimiento < fechaInicio || fechaVencimiento > fechaFin) {
        setMensajeError(
          `La fecha de vencimiento debe estar entre ${new Date(
            contratoInfo.fechaInicio
          ).toLocaleDateString()} y ${new Date(
            contratoInfo.fechaFin
          ).toLocaleDateString()}`
        );
        setMostrarError(true);
        return;
      }
    }

    // Validar fecha de pago si está presente
    if (formData.fechaPago && contratoInfo) {
      const fechaPago = new Date(formData.fechaPago);
      const fechaInicio = new Date(contratoInfo.fechaInicio);
      const fechaFin = new Date(contratoInfo.fechaFin);

      if (fechaPago < fechaInicio || fechaPago > fechaFin) {
        setMensajeError(
          `La fecha de pago debe estar entre ${new Date(
            contratoInfo.fechaInicio
          ).toLocaleDateString()} y ${new Date(
            contratoInfo.fechaFin
          ).toLocaleDateString()}`
        );
        setMostrarError(true);
        return;
      }
    }

    // Validar que no exista un pago del mismo mes/año
    const fechaVencimientoActual = new Date(formData.fechaVencimiento);
    const mesActual = fechaVencimientoActual.getMonth();
    const anioActual = fechaVencimientoActual.getFullYear();

    const pagoDelMismoMes = pagosExistentes.find((pago) => {
      // Si estamos editando, excluir el pago actual de la validación
      if (isEditing && pago.idPago === parseInt(idPago)) {
        return false;
      }

      const fechaPagoExistente = new Date(pago.fechaVencimiento);
      return (
        fechaPagoExistente.getMonth() === mesActual &&
        fechaPagoExistente.getFullYear() === anioActual
      );
    });

    if (pagoDelMismoMes) {
      setMensajeError(
        `Ya existe un pago registrado para ${fechaVencimientoActual.toLocaleDateString(
          "es-ES",
          { month: "long", year: "numeric" }
        )}. Por favor selecciona un mes diferente.`
      );
      setMostrarError(true);
      return;
    }

    // Validar que no exista la misma fecha de vencimiento exacta
    const fechaVencimientoExacta = pagosExistentes.find((pago) => {
      // Si estamos editando, excluir el pago actual de la validación
      if (isEditing && pago.idPago === parseInt(idPago)) {
        return false;
      }

      const fechaExistente = new Date(pago.fechaVencimiento)
        .toISOString()
        .split("T")[0];
      return fechaExistente === formData.fechaVencimiento;
    });

    if (fechaVencimientoExacta) {
      setMensajeError(
        `Ya existe un pago con la fecha de vencimiento ${new Date(
          formData.fechaVencimiento
        ).toLocaleDateString()}. Por favor selecciona una fecha diferente.`
      );
      setMostrarError(true);
      return;
    }

    // Validar que no exista la misma fecha de pago exacta (si se proporcionó)
    if (formData.fechaPago) {
      const fechaPagoExacta = pagosExistentes.find((pago) => {
        // Si estamos editando, excluir el pago actual de la validación
        if (isEditing && pago.idPago === parseInt(idPago)) {
          return false;
        }

        if (!pago.fechaPago) return false;

        const fechaExistente = new Date(pago.fechaPago)
          .toISOString()
          .split("T")[0];
        return fechaExistente === formData.fechaPago;
      });

      if (fechaPagoExacta) {
        setMensajeError(
          `Ya existe un pago con la fecha de pago ${new Date(
            formData.fechaPago
          ).toLocaleDateString()}. Por favor selecciona una fecha diferente.`
        );
        setMostrarError(true);
        return;
      }
    }

    setMostrarConfirmacion(true);
  };

  const confirmarGuardado = async () => {
    setMostrarConfirmacion(false);
    setLoading(true);

    try {
      const pagoData = {
        ...formData,
        monto: parseFloat(formData.monto),
        idContrato: parseInt(formData.idContrato),
      };

      if (isEditing) {
        pagoData.idPago = parseInt(idPago);
        await putPago(pagoData);
      } else {
        // Al crear un nuevo pago, el estatus inicial es pago_pendiente
        pagoData.estatus = "pago_pendiente";
        await postPago(pagoData);
      }

      setMostrarExito(true);
      setTimeout(() => {
        navigate("/pagos");
      }, 2000);
    } catch (error) {
      console.error("Error al guardar pago:", error);
      setMensajeError(
        `Error al ${isEditing ? "actualizar" : "registrar"} el pago`
      );
      setMostrarError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-lg">Cargando...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {isEditing ? "Editar" : "Registrar"}{" "}
            <span className="text-[#D0D5DD]">Pago</span>
          </h2>
          <p className="text-[#98A2B3] text-lg">
            Completa la información del pago de renta
          </p>
        </div>

        {/* Información del Contrato */}
        {contratoInfo && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Información del Contrato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-400">Propiedad:</p>
                <p className="font-semibold">
                  {contratoInfo.propiedad?.titulo || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Monto Mensual:</p>
                <p className="font-semibold text-green-400">
                  ${contratoInfo.montoMensual}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Vigencia:</p>
                <p className="font-semibold">
                  {new Date(contratoInfo.fechaInicio).toLocaleDateString()} -{" "}
                  {new Date(contratoInfo.fechaFin).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-300 text-xs">
                <strong>Nota:</strong> Las fechas de pago deben estar dentro del
                período del contrato
              </p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white text-[#101828] rounded-2xl shadow-2xl p-10 space-y-8"
        >
          {/* Información del Pago */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
              Datos del Pago
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Monto <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="monto"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.monto}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de Vencimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={handleChange}
                  min={
                    contratoInfo
                      ? new Date(contratoInfo.fechaInicio)
                        .toISOString()
                        .split("T")[0]
                      : undefined
                  }
                  max={
                    contratoInfo
                      ? new Date(contratoInfo.fechaFin)
                        .toISOString()
                        .split("T")[0]
                      : undefined
                  }
                  required
                  className="input-style"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de Pago
                </label>
                <input
                  type="date"
                  name="fechaPago"
                  value={formData.fechaPago}
                  onChange={handleChange}
                  min={
                    contratoInfo
                      ? new Date(contratoInfo.fechaInicio)
                        .toISOString()
                        .split("T")[0]
                      : undefined
                  }
                  max={
                    contratoInfo
                      ? new Date(contratoInfo.fechaFin)
                        .toISOString()
                        .split("T")[0]
                      : undefined
                  }
                  className="input-style"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Método de Pago
                </label>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  className="input-style"
                >
                  <option value="">Seleccionar método</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="cheque">Cheque</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Referencia/Folio
                </label>
                <input
                  type="text"
                  name="referencia"
                  placeholder="Número de referencia o folio"
                  value={formData.referencia}
                  onChange={handleChange}
                  className="input-style"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Notas</label>
                <textarea
                  name="notas"
                  placeholder="Observaciones adicionales"
                  value={formData.notas}
                  onChange={handleChange}
                  rows="4"
                  className="input-style resize-none"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-center pt-8">
            <button
              type="button"
              onClick={() => navigate("/pagos")}
              className="px-10 py-4 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-[#101828] to-[#182230] text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
            >
              {isEditing ? "Actualizar Pago" : "Guardar Pago"}
            </button>
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
              {isEditing ? "actualizar" : "registrar"} este pago?
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
            tabIndex="-1"
            aria-labelledby="hs-bordered-success-style-label"
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
                <h3
                  id="hs-bordered-success-style-label"
                  className="text-gray-800 font-semibold"
                >
                  ¡Operación exitosa!
                </h3>
                <p className="text-sm text-gray-700">
                  El pago se ha {isEditing ? "actualizado" : "registrado"}{" "}
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
          <div
            className="bg-red-50 border-s-4 border-red-500 p-4"
            role="alert"
            tabIndex="-1"
            aria-labelledby="hs-bordered-red-style-label"
          >
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
                <h3
                  id="hs-bordered-red-style-label"
                  className="text-gray-800 font-semibold"
                >
                  Error!
                </h3>
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

export default FormPag;
