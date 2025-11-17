import { createBrowserRouter } from "react-router-dom";

import LayoutPublic from "../layout/LayoutPublic";
import Login from "./Login";
import Register from "./Register"
import Home from "./Home";
import Propiedades, { loaderPropiedades } from "./Propiedades";


//Creamos el router y su configuración básica
export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPublic/>,

        children: [
    {
        path: "/",
        index: true,
        element: <Login/>,
    },
    {
        path: "/Register",
        element: <Register/>,
    },
    {
        path:"/Home",
        element:<Home/>,
    },
    {
        path:"/Propiedades",
        element:<Propiedades/>,
        loader: loaderPropiedades,
    }
    
]
    }
])