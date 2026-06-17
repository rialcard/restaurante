import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// CONVENCIÓN: No se usa dangerouslySetInnerHTML en ningún componente.
// Todo el contenido dinámico se renderiza con JSX (.map, renderizado condicional).

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
