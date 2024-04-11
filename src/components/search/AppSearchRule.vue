<template>
  <template v-if="readonly">
    <template v-if="rule">
      <b>{{ filterItems[rule.field].label }}</b>
      {{ operatorT(filterItems[rule.field].type, rule.operator) }}
      <AppSearchRuleValue
        :rule="rule"
        :item="filterItems[rule.field]"
        readonly
      />
      <button type="button" class="-mr-2 px-2" @click="emit('remove')">
        <font-awesome-icon :icon="faTimes" />
      </button>
    </template>
  </template>

  <div v-else class="flex items-center gap-2">
    <button
      class="-ml-2 p-2 leading-tight text-primary-80 hover:text-primary"
      type="button"
      @click="emit('remove')"
    >
      <font-awesome-icon :icon="faTimes" />
    </button>
    <div class="flex-1">
      {{ rule }}
      <div v-if="filterGroups.length > 1" class="-mx-2 mb-2">
        <AppToggle v-model="selectedFilterGroupId" :items="filterGroups" />
      </div>
      <component
        :is="selectedFilterGroup.custom"
        v-if="selectedFilterGroup?.custom"
        :rule="rule"
        @update:rule="emit('update:rule', $event)"
      />
      <AppSearchRuleFilterGroup
        v-else
        :rule="selectedFilterGroupId === ruleFilterGroupId ? rule : null"
        :filter-items="selectedFilterGroupItems"
        @update:rule="emit('update:rule', $event)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { type Rule } from '@beabee/beabee-common';
import AppSearchRuleValue from './AppSearchRuleValue.vue';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  operatorT,
  type SearchRuleEmits,
  type SearchRuleProps,
} from './search.interface';
import { ref } from 'vue';
import AppToggle from '@components/forms/AppToggle.vue';
import { watch } from 'vue';
import AppSearchRuleFilterGroup from './AppSearchRuleFilterGroup.vue';
import type { FilterItems } from '@type';

const emit = defineEmits<SearchRuleEmits>();
const props = defineProps<SearchRuleProps<Rule>>();

const selectedFilterGroupId = ref('');

const selectedFilterGroup = computed(() => {
  return props.filterGroups.find((g) => g.id === selectedFilterGroupId.value);
});

const selectedFilterGroupItems = computed(() => {
  const ret: FilterItems = {};
  selectedFilterGroup.value?.items.forEach((id) => {
    ret[id] = props.filterItems[id];
  });
  return ret;
});

const ruleFilterGroupId = computed(() => {
  return (
    props.rule &&
    props.filterGroups.find((g) => g.items.includes(props.rule!.field))?.id
  );
});

// Select the group of the current rule, or the first group
// watch(
//   ruleFilterGroupId,
//   (newGroupId) => {
//     selectedFilterGroupId.value = newGroupId || props.filterGroups[0].id;
//   },
//   { immediate: true }
// );
</script>
