/**
 * Archivo que representa la definición del estado, aquí estará el estado que se va a consumir.
 */

import React, { useReducer } from 'react'
import PropReducer from './PropReducer';
import axios from 'axios';
import PropContext from './PropContext';
import { DELETE_PROP, POST_PROP } from '../types';


const PropState = (propss) => {

  //Definimos el estado inicial
  const initialState = {
    props: [],
    selectedProp: null
  };

  //x-api-key: reqres-free-v1
  //Definimos el useReducer para manejar el estado de la aplicación.
  const [state, dispatch] = useReducer(PropReducer, initialState);


  const postProp = async (propiedadData) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/propiedades/postPropiedad`,
        { propiedad: propiedadData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: POST_PROP,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al registrar propiedades:", error);
      throw error;
    }
  };


  // Función para obtener una propiedad específica
  const getProp = async (idPropiedad) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/propiedades/getPropiedad/${idPropiedad}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Datos recibidos de la API:", res.data.data); // ← Agregar este console.log

      dispatch({
        type: 'GET_PROP',
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al obtener propiedad:", error);
      throw error;
    }
  };


  const putProp = async (propiedadData) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/propiedades/putPropiedad`,
        { propiedad: propiedadData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Respuesta del servidor:", res.data);

      dispatch({
        type: 'PUT_PROP',
        payload: res.data.data
      });

      return res;
    } catch (error) {
      console.error("Error al actualizar propiedad:", error);
      throw error;
    }
  }

  const deleteProp = async (id) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/propiedades/deletePropiedad/` + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      console.log("Código de respuesta:", res.status);
      //Pasamos los datos al reducer
      dispatch({
        type: DELETE_PROP,
        payload: res.data.data
      })
      return res;
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      throw error;
    }
  }







  return (
    <PropContext.Provider value={{
      props: state.props,
      selectedProp: state.selectedProp,
      postProp,
      putProp,
      deleteProp,
      getProp
    }}>
      {propss.children}
    </PropContext.Provider>

  )
}

export default PropState