export interface Header {
  text: string;
  value: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'right' | 'center';
}

export enum SortType {
  Desc = 'DESC',
  Asc = 'ASC',
}
