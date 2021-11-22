import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    // - TODO: check if pageTitle should be required -
    pageTitle?: string;
    layout?: string;
  }
}
