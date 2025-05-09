import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './web/contexts/AuthContext.jsx'

import App from './App.jsx'
import { ReviewProvider } from './web/contexts/ReviewContext.jsx'
import { MenuProvider } from './web/contexts/MenuContext.jsx'
import GalleryProvider from './web/contexts/GalleryContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ReviewProvider>
        <MenuProvider>
          <GalleryProvider>
            <App />
          </GalleryProvider>
        </MenuProvider>
      </ReviewProvider>
    </AuthProvider>
  </StrictMode>,
)
