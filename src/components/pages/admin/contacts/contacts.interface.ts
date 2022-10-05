export type FilterValue = string | number;

export type FilterType = 'text' | 'date';

export type FilterOperatorId =
  | 'equal'
  | 'contains'
  | 'begins_with'
  | 'ends_with'
  | 'between'
  | 'less'
  | 'greater';

export interface FilterOperatorParams {
  args: number;
}

export const operators: Record<
  FilterType,
  Partial<Record<FilterOperatorId, FilterOperatorParams>>
> = {
  text: {
    equal: { args: 1 },
    contains: { args: 1 },
    begins_with: { args: 1 },
    ends_with: { args: 1 },
  },
  date: {
    equal: { args: 1 },
    between: { args: 2 },
    less: { args: 1 },
    greater: { args: 1 },
  },
};

export const filters = {
  firstname: {
    type: 'text',
  },
  lastname: {
    type: 'text',
  },
  email: {
    type: 'text',
  },
  joined: {
    type: 'date',
  },
} as const;

export type FilterId = keyof typeof filters;

export interface EmptyFilter {
  id: '';
  operator: '';
  values: [];
}

export interface Filter {
  id: FilterId;
  operator: FilterOperatorId;
  values: FilterValue[];
}
export function emptyFilter(): EmptyFilter {
  return { id: '', operator: '', values: [] };
}

export function getOperators(
  filter: Filter
): Partial<Record<FilterOperatorId, FilterOperatorParams>> {
  return operators[filters[filter.id].type];
}
