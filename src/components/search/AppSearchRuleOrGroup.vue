<template>
  <template v-if="rule && isRuleGroup(rule)">
    <span v-if="readonly">Group of rules</span>
    <span v-else>
      The advanced search editor doesn't support nested groups of rules
    </span>
  </template>
  <AppSearchRule
    v-else
    :filter-groups="filterGroups"
    :filter-items="filterItems"
    :rule="rule"
    :readonly="readonly"
  />
</template>
<script lang="ts" setup>
import { isRuleGroup, Rule, RuleGroup } from '@beabee/beabee-common';
import AppSearchRule from './AppSearchRule.vue';
import { FilterGroup, FilterItems } from './search.interface';

defineProps<{
  filterGroups: FilterGroup[];
  filterItems: FilterItems;
  rule: Rule | RuleGroup | null;
  readonly?: boolean;
}>();
</script>
