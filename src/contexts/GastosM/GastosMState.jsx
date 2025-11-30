/**
 * Archivo que representa la definición del estado, aquí estará el estado que se va a consumir.
 */

import React, { useReducer } from 'react'
import axios from 'axios';
import { DELETE_GASTO, POST_GASTO } from '../types';
import GastosMReducer from './GastosMReducer';
import GastosMContext from './GastosMContext';


const GastosMState = (gastss) => {

    //Definimos el estado inicial
    const initialState = {
        gasts: [],
        selectedGasto: null
    };

    //x-api-key: reqres-free-v1
    //Definimos el useReducer para manejar el estado de la aplicación.
    const [state, dispatch] = useReducer(GastosMReducer, initialState);


    const postGasto = async (gastoData) => {
        try {
            const storedUser = localStorage.getItem("user");
            const userData = storedUser ? JSON.parse(storedUser) : null;
            const token = userData?.token;

            if (!token) {
                console.error("No existe token en localStorage");
                throw new Error("No autorizado");
            }

            const res = await axios.post(
                "http://localhost:3000/api/gastosMantenimiento/postGastosMantenimiento",
                { gastosMantenimiento: gastoData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            dispatch({
                type: POST_GASTO,
                payload: res.data.data,
            });

            return res;
        } catch (error) {
            console.error("Error al registrar gastos de mantenimiento:", error);
            throw error;
        }
    };


    // Función para obtener una propiedad específica
    const getGasto = async (idGasto) => {
        try {
            const storedUser = localStorage.getItem("user");
            const userData = storedUser ? JSON.parse(storedUser) : null;
            const token = userData?.token;

            if (!token) {
                console.error("No existe token en localStorage");
                throw new Error("No autorizado");
            }

            const res = await axios.get(
                `http://localhost:3000/api/gastosMantenimiento/getGastoMantenimiento/${idGasto}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Datos recibidos de la API:", res.data.data); // ← Agregar este console.log

            dispatch({
                type: 'GET_GASTO',
                payload: res.data.data,
            });

            return res;
        } catch (error) {
            console.error("Error al obtener el gasto de mantenimiento:", error);
            throw error;
        }
    };


    const putGasto = async (gastoData) => {
        try {
            const storedUser = localStorage.getItem("user");
            const userData = storedUser ? JSON.parse(storedUser) : null;
            const token = userData?.token;

            if (!token) {
                console.error("No existe token en localStorage");
                throw new Error("No autorizado");
            }

            const res = await axios.put(
                'http://localhost:3000/api/gastosMantenimiento/putGastosMantenimiento',
                { gastoMantenimiento: gastoData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Respuesta del servidor:", res.data);

            dispatch({
                type: 'PUT_GASTO',
                payload: res.data.data
            });

            return res;
        } catch (error) {
            console.error("Error al actualizar gasto de mantenimiento:", error);
            throw error;
        }
    }

    const deleteGasto = async (id) => {
        try {
            const storedUser = localStorage.getItem("user");
            const userData = storedUser ? JSON.parse(storedUser) : null;
            const token = userData?.token;

            if (!token) {
                console.error("No existe token en localStorage");
                throw new Error("No autorizado");
            }
            const res = await axios.delete('http://localhost:3000/api/gastosMantenimiento/deleteGastoMantenimiento/' + id,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            console.log("Código de respuesta:", res.status);
            //Pasamos los datos al reducer
            dispatch({
                type: DELETE_GASTO,
                payload: res.data.data
            })
            return res;
        } catch (error) {
            console.error("Error al eliminar gasto de mantemiento:", error);
            throw error;
        }
    }







    return (
        <GastosMContext.Provider value={{
            gasts: state.gasts,
            selectedGasto: state.selectedGasto,
            postGasto,
            putGasto,
            deleteGasto,
            getGasto
        }}>
            {gastss.children}
        </GastosMContext.Provider>

    )
}

export default GastosMState