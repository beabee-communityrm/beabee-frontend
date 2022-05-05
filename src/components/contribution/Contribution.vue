<template>
  <ContributionPeriod_
    v-if="showPeriod"
    v-model="periodProxy"
    class="mb-5"
    :periods="content.periods"
  />

  <ContributionAmount
    v-model.number="amountProxy"
    :is-monthly="isMonthly"
    :min-amount="minAmount"
    :defined-amounts="definedAmounts"
    class="mb-5"
  />

  <!-- TODO: Needed for join form, can we rework UI? -->
  <slot></slot>

  <ContributionFee
    v-if="isMonthly && content.showAbsorbFee"
    v-model="payFeeProxy"
    :amount="amountProxy"
    :fee="fee"
    :force="shouldForceFee"
  />
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import ContributionPeriod_ from './ContributionPeriod.vue';
import ContributionAmount from './ContributionAmount.vue';
import ContributionFee from './ContributionFee.vue';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import { ContributionContent } from './contribution.interface';

const props = withDefaults(
  defineProps<{
    amount: number;
    period: ContributionPeriod;
    payFee: boolean;
    fee: number;
    content: ContributionContent;
    showPeriod?: boolean;
  }>(),
  { showPeriod: true }
);

const emit = defineEmits(['update:amount', 'update:period', 'update:payFee']);

const amountProxy = computed({
  get: () => props.amount,
  set: (amount) => emit('update:amount', amount),
});

const periodProxy = computed({
  get: () => props.period,
  set: (period) => emit('update:period', period),
});

const payFeeProxy = computed({
  get: () => props.payFee,
  set: (payFee) => emit('update:payFee', payFee),
});

const isMonthly = computed(
  () => periodProxy.value === ContributionPeriod.Monthly
);

const minAmount = computed(() => {
  const { minMonthlyAmount } = props.content;
  return isMonthly.value ? minMonthlyAmount : minMonthlyAmount * 12;
});

const definedAmounts = computed(() => {
  const selectedPeriod = props.content.periods.find((period) => {
    return period.name === periodProxy.value;
  });
  return selectedPeriod?.presetAmounts as number[];
});

watch(periodProxy, () => {
  amountProxy.value = definedAmounts.value[0];
});

const shouldForceFee = computed(() => {
  return (
    props.content.showAbsorbFee && amountProxy.value === 1 && isMonthly.value
  );
});
watch(shouldForceFee, (force) => {
  if (force) payFeeProxy.value = true;
});
</script>
