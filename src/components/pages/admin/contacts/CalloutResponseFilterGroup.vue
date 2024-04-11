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
import {
  ItemStatus,
  getCalloutComponents,
  type Rule,
} from '@beabee/beabee-common';
import { computed, onBeforeMount, ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import AppSelect from '@components/forms/AppSelect.vue';
import AppSearchRuleFilterGroup from '@components/search/AppSearchRuleFilterGroup.vue';

import { convertComponentsToFilters } from '@utils/callouts';
import { fetchCallouts } from '@utils/api/callout';

import type { FilterItems, GetCalloutDataWith } from '@type/index';

const emit = defineEmits<(event: 'update:rule', rule: Rule) => void>();
const props = defineProps<{ rule: Rule | null }>();

const { t } = useI18n();

const callouts = ref<GetCalloutDataWith<'form'>[]>([]);
const selectedCalloutId = ref('');

watch(
  toRef(props, 'rule'),
  (newRule) => {
    if (newRule) {
      selectedCalloutId.value = newRule.field.split('.')[1];
    }
  },
  { immediate: true }
);

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

  return convertComponentsToFilters(
    component,
    `callouts.${callout.id}.responses.answers`
  );
});

onBeforeMount(async () => {
  // TODO: handle pagination
  callouts.value = (
    await fetchCallouts(
      {
        rules: {
          condition: 'OR',
          rules: [
            { field: 'status', operator: 'equal', value: [ItemStatus.Open] },
            { field: 'status', operator: 'equal', value: [ItemStatus.Ended] },
          ],
        },
        sort: 'title',
      },
      ['form']
    )
  ).items;
});
</script>
