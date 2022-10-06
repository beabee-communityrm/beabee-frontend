<template>
  <component
    :is="operatorComponents[filter.operator]"
    :values="filter.values"
    :type="filters[filter.id].type"
    :readonly="!!readonly"
  />
</template>
<script lang="ts" setup>
import { Filter, filters } from './contacts.interface';
import BetweenArgs from './operators/BetweenArgs.vue';
import SingleArg from './operators/SingleArg.vue';

defineProps<{ filter: Filter; readonly?: boolean }>();

const operatorComponents = {
  equal: SingleArg,
  contains: SingleArg,
  begins_with: SingleArg,
  ends_with: SingleArg,
  between: BetweenArgs,
  less: SingleArg,
  greater: SingleArg,
} as const;
</script>
