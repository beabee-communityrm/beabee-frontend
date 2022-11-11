<template>
  <form
    v-if="props.expanded"
    class="mt-2 mb-8 border border-primary-40 p-4"
    @submit.prevent="handleFormSubmit"
  >
    <h4 class="mb-3 font-semibold">
      {{ t('advancedSearch.createFilters') }}
    </h4>

    <div class="mb-3 flex items-center gap-2 text-sm text-body-80">
      <span>{{ t('advancedSearch.matchBefore') }}</span>
      <AppSelect
        v-model="selectedMatchType"
        :items="[
          { id: 'all', label: t('advancedSearch.matchType.all') },
          { id: 'any', label: t('advancedSearch.matchType.any') },
        ]"
        input-class="font-bold uppercase"
      />
      <span>{{ t('advancedSearch.matchAfter') }}</span>
    </div>

    <div class="relative mb-8">
      <ul class="mb-3 text-sm">
        <li
          v-for="(filter, i) in selectedFilters"
          :key="i"
          class="group relative -mx-4 gap-2 border-b border-primary-40 bg-primary-10 px-4 py-6 first:border-t"
        >
          <AppSearchFilter
            v-model:filter="selectedFilters[i]"
            :filter-groups="filterGroups"
            :filter-items="filterItems"
            @remove="removeFilter(i)"
          />
          <span
            class="absolute bottom-full left-1/2 z-10 -translate-x-1/2 translate-y-1/2 rounded bg-primary-70 px-2 py-1 font-bold uppercase text-white group-first:hidden"
            >{{ t('advancedSearch.matchWord.' + selectedMatchType) }}</span
          >
        </li>
      </ul>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <AppButton
          variant="primaryOutlined"
          icon="plus"
          size="sm"
          @click="addFilter"
        >
          {{ t('advancedSearch.addRule') }}
        </AppButton>
      </div>
    </div>

    <div class="flex justify-between gap-2">
      <AppButton variant="text" @click="handleReset">
        {{ t('actions.reset') }}
      </AppButton>
      <AppButton variant="link" :disabled="validation.$invalid" type="submit">
        {{ t('actions.search') }}
      </AppButton>
    </div>
  </form>
  <ul
    v-else-if="currentFilters"
    class="my-4 flex flex-wrap items-center gap-2 text-sm text-body-80"
  >
    <template v-for="(filter, i) in currentFilters" :key="i">
      <li class="rounded-full border border-primary-70 px-2 py-1">
        <AppSearchFilter
          :filter-groups="filterGroups"
          :filter-items="filterItems"
          :filter="filter"
          readonly
          @remove="removeFilter(i)"
        />
      </li>
      <li class="font-bold uppercase last:hidden">
        {{ t('advancedSearch.matchWord.' + currentMatchType) }}
      </li>
    </template>
  </ul>
</template>

<script lang="ts" setup>
import {
  convertFiltersToRuleGroup,
  convertRuleGroupToFilters,
  Filter,
  RuleGroup,
} from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '../forms/AppButton.vue';
import AppSelect from '../forms/AppSelect.vue';
import AppSearchFilter from './AppSearchFilter.vue';
import { FilterGroup, FilterItems } from './search.interface';

const emit = defineEmits(['reset', 'update:modelValue']);
const props = defineProps<{
  filterItems: FilterItems;
  filterGroups: FilterGroup[];
  modelValue: RuleGroup | undefined;
  expanded: boolean;
}>();

const { t } = useI18n();
const validation = useVuelidate();

const selectedMatchType = ref<'all' | 'any'>('all');
const selectedFilters = ref<(null | Filter)[]>([]);

const currentMatchType = computed(() =>
  props.modelValue?.condition === 'OR' ? 'any' : 'all'
);
const currentFilters = computed(() =>
  convertRuleGroupToFilters(props.modelValue)
);

function removeFilter(i: number) {
  selectedFilters.value.splice(i, 1);
  if (props.expanded) {
    if (selectedFilters.value.length === 0) {
      addFilter();
    }
  } else {
    handleFormSubmit();
  }
}

function addFilter() {
  selectedFilters.value.push(null);
}

function reset() {
  selectedMatchType.value = currentMatchType.value;
  const filters = convertRuleGroupToFilters(props.modelValue);
  selectedFilters.value = filters && filters.length > 0 ? filters : [null];
}

watch(() => props.modelValue, reset);
watch(
  () => props.expanded,
  (value) => {
    if (value) reset();
  }
);

function handleReset() {
  emit('reset');
  reset();
}

function handleFormSubmit() {
  emit(
    'update:modelValue',
    convertFiltersToRuleGroup(
      selectedMatchType.value,
      selectedFilters.value.filter((f) => !!f) as Filter[]
    )
  );
}
</script>
