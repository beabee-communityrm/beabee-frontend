<template>
  <div class="flex items-center gap-2">
    <button
      class="-ml-2 p-2 leading-tight text-primary-80 hover:text-primary"
      type="button"
      @click="emit('remove')"
    >
      <font-awesome-icon :icon="['fa', 'times']" />
    </button>
    <AppSelect
      :model-value="modelValue.id"
      :items="filterItems"
      required
      @update:model-value="changeFilter"
    />
    <template v-if="modelValue.id">
      <AppRadioGroup
        :model-value="modelValue.inclusive"
        name=""
        :options="[
          [true, 'inc'],
          [false, 'exc'],
        ]"
        @update:model-value="
          modelValue.operator && changeOperator(modelValue.operator, $event)
        "
      />
      <AppSelect
        v-if="fieldOperatorItems.length > 1"
        :model-value="modelValue.operator"
        :items="fieldOperatorItems"
        required
        @update:model-value="changeOperator($event, modelValue.inclusive)"
      />
      <span v-else>{{ fieldOperatorItems[0].label }}</span>
      <SearchBoxFilterArgs :filter="modelValue" />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
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

const emit = defineEmits(['update:modelValue', 'remove']);
const props = defineProps<{
  modelValue: Filter | EmptyFilter;
}>();

const { t } = useI18n();

const filterItems = [
  {
    id: '',
    label: t('advancedSearch.selectFilter'),
  },
  ...Object.keys(filters).map((id) => ({
    id,
    label: t('advancedSearch.filters.' + id),
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
  () => props.modelValue.id && filters[props.modelValue.id]
);

const fieldOperatorItems = computed(() =>
  activeFilter.value ? typeOperatorItems[activeFilter.value.type] : []
);

function changeFilter(id: FilterId) {
  emit('update:modelValue', {
    id,
    operator: 'equal',
    inclusive: true,
    values: [],
  } as Filter);
}

function changeOperator(operator: FilterOperatorId, inclusive: boolean) {
  if (props.modelValue.id) {
    const oldOperator = props.modelValue.operator;
    const operators = getOperators(props.modelValue);
    const newArgs = (operator && operators[operator]?.args) || 0;
    const oldArgs = (oldOperator && operators[oldOperator]?.args) || 0;

    emit('update:modelValue', {
      id: props.modelValue.id,
      operator,
      inclusive,
      values:
        newArgs === oldArgs ? props.modelValue.values : new Array(newArgs),
    } as Filter);
  }
}
</script>
