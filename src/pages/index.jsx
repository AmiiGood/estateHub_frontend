import { createBrowserRouter } from "react-router-dom";

import LayoutPublic from "../layout/LayoutPublic";

import Home from "./Home";
import Propiedades, { loaderPropiedades } from "./Propiedades";
import Propiedad, { loaderPropiedad } from "./Propiedad";
import AuthPage from "./AuthPage";
import FormProp from "../components/FormProp";
import Citas, { loaderCitas } from "./Citas";
import Usuarios, { loaderUsuario } from "./Usuarios";


//Creamos el router y su configuración básica
export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPublic/>,

        children: [
    {
        path: "/",
        index: true,
        element: <AuthPage/>,
    },
    {
        path:"/Home",
        element:<Home/>,
        loader: loaderPropiedades,
    },
    {
        path:"/Propiedades",
        element:<Propiedades/>,
        loader: loaderPropiedades,
    },
    {
        path: "/Propiedad/:id",
        element: <Propiedad/>,
        loader: loaderPropiedad,
    },
    {
        path: "/editarProp/:id",
        element: <FormProp />,
        loader: loaderPropiedad,
    },
    {
        path: "/Citas",
        element:<Citas/>,
        loader: loaderCitas,
    },
    {
        path: "/Usuarios",
        element:<Usuarios/>,
        loader:loaderUsuario,
    }
    
]
    }
])