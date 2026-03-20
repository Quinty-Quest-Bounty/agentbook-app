import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  try {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initData) {
      config.headers['X-Telegram-Init-Data'] = tg.initData;
    }
  } catch {
    // Not in Telegram environment
  }
  return config;
});

export default api;
