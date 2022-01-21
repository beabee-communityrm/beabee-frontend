import 'vue-router';
import { PermissionType } from '../utils/api/api.interface';

declare module 'vue-router' {
  interface RouteMeta {
    pageTitle: string;
    layout?: string;
    noAuth?: boolean;
    role?: PermissionType;
  }
}
