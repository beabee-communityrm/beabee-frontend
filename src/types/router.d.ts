import 'vue-router';

declare module 'vue-router' {
  import { RoleType } from '@beabee/beabee-common';

  interface RouteMeta {
    pageTitle: string;
    layout?: 'Auth' | 'Dashboard' | 'Loading';
    noAuth?: boolean;
    role?: RoleType;
  }
}
