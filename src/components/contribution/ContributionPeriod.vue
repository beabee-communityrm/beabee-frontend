<template>
  <div class="flex border rounded divide-x divide-primary-40 border-primary-40">
    <label
      v-for="(period, index) in periods"
      :key="index"
      :for="period.name"
      class="flex-grow relative bg-white"
    >
      <input
        :id="period.name"
        v-model="value"
        type="radio"
        :name="period.name"
        :value="period.name"
        class="absolute opacity-0 -z-10"
        :checked="period.name === modelValue"
      />
      <span
        class="
          flex
          justify-center
          items-center
          font-semibold
          h-10
          cursor-pointer
        "
        :class="
          period.name === modelValue ? 'bg-link text-white' : 'hover:bg-link-10'
        "
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
