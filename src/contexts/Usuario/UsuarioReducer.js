import {DELETE_USER, GET_USER, POST_PROP, POST_USER, PUT_PROP, PUT_USER } from "../types";



export default (state, action) =>{
    //Destructuramos el action
    const {type, payload} = action;

    switch (type){
        case GET_USER:
            return{
                ...state,
                selectedUser: payload
            }
        case POST_USER:
            return{
                users: [...state.users, payload],
                selectedUser: payload
            }
        case PUT_USER:
            return {
                ...state,
                selectedUser: payload,
                users: state.users.map(user => 
                    user.idUsuario === payload.idUsuario ? payload : user
                )
            }
        case DELETE_USER:
            return{
                ...state,
                user:payload
            }

            default:
                return state;
    }
}