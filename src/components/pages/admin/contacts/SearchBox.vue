<template>
  <div class="flex">
    <!--<div class="flex-1">actions</div>-->
    <AppSearchInput v-model="searchText" :placeholder="t('contacts.search')" />
    <button
      class="ml-2 flex items-center rounded border border-primary-40 px-3 text-sm font-semibold"
      @click="toggleAdvancedSearch"
      :class="
        showAdvancedSearch &&
        'relative rounded-b-none border border-b-primary/0'
      "
    >
      {{ t('contacts.advancedSearch') }}
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
        v-model="matchType"
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
          v-for="(filter, i) in filters"
          :key="i"
          class="group relative -mx-4 gap-2 border-b border-primary-40 bg-primary-10 px-4 py-6 first:border-t"
        >
          <SearchBoxFilter :filter="filter" @remove="removeFilter(i)" />
          <span
            class="absolute bottom-full left-1/2 z-10 -translate-x-1/2 translate-y-1/2 rounded bg-primary-70 px-2 py-1 font-bold uppercase text-white group-first:hidden"
            >{{ t('advancedSearch.matchWord.' + matchType) }}</span
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
    class="my-2 flex flex-wrap items-center gap-2 text-sm text-body-80"
  >
    <template v-for="(filter, i) in currentFilters" :key="i">
      <li class="rounded-full border border-primary-70 px-2 py-1">
        <b>{{ t('contacts.filters.' + filter.id) }}</b>
        {{ t('advancedSearch.operators.' + filter.operator) }}
        <b>{{ filter.values }}</b>
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
import {
  GetMembersQuery,
  GetMembersQueryFields,
  GetPaginatedQueryRule,
} from '../../../../utils/api/api.interface';
import AppButton from '../../../forms/AppButton.vue';
import AppSearchInput from '../../../forms/AppSearchInput.vue';
import AppSelect from '../../../forms/AppSelect.vue';
import { emptyFilter, EmptyFilter, Filter } from './contacts.interface';
import SearchBoxFilter from './SearchBoxFilter.vue';

const emit = defineEmits(['update:search', 'update:rules']);
const props = defineProps<{
  search: string;
  rules: GetMembersQuery['rules'] | undefined;
}>();

const { t } = useI18n();
const validation = useVuelidate();

const searchText = computed({
  get: () => props.search,
  set: (text) => emit('update:search', text),
});

const showAdvancedSearch = ref(false);

const currentMatchType = computed(() =>
  props.rules?.condition === 'OR' ? 'any' : 'all'
);
const currentFilters = computed(() => {
  if (props.rules) {
    // TODO: how to handle groups?
    const rulesWithoutGroups = props.rules.rules.filter(
      (rule) => 'operator' in rule
    ) as GetPaginatedQueryRule<GetMembersQueryFields>[];

    return rulesWithoutGroups.map(
      (rule) =>
        ({
          id: rule.field,
          operator: rule.operator,
          values: Array.isArray(rule.value) ? rule.value : [rule.value],
        } as Filter)
    );
  }
});

const matchType = ref<'all' | 'any'>('all');
const filters = ref<(EmptyFilter | Filter)[]>([]);

function removeFilter(i: number) {
  filters.value.splice(i, 1);
  if (filters.value.length === 0) {
    addFilter();
  }
}

function addFilter() {
  filters.value.push(emptyFilter());
}

function reset() {
  matchType.value = currentMatchType.value;
  filters.value = currentFilters.value || [emptyFilter()];
}

watch(() => props.rules, reset);

function toggleAdvancedSearch() {
  reset();
  showAdvancedSearch.value = !showAdvancedSearch.value;
}

function handleAdvancedSearch() {
  const rules: GetMembersQuery['rules'] = {
    condition: matchType.value === 'all' ? 'AND' : 'OR',
    rules: (filters.value as Filter[]).map((filter) => ({
      field: filter.id,
      operator: filter.operator,
      value: filter.values,
    })),
  };
  emit('update:rules', rules);
}
</script>
