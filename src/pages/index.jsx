import { createBrowserRouter } from "react-router-dom";

import LayoutPublic from "../layout/LayoutPublic";

import Home from "./Home";
import Propiedades, { loaderPropiedades } from "./Propiedades";
import Propiedad, { loaderPropiedad } from "./Propiedad";
import Perfil, { loaderPerfil } from "./Perfil";
import AuthPage from "./AuthPage";

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
        path: "/Perfil",
        element: <Perfil />,
        loader: loaderPerfil,
      },
    ],
  },
]);
