import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./pages";
import { AuthProvider } from "./contexts/AuthContext";
import { RouterProvider } from "react-router-dom";
import PropState from "./contexts/Propiedad/PropState";
import PerState from "./contexts/Perfil/PerState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PerState>
        <PropState>
          <RouterProvider router={router} />
        </PropState>
      </PerState>
    </AuthProvider>
  </StrictMode>
);
