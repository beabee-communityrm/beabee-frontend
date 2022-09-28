<template>
  <div class="flex">
    <label
      v-for="(period, index) in periods"
      :key="index"
      :for="period.name"
      class="relative flex-grow"
    >
      <input
        :id="period.name"
        v-model="value"
        type="radio"
        :name="period.name"
        :value="period.name"
        class="absolute -z-10 opacity-0"
        :checked="period.name === modelValue"
      />
      <span
        class="flex cursor-pointer items-center justify-center border border-primary-40 p-2.5 font-semibold"
        :class="[
          period.name === modelValue
            ? '!border-link-110 bg-link text-white'
            : 'hover:border-link hover:bg-link-10',
          period.name === 'monthly' ? 'rounded-l' : 'rounded-r',
        ]"
      >
        {{
          period.name === 'monthly' ? t('common.monthly') : t('common.annually')
        }}
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import { ContributionContent } from './contribution.interface';
import { computed } from 'vue';

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: ContributionPeriod;
  periods: ContributionContent['periods'];
}>();

const value = computed({
  get: () => props.modelValue,
  set: (newPeriod) => emit('update:modelValue', newPeriod),
});
</script>
