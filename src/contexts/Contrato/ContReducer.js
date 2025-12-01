import { DELETE_CONT, GET_CONT, GET_CONTRATOS_ACTIVOS, GET_CONTRATOS_USUARIO, POST_CONT, PUT_CONT } from "../types";

export default (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_CONT:
            return {
                ...state,
                selectedCont: payload
            }
        case POST_CONT:
            return {
                conts: [...state.conts, payload],
                selectedCont: payload
            }
        case PUT_CONT:
            return {
                ...state,
                selectedCont: payload,
                conts: state.conts.map(cont => 
                    cont.idContrato === payload.idContrato ? payload : cont
                )
            }
        case DELETE_CONT:
            return {
                ...state,
                conts: state.conts.filter(cont => cont.idContrato !== payload),
                selectedCont: null
            }
        case GET_CONTRATOS_USUARIO:
            return {
                ...state,
                userConts: payload
            }
        case GET_CONTRATOS_ACTIVOS:
            return {
                ...state,
                conts: payload
            }
        default:
            return state;
    }
}