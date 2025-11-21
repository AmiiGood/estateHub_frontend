import { POST_PROP } from "../types";



export default (state, action) =>{
    //Destructuramos el action
    const {type, payload} = action;

    switch (type){
        case POST_PROP:
            return{
                props: [...state.props, payload],
                selectedProp: payload
            }

            default:
                return state;
    }
}