import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GastosContext from "../contexts/GastosM/GastosMContext";

const FormGastoM = () => {
  const { id: idPropiedadFromParams } = useParams();
  const { idGasto } = useParams();
  const navigate = useNavigate();
  const { getIdUsuario } = useAuth();

  const { postGasto, putGasto, selectedGasto, getGasto } = useContext(GastosContext);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false);

  // Estado para alertas (solo visual)
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    idPropiedad: idPropiedadFromParams || "",
    categoria: "",
    concepto: "",
    monto: "",
    fechaGasto: "",
    proveedor: "",
    descripcion: "",
    fechaRegistro: new Date().toISOString().split("T")[0],
  });

  const sanitizeNumber = val => val.replace(/[^0-9.]/g, "");
  const sanitizeText = val => val.replace(/<[^>]*>/g, "").trimStart();

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "monto") newValue = sanitizeNumber(value);
    else newValue = sanitizeText(value);

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  useEffect(() => {
    if (idGasto && !hasLoaded.current) {
      hasLoaded.current = true;
      setIsEditing(true);

      const loadData = async () => {
        setLoading(true);
        await getGasto(idGasto);
        setLoading(false);
      };

      loadData();
    }
  }, [idGasto, getGasto]);

  useEffect(() => {
    if (selectedGasto && isEditing) {
      setFormData({
        idGasto: selectedGasto.idGasto,
        idPropiedad: selectedGasto.idPropiedad || idPropiedadFromParams,
        categoria: selectedGasto.categoria || "",
        concepto: selectedGasto.concepto || "",
        monto: selectedGasto.monto || "",
        fechaGasto: selectedGasto.fechaGasto?.split("T")[0] || "",
        proveedor: selectedGasto.proveedor || "",
        descripcion: selectedGasto.descripcion || "",
        fechaRegistro: selectedGasto.fechaRegistro?.split("T")[0] || new Date().toISOString().split("T")[0],
      });
    }
  }, [selectedGasto, isEditing, idPropiedadFromParams]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const idUsuario = getIdUsuario();

      const finalIdPropiedad = formData.idPropiedad || idPropiedadFromParams;

      if (!finalIdPropiedad) {
        // Ejemplo de alerta de error (solo visual)
        setAlert({
          type: "error",
          title: "Error",
          message: "No se pudo determinar la propiedad"
        });
        setLoading(false);
        return;
      }

      const data = {
        ...formData,
        idPropiedad: parseInt(finalIdPropiedad),
        monto: parseFloat(formData.monto) || 0,
      };

      console.log("Enviando datos:", data);

      if (isEditing) {
        await putGasto(data);
        // Ejemplo de alerta de éxito (solo visual)
        setAlert({
          type: "success",
          title: "Gasto actualizado",
          message: "El gasto se actualizó correctamente"
        });
      } else {
        await postGasto(data);
        // Ejemplo de alerta de éxito (solo visual)
        setAlert({
          type: "success",
          title: "Gasto registrado",
          message: "El gasto se registró correctamente"
        });
      }

      // Navegar después de un tiempo
      setTimeout(() => {
        navigate(`/gastosMantenimiento`);
      }, 1500);

    } catch (e) {
      console.error("Error al guardar gasto:", e);
      // Ejemplo de alerta de error (solo visual)
      setAlert({
        type: "error",
        title: "Error",
        message: "Ocurrió un error al guardar el gasto"
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-ocultar alertas después de 3 segundos
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Opciones para categorías
  const categoriaOptions = [
    "Mantenimiento General",
    "Reparaciones",
    "Limpieza",
    "Jardinería",
    "Servicios Públicos",
    "Impuestos",
    "Seguros",
    "Administración",
    "Otros"
  ];

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando información del gasto...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white">
      {/* CONTENEDOR PRINCIPAL DE ALERTAS - Posicionado fijo */}
      <div className="fixed top-4 right-4 z-50 max-w-md w-full">
        {/* ALERTA DE ÉXITO */}
        {alert?.type === "success" && (
          <div className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 mb-3 shadow-lg animate-fade-in">
            <div className="flex items-start">
              <div className="shrink-0">
                <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </span>
              </div>
              <div className="ms-3">
                <h3 className="text-gray-800 font-semibold">
                  {alert.title}
                </h3>
                <p className="text-sm text-gray-700">
                  {alert.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ALERTA DE ERROR */}
        {alert?.type === "error" && (
          <div className="bg-red-50 border-s-4 border-red-500 p-4 mb-3 shadow-lg animate-fade-in">
            <div className="flex items-start">
              <div className="shrink-0">
                <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </span>
              </div>
              <div className="ms-3">
                <h3 className="text-gray-800 font-semibold">
                  Error
                </h3>
                <p className="text-sm text-gray-700">
                  {alert.message || 'No se pudo completar la acción.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Botón de regreso */}
        <Link
          to="/gastosMantenimiento"
          className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-[#1F2A37] hover:bg-[#273445] text-white font-medium rounded-xl transition-all duration-200 border border-white/10 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Regresar a Gastos
        </Link>

        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {isEditing ? "Editar Gasto" : "Registrar Gasto"}
            <span className="text-[#D0D5DD] block">de Mantenimiento</span>
          </h2>
          <p className="text-[#98A2B3] text-lg max-w-2xl mx-auto">
            {isEditing
              ? "Actualiza la información del gasto seleccionado."
              : "Completa la información para registrar un nuevo gasto de mantenimiento."}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white text-[#101828] rounded-2xl shadow-2xl p-8 md:p-10 space-y-10">

          {/* Campo oculto para idPropiedad */}
          <input type="hidden" name="idPropiedad" value={formData.idPropiedad || ""} />

          {/* SECCIÓN 1: Información del Gasto */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#182230]">
              Información del Gasto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categoría */}
              <div className="space-y-2">
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                  Categoría *
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categoriaOptions.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Concepto */}
              <div className="space-y-2">
                <label htmlFor="concepto" className="block text-sm font-medium text-gray-700">
                  Concepto *
                </label>
                <input
                  type="text"
                  id="concepto"
                  name="concepto"
                  placeholder="Ej. Reparación de tuberías, Pago de agua, etc."
                  value={formData.concepto}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>

              {/* Monto */}
              <div className="space-y-2">
                <label htmlFor="monto" className="block text-sm font-medium text-gray-700">
                  Monto (MXN) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="text"
                    id="monto"
                    name="monto"
                    placeholder="0.00"
                    value={formData.monto}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Fecha del Gasto */}
              <div className="space-y-2">
                <label htmlFor="fechaGasto" className="block text-sm font-medium text-gray-700">
                  Fecha del Gasto *
                </label>
                <input
                  type="date"
                  id="fechaGasto"
                  name="fechaGasto"
                  value={formData.fechaGasto}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Información del Proveedor */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#182230]">
              Información del Proveedor
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Proveedor */}
              <div className="space-y-2">
                <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700">
                  Proveedor *
                </label>
                <input
                  type="text"
                  id="proveedor"
                  name="proveedor"
                  placeholder="Nombre de la empresa o persona"
                  value={formData.proveedor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Descripción */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#182230]">
              Descripción Detallada
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Descripción */}
              <div className="space-y-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                  Descripción *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Describe detalladamente el gasto realizado..."
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: Fecha de Registro */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#182230]">
              Fecha de Registro
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha de Registro */}
              <div className="space-y-2">
                <label htmlFor="fechaRegistro" className="block text-sm font-medium text-gray-700">
                  Fecha de Registro
                </label>
                <input
                  type="date"
                  id="fechaRegistro"
                  name="fechaRegistro"
                  value={formData.fechaRegistro}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Botón de Envío */}
          <div className="text-center pt-8">
            <button
              type="submit"
              disabled={loading}
              className={`px-12 py-4 bg-gradient-to-r from-[#101828] to-[#182230] text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </span>
              ) : (
                isEditing ? 'Actualizar Gasto' : 'Registrar Gasto'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default FormGastoM;