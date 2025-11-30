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
        alert("Error: No se pudo determinar la propiedad");
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
        alert("Gasto actualizado con éxito");
      } else {
        await postGasto(data);
        alert("Gasto registrado con éxito");
      }

      navigate(`/gastosMantenimiento`);
    } catch (e) {
      console.error("Error al guardar gasto:", e);
      alert("Ocurrió un error al guardar el gasto");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div>Cargando...</div>;
  }

  return (
    <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white">
      <Link
        to="/gastosMantenimiento"
        className="inline-block mb-6 px-4 py-2 bg-[#182230] hover:bg-[#101828] rounded-lg transition"
      >
        Regresar
      </Link>
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-6 text-center">
          {isEditing ? "Editar Gasto de Mantenimiento" : "Registrar Gasto de Mantenimiento"}
        </h2>

        <form onSubmit={handleSubmit} className="bg-white text-[#101828] rounded-xl shadow-2xl p-10 space-y-8">

          <input
            type="hidden"
            name="idPropiedad"
            value={formData.idPropiedad || ""}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                placeholder="Categoría"
                className="input-style"
                required
              />
            </div>

            <div>
              <input
                type="text"
                name="concepto"
                value={formData.concepto}
                onChange={handleChange}
                placeholder="Concepto"
                className="input-style"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                placeholder="Monto"
                className="input-style"
                required
              />
            </div>

            <div>
              <input
                type="date"
                name="fechaGasto"
                value={formData.fechaGasto}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              placeholder="Proveedor"
              className="input-style"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
              className="input-style"
              required
            />
          </div>

          <div>
            <input
              type="date"
              name="fechaRegistro"
              value={formData.fechaRegistro}
              onChange={handleChange}
              className="input-style"
              required
            />
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-[#101828] to-[#182230] text-white font-semibold rounded-xl hover:shadow-2xl transition disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Gasto"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FormGastoM;