import { Role } from '../../utils/enums/roles.enum';

export interface MenuSection {
  title?: string;
  type?: 'settings';
  items: MenuItem[];
}

export interface MenuItem {
  title: string;
  href?: string;
  icon: [string, string];
  role?: Role;
}
