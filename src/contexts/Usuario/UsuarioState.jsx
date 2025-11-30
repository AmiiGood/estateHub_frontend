/**
 * Archivo que representa la definición del estado, aquí estará el estado que se va a consumir.
 */

import React, { useReducer } from 'react'
import axios from 'axios';
import { DELETE_USER, POST_USER, PUT_USER } from '../types';
import UsuarioReducer from './UsuarioReducer';
import UsuarioContext from './UsuarioContext';


const UsuarioState = (userss) => {

  //Definimos el estado inicial
  const initialState = {
    users: [],
    selectedUser: null
  };

  //x-api-key: reqres-free-v1
  //Definimos el useReducer para manejar el estado de la aplicación.
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


  // Función para obtener una propiedad específica
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
      //Pasamos los datos al reducer
      dispatch({
        type: DELETE_USER,
        payload: id
      });

      return res;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  const reactivateUser = async (id) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      const res = await axios.put(
        "http://localhost:3000/api/usuarios/putUsuario",
        {
          usuario: {
            idUsuario: id,
            activo: 1
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: PUT_USER,
        payload: res.data.data
      });

      return res;

    } catch (error) {
      console.log(error);
    }
  };












  return (
    <UsuarioContext.Provider value={{
      users: state.users,
      selectedUser: state.selectedUser,
      postUser,
      putUser,
      deleteUser,
      getUser,
      reactivateUser
    }}>
      {userss.children}
    </UsuarioContext.Provider>

  )
}

export default UsuarioState