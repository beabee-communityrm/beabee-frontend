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
  <div v-if="showAdvancedSearch" class="mt-2 mb-8 border border-primary-40 p-4">
    <p class="mb-3"><b>Create filters for your search</b></p>
    <div class="mb-3 flex items-center gap-2 text-sm text-body-80">
      <span>Match</span>
      <AppSelect
        v-model="matchType"
        :items="[
          { id: 'all', label: 'All' },
          { id: 'any', label: 'Any' },
        ]"
        input-class="font-bold uppercase"
      />
      <span>of the following</span>
    </div>

    <div class="relative mb-8">
      <ul class="mb-3 text-sm">
        <SearchBoxFilter
          v-for="(filter, i) in filters"
          :key="i"
          :filter="filter"
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
          Add rule
        </AppButton>
      </div>
    </div>

    <div class="flex gap-2">
      <div class="flex-1">
        <AppButton variant="text" @click="showAdvancedSearch = false"
          >Cancel</AppButton
        >
      </div>
      <AppButton variant="primaryOutlined">Save as segment</AppButton>
      <AppButton variant="link">Show results</AppButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '../../../forms/AppButton.vue';
import AppSearchInput from '../../../forms/AppSearchInput.vue';
import AppSelect from '../../../forms/AppSelect.vue';
import { EmptyFilter, Filter } from './contacts.interface';
import SearchBoxFilter from './SearchBoxFilter.vue';

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: string;
}>();

const searchText = computed({
  get: () => props.modelValue,
  set: (text) => emit('update:modelValue', text),
});
const showAdvancedSearch = ref(true);

const matchType = ref<'all' | 'any'>('all');
const matchWord = computed(() => (matchType.value === 'all' ? 'AND' : 'OR'));

function newFilter(): EmptyFilter {
  return { field: '' };
}

const filters = reactive<(EmptyFilter | Filter)[]>([newFilter()]);

watch(filters, () => console.log(filters));

function removeFilter(i: number) {
  if (i === 0 && filters.length === 1) {
    filters[0] = newFilter();
  } else {
    filters.splice(i, 1);
  }
}

function addFilter() {
  filters.push(newFilter());
}
</script>
