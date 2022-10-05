<template>
  <div class="flex items-start gap-2">
    <button
      @click="emit('remove')"
      class="my-[1px] -ml-2 p-2 leading-tight text-primary-80 hover:text-primary"
      type="button"
    >
      <font-awesome-icon :icon="['fa', 'times']" />
    </button>
    <AppSelect
      :model-value="filter.id"
      :items="filterItems"
      required
      @update:model-value="changeFilter"
    />
    <template v-if="filter.id">
      <AppSelect
        :model-value="filter.operator"
        :items="fieldOperatorItems"
        required
        @update:model-value="changeOperator"
      />
      <SearchBoxFilterArgs :filter="filter" />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../../../forms/AppSelect.vue';
import {
  EmptyFilter,
  Filter,
  FilterId,
  FilterOperatorId,
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

function changeFilter(id: FilterId) {
  props.filter.id = id;
  props.filter.operator = 'equal';
  props.filter.values = [];
}

function changeOperator(operator: FilterOperatorId) {
  if (props.filter.id) {
    const oldOperator = props.filter.operator;
    const operators = getOperators(props.filter);
    const newArgs = (operator && operators[operator]?.args.length) || 0;
    const oldArgs = (oldOperator && operators[oldOperator]?.args.length) || 0;

    props.filter.operator = operator;
    if (newArgs !== oldArgs) {
      props.filter.values = new Array(newArgs);
    }
  }
}
</script>
