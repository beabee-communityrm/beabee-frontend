<template>
  <div class="flex items-center gap-2">
    <AppSelect
      :model-value="rule?.field || ''"
      :items="[
        {
          id: '',
          label: t('advancedSearch.selectFilter'),
        },
        ...filterSelectItems,
      ]"
      required
      class="max-w-[60%]"
      @update:model-value="changeRule"
    />
    <template v-if="rule">
      <AppSelect
        v-if="filterOperatorItems.length > 1"
        :model-value="rule.operator"
        :items="filterOperatorItems"
        required
        class="flex-none"
        @update:model-value="changeOperator($event)"
      />
      <span v-else>{{ filterOperatorItems[0].label }}</span>
      <AppSearchRuleValue :rule="rule" :item="filterItems[rule.field]" />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  operatorsByTypeMap,
  type Rule,
  type RuleOperator,
} from '@beabee/beabee-common';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import AppSelect from '../forms/AppSelect.vue';
import AppSearchRuleValue from './AppSearchRuleValue.vue';

import { operatorItems, nullableOperatorItems } from './search.interface';

import { createNewRule, getDefaultRuleValue } from '@utils/rules';

import type { FilterItem } from '@type';

const emit = defineEmits<(event: 'update:rule', rule: Rule) => void>();
const props = defineProps<{
  rule: Rule | null;
  filterItems: Record<string, FilterItem>;
}>();

const { t } = useI18n();

const filterSelectItems = computed(() => {
  return Object.entries(props.filterItems).map(([id, item]) => ({
    id,
    label: item.label,
  }));
});

const filterOperatorItems = computed(() => {
  // Shouldn't be possible as rule must be selected first
  if (!props.rule) return [];

  const args = props.filterItems[props.rule.field];
  return [
    ...operatorItems[args.type],
    ...(args.nullable ? nullableOperatorItems : []),
  ];
});

function changeRule(id: string) {
  const type = props.filterItems[id].type;
  emit('update:rule', createNewRule(id, type));
}

function changeOperator(operator: RuleOperator) {
  // Shouldn't be possible as rule must be selected first
  if (!props.rule) return;

  const type = props.filterItems[props.rule.field].type;
  const oldOperator = props.rule.operator;
  const typeOperators = operatorsByTypeMap[type];
  const newArgs = (operator && typeOperators[operator]?.args) || 0;
  const oldArgs = (oldOperator && typeOperators[oldOperator]?.args) || 0;

  emit('update:rule', {
    field: props.rule.field,
    operator,
    value:
      newArgs === oldArgs
        ? props.rule.value
        : new Array(newArgs).fill(getDefaultRuleValue(type)),
  });
}
</script>
operatorsByTypeMap, type type import { createNewRule, getDefaultRuleValue } from
'@utils/rules';
