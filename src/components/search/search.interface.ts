import {
  EnumFilterArgs,
  Rule,
  FilterType,
  operatorsByType,
  operatorsByTypeMap,
  OtherFilterArgs,
  RuleValue,
  RuleOperator,
  RuleGroup,
  isRuleGroup,
} from '@beabee/beabee-common';

export interface RuleGroupWithEmpty {
  condition: RuleGroup['condition'];
  rules: (Rule | RuleGroup | null)[];
}

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

export function copyRule(rule: Rule): Rule {
  return {
    field: rule.field,
    operator: rule.operator,
    value: [...rule.value],
  };
}

export function copyRuleGroup(ruleGroup: RuleGroup): RuleGroup {
  return {
    condition: ruleGroup.condition,
    rules: ruleGroup.rules.map((ruleOrGroup) =>
      isRuleGroup(ruleOrGroup)
        ? copyRuleGroup(ruleOrGroup)
        : copyRule(ruleOrGroup)
    ),
  };
}

export function isRuleEqual(a: Rule, b: Rule): boolean {
  return (
    a.field === b.field &&
    a.operator === b.operator &&
    a.value.length === b.value.length &&
    a.value.every((v, i) => v === b.value[i])
  );
}

export function isEqual(a: RuleGroupWithEmpty, b: RuleGroupWithEmpty): boolean {
  return (
    a.condition === b.condition &&
    a.rules.length === b.rules.length &&
    a.rules.every((ra, i) => {
      const rb = b.rules[i];
      if (ra === null || rb === null) return ra === rb;

      const raGroup = isRuleGroup(ra);
      const rbGroup = isRuleGroup(rb);
      return (
        raGroup === rbGroup &&
        (raGroup ? isEqual(ra, rb as RuleGroup) : isRuleEqual(ra, rb as Rule))
      );
    })
  );
}
