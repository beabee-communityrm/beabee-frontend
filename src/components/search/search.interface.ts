import {
  EnumFilterArgs,
  Rule,
  FilterType,
  operatorsByType,
  operatorsByTypeMap,
  OtherFilterArgs,
  RuleValue,
  RuleOperator,
} from '@beabee/beabee-common';

export interface FilterGroup<T extends string = string> {
  label: string;
  items: T[];
}

export interface OtherFilterItem extends OtherFilterArgs {
  label: string;
  prefix?: string;
}

export interface EnumFilterItem extends Omit<EnumFilterArgs, 'options'> {
  label: string;
  options: { id: string; label: string }[];
}

export type FilterItem = OtherFilterItem | EnumFilterItem;

export type FilterItems<T extends string = string> = Record<T, FilterItem>;

export function withLabel<T extends readonly string[]>(
  args: EnumFilterArgs<T>,
  label: string,
  optLabels: Record<T[number], string>
): EnumFilterItem;
export function withLabel(
  args: OtherFilterArgs,
  label: string,
  prefix?: string
): OtherFilterItem;
export function withLabel<T extends readonly string[]>(
  args: EnumFilterArgs<T> | OtherFilterArgs,
  label: string,
  extraArg?: Record<T[number], string> | string
): FilterItem {
  if (args.type === 'enum') {
    const optLabels = extraArg as Record<T[number], string>;
    return {
      ...args,
      label,
      options: args.options.map((id: T[number]) => ({
        id,
        label: optLabels[id],
      })),
    };
  } else {
    return { ...args, label, ...(extraArg && { prefix: extraArg as string }) };
  }
}

export function getDefaultValue(type: FilterType): RuleValue {
  switch (type) {
    case 'boolean':
      return true;
    case 'number':
      return 0;
    default:
      return '';
  }
}

// Enforces type safety for the operator and initial values
function withDefault<T extends FilterType>(
  type: T,
  operator: keyof typeof operatorsByType[T]
): Pick<Rule, 'operator' | 'value'> {
  const params = operatorsByTypeMap[type][operator as RuleOperator];
  return {
    operator: operator as RuleOperator,
    value: new Array(params?.args || 0).fill(getDefaultValue(type)),
  };
}

const ruleDefaultsByType: Record<
  FilterType,
  () => Pick<Rule, 'operator' | 'value'>
> = {
  text: () => withDefault('text', 'equal'),
  number: () => withDefault('number', 'equal'),
  enum: () => withDefault('enum', 'equal'),
  boolean: () => withDefault('boolean', 'equal'),
  contact: () => withDefault('contact', 'equal'),
  date: () => withDefault('date', 'equal'),
  array: () => withDefault('array', 'contains'),
};

export function createNewRule(field: string, type: FilterType): Rule {
  return {
    field,
    ...ruleDefaultsByType[type](),
  };
}
