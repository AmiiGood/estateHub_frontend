import { PUT_PER } from "../types";



export default (state, action) =>{
    
    const {type, payload} = action;

    switch (type){
        case PUT_PER:
            return{
                pers: [...state.pers, payload],
                selectedPer: payload
            }

            default:
                return state;
    }
}