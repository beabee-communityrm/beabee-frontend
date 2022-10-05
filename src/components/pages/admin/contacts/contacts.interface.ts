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
  args: { type: 'text' | 'date' }[];
}

export const operators: Record<
  FilterType,
  Partial<Record<FilterOperatorId, FilterOperatorParams>>
> = {
  text: {
    equal: { args: [{ type: 'text' }] },
    contains: { args: [{ type: 'text' }] },
    begins_with: { args: [{ type: 'text' }] },
    ends_with: { args: [{ type: 'text' }] },
  },
  date: {
    equal: { args: [{ type: 'date' }] },
    between: { args: [{ type: 'date' }, { type: 'date' }] },
    less: { args: [{ type: 'date' }] },
    greater: { args: [{ type: 'date' }] },
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

type FilterId = keyof typeof filters;

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
