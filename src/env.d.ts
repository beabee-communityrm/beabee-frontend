/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

declare module 'virtual:theme' {
  interface BaseTheme {
    fontSize: { [k: string]: [string, string] };
    borderRadius: { [k: string]: string };
    spacing: { [k: string]: string };
    lineHeight: { [k: string]: string };
  }
  const theme: BaseTheme;
  export default theme;
}

declare module 'vue-matomo' {
  import { Plugin } from 'vue';
  const plugin: Plugin;
  export default plugin;
}

interface Window {
  _paq: any[];
}

interface ImportMetaEnv {
  VITE_APP_BASE_URL: string;
  VITE_API_BASE_URL: string;
  VITE_STRIPE_PUBLIC_KEY: string;
  VITE_STRIPE_COUNTRY: 'gb' | 'eu' | 'ca';
}
