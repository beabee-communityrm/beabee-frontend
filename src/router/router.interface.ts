import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    pageTitle?: string;
    layout?: string;
  }
}
