/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_BASE_URL: string;
  VITE_API_BASE_URL: string;
  VITE_STRIPE_PUBLIC_KEY: string;
  VITE_STRIPE_COUNTRY: 'gb' | 'eu';
}
