/**
 * Archivo que representa la definición del estado, aquí estará el estado que se va a consumir.
 */

import React, { useReducer } from 'react'
import PropReducer from './PropReducer';
import axios from 'axios';
import PropContext from './PropContext';
import { POST_PROP } from '../types';


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
      "http://localhost:3000/api/propiedades/postPropiedad",
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





    

  return (
    <PropContext.Provider value={{
    props: state.props,
    selectedProp: state.selectedProp,
    postProp
    }}>
        {propss.children}
    </PropContext.Provider>

  )
}

export default PropState