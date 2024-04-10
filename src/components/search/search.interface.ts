import type { Rule } from '@beabee/beabee-common';
import type { FilterGroups, FilterItems } from '@type';

export interface SearchRuleProps<R> {
  filterGroups: FilterGroups;
  filterItems: FilterItems;
  rule: R | null;
  readonly?: boolean;
}

export interface SearchRuleEmits {
  (event: 'update:rule', rule: Rule): void;
  (event: 'remove'): void;
}
