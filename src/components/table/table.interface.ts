export interface Header {
  text: string;
  sortable: boolean;
  width?: string;
  value: string;
}

export enum SortType {
  Desc = 'desc',
  Asc = 'asc',
  None = 'none',
}
