import React, { useReducer } from "react";
import PerReducer from "./PerReducer";
import PerContext from "./PerContext";
import axios from "axios";
import { PUT_PER } from "../types";

const PerState = (props) => {
  // Definimos el estado inicial
  const initialState = {
    pers: [],
    selectedPer: null,
  };

  // Definimos el useReducer para manejar el estado de la aplicación
  const [state, dispatch] = useReducer(PerReducer, initialState);

  // Función para editar un usuario
  const putPer = async (usuarioData) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.put(
        "http://localhost:3000/api/usuarios/putUsuario",
        { usuario: usuarioData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: PUT_PER,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al editar usuario:", error);
      throw error;
    }
  };

  // Función para obtener un usuario específico
  const getPer = async (idUsuario) => {
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

      return res.data.data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  };

  return (
    <PerContext.Provider
      value={{
        pers: state.pers,
        selectedPer: state.selectedPer,
        putPer,
        getPer,
      }}
    >
      {props.children}
    </PerContext.Provider>
  );
};

export default PerState;
