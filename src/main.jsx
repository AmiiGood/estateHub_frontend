import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { router } from "./pages";
import { AuthProvider } from "./contexts/AuthContext";
import { RouterProvider } from "react-router-dom";
import PropState from "./contexts/Propiedad/PropState";
import UsuarioState from "./contexts/Usuario/UsuarioState";
import PerState from "./contexts/Perfil/PerState";
import ContState from "./contexts/Contrato/ContState";
import PagState from "./contexts/Pago/PagState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PropState>
        <ContState>
          <PagState>
            <PerState>
              <UsuarioState>
                <RouterProvider router={router} />
              </UsuarioState>
            </PerState>
          </PagState>
        </ContState>
      </PropState>
    </AuthProvider>
  </StrictMode>
);
