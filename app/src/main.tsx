import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { KeycloakProvider } from './keycloak/KeycloakProvider'
import { ThemeProvider } from './hooks/useTheme'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <KeycloakProvider>
        <App />
      </KeycloakProvider>
    </ThemeProvider>
  </StrictMode>,
)
