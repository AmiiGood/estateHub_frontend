import { createBrowserRouter } from "react-router-dom";

import LayoutPublic from "../layout/LayoutPublic";

import Home from "./Home";
import Propiedades, { loaderPropiedades } from "./Propiedades";
import Propiedad, { loaderPropiedad } from "./Propiedad";
import Perfil, { loaderPerfil } from "./Perfil";
import AuthPage from "./AuthPage";
import FormProp from "../components/FormProp";
import Citas, { loaderCitas } from "./Citas";
import Usuarios, { loaderUsuario } from "./Usuarios";
import Contratos, { loaderContratos } from "./Contratos";
import Contrato, { loaderContrato } from "./Contrato";
import FormCont from "../components/FormCont";
import Pagos, { loaderPagos } from "./Pagos";
import FormPag from "../components/FormPag";

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
        path: "/Perfil",
        element: <Perfil />,
        loader: loaderPerfil,
      },
      {
        path: "/contratos",
        element: <Contratos />,
        loader: loaderContratos,
      },
      {
        path: "/contrato/:id",
        element: <Contrato />,
        loader: loaderContrato,
      },
      {
        path: "/agregarContrato/:idPropiedad",
        element: <FormCont />,
      },
      {
        path: "/editarContrato/:id",
        element: <FormCont />,
      },
      {
        path: "/pagos",
        element: <Pagos />,
        loader: loaderPagos,
      },
      {
        path: "/agregarPago/:idContrato",
        element: <FormPag />,
      },
      {
        path: "/editarPago/:idPago",
        element: <FormPag />,
      },
    ],
  },
]);
