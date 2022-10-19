export interface FilterGroup<T extends string = string> {
  label: string;
  items: T[];
}

export interface FilterItem {
  label: string;
  prefix?: string;
  options?: { id: string; label: string }[];
}

export type FilterItems<T extends string = string> = Record<T, FilterItem>;
