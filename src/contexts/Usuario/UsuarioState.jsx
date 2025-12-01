/**
 * Archivo que representa la definición del estado, aquí estará el estado que se va a consumir.
 */

import React, { useReducer } from 'react'
import axios from 'axios';
import { DELETE_USER, POST_USER, PUT_USER } from '../types';
import UsuarioReducer from './UsuarioReducer';
import UsuarioContext from './UsuarioContext';


const UsuarioState = (userss) => {
  const initialState = {
    users: [],
    selectedUser: null
  };

  const [state, dispatch] = useReducer(UsuarioReducer, initialState);

  const postUser = async (usuarioData) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.post(
        "http://localhost:3000/api/usuarios/postUsuario",
        { usuario: usuarioData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: POST_USER,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al registrar usuarios:", error);
      throw error;
    }
  };

  const getUser = async (idUsuario) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `http://localhost:3000/api/usuarios/getUsuario/${idUsuario}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Datos recibidos de la API:", res.data.data);

      dispatch({
        type: 'GET_USER',
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  };

  const putUser = async (usuarioData) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.put(
        'http://localhost:3000/api/usuarios/putUsuario',
        { usuario: usuarioData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Respuesta del servidor:", res.data);

      dispatch({
        type: 'PUT_USER',
        payload: res.data.data
      });

      return res;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  // Nueva función para cambiar el estado activo/inactivo
  const toggleUserStatus = async (idUsuario, nuevoEstado) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      // Solo enviamos el idUsuario y el campo activo
      const usuarioData = {
        idUsuario: idUsuario,
        activo: nuevoEstado
      };

      const res = await axios.put(
        'http://localhost:3000/api/usuarios/putUsuario',
        { usuario: usuarioData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Usuario actualizado:", res.data);

      dispatch({
        type: PUT_USER,
        payload: res.data.data
      });

      return res;
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }
      const res = await axios.delete('http://localhost:3000/api/usuarios/deleteUsuario/' + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      console.log("Código de respuesta:", res.status);

      dispatch({
        type: DELETE_USER,
        payload: id
      });

      return res;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  }

  // Eliminamos la función reactivateUser ya que ahora usamos toggleUserStatus

  return (
    <UsuarioContext.Provider value={{
      users: state.users,
      selectedUser: state.selectedUser,
      postUser,
      putUser,
      deleteUser,
      getUser,
      toggleUserStatus // Exportamos la nueva función
    }}>
      {userss.children}
    </UsuarioContext.Provider>
  )
}

export default UsuarioState;