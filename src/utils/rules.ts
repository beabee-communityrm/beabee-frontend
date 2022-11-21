import { Rule, RuleGroup, isRuleGroup } from '@beabee/beabee-common';

export interface RuleGroupWithEmpty {
  condition: RuleGroup['condition'];
  rules: (Rule | RuleGroup | null)[];
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
