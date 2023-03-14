<template>
  <form
    v-if="props.expanded"
    class="mt-2 mb-8 border border-primary-40 p-4"
    @submit.prevent="handleFormSubmit"
  >
    <h4 class="mb-3 font-semibold">
      {{ t('advancedSearch.createFilters') }}
    </h4>

    <div class="mb-3 flex items-center gap-2 text-sm text-body-80">
      <span>{{ t('advancedSearch.matchBefore') }}</span>
      <AppSelect
        v-model="selectedRuleGroup.condition"
        :items="[
          { id: 'AND', label: t('advancedSearch.matchType.AND') },
          { id: 'OR', label: t('advancedSearch.matchType.OR') },
        ]"
        input-class="font-bold uppercase"
      />
      <span>{{ t('advancedSearch.matchAfter') }}</span>
    </div>

    <div class="relative mb-8">
      <ul class="mb-3 text-sm">
        <li
          v-for="(_, i) in selectedRuleGroup.rules"
          :key="i"
          class="group relative -mx-4 gap-2 border-b border-primary-40 bg-primary-10 px-4 py-6 first:border-t"
        >
          <AppSearchRuleOrGroup
            v-model:rule="selectedRuleGroup.rules[i]"
            :filter-groups="filterGroups"
            :filter-items="filterItems"
            @remove="removeRule(i)"
          />
          <span
            class="absolute bottom-full left-1/2 z-10 -translate-x-1/2 translate-y-1/2 rounded bg-primary-70 px-2 py-1 font-bold uppercase text-white group-first:hidden"
            >{{
              t('advancedSearch.matchWord.' + selectedRuleGroup.condition)
            }}</span
          >
        </li>
      </ul>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <AppButton
          variant="primaryOutlined"
          icon="plus"
          size="xs"
          @click="addRule"
        >
          {{ t('advancedSearch.addRule') }}
        </AppButton>
      </div>
    </div>

    <div class="flex gap-2">
      <AppButton
        variant="link"
        :disabled="validation.$invalid || !hasChanged"
        type="submit"
      >
        {{ t('actions.search') }}
      </AppButton>
      <AppButton v-if="hasChanged" variant="text" @click="handleReset">
        {{ t('actions.reset') }}
      </AppButton>
    </div>
  </form>
  <ul
    v-else-if="modelValue && modelValue.rules.length > 0"
    class="my-4 flex flex-wrap items-center gap-2 text-sm text-body-80"
  >
    <template v-for="(rule, i) in modelValue.rules" :key="i">
      <li class="rounded-full border border-primary-70 px-2 py-1">
        <AppSearchRuleOrGroup
          :filter-groups="filterGroups"
          :filter-items="filterItems"
          :rule="rule"
          readonly
          @remove="removeRule(i)"
        />
      </li>
      <li class="font-bold uppercase last:hidden">
        {{ t('advancedSearch.matchWord.' + modelValue.condition) }}
      </li>
    </template>
  </ul>
</template>

<script lang="ts" setup>
import { RuleGroup } from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '../button/AppButton.vue';
import AppSelect from '../forms/AppSelect.vue';
import AppSearchRuleOrGroup from './AppSearchRuleOrGroup.vue';
import {
  FilterGroup,
  FilterItems,
  copyRuleGroup,
  isEqual,
  RuleGroupWithEmpty,
} from './search.interface';

const emit = defineEmits(['reset', 'update:modelValue']);
const props = defineProps<{
  filterItems: FilterItems;
  filterGroups: FilterGroup[];
  modelValue: RuleGroup | undefined;
  expanded: boolean;
  hasChanged: boolean;
}>();

const { t } = useI18n();
const validation = useVuelidate();

const selectedRuleGroup = reactive<RuleGroupWithEmpty>({
  condition: 'AND',
  rules: [null],
});

const hasChanged = computed(
  () =>
    props.hasChanged ||
    (props.modelValue
      ? !isEqual(props.modelValue, selectedRuleGroup)
      : selectedRuleGroup.rules.length > 1 ||
        selectedRuleGroup.rules[0] !== null)
);

function removeRule(i: number) {
  selectedRuleGroup.rules.splice(i, 1);
  if (props.expanded) {
    if (selectedRuleGroup.rules.length === 0) {
      addRule();
    }
  } else {
    handleFormSubmit();
  }
}

function addRule() {
  selectedRuleGroup.rules.push(null);
}

function reset() {
  const ruleGroup = props.modelValue
    ? copyRuleGroup(props.modelValue)
    : {
        condition: 'AND' as const,
        rules: [null],
      };
  selectedRuleGroup.condition = ruleGroup.condition;
  selectedRuleGroup.rules =
    ruleGroup.rules.length > 0 ? ruleGroup.rules : [null];
}

watch(() => props.modelValue, reset);
watch(
  () => props.expanded,
  (value) => {
    if (value) reset();
  }
);

function handleReset() {
  emit('reset');
  reset();
}

function handleFormSubmit() {
  emit('update:modelValue', selectedRuleGroup);
}
</script>
