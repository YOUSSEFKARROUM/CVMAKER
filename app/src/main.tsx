import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { SupabaseProvider } from './supabase/SupabaseProvider'
import { ThemeProvider } from './hooks/useTheme'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SupabaseProvider>
        <App />
      </SupabaseProvider>
    </ThemeProvider>
  </StrictMode>,
)
