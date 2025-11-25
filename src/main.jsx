import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { router } from './pages'
import { AuthProvider } from './contexts/AuthContext'
import { RouterProvider } from 'react-router-dom'
import PropState from './contexts/Propiedad/PropState'
import UsuarioState from './contexts/Usuario/UsuarioState'

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <AuthProvider>
      <PropState>
      <UsuarioState>
      <RouterProvider router={router} />
      </UsuarioState>
      </PropState>
    </AuthProvider>
  </StrictMode>,
)
