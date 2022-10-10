<template>
  <template v-if="readonly">
    <template v-if="filter.id">
      <b>{{ filters[filter.id].label }}</b>
      {{ operatorT(filters[filter.id].type, filter.operator) }}
      {{ filter.inclusive ? '' : 'not' }}
      <AppSearchFilterArgs
        :filter="filter"
        :args="filters[filter.id]"
        readonly
      />
    </template>
  </template>
  <div v-else class="flex items-center gap-2">
    <button
      class="-ml-2 p-2 leading-tight text-primary-80 hover:text-primary"
      type="button"
      @click="emit('remove')"
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
      <AppRadioGroup
        :model-value="filter.inclusive"
        :options="[
          [true, 'inc'],
          [false, 'exc'],
        ]"
        @update:model-value="
          filter.operator && changeOperator(filter.operator, $event)
        "
      />
      <AppSelect
        v-if="fieldOperatorItems.length > 1"
        :model-value="filter.operator"
        :items="fieldOperatorItems"
        required
        @update:model-value="changeOperator($event, filter.inclusive)"
      />
      <span v-else>{{ fieldOperatorItems[0].label }}</span>
      <AppSearchFilterArgs :filter="filter" :args="filters[filter.id]" />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppRadioGroup from '../forms/AppRadioGroup.vue';
import AppSelect from '../forms/AppSelect.vue';
import {
  EmptyFilter,
  Filter,
  FilterOperator,
  Filters,
  FilterType,
  getOperators,
  operators,
} from './search.interface';
import AppSearchFilterArgs from './AppSearchFilterArgs.vue';

const emit = defineEmits(['update:filter', 'remove']);
const props = defineProps<{
  filters: Filters;
  filter: Filter | EmptyFilter;
  readonly?: boolean;
}>();

const { t } = useI18n();

function operatorT(type: FilterType, operator: FilterOperator) {
  return t(`advancedSearch.operators.${type}.${operator}`);
}

const filterItems = computed(() => [
  {
    id: '',
    label: t('advancedSearch.selectFilter'),
  },
  ...Object.entries(props.filters).map(([id, filter]) => ({
    id,
    label: filter.label,
  })),
]);

const typeOperatorItems = Object.fromEntries(
  Object.entries(operators).map(([type, typeOperators]) => [
    type,
    Object.entries(typeOperators).map(([operator]) => ({
      id: operator,
      label: operatorT(type as FilterType, operator as FilterOperator),
    })),
  ])
);

const fieldOperatorItems = computed(() =>
  props.filter.id ? typeOperatorItems[props.filters[props.filter.id].type] : []
);

function changeFilter(id: string) {
  emit('update:filter', {
    id,
    operator: 'equal',
    inclusive: true,
    values: [],
  } as Filter);
}

function changeOperator(operator: FilterOperator, inclusive: boolean) {
  if (props.filter.id) {
    const oldOperator = props.filter.operator;
    const operators = getOperators(props.filters[props.filter.id].type);
    const newArgs = (operator && operators[operator]?.args) || 0;
    const oldArgs = (oldOperator && operators[oldOperator]?.args) || 0;

    emit('update:filter', {
      id: props.filter.id,
      operator,
      inclusive,
      values: newArgs === oldArgs ? props.filter.values : new Array(newArgs),
    } as Filter);
  }
}
</script>
