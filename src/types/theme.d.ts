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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _paq: any[];
}
