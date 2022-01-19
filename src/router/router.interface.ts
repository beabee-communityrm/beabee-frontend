import 'vue-router';
import { Role } from '../utils/enums/roles.enum';

declare module 'vue-router' {
  interface RouteMeta {
    pageTitle: string;
    layout?: string;
    role?: Role;
  }
}
