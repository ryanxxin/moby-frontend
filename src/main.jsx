import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRest from './AppRest.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRest />
  </StrictMode>,
)
