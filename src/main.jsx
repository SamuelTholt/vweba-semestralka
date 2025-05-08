import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './web/contexts/AuthContext.jsx'

import App from './App.jsx'
import { ReviewProvider } from './web/contexts/ReviewContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ReviewProvider>
        <App />
      </ReviewProvider>
    </AuthProvider>
  </StrictMode>,
)
