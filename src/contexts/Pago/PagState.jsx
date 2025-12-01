import React, { useReducer } from "react";
import PagReducer from "./PagReducer";
import axios from "axios";
import PagContext from "./PagContext";
import { POST_PAGO, PUT_PAGO, DELETE_PAGO, GET_PAGO } from "../types";

const PagState = (props) => {
  // Estado inicial
  const initialState = {
    pagos: [],
    selectedPago: null,
    pagosContrato: [],
    pagosFiltrados: [],
  };

  // useReducer para manejar el estado
  const [state, dispatch] = useReducer(PagReducer, initialState);

  // Registrar un nuevo pago
  const postPago = async (pagoData) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/pagosRenta/postPagoRenta`,
        { pagoRenta: pagoData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: POST_PAGO,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al registrar pago:", error);
      throw error;
    }
  };

  // Obtener un pago específico por ID
  const getPago = async (idPago) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/pagosRenta/getPagoRenta/${idPago}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: GET_PAGO,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al obtener pago:", error);
      throw error;
    }
  };

  // Actualizar un pago existente
  const putPago = async (pagoData) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/pagosRenta/putPagoRenta`,
        { pagoRenta: pagoData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: PUT_PAGO,
        payload: res.data.data,
      });

      return res;
    } catch (error) {
      console.error("Error al actualizar pago:", error);
      throw error;
    }
  };

  // Eliminar un pago
  const deletePago = async (idPago) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/pagosRenta/deletePagoRenta/${idPago}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: DELETE_PAGO,
        payload: idPago,
      });

      return res;
    } catch (error) {
      console.error("Error al eliminar pago:", error);
      throw error;
    }
  };

  // Obtener todos los pagos
  const getPagos = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/pagosRenta/getPagosRenta`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar el estado con todos los pagos
      return res.data.data;
    } catch (error) {
      console.error("Error al obtener pagos:", error);
      throw error;
    }
  };

  // Obtener pagos por contrato específico
  const getPagosPorContrato = async (idContrato) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/pagosRenta/getPagosRentaByContrato/${idContrato}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data;
    } catch (error) {
      console.error("Error al obtener pagos por contrato:", error);
      throw error;
    }
  };

  // Obtener pagos por estatus
  const getPagosPorEstatus = async (estatus) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/pagosRenta/getPagosRentaByEstatus/${estatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data;
    } catch (error) {
      console.error("Error al obtener pagos por estatus:", error);
      throw error;
    }
  };

  // Obtener pagos por rango de fechas
  const getPagosPorRangoFechas = async (inicio, fin) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/pagosRenta/getPagosRentaByRangoFechas?inicio=${inicio}&fin=${fin}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data;
    } catch (error) {
      console.error("Error al obtener pagos por rango de fechas:", error);
      throw error;
    }
  };

  // Actualizar solo el estatus de un pago
  const actualizarEstatusPago = async (idPago, estatus) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (!token) {
        console.error("No existe token en localStorage");
        throw new Error("No autorizado");
      }

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/pagosRenta/patchPagoRenta/${idPago}/estatus`,
        { estatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Si la actualización fue exitosa, actualizamos el estado local
      if (res.data.success) {
        const pagoActualizado = await getPago(idPago);
        return pagoActualizado;
      }

      return res;
    } catch (error) {
      console.error("Error al actualizar estatus del pago:", error);
      throw error;
    }
  };

  return (
    <PagContext.Provider
      value={{
        pagos: state.pagos,
        selectedPago: state.selectedPago,
        pagosContrato: state.pagosContrato,
        pagosFiltrados: state.pagosFiltrados,
        postPago,
        putPago,
        deletePago,
        getPago,
        getPagos,
        getPagosPorContrato,
        getPagosPorEstatus,
        getPagosPorRangoFechas,
        actualizarEstatusPago,
      }}
    >
      {props.children}
    </PagContext.Provider>
  );
};

export default PagState;
