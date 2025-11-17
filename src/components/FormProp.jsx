import { useAuth } from "../contexts/AuthContext";
import { useContext, useState } from "react";
import PropContext from "../contexts/Propiedad/PropContext";

const FormProp = () => {
  const { user, getIdUsuario } = useAuth();
  const { postProp } = useContext(PropContext);
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  const idUsuario = getIdUsuario();
  console.log("ID de usuario obtenido del contexto:", idUsuario);

  try {
    const propiedadData = {
      idUsuario,
      ...formData,
    };

    console.log("Propiedad enviada:", propiedadData);

    const response = await postProp(propiedadData);

    // ✅ Aquí obtenemos correctamente el ID
    const propiedadId = response?.data?.data?.idPropiedad;
    console.log("ID de propiedad creada:", propiedadId);

    if (!propiedadId) {
      alert("Propiedad registrada, pero no se pudo obtener el ID para subir imágenes.");
      return;
    }
    if (imagenes.length > 0) {
      await subirImagenes(propiedadId, imagenes);
      alert("Propiedad registrada e imágenes subidas correctamente.");
    } else {
      alert("Propiedad registrada correctamente.");
    }
  } catch (error) {
    console.error("Error al registrar propiedad:", error);
    alert("Hubo un error al registrar la propiedad.");
  }
};



  const subirImagenes = async (propiedadId, archivos) => {
    try {
      const formData = new FormData();
      
      // Agregar cada imagen al FormData
      archivos.forEach((archivo) => {
        formData.append("fotos", archivo);
      });

      const response = await fetch(
        `http://localhost:3000/api/propiedades/subirFotos/${propiedadId}`,
        {
          method: "POST",
          body: formData,
          // No incluir Content-Type header, el navegador lo establecerá automáticamente con el boundary
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
    <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white">
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
  );
};

export default FormProp
