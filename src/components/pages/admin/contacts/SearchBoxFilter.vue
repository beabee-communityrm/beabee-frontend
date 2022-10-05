<template>
  <div class="flex items-start gap-2">
    <button
      @click="emit('remove')"
      class="my-[1px] -ml-2 p-2 leading-tight text-primary-80 hover:text-primary"
      type="button"
    >
      <font-awesome-icon :icon="['fa', 'times']" />
    </button>
    <AppSelect v-model="filter.id" :items="filterItems" required />
    <template v-if="filter.id">
      <AppSelect
        v-model="filter.operator"
        :items="fieldOperatorItems"
        required
      />
      <SearchBoxFilterArgs :filter="filter" />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../../../forms/AppSelect.vue';
import {
  EmptyFilter,
  Filter,
  filters,
  getOperators,
  operators,
} from './contacts.interface';
import SearchBoxFilterArgs from './SearchBoxFilterArgs.vue';

const emit = defineEmits(['change', 'remove']);
const props = defineProps<{
  filter: Filter | EmptyFilter;
}>();

const { t } = useI18n();

const filterItems = [
  {
    id: '',
    label: t('advancedSearch.selectFilter'),
  },
  ...Object.keys(filters).map((id) => ({
    id,
    label: t('contacts.filters.' + id),
  })),
];

const typeOperatorItems = Object.fromEntries(
  Object.entries(operators).map(([type, typeOperators]) => [
    type,
    Object.entries(typeOperators).map(([operator]) => ({
      id: operator,
      label: t('advancedSearch.operators.' + operator),
    })),
  ])
);

const activeFilter = computed(
  () => props.filter.id && filters[props.filter.id]
);

const fieldOperatorItems = computed(() =>
  activeFilter.value ? typeOperatorItems[activeFilter.value.type] : []
);

watch(
  () => props.filter.id,
  (id) => {
    props.filter.operator = id ? 'equal' : '';
    props.filter.values = [];
  }
);

watch(
  () => props.filter.operator,
  (operator, oldOperator) => {
    if (props.filter.id) {
      const operators = getOperators(props.filter);
      const newArgs = (operator && operators[operator]?.args.length) || 0;
      const oldArgs = (oldOperator && operators[oldOperator]?.args.length) || 0;
      if (newArgs !== oldArgs) {
        props.filter.values = new Array(newArgs);
      }
    }
  }
);
</script>
