import { useAuth } from "../contexts/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import PropContext from "../contexts/Propiedad/PropContext";
import { Link, useNavigate, useParams } from "react-router-dom";
// Initialization for ES Users
import {
  Collapse,
  Ripple,
  initTWE,
} from "tw-elements";




const FormProp = () => {
  const { user, getIdUsuario } = useAuth();
  initTWE({ Collapse, Ripple });
  const { postProp, putProp, getProp, selectedProp } = useContext(PropContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false);

  // Estado para alertas (solo visual)
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    direccion: "",
    latitud: "",
    longitud: "",
    colonia: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    tipoPropiedad: "residencial",
    estatus: "disponible",
    precioVenta: "",
    precioRenta: "",
    numHabitaciones: "",
    numBanios: "",
    metrosCuadrados: "",
    numEstacionamiento: "",
    plantas: "",
    residencial: false,
    jardin: false,
    alberca: false,
    sotano: false,
    terraza: false,
    cuartoServicio: false,
    muebles: false,
    credito: false,
    fechaRegistro: "",
    publicadoEcommerce: false,
  });

  const [imagenes, setImagenes] = useState([]);
  const [idPropiedadCreada, setIdPropiedadCreada] = useState(null);

  const sanitizeNumber = (value, allowFloat = false) => {
    if (!value) return "";
    value = value.replace(/-/g, "");
    const regex = allowFloat ? /[^0-9.]/g : /[^0-9]/g;
    value = value.replace(regex, "");
    if (allowFloat) {
      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }
    }
    return value;
  };

  const sanitizeText = (value) => {
    if (!value) return "";
    return value
      .replace(/<[^>]*>?/gm, "")
      .trimStart();
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const numericFields = [
      "precioVenta",
      "precioRenta",
      "numHabitaciones",
      "numBanios",
      "metrosCuadrados",
      "numEstacionamiento",
      "plantas",
      "latitud",
      "longitud"
    ];

    if (type === "checkbox") {
      return setFormData({
        ...formData,
        [name]: checked,
      });
    }

    if (numericFields.includes(name)) {
      const sanitized = sanitizeNumber(value, true);
      return setFormData({
        ...formData,
        [name]: sanitized,
      });
    }

    const sanitizedText = sanitizeText(value);
    setFormData({
      ...formData,
      [name]: sanitizedText,
    });
  };

  const handleImagenChange = (e) => {
    setImagenes([...e.target.files]);
  };

  useEffect(() => {
    const loadPropiedadData = async () => {
      if (id && !hasLoaded.current) {
        try {
          setLoading(true);
          setIsEditing(true);
          hasLoaded.current = true;
          await getProp(id);
        } catch (error) {
          console.error("Error al cargar propiedad:", error);
          // Ejemplo de alerta de error
          setAlert({
            type: "error",
            title: "Error",
            message: "Error al cargar los datos de la propiedad"
          });
        } finally {
          setLoading(false);
        }
      }
    };
    loadPropiedadData();
  }, [id, getProp]);

  useEffect(() => {
    if (selectedProp && isEditing && hasLoaded.current) {
      const newFormData = {
        titulo: selectedProp.titulo || "",
        descripcion: selectedProp.descripcion || "",
        direccion: selectedProp.direccion || "",
        latitud: selectedProp.latitud || "",
        longitud: selectedProp.longitud || "",
        colonia: selectedProp.colonia || "",
        ciudad: selectedProp.ciudad || "",
        estado: selectedProp.estado || "",
        codigoPostal: selectedProp.codigoPostal || "",
        tipoPropiedad: selectedProp.tipoPropiedad || "residencial",
        estatus: selectedProp.estatus || "disponible",
        precioVenta: selectedProp.precioVenta || "",
        precioRenta: selectedProp.precioRenta || "",
        numHabitaciones: selectedProp.numHabitaciones || "",
        numBanios: selectedProp.numBanios || "",
        metrosCuadrados: selectedProp.metrosCuadrados || "",
        numEstacionamiento: selectedProp.numEstacionamiento || "",
        plantas: selectedProp.plantas || "",
        residencial: selectedProp.residencial || false,
        jardin: selectedProp.jardin || false,
        alberca: selectedProp.alberca || false,
        sotano: selectedProp.sotano || false,
        terraza: selectedProp.terraza || false,
        cuartoServicio: selectedProp.cuartoServicio || false,
        muebles: selectedProp.muebles || false,
        credito: selectedProp.credito || false,
        fechaRegistro: selectedProp.fechaRegistro ? selectedProp.fechaRegistro.split('T')[0] : "",
        publicadoEcommerce: selectedProp.publicadoEcommerce || false,
      };

      setFormData(prevFormData => {
        if (JSON.stringify(prevFormData) !== JSON.stringify(newFormData)) {
          return newFormData;
        }
        return prevFormData;
      });
    }
  }, [selectedProp, isEditing]);

  useEffect(() => {
    return () => {
      hasLoaded.current = false;
    };
  }, [id]);

  // Auto-ocultar alertas después de 3 segundos
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const idUsuario = getIdUsuario();

    try {
      let response;

      if (isEditing) {
        const propiedadData = {
          idPropiedad: parseInt(id),
          idUsuario: parseInt(idUsuario),
          ...formData,
          precioVenta: formData.precioVenta ? parseFloat(formData.precioVenta) : null,
          precioRenta: formData.precioRenta ? parseFloat(formData.precioRenta) : null,
          numHabitaciones: formData.numHabitaciones ? parseInt(formData.numHabitaciones) : null,
          numBanios: formData.numBanios ? parseInt(formData.numBanios) : null,
          metrosCuadrados: formData.metrosCuadrados ? parseFloat(formData.metrosCuadrados) : null,
          numEstacionamiento: formData.numEstacionamiento ? parseInt(formData.numEstacionamiento) : null,
          plantas: formData.plantas ? parseInt(formData.plantas) : null,
        };

        response = await putProp(propiedadData);
        // Ejemplo de alerta de éxito
        setAlert({
          type: "success",
          title: "Propiedad actualizada",
          message: "La propiedad se actualizó correctamente"
        });

        setTimeout(() => {
          navigate('/propiedades');
        }, 1500);
      } else {
        const propiedadData = {
          idUsuario: parseInt(idUsuario),
          ...formData,
          precioVenta: formData.precioVenta ? parseFloat(formData.precioVenta) : null,
          precioRenta: formData.precioRenta ? parseFloat(formData.precioRenta) : null,
          numHabitaciones: formData.numHabitaciones ? parseInt(formData.numHabitaciones) : null,
          numBanios: formData.numBanios ? parseInt(formData.numBanios) : null,
          metrosCuadrados: formData.metrosCuadrados ? parseFloat(formData.metrosCuadrados) : null,
          numEstacionamiento: formData.numEstacionamiento ? parseInt(formData.numEstacionamiento) : null,
          plantas: formData.plantas ? parseInt(formData.plantas) : null,
        };

        response = await postProp(propiedadData);
        const propiedadId = response?.data?.data?.idPropiedad;

        if (propiedadId && imagenes.length > 0) {
          await subirImagenes(propiedadId, imagenes);
          // Ejemplo de alerta de éxito
          setAlert({
            type: "success",
            title: "Propiedad registrada",
            message: "Propiedad registrada e imágenes subidas correctamente"
          });
        } else if (propiedadId) {
          // Ejemplo de alerta de éxito
          setAlert({
            type: "success",
            title: "Propiedad registrada",
            message: "La propiedad se registró correctamente"
          });
        } else {
          // Ejemplo de alerta de error
          setAlert({
            type: "error",
            title: "Error",
            message: "Propiedad registrada, pero no se pudo obtener el ID para subir imágenes"
          });
        }

        setTimeout(() => {
          navigate('/propiedades');
        }, 1500);
      }

    } catch (error) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'registrar'} propiedad:`, error);
      // Ejemplo de alerta de error
      setAlert({
        type: "error",
        title: "Error",
        message: `Hubo un error al ${isEditing ? 'actualizar' : 'registrar'} la propiedad`
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditing) {
    return (
      <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  const subirImagenes = async (propiedadId, archivos) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        throw new Error("No autorizado. Token no encontrado.");
      }

      const formData = new FormData();
      archivos.forEach((archivo) => {
        formData.append("fotos", archivo);
      });

      const response = await fetch(
        `http://localhost:3000/api/propiedades/subirFotos/${propiedadId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir imágenes");
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error("Error al subir imágenes:", error);
      throw error;
    }
  };

  // Opciones para selects
  const tipoPropiedadOptions = [
    { value: "residencial", label: "Residencial" },
    { value: "comercial", label: "Comercial" },
    { value: "industrial", label: "Industrial" },
    { value: "terreno", label: "Terreno" },
    { value: "oficina", label: "Oficina" },
  ];

  const estatusOptions = [
    { value: "disponible", label: "Disponible" },
    { value: "vendido", label: "Vendido" },
    { value: "rentado", label: "Rentado" },
    { value: "proceso", label: "En proceso" },
    { value: "reservado", label: "Reservado" },
  ];

  const amenidades = [
    { name: "residencial", label: "Residencial" },
    { name: "jardin", label: "Jardín" },
    { name: "alberca", label: "Alberca" },
    { name: "sotano", label: "Sótano" },
    { name: "terraza", label: "Terraza" },
    { name: "cuartoServicio", label: "Cuarto de Servicio" },
    { name: "muebles", label: "Amueblado" },
    { name: "credito", label: "Crédito Disponible" },
    { name: "publicadoEcommerce", label: "Publicado en E-commerce" },
  ];

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

      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Registro de <span className="text-[#D0D5DD]">Propiedad</span>
          </h2>
          <p className="text-[#98A2B3] text-lg">
            Completa la información para agregar una nueva propiedad a la plataforma.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white text-[#101828] rounded-2xl shadow-2xl p-8 md:p-10 space-y-10"
        >
          {/* DATOS GENERALES */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#182230] pb-3">
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div className="space-y-2">
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                  Título de la Propiedad *
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  placeholder="Ej. Casa moderna en zona residencial"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                  Descripción *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Describe las características principales de la propiedad..."
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                  Dirección *
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  placeholder="Calle y número"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>

              {/* Colonia */}
              <div className="space-y-2">
                <label htmlFor="colonia" className="block text-sm font-medium text-gray-700">
                  Colonia *
                </label>
                <input
                  type="text"
                  id="colonia"
                  name="colonia"
                  placeholder="Nombre de la colonia"
                  value={formData.colonia}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>

              {/* Ciudad */}
              <div className="space-y-2">
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">
                  Ciudad *
                </label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  placeholder="Nombre de la ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                  Estado *
                </label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  placeholder="Nombre del estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>

              {/* Código Postal */}
              <div className="space-y-2">
                <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700">
                  Código Postal *
                </label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  placeholder="5 dígitos"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  required
                />
              </div>

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

          {/* UBICACIÓN Y PRECIOS */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#182230] pb-3">
              Ubicación y Precios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Latitud */}
              <div className="space-y-2">
                <label htmlFor="latitud" className="block text-sm font-medium text-gray-700">
                  Latitud
                </label>
                <input
                  type="text"
                  id="latitud"
                  name="latitud"
                  placeholder="Ej. 19.432608"
                  value={formData.latitud}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                />
              </div>

              {/* Longitud */}
              <div className="space-y-2">
                <label htmlFor="longitud" className="block text-sm font-medium text-gray-700">
                  Longitud
                </label>
                <input
                  type="text"
                  id="longitud"
                  name="longitud"
                  placeholder="Ej. -99.133209"
                  value={formData.longitud}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                />
              </div>

              {/* Tipo de Propiedad */}
              <div className="space-y-2">
                <label htmlFor="tipoPropiedad" className="block text-sm font-medium text-gray-700">
                  Tipo de Propiedad *
                </label>
                <select
                  id="tipoPropiedad"
                  name="tipoPropiedad"
                  value={formData.tipoPropiedad}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                >
                  {tipoPropiedadOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estatus */}
              <div className="space-y-2">
                <label htmlFor="estatus" className="block text-sm font-medium text-gray-700">
                  Estatus *
                </label>
                <select
                  id="estatus"
                  name="estatus"
                  value={formData.estatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                >
                  {estatusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Precio de Venta */}
              <div className="space-y-2">
                <label htmlFor="precioVenta" className="block text-sm font-medium text-gray-700">
                  Precio de Venta (MXN)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="text"
                    id="precioVenta"
                    name="precioVenta"
                    placeholder="0.00"
                    value={formData.precioVenta}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Precio de Renta */}
              <div className="space-y-2">
                <label htmlFor="precioRenta" className="block text-sm font-medium text-gray-700">
                  Precio de Renta Mensual (MXN)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="text"
                    id="precioRenta"
                    name="precioRenta"
                    placeholder="0.00"
                    value={formData.precioRenta}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARACTERÍSTICAS */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#182230] pb-3">
              Características de la Propiedad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Número de Habitaciones */}
              <div className="space-y-2">
                <label htmlFor="numHabitaciones" className="block text-sm font-medium text-gray-700">
                  Número de Habitaciones
                </label>
                <input
                  type="number"
                  id="numHabitaciones"
                  name="numHabitaciones"
                  placeholder="0"
                  value={formData.numHabitaciones}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                />
              </div>

              {/* Número de Baños */}
              <div className="space-y-2">
                <label htmlFor="numBanios" className="block text-sm font-medium text-gray-700">
                  Número de Baños
                </label>
                <input
                  type="number"
                  id="numBanios"
                  name="numBanios"
                  placeholder="0"
                  value={formData.numBanios}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                />
              </div>

              {/* Metros Cuadrados */}
              <div className="space-y-2">
                <label htmlFor="metrosCuadrados" className="block text-sm font-medium text-gray-700">
                  Metros Cuadrados (m²)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="metrosCuadrados"
                    name="metrosCuadrados"
                    placeholder="0.00"
                    value={formData.metrosCuadrados}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">m²</span>
                </div>
              </div>

              {/* Número de Estacionamientos */}
              <div className="space-y-2">
                <label htmlFor="numEstacionamiento" className="block text-sm font-medium text-gray-700">
                  Estacionamientos
                </label>
                <input
                  type="number"
                  id="numEstacionamiento"
                  name="numEstacionamiento"
                  placeholder="0"
                  value={formData.numEstacionamiento}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                />
              </div>

              {/* Plantas */}
              <div className="space-y-2">
                <label htmlFor="plantas" className="block text-sm font-medium text-gray-700">
                  Número de Plantas
                </label>
                <input
                  type="number"
                  id="plantas"
                  name="plantas"
                  placeholder="0"
                  value={formData.plantas}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* AMENIDADES */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#182230] pb-3">
              Amenidades y Servicios
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenidades.map((amenidad) => (
                <div
                  key={amenidad.name}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${formData[amenidad.name]
                    ? "bg-[#101828] text-white border-[#101828]"
                    : "bg-[#F8F9FA] border-gray-200 hover:bg-gray-50"
                    }`}
                  onClick={() => setFormData({
                    ...formData,
                    [amenidad.name]: !formData[amenidad.name]
                  })}
                >
                  <div className={`w-6 h-6 flex items-center justify-center rounded border ${formData[amenidad.name]
                    ? "bg-white border-white"
                    : "bg-white border-gray-300"
                    }`}>
                    {formData[amenidad.name] && (
                      <svg className="w-4 h-4 text-[#101828]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-sm">{amenidad.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* IMÁGENES */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-[#182230] pb-3">
              Imágenes de la Propiedad
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="imagenes" className="block text-sm font-medium text-gray-700">
                  Seleccionar Imágenes
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB por imagen)</p>
                    </div>
                    <input
                      id="imagenes"
                      name="imagenes"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagenChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Vista previa */}
              {imagenes.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Vista previa ({imagenes.length} imagen{imagenes.length !== 1 ? 'es' : ''})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.from(imagenes).map((imagen, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(imagen)}
                          alt={`Vista previa ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const nuevasImagenes = [...imagenes];
                              nuevasImagenes.splice(index, 1);
                              setImagenes(nuevasImagenes);
                            }}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOTÓN DE ENVÍO */}
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
                isEditing ? 'Actualizar Propiedad' : 'Guardar Propiedad'
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

export default FormProp;