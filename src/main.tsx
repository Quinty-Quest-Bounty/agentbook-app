import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter } from 'react-router-dom';
import { init } from '@telegram-apps/sdk-react';
import App from './App';
import './styles/index.css';

// Initialize Telegram Mini Apps SDK (safe to call outside Telegram — just won't bind)
try {
  init();
} catch {
  // Running outside Telegram environment — ignore
}

const manifestUrl =
  import.meta.env.VITE_TONCONNECT_MANIFEST_URL ||
  'https://agentbook-app.vercel.app/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </TonConnectUIProvider>,
);
