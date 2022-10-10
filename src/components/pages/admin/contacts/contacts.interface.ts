import {
  GetPaginatedQueryRuleOperator,
  GetPaginatedQueryRuleValue,
} from '../../../../utils/api/api.interface';

export interface FilterArgs {
  type: FilterType;
  options?: string[];
}

export type FilterType =
  | 'text'
  | 'date'
  | 'number'
  | 'boolean'
  | 'array'
  | 'enum';

export type FilterValue = GetPaginatedQueryRuleValue;

export type FilterOperatorId = Exclude<
  GetPaginatedQueryRuleOperator,
  `${'is_not' | 'not'}_${string}`
>;

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
  number: {
    equal: { args: 1 },
    less: { args: 1 },
    greater: { args: 1 },
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
  lastSeen: {
    type: 'date',
  },
  contributionType: {
    type: 'enum',
    options: ['Automatic', 'Gift', 'Manual', 'None'],
  },
  contributionMonthlyAmount: {
    type: 'number',
  },
  contributionPeriod: {
    type: 'enum',
    options: ['monthly', 'annual'],
  },
  deliveryOptIn: {
    type: 'boolean',
  },
  newsletterStatus: {
    type: 'text',
  },
  activePermission: {
    type: 'enum',
    options: ['member', 'admin', 'superadmin'],
  },
  activeMembership: {
    type: 'boolean',
  },
  membershipStarts: {
    type: 'date',
  },
  membershipExpires: {
    type: 'date',
  },
  manualPaymentSource: {
    type: 'text',
  },
  tags: {
    type: 'array',
  },
} as const;

export type FilterId = keyof typeof filters;

export interface EmptyFilter {
  id: '';
  operator: '';
  inclusive: true;
  values: [];
}

export interface Filter {
  id: FilterId;
  operator: FilterOperatorId;
  inclusive: boolean;
  values: FilterValue[];
}
export function emptyFilter(): EmptyFilter {
  return { id: '', operator: '', inclusive: true, values: [] };
}

export function getOperators(
  filter: Filter
): Partial<Record<FilterOperatorId, FilterOperatorParams>> {
  return operators[filters[filter.id].type];
}
