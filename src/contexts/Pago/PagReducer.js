import { DELETE_PAGO, GET_PAGO, POST_PAGO, PUT_PAGO } from "../types";

export default (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PAGO:
      return {
        ...state,
        selectedPago: payload
      }
    case POST_PAGO:
      return {
        ...state,
        pagos: [...state.pagos, payload],
        selectedPago: payload
      }
    case PUT_PAGO:
      return {
        ...state,
        selectedPago: payload,
        pagos: state.pagos.map(pago => 
          pago.idPago === payload.idPago ? payload : pago
        )
      }
    case DELETE_PAGO:
      return {
        ...state,
        pagos: state.pagos.filter(pago => pago.idPago !== payload),
        selectedPago: null
      }
    default:
      return state;
  }
}