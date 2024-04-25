<template>
  <span v-if="readonly">
    <b>{{ selectedCallout?.title || '???' }}</b>
    {{ t('contacts.advancedSearch.responseTo') }}{{ ' ' }}
  </span>
  <AppSelect
    v-else
    v-model="selectedCalloutId"
    :items="[
      { id: '', label: t('contacts.advancedSearch.selectCallout') },
      ...calloutItems,
    ]"
    class="mb-2"
  />

  <AppSearchRuleFilterGroup
    v-if="filterItems"
    :rule="rule && filterItems[rule.field] ? rule : null"
    :filter-group="{ items: filterItems }"
    :readonly="readonly"
    @update:rule="emit('update:rule', $event)"
  />
</template>
<script lang="ts" setup>
import {
  ItemStatus,
  getCalloutComponents,
  type Rule,
} from '@beabee/beabee-common';
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import AppSelect from '@components/forms/AppSelect.vue';
import AppSearchRuleFilterGroup from '@components/search/AppSearchRuleFilterGroup.vue';

import { fetchCallout, fetchCallouts } from '@utils/api/callout';
import { convertComponentsToFilters } from '@utils/callouts';

import {
  type GetCalloutData,
  type GetCalloutDataWith,
  type FilterGroup,
  type FilterItems,
} from '@type';

const emit = defineEmits<(event: 'update:rule', rule: Rule) => void>();
const props = defineProps<{
  rule: Rule | null;
  filterGroup: FilterGroup;
  readonly?: boolean;
}>();

const { t } = useI18n();

const callouts = ref<GetCalloutData[]>([]);
const selectedCalloutId = ref('');

const selectedCallout = ref<GetCalloutDataWith<'form'>>();
const calloutItems = computed(() => {
  return callouts.value.map((callout) => ({
    id: callout.id,
    label: callout.title,
  }));
});

const filterItems = computed<FilterItems>(() => {
  if (!selectedCallout.value) return {};

  const component = getCalloutComponents(
    selectedCallout.value.formSchema
  ).filter((c) => !!c.input);

  return {
    [`callouts.${selectedCallout.value.id}.hasAnswered`]: {
      type: 'boolean',
      label: t('contacts.advancedSearch.hasAnswered'),
    },
    ...convertComponentsToFilters(
      component,
      `callouts.${selectedCallout.value.id}.responses.answers`
    ),
  };
});

// Set the callout ID to the current rule when it changes
watchEffect(() => {
  selectedCalloutId.value = props.rule ? props.rule.field.split('.')[1] : '';
});

// Load the selected callout
watchEffect(async () => {
  selectedCallout.value = selectedCalloutId.value
    ? await fetchCallout(selectedCalloutId.value, ['form'])
    : undefined;
});

onBeforeMount(async () => {
  // TODO: handle pagination
  callouts.value = (
    await fetchCallouts({
      rules: {
        condition: 'OR',
        rules: [
          { field: 'status', operator: 'equal', value: [ItemStatus.Open] },
          { field: 'status', operator: 'equal', value: [ItemStatus.Ended] },
        ],
      },
      sort: 'title',
    })
  ).items;
});
</script>
