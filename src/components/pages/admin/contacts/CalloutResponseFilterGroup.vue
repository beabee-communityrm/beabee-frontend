<template>
  <div>
    <AppSelect
      v-model="selectedCalloutId"
      :items="[
        { id: '', label: t('contacts.advancedSearch.selectCallout') },
        ...calloutItems,
      ]"
    />
    <AppSearchRuleFilterGroup
      v-if="filterItems"
      :rule="rule && filterItems[rule.field] ? rule : null"
      :filter-items="filterItems"
      class="mt-2"
      @update:rule="emit('update:rule', $event)"
    />
  </div>
</template>
<script lang="ts" setup>
import { getCalloutComponents, type Rule } from '@beabee/beabee-common';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import AppSelect from '@components/forms/AppSelect.vue';
import AppSearchRuleFilterGroup from '@components/search/AppSearchRuleFilterGroup.vue';

import { convertComponentsToFilters } from '@utils/callouts';
import { fetchCallouts } from '@utils/api/callout';

import type { FilterItems, GetCalloutDataWith } from '@type/index';

const emit = defineEmits<(event: 'update:rule', rule: Rule) => void>();
defineProps<{ rule: Rule | null }>();

const { t } = useI18n();

const callouts = ref<GetCalloutDataWith<'form'>[]>([]);
const selectedCalloutId = ref('');

const calloutItems = computed(() => {
  return callouts.value.map((callout) => ({
    id: callout.id,
    label: callout.title,
  }));
});

const filterItems = computed<FilterItems | null>(() => {
  const callout = callouts.value.find(
    (callout) => callout.id === selectedCalloutId.value
  );

  if (!callout) return null;

  const component = getCalloutComponents(callout.formSchema).filter(
    (c) => !!c.input
  );

  console.log('filterItems', component);

  return convertComponentsToFilters(
    component,
    `callouts.${callout.id}.responses.answers`
  );
});

onBeforeMount(async () => {
  // Fetch callouts
  callouts.value = (await fetchCallouts({ sort: 'title' }, ['form'])).items;
});
</script>
