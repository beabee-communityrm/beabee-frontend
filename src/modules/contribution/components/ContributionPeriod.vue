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
        type="radio"
        :name="period.name"
        :value="period.name"
        class="absolute opacity-0 -z-1"
        :checked="period.name === selectedPeriod"
        @change="changePeriod(handleInput($event))"
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
        :class="{
          'bg-secondary-10 text-secondary': period.name === selectedPeriod,
        }"
      >
        {{
          period.name === 'monthly' ? t('common.monthly') : t('common.annually')
        }}
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import handleInput from '../../../utils/handle-input';
import { useI18n } from 'vue-i18n';
import { Periods } from '../contribution.interface';

const { t } = useI18n();

const emit = defineEmits(['changePeriod']);

defineProps({
  periods: {
    type: Array as () => Periods[],
    required: true,
  },
  selectedPeriod: {
    type: String,
    required: true,
  },
});

const changePeriod = (period: string) => {
  emit('changePeriod', period);
};
</script>
