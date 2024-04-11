<template>
  <div class="mb-8">
    <div class="mb-2 flex gap-2">
      <slot></slot>
      <AppButton
        variant="primaryOutlined"
        size="sm"
        :icon="faFilter"
        class="bg-white/0"
        :class="showExpanded && 'relative rounded-b-none'"
        @click="showExpanded = !showExpanded"
      >
        {{ t('advancedSearch.button') }}
        <font-awesome-icon :icon="showExpanded ? faCaretUp : faCaretDown" />
        <div
          v-show="showExpanded || hasRules"
          class="absolute -left-px top-full box-content h-2 w-full border-x border-x-primary-40 bg-primary-5 py-px"
        />
      </AppButton>
    </div>

    <div
      v-if="showExpanded || hasRules"
      class="rounded border border-primary-40 p-4"
    >
      <AppSearchForm
        v-if="showExpanded"
        :model-value="modelValue"
        :filter-groups="filterGroups"
        :filter-items="filterItems"
        :has-changed="!!hasChanged"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <AppSearchSummary
        v-else-if="hasRules && modelValue /* narrow type */"
        :model-value="modelValue"
        :filter-groups="filterGroups"
        :filter-items="filterItems"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RuleGroup } from '@beabee/beabee-common';
import {
  faCaretDown,
  faCaretUp,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { computed, ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '../button/AppButton.vue';

import type { FilterGroups, FilterItems } from '@type';
import AppSearchForm from './AppSearchForm.vue';
import AppSearchSummary from './AppSearchSummary.vue';

const emit = defineEmits<{
  (e: 'update:modelValue', value: RuleGroup): void;
  (e: 'reset'): void;
}>();
const props = defineProps<{
  filterItems: FilterItems;
  filterGroups: FilterGroups;
  modelValue: RuleGroup | undefined;
  hasChanged?: boolean;
}>();

const { t } = useI18n();

const showExpanded = ref(false);

const hasRules = computed(
  () => props.modelValue && props.modelValue.rules.length > 0
);

// Switch back to summary view when rule group changes from outside
watch(toRef(props, 'modelValue'), () => {
  showExpanded.value = false;
});
</script>
