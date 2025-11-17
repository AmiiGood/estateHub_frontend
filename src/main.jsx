import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
=======
import { router } from './pages'
import { AuthProvider } from './contexts/AuthContext'
import { RouterProvider } from 'react-router-dom'
import PropState from './contexts/Propiedad/PropState'

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <AuthProvider>
      <PropState>
      <RouterProvider router={router} />
      </PropState>
    </AuthProvider>
>>>>>>> acca65288a2fc9d3e8df6bbb7266846e081e20e1
  </StrictMode>,
)
