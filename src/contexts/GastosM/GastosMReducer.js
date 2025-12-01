import { DELETE_GASTO, GET_GASTO, POST_GASTO, PUT_GASTO } from "../types";



export default (state, action) =>{
    //Destructuramos el action
    const {type, payload} = action;

    switch (type){
        case GET_GASTO:
            return{
                ...state,
                selectedGasto: payload
            }
        case POST_GASTO:
            return{
                gasts: [...state.gasts, payload],
                selectedGasto: payload
            }
        case PUT_GASTO:
            return {
                ...state,
                selectedGasto: payload,
                gasts: state.gasts.map(gasts => 
                    gasts.idGasto === payload.idGasto ? payload : gasts
                )
            }
        case DELETE_GASTO:
            return{
                ...state,
                gasts:payload
            }

            default:
                return state;
    }
}