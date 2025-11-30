import { createBrowserRouter } from "react-router-dom";

import LayoutPublic from "../layout/LayoutPublic";

import Home from "./Home";
import Propiedades, { loaderPropiedades } from "./Propiedades";
import Propiedad, { loaderPropiedad } from "./Propiedad";
import AuthPage from "./AuthPage";
import FormProp from "../components/FormProp";
import Citas, { loaderCitas } from "./Citas";
import Usuarios, { loaderUsuario } from "./Usuarios";
import Cita, { loaderCita } from "./Cita";
import FormGastoM from "../components/FormGastoM";
import GastosMantenimiento, { loaderGastos } from "./GastosMantenimiento";


//Creamos el router y su configuración básica
export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPublic />,

        children: [
            {
                path: "/",
                index: true,
                element: <AuthPage />,
            },
            {
                path: "/Home",
                element: <Home />,
                loader: loaderPropiedades,
            },
            {
                path: "/Propiedades",
                element: <Propiedades />,
                loader: loaderPropiedades,
            },
            {
                path: "/Propiedad/:id",
                element: <Propiedad />,
                loader: loaderPropiedad,
            },
            {
                path: "/editarProp/:id",
                element: <FormProp />,
                loader: loaderPropiedad,
            },
            {
                path: "/Citas",
                element: <Citas />,
                loader: loaderCitas,
            },
            {
                path: "/Usuarios",
                element: <Usuarios />,
                loader: loaderUsuario,
            },
            {
                path: "/Cita/:id",
                element: <Cita />,
                loader: loaderCita,
            },
            {
                path: "Propiedades/:id/gastos/crear",
                element: <FormGastoM />,
            },
            {
                path: "/GastosMantenimiento",
                element: <GastosMantenimiento />,
                loader: loaderGastos
            },
            {
                path: "/editarGasto/:idGasto",
                element: <FormGastoM />,
            }

        ]
    }
])