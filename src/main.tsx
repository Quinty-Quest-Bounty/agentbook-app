import React from 'react'
import ReactDOM from 'react-dom/client'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const manifestUrl = import.meta.env.VITE_TONCONNECT_MANIFEST_URL || 'https://agentbook-app.vercel.app/tonconnect-manifest.json'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TonConnectUIProvider>
  </React.StrictMode>
)
