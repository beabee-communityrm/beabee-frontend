<template>
  <div class="flex">
    <AppSearchInput v-model="searchText" :placeholder="t('contacts.search')" />
    <button
      class="ml-2 flex items-center rounded border border-primary-40 px-3 text-sm font-semibold"
      :class="
        showAdvancedSearch &&
        'relative rounded-b-none border border-b-primary/0'
      "
      @click="toggleAdvancedSearch"
    >
      {{ t('advancedSearch.button') }}
      <font-awesome-icon
        class="ml-2"
        :icon="['fa', showAdvancedSearch ? 'caret-up' : 'caret-down']"
      />
      <div
        class="absolute -left-[1px] top-full box-content h-2 w-full border-x border-x-primary-40 bg-primary-5 py-[1px]"
      />
    </button>
    <div v-if="numResults !== undefined" class="flex-1 self-center text-right">
      <i18n-t keypath="contacts.numResults" :plural="numResults">
        <template #n>
          <b>{{ n(numResults) }}</b>
        </template>
      </i18n-t>
    </div>
  </div>

  <form
    v-if="showAdvancedSearch"
    class="mt-2 mb-8 border border-primary-40 p-4"
    @submit.prevent="handleAdvancedSearch"
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

    <div class="flex justify-end gap-2">
      <AppButton variant="primaryOutlined" :disabled="validation.$invalid">
        {{ t('advancedSearch.saveAsSegment') }}
      </AppButton>
      <AppButton variant="link" :disabled="validation.$invalid" type="submit">
        {{ t('advancedSearch.showResults') }}
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
import AppSearchInput from '../forms/AppSearchInput.vue';
import AppSelect from '../forms/AppSelect.vue';
import AppSearchFilter from './AppSearchFilter.vue';
import { FilterGroup, FilterItems } from './search.interface';

const emit = defineEmits(['update:search', 'update:rules']);
const props = defineProps<{
  filterItems: FilterItems;
  filterGroups: FilterGroup[];
  search: string;
  rules: RuleGroup | undefined;
  numResults?: number;
}>();

const { n, t } = useI18n();
const validation = useVuelidate();

const searchText = computed({
  get: () => props.search,
  set: (text) => emit('update:search', text),
});

const showAdvancedSearch = ref(false);

const selectedMatchType = ref<'all' | 'any'>('all');
const selectedFilters = ref<(null | Filter)[]>([]);

const currentMatchType = computed(() =>
  props.rules?.condition === 'OR' ? 'any' : 'all'
);
const currentFilters = computed(() => convertRuleGroupToFilters(props.rules));

function removeFilter(i: number) {
  selectedFilters.value.splice(i, 1);
  if (showAdvancedSearch.value) {
    if (selectedFilters.value.length === 0) {
      addFilter();
    }
  } else {
    handleAdvancedSearch();
  }
}

function addFilter() {
  selectedFilters.value.push(null);
}

function reset() {
  selectedMatchType.value = currentMatchType.value;
  const filters = convertRuleGroupToFilters(props.rules);
  selectedFilters.value = filters && filters.length > 0 ? filters : [null];
}

watch(() => props.rules, reset);

function toggleAdvancedSearch() {
  reset();
  showAdvancedSearch.value = !showAdvancedSearch.value;
}

function handleAdvancedSearch() {
  emit(
    'update:rules',
    convertFiltersToRuleGroup(
      selectedMatchType.value,
      selectedFilters.value.filter((f) => !!f) as Filter[]
    )
  );
}
</script>