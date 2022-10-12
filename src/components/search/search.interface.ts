import {
  GetPaginatedQuery,
  GetPaginatedQueryRule,
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

export const nullableOperators = {
  is_empty: { args: 0 },
  is_not_empty: { args: 0 },
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

interface BaseFilterArgs {
  type: FilterType;
  label: string;
  prefix?: string;
  nullable?: boolean;
}

interface EnumFilterArgs extends BaseFilterArgs {
  type: 'enum';
  options: { id: string; label: string }[];
}

interface OtherFilterArgs extends BaseFilterArgs {
  type: Exclude<FilterType, 'enum'>;
}

export type FilterArgs = EnumFilterArgs | OtherFilterArgs;

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

export function convertRulesToFilters(
  rules: GetPaginatedQuery<string>['rules']
): Filter[] | null {
  if (!rules) {
    return null;
  }

  // TODO: how to handle groups?
  const rulesWithoutGroups = rules.rules.filter(
    (rule) => 'operator' in rule
  ) as GetPaginatedQueryRule<string>[];

  return rulesWithoutGroups.map((rule) => ({
    id: rule.field,
    operator: rule.operator,
    values: Array.isArray(rule.value) ? [...rule.value] : [rule.value],
  }));
}

export function convertFiltersToRules(
  matchType: 'all' | 'any',
  filters: Filter[]
): GetPaginatedQuery<string>['rules'] {
  return {
    condition: matchType === 'all' ? 'AND' : 'OR',
    rules: filters.map((filter) => ({
      field: filter.id,
      operator: filter.operator,
      value: filter.values,
    })),
  };
}
