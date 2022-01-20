export interface Header {
  text: string;
  sortable?: boolean;
  width?: string;
  value: string;
  align?: 'left' | 'right' | 'center';
}

export enum SortType {
  Desc = 'desc',
  Asc = 'asc',
  None = 'none',
}
