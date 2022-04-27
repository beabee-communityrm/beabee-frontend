/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  VITE_APP_BASE_URL: string;
  VITE_API_BASE_URL: string;
  VITE_STRIPE_PUBLIC_KEY: string;
}
