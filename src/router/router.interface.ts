import 'vue-router';
import { PermissionType } from '../utils/api/api.interface';

declare module 'vue-router' {
  interface RouteMeta {
    pageTitle: string;
    layout?: 'Auth' | 'Dashboard' | 'Loading';
    noAuth?: boolean;
    role?: PermissionType;
  }
}
