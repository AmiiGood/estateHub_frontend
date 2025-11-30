import { useAuth } from "../contexts/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import ContContext from "../contexts/Contrato/ContContext";
import PropContext from "../contexts/Propiedad/PropContext";
import { useNavigate, useParams } from "react-router-dom";
import { Collapse, Ripple, initTWE } from "tw-elements";

const FormCont = () => {
  const { user, getIdUsuario } = useAuth();
  initTWE({ Collapse, Ripple });
  const { postCont, putCont, getCont, selectedCont } = useContext(ContContext);
  const { getProp, selectedProp } = useContext(PropContext);
  const { id, idPropiedad } = useParams(); // id para editar, idPropiedad para crear
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false);
  const [propiedad, setPropiedad] = useState(null);

  // Cambiar nombre a formDataState para evitar conflicto con FormData
  const [formDataState, setFormDataState] = useState({
    idPropiedad: idPropiedad || "",
    fechaInicio: "",
    fechaFin: "",
    montoMensual: "",
    deposito: "",
    estatus: true,
  });

  const [documento, setDocumento] = useState(null);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormDataState({
      ...formDataState,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDocumentoChange = (e) => {
    setDocumento(e.target.files[0]);
  };

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
          alert("Error al cargar los datos del contrato");
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
      console.log("SelectedCont recibido:", selectedCont);

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
        estatus:
          selectedCont.estatus !== undefined ? selectedCont.estatus : true,
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

    try {
      let response;

      if (isEditing) {
        const contratoData = {
          idContrato: parseInt(id),
          idUsuario: parseInt(idUsuario),
          idPropiedad: parseInt(formDataState.idPropiedad),
          fechaInicio: formDataState.fechaInicio,
          fechaFin: formDataState.fechaFin,
          montoMensual: parseFloat(formDataState.montoMensual),
          deposito: parseFloat(formDataState.deposito),
          estatus: formDataState.estatus,
        };

        console.log("Contrato a actualizar:", contratoData);
        response = await putCont(contratoData);

        alert("Contrato actualizado correctamente.");
        navigate("/contratos");
      } else {
        // Modo creación - usar FormData para enviar el archivo
        if (!documento) {
          alert("Debes subir un documento del contrato");
          setLoading(false);
          return;
        }

        const formData = new FormData();

        // Crear objeto con los datos del contrato
        const contratoData = {
          idUsuario: parseInt(idUsuario),
          idPropiedad: parseInt(formDataState.idPropiedad),
          fechaInicio: formDataState.fechaInicio,
          fechaFin: formDataState.fechaFin,
          montoMensual: parseFloat(formDataState.montoMensual),
          deposito: parseFloat(formDataState.deposito),
          estatus: formDataState.estatus,
        };

        // Agregar el contrato como JSON string
        formData.append("contrato", JSON.stringify(contratoData));

        // Agregar el archivo
        formData.append("documento", documento);

        const storedUser = localStorage.getItem("user");
        const userData = storedUser ? JSON.parse(storedUser) : null;
        const token = userData?.token;

        if (!token) {
          console.error("No existe token en localStorage");
          throw new Error("No autorizado");
        }

        console.log("Contrato a crear:", contratoData);
        console.log("Documento:", documento);

        // Usar axios para enviar FormData
        response = await axios.post(
          "http://localhost:3000/api/contratos/postContrato",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Contrato registrado correctamente.");
        navigate("/contratos");
      }
    } catch (error) {
      console.error(
        `Error al ${isEditing ? "actualizar" : "registrar"} contrato:`,
        error
      );
      let errorMessage = `Hubo un error al ${
        isEditing ? "actualizar" : "registrar"
      } el contrato.`;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
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
                  Monto Mensual
                </label>
                <input
                  type="number"
                  name="montoMensual"
                  placeholder="Monto Mensual"
                  value={formDataState.montoMensual}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Depósito
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
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  placeholder="Fecha de Inicio"
                  value={formDataState.fechaInicio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  name="fechaFin"
                  placeholder="Fecha de Fin"
                  value={formDataState.fechaFin}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101828] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Estatus */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
              Estatus del Contrato
            </h3>
            <label className="flex items-center gap-2 bg-[#F8F9FA] p-3 rounded-lg hover:bg-[#E4E7EC]/40 cursor-pointer transition-all duration-300 w-fit">
              <input
                type="checkbox"
                name="estatus"
                checked={formDataState.estatus}
                onChange={handleChange}
                className="accent-[#101828] w-5 h-5"
              />
              <span className="text-[#475467]">Contrato Activo</span>
            </label>
          </div>

          {/* Documento */}
          {!isEditing && (
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
                Documento del Contrato
              </h3>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cargar Documento *
                </label>
                <input
                  type="file"
                  name="documento"
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentoChange}
                  required
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
              </div>
            </div>
          )}

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
    </section>
  );
};

export default FormCont;
import axios from "axios";
