<template>
  <template v-if="readonly">
    <component
      :is="selectedFilterGroup.custom || AppSearchRuleFilterGroup"
      v-if="selectedFilterGroup"
      :filter-group="selectedFilterGroup"
      :rule="rule"
      readonly
      @remove="emit('remove')"
    />
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
      <div v-if="filterGroups.length > 1" class="-mx-2 mb-2">
        <AppToggle v-model="selectedFilterGroupId" :items="filterGroups" />
      </div>

      <component
        :is="selectedFilterGroup.custom || AppSearchRuleFilterGroup"
        v-if="selectedFilterGroup"
        :filter-group="selectedFilterGroup"
        :rule="rule"
        @update:rule="emit('update:rule', $event)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, watchEffect } from 'vue';
import { type Rule } from '@beabee/beabee-common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { SearchRuleEmits, SearchRuleProps } from './search.interface';
import { ref } from 'vue';
import AppToggle from '@components/forms/AppToggle.vue';
import AppSearchRuleFilterGroup from './AppSearchRuleFilterGroup.vue';

const emit = defineEmits<SearchRuleEmits>();
const props = defineProps<SearchRuleProps<Rule>>();

const selectedFilterGroupId = ref('');

const selectedFilterGroup = computed(() => {
  return props.filterGroups.find((g) => g.id === selectedFilterGroupId.value);
});

// Select the group of the current rule, or the first group
watchEffect(() => {
  let groupId = props.filterGroups[0].id;

  if (props.rule) {
    for (const group of props.filterGroups) {
      if (
        group.items[props.rule.field] ||
        group.itemsMatch?.test(props.rule.field)
      ) {
        groupId = group.id;
        break;
      }
    }
  }

  selectedFilterGroupId.value = groupId;
});
</script>
