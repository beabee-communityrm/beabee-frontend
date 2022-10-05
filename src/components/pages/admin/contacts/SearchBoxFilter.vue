<template>
  <li
    class="group relative -mx-4 flex items-start gap-2 border-b border-primary-40 bg-primary-10 px-4 py-6 first:border-t"
  >
    <button
      @click="emit('remove')"
      class="my-[1px] -ml-2 p-2 leading-tight text-primary-80 hover:text-primary"
      type="button"
    >
      <font-awesome-icon :icon="['fa', 'times']" />
    </button>
    <AppSelect v-model="filterId" :items="filterItems" required />
    <template v-if="modelValue?.id">
      <AppSelect
        v-if="modelValue.id"
        v-model="modelValue.operatorId"
        :items="fieldOperatorItems"
      />
      <SearchBoxFilterArgs :filter="modelValue" />
    </template>
    <span
      class="absolute bottom-full left-1/2 z-10 -translate-x-1/2 translate-y-1/2 rounded bg-primary-70 px-2 py-1 font-bold uppercase text-white group-first:hidden"
      >{{ matchWord }}</span
    >
  </li>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../../../forms/AppSelect.vue';
import { Filter, filters, operators } from './contacts.interface';
import SearchBoxFilterArgs from './SearchBoxFilterArgs.vue';

const emit = defineEmits(['update:modelValue', 'remove']);
const props = defineProps<{
  modelValue: Filter | null;
  matchWord: string;
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

const fieldOperatorItems = computed(() =>
  props.modelValue?.id
    ? typeOperatorItems[filters[props.modelValue.id].type]
    : []
);

const filterId = computed({
  get: () => props.modelValue?.id || '',
  set: (id) => emit('update:modelValue', id ? new Filter(id) : null),
});

watch(
  () => props.modelValue?.operatorId,
  () => {
    if (props.modelValue?.id) {
      props.modelValue.values = new Array(
        props.modelValue.operator.args.length
      ).fill(undefined);
    }
  }
);
</script>
