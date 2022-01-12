<template>
  <ContributionPeriod_
    v-if="showPeriod"
    class="mb-6"
    :periods="content.periods"
    :selected-period="contribution.period"
    @change-period="changePeriod"
  />

  <ContributionAmount
    v-model.number="contribution.amount"
    :is-monthly="isMonthly"
    :min-amount="minAmount"
    :defined-amounts="definedAmounts"
    class="mb-5"
  />

  <!-- TODO: Needed for join form, can we rework UI? -->
  <slot></slot>

  <ContributionFee
    v-if="isMonthly"
    v-model="contribution.payFee"
    :amount="contribution.amount"
    :fee="contribution.fee"
    :force="shouldForceFee"
  />
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import ContributionPeriod_ from './ContributionPeriod.vue';
import ContributionAmount from './ContributionAmount.vue';
import ContributionFee from './ContributionFee.vue';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import {
  ContributionContent,
  ContributionData,
} from './contribution.interface';

const props = withDefaults(
  defineProps<{
    modelValue: ContributionData;
    content: ContributionContent;
    showPeriod?: boolean;
    isValid?: boolean;
  }>(),
  { showPeriod: true }
);

const emit = defineEmits(['update:modelValue', 'update:isValid']);

const contribution = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isMonthly = computed(
  () => contribution.value.period === ContributionPeriod.Monthly
);

const definedAmounts = computed(() => {
  const selectedPeriod = props.content.periods.find((period) => {
    return period.name === contribution.value.period;
  });
  return selectedPeriod?.presetAmounts as number[];
});

const minAmount = computed(() => {
  const { minMonthlyAmount } = props.content;
  return isMonthly.value ? minMonthlyAmount : minMonthlyAmount * 12;
});

const changePeriod = (period: ContributionPeriod) => {
  contribution.value.period = period;
  // reset the selected amount after period change
  contribution.value.amount = definedAmounts.value[0];
};

const shouldForceFee = computed(() => {
  return (
    props.content.showAbsorbFee &&
    contribution.value.amount === 1 &&
    isMonthly.value
  );
});
watch(shouldForceFee, (force) => {
  if (force) contribution.value.payFee = true;
});

watch(
  () => contribution.value.amount >= minAmount.value,
  (isValid) => emit('update:isValid', isValid),
  { immediate: true }
);
</script>
