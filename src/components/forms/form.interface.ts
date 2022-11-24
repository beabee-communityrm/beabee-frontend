export interface SelectItem {
  id: string;
  label: string;
  count?: string;
}

export interface SelectGroup {
  label: string;
  items: SelectItem[];
}
