import 'vue-router';
import { Roles } from '../utils/enums/roles.enum';

declare module 'vue-router' {
  interface RouteMeta {
    pageTitle: string;
    layout?: string;
    // if a route has an empty roles array it means it can be accsesed by all users
    roles?: Roles[] | [];
  }
}
