<template>
  <component
    :is="operatorComponents[filter.operator]"
    :values="filter.values"
    :args="filters[filter.id]"
    :readonly="!!readonly"
  />
</template>
<script lang="ts" setup>
import { Filter, filters } from './contacts.interface';
import BetweenArgs from './operators/BetweenArgs.vue';
import SingleArg from './operators/SingleArg.vue';
import NoArg from './operators/NoArg.vue';

defineProps<{ filter: Filter; readonly?: boolean }>();

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
