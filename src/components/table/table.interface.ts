export interface Header {
  text: string;
  value: string;
  sortable?: boolean;
  width?: string;
  wrap?: boolean;
  align?: 'left' | 'right' | 'center';
}

export enum SortType {
  Desc = 'DESC',
  Asc = 'ASC',
}
