import { PUT_PER } from "../types";



export default (state, action) =>{
    //Destructuramos el action
    const {type, payload} = action;

    switch (type){
        
        case PUT_PER:
            return{
                ...state,
                per:payload
            }


            default:
                return state;
    }
}