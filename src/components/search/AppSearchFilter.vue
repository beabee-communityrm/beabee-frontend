<template>
  <template v-if="readonly">
    <template v-if="filter">
      <b>{{ filterItems[filter.id].label }}</b>
      {{ operatorT(filterItems[filter.id].type, filter.operator) }}
      <AppSearchFilterArgs
        :filter="filter"
        :item="filterItems[filter.id]"
        readonly
      />
      <button type="button" class="-mr-2 px-2" @click="emit('remove')">
        <font-awesome-icon :icon="['fa', 'times']" />
      </button>
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
      :model-value="filter?.id || ''"
      :items="filterGroupsWithDefault"
      required
      @update:model-value="changeFilter"
    />
    <template v-if="filter">
      <AppSelect
        v-if="filterOperatorItems.length > 1"
        :model-value="filter.operator"
        :items="filterOperatorItems"
        required
        @update:model-value="changeOperator($event)"
      />
      <span v-else>{{ filterOperatorItems[0].label }}</span>
      <AppSearchFilterArgs :filter="filter" :item="filterItems[filter.id]" />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../forms/AppSelect.vue';
import {
  Filter,
  FilterOperator,
  FilterType,
  nullableOperators,
  operatorsByType,
} from '@beabee/beabee-common';
import AppSearchFilterArgs from './AppSearchFilterArgs.vue';
import { FilterGroup, FilterItems } from './search.interface';

const emit = defineEmits(['update:filter', 'remove']);
const props = defineProps<{
  filterGroups: FilterGroup[];
  filterItems: FilterItems;
  filter: Filter | null;
  readonly?: boolean;
}>();

const { t } = useI18n();

function operatorT(type: FilterType | 'all', operator: FilterOperator) {
  // TODO: move translations to search.interface.ts
  if (operator === 'is_empty' || operator === 'is_not_empty') {
    type = 'all';
  }

  return t(`advancedSearch.operators.${type}.${operator}`);
}

const filterGroupsWithDefault = computed(() => [
  {
    id: '',
    label: t('advancedSearch.selectFilter'),
  },
  ...props.filterGroups.map((group) => ({
    label: group.label,
    items: group.items.map((id) => ({
      id,
      label: props.filterItems[id].label,
    })),
  })),
]);

const operatorItems = Object.fromEntries(
  Object.entries(operatorsByType).map(([type, typeOperators]) => [
    type,
    Object.entries(typeOperators).map(([operator]) => ({
      id: operator,
      label: operatorT(type as FilterType, operator as FilterOperator),
    })),
  ])
);

const nullableOperatorItems = Object.entries(nullableOperators).map(
  ([operator]) => ({
    id: operator,
    label: operatorT('all', operator as FilterOperator),
  })
);

const filterOperatorItems = computed(() => {
  if (props.filter) {
    const args = props.filterItems[props.filter.id];
    return [
      ...operatorItems[args.type],
      ...(args.nullable ? nullableOperatorItems : []),
    ];
  } else {
    return [];
  }
});

function changeFilter(id: string) {
  emit('update:filter', {
    id,
    operator: 'equal',
    values: [''], // TODO: doesn't respect filter type (text, date, number, etc.)
  } as Filter);
}

function changeOperator(operator: FilterOperator) {
  if (props.filter) {
    const type = props.filterItems[props.filter.id].type;
    const oldOperator = props.filter.operator;
    const typeOperators = operatorsByType[type] as any; // TODO: remove any for operatorsByType
    const newArgs = (operator && typeOperators[operator]?.args) || 0;
    const oldArgs = (oldOperator && typeOperators[oldOperator]?.args) || 0;

    emit('update:filter', {
      id: props.filter.id,
      operator,
      values:
        // TODO: doesn't respect filter type (text, date, number, etc.)
        newArgs === oldArgs ? props.filter.values : new Array(newArgs).fill(''),
    } as Filter);
  }
}
</script>
