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
  const {id} = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false);

  console.log("idPropiedad desde useParams:", id);
  console.log("isEditing:", isEditing);
  console.log("selectedProp:", selectedProp);
  
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

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImagenChange = (e) => {
    setImagenes([...e.target.files]);
  };
  
  // Cargar datos cuando es edición
    useEffect(() => {
    const loadPropiedadData = async () => {
      // Evitar cargar múltiples veces
      if (id && !hasLoaded.current) {
        try {
          setLoading(true);
          setIsEditing(true);
          hasLoaded.current = true;
          await getProp(id);
        } catch (error) {
          console.error("Error al cargar propiedad:", error);
          alert("Error al cargar los datos de la propiedad");
        } finally {
          setLoading(false);
        }
      }
    };

    loadPropiedadData();
  }, [id, getProp]);


  // Actualizar formData cuando selectedProp cambie
   useEffect(() => {
    if (selectedProp && isEditing && hasLoaded.current) {
      console.log("SelectedProp recibido:", selectedProp);
      
      
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
  
  // Resetear hasLoaded
  useEffect(() => {
    return () => {
      hasLoaded.current = false;
    };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const idUsuario = getIdUsuario();
    console.log("ID de usuario:", idUsuario);

    try {
      let response;
      
      if (isEditing) {
        const propiedadData = {
          idPropiedad: parseInt(id),
          idUsuario: parseInt(idUsuario),
          ...formData,
          // Convertir strings vacíos a null para números
          precioVenta: formData.precioVenta ? parseFloat(formData.precioVenta) : null,
          precioRenta: formData.precioRenta ? parseFloat(formData.precioRenta) : null,
          numHabitaciones: formData.numHabitaciones ? parseInt(formData.numHabitaciones) : null,
          numBanios: formData.numBanios ? parseInt(formData.numBanios) : null,
          metrosCuadrados: formData.metrosCuadrados ? parseFloat(formData.metrosCuadrados) : null,
          numEstacionamiento: formData.numEstacionamiento ? parseInt(formData.numEstacionamiento) : null,
          plantas: formData.plantas ? parseInt(formData.plantas) : null,
        };

        console.log("Propiedad a actualizar:", propiedadData);
        response = await putProp(propiedadData);
        
        alert("Propiedad actualizada correctamente.");
        navigate('/propiedades');
      } else {
        // Modo creación
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

        console.log("Propiedad a crear:", propiedadData);
        response = await postProp(propiedadData);

        const propiedadId = response?.data?.data?.idPropiedad;
        console.log("ID de propiedad creada:", propiedadId);

        if (propiedadId && imagenes.length > 0) {
          await subirImagenes(propiedadId, imagenes);
          alert("Propiedad registrada e imágenes subidas correctamente.");
        } else if (propiedadId) {
          alert("Propiedad registrada correctamente.");
        } else {
          alert("Propiedad registrada, pero no se pudo obtener el ID para subir imágenes.");
        }
        navigate('/propiedades');
      }
      
    } catch (error) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'registrar'} propiedad:`, error);
      alert(`Hubo un error al ${isEditing ? 'actualizar' : 'registrar'} la propiedad.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
    console.log("Imágenes subidas:", result);
    return result;

  } catch (error) {
    console.error("Error al subir imágenes:", error);
    throw error;
  }
};


  return (
    /**
    <div
  class="!visible hidden text-center"
  id="collapseExample"
  data-twe-collapse-item>
   */
    <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white" >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Registro de <span className="text-[#D0D5DD]">Propiedad</span>
          </h2>
          <p className="text-[#98A2B3] text-lg">
            Completa la información para agregar una nueva propiedad a la
            plataforma.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white text-[#101828] rounded-2xl shadow-2xl p-10 space-y-8"
        >
          {/* Datos Generales */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formData.titulo}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="colonia"
                placeholder="Colonia"
                value={formData.colonia}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="estado"
                placeholder="Estado"
                value={formData.estado}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="codigoPostal"
                placeholder="Código Postal"
                value={formData.codigoPostal}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="date"
                name="fechaRegistro"
                placeholder="Fecha de Registro"
                value={formData.fechaRegistro}
                onChange={handleChange}
                className="input-style"
              />
            </div>
          </div>

          {/* Coordenadas y Precios */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
              Ubicación y Precios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="text"
                name="latitud"
                placeholder="Latitud"
                value={formData.latitud}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="longitud"
                placeholder="Longitud"
                value={formData.longitud}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="tipoPropiedad"
                placeholder="Tipo de Propiedad"
                value={formData.tipoPropiedad}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="estatus"
                placeholder="Estatus"
                value={formData.estatus}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="number"
                name="precioVenta"
                placeholder="Precio de Venta"
                value={formData.precioVenta}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="number"
                name="precioRenta"
                placeholder="Precio de Renta"
                value={formData.precioRenta}
                onChange={handleChange}
                className="input-style"
              />
            </div>
          </div>

          {/* Características */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
              Características
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="number"
                name="numHabitaciones"
                placeholder="Habitaciones"
                value={formData.numHabitaciones}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="number"
                name="numBanios"
                placeholder="Baños"
                value={formData.numBanios}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="number"
                name="metrosCuadrados"
                placeholder="Metros Cuadrados"
                value={formData.metrosCuadrados}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="number"
                name="numEstacionamiento"
                placeholder="Estacionamientos"
                value={formData.numEstacionamiento}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="number"
                name="plantas"
                placeholder="Plantas"
                value={formData.plantas}
                onChange={handleChange}
                className="input-style"
              />
            </div>
          </div>

          {/* Amenidades */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
              Amenidades
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[#475467]">
              {[
                "residencial",
                "jardin",
                "alberca",
                "sotano",
                "terraza",
                "cuartoServicio",
                "muebles",
                "credito",
                "publicadoEcommerce",
              ].map((amenidad) => (
                <label
                  key={amenidad}
                  className="flex items-center gap-2 bg-[#F8F9FA] p-3 rounded-lg hover:bg-[#E4E7EC]/40 cursor-pointer transition-all duration-300"
                >
                  <input
                    type="checkbox"
                    name={amenidad}
                    checked={formData[amenidad]}
                    onChange={handleChange}
                    className="accent-[#101828] w-5 h-5"
                  />
                  <span className="capitalize">{amenidad}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Sección de Imágenes */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
              Imágenes de la Propiedad
            </h3>
            <div className="space-y-4">
              <input
                type="file"
                name="imagenes"
                multiple
                accept="image/*"
                onChange={handleImagenChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
              />
              <p className="text-sm text-gray-600">
                Puedes seleccionar múltiples imágenes (máximo 10)
              </p>
              
              {/* Vista previa de imágenes */}
              {imagenes.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {Array.from(imagenes).map((imagen, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(imagen)}
                        alt={`Vista previa ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón de Envío */}
          <div className="text-center pt-8">
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-[#101828] to-[#182230] text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Guardar Propiedad
            </button>
          </div>
        </form>
      </div>
    </section>
    /** 
    </div>
    */
  );
};

export default FormProp