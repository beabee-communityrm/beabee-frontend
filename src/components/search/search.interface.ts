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

export type FilterOperator = Exclude<
  GetPaginatedQueryRuleOperator,
  `${'is_not' | 'not'}_${string}`
>;

export interface FilterOperatorParams {
  args: number;
}

export const operators: Record<
  FilterType,
  Partial<Record<FilterOperator, FilterOperatorParams>>
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
    less_or_equal: { args: 1 },
    greater: { args: 1 },
    greater_or_equal: { args: 1 },
  },
  number: {
    equal: { args: 1 },
    between: { args: 2 },
    less: { args: 1 },
    less_or_equal: { args: 1 },
    greater: { args: 1 },
    greater_or_equal: { args: 1 },
  },
  boolean: {
    equal: { args: 1 },
  },
  array: {
    contains: { args: 1 },
  },
  enum: {
    equal: { args: 1 },
  },
};

export interface FilterArgs {
  type: FilterType;
  label: string;
  nullable?: boolean;
  options?: string[];
}

export type Filters = Record<string, FilterArgs>;

export interface Filter {
  id: string;
  operator: FilterOperator;
  inclusive: boolean;
  values: FilterValue[];
}

export function getOperators(
  type: FilterType
): Partial<Record<FilterOperator, FilterOperatorParams>> {
  return operators[type];
}

export interface EmptyFilter {
  id: null;
  operator: '';
  inclusive: true;
  values: [];
}

export function emptyFilter(): EmptyFilter {
  return { id: null, operator: '', inclusive: true, values: [] };
}
