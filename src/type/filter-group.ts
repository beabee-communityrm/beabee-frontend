export interface FilterGroup<T extends string = string> {
  label: string;
  items: T[];
}
