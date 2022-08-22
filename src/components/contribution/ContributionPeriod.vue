<template>
  <div class="flex">
    <label
      v-for="(period, index) in periods"
      :key="index"
      :for="period.name"
      class="flex-grow relative"
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
          p-2.5
          cursor-pointer
          border border-primary-40
        "
        :class="[
          period.name === modelValue
            ? 'bg-link-10 !border-link text-link'
            : 'hover:text-link-110',
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
