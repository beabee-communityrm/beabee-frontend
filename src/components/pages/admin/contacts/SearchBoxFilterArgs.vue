<template>
  <span v-if="isNegated">not</span>
  <component
    :is="operatorComponents[actualOperator]"
    :values="filter.values"
    :args="filters[filter.id]"
    :readonly="!!readonly"
  />
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { GetPaginatedQueryRuleOperator } from '../../../../utils/api/api.interface';
import { Filter, filters } from './contacts.interface';
import BetweenArgs from './operators/BetweenArgs.vue';
import SingleArg from './operators/SingleArg.vue';
import NoArg from './operators/NoArg.vue';

const props = defineProps<{ filter: Filter; readonly?: boolean }>();

const isNegated = computed(() => props.filter.operator.includes('not_'));

const actualOperator = computed(
  () =>
    props.filter.operator.replace('not_', '') as Exclude<
      GetPaginatedQueryRuleOperator,
      `${'is_not' | 'not'}_${string}`
    >
);

const operatorComponents = {
  equal: SingleArg,
  contains: SingleArg,
  begins_with: SingleArg,
  ends_with: SingleArg,
  between: BetweenArgs,
  less: SingleArg,
  less_or_equal: SingleArg,
  greater: SingleArg,
  greater_or_equal: SingleArg,
  is_empty: NoArg,
} as const;
</script>
