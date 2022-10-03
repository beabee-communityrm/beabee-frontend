<template>
  <li
    class="group relative -mx-4 flex items-center gap-2 border-b border-primary-40 bg-primary-10 px-4 py-6 first:border-t"
  >
    <button
      @click="emit('remove')"
      class="mr-2 text-primary-80 hover:text-primary"
    >
      <font-awesome-icon :icon="['fa', 'times']" />
    </button>
    <AppSelect v-model="filter.field" :items="fieldItems" required />
    <template v-if="filter.field">
      <AppSelect
        v-if="filter.field"
        v-model="filter.operator"
        :items="fieldOperatorItems"
      />
      <SearchBoxFilterArgs
        :operator="filter.operator"
        :values="filter.values"
      />
    </template>
    <span
      class="absolute bottom-full left-1/2 z-10 -translate-x-1/2 translate-y-1/2 rounded bg-primary-70 px-2 py-1 font-bold text-white group-first:hidden"
      >{{ matchWord }}</span
    >
  </li>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue';
import AppSelect from '../../../forms/AppSelect.vue';
import {
  Filter,
  fields,
  typeOperators,
  EmptyFilter,
  operators,
} from './contacts.interface';
import SearchBoxFilterArgs from './SearchBoxFilterArgs.vue';

const emit = defineEmits(['remove']);
const props = defineProps<{
  filter: Filter | EmptyFilter;
  matchWord: string;
}>();

const fieldItems = [
  {
    id: '',
    label: 'Select a field',
  },
  ...Object.entries(fields).map(([fieldId, field]) => ({
    id: fieldId,
    label: fieldId,
  })),
];

const typeOperatorItems = Object.fromEntries(
  Object.entries(typeOperators).map(([type, operators]) => [
    type,
    operators.map((operator) => ({ id: operator, label: operator })),
  ])
);

const fieldOperatorItems = computed(() =>
  props.filter.field ? typeOperatorItems[fields[props.filter.field].type] : []
);

watch(
  () => props.filter.field,
  () => {
    // Use instead of watch cb arg for type narrowing
    if (props.filter.field) {
      props.filter.operator = typeOperators[fields[props.filter.field].type][0];
    }
  }
);

watch(
  () => props.filter.field && props.filter.operator,
  () => {
    if (props.filter.field) {
      props.filter.values = new Array(
        operators[props.filter.operator].args.length
      ).fill(undefined);
    }
  }
);
</script>
