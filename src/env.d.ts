/// <reference types="vite/client" />

declare module 'virtual:theme' {
  const theme: any;
  export default theme;
}

interface ImportMetaEnv {
  VITE_APP_BASE_URL: string;
  VITE_API_BASE_URL: string;
  VITE_STRIPE_PUBLIC_KEY: string;
  VITE_STRIPE_COUNTRY: 'gb' | 'eu';
}
