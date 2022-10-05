<template>
  <div v-for="(arg, i) in args" :key="i">
    <AppInput v-model="filter.values[i]" :type="arg.type" required />
  </div>
</template>
<script lang="ts" setup>
import { Filter, filters, operators } from './contacts.interface';
import AppInput from '../../../forms/AppInput.vue';
import { computed } from '@vue/reactivity';

const props = defineProps<{ filter: Filter }>();

const args = computed(
  () =>
    operators[filters[props.filter.id].type][props.filter.operator]?.args || []
);
</script>
