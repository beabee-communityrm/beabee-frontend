import {
  GetPaginatedQueryRuleOperator,
  GetPaginatedQueryRuleValue,
} from '../../utils/api/api.interface';

export type FilterType =
  | 'text'
  | 'date'
  | 'number'
  | 'boolean'
  | 'array'
  | 'enum';

export type FilterValue = GetPaginatedQueryRuleValue;
export type FilterOperator = GetPaginatedQueryRuleOperator;

export interface FilterOperatorParams {
  args: number;
}

const equal = { args: 1 };

const equalityOperators = { equal, not_equal: { args: 1 } };
const numericOperators = {
  ...equalityOperators,
  between: { args: 2 },
  not_between: { args: 2 },
  less: { args: 1 },
  greater: { args: 1 },
  less_or_equal: { args: 1 },
  greater_or_equal: { args: 1 },
};
const arrayOperators = {
  contains: { args: 1 },
  not_contains: { args: 1 },
};

export const operators: Record<
  FilterType,
  Partial<Record<FilterOperator, FilterOperatorParams>>
> = {
  text: {
    ...equalityOperators,
    ...arrayOperators,
    begins_with: { args: 1 },
    ends_with: { args: 1 },
    not_begins_with: { args: 1 },
    not_ends_with: { args: 1 },
  },
  date: numericOperators,
  number: numericOperators,
  boolean: { equal },
  array: arrayOperators,
  enum: equalityOperators,
};

export interface FilterArgs {
  type: FilterType;
  label: string;
  prefix?: string;
  nullable?: boolean;
  options?: { id: string; label: string }[];
}

export type Filters = Record<string, FilterArgs>;

export interface Filter {
  id: string;
  operator: FilterOperator;
  values: FilterValue[];
}

export interface EmptyFilter {
  id: null;
  operator: '';
  values: [];
}

export function emptyFilter(): EmptyFilter {
  return { id: null, operator: '', values: [] };
}
