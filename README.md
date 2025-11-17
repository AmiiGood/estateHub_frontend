# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
<<<<<<< HEAD
=======

## Estructura de Carpetas

- `/src` Carpeta principal 
  - `/assets` Recursos estáticos como imágenes o íconos
  - `/components` Componentes reutilizables para la interfaz de usuario
  - `/pages` Vistas o páginas principales que corresponden a rutas (Propiedades, Pagos, Gastos, Notificaciones)
  - `/services` Lógica para llamadas a APIs y gestión de datos (contratos, pagos, gastos)
  - `/contexts` Contextos de React para manejo global del estado (autenticación, notificaciones)
  - `/hooks` Custom hooks reutilizables para lógica compartida
  - `/utils` Funciones utilitarias generales
  - `/routes` Definición centralizada de rutas
  - `App.jsx` Componente raíz que organiza rutas y providers
  - `main.jsx` Punto de entrada que carga React y Vite

- `/public` Archivos públicos estáticos como favicon.
>>>>>>> acca65288a2fc9d3e8df6bbb7266846e081e20e1
