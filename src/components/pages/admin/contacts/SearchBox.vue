<template>
  <div class="flex">
    <!--<div class="flex-1">actions</div>-->
    <AppSearchInput v-model="searchText" :placeholder="t('contacts.search')" />
    <button
      class="ml-2 flex items-center rounded border border-primary-40 px-3 text-sm font-semibold"
      @click="showAdvancedSearch = !showAdvancedSearch"
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
    @submit.prevent="handleSearch"
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
        <SearchBoxFilter
          v-for="(filter, i) in filters"
          :key="i"
          v-model="filters[i]"
          :match-word="matchWord"
          @remove="removeFilter(i)"
        />
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
        <AppButton variant="text" @click="showAdvancedSearch = false">
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
  <div v-else>Summarise search</div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { GetMembersQuery } from '../../../../utils/api/api.interface';
import AppButton from '../../../forms/AppButton.vue';
import AppSearchInput from '../../../forms/AppSearchInput.vue';
import AppSelect from '../../../forms/AppSelect.vue';
import { Filter } from './contacts.interface';
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
const showAdvancedSearch = ref(true);

const matchType = ref<'all' | 'any'>('all');
const matchWord = computed(() => (matchType.value === 'all' ? 'AND' : 'OR'));

const filters = reactive<(null | Filter)[]>([null]);

function removeFilter(i: number) {
  if (i === 0 && filters.length === 1) {
    filters[0] = null;
  } else {
    filters.splice(i, 1);
  }
}

function addFilter() {
  filters.push(null);
}

function handleSearch() {
  console.log('here');
  const rules: GetMembersQuery['rules'] = {
    condition: matchType.value === 'all' ? 'AND' : 'OR',
    rules: (filters as Filter[]).map((filter) => ({
      field: filter.id,
      operator: filter.operatorId,
      value: filter.values,
    })),
  };
  console.log(rules);
  emit('update:rules', rules);
}
</script>
