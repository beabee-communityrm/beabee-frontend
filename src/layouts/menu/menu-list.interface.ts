export interface MenuSection {
  title?: string;
  type: 'main' | 'settings';
  items: MenuItem[];
}

export interface MenuItem {
  title: string;
  href: string;
  icon: [string, string];
  isActive?: RegExp;
}
