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
  </div>

  <form
    v-if="showAdvancedSearch"
    class="mt-2 mb-8 border border-primary-40 p-4"
    @submit.prevent="handleAdvancedSearch"
  >
    <p class="mb-3">
      <b>{{ t('advancedSearch.createFilters') }}</b>
    </p>

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
            :filters="filters"
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

    <div class="flex gap-2">
      <div class="flex-1">
        <AppButton variant="text" @click="toggleAdvancedSearch">
          {{ t('actions.cancel') }}
        </AppButton>
      </div>
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
        <AppSearchFilter :filters="filters" :filter="filter" readonly />
      </li>
      <li class="font-bold uppercase last:hidden">
        {{ t('advancedSearch.matchWord.' + currentMatchType) }}
      </li>
    </template>
  </ul>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { GetPaginatedQuery } from '../../utils/api/api.interface';
import AppButton from '../forms/AppButton.vue';
import AppSearchInput from '../forms/AppSearchInput.vue';
import AppSelect from '../forms/AppSelect.vue';
import {
  convertFiltersToRules,
  convertRulesToFilters,
  emptyFilter,
  EmptyFilter,
  Filter,
  Filters,
} from './search.interface';
import AppSearchFilter from './AppSearchFilter.vue';

const emit = defineEmits(['update:search', 'update:rules']);
const props = defineProps<{
  filters: Filters;
  search: string;
  rules: GetPaginatedQuery<string>['rules'] | undefined;
}>();

const { t } = useI18n();
const validation = useVuelidate();

const searchText = computed({
  get: () => props.search,
  set: (text) => emit('update:search', text),
});

const showAdvancedSearch = ref(false);

const selectedMatchType = ref<'all' | 'any'>('all');
const selectedFilters = ref<(EmptyFilter | Filter)[]>([]);

const currentMatchType = computed(() =>
  props.rules?.condition === 'OR' ? 'any' : 'all'
);
const currentFilters = computed(() => convertRulesToFilters(props.rules));

function removeFilter(i: number) {
  selectedFilters.value.splice(i, 1);
  if (selectedFilters.value.length === 0) {
    addFilter();
  }
}

function addFilter() {
  selectedFilters.value.push(emptyFilter());
}

function reset() {
  selectedMatchType.value = currentMatchType.value;
  selectedFilters.value = convertRulesToFilters(props.rules) || [emptyFilter()];
}

watch(() => props.rules, reset);

function toggleAdvancedSearch() {
  reset();
  showAdvancedSearch.value = !showAdvancedSearch.value;
}

function handleAdvancedSearch() {
  emit(
    'update:rules',
    convertFiltersToRules(
      selectedMatchType.value,
      selectedFilters.value as Filter[]
    )
  );
}
</script>
