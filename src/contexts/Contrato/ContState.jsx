import React, { useReducer } from "react";
import ContReducer from "./ContReducer";
import axios from "axios";
import ContContext from "./ContContext";
import {
  DELETE_CONT,
  GET_CONT,
  GET_CONTRATOS_ACTIVOS,
  GET_CONTRATOS_USUARIO,
  POST_CONT,
  PUT_CONT,
} from "../types";

const ContState = (props) => {
  //Definimos el estado inicial
  const initialState = {
    conts: [],
    selectedCont: null,
    userConts: [], // Contratos específicos del usuario
  };

  // Definimos el useReducer para manejar el estado de la aplicación.
  const [state, dispatch] = useReducer(ContReducer, initialState);

  // Función para registrar un nuevo contrato
  const postCont = async (contratoData) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/contratos/postContrato`,
        { contrato: contratoData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: POST_CONT,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al registrar contrato:", error);
      throw error;
    }
  };

  // Función para obtener un contrato específico
  const getCont = async (idContrato) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/contratos/getContrato/${idContrato}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: GET_CONT,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al obtener contrato:", error);
      throw error;
    }
  };

  // Función para actualizar un contrato
  const putCont = async (contratoData) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/contratos/putContrato`,
        { contrato: contratoData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: PUT_CONT,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al actualizar contrato:", error);
      throw error;
    }
  };

  // Función para eliminar un contrato
  const deleteCont = async (idContrato) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/contratos/deleteContrato/${idContrato}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: DELETE_CONT,
        payload: idContrato,
      });

      return res;
    } catch (error) {
      console.error("Error al eliminar contrato:", error);
      throw error;
    }
  };

  // Función para obtener contratos del usuario que inició sesión
  const getContratosByUsuario = async (idUsuario) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/contratos/getContratosByUsuario/${idUsuario}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizamos el estado con los contratos del usuario
      dispatch({
        type: GET_CONTRATOS_USUARIO,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al obtener contratos del usuario:", error);
      throw error;
    }
  };

  // Función para obtener contratos por propiedad
  const getContratosByPropiedad = async (idPropiedad) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/contratos/getContratosByPropiedad/${idPropiedad}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res;
    } catch (error) {
      console.error("Error al obtener contratos de la propiedad:", error);
      throw error;
    }
  };

  // Función para obtener contratos activos
  const getContratosActivos = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/contratos/getContratosActivos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: GET_CONTRATOS_ACTIVOS,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al obtener contratos activos:", error);
      throw error;
    }
  };

  // Función para actualizar el estatus de un contrato
  const putEstatusContrato = async (idContrato, estatus) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/contratos/putEstatusContrato/${idContrato}`,
        { estatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res;
    } catch (error) {
      console.error("Error al actualizar estatus del contrato:", error);
      throw error;
    }
  };

  return (
    <ContContext.Provider
      value={{
        conts: state.conts,
        selectedCont: state.selectedCont,
        userConts: state.userConts,
        postCont,
        putCont,
        deleteCont,
        getCont,
        getContratosByUsuario,
        getContratosByPropiedad,
        getContratosActivos,
        putEstatusContrato,
      }}
    >
      {props.children}
    </ContContext.Provider>
  );
};

export default ContState;
