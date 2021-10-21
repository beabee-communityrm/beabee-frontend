<template>
  <div class="grid grid-cols-12 gap-x-6 font-bold">
    <label
      class="
        col-span-12
        md:col-span-8
        border border-link
        text-grey-dark
        rounded
        pl-4
        flex
        items-end
        whitespace-nowrap
        overflow-hidden
      "
      :class="errorClasses"
    >
      <span class="mb-6">{{ currencySign }}</span>

      <div class="px-2">
        <input
          v-model.number="signUpData.amount"
          :min="minAmount"
          :class="{ 'bg-danger-10': hasError }"
          class="
            amount
            w-full
            link
            border-0
            flex-grow
            font-bold
            outline-none
            text-link
          "
        />
      </div>

      <div class="pr-4 mb-6 ml-auto whitespace-nowrap">/ {{ period }}</div>

      <div class="flex flex-col h-full text-xs">
        <button
          class="amount-button border-l border-b"
          type="button"
          @click="signUpData.amount += 1"
        >
          ▲
        </button>

        <button
          class="amount-button border-l"
          type="button"
          :disabled="isButtonDisabled"
          :class="disableClasses"
          @click="signUpData.amount -= 1"
        >
          ▼
        </button>
      </div>
    </label>

    <div
      class="
        col-span-12
        md:col-span-4
        my-6
        md:my-0
        grid grid-cols-3
        md:grid-cols-1
        border border-link
        rounded
        overflow-hidden
      "
    >
      <AppButton
        v-for="(amount, index) in definedAmounts"
        :key="index"
        :variant="amount === signUpData.amount ? 'link' : 'linkOutlined'"
        class="group-button"
        @click="signUpData.amount = amount"
        >{{ n(amount, 'currency') }}</AppButton
      >
    </div>

    <div
      v-if="hasError"
      class="text-sm text-danger font-semibold mt-0 md:mt-1.5 col-span-12"
      role="alert"
    >
      {{ t('join.minimumContribution') }}
      {{ n(minAmount, 'currency') }} / {{ period }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppButton from '../../../components/forms/AppButton.vue';
import { computed } from '@vue/reactivity';
import { useJoin } from './../use-join';
import { useI18n } from 'vue-i18n';

const { t, n, getNumberFormat, locale } = useI18n();

const { isBelowThreshold, signUpData, definedAmounts, isMonthly, minAmount } =
  useJoin();

const hasError = computed(() => isBelowThreshold.value);

const isButtonDisabled = computed(() => signUpData.amount <= minAmount.value);

// hacky way to get the currency sign because
// setting `part` to `true` threw an error:
// n(100, { key: 'currency', part: true })
const currencySign = computed(() => {
  const { style, currency } = getNumberFormat(locale.value).currency;

  let formatter = new Intl.NumberFormat(locale.value, {
    style,
    currency,
  });

  const currencySignObject = formatter
    .formatToParts(0)
    .find((item) => item.type === 'currency');

  return currencySignObject?.value;
});

const disableClasses = computed(() => {
  return isButtonDisabled.value
    ? 'cursor-not-allowed text-grey disabled'
    : null;
});

const errorClasses = computed(() => {
  return hasError.value ? 'border-danger bg-danger-10' : null;
});

const period = computed(() => {
  return isMonthly.value ? t('common.month') : t('common.year');
});
</script>

<style scoped>
.amount {
  font-size: 5rem;
}

.disabled {
  @apply hover:text-grey;
}

.amount-button {
  @apply h-1/2 bg-white py-2 px-4 hover:text-link;
}

.group-button {
  @apply border-none;
  @apply rounded-none !important;
}

/* group button */
.group-button:nth-child(2) {
  border-left: 1px solid var(--link-color);
  border-right: 1px solid var(--link-color);
}

@media screen and (min-width: 768px) {
  .group-button:nth-child(2) {
    border: none;
    border-bottom: 1px solid var(--link-color);
    border-top: 1px solid var(--link-color);
  }
}
</style>
