import { DELETE_PROP, GET_PROP, POST_PROP, PUT_PROP } from "../types";



export default (state, action) =>{
    //Destructuramos el action
    const {type, payload} = action;

    switch (type){
        case GET_PROP:
            return{
                ...state,
                selectedProp: payload
            }
        case POST_PROP:
            return{
                props: [...state.props, payload],
                selectedProp: payload
            }
        case PUT_PROP:
            return {
                ...state,
                selectedProp: payload,
                props: state.props.map(prop => 
                    prop.idPropiedad === payload.idPropiedad ? payload : prop
                )
            }
        case DELETE_PROP:
            return{
                ...state,
                user:payload
            }

            default:
                return state;
    }
}