export interface Header {
  text: string;
  sortable?: boolean;
  width?: string;
  value: string;
  align?: 'left' | 'right' | 'center';
}

export enum SortType {
  Desc = 'DESC',
  Asc = 'ASC',
  None = 'NONE',
}
