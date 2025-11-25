import { useAuth } from '../contexts/AuthContext';
import React from 'react'
import { useContext, useEffect, useRef, useState } from "react";
import PropContext from "../contexts/Propiedad/PropContext";
import { Link, useNavigate, useParams } from "react-router-dom";
// Initialization for ES Users
import {
  Collapse,
  Ripple,
  initTWE,
} from "tw-elements";
import UsuarioContext from '../contexts/Usuario/UsuarioContext';

const FormUser = () => {
    const { user, getIdUsuario } = useAuth();
  initTWE({ Collapse, Ripple });
  const { postUser, putUser, getUser, selectedUser } = useContext(UsuarioContext);
  const {id} = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false);

  console.log("idUsuario desde useParams:", id);
  console.log("isEditing:", isEditing);
  console.log("selectedUser:", selectedUser);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
    activo: true,
  });
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: name === "activo" ? value === "true" : value
  }));
};



  
  // Cargar datos cuando es edición
    useEffect(() => {
    const loadUsuarioData = async () => {
      // Evitar cargar múltiples veces
      if (id && !hasLoaded.current) {
        try {
          setLoading(true);
          setIsEditing(true);
          hasLoaded.current = true;
          await getUser(id);
        } catch (error) {
          console.error("Error al cargar usuario:", error);
          alert("Error al cargar los datos del usuario");
        } finally {
          setLoading(false);
        }
      }
    };

    loadUsuarioData();
  }, [id, getUser]);


  // Actualizar formData cuando selectedProp cambie
   useEffect(() => {
    if (selectedUser && isEditing && hasLoaded.current) {
      console.log("SelectedProp recibido:", selectedUser);
      
      
      const newFormData = {
        email: selectedUser.email || "",
        passwordHash: selectedUser.passwordHash || "",
        nombre: selectedUser.nombre || "",
        apellidoPaterno: selectedUser.apellidoPaterno || "",
        apellidoMaterno: selectedUser.apellidoMaterno || "",
        telefono: selectedUser.telefono || "",
        activo: selectedUser.activo || "",
      };

      setFormData(prevFormData => {
        if (JSON.stringify(prevFormData) !== JSON.stringify(newFormData)) {
          return newFormData;
        }
        return prevFormData;
      });
    }
  }, [selectedUser, isEditing]);
  
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
        const usuarioData = {
          idUsuario: parseInt(id),
          ...formData,
        };

        console.log("Usuario a actualizar:", usuarioData);
        response = await putUser(usuarioData);
        
        alert("Usuario actualizado correctamente.");
        navigate('/usuarios');
      } else {
        // Modo creación
        const usuarioData = {
          idUsuario: parseInt(idUsuario),
          ...formData,
        };

        console.log("Usuario a crear:", usuarioData);
        response = await postUser(usuarioData);

        const usuarioId = response?.data?.data?.idUsuario;
        console.log("ID de usuario creado:", usuarioId);

       
        if (response.status === 200) {
            alert(response.data.message);
            } else {
            alert("Hubo un error");
        }

        navigate('/usuarios');
      }
      
    } catch (error) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'registrar'} usuario:`, error);
      alert(`Hubo un error al ${isEditing ? 'actualizar' : 'registrar'} el usuario.`);
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
  return (
    <div>
        <section className="py-24 bg-gradient-to-br from-[#101828] via-[#182230] to-[#0C111D] text-white" >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Registro de <span className="text-[#D0D5DD]">Usuario</span>
          </h2>
          <p className="text-[#98A2B3] text-lg">
            Completa la información para agregar un nuevo usuario a la
            plataforma.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white text-[#101828] rounded-2xl shadow-2xl p-10 space-y-8"
        >
          {/* Datos Generales */}

            <h3 className="text-2xl font-semibold mb-6 text-[#182230]">
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input-style"
                />

                <input
                type="text"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-style"
                />

                <input
                type="text"
                name="nombre"
                placeholder="Nombre(s)"
                value={formData.nombre}
                onChange={handleChange}
                className="input-style"
                />

                <input
                type="text"
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                className="input-style"
                />

                <input
                type="text"
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                className="input-style"
                />

                <input
                type="text"
                name="telefono"
                placeholder="Telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="input-style"
                />

               <select
                    name="activo"
                    value={formData.activo}
                    onChange={handleChange}
                    className="input-style"
                    >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
                </select>



          </div>


          {/* Botón de Envío */}
          <div className="text-center pt-8">
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-[#101828] to-[#182230] text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Guardar Usuario
            </button>
          </div>
        </form>
      </div>
    </section>
      
    </div>
  )
}

export default FormUser
