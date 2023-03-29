export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export interface MenuItem {
  title: string;
  href: string;
  icon: [string, string];
  isActive?: RegExp;
}
