<template>
  <component
    :is="operatorComponents[filter.operator]"
    :values="filter.values"
    :args="args"
    :item="item"
    :readonly="!!readonly"
  />
</template>
<script lang="ts" setup>
import { Filter, FilterArgs } from '@beabee/beabee-common';

import BetweenArgs from './operators/BetweenArgs.vue';
import SingleArg from './operators/SingleArg.vue';
import NoArg from './operators/NoArg.vue';
import { FilterItem } from './search.interface';

defineProps<{
  filter: Filter;
  args: FilterArgs;
  item: FilterItem;
  readonly?: boolean;
}>();

const operatorComponents = {
  equal: SingleArg,
  not_equal: SingleArg,
  contains: SingleArg,
  not_contains: SingleArg,
  begins_with: SingleArg,
  not_begins_with: SingleArg,
  ends_with: SingleArg,
  not_ends_with: SingleArg,
  between: BetweenArgs,
  not_between: BetweenArgs,
  less: SingleArg,
  less_or_equal: SingleArg,
  greater: SingleArg,
  greater_or_equal: SingleArg,
  is_empty: NoArg,
  is_not_empty: NoArg,
} as const;
</script>
